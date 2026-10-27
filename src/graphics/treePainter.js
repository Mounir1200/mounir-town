import { tileNoise } from '../core/random.js';
import { PALETTE } from './palette.js';
import { Pen, createCanvas } from './pen.js';

export const TREE_SIZE = { width: 32, height: 34 };
// Pixel row of the trunk base inside the sprite, aligned with the bottom of its tile.
export const TREE_BASE_Y = 31;

const CANOPY_COLORS = {
  round: { outline: PALETTE.ink, shade: PALETTE.cobaltDeep, body: PALETTE.cobalt, light: PALETTE.cobaltBright, sparkle: PALETTE.sky },
  blossom: { outline: PALETTE.ink, shade: PALETTE.clay, body: PALETTE.peachDeep, light: PALETTE.peachLight, sparkle: PALETTE.paper },
};

export function paintTree(variant) {
  const canvas = createCanvas(TREE_SIZE.width, TREE_SIZE.height);
  const pen = Pen.forCanvas(canvas);
  if (variant === 'pine') paintPine(pen);
  else paintRoundTree(pen, CANOPY_COLORS[variant] ?? CANOPY_COLORS.round, variant === 'blossom');
  return canvas;
}

function paintTrunk(pen, top, height) {
  pen.rect(13, top, 7, height, PALETTE.ink);
  pen.rect(14, top, 5, height - 1, PALETTE.brownWarm);
  pen.vline(17, top, height - 1, PALETTE.brown).vline(18, top, height - 1, PALETTE.brownDeep);
}

function paintRoundTree(pen, colors, hasBlossoms) {
  paintTrunk(pen, 20, 12);
  pen.ellipse(16, 13, 14, 12, colors.outline);
  pen.ellipse(16, 13, 13, 11, colors.shade);
  pen.ellipse(15, 11, 11, 9, colors.body);
  pen.ellipse(12, 8, 5, 4, colors.light);
  for (let index = 0; index < 14; index++) {
    const x = 5 + Math.floor(tileNoise(index, 3, 11) * 22);
    const y = 3 + Math.floor(tileNoise(index, 5, 13) * 16);
    pen.dot(x, y, colors.shade);
  }
  pen.dot(10, 6, colors.sparkle).dot(11, 6, colors.sparkle).dot(10, 7, colors.sparkle);
  if (hasBlossoms) {
    for (let index = 0; index < 12; index++) {
      const x = 6 + Math.floor(tileNoise(index, 7, 17) * 20);
      const y = 4 + Math.floor(tileNoise(index, 9, 19) * 16);
      pen.dot(x, y, index % 3 === 0 ? PALETTE.peachLight : PALETTE.paper);
    }
  }
}

function paintPine(pen) {
  paintTrunk(pen, 25, 7);
  const layers = [
    { top: 1, height: 11, halfWidth: 7 },
    { top: 7, height: 11, halfWidth: 10 },
    { top: 13, height: 13, halfWidth: 13 },
  ];
  layers.forEach(({ top, height, halfWidth }) => {
    for (let row = 0; row <= height; row++) {
      const half = Math.max(1, Math.round((row / height) * halfWidth));
      const y = top + row;
      pen.hline(16 - half, y, half * 2 + 1, PALETTE.cobalt);
      pen.hline(16 + 1, y, half, PALETTE.cobaltDeep);
      pen.dot(16 - half + 1, y, PALETTE.cobaltBright);
      pen.dot(16 - half, y, PALETTE.ink).dot(16 + half, y, PALETTE.ink);
    }
    pen.hline(16 - halfWidth, top + height, halfWidth * 2 + 1, PALETTE.ink);
  });
  pen.dot(16, 0, PALETTE.ink);
}
