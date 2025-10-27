import React from 'react';
import TopMenu from '../components/TopMenu';

/**
 * PUBLIC_INTERFACE
 * Settings stub page to satisfy routing and menu navigation.
 * Displays a simple placeholder content under the Ocean Professional theme.
 */
export default function Settings() {
  return (
    <>
      <TopMenu />
      <main className="container section" style={{ marginTop: 20 }}>
        <h2>Settings</h2>
        <p>Settings placeholder page.</p>
      </main>
    </>
  );
}
