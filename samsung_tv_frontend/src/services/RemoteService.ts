 // PUBLIC_INTERFACE
 /**
  * RemoteService: Minimal TV remote connectivity abstraction.
  * Provides connect, disconnect and sendKey methods with in-memory state.
  * This is a stub; can be replaced with actual WebSocket or fetch integration later.
  */
export type RemoteStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export type RemoteEvent =
  | { type: 'status'; status: RemoteStatus }
  | { type: 'message'; data: any }
  | { type: 'error'; error: string };

type Listener = (e: RemoteEvent) => void;

class RemoteService {
  private status: RemoteStatus = 'disconnected';
  private listeners = new Set<Listener>();
  private mockTimer: number | null = null;

  // PUBLIC_INTERFACE
  on(listener: Listener) {
    /** Subscribe to remote events (status/messages/errors). */
    this.listeners.add(listener);
    // push initial status
    listener({ type: 'status', status: this.status });
    return () => this.listeners.delete(listener);
  }

  private emit(e: RemoteEvent) {
    this.listeners.forEach((l) => {
      try { l(e); } catch {}
    });
  }

  // PUBLIC_INTERFACE
  async connect() {
    /** Simulate an async connection establishment. */
    if (this.status === 'connected' || this.status === 'connecting') return;
    this.status = 'connecting';
    this.emit({ type: 'status', status: 'connecting' });

    // Simulate connection delay
    await new Promise((res) => setTimeout(res, 600));
    this.status = 'connected';
    this.emit({ type: 'status', status: 'connected' });

    // Mock incoming pings
    if (this.mockTimer == null) {
      this.mockTimer = window.setInterval(() => {
        this.emit({ type: 'message', data: { type: 'ping', t: Date.now() } });
      }, 5000);
    }
  }

  // PUBLIC_INTERFACE
  async disconnect() {
    /** Disconnect simulated connection. */
    if (this.mockTimer != null) {
      clearInterval(this.mockTimer);
      this.mockTimer = null;
    }
    this.status = 'disconnected';
    this.emit({ type: 'status', status: 'disconnected' });
  }

  // PUBLIC_INTERFACE
  async sendKey(key: string) {
    /** Send a key command to remote (simulated). Throws if not connected. */
    if (this.status !== 'connected') {
      const msg = 'RemoteService: not connected';
      this.emit({ type: 'error', error: msg });
      throw new Error(msg);
    }
    // In a real implementation, send over WebSocket/fetch here
    this.emit({ type: 'message', data: { type: 'key', key, t: Date.now() } });
  }

  // PUBLIC_INTERFACE
  getStatus(): RemoteStatus {
    /** Retrieve current connection status. */
    return this.status;
  }
}

const remoteService = new RemoteService();
export default remoteService;
