import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header, Navigation } from './index';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Navigation />
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <main className="card card-padding-lg">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
