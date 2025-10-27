import React, { createContext, useContext, useEffect, useMemo } from 'react';
import tizenRemote, { NormalizedKey } from '../services/tizenRemote.ts';

// PUBLIC_INTERFACE
export type RemoteKeyHandlers = {
  onLeft?: (e: KeyboardEvent) => void;
  onRight?: (e: KeyboardEvent) => void;
  onUp?: (e: KeyboardEvent) => void;
  onDown?: (e: KeyboardEvent) => void;
  onEnter?: (e: KeyboardEvent) => void;
  onBack?: (e: KeyboardEvent) => void;
};

// PUBLIC_INTERFACE
export type RemoteProviderValue = {
  /** Register per-component key handlers; returns unregister fn. */
  register: (handlers: RemoteKeyHandlers) => () => void;
};

const RemoteKeysContext = createContext<RemoteProviderValue | undefined>(undefined);

// Maintain a stack so the most recently registered handlers receive the events first
const handlerStack: RemoteKeyHandlers[] = [];

function dispatchKey(k: NormalizedKey, ev: KeyboardEvent) {
  // Iterate from top (most recent)
  for (let i = handlerStack.length - 1; i >= 0; i--) {
    const h = handlerStack[i];
    if (k === 'LEFT' && h.onLeft) return void h.onLeft(ev);
    if (k === 'RIGHT' && h.onRight) return void h.onRight(ev);
    if (k === 'UP' && h.onUp) return void h.onUp(ev);
    if (k === 'DOWN' && h.onDown) return void h.onDown(ev);
    if (k === 'ENTER' && h.onEnter) return void h.onEnter(ev);
    if (k === 'BACK' && h.onBack) return void h.onBack(ev);
  }
}

// PUBLIC_INTERFACE
export function RemoteProvider({ children }: { children: React.ReactNode }) {
  /** Provider that subscribes once to tizenRemote and exposes a register API for components. */
  useEffect(() => {
    const off = tizenRemote.subscribe((key, ev) => {
      dispatchKey(key, ev);
    });
    return off;
  }, []);

  const value = useMemo<RemoteProviderValue>(() => ({
    register: (handlers: RemoteKeyHandlers) => {
      handlerStack.push(handlers);
      return () => {
        const idx = handlerStack.indexOf(handlers);
        if (idx >= 0) handlerStack.splice(idx, 1);
      };
    }
  }), []);

  return <RemoteKeysContext.Provider value={value}>{children}</RemoteKeysContext.Provider>;
}

// PUBLIC_INTERFACE
export function useRemoteKeys() {
  /** Access the Remote keys provider for registering handlers. */
  const ctx = useContext(RemoteKeysContext);
  if (!ctx) throw new Error('useRemoteKeys must be used within RemoteProvider');
  return ctx;
}
