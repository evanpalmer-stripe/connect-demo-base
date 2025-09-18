import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useEmailSubmission } from '../hooks/useEmailSubmission';
import StatusDisplay from './StatusDisplay';
import EmailCaptureForm from './EmailCaptureForm';

const OnboardingHosted = () => {
  const { email, setEmail, emailSubmitted, emailError, accountId, handleEmailSubmit } = useEmailSubmission();
  const { accountId: urlAccountId } = useParams();
  const [searchParams] = useSearchParams();
  const [redirectStatus, setRedirectStatus] = useState(null);

  // Check for redirect response on component mount
  useEffect(() => {
    const status = searchParams.get('status');
    if (urlAccountId && status && (status === 'return' || status === 'refresh')) {
      setRedirectStatus(status);
    }
  }, [urlAccountId, searchParams]);

  // Redirect to hosted onboarding after account creation
  useEffect(() => {
    if (emailSubmitted && accountId && !redirectStatus) {
      const apiBaseUrl = process.env.REACT_APP_SERVER_BASE_URL || 'http://localhost:5000';
      window.location.href = `${apiBaseUrl}/api/onboarding/hosted?account_id=${accountId}`;
    }
  }, [emailSubmitted, accountId, redirectStatus]);

  // Handle redirect response
  if (redirectStatus === 'return') {
    return (
      <StatusDisplay 
        type="success" 
        title="✅ Onboarding Completed"
        message={`Account ${urlAccountId} has successfully completed the hosted onboarding process!`}
      >
        <div className="mt-4 text-sm text-gray-600">
          The user has returned from the hosted onboarding flow and completed all required steps.
        </div>
      </StatusDisplay>
    );
  } else if (redirectStatus === 'refresh') {
    return (
      <StatusDisplay 
        type="warning" 
        title="🔄 Onboarding Refresh Required"
        message={`Account ${urlAccountId} needs to refresh their onboarding information.`}
      >
        <div className="mt-4 text-sm text-gray-600">
          The user has been redirected back to update or complete their onboarding information.
        </div>
      </StatusDisplay>
    );
  }

  // Email collection form
  if (!emailSubmitted) {
    return (
      <StatusDisplay 
        type="success" 
        title="🚀 Hosted Onboarding Flow"
        message="Please enter your email address to begin the hosted onboarding process"
      >
        <EmailCaptureForm
          email={email}
          setEmail={setEmail}
          emailError={emailError}
          handleEmailSubmit={handleEmailSubmit}
          buttonText="Continue to Hosted Onboarding"
        />
      </StatusDisplay>
    );
  }

  // Show loading state while redirecting
  return (
    <StatusDisplay 
      type="info" 
      title="🚀 Redirecting to Hosted Onboarding"
      message="Please wait while we redirect you to Stripe's hosted onboarding experience..."
    />
  );
};

export default OnboardingHosted;
