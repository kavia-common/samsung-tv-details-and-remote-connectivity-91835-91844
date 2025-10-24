import React from 'react';
import TopNav from '../components/TopNav';
import '../styles/theme.css';

/**
 * PUBLIC_INTERFACE
 * Login page template with simple form fields.
 */
export default function Login() {
  return (
    <div className="page">
      <TopNav />
      <div className="container">
        <h2 className="section-title">Login</h2>
        <div style={{
          background: 'var(--surface)',
          border: '1px solid #eef2f7',
          borderRadius: '12px',
          boxShadow: 'var(--shadow-md)',
          maxWidth: 440,
          padding: 16
        }}>
          <div style={{ display: 'grid', gap: 10 }}>
            <label>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>Email</div>
              <input placeholder="you@example.com" style={inputStyle} />
            </label>
            <label>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>Password</div>
              <input type="password" placeholder="••••••••" style={inputStyle} />
            </label>
            <button className="btn" style={{ justifyContent: 'center' }}>Sign In</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  border: '1px solid #e5e7eb',
  borderRadius: 10,
  outline: 'none',
  fontSize: 14
};
