import React, { useState, useEffect } from 'react';
import {
  ConnectPayments,
  ConnectComponentsProvider,
  ConnectPayouts,
  ConnectBalances,
} from "@stripe/react-connect-js";
import { useAuth } from '../contexts/AuthContext';

const DashboardEmbedded = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stripeConnectInstance, setStripeConnectInstance] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const accountId = user?.accountId;
        
        const response = await fetch(`/api/dashboard/embedded?account_id=${accountId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        debugger;
        const data = await response.json();
        setDashboardData(data);
        
        // Initialize Stripe Connect instance
        if (data.clientSecret) {
          const { loadConnectAndInitialize } = await import('@stripe/connect-js');
          const connectInstance = loadConnectAndInitialize({
            publishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY,
            fetchClientSecret: async () => data.clientSecret,
            appearance: {
              overlays: 'dialog',
            },
          });
          setStripeConnectInstance(connectInstance);
        }
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.accountId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-900 mb-2">
            Embedded Dashboard
          </h2>
          <p className="text-gray-600">
            Embed Stripe dashboard components in your application
          </p>
        </div>
        
        <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading dashboard components...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-900 mb-2">
            Embedded Dashboard
          </h2>
          <p className="text-gray-600">
            Embed Stripe dashboard components in your application
          </p>
        </div>
        
        <div className="border-4 border-dashed border-red-200 rounded-lg h-96 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-4">Error loading dashboard: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-medium text-gray-900 mb-2">
          Embedded Dashboard
        </h2>
        <p className="text-gray-600">
          Embed Stripe dashboard components in your application
        </p>
      </div>
      
      {stripeConnectInstance && dashboardData ? (
        <div className="space-y-6">
          <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
            {/* Payments Component */}
            {dashboardData.components?.payments?.enabled && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Payments</h3>
                <ConnectPayments
                  // Optional: specify filters to apply on load
                  // defaultFilters={{
                  //   amount: {greaterThan: 100},
                  //   date: {before: new Date(2024, 0, 1)},
                  //   status: ['partially_refunded', 'refund_pending', 'refunded'],
                  //   paymentMethod: 'card',
                  // }}
                />
              </div>
            )}

            {dashboardData.components?.payouts?.enabled && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Payouts</h3>
                <ConnectPayouts />
              </div>
            )}

            {dashboardData.components?.balances?.enabled && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Balances</h3>
                <ConnectBalances />
              </div>
            )} 
          </ConnectComponentsProvider>
        </div>
      ) : (
        <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500">No dashboard data available</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardEmbedded;
