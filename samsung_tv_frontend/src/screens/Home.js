import React, { useEffect, useMemo, useRef, useState } from 'react';
import TopNav from '../components/TopNav';
import '../styles/theme.css';
import FocusManager from '../remote/FocusManager';

// Local hero/banner image
import hero from '../assets/hero/hero1.jpg';

// Rails placeholder images (reuse across categories)
import t1 from '../assets/trending/t1.jpg';
import t2 from '../assets/trending/t2.jpg';
import t3 from '../assets/trending/t3.jpg';
import t4 from '../assets/trending/t4.jpg';
import t5 from '../assets/trending/t5.jpg';

const railImages = [t1, t2, t3, t4, t5];

/**
 * PUBLIC_INTERFACE
 * Home screen with navigation, banner, rails, and subscriptions.
 * Supports Samsung remote focus navigation for top menu and rails.
 */
export default function Home() {
  const rails = useMemo(() => ([
    { title: 'Top Trending', images: railImages },
    { title: 'Continue Watching', images: railImages },
    { title: 'Action', images: railImages },
    { title: 'Drama', images: railImages },
    { title: 'Horror', images: railImages },
    { title: 'Comedy', images: railImages },
  ]), []);

  const [focus, setFocus] = useState({ scope: 'menu', row: 0, index: 0 });
  const railRefs = useRef([]);

  useEffect(() => {
    const fm = new FocusManager({
      rows: rails.length,
      getRowLength: (row) => rails[row]?.images?.length || 0,
      onChange: (state) => setFocus(state),
      onAction: (action, payload) => {
        if (action === 'enter') {
          if (payload.scope === 'rails') {
            const title = rails[payload.row]?.title || '';
            const item = payload.index + 1;
            // Log selection for now
            // eslint-disable-next-line no-console
            console.log(`Selected: ${title} #${item}`);
          }
        }
        if (action === 'back') {
          // default back behavior could be handled by router elsewhere
          // eslint-disable-next-line no-console
          console.log('Back pressed');
        }
      }
    });
    // Start focus on menu
    document.body.setAttribute('data-focus-scope', 'menu');

    return () => fm.destroy();
  }, [rails]);

  // Auto-scroll focused item into view for better TV UX
  useEffect(() => {
    if (focus.scope !== 'rails') return;
    const rowEl = railRefs.current[focus.row];
    if (!rowEl) return;
    const itemEl = rowEl.querySelector(`[data-rail-index="${focus.index}"]`);
    if (itemEl) {
      itemEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [focus]);

  const subs = [
    { name: 'Basic', price: '$4.99/mo', desc: '720p • 1 screen' },
    { name: 'Standard', price: '$9.99/mo', desc: '1080p • 2 screens' },
    { name: 'Premium', price: '$14.99/mo', desc: '4K • 4 screens' },
  ];

  const cardStyle = (row, idx) => {
    const focused = focus.scope === 'rails' && focus.row === row && focus.index === idx;
    return {
      background: 'var(--surface)',
      borderRadius: 12,
      overflow: 'hidden',
      border: focused ? '2px solid #2563EB' : '1px solid #eef2f7',
      boxShadow: focused ? '0 0 0 4px rgba(37,99,235,0.2), var(--shadow-lg)' : 'var(--shadow-md)',
      transform: focused ? 'translateY(-2px) scale(1.02)' : 'none',
      transition: 'transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease'
    };
  };

  return (
    <div className="page">
      <TopNav enableRemote />
      <div className="container">
        <div className="banner">
          <img src={hero} alt="Featured" />
          <div className="banner-overlay" />
          <div className="banner-title">Featured Tonight</div>
        </div>

        {rails.map((rail, rIdx) => (
          <section key={rail.title}>
            <h3 className="section-title">{rail.title}</h3>
            <div className="rail" ref={(el) => { railRefs.current[rIdx] = el; }}>
              {rail.images.map((img, idx) => (
                <div
                  className="card"
                  key={`${rail.title}-${idx}`}
                  data-rail-row={rIdx}
                  data-rail-index={idx}
                  style={cardStyle(rIdx, idx)}
                >
                  <img src={img} alt={`${rail.title} ${idx + 1}`} />
                  <div className="caption">Title {idx + 1}</div>
                </div>
              ))}
            </div>
          </section>
        ))}

        <section style={{ marginTop: 20 }}>
          <h3 className="section-title">Available subscriptions</h3>
          <div className="subscriptions">
            {subs.map((s) => (
              <div key={s.name} className="sub-card">
                <div style={{ fontWeight: 800, color: 'var(--text)' }}>{s.name}</div>
                <div style={{ color: 'var(--muted)', margin: '6px 0 10px' }}>{s.desc}</div>
                <button className="btn" aria-label={`Choose ${s.name}`}>
                  {s.price}
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
