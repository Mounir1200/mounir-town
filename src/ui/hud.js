import { cvDownload, PROFILE } from '../content/profile.js';
import { el } from '../core/dom.js';
import { pixelIcon } from './pixelIcon.js';

// Top bar: identity, progress and the always-available actions.
export class Hud {
  constructor(container, { i18n, progress, sound, onMap, onToggleSound, onToggleLanguage }) {
    this.container = container;
    this.i18n = i18n;
    this.progress = progress;
    this.sound = sound;

    this.role = el('span', { className: 'hud__role' });
    this.places = el('span', { className: 'hud__count' });
    this.skills = el('span', { className: 'hud__count' });
    this.progressBox = el('p', { className: 'hud__progress' },
      el('span', { className: 'hud__chip' }, pixelIcon('house'), this.places),
      el('span', { className: 'hud__chip' }, pixelIcon('gem'), this.skills));
    this.mapLabel = el('span', { className: 'hud__label' });
    this.mapButton = el('button', { className: 'hud__button', type: 'button', on: { click: onMap } }, pixelIcon('map'), this.mapLabel);
    this.soundButton = el('button', { className: 'hud__button hud__button--icon', type: 'button', on: { click: onToggleSound } });
    this.languageButton = el('button', { className: 'hud__button hud__button--icon', type: 'button', on: { click: onToggleLanguage } });
    this.cvLabel = el('span', { className: 'hud__label' });
    this.cvLink = el('a', { className: 'hud__button' }, pixelIcon('download'), this.cvLabel);

    container.append(
      el('p', { className: 'hud__brand' }, el('span', { className: 'hud__name', text: PROFILE.name }), this.role),
      this.progressBox,
      el('nav', { className: 'hud__actions' }, this.mapButton, this.soundButton, this.languageButton, this.cvLink),
    );
    progress.subscribe(() => this.render());
    sound.subscribe(() => this.render());
    this.render();
  }

  setVisible(isVisible) {
    this.container.hidden = !isVisible;
  }

  render() {
    const { t, pick, language } = this.i18n;
    const { totals } = this.progress;
    this.role.textContent = pick(PROFILE.role);
    this.places.textContent = `${this.progress.visitedCount}/${totals.places}`;
    this.skills.textContent = `${this.progress.skillCount}/${totals.skills}`;
    this.progressBox.setAttribute('aria-label', t('hud.progressLabel', {
      places: this.progress.visitedCount, placesTotal: totals.places, skills: this.progress.skillCount, skillsTotal: totals.skills,
    }));
    this.progressBox.setAttribute('role', 'img');
    this.mapLabel.textContent = t('hud.map');
    this.mapButton.setAttribute('aria-label', t('hud.mapLabel'));

    const isOn = this.sound.isOn;
    this.soundButton.replaceChildren(pixelIcon(isOn ? 'soundOn' : 'soundOff'));
    this.soundButton.setAttribute('aria-pressed', String(isOn));
    this.soundButton.setAttribute('aria-label', t(isOn ? 'hud.soundLabelOn' : 'hud.soundLabelOff'));
    this.soundButton.title = t(isOn ? 'hud.soundOn' : 'hud.soundOff');

    const other = language === 'fr' ? 'en' : 'fr';
    this.languageButton.textContent = other.toUpperCase();
    this.languageButton.lang = other;
    this.languageButton.setAttribute('aria-label', t(other === 'en' ? 'hud.switchToEn' : 'hud.switchToFr'));

    const cv = cvDownload(language);
    this.cvLink.href = cv.href;
    this.cvLink.download = cv.filename;
    this.cvLabel.textContent = t('hud.cv');
    this.cvLink.setAttribute('aria-label', t('hud.cvLabel'));
  }
}
