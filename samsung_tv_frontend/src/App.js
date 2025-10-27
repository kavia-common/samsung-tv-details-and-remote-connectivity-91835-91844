import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './styles/theme.css';
import Splash from './routes/Splash';
import Home from './routes/Home';
import Login from './routes/Login';
import MyPlan from './routes/MyPlan';
import useTVRemote from './hooks/useTVRemote.ts';
import { RemoteProvider } from './store/RemoteContext.tsx';

/**
 * PUBLIC_INTERFACE
 * Root component configuring routes for Splash, Home, Login, My Plan and Settings placeholder.
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
        <Router>
          <Routes>
            <Route path="/" element={<Splash />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/my-plan" element={<MyPlan />} />
            <Route
              path="/settings"
              element={
                <div className="container section" style={{ marginTop: 20 }}>
                  <h2>Settings</h2>
                  <p>Settings placeholder</p>
                </div>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </RemoteProvider>
    </div>
  );
}

export default App;
