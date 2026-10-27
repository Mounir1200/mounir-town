export const PROFILE = {
  name: 'Mounir DABIRE',
  role: { fr: 'Ingénieur IA & développeur', en: 'AI Engineer & Developer' },
  city: 'Angers, France',
  pitch: {
    fr: 'Je conçois des agents IA. Et les systèmes qui les rendent utiles.',
    en: 'I design AI agents. And the systems that make them useful.',
  },
  motto: { fr: 'Des idées au réel.', en: 'From ideas to reality.' },
  email: 'mounirdabire47@gmail.com',
  links: {
    linkedin: 'https://www.linkedin.com/in/mounir-dabire/',
    github: 'https://github.com/Mounir1200',
  },
  portrait: 'assets/portrait-cobalt-peche-560.webp',
  portraitAlt: {
    fr: 'Portrait de Mounir DABIRE, chemise cobalt et tee-shirt pêche',
    en: 'Portrait of Mounir DABIRE wearing a cobalt shirt and peach T-shirt',
  },
  cv: {
    fr: 'assets/Mounir-DABIRE-CV.pdf',
    en: 'assets/Mounir-DABIRE-CV-EN.pdf',
  },
};

export function cvDownload(language) {
  const href = PROFILE.cv[language] ?? PROFILE.cv.fr;
  const suffix = PROFILE.cv[language] ? language.toUpperCase() : 'FR';
  return { href, filename: `DABIRE_Mounir_CV_${suffix}.pdf` };
}
