import focusManager from './focusManager';

/**
 * PUBLIC_INTERFACE
 * persistFocus: helper to save current focus explicitly, though focusManager already persists on set.
 */
export function persistFocus() {
  const c = focusManager.getCurrent();
  // calling setCurrent will persist with same values
  if (c.group != null && c.index >= 0) {
    focusManager.setCurrent(c.group as any, c.index);
  }
}
