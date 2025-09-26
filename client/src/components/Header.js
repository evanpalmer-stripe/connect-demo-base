import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts';

const Header = () => {
  const { isLoggedIn } = useAuth();
  
  // Navigate to dashboard if logged in, otherwise home page
  const logoLink = isLoggedIn ? '/dashboard' : '/';

  return (
    <header className="mb-12">
      {/* Logo in top left */}
      <div className="flex items-center mb-8">
        <Link to={logoLink}>
          <img 
            src="/logo.svg" 
              alt="CDA Logo" 
              className="h-20 w-auto"
            />
          </Link>
      </div>
    </header>
  );
};

export default Header;
