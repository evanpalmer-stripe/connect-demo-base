import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './index';

const Layout = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-full mx-auto">
        <Header />
        <main className="card card-padding-lg">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
