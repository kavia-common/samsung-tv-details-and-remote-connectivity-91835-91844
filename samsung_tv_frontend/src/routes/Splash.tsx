import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * Splash screen showing 'MyTV' for ~3 seconds then routes to /home with fade-out.
 */
export default function Splash() {
  const navigate = useNavigate();
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setFade(true), 2500);
    const timer2 = setTimeout(() => navigate('/home', { replace: true }), 3000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [navigate]);

  return (
    <div className={`splash ${fade ? 'splash-fade' : ''}`}>
      <div className="splash-title">MyTV</div>
    </div>
  );
}
