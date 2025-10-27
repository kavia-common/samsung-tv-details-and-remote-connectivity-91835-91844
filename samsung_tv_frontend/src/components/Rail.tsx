import React, { useEffect, useRef } from 'react';

type RailProps = {
  title: string;
  images: string[];
  index?: number; // optional rail index for up/down logic
};

/**
 * PUBLIC_INTERFACE
 * Horizontal scroll rail showing thumbnails from local assets with basic keyboard navigation.
 */
export default function Rail({ title, images, index = 0 }: RailProps) {
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    // Initialize tabindex
    itemsRef.current.forEach((btn, i) => btn?.setAttribute('tabindex', i === 0 ? '0' : '-1'));
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const current = document.activeElement as HTMLButtonElement | null;
    const idx = itemsRef.current.findIndex((el) => el === current);
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = Math.min(idx + 1, itemsRef.current.length - 1);
      itemsRef.current[next]?.focus();
      itemsRef.current[next]?.scrollIntoView({ inline: 'center', behavior: 'smooth', block: 'nearest' });
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = Math.max(idx - 1, 0);
      itemsRef.current[prev]?.focus();
      itemsRef.current[prev]?.scrollIntoView({ inline: 'center', behavior: 'smooth', block: 'nearest' });
    } else if (e.key === 'ArrowDown') {
      // allow parent to catch this to move to next rail
      const evt = new CustomEvent('rail-nav', { detail: { fromRail: index, direction: 'down' } });
      window.dispatchEvent(evt);
    } else if (e.key === 'ArrowUp') {
      const evt = new CustomEvent('rail-nav', { detail: { fromRail: index, direction: 'up' } });
      window.dispatchEvent(evt);
    }
  };

  return (
    <div className="rail" onKeyDown={onKeyDown}>
      <h3>{title}</h3>
      <div className="rail-row" role="list">
        {images.map((src, i) => (
          <button
            key={i}
            ref={(el) => (itemsRef.current[i] = el)}
            className="thumbnail"
            role="listitem"
            aria-label={`${title} item ${i + 1}`}
          >
            <img src={src} alt={`${title} ${i + 1}`} />
          </button>
        ))}
      </div>
    </div>
  );
}
