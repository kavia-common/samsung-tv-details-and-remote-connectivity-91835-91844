import React, { useEffect, useRef } from 'react';
import TopMenu from '../components/TopMenu';
import Banner from '../components/Banner';
import Rail from '../components/Rail';

/**
 * PUBLIC_INTERFACE
 * Home page: banner, rails, and available subscriptions section with keyboard navigation.
 */
export default function Home() {
  const img = (n: number) => `/assets/thumb${((n - 1) % 10) + 1}.jpg`;

  const rails = [
    { title: 'Top Trending', images: Array.from({ length: 12 }, (_, i) => img(i + 1)) },
    { title: 'Continue Watching', images: Array.from({ length: 8 }, (_, i) => img(i + 3)) },
    { title: 'Action', images: Array.from({ length: 10 }, (_, i) => img(i + 2)) },
    { title: 'Drama', images: Array.from({ length: 10 }, (_, i) => img(i + 4)) },
    { title: 'Horror', images: Array.from({ length: 10 }, (_, i) => img(i + 5)) },
    { title: 'Others', images: Array.from({ length: 10 }, (_, i) => img(i + 6)) },
  ];

  const firstButtonsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const subscriptionRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const handler = (evt: any) => {
      const { fromRail, direction } = evt.detail || {};
      if (direction === 'down') {
        if (fromRail < rails.length - 1) {
          // focus first item of next rail
          const nextRailFirstBtn = document.querySelectorAll('.rail')[fromRail + 1]?.querySelector('.thumbnail') as HTMLButtonElement | null;
          nextRailFirstBtn?.focus();
        } else {
          // move to subscriptions
          subscriptionRefs.current[0]?.focus();
        }
      } else if (direction === 'up') {
        if (fromRail > 0) {
          const prevRailFirstBtn = document.querySelectorAll('.rail')[fromRail - 1]?.querySelector('.thumbnail') as HTMLButtonElement | null;
          prevRailFirstBtn?.focus();
        } else {
          // focus menu (first item)
          const firstMenu = document.querySelector('.top-menu .menu-item') as HTMLAnchorElement | null;
          firstMenu?.focus();
        }
      }
    };
      window.addEventListener('rail-nav' as any, handler as EventListener);
      return () => window.removeEventListener('rail-nav' as any, handler as EventListener);
  }, [rails.length]);

  return (
    <>
      <TopMenu />
      <main className="container">
        <Banner />
        {rails.map((r, i) => (
          <Rail key={r.title} index={i} title={r.title} images={r.images} />
        ))}

        <section className="section" style={{ marginTop: 28 }}>
          <h3 style={{ marginTop: 0 }}>Available subscriptions</h3>
          <div className="rail-row">
            <div
              ref={(el) => (subscriptionRefs.current[0] = el)}
              className="thumbnail"
              tabIndex={0}
              style={{ minWidth: 260, width: 260, height: 120, display: 'grid', placeItems: 'center', fontWeight: 700, color: 'var(--primary)' }}
            >
              Basic - $4.99
            </div>
            <div
              ref={(el) => (subscriptionRefs.current[1] = el)}
              className="thumbnail"
              tabIndex={-1}
              style={{ minWidth: 260, width: 260, height: 120, display: 'grid', placeItems: 'center', fontWeight: 700, color: 'var(--secondary)' }}
            >
              Standard - $9.99
            </div>
            <div
              ref={(el) => (subscriptionRefs.current[2] = el)}
              className="thumbnail"
              tabIndex={-1}
              style={{ minWidth: 260, width: 260, height: 120, display: 'grid', placeItems: 'center', fontWeight: 700, color: 'var(--primary)' }}
            >
              Premium - $14.99
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
