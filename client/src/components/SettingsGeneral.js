import React, { useState, useEffect, useCallback } from 'react';
import { useGeneralSettings } from '../contexts';

const SettingsGeneral = () => {
  const { general, updateGeneral } = useGeneralSettings();
  const [isVerifying, setIsVerifying] = useState(false);

  // Function to verify account credentials
  const verifyAccount = useCallback(async () => {
    if (!general.publishableKey || !general.secretKey) {
      return;
    }

    setIsVerifying(true);
    try {
      const response = await fetch('/api/settings/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          publishableKey: general.publishableKey,
          secretKey: general.secretKey,
          userId: 'default',
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        updateGeneral({ isVerified: data.isVerified });
      } else {
        updateGeneral({ isVerified: false });
        console.error('Verification failed:', data.error);
      }
    } catch (error) {
      console.error('Error verifying account:', error);
      updateGeneral({ isVerified: false });
    } finally {
      setIsVerifying(false);
    }
  }, [general.publishableKey, general.secretKey, updateGeneral]);

  // Auto-verify when keys change
  useEffect(() => {
    if (general.publishableKey && general.secretKey) {
      const timeoutId = setTimeout(() => {
        verifyAccount();
      }, 1000); // Debounce verification by 1 second

      return () => clearTimeout(timeoutId);
    } else {
      // Reset verification status if keys are empty
      updateGeneral({ isVerified: false });
    }
  }, [general.publishableKey, general.secretKey, updateGeneral, verifyAccount]);

  return (
    <div className="space-y-6">
      {/* Verification Status */}
      <div className="flex items-center justify-between p-4 rounded-lg">
        <div className="flex items-center space-x-3">
          <span className={`badge ${general.isVerified ? 'badge-success' : 'badge-error'}`}>
            {isVerifying ? (
              <>
                <svg className="w-4 h-4 mr-1 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </>
            ) : general.isVerified ? (
              <>
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Verified
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Unverified
              </>
            )}
          </span>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">
          Publishable Key
        </label>
        <input
          type="text"
          value={general.publishableKey}
          onChange={(e) => updateGeneral({ publishableKey: e.target.value })}
          placeholder="pk_test_..."
          className="input"
        />
        <p className="form-help">
          Your Stripe publishable key (starts with pk_test_ or pk_live_)
        </p>
      </div>
      
      <div className="form-group">
        <label className="form-label">
          Secret Key
        </label>
        <input
          type="password"
          value={general.secretKey}
          onChange={(e) => updateGeneral({ secretKey: e.target.value })}
          placeholder="sk_test_..."
          className="input"
        />
        <p className="form-help">
          Your Stripe secret key (starts with sk_test_ or sk_live_)
        </p>
      </div>
    </div>
  );
};

export default SettingsGeneral;
