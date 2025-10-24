import React from 'react';

type RailProps = {
  title: string;
  images: string[];
};

// PUBLIC_INTERFACE
export default function Rail({ title, images }: RailProps) {
  /** Horizontal scroll rail showing thumbnails from local assets */
  return (
    <div className="rail">
      <h3>{title}</h3>
      <div className="rail-row" role="list">
        {images.map((src, idx) => (
          <button
            key={idx}
            className="thumbnail"
            role="listitem"
            aria-label={`${title} item ${idx + 1}`}
          >
            <img src={src} alt={`${title} ${idx + 1}`} />
          </button>
        ))}
      </div>
    </div>
  );
}
