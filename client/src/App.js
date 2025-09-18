import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout, HomePage, Login, Dashboard, Payments, Onboarding, ControlButton, ControlPanel } from './components';
import { SettingsProvider } from './contexts';

function App() {
  const [isControlPanelOpen, setIsControlPanelOpen] = useState(false);

  const handleOpenControlPanel = () => setIsControlPanelOpen(true);
  const handleCloseControlPanel = () => setIsControlPanelOpen(false);

  return (
    <SettingsProvider>
      <Router>
        <div className="min-h-screen bg-white relative">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="login" element={<Login />} />
              <Route path="onboarding" element={<Onboarding />} />
              <Route path="onboarding/:accountId" element={<Onboarding />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="payments" element={<Payments />} />
              <Route path="*" element={<HomePage />} />
            </Route>
          </Routes>

          <ControlButton onClick={handleOpenControlPanel} />
          <ControlPanel isOpen={isControlPanelOpen} onClose={handleCloseControlPanel} />
        </div>
      </Router>
    </SettingsProvider>
  );
}

export default App;
