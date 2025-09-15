import React from 'react';
import { useOnboardingSettings, useSettings } from '../contexts';
import OnboardingHosted from './OnboardingHosted';
import OnboardingEmbedded from './OnboardingEmbedded';
import OnboardingAPI from './OnboardingAPI';

const Onboarding = () => {
  const { onboarding } = useOnboardingSettings();
  const { settings } = useSettings();

  // Wait for settings to load before rendering
  if (settings.isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-gray-600">Loading onboarding settings...</div>
        </div>
      </div>
    );
  }

  const renderOnboardingFlow = () => {
    switch (onboarding.onboardingFlow) {
      case 'hosted':
        return <OnboardingHosted />;
      case 'embedded':
        return <OnboardingEmbedded />;
      case 'api':
        return <OnboardingAPI />;
      default:
        return <OnboardingHosted />;
    }
  };

  return (
    <div className="space-y-6">      
      {renderOnboardingFlow()}
    </div>
  );
};

export default Onboarding;
