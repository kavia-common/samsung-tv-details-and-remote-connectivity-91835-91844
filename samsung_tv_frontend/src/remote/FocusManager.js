//
// PUBLIC_INTERFACE
// FocusManager provides simple focus state and key handling for Samsung TV remotes.
//
// This implementation tracks a focus scope ("menu" or "rails"), the focused rail row,
// and index within the row. It emits callbacks to the UI for highlighting items and
// performing actions on Enter. It also stores the focus scope on document.body
// so components like TopNav can read the current scope to render focus styles.
//
export default class FocusManager {
  /**
   * PUBLIC_INTERFACE
   * @param {Object} options
   * @param {(state)=>void} options.onChange - called whenever focus state changes
   * @param {(action, payload)=>void} options.onAction - called on Enter or other actions
   * @param {number} options.rows - number of rails (rows) in the page
   * @param {function(number): number} options.getRowLength - returns the items count for a given row
   */
  constructor({ onChange, onAction, rows = 0, getRowLength }) {
    this.state = {
      scope: 'menu', // 'menu' | 'rails'
      row: 0,
      index: 0
    };
    this.onChange = onChange || (() => {});
    this.onAction = onAction || (() => {});
    this.rows = rows;
    this.getRowLength = getRowLength || (() => 0);

    document.body.setAttribute('data-focus-scope', this.state.scope);
    this._handler = this._handleKey.bind(this);
    window.addEventListener('keydown', this._handler, false);
  }

  destroy() {
    window.removeEventListener('keydown', this._handler, false);
  }

  setScope(scope) {
    this.state.scope = scope;
    document.body.setAttribute('data-focus-scope', scope);
    this._emit();
  }

  _emit() {
    this.onChange({ ...this.state });
  }

  _clampIndex(row, index) {
    const max = Math.max(0, (this.getRowLength(row) || 0) - 1);
    if (index < 0) return 0;
    if (index > max) return max;
    return index;
  }

  _handleKey(e) {
    const key = e.key || e.code;
    switch (key) {
      case 'ArrowUp':
        e.preventDefault();
        if (this.state.scope === 'rails') {
          if (this.state.row <= 0) {
            // jump to menu
            this.setScope('menu');
          } else {
            this.state.row = Math.max(0, this.state.row - 1);
            this.state.index = this._clampIndex(this.state.row, this.state.index);
            this._emit();
          }
        } else {
          // menu: stay
          this._emit();
        }
        break;

      case 'ArrowDown':
        e.preventDefault();
        if (this.state.scope === 'menu') {
          // go to rails top row
          if (this.rows > 0) {
            this.setScope('rails');
            this.state.row = 0;
            this.state.index = this._clampIndex(this.state.row, this.state.index);
            this._emit();
          }
        } else {
          // rails: move one row down
          if (this.rows > 0) {
            this.state.row = Math.min(this.rows - 1, this.state.row + 1);
            this.state.index = this._clampIndex(this.state.row, this.state.index);
            this._emit();
          }
        }
        break;

      case 'ArrowLeft':
        if (this.state.scope === 'rails') {
          e.preventDefault();
          this.state.index = Math.max(0, this.state.index - 1);
          this._emit();
        }
        // In menu, TopNav handles left/right
        break;

      case 'ArrowRight':
        if (this.state.scope === 'rails') {
          e.preventDefault();
          this.state.index = this._clampIndex(this.state.row, this.state.index + 1);
          this._emit();
        }
        break;

      case 'Enter':
        e.preventDefault();
        this.onAction('enter', { ...this.state });
        break;

      case 'Backspace':
      case 'Escape': // map ESC as back for desktop preview
        e.preventDefault();
        this.onAction('back', { ...this.state });
        break;

      default:
        break;
    }
  }
}
