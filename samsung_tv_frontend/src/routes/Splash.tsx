import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function Splash() {
  /** Splash screen showing 'MyTV' then routes to Home after 3 seconds */
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => {
      navigate('/', { replace: true });
    }, 3000);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="splash">
      <div className="splash-title">MyTV</div>
    </div>
  );
}
