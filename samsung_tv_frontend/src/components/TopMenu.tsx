import React, { useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import focusManager from '../utils/focusManager.ts';

/**
 * PUBLIC_INTERFACE
 * Top menu navigation with keyboard arrow navigation and Enter activation.
 */
export default function TopMenu() {
  const navigate = useNavigate();
  const itemsRef = useRef<Array<HTMLAnchorElement | null>>([]);

  useEffect(() => {
    // Initially mark the active item
    const activeIdx = itemsRef.current.findIndex((el) => el?.classList.contains('active'));
    const idx = activeIdx >= 0 ? activeIdx : 0;
    itemsRef.current.forEach((el, i) => el?.setAttribute('tabindex', i === idx ? '0' : '-1'));

    // Register with focus manager
    itemsRef.current.forEach((el, i) => {
      if (el) {
        el.setAttribute('role', 'menuitem');
        el.setAttribute('aria-current', el.classList.contains('active') ? 'page' : 'false');
        focusManager.register(`topmenu-${i}`, 'topmenu', el, i);
        el.onfocus = () => {
          focusManager.setCurrent('topmenu', i);
          // update aria-current
          itemsRef.current.forEach((e, j) => e?.setAttribute('aria-current', j === i ? 'page' : 'false'));
        };
      }
    });
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const currentIndex = itemsRef.current.findIndex((el) => el === document.activeElement);
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      focusManager.focusNext('topmenu');
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      focusManager.focusPrev('topmenu');
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const el = itemsRef.current[currentIndex];
      if (el) navigate(el.getAttribute('href') || '/home');
    } else if (e.key === 'ArrowDown') {
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
