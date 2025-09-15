import React from 'react';
import { useOnboardingSettings } from '../contexts';
import OnboardingHosted from './OnboardingHosted';
import OnboardingEmbedded from './OnboardingEmbedded';
import OnboardingAPI from './OnboardingAPI';

const Onboarding = () => {
  const { onboarding } = useOnboardingSettings();

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
