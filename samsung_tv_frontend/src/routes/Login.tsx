import React, { useEffect, useRef } from 'react';
import TopMenu from '../components/TopMenu';
import focusManager from '../utils/focusManager.ts';

/**
 * PUBLIC_INTERFACE
 * Simple Login page with focusable inputs and button (no backend).
 */
export default function Login() {
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passRef = useRef<HTMLInputElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.setAttribute('role', 'textbox');
      emailRef.current.onfocus = () => focusManager.setCurrent('login-form', 0);
      focusManager.register('login-email', 'login-form', emailRef.current, 0);
    }
    if (passRef.current) {
      passRef.current.setAttribute('role', 'textbox');
      passRef.current.onfocus = () => focusManager.setCurrent('login-form', 1);
      focusManager.register('login-pass', 'login-form', passRef.current, 1);
    }
    if (btnRef.current) {
      btnRef.current.setAttribute('role', 'button');
      btnRef.current.onfocus = () => focusManager.setCurrent('login-form', 2);
      focusManager.register('login-submit', 'login-form', btnRef.current, 2);
    }
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Login submitted (placeholder)');
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && document.activeElement === btnRef.current) {
      btnRef.current?.click();
    }
  };

  return (
    <>
      <TopMenu />
      <main className="container section" style={{ marginTop: 20, maxWidth: 520 }}>
        <h2>Login</h2>
        <form onSubmit={onSubmit} onKeyDown={onKeyDown} aria-label="Login form">
          <div style={{ display: 'grid', gap: 12 }}>
            <input
              ref={emailRef}
              tabIndex={0}
              type="email"
              placeholder="Email"
              aria-label="Email"
              style={{ padding: 12, borderRadius: 8, border: '1px solid rgba(0,0,0,0.12)' }}
            />
            <input
              ref={passRef}
              tabIndex={-1}
              type="password"
              placeholder="Password"
              aria-label="Password"
              style={{ padding: 12, borderRadius: 8, border: '1px solid rgba(0,0,0,0.12)' }}
            />
            <button
              ref={btnRef}
              tabIndex={-1}
              className="menu-item"
              aria-label="Login"
              style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: 12, borderRadius: 10, fontWeight: 700 }}
              type="submit"
            >
              Login
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
