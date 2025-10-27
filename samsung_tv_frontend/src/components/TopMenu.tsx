import React, { useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * Top menu navigation with keyboard arrow navigation and Enter activation.
 */
export default function TopMenu() {
  const navigate = useNavigate();
  const itemsRef = useRef<Array<HTMLAnchorElement | null>>([]);

  useEffect(() => {
    // Initially focus the active item or the first item
    const activeIdx = itemsRef.current.findIndex((el) => el?.classList.contains('active'));
    const idx = activeIdx >= 0 ? activeIdx : 0;
    itemsRef.current[idx]?.setAttribute('tabindex', '0');
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const currentIndex = itemsRef.current.findIndex((el) => el === document.activeElement);
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = (currentIndex + 1) % itemsRef.current.length;
      itemsRef.current[next]?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = (currentIndex - 1 + itemsRef.current.length) % itemsRef.current.length;
      itemsRef.current[prev]?.focus();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const el = itemsRef.current[currentIndex];
      if (el) navigate(el.getAttribute('href') || '/home');
    }
  };

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `menu-item ${isActive ? 'active' : ''}`;

  return (
    <nav className="top-menu" onKeyDown={onKeyDown}>
      <div className="brand" tabIndex={-1}>MyTV</div>
      <NavLink to="/home" className={navClass} ref={(el) => (itemsRef.current[0] = el)} tabIndex={0}>Home</NavLink>
      <NavLink to="/login" className={navClass} ref={(el) => (itemsRef.current[1] = el)} tabIndex={-1}>Login</NavLink>
      <NavLink to="/settings" className={navClass} ref={(el) => (itemsRef.current[2] = el)} tabIndex={-1}>Setting</NavLink>
      <NavLink to="/my-plan" className={navClass} ref={(el) => (itemsRef.current[3] = el)} tabIndex={-1}>My Plan</NavLink>
    </nav>
  );
}
