import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * TopNav renders the application navigation bar with links to primary routes.
 */
export default function TopNav() {
  const location = useLocation();
  const active = (path) => location.pathname === path;

  const itemStyle = (path) => ({
    background: active(path) ? '#eff6ff' : 'transparent',
    color: active(path) ? 'var(--primary)' : 'inherit',
    fontWeight: active(path) ? 700 : 500,
    border: active(path) ? '1px solid #dbeafe' : '1px solid transparent'
  });

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="brand">MyTV</div>
        <div className="menu">
          <Link style={itemStyle('/home')} to="/home">Home</Link>
          <Link style={itemStyle('/login')} to="/login">Login</Link>
          <Link style={itemStyle('/settings')} to="/settings">Setting</Link>
          <Link style={itemStyle('/my-plan')} to="/my-plan">My Plan</Link>
        </div>
      </div>
    </nav>
  );
}
