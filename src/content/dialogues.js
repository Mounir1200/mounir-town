import { READING, GAMING, WORKOUT } from './hobbies.js';

export const SPEAKERS = {
  mounir: { name: { fr: 'Mounir', en: 'Mounir' }, portrait: 'photo' },
  guide: { name: { fr: 'Guide de la ville', en: 'Town guide' }, portrait: 'guide' },
  traveller: { name: { fr: 'Voyageuse', en: 'Traveller' }, portrait: 'traveller' },
  cat: { name: { fr: 'Chat', en: 'Cat' }, portrait: 'cat' },
  sign: { name: { fr: 'Panneau', en: 'Sign' }, portrait: 'sign' },
  book: { name: { fr: 'Carnet de lecture', en: 'Reading notebook' }, portrait: 'book' },
};

// A line may provide `touch` text, shown instead of `text` on touch screens.
export const DIALOGUES = {
  intro: [
    { speaker: 'mounir', text: { fr: 'Salut, moi c’est Mounir ! Bienvenue dans ma ville.', en: 'Hi, I’m Mounir! Welcome to my town.' } },
    {
      speaker: 'mounir',
      text: {
        fr: 'Je suis ingénieur IA et développeur, basé à Angers. Je conçois des agents IA — et les systèmes qui les rendent utiles.',
        en: 'I’m an AI engineer and developer based in Angers. I design AI agents — and the systems that make them useful.',
      },
    },
    {
      speaker: 'mounir',
      text: {
        fr: 'Chaque bâtiment raconte une partie de mon parcours : mes projets au Labo IA, mes expériences à l’ESSCA, ma formation à l’ESAIP, mes échanges Erasmus à l’aéroport…',
        en: 'Each building tells part of my story: my projects at the AI Lab, my experience at ESSCA, my studies at ESAIP, my Erasmus exchanges at the airport…',
      },
    },
    {
      speaker: 'mounir',
      text: {
        fr: 'Déplace-toi avec les flèches ou ZQSD, appuie sur E pour entrer et sur M pour la carte. Tu peux aussi cliquer sur un bâtiment pour t’y rendre.',
        en: 'Move with the arrow keys or WASD, press E to go inside and M for the map. You can also click a building to walk there.',
      },
      touch: {
        fr: 'Touche le sol pour te déplacer, ou directement un bâtiment pour y entrer. Le bouton Carte te mène partout.',
        en: 'Tap the ground to move, or tap a building to go inside. The Map button takes you anywhere.',
      },
    },
    { speaker: 'mounir', text: { fr: 'Huit compétences sont cachées en ville. Bonne exploration !', en: 'Eight skills are hidden around town. Enjoy exploring!' } },
  ],
  welcomeBack: [
    { speaker: 'mounir', text: { fr: 'Re-bonjour ! Content de te revoir en ville.', en: 'Hi again! Good to see you back in town.' } },
  ],
  guide: [
    {
      speaker: 'guide',
      text: {
        fr: 'Bienvenue ! Le Labo IA, au nord-ouest, abrite les projets personnels de Mounir.',
        en: 'Welcome! The AI Lab, to the north-west, is home to Mounir’s personal projects.',
      },
    },
    {
      speaker: 'guide',
      text: {
        fr: 'Pressé·e ? Ouvre la carte : elle mène directement à chaque lieu.',
        en: 'In a hurry? Open the map: it takes you straight to each place.',
      },
    },
  ],
  traveller: [
    {
      speaker: 'traveller',
      text: {
        fr: 'J’attends mon vol. Il paraît que Mounir a fait deux échanges Erasmus : Kaunas, puis Ravensburg-Weingarten.',
        en: 'I’m waiting for my flight. Apparently Mounir did two Erasmus exchanges: Kaunas, then Ravensburg-Weingarten.',
      },
    },
  ],
  cat: [
    { speaker: 'cat', text: { fr: 'Miaou.', en: 'Meow.' } },
    { speaker: 'cat', text: { fr: '(Le chat a l’air de garder la galerie.)', en: '(The cat seems to be guarding the gallery.)' } },
  ],
  directions: [
    {
      speaker: 'sign',
      text: {
        fr: '↑ Nord : Labo IA · ESSCA · Antenne Moov Africa. ← Ouest : ESAIP.',
        en: '↑ North: AI Lab · ESSCA · Moov Africa tower. ← West: ESAIP.',
      },
    },
    {
      speaker: 'sign',
      text: {
        fr: '→ Est : Aéroport. ↓ Sud : Galerie · Bureau de poste.',
        en: '→ East: Airport. ↓ South: Gallery · Post office.',
      },
    },
  ],
  motto: [
    { speaker: 'sign', text: { fr: 'Des idées au réel.', en: 'From ideas to reality.' } },
    { speaker: 'sign', text: { fr: 'Imaginer. Construire. Relier.', en: 'Imagine. Build. Connect.' } },
  ],
  fountain: [
    { speaker: 'sign', text: { fr: 'Une fontaine. L’eau est fraîche.', en: 'A fountain. The water is cool.' } },
  ],
  gaming: [
    { speaker: 'mounir', text: GAMING.text },
    { speaker: 'mounir', text: GAMING.console },
  ],
  reading: [
    { speaker: 'mounir', text: READING.text },
    ...READING.quotes.map(quote => ({ speaker: 'book', text: quote.text, caption: quote.source })),
  ],
  workout: [
    { speaker: 'mounir', text: WORKOUT.text },
  ],
  allSkills: [
    {
      speaker: 'mounir',
      text: {
        fr: 'Tu as rassemblé toute ma stack : Python, FastAPI, React, RAG, MCP, Azure, AWS et Big Data !',
        en: 'You’ve collected my whole stack: Python, FastAPI, React, RAG, MCP, Azure, AWS and Big Data!',
      },
    },
    {
      speaker: 'mounir',
      text: {
        fr: 'Pour la suite, passe au bureau de poste pour m’écrire — ou télécharge mon CV depuis le menu.',
        en: 'What next? Drop by the post office to write to me — or download my CV from the menu.',
      },
    },
  ],
  allPlaces: [
    {
      speaker: 'mounir',
      text: {
        fr: 'Tu as fait le tour de la ville, merci pour la visite ! Un projet, une question, une rencontre ? Construisons la suite.',
        en: 'You’ve seen the whole town — thanks for visiting! A project, a question, a conversation? Let’s build what comes next.',
      },
    },
  ],
};
