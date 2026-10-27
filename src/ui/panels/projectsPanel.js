import { FEATURED_PROJECTS, OTHER_PROJECTS, OTHER_PROJECTS_TITLE, PROJECTS_INTRO } from '../../content/projects.js';
import { el, externalLink } from '../../core/dom.js';
import { eyebrow, lead, repositoryLink, sectionTitle } from './shared.js';

const ordinal = index => String(index + 1).padStart(2, '0');

function testCase(testCase, { t, pick }) {
  return el('details', { className: 'test-case' },
    el('summary', { text: pick(testCase.title) }),
    testCase.intro ? el('p', { text: pick(testCase.intro) }) : null,
    el('ol', { className: 'test-case__steps' }, testCase.steps.map(step => el('li', {},
      el('strong', { text: pick(step.label) }),
      el('span', { text: pick(step.text) })))),
    testCase.highlight ? el('p', { className: 'test-case__highlight', text: pick(testCase.highlight) }) : null,
    testCase.figures.length ? el('dl', { className: 'figures' }, testCase.figures.map(figure => el('div', {},
      el('dt', { text: pick(figure.label) }),
      el('dd', { text: pick(figure.value) })))) : null,
    el('p', {}, el('strong', { text: `${t('projects.checks')} — ` }), pick(testCase.checks)),
    el('p', { className: 'note', text: pick(testCase.note) }),
    externalLink(testCase.source, t('projects.source')));
}

function featuredProject(project, index, i18n) {
  const { t, pick } = i18n;
  const fact = (label, text) => el('div', {}, el('dt', { text: t(label) }), el('dd', { text: pick(text) }));
  return el('article', { className: 'card project' },
    el('p', { className: 'project__meta', text: `[ ${ordinal(index)} ] ${pick(project.meta)}` }),
    el('h3', { className: 'project__name' }, externalLink(project.repository, project.name, 'project__link')),
    el('p', { className: 'project__tagline', text: pick(project.tagline) }),
    el('dl', { className: 'facts' },
      fact('projects.problem', project.problem),
      fact('projects.idea', project.idea),
      fact('projects.choice', project.choice)),
    testCase(project.testCase, i18n),
    repositoryLink(project.repository, t('projects.repo')));
}

function otherProject(project, index, { t, pick }) {
  return el('details', { className: 'card mini-project' },
    el('summary', {},
      el('span', { className: 'mini-project__number', text: ordinal(index + FEATURED_PROJECTS.length) }),
      el('span', { className: 'mini-project__name', text: pick(project.name) }),
      el('span', { className: 'mini-project__domain', text: pick(project.domain) })),
    project.paragraphs.map(paragraph => el('p', { text: pick(paragraph) })),
    repositoryLink(project.repository, t('projects.repo')));
}

export function renderProjects({ i18n }) {
  const { t, pick } = i18n;
  return {
    title: pick(PROJECTS_INTRO.title),
    body: [
      lead(pick(PROJECTS_INTRO.text)),
      eyebrow(t('projects.featured')),
      ...FEATURED_PROJECTS.map((project, index) => featuredProject(project, index, i18n)),
      sectionTitle(pick(OTHER_PROJECTS_TITLE)),
      ...OTHER_PROJECTS.map((project, index) => otherProject(project, index, i18n)),
    ],
  };
}
