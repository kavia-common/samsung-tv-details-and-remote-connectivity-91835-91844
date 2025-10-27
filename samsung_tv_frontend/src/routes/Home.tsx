import React, { useEffect, useRef, useState } from 'react';
import TopMenu from '../components/TopMenu';
import Banner from '../components/Banner';
import Rail from '../components/Rail';
import { useRemote } from '../store/RemoteContext.tsx';
import { useRemoteKeys } from '../store/RemoteProvider.tsx';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * Home page per spec: Top menu, banner section, rails (Top Trending, Continue Watching, Action, Drama, Horror),
 * and an Available Subscriptions section. Thumbnails use local images with graceful fallbacks.
 */
export default function Home() {
  const { status, lastMessage, connect, disconnect, sendKey, isConnected } = useRemote();
  const { register } = useRemoteKeys();
  const navigate = useNavigate();
  const location = useLocation();

  // Register a minimal BACK handler for this screen (other keys are handled by components like TopMenu)
  useEffect(() => {
    const unregister = register({
      onBack: () => {
        // If already at /home, do nothing (or could open overlay)
        if (location.pathname !== '/home') {
          navigate('/home', { replace: true });
        }
      }
    });
    return unregister;
  }, [register, navigate, location.pathname]);

  // Helper to reference local placeholder images from /assets path.
  const img = (name: string) => `/assets/${name}`;

  const rails = [
    { title: 'Top Trending', images: ['trending1.jpg', 'trending2.jpg', 'trending3.jpg', 'trending4.jpg', 'trending5.jpg', 'trending6.jpg'].map(img) },
    { title: 'Continue Watching', images: ['continue1.jpg', 'continue2.jpg', 'continue3.jpg', 'continue4.jpg', 'continue5.jpg'].map(img) },
    { title: 'Action', images: ['action1.jpg', 'action2.jpg', 'action3.jpg', 'action4.jpg', 'action5.jpg'].map(img) },
    { title: 'Drama', images: ['drama1.jpg', 'drama2.jpg', 'drama3.jpg', 'drama4.jpg', 'drama5.jpg'].map(img) },
    { title: 'Horror', images: ['horror1.jpg', 'horror2.jpg', 'horror3.jpg', 'horror4.jpg', 'horror5.jpg'].map(img) },
  ];

  const subscriptionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [showRemote, setShowRemote] = useState(false);

  const tvInfoCardStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1.2fr .8fr',
    gap: 16,
    padding: 16,
    borderRadius: 16,
    background: 'linear-gradient(180deg, rgba(37,99,235,0.06), rgba(255,255,255,1))',
    border: '1px solid rgba(0,0,0,0.06)',
    boxShadow: '0 10px 24px rgba(0,0,0,0.08)',
  };

  const pill = (text: string, color: string) => (
    <span style={{
      display: 'inline-block', padding: '6px 10px', borderRadius: 999,
      background: color, color: 'white', fontSize: 12, fontWeight: 700, letterSpacing: .3
    }}>{text}</span>
  );

  const statusPill = status === 'connected'
    ? pill('CONNECTED', '#10B981')
    : status === 'connecting'
      ? pill('CONNECTING', '#F59E0B')
      : status === 'error'
        ? pill('ERROR', '#EF4444')
        : pill('DISCONNECTED', '#6B7280');

  const actionButtonStyle: React.CSSProperties = {
    minWidth: 220, height: 110, display: 'grid', placeItems: 'center',
    borderRadius: 12, background: 'var(--surface-bg)', border: '1px solid rgba(0,0,0,0.06)',
    boxShadow: '0 6px 16px rgba(0,0,0,0.06)'
  };

  const openRemoteOverlay = () => setShowRemote(true);
  const closeRemoteOverlay = () => setShowRemote(false);

  return (
    <>
      <TopMenu />
      <main className="container">
        {/* TV Details summary + actions (kept minimal to meet layout without altering spec elements) */}
        <section className="section" role="group" aria-label="TV details and connectivity">
          <div style={tvInfoCardStyle}>
            <div>
              <h2 style={{ margin: '4px 0 8px' }}>Samsung TV</h2>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                <span style={{ color: '#6B7280' }}>Model:</span>
                <strong style={{ letterSpacing: .2 }}>Q90R (Mock)</strong>
                {statusPill}
              </div>
              <div style={{ color: '#6B7280', marginBottom: 8 }}>
                Last activity: {lastMessage?.t ? new Date(lastMessage.t).toLocaleTimeString() : '—'}
              </div>
              <div style={{ color: '#6B7280' }}>Connection: <strong style={{ letterSpacing: .3 }}>{status.toUpperCase()}</strong></div>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                className="thumbnail"
                style={actionButtonStyle}
                aria-label={status !== 'connected' ? 'Connect to TV' : 'Disconnect from TV'}
                onClick={() => (status !== 'connected' ? connect() : disconnect())}
              >
                {status !== 'connected' ? 'Connect' : 'Disconnect'}
              </button>
              <button
                className="thumbnail"
                style={actionButtonStyle}
                aria-label="Open Remote Control"
                onClick={openRemoteOverlay}
              >
                Remote
              </button>
            </div>
          </div>
        </section>

        {/* Banner section with graceful fallback image */}
        <Banner />

        {/* Rails */}
        {rails.map((r, i) => (
          <Rail key={r.title} index={i} title={r.title} images={r.images} />
        ))}

        {/* Available Subscriptions */}
        <section className="section" style={{ marginTop: 28 }} role="group" aria-label="Available subscriptions">
          <h3 style={{ marginTop: 0 }}>Available subscriptions</h3>
          <div className="rail-row" role="listbox" aria-label="Subscription plans">
            <button
              ref={(el) => (subscriptionRefs.current[0] = el)}
              className="thumbnail"
              tabIndex={0}
              aria-label="Basic plan"
              aria-selected="false"
              style={{ minWidth: 260, width: 260, height: 120, display: 'grid', placeItems: 'center', fontWeight: 700, color: 'var(--primary)' }}
            >
              <img
                src="/assets/subscriptions/basic.png"
                alt="Basic logo"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />
              <span>Basic - $4.99</span>
            </button>
            <button
              ref={(el) => (subscriptionRefs.current[1] = el)}
              className="thumbnail"
              tabIndex={-1}
              aria-label="Standard plan"
              aria-selected="false"
              style={{ minWidth: 260, width: 260, height: 120, display: 'grid', placeItems: 'center', fontWeight: 700, color: 'var(--secondary)' }}
            >
              <img
                src="/assets/subscriptions/standard.png"
                alt="Standard logo"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />
              <span>Standard - $9.99</span>
            </button>
            <button
              ref={(el) => (subscriptionRefs.current[2] = el)}
              className="thumbnail"
              tabIndex={-1}
              aria-label="Premium plan"
              aria-selected="false"
              style={{ minWidth: 260, width: 260, height: 120, display: 'grid', placeItems: 'center', fontWeight: 700, color: 'var(--primary)' }}
            >
              <img
                src="/assets/subscriptions/premium.png"
                alt="Premium logo"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />
              <span>Premium - $14.99</span>
            </button>
          </div>
        </section>
      </main>

      {/* Minimal remote overlay retained for completeness; not part of strict spec, but non-conflicting */}
      {showRemote && (
        <div role="dialog" aria-modal="true" aria-label="Remote Control" style={{
          position: 'fixed', inset: 0, background: 'rgba(17,24,39,0.55)',
          display: 'grid', placeItems: 'center', zIndex: 50
        }}
        >
          <div className="section" style={{
            width: 420, borderRadius: 16, padding: 16, background: 'var(--surface-bg)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h3 style={{ margin: 0 }}>Remote Control</h3>
              <button className="menu-item" onClick={closeRemoteOverlay} aria-label="Close remote">Close</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, placeItems: 'center', marginTop: 12 }}>
              <div />
              <button
                className="thumbnail"
                style={{ width: 100, height: 70 }}
                onClick={async () => {
                  const ok = await sendKey('ArrowUp');
                  if (!ok || !isConnected) {
                    // fallback to local navigation: ArrowUp key event
                    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
                  }
                }}
                aria-label="Up"
              >
                ▲
              </button>
              <div />

              <button
                className="thumbnail"
                style={{ width: 100, height: 70 }}
                onClick={async () => {
                  const ok = await sendKey('ArrowLeft');
                  if (!ok || !isConnected) {
                    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
                  }
                }}
                aria-label="Left"
              >
                ◀
              </button>
              <button
                className="thumbnail"
                style={{ width: 100, height: 70, fontWeight: 800 }}
                onClick={async () => {
                  const ok = await sendKey('Enter');
                  if (!ok || !isConnected) {
                    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
                  }
                }}
                aria-label="OK"
              >
                OK
              </button>
              <button
                className="thumbnail"
                style={{ width: 100, height: 70 }}
                onClick={async () => {
                  const ok = await sendKey('ArrowRight');
                  if (!ok || !isConnected) {
                    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
                  }
                }}
                aria-label="Right"
              >
                ▶
              </button>

              <div />
              <button
                className="thumbnail"
                style={{ width: 100, height: 70 }}
                onClick={async () => {
                  const ok = await sendKey('ArrowDown');
                  if (!ok || !isConnected) {
                    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
                  }
                }}
                aria-label="Down"
              >
                ▼
              </button>
              <div />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
