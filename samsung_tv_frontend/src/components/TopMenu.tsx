import React, { useCallback, useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useRemoteKeys } from '../store/RemoteProvider.tsx';

/**
 * PUBLIC_INTERFACE
 * Top menu navigation with standard clickable links and Samsung remote support via RemoteProvider.
 * - LEFT/RIGHT move focus across menu items
 * - ENTER activates the focused item
 * - Works on Tizen (RETURN/BACK normalized by provider, but TopMenu ignores BACK)
 * - Degrades gracefully with native keyboard Tab or Arrow handling
 */
export default function TopMenu() {
  const containerRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const blurTimer = useRef<number | null>(null);
  const [active, setActive] = useState(false);

  const { register } = useRemoteKeys();

  const navClass = useCallback(({ isActive }: { isActive: boolean }) => `menu-item ${isActive ? 'active' : ''}`, []);

  const getItems = useCallback((): HTMLAnchorElement[] => {
    return itemRefs.current.filter(Boolean) as HTMLAnchorElement[];
  }, []);

  const focusItem = useCallback((idx: number) => {
    const items = getItems();
    if (items.length === 0) return;
    const clamped = Math.max(0, Math.min(items.length - 1, idx));
    try { items[clamped].focus(); } catch {}
  }, [getItems]);

  const focusNext = useCallback(() => {
    const items = getItems();
    if (items.length === 0) return;
    const activeEl = document.activeElement as HTMLElement | null;
    const idx = items.findIndex((el) => el === activeEl);
    const next = idx >= 0 ? (idx + 1) % items.length : 0;
    focusItem(next);
  }, [getItems, focusItem]);

  const focusPrev = useCallback(() => {
    const items = getItems();
    if (items.length === 0) return;
    const activeEl = document.activeElement as HTMLElement | null;
    const idx = items.findIndex((el) => el === activeEl);
    const prev = idx >= 0 ? (idx - 1 + items.length) % items.length : items.length - 1;
    focusItem(prev);
  }, [getItems, focusItem]);

  // Attach DOM focusin/focusout listeners to scope "active" state
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onFocusIn = () => {
      if (blurTimer.current != null) {
        window.clearTimeout(blurTimer.current);
        blurTimer.current = null;
      }
      setActive(true);
    };
    const onFocusOut = (evt: FocusEvent) => {
      const related = evt.relatedTarget as Node | null;
      if (related && el.contains(related)) return;
      if (blurTimer.current != null) window.clearTimeout(blurTimer.current);
      blurTimer.current = window.setTimeout(() => {
        setActive(false);
        blurTimer.current = null;
      }, 80);
    };

    el.addEventListener('focusin', onFocusIn);
    el.addEventListener('focusout', onFocusOut);

    return () => {
      el.removeEventListener('focusin', onFocusIn);
      el.removeEventListener('focusout', onFocusOut);
    };
  }, []);

  // Register remote key handlers when active
  useEffect(() => {
    if (!active) return;
    const unregister = register({
      onLeft: () => focusPrev(),
      onRight: () => focusNext(),
      onEnter: () => {
        const el = document.activeElement as HTMLElement | null;
        el?.click?.();
      },
    });
    return unregister;
  }, [active, register, focusNext, focusPrev]);

  // Cleanup any pending timers on unmount
  useEffect(() => {
    return () => {
      if (blurTimer.current != null) {
        window.clearTimeout(blurTimer.current);
        blurTimer.current = null;
      }
    };
  }, []);

  const setItemRef = useCallback((index: number) => (el: HTMLAnchorElement | null) => {
    itemRefs.current[index] = el;
  }, []);

  return (
    <nav
      ref={containerRef as React.MutableRefObject<HTMLElement | null>}
      className="top-menu"
      aria-label="Top menu"
    >
      <div className="brand">MyTV</div>
      <NavLink to="/home" className={navClass} ref={setItemRef(0)}>Home</NavLink>
      <NavLink to="/login" className={navClass} ref={setItemRef(1)}>Login</NavLink>
      <NavLink to="/settings" className={navClass} ref={setItemRef(2)}>Setting</NavLink>
      <NavLink to="/my-plan" className={navClass} ref={setItemRef(3)}>My Plan</NavLink>
    </nav>
  );
}
