import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopMenu from '../components/TopMenu';
import Banner from '../components/Banner';
import Rail from '../components/Rail';

// PUBLIC_INTERFACE
export default function Home() {
  /**
   * Keyboard focus model:
   *  - focusArea: 'menu' | { railIndex: number }
   *  - focusedMenuIndex: number
   *  - railsFocus: record railIndex -> focused item index
   */
  const navigate = useNavigate();
  const menuItems = useMemo(() => ([
    { label: 'Home', to: '/home', aliases: ['/'] },
    { label: 'Login', to: '/login' },
    { label: 'Setting', to: '/settings' },
    { label: 'My Plan', to: '/my-plan' }
  ]), []);

  const railsData = useMemo(() => ({
    trending: {
      title: 'Top Trending',
      items: [
        { image: '/assets/thumbs/trending1.jpg' },
        { image: '/assets/thumbs/action1.jpg' },
        { image: '/assets/thumbs/drama1.jpg' },
        { image: '/assets/thumbs/horror1.jpg' },
        { image: '/assets/thumbs/action2.jpg' }
      ]
    },
    continue: {
      title: 'Continue Watching',
      items: [
        { image: '/assets/thumbs/continue1.jpg' },
        { image: '/assets/thumbs/action2.jpg' },
        { image: '/assets/thumbs/drama1.jpg' }
      ]
    },
    action: {
      title: 'Action',
      items: [
        { image: '/assets/thumbs/action1.jpg' },
        { image: '/assets/thumbs/action2.jpg' },
        { image: '/assets/thumbs/trending1.jpg' }
      ]
    },
    drama: {
      title: 'Drama',
      items: [
        { image: '/assets/thumbs/drama1.jpg' },
        { image: '/assets/thumbs/continue1.jpg' },
        { image: '/assets/thumbs/action1.jpg' }
      ]
    },
    horror: {
      title: 'Horror',
      items: [
        { image: '/assets/thumbs/horror1.jpg' },
        { image: '/assets/thumbs/drama1.jpg' },
        { image: '/assets/thumbs/action2.jpg' }
      ]
    },
    generic: {
      title: 'Recommended',
      items: [
        { image: '/assets/thumbs/action1.jpg' },
        { image: '/assets/thumbs/horror1.jpg' },
        { image: '/assets/thumbs/drama1.jpg' },
        { image: '/assets/thumbs/trending1.jpg' }
      ]
    }
  }), []);

  const railsList = useMemo(() => Object.values(railsData), [railsData]);

  const [focusArea, setFocusArea] = useState('menu'); // 'menu' or number (railIndex)
  const [focusedMenuIndex, setFocusedMenuIndex] = useState(0);
  const [railsFocus, setRailsFocus] = useState(() => railsList.map(() => 0));

  // Handle remote-like keys
  useEffect(() => {
    const onKeyDown = (e) => {
      const key = e.key;
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Enter'].includes(key)) {
        e.preventDefault();
      }
      if (key === 'ArrowUp') {
        if (focusArea !== 'menu') {
          setFocusArea('menu');
        }
      } else if (key === 'ArrowDown') {
        if (focusArea === 'menu') {
          setFocusArea(0); // go to first rail
        } else if (typeof focusArea === 'number') {
          const next = Math.min(focusArea + 1, railsList.length - 1);
          setFocusArea(next);
        }
      } else if (key === 'ArrowLeft') {
        if (focusArea === 'menu') {
          setFocusedMenuIndex((i) => Math.max(0, i - 1));
        } else if (typeof focusArea === 'number') {
          setRailsFocus((arr) => {
            const copy = [...arr];
            copy[focusArea] = Math.max(0, copy[focusArea] - 1);
            return copy;
          });
        }
      } else if (key === 'ArrowRight') {
        if (focusArea === 'menu') {
          setFocusedMenuIndex((i) => Math.min(menuItems.length - 1, i + 1));
        } else if (typeof focusArea === 'number') {
          setRailsFocus((arr) => {
            const copy = [...arr];
            const max = railsList[focusArea].items.length - 1;
            copy[focusArea] = Math.min(max, copy[focusArea] + 1);
            return copy;
          });
        }
      } else if (key === 'Enter') {
        if (focusArea === 'menu') {
          const item = menuItems[focusedMenuIndex];
          if (item) {
            navigate(item.to);
          }
        } else if (typeof focusArea === 'number') {
          // For demo, pressing Enter on a card moves focus back to menu
          setFocusArea('menu');
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [focusArea, focusedMenuIndex, menuItems, navigate, railsList]);

  return (
    <div className="home">
      <TopMenu focusedIndex={focusArea === 'menu' ? focusedMenuIndex : -1} items={menuItems} />
      <Banner image="/assets/banners/banner1.jpg" title="Featured Tonight" subtitle="Blockbuster action and drama" />
      <div className="rails">
        {railsList.map((rail, idx) => (
          <Rail
            key={rail.title}
            title={rail.title}
            items={rail.items}
            focusedIndex={focusArea === idx ? railsFocus[idx] : -1}
          />
        ))}
        <div className="section">
          <h3 style={{ marginTop: 0 }}>Subscriptions</h3>
          <div style={{ color: 'var(--muted)' }}>
            Subscribe to MyTV Plus for ad‑free viewing and early access to new releases.
          </div>
        </div>
      </div>
    </div>
  );
}
