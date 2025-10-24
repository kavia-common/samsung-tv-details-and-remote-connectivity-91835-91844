import React from 'react';
import TopMenu from '../components/TopMenu';

// PUBLIC_INTERFACE
export default function MyPlan() {
  /** My Plan page that shows 'Hello World' per requirements */
  return (
    <>
      <TopMenu />
      <main className="container section" style={{ marginTop: 20 }}>
        <h2>Hello World</h2>
        <p>Welcome to My Plan.</p>
      </main>
    </>
  );
}
