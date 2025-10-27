import React, { useRef } from 'react';
import TopMenu from '../components/TopMenu';

/**
 * PUBLIC_INTERFACE
 * Simple Login page with standard inputs and submit button (no remote key handling).
 */
export default function Login() {
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Login submitted (placeholder)');
  };

  return (
    <>
      <TopMenu />
      <main className="container section" style={{ marginTop: 20, maxWidth: 520 }}>
        <h2>Login</h2>
        <form onSubmit={onSubmit} aria-label="Login form">
          <div style={{ display: 'grid', gap: 12 }}>
            <input
              type="email"
              placeholder="Email"
              aria-label="Email"
              style={{ padding: 12, borderRadius: 8, border: '1px solid rgba(0,0,0,0.12)' }}
            />
            <input
              type="password"
              placeholder="Password"
              aria-label="Password"
              style={{ padding: 12, borderRadius: 8, border: '1px solid rgba(0,0,0,0.12)' }}
            />
            <button
              ref={btnRef}
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
