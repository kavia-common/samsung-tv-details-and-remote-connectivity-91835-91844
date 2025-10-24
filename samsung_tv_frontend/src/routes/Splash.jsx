import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function Splash() {
  /** Splash shows "MyTV" and navigates to /home after ~3 seconds with a fade effect. */
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      const t2 = setTimeout(() => navigate('/home', { replace: true }), 350);
      return () => clearTimeout(t2);
    }, 5000);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className={`splash ${visible ? 'fade-enter-active' : 'fade-exit-active'}`}>
      <div className="splash-title" aria-label="MyTV">MyTV</div>
    </div>
  );
}
