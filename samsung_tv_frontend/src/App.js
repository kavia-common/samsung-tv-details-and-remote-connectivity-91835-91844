import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './styles/theme.css';
import Splash from './routes/Splash';
import Home from './routes/Home';
import Login from './routes/Login';
import MyPlan from './routes/MyPlan';
import Settings from './routes/Settings';
import useTVRemote from './hooks/useTVRemote.ts';
import { RemoteProvider } from './store/RemoteContext.tsx';

/**
 * PUBLIC_INTERFACE
 * Root component configuring routes for Splash, Home, Login, My Plan and Settings.
 * Note: HashRouter is instantiated once at app root (index.js) for Tizen/webapp compatibility.
 */
function App() {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  // attach global TV remote key handling
  useTVRemote();

  // Apply Ocean Professional subtle gradient background globally
  const bgStyle = {
    minHeight: '100vh',
    background:
      'linear-gradient(180deg, rgba(37,99,235,0.08), rgba(243,244,246,1))',
    color: 'var(--text)',
  };

  return (
    <div className="App" style={bgStyle}>
      <RemoteProvider>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/my-plan" element={<MyPlan />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </RemoteProvider>
    </div>
  );
}

export default App;
