import React from 'react';

const DashboardNone = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-medium text-gray-900 mb-2">
          No Dashboard Integration
        </h2>
        <p className="text-gray-600">
          No dashboard integration - handle account management separately
        </p>
      </div>
      
      <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-6">
            Custom account management interface will be displayed here
          </p>
          <div className="text-sm text-gray-400">
            This will show a custom interface for account management
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardNone;
