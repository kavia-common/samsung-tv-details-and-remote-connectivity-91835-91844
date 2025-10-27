import React, { useRef } from 'react';
import TopMenu from '../components/TopMenu';

/**
 * PUBLIC_INTERFACE
 * Simple Login page with focusable inputs and button (no backend).
 */
export default function Login() {
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passRef = useRef<HTMLInputElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // No backend; just prevent default
    alert('Login submitted (placeholder)');
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      if (document.activeElement === emailRef.current) {
        passRef.current?.focus();
      } else if (document.activeElement === passRef.current) {
        btnRef.current?.focus();
      }
    } else if (e.key === 'ArrowUp') {
      if (document.activeElement === passRef.current) {
        emailRef.current?.focus();
      } else if (document.activeElement === btnRef.current) {
        passRef.current?.focus();
      }
    } else if (e.key === 'Enter' && document.activeElement === btnRef.current) {
      btnRef.current?.click();
    }
  };

  return (
    <>
      <TopMenu />
      <main className="container section" style={{ marginTop: 20, maxWidth: 520 }}>
        <h2>Login</h2>
        <form onSubmit={onSubmit} onKeyDown={onKeyDown}>
          <div style={{ display: 'grid', gap: 12 }}>
            <input
              ref={emailRef}
              tabIndex={0}
              type="email"
              placeholder="Email"
              style={{ padding: 12, borderRadius: 8, border: '1px solid rgba(0,0,0,0.12)' }}
            />
            <input
              ref={passRef}
              tabIndex={-1}
              type="password"
              placeholder="Password"
              style={{ padding: 12, borderRadius: 8, border: '1px solid rgba(0,0,0,0.12)' }}
            />
            <button
              ref={btnRef}
              tabIndex={-1}
              className="menu-item"
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
