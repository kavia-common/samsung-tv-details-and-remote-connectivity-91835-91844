import React from 'react';
import TopNav from '../components/TopNav';
import '../styles/theme.css';

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
 */
export default function Home() {
  const rails = [
    { title: 'Top Trending', images: railImages },
    { title: 'Continue Watching', images: railImages },
    { title: 'Action', images: railImages },
    { title: 'Drama', images: railImages },
    { title: 'Horror', images: railImages },
    { title: 'Comedy', images: railImages },
  ];

  const subs = [
    { name: 'Basic', price: '$4.99/mo', desc: '720p • 1 screen' },
    { name: 'Standard', price: '$9.99/mo', desc: '1080p • 2 screens' },
    { name: 'Premium', price: '$14.99/mo', desc: '4K • 4 screens' },
  ];

  return (
    <div className="page">
      <TopNav />
      <div className="container">
        <div className="banner">
          <img src={hero} alt="Featured" />
          <div className="banner-overlay" />
          <div className="banner-title">Featured Tonight</div>
        </div>

        {rails.map((rail) => (
          <section key={rail.title}>
            <h3 className="section-title">{rail.title}</h3>
            <div className="rail">
              {rail.images.map((img, idx) => (
                <div className="card" key={`${rail.title}-${idx}`}>
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
