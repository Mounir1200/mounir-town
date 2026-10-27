import { TILE } from '../config.js';
import { PALETTE } from './palette.js';
import { Pen, createCanvas } from './pen.js';
import { ACCENT_ROOM, drawPixelText, measurePixelText } from './pixelFont.js';

// Each prop declares how much it rises above its footprint and how to paint itself.
// `area` is { width, height, top } where `top` is the footprint's top edge in the sprite.
const PROPS = {
  lamp: {
    extraTop: 22,
    paint(pen, area, effects) {
      const bottom = area.top + area.height;
      pen.rect(5, bottom - 4, 6, 3, PALETTE.ink);
      pen.rect(7, 8, 3, bottom - 11, PALETTE.ink).vline(8, 9, bottom - 13, PALETTE.brownWarm);
      pen.rect(3, 1, 10, 8, PALETTE.ink).rect(4, 3, 8, 5, PALETTE.paper).rect(4, 2, 8, 1, PALETTE.cobalt);
      pen.dot(5, 4, PALETTE.white);
      effects.push({ type: 'glow', x: 8, y: 5 });
    },
  },

  jukebox: {
    extraTop: 12,
    paint(pen, area, effects) {
      pen.rect(2, 3, 12, 24, PALETTE.ink).rect(3, 4, 10, 22, PALETTE.brown);
      pen.rect(4, 2, 8, 3, PALETTE.ink).rect(5, 3, 6, 2, PALETTE.brownWarm);
      pen.rect(4, 7, 8, 7, PALETTE.peach);
      for (let y = 8; y < 14; y += 2) pen.hline(5, y, 6, PALETTE.peachDeep);
      pen.rect(5, 16, 6, 6, PALETTE.ink).rect(6, 17, 4, 4, PALETTE.brownDeep);
      effects.push({ type: 'lights', points: [[3, 6], [12, 6], [3, 15], [12, 15], [3, 23], [12, 23]] });
    },
  },

  arcade: {
    extraTop: 14,
    paint(pen, area, effects) {
      pen.rect(2, 1, 12, 29, PALETTE.ink).rect(3, 2, 10, 27, PALETTE.cobaltDeep);
      pen.rect(3, 2, 10, 4, PALETTE.peach).hline(4, 3, 8, PALETTE.paper);
      pen.rect(4, 8, 8, 8, PALETTE.ink).rect(5, 9, 6, 6, PALETTE.cobaltNight);
      pen.rect(3, 17, 10, 4, PALETTE.brown).dot(5, 18, PALETTE.peach).dot(9, 18, PALETTE.paper).dot(11, 19, PALETTE.cobaltBright);
      pen.vline(3, 21, 8, PALETTE.cobalt);
      effects.push({ type: 'screen', x: 5, y: 9, w: 6, h: 6 });
    },
  },

  bench: {
    extraTop: 6,
    paint(pen) {
      pen.rect(2, 4, 28, 5, PALETTE.ink).rect(3, 5, 26, 3, PALETTE.brownWarm);
      pen.rect(1, 11, 30, 4, PALETTE.ink).rect(2, 12, 28, 2, PALETTE.clay);
      pen.rect(4, 15, 2, 6, PALETTE.ink).rect(26, 15, 2, 6, PALETTE.ink);
      pen.rect(18, 8, 7, 4, PALETTE.ink).rect(19, 9, 5, 2, PALETTE.cobalt).hline(19, 9, 5, PALETTE.paper);
    },
  },

  pullUpBar: {
    extraTop: 20,
    paint(pen, area) {
      const bottom = area.top + area.height;
      [6, 40].forEach(x => {
        pen.rect(x, 4, 3, bottom - 6, PALETTE.ink).vline(x + 1, 5, bottom - 8, PALETTE.brownDeep);
        pen.rect(x - 2, bottom - 3, 7, 2, PALETTE.ink);
      });
      pen.rect(6, 5, 37, 2, PALETTE.ink).hline(9, 5, 31, PALETTE.cream);
    },
  },

  dumbbells: {
    extraTop: 4,
    paint(pen) {
      pen.rect(1, 9, 14, 9, PALETTE.ink).rect(2, 10, 12, 6, PALETTE.brownWarm);
      [3, 9].forEach(x => {
        pen.rect(x, 5, 2, 5, PALETTE.ink).rect(x + 2, 6, 1, 3, PALETTE.paper).rect(x + 3, 5, 2, 5, PALETTE.ink);
      });
    },
  },

  signpost: {
    extraTop: 16,
    paint(pen, area) {
      const bottom = area.top + area.height;
      pen.rect(7, 4, 3, bottom - 5, PALETTE.ink).vline(8, 5, bottom - 7, PALETTE.brownWarm);
      pen.rect(1, 5, 12, 6, PALETTE.ink).rect(2, 6, 10, 4, PALETTE.paper).dot(13, 7, PALETTE.ink).dot(13, 8, PALETTE.ink).dot(14, 7, PALETTE.ink);
      pen.rect(4, 13, 11, 6, PALETTE.ink).rect(5, 14, 9, 4, PALETTE.cream).dot(3, 15, PALETTE.ink).dot(3, 16, PALETTE.ink).dot(2, 15, PALETTE.ink);
      pen.hline(4, 8, 6, PALETTE.brown).hline(7, 16, 5, PALETTE.brown);
    },
  },

  fountain: {
    extraTop: 10,
    paint(pen, area, effects) {
      const centerY = area.top + 20;
      pen.ellipse(16, centerY, 15, 9, PALETTE.ink);
      pen.ellipse(16, centerY, 14, 8, PALETTE.cream);
      pen.ellipse(16, centerY + 1, 11, 5, PALETTE.cobalt);
      pen.ellipse(15, centerY, 6, 2, PALETTE.cobaltBright);
      pen.rect(14, area.top + 4, 5, centerY - area.top - 4, PALETTE.ink).rect(15, area.top + 4, 3, centerY - area.top - 5, PALETTE.paper);
      pen.ellipse(16, area.top + 4, 6, 2, PALETTE.ink).ellipse(16, area.top + 4, 5, 1, PALETTE.cream);
      effects.push({ type: 'fountain', x: 16, y: area.top + 2, basinY: centerY });
    },
  },

  mailbox: {
    extraTop: 8,
    paint(pen, area) {
      const bottom = area.top + area.height;
      pen.rect(7, 13, 3, bottom - 14, PALETTE.ink);
      pen.rect(3, 3, 11, 11, PALETTE.ink).rect(4, 4, 9, 9, PALETTE.cobalt).hline(4, 4, 9, PALETTE.cobaltBright);
      pen.hline(5, 7, 7, PALETTE.ink).rect(13, 5, 2, 4, PALETTE.peach);
    },
  },

  plane: {
    extraTop: 8,
    paint(pen) {
      const middle = 20;
      for (let y = 2; y <= 38; y++) {
        const distance = Math.abs(y - middle);
        const left = 36 + Math.round(distance * 0.35);
        const width = Math.max(4, 14 - Math.round(distance * 0.25));
        pen.hline(left, y, width, PALETTE.cobalt).dot(left, y, PALETTE.ink).dot(left + width - 1, y, PALETTE.ink);
      }
      pen.hline(42, 2, 9, PALETTE.ink).hline(42, 38, 9, PALETTE.ink);
      for (let y = 11; y <= 29; y++) {
        const distance = Math.abs(y - middle);
        pen.hline(6 + Math.round(distance * 0.3), y, 7, PALETTE.cobalt).dot(6 + Math.round(distance * 0.3), y, PALETTE.ink);
      }
      pen.rect(4, middle - 5, 70, 11, PALETTE.ink).rect(5, middle - 4, 68, 9, PALETTE.paper);
      pen.ellipse(73, middle, 5, 4, PALETTE.ink).ellipse(73, middle, 4, 3, PALETTE.paper);
      pen.hline(5, middle + 3, 70, PALETTE.cream).hline(5, middle - 1, 66, PALETTE.peach);
      for (let x = 14; x < 66; x += 5) pen.dot(x, middle - 3, PALETTE.cobaltDeep);
      pen.rect(72, middle - 3, 3, 2, PALETTE.cobaltBright);
      [[44, 9], [44, 31]].forEach(([x, y]) => pen.ellipse(x, y, 4, 2, PALETTE.ink).ellipse(x, y, 3, 1, PALETTE.brownDeep));
    },
  },

  billboard: {
    extraTop: 24,
    paint(pen, area, effects, lines) {
      const bottom = area.top + area.height;
      [8, 54].forEach(x => pen.rect(x, 24, 3, bottom - 25, PALETTE.ink).vline(x + 1, 25, bottom - 27, PALETTE.brownWarm));
      pen.rect(0, 1, area.width, 25, PALETTE.ink).rect(1, 2, area.width - 2, 23, PALETTE.paper);
      pen.rect(2, 3, area.width - 4, 21, PALETTE.cream).rect(3, 4, area.width - 6, 19, PALETTE.paper);
      lines.forEach((line, index) => {
        const x = Math.round((area.width - measurePixelText(line)) / 2);
        drawPixelText(pen.context, line, x, 6 + ACCENT_ROOM + index * 9, index === 0 ? PALETTE.brown : PALETTE.cobalt);
      });
    },
  },
};

export function paintProp(prop, lines = []) {
  const recipe = PROPS[prop.kind];
  const width = prop.rect.w * TILE;
  const height = prop.rect.h * TILE;
  const canvas = createCanvas(width, height + recipe.extraTop);
  const effects = [];
  recipe.paint(Pen.forCanvas(canvas), { width, height, top: recipe.extraTop }, effects, lines);
  return { canvas, offsetY: recipe.extraTop, effects };
}
