import React, { useEffect, useRef, useState } from 'react';
import TopMenu from '../components/TopMenu';
import Banner from '../components/Banner';
import Rail from '../components/Rail';
import focusManager from '../utils/focusManager.ts';
import { useRemote } from '../store/RemoteContext.tsx';

/**
 * PUBLIC_INTERFACE
 * Home page: TV details, connection controls, remote overlay, banner and rails with keyboard navigation.
 */
export default function Home() {
  const { status, lastMessage, connect, disconnect, sendKey } = useRemote();
  const img = (n: number) => `/assets/thumb${((n - 1) % 10) + 1}.jpg`;

  const rails = [
    { title: 'Top Trending', images: Array.from({ length: 12 }, (_, i) => img(i + 1)) },
    { title: 'Continue Watching', images: Array.from({ length: 8 }, (_, i) => img(i + 3)) },
    { title: 'Action', images: Array.from({ length: 10 }, (_, i) => img(i + 2)) },
    { title: 'Drama', images: Array.from({ length: 10 }, (_, i) => img(i + 4)) },
    { title: 'Horror', images: Array.from({ length: 10 }, (_, i) => img(i + 5)) },
  ];

  const subscriptionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [showRemote, setShowRemote] = useState(false);

  useEffect(() => {
    // Register subscriptions as a focus group
    subscriptionRefs.current.forEach((el, i) => {
      if (el) {
        el.setAttribute('role', 'option');
        el.onfocus = () => focusManager.setCurrent('subscriptions', i);
        focusManager.register(`subscriptions-${i}`, 'subscriptions', el, i);
      }
    });
  }, []);

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
        {/* TV Details and Remote Controls */}
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
                aria-label="Refresh TV status"
                onClick={() => { /* no-op: stubbed refresh could re-check status */ }}
              >
                Refresh
              </button>
              <button
                className="thumbnail"
                style={actionButtonStyle}
                aria-label="Open Settings"
                onClick={() => { window.location.hash = '#/settings'; }}
              >
                Settings
              </button>
              <button
                className="thumbnail"
                style={{ ...actionButtonStyle, background: 'linear-gradient(180deg, rgba(37,99,235,0.08), white)' }}
                aria-label="Open Remote Control"
                onClick={openRemoteOverlay}
              >
                Remote
              </button>
            </div>
          </div>
        </section>

        <Banner />
        {rails.map((r, i) => (
          <Rail key={r.title} index={i} title={r.title} images={r.images} />
        ))}

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
              Basic - $4.99
            </button>
            <button
              ref={(el) => (subscriptionRefs.current[1] = el)}
              className="thumbnail"
              tabIndex={-1}
              aria-label="Standard plan"
              aria-selected="false"
              style={{ minWidth: 260, width: 260, height: 120, display: 'grid', placeItems: 'center', fontWeight: 700, color: 'var(--secondary)' }}
            >
              Standard - $9.99
            </button>
            <button
              ref={(el) => (subscriptionRefs.current[2] = el)}
              className="thumbnail"
              tabIndex={-1}
              aria-label="Premium plan"
              aria-selected="false"
              style={{ minWidth: 260, width: 260, height: 120, display: 'grid', placeItems: 'center', fontWeight: 700, color: 'var(--primary)' }}
            >
              Premium - $14.99
            </button>
          </div>
        </section>
      </main>

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
              <button className="thumbnail" style={{ width: 100, height: 70 }} onClick={() => sendKey('ArrowUp')} aria-label="Up">▲</button>
              <div />

              <button className="thumbnail" style={{ width: 100, height: 70 }} onClick={() => sendKey('ArrowLeft')} aria-label="Left">◀</button>
              <button className="thumbnail" style={{ width: 100, height: 70, fontWeight: 800 }} onClick={() => sendKey('Enter')} aria-label="OK">OK</button>
              <button className="thumbnail" style={{ width: 100, height: 70 }} onClick={() => sendKey('ArrowRight')} aria-label="Right">▶</button>

              <div />
              <button className="thumbnail" style={{ width: 100, height: 70 }} onClick={() => sendKey('ArrowDown')} aria-label="Down">▼</button>
              <div />
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 12 }}>
              <button className="thumbnail" style={{ width: 120, height: 60 }} onClick={() => sendKey('Back')} aria-label="Back">Back</button>
              <button className="thumbnail" style={{ width: 120, height: 60 }} onClick={() => sendKey('Home')} aria-label="Home">Home</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
