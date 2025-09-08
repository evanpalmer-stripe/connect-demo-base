import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Connect Demonstration App
            </h1>
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </header>
          
          <main className="bg-white rounded-2xl p-8 border border-gray-200">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Onboarding
              </h2>
              <p className="text-gray-600 text-lg">
                Welcome to the Connect demonstration application
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
