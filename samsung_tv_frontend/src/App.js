import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './styles/theme.css';
import Splash from './routes/Splash';
import Home from './routes/Home';
import Login from './routes/Login';
import MyPlan from './routes/MyPlan';

/**
 * PUBLIC_INTERFACE
 * App is the root component that registers all routes and renders the TV UI pages.
 * Routes:
 *  - /                Splash screen, auto navigates to /home
 *  - /home            Home page with top menu and content rails
 *  - /login           Login page
 *  - /my-plan         My Plan page
 *  - /settings        Settings (stub)
 */
function App() {
  return (
    <div className="app" role="application" aria-label="MyTV Application">
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/my-plan" element={<MyPlan />} />
        <Route path="/settings" element={<div className="section">Settings coming soon…</div>} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </div>
  );
}

export default App;
