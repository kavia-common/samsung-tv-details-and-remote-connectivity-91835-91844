import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './styles/theme.css';
import Splash from './routes/Splash.tsx';
import Home from './routes/Home.tsx';
import Login from './routes/Login.tsx';
import MyPlan from './routes/MyPlan.tsx';

// PUBLIC_INTERFACE
function App() {
  /** Root component configuring routes for Splash, Home, Login, My Plan */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  return (
    <div className="App" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <Router>
        <Routes>
          <Route path="/splash" element={<Splash />} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/my-plan" element={<MyPlan />} />
          <Route path="/setting" element={<Home />} />
          <Route path="*" element={<Navigate to="/splash" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
