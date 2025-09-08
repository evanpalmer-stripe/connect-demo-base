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
        <label htmlFor="publishable-key" className="block text-sm font-medium text-gray-700 mb-2">
          Publishable Key
        </label>
        <input
          type="text"
          id="publishable-key"
          value={publishableKey}
          onChange={(e) => setPublishableKey(e.target.value)}
          placeholder="pk_test_..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          Your Stripe publishable key (starts with pk_test_ or pk_live_)
        </p>
      </div>
      
      <div>
        <label htmlFor="secret-key" className="block text-sm font-medium text-gray-700 mb-2">
          Secret Key
        </label>
        <input
          type="password"
          id="secret-key"
          value={secretKey}
          onChange={(e) => setSecretKey(e.target.value)}
          placeholder="sk_test_..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          Your Stripe secret key (starts with sk_test_ or sk_live_)
        </p>
      </div>
      
      <div className="pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default SettingsGeneral;
