// Physical key codes, so ZQSD on AZERTY and WASD on QWERTY both work.
const DIRECTIONS = {
  ArrowUp: [0, -1], KeyW: [0, -1],
  ArrowDown: [0, 1], KeyS: [0, 1],
  ArrowLeft: [-1, 0], KeyA: [-1, 0],
  ArrowRight: [1, 0], KeyD: [1, 0],
};
const INTERACT_CODES = new Set(['KeyE', 'Enter', 'NumpadEnter', 'Space']);
const NATIVE_ACTIVATION_CODES = new Set(['Enter', 'NumpadEnter', 'Space']);
const MENU_KEYS = new Set(['m', 'M', 'Escape']);

function isTypingOrActivating(event) {
  const element = event.target instanceof Element ? event.target : null;
  if (element?.closest('input, textarea, select, [contenteditable="true"]')) return true;
  return NATIVE_ACTIVATION_CODES.has(event.code) && Boolean(element?.closest('button, a, summary'));
}

// `isActive` tells whether the world has control (no window open);
// the command callbacks are only called then.
export class KeyboardInput {
  #pressed = new Set();

  constructor(target, { isActive, onInteract, onMenu }) {
    this.isActive = isActive;
    target.addEventListener('keydown', event => this.#handleDown(event, onInteract, onMenu));
    target.addEventListener('keyup', event => this.#pressed.delete(event.code));
    target.addEventListener('blur', () => this.reset());
    document.addEventListener('visibilitychange', () => this.reset());
  }

  // Unit vector of the held direction keys, or null when standing still.
  direction() {
    let x = 0;
    let y = 0;
    this.#pressed.forEach(code => {
      const [dx, dy] = DIRECTIONS[code];
      x += dx;
      y += dy;
    });
    if (x === 0 && y === 0) return null;
    const length = Math.hypot(x, y);
    return { x: x / length, y: y / length };
  }

  reset() {
    this.#pressed.clear();
  }

  #handleDown(event, onInteract, onMenu) {
    if (event.ctrlKey || event.metaKey || event.altKey || !this.isActive() || isTypingOrActivating(event)) return;
    if (DIRECTIONS[event.code]) {
      // Repeats are ignored so a key held while a window closes does not walk on by itself.
      if (!event.repeat) this.#pressed.add(event.code);
      event.preventDefault();
      return;
    }
    if (event.repeat) return;
    if (INTERACT_CODES.has(event.code)) {
      event.preventDefault();
      onInteract();
    } else if (MENU_KEYS.has(event.key)) {
      event.preventDefault();
      onMenu();
    }
  }
}
