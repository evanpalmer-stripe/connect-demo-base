import React from 'react';
import { useOnboardingSettings } from '../contexts';
import OnboardingHosted from './OnboardingHosted';
import OnboardingEmbedded from './OnboardingEmbedded';
import OnboardingAPI from './OnboardingAPI';

const Onboarding = () => {
  const { onboarding } = useOnboardingSettings();

  const renderOnboardingFlow = () => {
    switch (onboarding.onboardingFlow) {
      case 'Hosted':
        return <OnboardingHosted />;
      case 'Embedded':
        return <OnboardingEmbedded />;
      case 'API':
        return <OnboardingAPI />;
      default:
        return <OnboardingHosted />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-medium text-gray-900 mb-2">
          Stripe Connect Onboarding
        </h3>
        <p className="text-gray-600">
          Current flow: <span className="font-medium text-gray-800">{onboarding.onboardingFlow}</span>
        </p>
        <p className="text-gray-500 text-sm mt-1">
          Configure your onboarding flow using the control panel settings
        </p>
      </div>
      
      {renderOnboardingFlow()}
    </div>
  );
};

export default Onboarding;
