import { locationById } from '../content/locations.js';
import { el } from '../core/dom.js';
import { pixelIcon } from './pixelIcon.js';

// Modal window showing the content of a building. `open` resolves with an
// optional follow-up (for instance { travelTo: 'museum' }) when it closes.
export class PanelHost {
  #currentId = null;
  #result = null;
  #resolve = null;

  constructor(dialog, { i18n, sound, renderers, context }) {
    this.dialog = dialog;
    this.i18n = i18n;
    this.sound = sound;
    this.renderers = renderers;
    this.context = context;

    this.kicker = el('p', { className: 'panel__kicker' });
    this.title = el('h2', { className: 'panel__title', id: 'panel-title', tabIndex: -1 });
    this.closeLabel = el('span', { className: 'panel__close-label' });
    this.closeButton = el('button', { className: 'panel__close', type: 'button', on: { click: () => this.close() } }, pixelIcon('close'), this.closeLabel);
    this.body = el('div', { className: 'panel__body' });
    dialog.setAttribute('aria-labelledby', 'panel-title');
    dialog.append(el('div', { className: 'panel__frame' },
      el('header', { className: 'panel__header' }, el('div', { className: 'panel__heading' }, this.kicker, this.title), this.closeButton),
      this.body));
    dialog.addEventListener('close', () => this.#handleClosed());
    dialog.addEventListener('click', event => {
      if (event.target === dialog) this.close();
    });
  }

  open(id) {
    this.#currentId = id;
    this.#result = null;
    this.#render();
    this.dialog.showModal();
    this.body.scrollTop = 0;
    this.title.focus({ preventScroll: true });
    this.sound.play('open');
    return new Promise(resolve => { this.#resolve = resolve; });
  }

  close(result = null) {
    this.#result = result;
    if (this.dialog.open) this.dialog.close();
  }

  refreshLanguage() {
    if (!this.dialog.open) return;
    const scroll = this.body.scrollTop;
    this.#render();
    this.body.scrollTop = scroll;
  }

  #render() {
    const { t, pick } = this.i18n;
    const location = locationById(this.#currentId);
    const { title, body } = this.renderers[this.#currentId](this.context);
    this.kicker.textContent = `${pick(location.name)} · ${pick(location.theme)}`;
    this.title.textContent = title;
    this.closeLabel.textContent = t('panel.close');
    this.body.replaceChildren(...body);
  }

  #handleClosed() {
    this.sound.play('close');
    const resolve = this.#resolve;
    this.#resolve = null;
    this.#currentId = null;
    resolve?.(this.#result);
  }
}
