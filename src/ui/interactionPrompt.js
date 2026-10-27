import { el } from '../core/dom.js';

// Bottom button naming what the player can do right now; tapping it does it.
export class InteractionPrompt {
  #target = null;

  constructor(container, { i18n, isTouch, onActivate }) {
    this.i18n = i18n;
    this.key = el('kbd', { className: 'prompt__key', text: 'E', hidden: isTouch });
    this.label = el('span', { className: 'prompt__label' });
    this.button = el('button', { className: 'prompt', type: 'button', on: { click: () => onActivate(this.#target) } }, this.key, this.label);
    this.container = container;
    container.append(this.button);
    this.hide();
  }

  show(target) {
    this.#target = target;
    this.render();
    this.container.hidden = false;
  }

  hide() {
    this.#target = null;
    this.container.hidden = true;
  }

  render() {
    if (!this.#target) return;
    const { t, pick } = this.i18n;
    this.label.textContent = t('prompt.label', { verb: t(`verb.${this.#target.verb}`), name: pick(this.#target.label) });
  }
}
