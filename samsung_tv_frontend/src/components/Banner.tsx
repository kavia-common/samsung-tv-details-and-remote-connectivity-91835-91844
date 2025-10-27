import React from 'react';

// PUBLIC_INTERFACE
export default function Banner() {
  /** Displays a featured banner using local asset (/assets/banner.jpg) with graceful fallback. */
  const onImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const el = e.currentTarget;
    el.style.display = 'none';
  };

  return (
    <div className="banner section" aria-label="Featured Banner">
      <img src="/assets/banner.jpg" alt="Featured this week" onError={onImgError} />
      <div className="banner-overlay" />
      <div className="banner-title">Featured This Week</div>
      <button
        className="menu-item"
        style={{ position: 'absolute', right: 16, bottom: 16 }}
        aria-label="Open featured details"
      >
        Explore
      </button>
    </div>
  );
}
