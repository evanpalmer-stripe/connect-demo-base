import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-medium text-gray-900 mb-2">
          Log In
        </h2>
        <p className="text-gray-600">
          Enter your email address
        </p>
      </div>
      
      <form className="space-y-6">
        <div>
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Email address"
          />
        </div>
        <div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Log In
          </button>
        </div>
        <div className="text-center">
          <Link
            to="/"
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            Back to Home
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
