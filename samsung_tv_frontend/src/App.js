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
 * Root component that only declares application Routes.
 * HashRouter is instantiated once in index.js (do not nest any Router here).
 * Routes: Splash (/), Home (/home), Login (/login), My Plan (/my-plan), Settings (/settings).
 */
function App() {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  // Attach global TV remote key handling
  useTVRemote();

  // Ocean Professional gradient background and clean styling
  const bgStyle = {
    minHeight: '100vh',
    background:
      'radial-gradient(800px 400px at 20% -10%, rgba(37,99,235,0.10), transparent), linear-gradient(180deg, rgba(37,99,235,0.05), rgba(243,244,246,1))',
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
