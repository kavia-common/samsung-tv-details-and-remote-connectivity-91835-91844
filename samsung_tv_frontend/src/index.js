import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppRouter from './router/AppRouter';

// Map legacy Samsung keyCodes to standard keys where possible
(function attachSamsungKeyMap() {
  const map = {
    37: 'ArrowLeft',
    38: 'ArrowUp',
    39: 'ArrowRight',
    40: 'ArrowDown',
    13: 'Enter',
    10009: 'Backspace' // Tizen back key
  };
  window.addEventListener('keydown', (e) => {
    if (!e.key && map[e.keyCode]) {
      Object.defineProperty(e, 'key', { value: map[e.keyCode] });
    }
  }, { capture: true });
})();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);
