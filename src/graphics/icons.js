import { PALETTE } from './palette.js';
import { spriteFromRows } from './pixelSprite.js';

const ICON_COLORS = {
  o: PALETTE.ink,
  p: PALETTE.paper,
  c: PALETTE.cream,
  b: PALETTE.cobalt,
  B: PALETTE.cobaltBright,
  d: PALETTE.cobaltDeep,
  w: PALETTE.brownWarm,
  r: PALETTE.brown,
  k: PALETTE.peach,
};

// Skill gem floating above the ground.
export function paintSkillGem() {
  return spriteFromRows([
    '....oooo....',
    '...oBppBo...',
    '..oBpBBbbo..',
    '.oBBBBbbbdo.',
    'oBBBBbbbbddo',
    'obbbbbbbdddo',
    '.obbbbbddo..',
    '..obbbbdo...',
    '...obbdo....',
    '....obo.....',
    '.....o......',
  ].map(row => row.padEnd(12, '.')), ICON_COLORS, 'skill gem');
}

// Speech bubble with an exclamation mark, shown above what the player can use.
export function paintInteractionBubble() {
  return spriteFromRows([
    '.ooooooo.',
    'oppppppPo',
    'opppbpppo',
    'opppbpppo',
    'opppbpppo',
    'oppppppPo',
    'opppbpppo',
    'oppppppPo',
    '.ooooooo.',
    '...oo....',
    '...o.....',
  ], { ...ICON_COLORS, P: PALETTE.cream }, 'bubble');
}

export function paintSignIcon() {
  return spriteFromRows([
    '................',
    '................',
    '..oooooooooooo..',
    '..opppppppppppo.',
    '..oprrrrprrrpo..',
    '..opppppppppppo.',
    '..oprrrprrrrpo..',
    '..opppppppppppo.',
    '..oooooooooooo..',
    '.......ow.......',
    '.......ow.......',
    '.......ow.......',
    '.......ow.......',
    '.......ow.......',
    '......oooo......',
    '................',
  ].map(row => row.padEnd(16, '.').slice(0, 16)), ICON_COLORS, 'sign icon');
}

export function paintBookIcon() {
  return spriteFromRows([
    '................',
    '................',
    '..oooooo.oooooo.',
    '.obbbbbbobbbbbbo',
    '.obppppbobppppbo',
    '.obpccpbobpccpbo',
    '.obppppbobppppbo',
    '.obpccpbobpccpbo',
    '.obppppbobppppbo',
    '.obpccpbobpccpbo',
    '.obppppbobppppbo',
    '.obbbbbbobbbbbbo',
    '..oooooo.oooooo.',
    '.......oo.......',
    '................',
    '................',
  ], ICON_COLORS, 'book icon');
}
