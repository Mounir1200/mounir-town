import { cvDownload } from '../../content/profile.js';
import { el, externalLink } from '../../core/dom.js';
import { pixelIcon } from '../pixelIcon.js';

export function lead(text) {
  return el('p', { className: 'lead', text });
}

export function sectionTitle(text, level = 'h3') {
  return el(level, { className: 'section-title', text });
}

export function eyebrow(text) {
  return el('p', { className: 'eyebrow', text });
}

// "Python · RAG · Azure" becomes a row of chips.
export function chips(list) {
  return el('ul', { className: 'chips' }, list.split(' · ').map(item => el('li', { text: item })));
}

export function photoGrid(photos, { i18n, openPhoto }, variant = '') {
  const { t, pick } = i18n;
  return el('ul', { className: `photo-grid ${variant}`.trim() }, photos.map((photo, index) => el('li', {},
    el('button', {
      className: 'photo-grid__item',
      type: 'button',
      attrs: { 'aria-label': t('photo.open', { title: pick(photo.title) }) },
      on: { click: () => openPhoto(photos, index) },
    },
    el('img', { src: photo.thumb, alt: pick(photo.alt), width: photo.width, height: photo.height, loading: 'lazy', decoding: 'async' }),
    el('span', { className: 'photo-grid__caption', text: pick(photo.title) })))));
}

export function repositoryLink(href, label) {
  return href ? externalLink(href, label, 'button button--ghost') : null;
}

export function cvButton({ t, language }, labelKey) {
  const cv = cvDownload(language);
  return el('a', { className: 'button', href: cv.href, download: cv.filename }, pixelIcon('download'), el('span', { text: t(labelKey) }));
}
