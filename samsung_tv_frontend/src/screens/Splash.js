import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/theme.css';

/**
 * PUBLIC_INTERFACE
 * Splash screen that shows "MyTV" for 3 seconds and then navigates to /home.
 */
export default function Splash() {
  const navigate = useNavigate();
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFade(true), 2200);
    const t2 = setTimeout(() => navigate('/home', { replace: true }), 3000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [navigate]);

  return (
    <div className="page" style={{
      display: 'grid',
      placeItems: 'center'
    }}>
      <div style={{
        textAlign: 'center',
        transition: 'opacity 0.6s ease',
        opacity: fade ? 0 : 1
      }}>
        <div style={{
          display: 'inline-block',
          padding: '24px 36px',
          borderRadius: '16px',
          background: 'white',
          boxShadow: '0 20px 60px rgba(37,99,235,0.2)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{
            fontSize: '42px',
            fontWeight: 900,
            color: 'var(--primary)',
            letterSpacing: '1px'
          }}>
            MyTV
          </div>
          <div style={{ marginTop: 8, color: '#6b7280', fontWeight: 500 }}>
            Loading your experience...
          </div>
        </div>
      </div>
    </div>
  );
}
