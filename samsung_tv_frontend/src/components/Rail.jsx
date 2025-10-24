import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Rail renders a horizontal row of cards. It visually highlights the focused index.
 * Props:
 *  - title: string
 *  - items: array of { image: string, id?: string }
 *  - focusedIndex: number
 */
export default function Rail({ title, items, focusedIndex }) {
  return (
    <div className="rail" aria-label={title}>
      <div className="rail-title">{title}</div>
      <div className="rail-track" role="list">
        {items.map((item, idx) => (
          <div
            key={item.id || `${title}-${idx}`}
            role="listitem"
            className={`card ${focusedIndex === idx ? 'focused' : ''}`}
            style={{ backgroundImage: `url(${item.image})` }}
            aria-label={`${title} item ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
