import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-medium text-gray-900 mb-2">
          Dashboard
        </h2>
        <p className="text-gray-600">
          This is your main dashboard. More features coming soon!
        </p>
      </div>
      
      <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-6">
            Dashboard content will be displayed here
          </p>
          <div className="space-x-4">
            <Link
              to="/payments"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              View Payments
            </Link>
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
