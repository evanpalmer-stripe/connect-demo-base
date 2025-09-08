import React from 'react';
import { Tab } from '@headlessui/react';
import SettingsGeneral from './SettingsGeneral';

const SettingsSection = () => {
  const tabs = [
    { 
      name: 'General', 
      content: <SettingsGeneral />
    },
    { name: 'Onboarding', content: 'Onboarding settings content goes here' },
    { name: 'Payment', content: 'Payment settings content goes here' },
    { name: 'Logs', content: 'Logs content goes here' }
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-4">
        App Settings
      </label>
      
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl 20 p-1 mb-6">
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-colors ${
                  selected
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-white text-gray-400 border border-gray-200 hover:bg-white hover:text-gray-600 hover:border-gray-600'
                }`
              }
            >
              {tab.name}
            </Tab>
          ))}
        </Tab.List>
        
        <Tab.Panels className="mt-2">
          {tabs.map((tab, idx) => (
            <Tab.Panel
              key={idx}
              className="rounded-xl bg-white p-6 shadow-sm border border-gray-200"
            >
              <div className="text-gray-600">
                <h3 className="text-lg font-medium text-gray-900 mb-4">{tab.name} Settings</h3>
                {typeof tab.content === 'string' ? (
                  <p className="text-sm">{tab.content}</p>
                ) : (
                  tab.content
                )}
              </div>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default SettingsSection;
