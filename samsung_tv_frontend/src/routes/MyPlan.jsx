import React from 'react';

// PUBLIC_INTERFACE
export default function MyPlan() {
  /** My Plan page showing 'Hello World' centered. */
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: 'calc(100vh - 0px)',
      fontSize: 48,
      fontWeight: 800
    }}>
      Hello World
    </div>
  );
}
