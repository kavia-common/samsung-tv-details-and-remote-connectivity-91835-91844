import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import remoteService, { RemoteStatus, RemoteEvent } from '../services/RemoteService.ts';

// PUBLIC_INTERFACE
export type RemoteContextValue = {
  status: RemoteStatus;
  lastMessage?: any;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  sendKey: (key: string) => Promise<boolean>;
};

const RemoteContext = createContext<RemoteContextValue | undefined>(undefined);

// PUBLIC_INTERFACE
export function useRemote() {
  /** Hook to access remote connectivity state and actions. */
  const ctx = useContext(RemoteContext);
  if (!ctx) throw new Error('useRemote must be used within RemoteProvider');
  return ctx;
}

// PUBLIC_INTERFACE
export function RemoteProvider({ children }: { children: React.ReactNode }) {
  /** Provider that subscribes to RemoteService and exposes status and actions. */
  const [status, setStatus] = useState<RemoteStatus>(remoteService.getStatus());
  const [lastMessage, setLastMessage] = useState<any>(undefined);

  useEffect(() => {
    const off = remoteService.on((e: RemoteEvent) => {
      if (e.type === 'status') setStatus(e.status);
      if (e.type === 'message') setLastMessage(e.data);
      if (e.type === 'error') {
        setLastMessage({ type: 'error', message: e.error, t: Date.now() });
      }
    });
    return off;
  }, []);

  const value = useMemo<RemoteContextValue>(() => ({
    status,
    lastMessage,
    isConnected: remoteService.isConnected(),
    connect: () => remoteService.connect(),
    disconnect: () => remoteService.disconnect(),
    sendKey: async (k: string) => {
      // Defensive: Do not throw; RemoteService already no-ops when not connected.
      try {
        return await remoteService.sendKey(k);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('sendKey guarded error:', e);
        return false;
      }
    },
  }), [status, lastMessage]);

  return <RemoteContext.Provider value={value}>{children}</RemoteContext.Provider>;
}
