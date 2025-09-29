import React from 'react';
import { Tab } from '@headlessui/react';
import SettingsGeneral from './SettingsGeneral';
import SettingsOnboarding from './SettingsOnboarding';
import SettingsDashboard from './SettingsDashboard';
import SettingsDatabase from './SettingsDatabase';
import { useUISettings } from '../contexts/SettingsContext';

const SettingsSection = () => {
  const { ui, updateUI } = useUISettings();
  
  const tabs = [
    { 
      name: 'General', 
      content: <SettingsGeneral />
    },
    { 
      name: 'Onboarding', 
      content: <SettingsOnboarding />
    },
    { 
      name: 'Dashboard', 
      content: <SettingsDashboard />
    },
    { name: 'Payment', content: 'Payment settings content goes here' },
    { name: 'Logs', content: 'Logs content goes here' },
    { 
      name: 'Database', 
      content: <SettingsDatabase />
    },
  ];

  const handleTabChange = (index) => {
    updateUI({ activeTab: index });
  };

  // Fallback to 0 if ui or activeTab is undefined
  const activeTab = ui?.activeTab ?? 0;

  return (
    <div>
      <label className="form-label mb-4">
        App Settings
      </label>
      
      <Tab.Group selectedIndex={activeTab} onChange={handleTabChange}>
        <Tab.List className="tab-list mb-6">
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              className={({ selected }) =>
                `tab ${selected ? 'tab-selected' : 'tab-unselected'}`
              }
            >
              {tab.name}
            </Tab>
          ))}
        </Tab.List>
        
        <Tab.Panels className="mt-2">
          {tabs.map((tab, idx) => (
            <Tab.Panel key={idx} className="tab-panel">
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
