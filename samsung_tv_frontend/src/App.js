import React from 'react';
import './App.css';

/**
 * PUBLIC_INTERFACE
 * AppShell is a lightweight wrapper that provides global styles (CSS variables/theme).
 * Pages and routes are rendered via AppRouter; keep this for potential future use.
 */
function AppShell({ children }) {
  return <div className="App">{children}</div>;
}

export default AppShell;
