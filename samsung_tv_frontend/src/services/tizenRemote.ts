//
// PUBLIC_INTERFACE
// tizenRemote: Small utility to integrate Samsung Tizen TV remote keys.
// - Registers core keys using tizen.tvinputdevice when available
// - Adds a document-level keydown listener that normalizes LEFT/RIGHT/ENTER/RETURN/BACK to standard keys
// - Provides subscribe/unsubscribe API to receive normalized key events
//
// Guards:
// - Feature detect window.tizen and window.tizen.tvinputdevice
// - Works in desktop browsers via Arrow/Escape fallback
//

export type NormalizedKey =
  | 'LEFT'
  | 'RIGHT'
  | 'UP'
  | 'DOWN'
  | 'ENTER'
  | 'BACK';

type Listener = (key: NormalizedKey, ev: KeyboardEvent) => void;

const TIZEN_BACK_KEY_CODE = 10009; // RETURN/BACK on Samsung TV
const KEYMAP: Record<string | number, NormalizedKey | undefined> = {
  ArrowLeft: 'LEFT',
  ArrowRight: 'RIGHT',
  ArrowUp: 'UP',
  ArrowDown: 'DOWN',
  Enter: 'ENTER',
  Escape: 'BACK',
  // numeric fallbacks (legacy keyCode)
  37: 'LEFT',
  39: 'RIGHT',
  38: 'UP',
  40: 'DOWN',
  13: 'ENTER',
};

class TizenRemote {
  private listeners = new Set<Listener>();
  private bound = false;
  private keydownHandler?: (e: KeyboardEvent) => void;

  // PUBLIC_INTERFACE
  init() {
    /** Initialize Tizen remote integration (idempotent). */
    if (this.bound) return;
    this.registerTizenKeys();
    this.attachListener();
    this.bound = true;
  }

  // PUBLIC_INTERFACE
  destroy() {
    /** Remove listeners (if any). */
    if (this.keydownHandler) {
      document.removeEventListener('keydown', this.keydownHandler);
      this.keydownHandler = undefined;
    }
    this.bound = false;
  }

  // PUBLIC_INTERFACE
  subscribe(fn: Listener) {
    /** Subscribe to normalized key events. Returns an unsubscribe function. */
    this.listeners.add(fn);
    this.init();
    return () => {
      this.listeners.delete(fn);
      if (this.listeners.size === 0) {
        this.destroy();
      }
    };
  }

  private registerTizenKeys() {
    const w = window as any;
    try {
      if (w && w.tizen && w.tizen.tvinputdevice && typeof w.tizen.tvinputdevice.registerKey === 'function') {
        // Core navigation keys are usually available by default; explicitly register RETURN/BACK
        w.tizen.tvinputdevice.registerKey('Return');
        // Optionally color keys (left as example)
        // w.tizen.tvinputdevice.registerKey('ColorF0Red');
        // w.tizen.tvinputdevice.registerKey('ColorF1Green');
        // w.tizen.tvinputdevice.registerKey('ColorF2Yellow');
        // w.tizen.tvinputdevice.registerKey('ColorF3Blue');
      }
    } catch {
      // No-op: not on Tizen or registration failed
    }
  }

  private attachListener() {
    this.keydownHandler = (e: KeyboardEvent) => {
      const norm = this.normalizeKey(e);
      if (!norm) return;
      // Prevent default to avoid unwanted scrolling/back behavior
      e.preventDefault();

      // Dispatch to listeners
      this.listeners.forEach((l) => {
        try {
          l(norm, e);
        } catch {
          // ignore
        }
      });
    };

    document.addEventListener('keydown', this.keydownHandler, { passive: false });
  }

  private normalizeKey(e: KeyboardEvent): NormalizedKey | undefined {
    // Tizen back key code
    if (typeof (e as any).keyCode === 'number' && (e as any).keyCode === TIZEN_BACK_KEY_CODE) {
      return 'BACK';
    }
    // Standard keys
    if (e.key && KEYMAP[e.key]) {
      return KEYMAP[e.key];
    }
    // Legacy keyCode fallback
    const code = (e as any).keyCode;
    if (typeof code === 'number' && KEYMAP[code]) {
      return KEYMAP[code];
    }
    return undefined;
  }
}

const tizenRemote = new TizenRemote();
export default tizenRemote;
