import React from 'react';
import { NavLink } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function TopMenu() {
  /** Top menu navigation for Home, Login, Setting, My Plan */
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `menu-item ${isActive ? 'active' : ''}`;

  return (
    <nav className="top-menu">
      <div className="brand">MyTV</div>
      <NavLink to="/" className={navClass} end>Home</NavLink>
      <NavLink to="/login" className={navClass}>Login</NavLink>
      <NavLink to="/setting" className={navClass}>Setting</NavLink>
      <NavLink to="/my-plan" className={navClass}>My Plan</NavLink>
    </nav>
  );
}
