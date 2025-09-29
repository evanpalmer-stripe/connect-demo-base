import React from 'react';
import { useDashboardSettings } from '../contexts';

const SettingsDashboard = () => {
  const { dashboard, updateDashboard } = useDashboardSettings();

  const dashboardTypeOptions = [
    { 
      value: 'stripe', 
      label: 'Stripe',
      description: 'Use Stripe-hosted dashboard for account management'
    },
    { 
      value: 'embedded', 
      label: 'Embedded',
      description: 'Embed Stripe dashboard components in your application'
    },
    { 
      value: 'none', 
      label: 'None',
      description: 'No dashboard integration - handle account management separately'
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Dashboard Type - Left Column */}
      <div className="form-group">
        <label className="form-label">
          Dashboard Type
        </label>
        <div className="card-group">
          {dashboardTypeOptions.map((option) => (
            <label key={option.value} className={`card-option ${dashboard.type === option.value ? 'card-option-selected' : 'card-option-unselected'}`}>
              <input
                type="radio"
                name="dashboardType"
                value={option.value}
                checked={dashboard.type === option.value}
                onChange={(e) => updateDashboard({ type: e.target.value })}
                className="card-option-input"
              />
              <div className="card-option-content">
                <div>
                  <div className="card-option-label">{option.label}</div>
                  <div className="card-option-description">{option.description}</div>
                </div>
                <div className={`card-option-indicator ${dashboard.type === option.value ? 'card-option-indicator-selected' : 'card-option-indicator-unselected'}`}>
                  {dashboard.type === option.value && <div className="card-option-indicator-dot"></div>}
                </div>
              </div>
            </label>
          ))}
        </div>
        <p className="form-help">
          Choose how dashboard functionality will be integrated
        </p>
      </div>
    </div>
  );
};

export default SettingsDashboard;
