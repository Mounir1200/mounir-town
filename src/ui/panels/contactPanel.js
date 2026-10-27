import { PROFILE } from '../../content/profile.js';
import { el, externalLink } from '../../core/dom.js';
import { pixelIcon } from '../pixelIcon.js';
import { cvButton, lead } from './shared.js';

function copyEmailButton({ t }) {
  const label = el('span', { text: t('contact.copy') });
  const button = el('button', { className: 'button button--quiet', type: 'button' }, label);
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      label.textContent = t('contact.copied');
    } catch {
      // Clipboard access can be refused; the address stays visible and selectable.
    }
  });
  return button;
}

export function renderContact({ i18n }) {
  const { t, pick } = i18n;
  return {
    title: t('contact.title'),
    body: [
      lead(t('contact.text')),
      el('div', { className: 'card contact' },
        el('img', { className: 'contact__portrait', src: PROFILE.portrait, alt: pick(PROFILE.portraitAlt), width: 560, height: 700 }),
        el('div', { className: 'contact__details' },
          el('p', { className: 'eyebrow', text: `${PROFILE.name} · ${pick(PROFILE.role)}` }),
          el('a', { className: 'contact__email', href: `mailto:${PROFILE.email}` }, pixelIcon('mail'), el('span', { text: PROFILE.email })),
          el('div', { className: 'actions' },
            copyEmailButton(i18n),
            externalLink(PROFILE.links.linkedin, 'LinkedIn', 'button button--ghost'),
            externalLink(PROFILE.links.github, 'GitHub', 'button button--ghost'),
            cvButton(i18n, 'contact.cv')))),
    ],
  };
}
