import React from 'react';
import DataDisplay from './components/DataDisplay';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            MERN Stack Demo
          </h1>
          <p className="text-lg text-gray-600">
            A simple demonstration of React, Express, and MongoDB integration
          </p>
        </header>
        
        <main className="bg-white rounded-lg shadow-lg p-6">
          <DataDisplay />
        </main>
      </div>
    </div>
  );
}

export default App;
