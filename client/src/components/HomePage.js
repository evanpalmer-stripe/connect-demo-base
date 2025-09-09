import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="space-y-6">      
      <div className="space-y-4">
        <Link
          to="/login"
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Log In
        </Link>
        <Link
          to="/onboarding"
          className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
