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
        updateGeneral({ isVerified: data.isVerified, accountId: data.accountId });
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
          {general.isVerified && (
            <h3>{general.accountId}</h3>
          )}
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

      <div className="form-group">
        <label className="form-label">
          Connected Account Country
        </label>
        <select
          value={general.connectedAccountCountry || 'AU'}
          onChange={(e) => updateGeneral({ connectedAccountCountry: e.target.value })}
          className="input"
        >
          <option value="">Select Country</option>
          <option value="AE">AE - United Arab Emirates</option>
          <option value="AR">AR - Argentina</option>
          <option value="AT">AT - Austria</option>
          <option value="AU">AU - Australia</option>
          <option value="BE">BE - Belgium</option>
          <option value="BG">BG - Bulgaria</option>
          <option value="BR">BR - Brazil</option>
          <option value="CA">CA - Canada</option>
          <option value="CH">CH - Switzerland</option>
          <option value="CL">CL - Chile</option>
          <option value="CO">CO - Colombia</option>
          <option value="CY">CY - Cyprus</option>
          <option value="CZ">CZ - Czech Republic</option>
          <option value="DE">DE - Germany</option>
          <option value="DK">DK - Denmark</option>
          <option value="DZ">DZ - Algeria</option>
          <option value="EG">EG - Egypt</option>
          <option value="EE">EE - Estonia</option>
          <option value="ES">ES - Spain</option>
          <option value="FI">FI - Finland</option>
          <option value="FR">FR - France</option>
          <option value="GB">GB - United Kingdom</option>
          <option value="GH">GH - Ghana</option>
          <option value="GR">GR - Greece</option>
          <option value="HK">HK - Hong Kong</option>
          <option value="HR">HR - Croatia</option>
          <option value="HU">HU - Hungary</option>
          <option value="ID">ID - Indonesia</option>
          <option value="IE">IE - Ireland</option>
          <option value="IL">IL - Israel</option>
          <option value="IN">IN - India</option>
          <option value="IT">IT - Italy</option>
          <option value="JP">JP - Japan</option>
          <option value="KE">KE - Kenya</option>
          <option value="KR">KR - South Korea</option>
          <option value="LT">LT - Lithuania</option>
          <option value="LU">LU - Luxembourg</option>
          <option value="LV">LV - Latvia</option>
          <option value="MA">MA - Morocco</option>
          <option value="MT">MT - Malta</option>
          <option value="MX">MX - Mexico</option>
          <option value="MY">MY - Malaysia</option>
          <option value="NG">NG - Nigeria</option>
          <option value="NL">NL - Netherlands</option>
          <option value="NO">NO - Norway</option>
          <option value="NZ">NZ - New Zealand</option>
          <option value="PE">PE - Peru</option>
          <option value="PH">PH - Philippines</option>
          <option value="PL">PL - Poland</option>
          <option value="PT">PT - Portugal</option>
          <option value="RO">RO - Romania</option>
          <option value="SA">SA - Saudi Arabia</option>
          <option value="SE">SE - Sweden</option>
          <option value="SG">SG - Singapore</option>
          <option value="SI">SI - Slovenia</option>
          <option value="SK">SK - Slovakia</option>
          <option value="TH">TH - Thailand</option>
          <option value="TN">TN - Tunisia</option>
          <option value="TW">TW - Taiwan</option>
          <option value="US">US - United States</option>
          <option value="UY">UY - Uruguay</option>
          <option value="VN">VN - Vietnam</option>
          <option value="ZA">ZA - South Africa</option>
        </select>
        <p className="form-help">
          Select the country for your connected account
        </p>
      </div>
    </div>
  );
};

export default SettingsGeneral;
