import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './styles/theme.css';
import Splash from './routes/Splash.tsx';
import Home from './routes/Home.tsx';
import Login from './routes/Login.tsx';
import MyPlan from './routes/MyPlan.tsx';

/**
 * PUBLIC_INTERFACE
 * Root component configuring routes for Splash, Home, Login, My Plan and Settings placeholder.
 */
function App() {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  return (
    <div className="App" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <Router>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/my-plan" element={<MyPlan />} />
          <Route path="/settings" element={<div className="container section" style={{ marginTop: 20 }}><h2>Hello World</h2><p>Settings placeholder</p></div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
