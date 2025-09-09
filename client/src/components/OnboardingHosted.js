import React, { useEffect, useRef } from 'react';

const OnboardingHosted = () => {
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Prevent multiple redirects in React Strict Mode
    if (hasRedirected.current) {
      return;
    }

    const fetchRedirectUrl = async () => {
      try {
        hasRedirected.current = true;
        const response = await fetch('/api/onboarding/hosted');
        const data = await response.json();
        
        if (data.success && data.redirectUrl) {
          window.location.href = data.redirectUrl;
        } else {
          console.error('Failed to get redirect URL:', data.error);
        }
      } catch (error) {
        console.error('Error fetching redirect URL:', error);
        // Reset the flag on error so it can be retried
        hasRedirected.current = false;
      }
    };

    fetchRedirectUrl();
  }, []);

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
