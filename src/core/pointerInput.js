import { TAP_MAX_TRAVEL_PX } from '../config.js';

// Turns pointer events on the canvas into taps (click / touch) and mouse hovers.
export class PointerInput {
  #start = null;

  constructor(element, { onTap, onHover, onLeave }) {
    element.addEventListener('pointerdown', event => {
      if (!event.isPrimary || event.button > 0) return;
      this.#start = { id: event.pointerId, x: event.clientX, y: event.clientY };
    });
    element.addEventListener('pointerup', event => {
      const start = this.#start;
      this.#start = null;
      if (!start || start.id !== event.pointerId) return;
      if (Math.hypot(event.clientX - start.x, event.clientY - start.y) <= TAP_MAX_TRAVEL_PX) onTap(event.clientX, event.clientY);
    });
    element.addEventListener('pointercancel', () => { this.#start = null; });
    element.addEventListener('pointermove', event => {
      if (event.pointerType === 'mouse') onHover(event.clientX, event.clientY);
    });
    element.addEventListener('pointerleave', onLeave);
  }
}
