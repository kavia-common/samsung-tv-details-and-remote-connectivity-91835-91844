import React, { useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import focusManager from '../utils/focusManager.ts';

/**
 * PUBLIC_INTERFACE
 * Top menu navigation with TV-remote-friendly focus and activation.
 * - role="menubar" and role="menuitem" on items
 * - tabindex management for roving focus
 * - ArrowLeft/ArrowRight to move focus
 * - Enter/OK to navigate (uses navigate to avoid router-breaking default behavior)
 * - Default focus lands on Home when page loads
 */
export default function TopMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const itemsRef = useRef<Array<HTMLAnchorElement | null>>([]);

  // Initialize roles, tabindex, and register to focusManager
  useEffect(() => {
    // Determine default focused menu index: Home by default
    const activeIdx = itemsRef.current.findIndex((el) => el?.classList.contains('active'));
    const defaultIdx = activeIdx >= 0 ? activeIdx : 0;

    itemsRef.current.forEach((el, i) => {
      if (!el) return;
      el.setAttribute('tabindex', i === defaultIdx ? '0' : '-1');
      el.setAttribute('role', 'menuitem');
      el.setAttribute('aria-current', el.classList.contains('active') ? 'page' : 'false');
      el.onfocus = () => {
        // update focus manager and aria-current flags
        focusManager.setCurrent('topmenu', i);
        itemsRef.current.forEach((e, j) => e?.setAttribute('aria-current', j === i ? 'page' : 'false'));
      };
      focusManager.register(`topmenu-${i}`, 'topmenu', el, i);
    });

    // Ensure default visible focus on Home when entering Home page
    // We trigger focus after paint only if on /home and nothing focused yet
    const raf = requestAnimationFrame(() => {
      if (location.pathname === '/home') {
        // If no element is focused within document or not within our topmenu, focus Home
        const active = document.activeElement as HTMLElement | null;
        const isInTopMenu = itemsRef.current.some((el) => el === active);
        if (!isInTopMenu) {
          focusManager.focus('topmenu', 0);
        }
      }
    });

    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const key = e.key;
    // Let Back/Escape fall through to global handler in useTVRemote (do not break routing)
    if (key === 'ArrowRight') {
      e.preventDefault();
      focusManager.focusNext('topmenu');
    } else if (key === 'ArrowLeft') {
      e.preventDefault();
      focusManager.focusPrev('topmenu');
    } else if (key === 'Enter') {
      e.preventDefault();
      // Activate navigation programmatically to avoid default anchor behaviors in TV contexts
      const currentIndex = itemsRef.current.findIndex((el) => el === document.activeElement);
      const el = itemsRef.current[currentIndex];
      if (el) {
        const to = el.getAttribute('href') || '/home';
        navigate(to);
      }
    } else if (key === 'ArrowDown') {
      e.preventDefault();
      focusManager.focusFirstInNextGroup();
    }
  };

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `menu-item ${isActive ? 'active' : ''}`;

  return (
    <nav className="top-menu" role="menubar" aria-label="Top menu" onKeyDown={onKeyDown}>
      <div className="brand" tabIndex={-1}>MyTV</div>
      <NavLink to="/home" className={navClass} ref={(el) => (itemsRef.current[0] = el)} tabIndex={0}>Home</NavLink>
      <NavLink to="/login" className={navClass} ref={(el) => (itemsRef.current[1] = el)} tabIndex={-1}>Login</NavLink>
      <NavLink to="/settings" className={navClass} ref={(el) => (itemsRef.current[2] = el)} tabIndex={-1}>Setting</NavLink>
      <NavLink to="/my-plan" className={navClass} ref={(el) => (itemsRef.current[3] = el)} tabIndex={-1}>My Plan</NavLink>
    </nav>
  );
}
