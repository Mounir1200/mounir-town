import { el } from '../core/dom.js';

const VISIBLE_MS = 2800;
const LEAVE_MS = 300;
const MAX_TOASTS = 3;

export class Toasts {
  constructor(container) {
    this.container = container;
  }

  show(message, icon = null) {
    while (this.container.children.length >= MAX_TOASTS) this.container.firstElementChild.remove();
    const toast = el('p', { className: 'toast' }, icon, el('span', { text: message }));
    this.container.append(toast);
    setTimeout(() => toast.classList.add('is-leaving'), VISIBLE_MS);
    setTimeout(() => toast.remove(), VISIBLE_MS + LEAVE_MS);
  }
}
