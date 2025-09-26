import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts';

const Navigation = () => {
  const { isLoggedIn, logout } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return null;
  }

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navigation">
      <div className="navigation-header">
        <h3 className="navigation-title">Navigation</h3>
      </div>
      
      <div className="navigation-links">
        <Link
          to="/dashboard"
          className={`navigation-link ${isActive('/dashboard') ? 'navigation-link-active' : ''}`}
        >
          Dashboard
        </Link>
        <Link
          to="/payments"
          className={`navigation-link ${isActive('/payments') ? 'navigation-link-active' : ''}`}
        >
          Payments
        </Link>
      </div>
      
      <div className="navigation-footer">
        <button
          onClick={handleLogout}
          className="navigation-logout"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
