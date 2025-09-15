import React from 'react';

const StatusDisplay = ({ type, title, message, children }) => {
  const baseClasses = "border rounded-lg p-6";
  const typeClasses = {
    success: "bg-green-50 border-green-200",
    error: "bg-red-50 border-red-200", 
    warning: "bg-yellow-50 border-yellow-200"
  };
  
  const iconClasses = {
    success: "text-green-600",
    error: "text-red-600",
    warning: "text-yellow-600"
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      <div className="text-center">
        <div className={`${iconClasses[type]} font-medium mb-2`}>
          {title}
        </div>
        <div className="text-gray-600">{message}</div>
        {children}
      </div>
    </div>
  );
};

export default StatusDisplay;
