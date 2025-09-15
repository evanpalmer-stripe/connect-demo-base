import React, { useState, useEffect, useRef, useCallback } from "react";
import { loadConnectAndInitialize } from "@stripe/connect-js";
import { ConnectAccountOnboarding, ConnectComponentsProvider } from "@stripe/react-connect-js";
import { useGeneralSettings } from '../contexts/SettingsContext';
import StatusDisplay from './StatusDisplay';

// Custom hook for Stripe Connect
export const useStripeConnect = (accountId) => {
  const [stripeConnectInstance, setStripeConnectInstance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { general } = useGeneralSettings();
  const isInitialized = useRef(false);

  const fetchClientSecret = useCallback(async () => {
    const response = await fetch(`/api/onboarding/embedded?account_id=${accountId}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch client secret');
    }
    const { client_secret: clientSecret } = await response.json();
    return clientSecret;
  }, [accountId]);

  useEffect(() => { 
    if (isInitialized.current || !general.publishableKey || !accountId) return;

    isInitialized.current = true;
    setIsLoading(true);
    setError(null);
    
    const initializeConnect = async () => {
      try {
        const connectInstance = loadConnectAndInitialize({
          publishableKey: general.publishableKey,
          fetchClientSecret,
          appearance: { variables: {  } },
        });
        
        setStripeConnectInstance(connectInstance);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    initializeConnect();

    // Cleanup function
    return () => {
      isInitialized.current = false;
    };
  }, [general.publishableKey, accountId, fetchClientSecret]);

  return { stripeConnectInstance, isLoading, error };
};

// Email handling hook
const useEmailSubmission = () => {
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [accountId, setAccountId] = useState(null);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');
    
    if (!email.trim()) {
      setEmailError('Please enter an email address');
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    try {
      const response = await fetch('/api/onboarding/create-account-with-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        setEmailError(errorData.error || 'Failed to create account');
        return;
      }
      
      const data = await response.json();
      setAccountId(data.id);
      setEmailSubmitted(true);
    } catch (error) {
      setEmailError('Failed to create account. Please try again.');
    }
  };

  return { email, setEmail, emailSubmitted, emailError, accountId, handleEmailSubmit };
};

const OnboardingEmbedded = () => {
  const { email, setEmail, emailSubmitted, emailError, accountId, handleEmailSubmit } = useEmailSubmission();
  const { stripeConnectInstance, isLoading, error } = useStripeConnect(accountId);

  // Email collection form
  if (!emailSubmitted) {
    return (
      <StatusDisplay 
        type="success" 
        title="🎯 Embedded Onboarding Flow"
        message="Please enter your email address to begin the onboarding process"
      >
        <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto mt-6">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`input input-md ${emailError ? 'input-error' : ''}`}
              placeholder="Enter your email address"
              required
            />
            {emailError && (
              <p className="form-error">{emailError}</p>
            )}
          </div>
          
          <button type="submit" className="btn btn-primary btn-md w-full">
            Continue to Onboarding
          </button>
        </form>
      </StatusDisplay>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <StatusDisplay 
        type="success" 
        title="🎯 Embedded Onboarding Flow"
        message="Loading Stripe Connect..."
      />
    );
  }

  // Error state
  if (error) {
    return (
      <StatusDisplay 
        type="error" 
        title="❌ Error Loading Onboarding"
        message={error}
      >
        <div className="form-error text-xs mt-3">
          Please check your Stripe API keys in the settings
        </div>
      </StatusDisplay>
    );
  }

  // Not initialized state
  if (!stripeConnectInstance) {
    return (
      <StatusDisplay 
        type="warning" 
        title="⏳ Initializing Stripe Connect"
        message="Setting up the Connect instance..."
      />
    );
  }

  // Main onboarding component
  return (
    <StatusDisplay 
      type="success" 
      title="🎯 Embedded Onboarding Flow"
      message={`Onboarding for: ${email}`}
    >
      <div className="mt-4" style={{ 
        position: 'relative', 
        zIndex: 1,
        minHeight: '400px',
        width: '100%'
      }}>
        <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
          <ConnectAccountOnboarding
            onExit={() => console.log("The account has exited onboarding")}
          />
        </ConnectComponentsProvider>
      </div>
    </StatusDisplay>
  );
};

export default OnboardingEmbedded;
