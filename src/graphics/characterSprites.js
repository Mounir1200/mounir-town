import { PALETTE } from './palette.js';
import { CAT_FRAMES, CHARACTER_FRAMES } from './characterTemplates.js';
import { cropped, mirrored, spriteFromRows } from './pixelSprite.js';

const BASE_COLORS = { o: PALETTE.ink, e: PALETTE.ink, s: PALETTE.skin, S: PALETTE.skinShade };

// Colour swaps that turn the shared template into each character.
export const LOOKS = {
  mounir: {
    ...BASE_COLORS,
    h: PALETTE.hair,
    f: PALETTE.cream,
    c: PALETTE.cobalt,
    C: PALETTE.cobaltDeep,
    p: PALETTE.peach,
    b: PALETTE.brownDeep,
    k: PALETTE.ink,
  },
  guide: {
    ...BASE_COLORS,
    s: PALETTE.skinLight,
    S: PALETTE.skin,
    h: PALETTE.brownDeep,
    f: PALETTE.skinLight,
    c: PALETTE.clay,
    C: PALETTE.brownWarm,
    p: PALETTE.paper,
    b: PALETTE.cobaltDeep,
    k: PALETTE.brownDeep,
  },
  traveller: {
    ...BASE_COLORS,
    h: PALETTE.ink,
    f: PALETTE.skin,
    c: PALETTE.peachDeep,
    C: PALETTE.clay,
    p: PALETTE.cream,
    b: PALETTE.cobalt,
    k: PALETTE.ink,
  },
};

const CAT_COLORS = { o: PALETTE.ink, C: PALETTE.brownWarm, w: PALETTE.cream, e: PALETTE.peach, n: PALETTE.peachDeep };

export function buildCharacterSprites(look) {
  const colors = LOOKS[look];
  const paint = (rows, index) => spriteFromRows(rows, colors, `${look} frame ${index}`);
  const down = CHARACTER_FRAMES.down.map(paint);
  const up = CHARACTER_FRAMES.up.map(paint);
  const right = CHARACTER_FRAMES.right.map(paint);
  return { down, up, right, left: right.map(mirrored) };
}

export function buildCatSprites() {
  const left = CAT_FRAMES.map((rows, index) => spriteFromRows(rows, CAT_COLORS, `cat frame ${index}`));
  return { left, right: left.map(mirrored) };
}

// Head-and-shoulders crop of the standing front frame, used as a dialogue portrait.
export function portraitOf(sprites) {
  return cropped(sprites.down[0], 0, 0, 16, 16);
}
