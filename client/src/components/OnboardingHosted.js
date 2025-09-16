import React, { useEffect, useRef } from 'react';

const OnboardingHosted = () => {
  const hasRedirected = useRef(false);

    if (hasRedirected.current) return;

    hasRedirected.current = true;
    const apiBaseUrl = process.env.REACT_APP_SERVER_BASE_URL;
    window.location.href = `${apiBaseUrl}/api/onboarding/hosted`;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <div className="text-center">
        <div className="text-blue-600 font-medium mb-2">
          🚀 Hosted Onboarding Flow
        </div>
        <div className="text-blue-800 text-sm mb-3">
          Redirect users to Stripe-hosted onboarding pages
        </div>
        <div className="text-blue-600 text-xs">
          This flow will redirect users to Stripe's hosted onboarding experience
        </div>
      </div>
    </div>
  );
};

export default OnboardingHosted;
