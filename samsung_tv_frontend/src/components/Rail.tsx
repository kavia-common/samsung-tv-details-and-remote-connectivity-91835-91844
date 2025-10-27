import React from 'react';

type RailProps = {
  title: string;
  images: string[];
  index?: number;
};

/**
 * PUBLIC_INTERFACE
 * Horizontal scroll rail showing thumbnails from local assets with standard clickable items.
 */
export default function Rail({ title, images }: RailProps) {
  return (
    <div className="rail" aria-label={title}>
      <h3>{title}</h3>
      <div className="rail-row" aria-label={`${title} list`}>
        {images.map((src, i) => (
          <button
            key={i}
            className="thumbnail"
            aria-label={`${title} item ${i + 1}`}
          >
            <img
              src={src}
              alt={`${title} ${i + 1}`}
              onError={(e) => {
                const el = e.currentTarget as HTMLImageElement;
                el.style.display = 'none';
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
