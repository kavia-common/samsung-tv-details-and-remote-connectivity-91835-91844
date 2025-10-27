type GroupId =
  | 'topmenu'
  | 'banner'
  | 'trending'
  | 'continue'
  | 'genre-action'
  | 'genre-drama'
  | 'genre-horror'
  | 'subscriptions'
  | 'login-form';

type FocusableEntry = {
  id: string;
  group: GroupId;
  el: HTMLElement;
  index: number;
};

type GroupState = {
  elements: FocusableEntry[];
  lastFocusedIndex: number;
};

type CurrentFocus = {
  group: GroupId | null;
  index: number;
};

const STORAGE_KEY = 'tv_focus_state_v1';
const ORDERED_GROUPS: GroupId[] = [
  'topmenu',
  'banner',
  'trending',
  'continue',
  'genre-action',
  'genre-drama',
  'genre-horror',
  'subscriptions',
  'login-form',
];

/**
 * PUBLIC_INTERFACE
 * FocusManager: central registry for focusable elements organized by groups.
 * Keeps last focused index per group, provides APIs to move focus within and across groups,
 * and persists the last focused group/index to sessionStorage.
 */
class FocusManager {
  private groups: Map<GroupId, GroupState> = new Map();
  private current: CurrentFocus = { group: null, index: -1 };

  constructor() {
    this.restoreFromSession();
  }

  private persistToSession() {
    try {
      if (this.current.group != null) {
        const state = {
          group: this.current.group,
          index: this.current.index,
          lastByGroup: Array.from(this.groups.entries()).reduce(
            (acc, [g, st]) => {
              acc[g] = st.lastFocusedIndex;
              return acc;
            },
            {} as Record<string, number>
          ),
        };
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      }
    } catch {
      // ignore
    }
  }

  private restoreFromSession() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed?.group) {
        this.current.group = parsed.group as GroupId;
        this.current.index = typeof parsed.index === 'number' ? parsed.index : 0;
      }
    } catch {
      // ignore
    }
  }

  // PUBLIC_INTERFACE
  register(id: string, group: GroupId, el: HTMLElement, index?: number) {
    /** Register a focusable element into a group, maintaining stable order and lastFocusedIndex */
    const st = this.groups.get(group) || { elements: [], lastFocusedIndex: 0 };
    const existingIdx = st.elements.findIndex((e) => e.id === id);
    const entry: FocusableEntry = {
      id,
      group,
      el,
      index: typeof index === 'number' ? index : st.elements.length,
    };

    if (existingIdx >= 0) {
      st.elements[existingIdx] = entry;
    } else {
      st.elements.push(entry);
      st.elements.sort((a, b) => a.index - b.index);
    }

    // ensure tabindex
    st.elements.forEach((e, i) => {
      e.el.setAttribute('tabindex', i === (st.lastFocusedIndex ?? 0) ? '0' : '-1');
      // ARIA roles and states can be set by caller; we ensure tabIndex only
    });

    this.groups.set(group, st);
  }

  // PUBLIC_INTERFACE
  focus(group: GroupId, index?: number) {
    /** Focus a specific element in group. If index omitted, uses group's lastFocusedIndex. */
    const st = this.groups.get(group);
    if (!st || st.elements.length === 0) return false;
    const idx = typeof index === 'number' ? this.clamp(index, 0, st.elements.length - 1) : (st.lastFocusedIndex ?? 0);
    const el = st.elements[idx]?.el;
    if (el) {
      this.updateTabIndexes(group, idx);
      try { el.focus(); } catch {}
      st.lastFocusedIndex = idx;
      this.current = { group, index: idx };
      this.persistToSession();
      return true;
    }
    return false;
  }

  // PUBLIC_INTERFACE
  focusNext(group: GroupId) {
    /** Move focus to next element in group (wrap-around). */
    const st = this.groups.get(group);
    if (!st || st.elements.length === 0) return false;
    const next = (st.lastFocusedIndex + 1) % st.elements.length;
    return this.focus(group, next);
  }

  // PUBLIC_INTERFACE
  focusPrev(group: GroupId) {
    /** Move focus to previous element in group (wrap-around). */
    const st = this.groups.get(group);
    if (!st || st.elements.length === 0) return false;
    const prev = (st.lastFocusedIndex - 1 + st.elements.length) % st.elements.length;
    return this.focus(group, prev);
  }

  // PUBLIC_INTERFACE
  getCurrent(): CurrentFocus {
    /** Return the currently tracked focused group and index. */
    return { ...this.current };
  }

  private updateTabIndexes(group: GroupId, activeIndex: number) {
    const st = this.groups.get(group);
    if (!st) return;
    st.elements.forEach((e, i) => {
      e.el.setAttribute('tabindex', i === activeIndex ? '0' : '-1');
      if (i === activeIndex) {
        e.el.setAttribute('aria-selected', 'true');
      } else {
        e.el.removeAttribute('aria-selected');
      }
    });
  }

  private clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
  }

  private getAdjacentGroup(current: GroupId, dir: 'next' | 'prev'): GroupId | null {
    const idx = ORDERED_GROUPS.indexOf(current);
    if (idx < 0) return null;
    if (dir === 'next') {
      return ORDERED_GROUPS[idx + 1] ?? null;
    }
    return ORDERED_GROUPS[idx - 1] ?? null;
  }

  // PUBLIC_INTERFACE
  focusFirstInNextGroup() {
    /** Focus first element in the group after the current group in ORDERED_GROUPS. */
    if (!this.current.group) return false;
    const next = this.getAdjacentGroup(this.current.group, 'next');
    if (!next) return false;
    const st = this.groups.get(next);
    if (!st || st.elements.length === 0) return false;
    return this.focus(next, 0);
  }

  // PUBLIC_INTERFACE
  focusFirstInPrevGroup() {
    /** Focus first element in the group before the current group in ORDERED_GROUPS. */
    if (!this.current.group) return false;
    const prev = this.getAdjacentGroup(this.current.group, 'prev');
    if (!prev) return false;
    const st = this.groups.get(prev);
    if (!st || st.elements.length === 0) return false;
    return this.focus(prev, 0);
  }

  // PUBLIC_INTERFACE
  setCurrent(group: GroupId, index: number) {
    /** Explicitly set current context; updates tabindex and persists. */
    const st = this.groups.get(group);
    if (!st) return;
    st.lastFocusedIndex = this.clamp(index, 0, Math.max(0, st.elements.length - 1));
    this.current = { group, index: st.lastFocusedIndex };
    this.updateTabIndexes(group, st.lastFocusedIndex);
    this.persistToSession();
  }

  // PUBLIC_INTERFACE
  clear() {
    /** Clear all registered elements (used on route change unmount) but keep session state. */
    this.groups.clear();
    // keep current so we can restore when components re-register
  }
}

const focusManager = new FocusManager();
export default focusManager;
