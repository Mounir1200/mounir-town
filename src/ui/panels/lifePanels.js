import { GAMING, HOBBIES_INTRO, MOMENTS_INTRO, MUSIC, PHOTOGRAPHY_INTRO, READING, WORKOUT } from '../../content/hobbies.js';
import { MOMENTS, PHOTOGRAPHY } from '../../content/photos.js';
import { el, externalLink } from '../../core/dom.js';
import { pixelIcon } from '../pixelIcon.js';
import { lead, photoGrid, sectionTitle } from './shared.js';

function musicToggle({ i18n, sound }) {
  const label = el('span');
  const button = el('button', { className: 'button', type: 'button' }, pixelIcon('soundOn'), label);
  const render = () => {
    label.textContent = i18n.t(sound.isOn ? 'hobbies.musicPause' : 'hobbies.musicPlay');
    button.setAttribute('aria-pressed', String(sound.isOn));
  };
  button.addEventListener('click', async () => {
    await sound.toggle();
    render();
  });
  render();
  return button;
}

export function renderHome(context) {
  const { i18n, travelTo } = context;
  const { t, pick } = i18n;
  return {
    title: pick(HOBBIES_INTRO.title),
    body: [
      lead(pick(HOBBIES_INTRO.text)),
      el('section', { className: 'card hobby' },
        sectionTitle(pick(GAMING.title)),
        el('p', { text: `${pick(GAMING.text)} ${pick(GAMING.console)}` }),
        photoGrid(GAMING.photos, context)),
      el('section', { className: 'card hobby' },
        sectionTitle(pick(READING.title)),
        el('p', { text: pick(READING.text) }),
        READING.quotes.map(quote => el('figure', { className: 'quote' },
          el('blockquote', { text: pick(quote.text) }),
          el('figcaption', { text: pick(quote.source) })))),
      el('section', { className: 'card hobby' },
        sectionTitle(pick(MUSIC.title)),
        el('p', { text: pick(MUSIC.text) }),
        el('div', { className: 'actions' }, musicToggle(context), externalLink(MUSIC.source, t('hobbies.musicSource'), 'link')),
        el('p', { className: 'note', text: pick(MUSIC.credit) })),
      el('section', { className: 'card hobby' },
        sectionTitle(pick(WORKOUT.title)),
        el('p', { text: pick(WORKOUT.text) })),
      el('section', { className: 'card hobby' },
        sectionTitle(pick(PHOTOGRAPHY_INTRO.title)),
        el('p', { text: pick(PHOTOGRAPHY_INTRO.text) }),
        el('button', { className: 'button', type: 'button', on: { click: () => travelTo('museum') } }, pixelIcon('pin'), el('span', { text: t('hobbies.toGallery') }))),
    ],
  };
}

export function renderMuseum(context) {
  const { t, pick } = context.i18n;
  return {
    title: pick(PHOTOGRAPHY_INTRO.title),
    body: [
      lead(pick(PHOTOGRAPHY_INTRO.text)),
      el('p', { className: 'eyebrow', text: t('gallery.count', { count: PHOTOGRAPHY.length }) }),
      photoGrid(PHOTOGRAPHY, context, 'photo-grid--dense'),
      sectionTitle(pick(MOMENTS_INTRO.title)),
      el('p', { text: pick(MOMENTS_INTRO.text) }),
      photoGrid(MOMENTS, context, 'photo-grid--portraits'),
    ],
  };
}
