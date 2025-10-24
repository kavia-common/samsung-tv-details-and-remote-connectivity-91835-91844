import React from 'react';
import TopNav from '../components/TopNav';
import '../styles/theme.css';

/**
 * PUBLIC_INTERFACE
 * MyPlan page that shows "Hello World".
 */
export default function MyPlan() {
  return (
    <div className="page">
      <TopNav />
      <div className="container">
        <h2 className="section-title">My Plan</h2>
        <div style={{
          background: 'var(--surface)',
          border: '1px solid #eef2f7',
          borderRadius: '12px',
          padding: 20,
          boxShadow: 'var(--shadow-sm)'
        }}>
          Hello World
        </div>
      </div>
    </div>
  );
}
