import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * TopNav renders the application navigation bar with links to primary routes.
 * It supports remote focus via arrow keys (Left/Right/Enter).
 */
export default function TopNav({ enableRemote = true }) {
  const location = useLocation();
  const navigate = useNavigate();
  const active = (path) => location.pathname === path;
  const items = [
    { label: 'Home', path: '/home' },
    { label: 'Login', path: '/login' },
    { label: 'Setting', path: '/settings' },
    { label: 'My Plan', path: '/my-plan' },
  ];
  const [focusIndex, setFocusIndex] = useState(0);
  const containerRef = useRef(null);

  const itemStyle = (path, focused) => ({
    background: focused ? '#dbeafe' : active(path) ? '#eff6ff' : 'transparent',
    color: (focused || active(path)) ? 'var(--primary)' : 'inherit',
    fontWeight: (focused || active(path)) ? 800 : 500,
    border: (focused || active(path)) ? '1px solid #bfdbfe' : '1px solid transparent',
    outline: focused ? '2px solid #2563EB' : 'none',
    outlineOffset: '2px',
    boxShadow: focused ? '0 0 0 3px rgba(37,99,235,0.25)' : 'none',
    transform: focused ? 'translateY(-1px)' : 'none'
  });

  useEffect(() => {
    if (!enableRemote) return;
    const onKey = (e) => {
      // Only handle if nav has "data-focus-scope=menu" or default scope for top line focus
      const inMenu = document.body.getAttribute('data-focus-scope') === 'menu';
      if (!inMenu) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          setFocusIndex((i) => Math.max(0, i - 1));
          break;
        case 'ArrowRight':
          e.preventDefault();
          setFocusIndex((i) => Math.min(items.length - 1, i + 1));
          break;
        case 'Enter':
          e.preventDefault();
          navigate(items[focusIndex].path);
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [enableRemote, focusIndex, items, navigate]);

  // expose a method to set focus scope to menu when needed
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // If the app sets data-focus-scope=menu, we add a visual hint on first item
  }, []);

  return (
    <nav className="navbar" ref={containerRef}>
      <div className="navbar-inner">
        <div className="brand">MyTV</div>
        <div className="menu">
          {items.map((it, idx) => (
            <Link
              key={it.path}
              style={itemStyle(it.path, focusIndex === idx && document.body.getAttribute('data-focus-scope') === 'menu')}
              to={it.path}
              role="menuitem"
              data-index={idx}
            >
              {it.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
