import React from 'react';
import { useState, useEffect } from "react";
import { loadConnectAndInitialize } from "@stripe/connect-js";
import {
  ConnectAccountOnboarding,
  ConnectComponentsProvider,
} from "@stripe/react-connect-js";
import { useGeneralSettings } from '../contexts/SettingsContext';

export const useStripeConnect = () => {
  const [stripeConnectInstance, setStripeConnectInstance] = useState();
  const { general } = useGeneralSettings();

  useEffect(() => { 
    const fetchClientSecret = async () => {
      const response = await fetch("/api/onboarding/embedded", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        // Handle errors on the client side here
        const { error } = await response.json();
        throw ("An error occurred: ", error);
      } else {
        const { client_secret: clientSecret } = await response.json();
        return clientSecret;
      }
    };

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
  }, [general.publishableKey]); //TODO: this should probably update when anything in the settings changes

  return stripeConnectInstance;
};

const OnboardingEmbedded = () => {
  const [onboardingExited, setOnboardingExited] = useState(false);
  const [error, setError] = useState(false);
  const stripeConnectInstance = useStripeConnect(); // Add this line!

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
          {error && <p className="error">Something went wrong!</p>}
          {( onboardingExited) && (
            <div className="dev-callout">
              {onboardingExited && <p>The Account Onboarding component has exited</p>}
            </div>
          )}
          <div className="info-callout">
            <p>
              This is a sample app for Connect onboarding using the Account Onboarding embedded component. <a href="https://docs.stripe.com/connect/onboarding/quickstart?connect-onboarding-surface=embedded" target="_blank" rel="noopener noreferrer">View docs</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingEmbedded;
