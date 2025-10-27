import React, { useEffect, useRef } from 'react';
import TopMenu from '../components/TopMenu';
import Banner from '../components/Banner';
import Rail from '../components/Rail';
import focusManager from '../utils/focusManager.ts';

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
  ];

  const subscriptionRefs = useRef<Array<HTMLButtonElement | null>>([]);

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

  return (
    <>
      <TopMenu />
      <main className="container">
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
    </>
  );
}
