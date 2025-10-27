import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import remoteService, { RemoteStatus, RemoteEvent } from '../services/RemoteService.ts';

// PUBLIC_INTERFACE
export type RemoteContextValue = {
  status: RemoteStatus;
  lastMessage?: any;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  sendKey: (key: string) => Promise<void>;
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
    connect: () => remoteService.connect(),
    disconnect: () => remoteService.disconnect(),
    sendKey: (k: string) => remoteService.sendKey(k),
  }), [status, lastMessage]);

  return <RemoteContext.Provider value={value}>{children}</RemoteContext.Provider>;
}
