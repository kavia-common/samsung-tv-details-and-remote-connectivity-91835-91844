import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Banner displays a hero image with title/subtitle overlay.
 * Props:
 *  - image: string URL
 *  - title: string
 *  - subtitle: string
 */
export default function Banner({ image, title, subtitle }) {
  return (
    <div className="banner" style={{ backgroundImage: `url(${image})` }} aria-label="Featured">
      <div className="banner-content">
        <div className="banner-title">{title}</div>
        <div className="banner-subtitle">{subtitle}</div>
      </div>
    </div>
  );
}
