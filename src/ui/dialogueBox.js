import { DIALOGUES, SPEAKERS } from '../content/dialogues.js';
import { el } from '../core/dom.js';

const CHARACTERS_PER_SECOND = 55;
const TALK_SOUND_EVERY = 3;

// RPG text box with a portrait and typewriter text. `play` resolves once the
// last line is dismissed (Next button, click, E, or Escape to skip).
export class DialogueBox {
  #lines = [];
  #index = 0;
  #shown = 0;
  #frame = 0;
  #resolve = null;
  #returnFocus = null;

  constructor(container, { i18n, sound, portraits, reducedMotion, isTouch }) {
    this.container = container;
    this.i18n = i18n;
    this.sound = sound;
    this.portraits = portraits;
    this.reducedMotion = reducedMotion;
    this.isTouch = isTouch;

    this.portrait = el('img', { className: 'dialogue__portrait', alt: '', width: 96, height: 96 });
    this.name = el('p', { className: 'dialogue__name', id: 'dialogue-name' });
    this.text = el('p', { className: 'dialogue__text' });
    this.caption = el('p', { className: 'dialogue__caption' });
    this.liveText = el('p', { className: 'sr-only', attrs: { 'aria-live': 'polite' } });
    this.nextLabel = el('span');
    this.next = el('button', { className: 'dialogue__next', type: 'button', on: { click: () => this.#advance() } }, this.nextLabel, el('span', { className: 'dialogue__arrow', text: '▼', attrs: { 'aria-hidden': 'true' } }));
    this.box = el('section', {
      className: 'dialogue',
      attrs: { role: 'dialog', 'aria-labelledby': 'dialogue-name' },
      on: { click: event => { if (!event.target.closest('button')) this.#advance(); } },
    }, el('div', { className: 'dialogue__frame' }, this.portrait), el('div', { className: 'dialogue__body' }, this.name, this.text, this.caption, this.liveText), this.next);
    container.append(this.box);
    container.hidden = true;
    document.addEventListener('keydown', event => this.#handleKey(event));
  }

  get isOpen() {
    return this.#resolve !== null;
  }

  play(script) {
    const lines = typeof script === 'string' ? DIALOGUES[script] : script;
    if (this.isOpen) this.#finish();
    this.#lines = lines;
    this.#index = 0;
    this.#returnFocus = document.activeElement;
    this.container.hidden = false;
    this.#showLine();
    this.next.focus({ preventScroll: true });
    return new Promise(resolve => { this.#resolve = resolve; });
  }

  refreshLanguage() {
    if (!this.isOpen) return;
    this.#shown = Infinity;
    this.#renderLine();
  }

  #currentText() {
    const line = this.#lines[this.#index];
    return this.i18n.pick(this.isTouch && line.touch ? line.touch : line.text);
  }

  #showLine() {
    this.#shown = this.reducedMotion ? Infinity : 0;
    this.#renderLine();
    this.liveText.textContent = `${this.name.textContent} : ${this.#currentText()}`;
    if (!this.reducedMotion) this.#type();
  }

  #renderLine() {
    const { t, pick } = this.i18n;
    const line = this.#lines[this.#index];
    const speaker = SPEAKERS[line.speaker];
    this.portrait.src = this.portraits[speaker.portrait];
    this.portrait.classList.toggle('is-pixel', speaker.portrait !== 'photo');
    this.name.textContent = pick(speaker.name);
    this.caption.textContent = line.caption ? pick(line.caption) : '';
    const fullText = this.#currentText();
    this.text.textContent = fullText.slice(0, this.#shown);
    const isLast = this.#index === this.#lines.length - 1;
    this.nextLabel.textContent = t(isLast ? 'dialogue.end' : 'dialogue.next');
    this.box.classList.toggle('is-typing', this.#shown < fullText.length);
  }

  #type() {
    cancelAnimationFrame(this.#frame);
    const startedAt = performance.now();
    const fullLength = this.#currentText().length;
    const step = now => {
      const target = Math.min(fullLength, Math.floor(((now - startedAt) / 1000) * CHARACTERS_PER_SECOND));
      if (Math.floor(target / TALK_SOUND_EVERY) > Math.floor(this.#shown / TALK_SOUND_EVERY)) this.sound.play('talk');
      this.#shown = target;
      this.#renderLine();
      if (target < fullLength) this.#frame = requestAnimationFrame(step);
    };
    this.#frame = requestAnimationFrame(step);
  }

  #advance() {
    if (!this.isOpen) return;
    if (this.#shown < this.#currentText().length) {
      cancelAnimationFrame(this.#frame);
      this.#shown = Infinity;
      this.#renderLine();
      return;
    }
    this.sound.play('select');
    this.#index += 1;
    if (this.#index >= this.#lines.length) this.#finish();
    else this.#showLine();
  }

  #finish() {
    cancelAnimationFrame(this.#frame);
    this.container.hidden = true;
    const resolve = this.#resolve;
    this.#resolve = null;
    if (this.#returnFocus?.isConnected) this.#returnFocus.focus({ preventScroll: true });
    resolve?.();
  }

  // Handled keys stop here so the closing key press is not also read by the game.
  #handleKey(event) {
    if (!this.isOpen || event.repeat) return;
    if (event.code === 'KeyE') this.#advance();
    else if (event.key === 'Escape') this.#finish();
    else return;
    event.preventDefault();
    event.stopPropagation();
  }
}
