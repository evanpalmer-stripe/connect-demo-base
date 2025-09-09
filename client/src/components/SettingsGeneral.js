import React, { useState } from 'react';

const SettingsGeneral = () => {
  const [publishableKey, setPublishableKey] = useState('');
  const [secretKey, setSecretKey] = useState('');

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving keys:', { publishableKey, secretKey });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Publishable Key
        </label>
        <input
          type="text"
          value={publishableKey}
          onChange={(e) => setPublishableKey(e.target.value)}
          placeholder="pk_test_..."
          className="input"
        />
        <p className="mt-1 text-xs text-gray-500">
          Your Stripe publishable key (starts with pk_test_ or pk_live_)
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Secret Key
        </label>
        <input
          type="password"
          value={secretKey}
          onChange={(e) => setSecretKey(e.target.value)}
          placeholder="sk_test_..."
          className="input"
        />
        <p className="mt-1 text-xs text-gray-500">
          Your Stripe secret key (starts with sk_test_ or sk_live_)
        </p>
      </div>
    </div>
  );
};

export default SettingsGeneral;
