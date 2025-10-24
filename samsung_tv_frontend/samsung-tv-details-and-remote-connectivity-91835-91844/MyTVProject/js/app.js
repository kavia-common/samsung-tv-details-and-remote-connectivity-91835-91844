/**
 * PUBLIC_INTERFACE
 * initApp bootstraps the MyTV Tizen Web App with:
 *  - Splash screen then navigation to Home after ~3s
 *  - Simple view routing (Home, Login, Settings, My Plan)
 *  - Remote control key handling (LEFT/RIGHT/UP/DOWN/ENTER/RETURN/ESC)
 *  - Focus model: menu focus across top items; rails focus per row
 */
(function () {
  'use strict';

  // Key code mapping for Tizen TVs and browsers
  const KEY = {
    LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, ENTER: 13, RETURN: 10009, ESC: 27,
  };
  const BROWSER_KEYS = {
    ArrowLeft: KEY.LEFT, ArrowUp: KEY.UP, ArrowRight: KEY.RIGHT, ArrowDown: KEY.DOWN, Enter: KEY.ENTER, Escape: KEY.ESC,
  };

  // State
  const state = {
    route: 'home',             // 'home' | 'login' | 'settings' | 'my-plan'
    focusArea: 'menu',         // 'menu' or rail index (number)
    focusedMenuIndex: 0,       // 0..N for menu
    railsFocus: [],            // per-rail focused index
    rails: [],                 // rails data
  };

  // Elements
  const el = {
    splash: document.getElementById('view-splash'),
    appRoot: document.getElementById('app-root'),
    topMenu: document.getElementById('top-menu'),
    viewHome: document.getElementById('view-home'),
    viewLogin: document.getElementById('view-login'),
    viewSettings: document.getElementById('view-settings'),
    viewMyPlan: document.getElementById('view-my-plan'),
    railsContainer: document.getElementById('rails-container'),
  };

  // Menu items order must match DOM anchors after brand
  const menuAnchors = Array.from(el.topMenu.querySelectorAll('.menu-item'));
  const menuRoutes = ['home', 'login', 'settings', 'my-plan'];

  function preventDefaultIfHandled(e) {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  function normalizeKeyCode(e) {
    if (typeof e.keyCode === 'number' && e.keyCode) return e.keyCode;
    if (e && e.key && BROWSER_KEYS[e.key]) return BROWSER_KEYS[e.key];
    return 0;
  }

  function setRoute(route) {
    state.route = route;
    // Toggle views
    el.viewHome.classList.toggle('hidden', route !== 'home');
    el.viewLogin.classList.toggle('hidden', route !== 'login');
    el.viewSettings.classList.toggle('hidden', route !== 'settings');
    el.viewMyPlan.classList.toggle('hidden', route !== 'my-plan');

    // Update menu active state
    menuAnchors.forEach((a, idx) => {
      a.classList.toggle('active', menuRoutes[idx] === route);
    });

    // When navigating, move focus back to menu
    state.focusArea = 'menu';
    renderFocus();
  }

  function renderRails() {
    // Rails dataset similar to React version
    const railsData = {
      trending: {
        title: 'Top Trending',
        items: [
          { image: 'assets/thumbs/trending1.jpg' },
          { image: 'assets/thumbs/action1.jpg' },
          { image: 'assets/thumbs/drama1.jpg' },
          { image: 'assets/thumbs/horror1.jpg' },
          { image: 'assets/thumbs/action2.jpg' },
        ]
      },
      continue: {
        title: 'Continue Watching',
        items: [
          { image: 'assets/thumbs/continue1.jpg' },
          { image: 'assets/thumbs/action2.jpg' },
          { image: 'assets/thumbs/drama1.jpg' },
        ]
      },
      action: {
        title: 'Action',
        items: [
          { image: 'assets/thumbs/action1.jpg' },
          { image: 'assets/thumbs/action2.jpg' },
          { image: 'assets/thumbs/trending1.jpg' },
        ]
      },
      drama: {
        title: 'Drama',
        items: [
          { image: 'assets/thumbs/drama1.jpg' },
          { image: 'assets/thumbs/continue1.jpg' },
          { image: 'assets/thumbs/action1.jpg' },
        ]
      },
      horror: {
        title: 'Horror',
        items: [
          { image: 'assets/thumbs/horror1.jpg' },
          { image: 'assets/thumbs/drama1.jpg' },
          { image: 'assets/thumbs/action2.jpg' },
        ]
      },
      generic: {
        title: 'Recommended',
        items: [
          { image: 'assets/thumbs/action1.jpg' },
          { image: 'assets/thumbs/horror1.jpg' },
          { image: 'assets/thumbs/drama1.jpg' },
          { image: 'assets/thumbs/trending1.jpg' },
        ]
      }
    };

    const railsList = Object.values(railsData);
    state.rails = railsList;

    el.railsContainer.innerHTML = '';
    railsList.forEach((rail, rIdx) => {
      const railEl = document.createElement('div');
      railEl.className = 'rail';
      const title = document.createElement('div');
      title.className = 'rail-title';
      title.textContent = rail.title;

      const track = document.createElement('div');
      track.className = 'rail-track';
      rail.items.forEach((item, iIdx) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.backgroundImage = `url('${item.image}')`;
        card.setAttribute('data-rail-index', String(rIdx));
        card.setAttribute('data-item-index', String(iIdx));
        track.appendChild(card);
      });

      railEl.appendChild(title);
      railEl.appendChild(track);
      el.railsContainer.appendChild(railEl);
    });

    // init rails focus per row
    state.railsFocus = railsList.map(() => 0);
  }

  function getRailCard(railIndex, itemIndex) {
    return el.railsContainer.querySelector(`.card[data-rail-index="${railIndex}"][data-item-index="${itemIndex}"]`);
  }

  function clearFocus() {
    // menu
    menuAnchors.forEach(a => a.classList.remove('focused'));
    // cards
    el.railsContainer.querySelectorAll('.card.focused').forEach(c => c.classList.remove('focused'));
  }

  function renderFocus() {
    clearFocus();
    if (state.focusArea === 'menu') {
      const a = menuAnchors[state.focusedMenuIndex];
      if (a) a.classList.add('focused');
    } else if (typeof state.focusArea === 'number') {
      const ri = state.focusArea;
      const ii = state.railsFocus[ri] || 0;
      const card = getRailCard(ri, ii);
      if (card) card.classList.add('focused');
    }
  }

  function handleEnter() {
    if (state.focusArea === 'menu') {
      const route = menuRoutes[state.focusedMenuIndex] || 'home';
      // For demo: "activate" by navigating
      setRoute(route);
      console.log('[ENTER] Navigate to', route);
    } else if (typeof state.focusArea === 'number') {
      // For demo: Enter on a card returns focus to menu
      state.focusArea = 'menu';
      renderFocus();
      console.log('[ENTER] Activate card -> returning focus to menu');
    }
  }

  function handleReturnOrEsc() {
    if (state.route !== 'home') {
      // Return to home
      setRoute('home');
      console.log('[RETURN] Back to Home');
    } else {
      // On Home, exit app if running on Tizen
      console.log('[RETURN] Exit app');
      try {
        if (window.tizen && tizen.application) {
          tizen.application.getCurrentApplication().exit();
        } else {
          // Fallback: go to splash or do nothing
          // no-op in browser
        }
      } catch (e) {
        console.warn('Exit not available:', e);
      }
    }
  }

  function onKeyDown(e) {
    const code = normalizeKeyCode(e);
    // Prevent default for navigation keys
    if ([KEY.LEFT, KEY.RIGHT, KEY.UP, KEY.DOWN, KEY.ENTER, KEY.RETURN, KEY.ESC].includes(code)) {
      preventDefaultIfHandled(e);
    }

    switch (code) {
      case KEY.UP: {
        if (state.focusArea !== 'menu') {
          state.focusArea = 'menu';
          renderFocus();
        }
        break;
      }
      case KEY.DOWN: {
        if (state.focusArea === 'menu') {
          state.focusArea = 0; // first rail
        } else if (typeof state.focusArea === 'number') {
          state.focusArea = Math.min(state.focusArea + 1, state.rails.length - 1);
        }
        renderFocus();
        break;
      }
      case KEY.LEFT: {
        if (state.focusArea === 'menu') {
          state.focusedMenuIndex = Math.max(0, state.focusedMenuIndex - 1);
        } else if (typeof state.focusArea === 'number') {
          const ri = state.focusArea;
          state.railsFocus[ri] = Math.max(0, state.railsFocus[ri] - 1);
        }
        renderFocus();
        break;
      }
      case KEY.RIGHT: {
        if (state.focusArea === 'menu') {
          state.focusedMenuIndex = Math.min(menuAnchors.length - 1, state.focusedMenuIndex + 1);
        } else if (typeof state.focusArea === 'number') {
          const ri = state.focusArea;
          const max = (state.rails[ri]?.items?.length || 1) - 1;
          state.railsFocus[ri] = Math.min(max, state.railsFocus[ri] + 1);
        }
        renderFocus();
        break;
      }
      case KEY.ENTER: {
        handleEnter();
        break;
      }
      case KEY.RETURN:
      case KEY.ESC: {
        handleReturnOrEsc();
        break;
      }
      default:
        break;
    }
  }

  function bindGlobalKeys() {
    // Tizen TV remote keys registration (if available)
    try {
      if (window.tizen && tizen.tvinputdevice && tizen.tvinputdevice.registerKey) {
        ['VolumeUp', 'VolumeDown', 'ChannelUp', 'ChannelDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Enter', 'Return', 'Exit']
          .forEach(k => { try { tizen.tvinputdevice.registerKey(k); } catch (_) {} });
      }
    } catch (e) {
      console.warn('Key registration not available:', e);
    }
    document.addEventListener('keydown', onKeyDown, false);
  }

  function unbindGlobalKeys() {
    document.removeEventListener('keydown', onKeyDown, false);
  }

  function setupMenuClicks() {
    menuAnchors.forEach((a, idx) => {
      a.addEventListener('click', () => {
        state.focusedMenuIndex = idx;
        setRoute(menuRoutes[idx]);
      });
    });
  }

  function showApp() {
    el.splash.classList.remove('active');
    el.splash.classList.add('hidden');
    el.appRoot.classList.remove('hidden');
  }

  function showSplashThenHome() {
    // 5 seconds splash then navigate to home
    setTimeout(() => {
      showApp();
      setRoute('home');
    }, 5000);
  }

  function init() {
    renderRails();
    setupMenuClicks();
    bindGlobalKeys();
    renderFocus();
    showSplashThenHome();

    // Cleanup on unload (safety)
    window.addEventListener('unload', () => {
      unbindGlobalKeys();
    });
  }

  // Boot
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(init, 0);
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();
