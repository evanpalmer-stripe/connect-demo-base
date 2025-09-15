import React from 'react';
import { useState, useEffect, useRef } from "react";
import { loadConnectAndInitialize } from "@stripe/connect-js";
import { ConnectAccountOnboarding, ConnectComponentsProvider } from "@stripe/react-connect-js";
import { useGeneralSettings } from '../contexts/SettingsContext';

export const useStripeConnect = () => {
  const [stripeConnectInstance, setStripeConnectInstance] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { general } = useGeneralSettings();
  const isInitialized = useRef(false);

  useEffect(() => { 
    if (isInitialized.current || !general.publishableKey) {
      return;
    }

    const fetchClientSecret = async () => {
      try {
        const response = await fetch("/api/onboarding/embedded", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Failed to fetch client secret:', errorData);
          throw new Error(errorData.error || 'Failed to fetch client secret');
        }
        
        const { client_secret: clientSecret } = await response.json();
        return clientSecret;
      } catch (err) {
        console.error('Error fetching client secret:', err);
        throw err;
      }
    };

    isInitialized.current = true;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Initialize Stripe Connect JS - it will handle client secret fetching internally
      const connectInstance = loadConnectAndInitialize({
        publishableKey: general.publishableKey,
        fetchClientSecret: fetchClientSecret,
        appearance: {
          variables: {
            colorPrimary: '#625afa',
          },
        },
      });
      
      // The instance is ready immediately, but the client secret will be fetched when needed
      setStripeConnectInstance(connectInstance);
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to initialize Stripe Connect:', err);
      setError(err.message);
      setIsLoading(false);
    }
  }, [general.publishableKey]);

  return { stripeConnectInstance, isLoading, error };
};

const OnboardingEmbedded = () => {
  const [onboardingExited, setOnboardingExited] = useState(false);
  const { stripeConnectInstance, isLoading, error } = useStripeConnect();
  const { general } = useGeneralSettings();

  console.log('Client - Publishable Key being used:', general.publishableKey ? `${general.publishableKey.substring(0, 10)}...` : 'NOT SET');

  if (isLoading) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="text-center">
          <div className="text-green-600 font-medium mb-2">
            🎯 Embedded Onboarding Flow
          </div>
          <div className="text-gray-600">Loading Stripe Connect...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="text-center">
          <div className="text-red-600 font-medium mb-2">
            ❌ Error Loading Onboarding
          </div>
          <div className="text-red-800 text-sm mb-3">
            {error}
          </div>
          <div className="text-red-600 text-xs">
            Please check your Stripe API keys in the settings
          </div>
        </div>
      </div>
    );
  }

  if (!stripeConnectInstance) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="text-center">
          <div className="text-yellow-600 font-medium mb-2">
            ⏳ Initializing Stripe Connect
          </div>
          <div className="text-gray-600">Setting up the Connect instance...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
      <div className="text-center mb-4">
        <div className="text-green-600 font-medium mb-2">
          🎯 Embedded Onboarding Flow
        </div>
      </div>

      <div className="onboarding-container" style={{ 
        position: 'relative', 
        zIndex: 1,
        minHeight: '400px',
        width: '100%'
      }}>
        <ConnectComponentsProvider 
          connectInstance={stripeConnectInstance}
        >
          <ConnectAccountOnboarding
            onExit={() => {
              console.log("The account has exited onboarding");
              setOnboardingExited(true);
            }}
            // Optional: make sure to follow our policy instructions above
            // fullTermsOfServiceUrl="{{URL}}"
            // recipientTermsOfServiceUrl="{{URL}}"
            // privacyPolicyUrl="{{URL}}"
            // skipTermsOfServiceCollection={false}
            // collectionOptions={{
            //   fields: 'eventually_due',
            //   futureRequirements: 'include',
            // }}
            // onStepChange={(stepChange) => {
            //   console.log(`User entered: ${stepChange.step}`);
            // }}
          />
        </ConnectComponentsProvider>
      </div>
    </div>
  );
};

export default OnboardingEmbedded;
