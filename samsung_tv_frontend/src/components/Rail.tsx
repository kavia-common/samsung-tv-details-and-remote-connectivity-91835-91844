import React, { useEffect, useRef } from 'react';
import focusManager from '../utils/focusManager.ts';

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

  // Map title to a group id
  const groupMap: Record<string, any> = {
    'Top Trending': 'trending',
    'Continue Watching': 'continue',
    'Action': 'genre-action',
    'Drama': 'genre-drama',
    'Horror': 'genre-horror',
  };
  const group = (groupMap[title] || `genre-${index}`) as any;

  useEffect(() => {
    // Initialize tabindex and register with focus manager
    itemsRef.current.forEach((btn, i) => {
      if (btn) {
        btn.setAttribute('tabindex', i === 0 ? '0' : '-1');
        btn.setAttribute('role', 'option');
        btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
        btn.onfocus = () => focusManager.setCurrent(group, i);
        focusManager.register(`${group}-${i}`, group, btn, i);
      }
    });
  }, [group]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const current = document.activeElement as HTMLButtonElement | null;
    const idx = itemsRef.current.findIndex((el) => el === current);
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      // wrap-around
      if (idx === itemsRef.current.length - 1) {
        if (!focusManager.focusFirstInNextGroup()) {
          focusManager.focus(group, 0);
        }
      } else {
        focusManager.focus(group as any, idx + 1);
      }
      itemsRef.current[Math.min(idx + 1, itemsRef.current.length - 1)]?.scrollIntoView({
        inline: 'center', behavior: 'smooth', block: 'nearest'
      });
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (idx <= 0) {
        if (!focusManager.focusFirstInPrevGroup()) {
          focusManager.focus(group as any, itemsRef.current.length - 1);
        }
      } else {
        focusManager.focus(group as any, idx - 1);
      }
      itemsRef.current[Math.max(idx - 1, 0)]?.scrollIntoView({
        inline: 'center', behavior: 'smooth', block: 'nearest'
      });
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      focusManager.focusFirstInNextGroup();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      focusManager.focusFirstInPrevGroup();
    }
  };

  return (
    <div className="rail" onKeyDown={onKeyDown} role="group" aria-roledescription="content rail" aria-label={title}>
      <h3>{title}</h3>
      <div className="rail-row" role="listbox" aria-label={`${title} list`}>
        {images.map((src, i) => (
          <button
            key={i}
            ref={(el) => (itemsRef.current[i] = el)}
            className="thumbnail"
            role="option"
            aria-label={`${title} item ${i + 1}`}
            aria-selected={focusManager.getCurrent().group === group && focusManager.getCurrent().index === i ? 'true' : 'false'}
          >
            <img src={src} alt={`${title} ${i + 1}`} />
          </button>
        ))}
      </div>
    </div>
  );
}
