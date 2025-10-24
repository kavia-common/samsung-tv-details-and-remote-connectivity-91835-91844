import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * TopMenu renders the top navigation items and highlights the focused item for TV remote navigation.
 * Props:
 *  - focusedIndex: number indicating which menu index is focused
 *  - items: array of { label, to }
 */
export default function TopMenu({ focusedIndex = 0, items = [] }) {
  const location = useLocation();
  return (
    <div className="top-menu" role="menubar" aria-label="Main Menu">
      <div className="brand">MyTV</div>
      {items.map((item, idx) => {
        const active = location.pathname === item.to || (item.aliases || []).includes(location.pathname);
        const focused = focusedIndex === idx;
        return (
          <Link key={item.to} to={item.to} className={`menu-item ${active ? 'active' : ''} ${focused ? 'focused' : ''}`} role="menuitem" aria-current={active ? 'page' : undefined}>
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
