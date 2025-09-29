import React from 'react';
import { useDashboardSettings, useSettings } from '../contexts';
import DashboardStripe from './DashboardStripe';
import DashboardEmbedded from './DashboardEmbedded';
import DashboardNone from './DashboardNone';

const Dashboard = () => {
  const { dashboard } = useDashboardSettings();
  const { settings } = useSettings();

  // Wait for settings to load before rendering
  if (settings.isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-gray-600">Loading dashboard settings...</div>
        </div>
      </div>
    );
  }

  const renderDashboardFlow = () => {
    switch (dashboard.type) {
      case 'stripe':
        return <DashboardStripe />;
      case 'embedded':
        return <DashboardEmbedded />;
      case 'none':
        return <DashboardNone />;
      default:
        return <DashboardStripe />;
    }
  };

  return (
    <div className="space-y-6">      
      {renderDashboardFlow()}
    </div>
  );
};

export default Dashboard;
