import React from 'react';
import TopNav from '../components/TopNav';
import '../styles/theme.css';

/**
 * PUBLIC_INTERFACE
 * Settings page placeholder.
 */
export default function Settings() {
  return (
    <div className="page">
      <TopNav />
      <div className="container">
        <h2 className="section-title">Settings</h2>
        <div style={{
          background: 'var(--surface)',
          border: '1px solid #eef2f7',
          borderRadius: '12px',
          padding: 16,
          boxShadow: 'var(--shadow-sm)',
          maxWidth: 720
        }}>
          <div style={{ color: 'var(--muted)' }}>
            Configure your Samsung TV app preferences here.
          </div>
        </div>
      </div>
    </div>
  );
}
