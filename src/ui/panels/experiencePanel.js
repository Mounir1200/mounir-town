import { experiencesOf } from '../../content/experiences.js';
import { el } from '../../core/dom.js';
import { chips, lead } from './shared.js';

function mission(mission, { pick, language }) {
  // French typography puts a space before the colon.
  const separator = language === 'fr' ? ' : ' : ': ';
  const tech = mission.tech
    ? el('span', { className: 'mission__tech' }, mission.techLabel ? `${pick(mission.techLabel)}${separator}` : '', mission.tech)
    : null;
  return el('li', {}, el('span', { text: pick(mission.text) }), tech);
}

function experience(entry, isOpen, i18n) {
  const { t, pick } = i18n;
  return el('article', { className: 'card job' },
    el('p', { className: 'job__period', text: pick(entry.period) }),
    el('h3', { className: 'job__headline', text: pick(entry.headline) }),
    el('p', { className: 'job__role' }, el('strong', { text: pick(entry.role) }), ` · ${pick(entry.organisation)}`),
    el('p', { text: pick(entry.summary) }),
    el('div', { className: 'job__stack' }, el('span', { className: 'eyebrow', text: pick(entry.stackLabel) }), chips(entry.stack)),
    el('details', { className: 'job__missions', open: isOpen },
      el('summary', { text: t('experience.missions') }),
      el('ul', {}, entry.missions.map(item => mission(item, i18n)))));
}

// One renderer per employer building: ESSCA offices, Moov Africa tower.
export function createExperiencePanel(employer, intro) {
  return ({ i18n }) => ({
    title: i18n.pick(intro.title),
    body: [
      lead(i18n.pick(intro.text)),
      el('div', { className: 'timeline' }, experiencesOf(employer).map((entry, index) => experience(entry, index === 0, i18n))),
    ],
  });
}
