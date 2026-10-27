import { el } from '../core/dom.js';
import { pixelIcon } from './pixelIcon.js';

// Full-size photo dialog with previous/next, opened on top of a panel.
export class PhotoViewer {
  #photos = [];
  #index = 0;
  #request = 0;

  constructor(dialog, { i18n }) {
    this.dialog = dialog;
    this.i18n = i18n;
    this.image = el('img', { className: 'viewer__image', alt: '', hidden: true });
    this.status = el('p', { className: 'viewer__status', attrs: { role: 'status' } });
    this.retry = el('button', { className: 'button', type: 'button', hidden: true, on: { click: () => this.#load() } });
    this.title = el('p', { className: 'viewer__title' });
    this.caption = el('p', { className: 'viewer__caption' });
    this.counter = el('p', { className: 'viewer__counter' });
    this.previous = el('button', { className: 'viewer__nav', type: 'button', on: { click: () => this.#move(-1) } }, pixelIcon('previous'));
    this.next = el('button', { className: 'viewer__nav', type: 'button', on: { click: () => this.#move(1) } }, pixelIcon('next'));
    this.closeButton = el('button', { className: 'viewer__close', type: 'button', on: { click: () => dialog.close() } }, pixelIcon('close'));

    dialog.append(el('div', { className: 'viewer__frame' },
      el('div', { className: 'viewer__stage' }, this.image, this.status, this.retry),
      el('div', { className: 'viewer__bar' }, this.previous, el('div', { className: 'viewer__text' }, this.title, this.caption, this.counter), this.next),
      this.closeButton));
    dialog.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft') this.#move(-1);
      else if (event.key === 'ArrowRight') this.#move(1);
    });
    dialog.addEventListener('click', event => {
      if (event.target === dialog) dialog.close();
    });
  }

  open(photos, index) {
    this.#photos = photos;
    this.#index = index;
    this.#render();
    this.dialog.showModal();
    this.closeButton.focus({ preventScroll: true });
  }

  refreshLanguage() {
    if (this.dialog.open) this.#renderText();
  }

  #move(step) {
    if (this.#photos.length < 2) return;
    this.#index = (this.#index + step + this.#photos.length) % this.#photos.length;
    this.#render();
  }

  #render() {
    this.#renderText();
    this.#load();
  }

  #renderText() {
    const { t, pick } = this.i18n;
    const photo = this.#photos[this.#index];
    const hasSeveral = this.#photos.length > 1;
    this.title.textContent = pick(photo.title);
    this.caption.textContent = pick(photo.caption);
    this.counter.textContent = hasSeveral ? t('viewer.counter', { current: this.#index + 1, total: this.#photos.length }) : '';
    // Kept in the layout (only invisible) so the caption stays centred.
    this.previous.style.visibility = hasSeveral ? '' : 'hidden';
    this.next.style.visibility = hasSeveral ? '' : 'hidden';
    this.previous.setAttribute('aria-label', t('viewer.previous'));
    this.next.setAttribute('aria-label', t('viewer.next'));
    this.closeButton.setAttribute('aria-label', t('viewer.close'));
    this.retry.textContent = t('viewer.retry');
    this.image.alt = pick(photo.alt);
  }

  // A newer request always wins, so a slow photo never replaces the current one.
  #load() {
    const { t, pick } = this.i18n;
    const request = ++this.#request;
    const photo = this.#photos[this.#index];
    this.image.hidden = true;
    this.retry.hidden = true;
    this.status.textContent = t('viewer.loading');
    const loader = new Image();
    loader.onload = () => {
      if (request !== this.#request) return;
      this.image.src = photo.full;
      this.image.alt = pick(photo.alt);
      this.image.hidden = false;
      this.status.textContent = '';
    };
    loader.onerror = () => {
      if (request !== this.#request) return;
      this.status.textContent = t('viewer.error');
      this.retry.hidden = false;
    };
    loader.src = photo.full;
  }
}
