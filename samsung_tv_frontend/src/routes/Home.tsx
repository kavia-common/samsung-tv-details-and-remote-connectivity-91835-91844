import React from 'react';
import TopMenu from '../components/TopMenu';
import Banner from '../components/Banner';
import Rail from '../components/Rail';

// PUBLIC_INTERFACE
export default function Home() {
  /** Home page: banner, rails, and available subscriptions section */
  const img = (n: number) => `/assets/thumbnails/thumb${((n - 1) % 8) + 1}.jpg`;

  const trending = Array.from({ length: 12 }, (_, i) => img(i + 1));
  const continueWatching = Array.from({ length: 8 }, (_, i) => img(i + 3));
  const action = Array.from({ length: 10 }, (_, i) => img(i + 2));
  const drama = Array.from({ length: 10 }, (_, i) => img(i + 4));
  const horror = Array.from({ length: 10 }, (_, i) => img(i + 5));
  const comedy = Array.from({ length: 10 }, (_, i) => img(i + 6));

  return (
    <>
      <TopMenu />
      <main className="container">
        <Banner />
        <Rail title="Top Trending" images={trending} />
        <Rail title="Continue Watching" images={continueWatching} />
        <Rail title="Action" images={action} />
        <Rail title="Drama" images={drama} />
        <Rail title="Horror" images={horror} />
        <Rail title="Comedy" images={comedy} />

        <section className="section" style={{ marginTop: 28 }}>
          <h3 style={{ marginTop: 0 }}>Available subscriptions</h3>
          <div className="rail-row">
            <div className="thumbnail" style={{ minWidth: 260, width: 260, height: 120, display: 'grid', placeItems: 'center', fontWeight: 700, color: 'var(--primary)' }}>
              Basic - $4.99
            </div>
            <div className="thumbnail" style={{ minWidth: 260, width: 260, height: 120, display: 'grid', placeItems: 'center', fontWeight: 700, color: 'var(--secondary)' }}>
              Standard - $9.99
            </div>
            <div className="thumbnail" style={{ minWidth: 260, width: 260, height: 120, display: 'grid', placeItems: 'center', fontWeight: 700, color: 'var(--primary)' }}>
              Premium - $14.99
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
