import React from 'react';
import { useState, useEffect, useRef } from "react";
import { loadConnectAndInitialize } from "@stripe/connect-js";
import {
  ConnectAccountOnboarding,
  ConnectComponentsProvider,
} from "@stripe/react-connect-js";
import { useGeneralSettings } from '../contexts/SettingsContext';

export const useStripeConnect = () => {
  const [stripeConnectInstance, setStripeConnectInstance] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { general } = useGeneralSettings();
  const isInitialized = useRef(false);

  useEffect(() => { 
    // Prevent multiple initializations using useRef
    if (isInitialized.current || !general.publishableKey) {
      return;
    }

    const fetchClientSecret = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
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
        setError(err.message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    };

    isInitialized.current = true;
    
    try {
      setStripeConnectInstance(
        loadConnectAndInitialize({
          publishableKey: general.publishableKey,
          fetchClientSecret,
          appearance: {
            overlays: "dialog",
            variables: {
              colorPrimary: "#635BFF",
            },
          },
        })
      );
    } catch (err) {
      console.error('Failed to initialize Stripe Connect:', err);
      setError(err.message);
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

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
      <div className="text-center">
        <div className="text-green-600 font-medium mb-2">
          🎯 Embedded Onboarding Flow
        </div>
        <div className="text-green-800 text-sm mb-3">
          Embed Stripe components directly in your application
        </div>
        <div className="text-green-600 text-xs">
          This flow will embed Stripe's onboarding components within your app
        </div>

        <div className="content">
          {stripeConnectInstance && (
            <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
              <ConnectAccountOnboarding
                onExit={() => setOnboardingExited(true)}
              />
            </ConnectComponentsProvider>
          )}
          {onboardingExited && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800">The Account Onboarding component has exited</p>
            </div>
          )}
          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-gray-700 text-sm">
              This is a sample app for Connect onboarding using the Account Onboarding embedded component. <a href="https://docs.stripe.com/connect/onboarding/quickstart?connect-onboarding-surface=embedded" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">View docs</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingEmbedded;
