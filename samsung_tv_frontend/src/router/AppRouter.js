import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Splash from '../screens/Splash';
import Home from '../screens/Home';
import Login from '../screens/Login';
import Settings from '../screens/Settings';
import MyPlan from '../screens/MyPlan';
import '../styles/theme.css';

/**
 * PUBLIC_INTERFACE
 * AppRouter defines the application's routes and wraps them with BrowserRouter.
 * Routes:
 * - "/" -> Splash
 * - "/home" -> Home
 * - "/login" -> Login
 * - "/settings" -> Settings
 * - "/my-plan" -> My Plan
 */
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/my-plan" element={<MyPlan />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
