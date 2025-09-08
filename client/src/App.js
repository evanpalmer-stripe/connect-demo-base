import React, { useState } from 'react';
import { Header, MainContent, ControlButton, ControlPanel } from './components';

function App() {
  const [isControlPanelOpen, setIsControlPanelOpen] = useState(false);

  const handleOpenControlPanel = () => setIsControlPanelOpen(true);
  const handleCloseControlPanel = () => setIsControlPanelOpen(false);

  return (
    <div className="min-h-screen bg-white relative">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <Header />
          <MainContent />
        </div>
      </div>

      <ControlButton onClick={handleOpenControlPanel} />
      <ControlPanel isOpen={isControlPanelOpen} onClose={handleCloseControlPanel} />
    </div>
  );
}

export default App;
