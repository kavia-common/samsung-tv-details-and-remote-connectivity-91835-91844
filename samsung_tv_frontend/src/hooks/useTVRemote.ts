import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import focusManager from '../utils/focusManager.ts';

/**
 * PUBLIC_INTERFACE
 * useTVRemote: Attaches global keydown listeners to enable TV remote-like navigation:
 * - ArrowLeft/ArrowRight: move within group (wrap-around)
 * - ArrowUp/ArrowDown: move across groups
 * - Enter: activates the focused element (click)
 * - Back (Escape/Backspace or HistoryBack): route/back behavior with exit confirm on Home
 *
 * Also sets initial focus per route using stored session focus when available.
 */
export default function useTVRemote() {
  const location = useLocation();
  const navigate = useNavigate();

  // Initial focus on route changes
  useEffect(() => {
    const path = location.pathname;
    // Guard: skip automatic focus on Splash
    if (path === '/' || path === '/splash') return;

    // When route changes, try to restore the last session focus.
    const current = focusManager.getCurrent();
    // If we have a current group, try to focus it after the screen paints.
    const id = window.requestAnimationFrame(() => {
      let focused = false;

      if (current.group) {
        focused = focusManager.focus(current.group as any, current.index);
      }

      if (!focused) {
        // Fallback per route
        if (path === '/home') {
          // Prefer topmenu first
          focused = focusManager.focus('topmenu', 0);
          if (!focused) {
            // try banner then trending
            focused = focusManager.focus('banner', 0) || focusManager.focus('trending', 0);
          }
        } else if (path === '/login') {
          focused = focusManager.focus('login-form', 0);
        } else if (path === '/my-plan') {
          // We don't have specific controls; try topmenu
          focused = focusManager.focus('topmenu', 0);
        }
      }
    });

    return () => cancelAnimationFrame(id);
  }, [location.pathname]);

  // Back behavior and Arrow navigation
  useEffect(() => {
    const isTV = true; // Guard for TV-like environments; still works on web
    if (!isTV) return;

    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key;

      // Only handle directional keys and activation/back
      const handledKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Enter', 'Backspace', 'Escape'];
      if (!handledKeys.includes(key)) return;

      // Prevent page scrolling and default behavior
      e.preventDefault();

      // Handle Enter
      if (key === 'Enter') {
        const active = document.activeElement as HTMLElement | null;
        if (active) {
          active.click?.();
          active.dispatchEvent(new Event('submit', { bubbles: true })); // if button in form
        }
        return;
      }

      // Handle Back
      if (key === 'Backspace' || key === 'Escape') {
        const path = location.pathname;
        if (path === '/home') {
          openExitOverlay();
        } else {
          navigate('/home', { replace: true });
          // focus restore handled by initial focus effect via session state
        }
        return;
      }

      const current = focusManager.getCurrent();
      if (!current.group) {
        // try to set to topmenu by default on Home
        if (location.pathname === '/home') {
          focusManager.focus('topmenu', 0);
        }
        return;
      }

      if (key === 'ArrowLeft') {
        // Move left within the group; if wrap hits last index and we want optional prev group move
        const moved = focusManager.focusPrev(current.group as any);
        if (!moved) {
          focusManager.focusFirstInPrevGroup();
        }
        return;
      }

      if (key === 'ArrowRight') {
        const moved = focusManager.focusNext(current.group as any);
        if (!moved) {
          focusManager.focusFirstInNextGroup();
        }
        return;
      }

      if (key === 'ArrowUp') {
        focusManager.focusFirstInPrevGroup();
        return;
      }

      if (key === 'ArrowDown') {
        focusManager.focusFirstInNextGroup();
        return;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [location.pathname]);

  // Lightweight exit overlay implementation
  const openExitOverlay = () => {
    if (document.getElementById('exit-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'exit-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.background = 'rgba(17,24,39,0.55)';
    overlay.style.display = 'grid';
    overlay.style.placeItems = 'center';
    overlay.style.zIndex = '9999';

    const box = document.createElement('div');
    box.style.background = 'white';
    box.style.borderRadius = '14px';
    box.style.padding = '20px';
    box.style.minWidth = '320px';
    box.style.boxShadow = '0 20px 50px rgba(0,0,0,0.25)';
    box.style.textAlign = 'center';

    const title = document.createElement('div');
    title.textContent = 'Exit App?';
    title.style.fontSize = '20px';
    title.style.fontWeight = '800';
    title.style.marginBottom = '12px';

    const desc = document.createElement('div');
    desc.textContent = 'Are you sure you want to exit?';
    desc.style.marginBottom = '16px';

    const actions = document.createElement('div');
    actions.style.display = 'flex';
    actions.style.gap = '12px';
    actions.style.justifyContent = 'center';

    const yes = document.createElement('button');
    yes.textContent = 'Yes';
    yes.className = 'btn-focusable';
    yes.style.padding = '10px 18px';
    yes.style.borderRadius = '10px';
    yes.style.border = '1px solid rgba(0,0,0,0.1)';
    yes.style.background = '#EF4444';
    yes.style.color = 'white';
    yes.onclick = () => {
      // In TV, would exit; on web just close overlay
      document.body.removeChild(overlay);
    };

    const no = document.createElement('button');
    no.textContent = 'No';
    no.className = 'btn-focusable';
    no.style.padding = '10px 18px';
    no.style.borderRadius = '10px';
    no.style.border = '1px solid rgba(0,0,0,0.1)';
    no.style.background = '#2563EB';
    no.style.color = 'white';
    no.onclick = () => {
      document.body.removeChild(overlay);
    };

    actions.appendChild(yes);
    actions.appendChild(no);

    box.appendChild(title);
    box.appendChild(desc);
    box.appendChild(actions);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    // Temporarily override focus group to the overlay actions
    const tempGroup = 'overlay-actions' as any;
    yes.setAttribute('tabindex', '0');
    no.setAttribute('tabindex', '-1');

    // Ad-hoc handlers using focusManager via temporary register
    focusManager.register('exit-yes', tempGroup, yes as any, 0);
    focusManager.register('exit-no', tempGroup, no as any, 1);
    focusManager.setCurrent(tempGroup, 0);

    // Cleanup on overlay removal resets to previous current is kept in session
  };
}
