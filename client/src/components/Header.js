import React from 'react';

const Header = () => {
  return (
    <header className="mb-12">
      {/* Logo in top left */}
      <div className="flex items-center mb-8">
        <a href="/">
          <img 
            src="/logo.svg" 
              alt="CDA Logo" 
              className="h-20 w-auto"
            />
          </a>
      </div>
      
      {/* Main title centered */}
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Connect Demonstration App
        </h1>
        <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
      </div>
    </header>
  );
};

export default Header;
