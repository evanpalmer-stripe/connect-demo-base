import React from 'react';

const DashboardStripe = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-medium text-gray-900 mb-2">
          Stripe Dashboard
        </h2>
        <p className="text-gray-600">
          Use Stripe-hosted dashboard for account management
        </p>
      </div>
      
      <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-6">
            Stripe dashboard integration will be displayed here
          </p>
          <div className="text-sm text-gray-400">
            This will redirect users to Stripe's hosted dashboard
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStripe;
