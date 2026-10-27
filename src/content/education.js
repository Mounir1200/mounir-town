import { ERASMUS_KTU, ERASMUS_RWU } from './photos.js';

export const EDUCATION = {
  title: { fr: 'De Ouagadougou à Angers.', en: 'From Ouagadougou to Angers.' },
  paragraphs: [
    {
      fr: 'Après deux années de classes préparatoires à La Salle, à Ouagadougou, j’ai rejoint l’ESAIP à Angers pour me spécialiser en Big Data.',
      en: 'After two years of preparatory classes at La Salle in Ouagadougou, I joined ESAIP in Angers to specialise in Big Data.',
    },
    {
      fr: 'Deux échanges Erasmus, à KTU en Lituanie puis à RWU en Allemagne, ont aussi jalonné cette formation. En 2026, j’obtiens mon diplôme d’ingénieur.',
      en: 'Two Erasmus exchanges, at KTU in Lithuania and then RWU in Germany, also shaped this education. I graduated with an engineering degree in 2026.',
    },
    {
      fr: 'La suite se joue sur le terrain : des systèmes de données chez Moov Africa aux assistants IA à l’ESSCA.',
      en: 'The story continues in practice: from data systems at Moov Africa to AI assistants at ESSCA.',
    },
  ],
  milestonesTitle: { fr: 'Les repères de ma formation', en: 'Education milestones' },
  milestones: [
    {
      name: 'ESAIP',
      detail: {
        fr: '2022–2026 · Diplôme d’ingénieur, spécialisation Big Data, parcours anglophone.',
        en: '2022–2026 · Engineering degree, specialising in Big Data, taught in English.',
      },
    },
    {
      name: { fr: 'Deux échanges Erasmus', en: 'Two Erasmus exchanges' },
      detail: {
        fr: 'RWU, Allemagne · 2024–2025 — KTU, Lituanie · 2023',
        en: 'RWU, Germany · 2024–2025 — KTU, Lithuania · 2023',
      },
    },
    {
      name: 'CPGE La Salle',
      detail: {
        fr: '2020–2022 · Classes préparatoires à Ouagadougou, Burkina Faso.',
        en: '2020–2022 · Preparatory classes in Ouagadougou, Burkina Faso.',
      },
    },
  ],
};

export const ERASMUS = {
  title: { fr: 'Apprendre ailleurs.', en: 'Learning abroad.' },
  text: {
    fr: 'Deux échanges Erasmus, et des souvenirs qui débordent des salles de cours.',
    en: 'Two Erasmus exchanges, with memories that go beyond the classroom.',
  },
  trips: [
    {
      id: 'ktu',
      label: { fr: '01 / KTU · 2023 · Lituanie', en: '01 / KTU · 2023 · Lithuania' },
      title: { fr: 'Un premier échange à Kaunas.', en: 'A first exchange in Kaunas.' },
      photos: ERASMUS_KTU,
    },
    {
      id: 'rwu',
      label: { fr: '02 / RWU · 2024–2025 · Allemagne', en: '02 / RWU · 2024–2025 · Germany' },
      title: { fr: 'Puis Ravensburg-Weingarten, avec RWU.', en: 'Then Ravensburg-Weingarten, with RWU.' },
      photos: ERASMUS_RWU,
    },
  ],
};
