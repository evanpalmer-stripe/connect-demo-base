import React from 'react';
import { useOnboardingSettings } from '../contexts';

const SettingsOnboarding = () => {
  const { onboarding, updateOnboarding } = useOnboardingSettings();

  const accountTypeOptions = [
    { 
      value: 'standard', 
      label: 'Standard',
      description: 'Full-featured account with complete customization'
    },
    { 
      value: 'express', 
      label: 'Express',
      description: 'Quick setup with streamlined onboarding'
    },
    { 
      value: 'custom', 
      label: 'Custom',
      description: 'Tailored experience for your specific needs'
    }
  ];

  const onboardingFlowOptions = [
    { 
      value: 'Hosted', 
      label: 'Hosted',
      description: 'Redirect users to Stripe-hosted onboarding pages'
    },
    { 
      value: 'Embedded', 
      label: 'Embedded',
      description: 'Embed Stripe components directly in your application'
    },
    { 
      value: 'API', 
      label: 'API',
      description: 'Build custom onboarding using Stripe API endpoints'
    }
  ];


  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Account Type - Left Column */}
      <div className="form-group">
        <label className="form-label">
          Account Type
        </label>
        <div className="card-group">
          {accountTypeOptions.map((option) => (
            <label key={option.value} className={`card-option ${onboarding.accountType === option.value ? 'card-option-selected' : 'card-option-unselected'}`}>
              <input
                type="radio"
                name="accountType"
                value={option.value}
                checked={onboarding.accountType === option.value}
                onChange={(e) => updateOnboarding({ accountType: e.target.value })}
                className="card-option-input"
              />
              <div className="card-option-content">
                <div>
                  <div className="card-option-label">{option.label}</div>
                  <div className="card-option-description">{option.description}</div>
                </div>
                <div className={`card-option-indicator ${onboarding.accountType === option.value ? 'card-option-indicator-selected' : 'card-option-indicator-unselected'}`}>
                  {onboarding.accountType === option.value && <div className="card-option-indicator-dot"></div>}
                </div>
              </div>
            </label>
          ))}
        </div>
        <p className="form-help">
          Choose the type of Stripe Connect account to create
        </p>
      </div>
      
      {/* Onboarding Flow - Right Column */}
      <div className="form-group">
        <label className="form-label">
          Onboarding Flow
        </label>
        <div className="card-group">
          {onboardingFlowOptions.map((option) => (
            <label key={option.value} className={`card-option ${onboarding.onboardingFlow === option.value ? 'card-option-selected' : 'card-option-unselected'}`}>
              <input
                type="radio"
                name="onboardingFlow"
                value={option.value}
                checked={onboarding.onboardingFlow === option.value}
                onChange={(e) => updateOnboarding({ onboardingFlow: e.target.value })}
                className="card-option-input"
              />
              <div className="card-option-content">
                <div>
                  <div className="card-option-label">{option.label}</div>
                  <div className="card-option-description">{option.description}</div>
                </div>
                <div className={`card-option-indicator ${onboarding.onboardingFlow === option.value ? 'card-option-indicator-selected' : 'card-option-indicator-unselected'}`}>
                  {onboarding.onboardingFlow === option.value && <div className="card-option-indicator-dot"></div>}
                </div>
              </div>
            </label>
          ))}
        </div>
        <p className="form-help">
          Choose how the onboarding process will be presented to users
        </p>
      </div>
    </div>
  );
};

export default SettingsOnboarding;
