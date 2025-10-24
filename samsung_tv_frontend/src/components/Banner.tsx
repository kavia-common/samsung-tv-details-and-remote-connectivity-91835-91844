import React from 'react';

// PUBLIC_INTERFACE
export default function Banner() {
  /** Displays a featured banner using local asset */
  return (
    <div className="banner section" role="img" aria-label="Featured Banner">
      <img src="/assets/banner.jpg" alt="Featured" />
      <div className="banner-overlay" />
      <div className="banner-title">Featured This Week</div>
    </div>
  );
}
