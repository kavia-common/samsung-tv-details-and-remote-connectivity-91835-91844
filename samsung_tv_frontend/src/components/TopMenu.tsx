import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * Top menu navigation with standard clickable links and scoped Samsung remote support.
 * - ArrowLeft/ArrowRight: move focus between menu items when the menu is active.
 * - Enter/OK: activates (clicks) the focused item.
 * - Activation is scoped: the menu becomes "active" on focus within, and becomes inactive shortly after blur.
 * - Degrades gracefully for keyboard users; no global handlers or extra Routers introduced.
 */
export default function TopMenu() {
  const containerRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const blurTimer = useRef<number | null>(null);
  const [active, setActive] = useState(false);

  const navClass = useCallback(({ isActive }: { isActive: boolean }) => `menu-item ${isActive ? 'active' : ''}`, []);

  // Build an ordered list of focusable elements (anchors) inside the menu
  const getItems = useCallback((): HTMLAnchorElement[] => {
    const els = itemRefs.current.filter(Boolean) as HTMLAnchorElement[];
    return els;
  }, []);

  const focusItem = useCallback((idx: number) => {
    const items = getItems();
    if (items.length === 0) return;
    const clamped = Math.max(0, Math.min(items.length - 1, idx));
    try {
      items[clamped].focus();
    } catch {
      // ignore focus errors
    }
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

  // Scoped keydown handling: only when focus is within this menu (active === true)
  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLElement>) => {
    if (!active) return;

    const { key } = e;
    if (key === 'ArrowRight') {
      e.preventDefault();
      focusNext();
    } else if (key === 'ArrowLeft') {
      e.preventDefault();
      focusPrev();
    } else if (key === 'Enter') {
      e.preventDefault();
      const el = document.activeElement as HTMLElement | null;
      el?.click?.();
    }
  }, [active, focusNext, focusPrev]);

  const handleFocusIn = useCallback(() => {
    if (blurTimer.current != null) {
      window.clearTimeout(blurTimer.current);
      blurTimer.current = null;
    }
    setActive(true);
  }, []);

  const handleFocusOut = useCallback(() => {
    // Defer disabling to allow focus to move between children seamlessly
    if (blurTimer.current != null) {
      window.clearTimeout(blurTimer.current);
    }
    blurTimer.current = window.setTimeout(() => {
      setActive(false);
      blurTimer.current = null;
    }, 80);
  }, []);

  // Attach DOM focusin/focusout listeners to scope "active" state
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onFocusIn = () => handleFocusIn();
    const onFocusOut = (evt: FocusEvent) => {
      // If the new focused element is still inside the container, ignore
      const related = evt.relatedTarget as Node | null;
      if (related && el.contains(related)) return;
      handleFocusOut();
    };

    el.addEventListener('focusin', onFocusIn);
    el.addEventListener('focusout', onFocusOut);

    return () => {
      el.removeEventListener('focusin', onFocusIn);
      el.removeEventListener('focusout', onFocusOut);
    };
  }, [handleFocusIn, handleFocusOut]);

  // Cleanup any pending timers on unmount
  useEffect(() => {
    return () => {
      if (blurTimer.current != null) {
        window.clearTimeout(blurTimer.current);
        blurTimer.current = null;
      }
    };
  }, []);

  // Utility to assign ref in-order without recreating callbacks for each render
  const setItemRef = useCallback((index: number) => (el: HTMLAnchorElement | null) => {
    itemRefs.current[index] = el;
  }, []);

  return (
    <nav
      ref={containerRef as React.MutableRefObject<HTMLElement | null>}
      className="top-menu"
      aria-label="Top menu"
      onKeyDown={onKeyDown}
    >
      <div className="brand">MyTV</div>
      <NavLink to="/home" className={navClass} ref={setItemRef(0)}>Home</NavLink>
      <NavLink to="/login" className={navClass} ref={setItemRef(1)}>Login</NavLink>
      <NavLink to="/settings" className={navClass} ref={setItemRef(2)}>Setting</NavLink>
      <NavLink to="/my-plan" className={navClass} ref={setItemRef(3)}>My Plan</NavLink>
    </nav>
  );
}
