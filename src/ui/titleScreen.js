import { PROFILE } from '../content/profile.js';
import { el } from '../core/dom.js';
import { pixelIcon } from './pixelIcon.js';

const LEAVE_MS = 450;

// Start screen shown over the town while the camera wanders.
export class TitleScreen {
  #resolve = null;

  constructor(container, { i18n, progress, sound, isTouch, onToggleLanguage, onToggleSound }) {
    this.container = container;
    this.i18n = i18n;
    this.progress = progress;
    this.sound = sound;
    this.isTouch = isTouch;

    this.kicker = el('p', { className: 'title__kicker' });
    this.role = el('p', { className: 'title__role' });
    this.motto = el('p', { className: 'title__motto' });
    this.playLabel = el('span');
    this.play = el('button', { className: 'title__play', type: 'button', on: { click: () => this.#start() } }, el('span', { className: 'title__play-arrow', text: '▶', attrs: { 'aria-hidden': 'true' } }), this.playLabel);
    this.hint = el('p', { className: 'title__hint' });
    this.languageButton = el('button', { className: 'hud__button hud__button--icon', type: 'button', on: { click: onToggleLanguage } });
    this.soundButton = el('button', { className: 'hud__button hud__button--icon', type: 'button', on: { click: onToggleSound } });

    container.append(el('div', { className: 'title' },
      this.kicker,
      el('h1', { className: 'title__name' }, el('span', { text: 'Mounir' }), ' ', el('span', { className: 'title__surname', text: 'DABIRE' })),
      this.role,
      this.motto,
      this.play,
      this.hint,
      el('div', { className: 'title__options' }, this.languageButton, this.soundButton)));
    sound.subscribe(() => this.render());
    this.render();
  }

  show() {
    this.container.hidden = false;
    this.play.focus({ preventScroll: true });
    return new Promise(resolve => { this.#resolve = resolve; });
  }

  render() {
    const { t, pick, language } = this.i18n;
    this.kicker.textContent = t('title.kicker');
    this.role.textContent = `${pick(PROFILE.role)} · ${PROFILE.city}`;
    this.motto.textContent = pick(PROFILE.motto);
    this.playLabel.textContent = t(this.progress.introSeen ? 'title.continue' : 'title.play');
    this.hint.textContent = t(this.isTouch ? 'title.hintTouch' : 'title.hintKeyboard');
    const other = language === 'fr' ? 'en' : 'fr';
    this.languageButton.textContent = other.toUpperCase();
    this.languageButton.lang = other;
    this.languageButton.setAttribute('aria-label', t(other === 'en' ? 'hud.switchToEn' : 'hud.switchToFr'));
    const isOn = this.sound.isOn;
    this.soundButton.replaceChildren(pixelIcon(isOn ? 'soundOn' : 'soundOff'));
    this.soundButton.setAttribute('aria-pressed', String(isOn));
    this.soundButton.setAttribute('aria-label', t(isOn ? 'hud.soundLabelOn' : 'hud.soundLabelOff'));
  }

  #start() {
    this.container.classList.add('is-leaving');
    setTimeout(() => {
      this.container.hidden = true;
      this.container.classList.remove('is-leaving');
    }, LEAVE_MS);
    const resolve = this.#resolve;
    this.#resolve = null;
    resolve?.();
  }
}
