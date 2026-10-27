// Every building of the town and the part of the portfolio it holds.
// The order is the order of the map menu.
export const LOCATIONS = [
  {
    id: 'home',
    name: { fr: 'Maison de Mounir', en: 'Mounir’s house' },
    theme: { fr: 'Hobbies', en: 'Hobbies' },
    sign: 'MOUNIR',
  },
  {
    id: 'lab',
    name: { fr: 'Labo IA', en: 'AI Lab' },
    theme: { fr: 'Projets', en: 'Projects' },
    sign: { fr: 'LABO IA', en: 'AI LAB' },
  },
  {
    id: 'essca',
    name: { fr: 'ESSCA', en: 'ESSCA' },
    theme: { fr: 'Expériences', en: 'Experience' },
    sign: 'ESSCA',
  },
  {
    id: 'tower',
    name: { fr: 'Antenne Moov Africa', en: 'Moov Africa tower' },
    theme: { fr: 'Data engineering', en: 'Data engineering' },
    sign: 'MOOV AFRICA',
  },
  {
    id: 'school',
    name: { fr: 'ESAIP', en: 'ESAIP' },
    theme: { fr: 'Formation', en: 'Education' },
    sign: 'ESAIP',
  },
  {
    id: 'airport',
    name: { fr: 'Aéroport', en: 'Airport' },
    theme: { fr: 'Échanges Erasmus', en: 'Erasmus exchanges' },
    sign: { fr: 'AÉROPORT', en: 'AIRPORT' },
  },
  {
    id: 'museum',
    name: { fr: 'Galerie', en: 'Gallery' },
    theme: { fr: 'Photographie', en: 'Photography' },
    sign: { fr: 'GALERIE', en: 'GALLERY' },
  },
  {
    id: 'post',
    name: { fr: 'Bureau de poste', en: 'Post office' },
    theme: { fr: 'Contact', en: 'Contact' },
    sign: 'CONTACT',
  },
];

export function locationById(id) {
  return LOCATIONS.find(location => location.id === id);
}
