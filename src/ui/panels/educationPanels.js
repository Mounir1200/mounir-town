import { EDUCATION, ERASMUS } from '../../content/education.js';
import { MOMENTS } from '../../content/photos.js';
import { el } from '../../core/dom.js';
import { cvButton, lead, photoGrid, sectionTitle } from './shared.js';

const DIPLOMA = MOMENTS.slice(0, 1);

export function renderSchool(context) {
  const { i18n } = context;
  const { pick } = i18n;
  return {
    title: pick(EDUCATION.title),
    body: [
      ...EDUCATION.paragraphs.map((paragraph, index) => (index === 0 ? lead(pick(paragraph)) : el('p', { text: pick(paragraph) }))),
      sectionTitle(pick(EDUCATION.milestonesTitle)),
      el('ol', { className: 'milestones' }, EDUCATION.milestones.map(milestone => el('li', {},
        el('strong', { text: pick(milestone.name) }),
        el('span', { text: pick(milestone.detail) })))),
      photoGrid(DIPLOMA, context, 'photo-grid--single'),
      cvButton(i18n, 'education.cv'),
    ],
  };
}

export function renderAirport(context) {
  const { pick } = context.i18n;
  return {
    title: pick(ERASMUS.title),
    body: [
      lead(pick(ERASMUS.text)),
      ...ERASMUS.trips.map(trip => el('section', { className: 'trip' },
        el('p', { className: 'eyebrow', text: pick(trip.label) }),
        sectionTitle(pick(trip.title)),
        photoGrid(trip.photos, context))),
    ],
  };
}
