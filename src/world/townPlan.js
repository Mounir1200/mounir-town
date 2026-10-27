import { TERRAIN } from './terrain.js';

// Town layout in tiles. Later terrain areas paint over earlier ones.
export const TOWN_PLAN = {
  width: 60,
  height: 42,
  borderThickness: 2,
  treeSeed: 20261027,
  treeDensity: 0.22,
  spawn: { x: 28, y: 22, facing: 'down' },

  terrain: [
    { terrain: TERRAIN.PATH, rect: { x: 2, y: 11, w: 56, h: 2 } },
    { terrain: TERRAIN.PATH, rect: { x: 2, y: 23, w: 56, h: 2 } },
    { terrain: TERRAIN.PATH, rect: { x: 2, y: 36, w: 56, h: 2 } },
    { terrain: TERRAIN.PATH, rect: { x: 17, y: 11, w: 2, h: 27 } },
    { terrain: TERRAIN.PATH, rect: { x: 38, y: 11, w: 2, h: 27 } },
    { terrain: TERRAIN.PLAZA, rect: { x: 23, y: 21, w: 12, h: 7 } },
    { terrain: TERRAIN.TARMAC, rect: { x: 42, y: 25, w: 16, h: 4 } },
    { terrain: TERRAIN.SAND, rect: { x: 50, y: 29, w: 6, h: 5 } },
    { terrain: TERRAIN.WATER, rect: { x: 21, y: 29, w: 15, h: 7 }, shape: 'ellipse' },
    { terrain: TERRAIN.FLOWERS, rect: { x: 23, y: 17, w: 2, h: 3 } },
    { terrain: TERRAIN.FLOWERS, rect: { x: 5, y: 22, w: 3, h: 1 } },
    { terrain: TERRAIN.FLOWERS, rect: { x: 11, y: 22, w: 3, h: 1 } },
    { terrain: TERRAIN.FLOWERS, rect: { x: 5, y: 35, w: 3, h: 1 } },
    { terrain: TERRAIN.FLOWERS, rect: { x: 11, y: 35, w: 3, h: 1 } },
  ],

  // `doorX` is the door column on the bottom row; the tile below it is where the player stands.
  buildings: [
    { id: 'lab', rect: { x: 5, y: 4, w: 9, h: 6 }, doorX: 9 },
    { id: 'essca', rect: { x: 22, y: 3, w: 12, h: 7 }, doorX: 27 },
    { id: 'tower', rect: { x: 43, y: 4, w: 5, h: 6 }, doorX: 45 },
    { id: 'school', rect: { x: 4, y: 15, w: 11, h: 7 }, doorX: 9 },
    { id: 'home', rect: { x: 25, y: 16, w: 7, h: 5 }, doorX: 28 },
    { id: 'airport', rect: { x: 43, y: 15, w: 13, h: 6 }, doorX: 49 },
    { id: 'museum', rect: { x: 4, y: 29, w: 11, h: 6 }, doorX: 9 },
    { id: 'post', rect: { x: 42, y: 30, w: 7, h: 5 }, doorX: 45 },
  ],

  props: [
    {
      id: 'jukebox', kind: 'jukebox', rect: { x: 33, y: 22, w: 1, h: 1 },
      interaction: { verb: 'use', action: { type: 'music' }, label: { fr: 'Juke-box', en: 'Jukebox' } },
    },
    {
      id: 'billboard', kind: 'billboard', rect: { x: 33, y: 17, w: 4, h: 1 },
      lines: { fr: ['DES IDÉES', 'AU RÉEL.'], en: ['FROM IDEAS', 'TO REALITY.'] },
      interaction: { verb: 'read', action: { type: 'dialogue', script: 'motto' }, label: { fr: 'Panneau « Des idées au réel »', en: '“From ideas to reality” sign' } },
    },
    {
      id: 'arcade', kind: 'arcade', rect: { x: 32, y: 19, w: 1, h: 1 },
      interaction: { verb: 'use', action: { type: 'dialogue', script: 'gaming' }, label: { fr: 'Borne d’arcade', en: 'Arcade cabinet' } },
    },
    {
      id: 'bench', kind: 'bench', rect: { x: 25, y: 28, w: 2, h: 1 },
      interaction: { verb: 'read', action: { type: 'dialogue', script: 'reading' }, label: { fr: 'Banc de lecture', en: 'Reading bench' } },
    },
    {
      id: 'workout', kind: 'pullUpBar', rect: { x: 51, y: 30, w: 3, h: 1 },
      interaction: { verb: 'use', action: { type: 'dialogue', script: 'workout' }, label: { fr: 'Barre de traction', en: 'Pull-up bar' } },
    },
    {
      id: 'signpost', kind: 'signpost', rect: { x: 22, y: 25, w: 1, h: 1 },
      interaction: { verb: 'read', action: { type: 'dialogue', script: 'directions' }, label: { fr: 'Panneau indicateur', en: 'Signpost' } },
    },
    {
      id: 'fountain', kind: 'fountain', rect: { x: 28, y: 25, w: 2, h: 2 },
      interaction: { verb: 'look', action: { type: 'dialogue', script: 'fountain' }, label: { fr: 'Fontaine', en: 'Fountain' } },
    },
    { id: 'lamp-nw', kind: 'lamp', rect: { x: 23, y: 21, w: 1, h: 1 } },
    { id: 'lamp-ne', kind: 'lamp', rect: { x: 34, y: 21, w: 1, h: 1 } },
    { id: 'lamp-sw', kind: 'lamp', rect: { x: 23, y: 27, w: 1, h: 1 } },
    { id: 'lamp-se', kind: 'lamp', rect: { x: 34, y: 27, w: 1, h: 1 } },
    { id: 'mailbox', kind: 'mailbox', rect: { x: 47, y: 35, w: 1, h: 1 } },
    { id: 'dumbbells', kind: 'dumbbells', rect: { x: 54, y: 32, w: 1, h: 1 } },
    { id: 'plane', kind: 'plane', rect: { x: 47, y: 26, w: 5, h: 2 } },
  ],

  npcs: [
    { id: 'guide', look: 'guide', tile: { x: 25, y: 23 }, facing: 'down', script: 'guide' },
    { id: 'traveller', look: 'traveller', tile: { x: 52, y: 22 }, facing: 'left', script: 'traveller' },
    { id: 'cat', look: 'cat', tile: { x: 12, y: 35 }, facing: 'left', script: 'cat' },
  ],

  skills: [
    { id: 'python', tile: { x: 14, y: 3 } },
    { id: 'mcp', tile: { x: 3, y: 8 } },
    { id: 'rag', tile: { x: 36, y: 6 } },
    { id: 'azure', tile: { x: 53, y: 7 } },
    { id: 'fastapi', tile: { x: 20, y: 18 } },
    { id: 'react', tile: { x: 41, y: 18 } },
    { id: 'aws', tile: { x: 37, y: 31 } },
    { id: 'big-data', tile: { x: 15, y: 32 } },
  ],
};
