import React, { useEffect, useRef } from 'react';
import focusManager from '../utils/focusManager.ts';

// PUBLIC_INTERFACE
export default function Banner() {
  /** Displays a featured banner using local asset */
  const bannerBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (bannerBtnRef.current) {
      bannerBtnRef.current.setAttribute('aria-label', 'Featured This Week banner');
      bannerBtnRef.current.onfocus = () => focusManager.setCurrent('banner', 0);
      focusManager.register('banner-0', 'banner', bannerBtnRef.current, 0);
    }
  }, []);

  return (
    <div className="banner section" role="group" aria-label="Featured Banner">
      <img src="/assets/banner.jpg" alt="Featured this week" />
      <div className="banner-overlay" />
      <div className="banner-title">Featured This Week</div>
      <button
        ref={bannerBtnRef}
        className="menu-item"
        style={{ position: 'absolute', right: 16, bottom: 16 }}
        aria-label="Open featured details"
      >
        Explore
      </button>
    </div>
  );
}
