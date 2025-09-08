import React from 'react';

const SettingsSection = () => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        App Settings
      </label>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Dark Mode</span>
          <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors">
            <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Notifications</span>
          <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
            <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsSection;
