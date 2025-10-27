import React from 'react';
import { NavLink } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * Top menu navigation with standard clickable links only.
 * Routing remains: Login -> /login, My Plan -> /my-plan.
 * No custom TV remote key handling or focus management.
 */
export default function TopMenu() {
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `menu-item ${isActive ? 'active' : ''}`;

  return (
    <nav className="top-menu" aria-label="Top menu">
      <div className="brand">MyTV</div>
      <NavLink to="/home" className={navClass}>Home</NavLink>
      <NavLink to="/login" className={navClass}>Login</NavLink>
      <NavLink to="/settings" className={navClass}>Setting</NavLink>
      <NavLink to="/my-plan" className={navClass}>My Plan</NavLink>
    </nav>
  );
}
