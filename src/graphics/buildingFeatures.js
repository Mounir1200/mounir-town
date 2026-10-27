import { PALETTE } from './palette.js';

const MAST_SEGMENT = 6;
const COLUMN_SPACING = 18;
const PEDIMENT_HEIGHT = 14;

// Details that make each building recognisable. Each painter receives the shared
// layout and may register animated effects (blinking lights, smoke, screens).
export const BUILDING_FEATURES = {
  chimney(pen, layout) {
    const x = layout.width - 24;
    const y = layout.top - 8;
    pen.rect(x - 1, y - 1, 9, 16, PALETTE.ink);
    pen.rect(x, y, 7, 14, PALETTE.clay);
    pen.hline(x, y + 5, 7, PALETTE.brownWarm).hline(x, y + 9, 7, PALETTE.brownWarm);
    pen.rect(x - 1, y - 1, 9, 3, PALETTE.brownDeep);
    layout.effects.push({ type: 'smoke', x: x + 3, y: y - 3 });
  },

  flowerBoxes(pen, layout) {
    const petals = [PALETTE.paper, PALETTE.cobaltBright, PALETTE.peachDeep];
    layout.windows.forEach(window => {
      const y = window.y + window.h + 2;
      pen.rect(window.x - 2, y, window.w + 4, 3, PALETTE.brownWarm).hline(window.x - 2, y + 2, window.w + 4, PALETTE.ink);
      for (let x = window.x - 1, index = 0; x < window.x + window.w + 1; x += 2, index++) pen.dot(x, y - 1, petals[index % petals.length]);
    });
  },

  dish(pen, layout) {
    const centerX = layout.width - 18;
    const centerY = layout.roof.y + 13;
    pen.rect(centerX - 1, centerY, 3, 8, PALETTE.ink);
    pen.ellipse(centerX, centerY, 8, 5, PALETTE.ink);
    pen.ellipse(centerX, centerY, 7, 4, PALETTE.paper);
    pen.ellipse(centerX - 1, centerY - 1, 3, 2, PALETTE.cream);
    pen.vline(centerX, centerY - 7, 7, PALETTE.ink);
    layout.effects.push({ type: 'blink', x: centerX, y: centerY - 8, color: PALETTE.cobaltBright, period: 1.6 });
  },

  antenna(pen, layout) {
    const x = 12;
    const top = layout.top - 12;
    pen.vline(x, top, layout.roof.y + 6 - top, PALETTE.ink);
    pen.hline(x - 3, top + 4, 7, PALETTE.ink).hline(x - 2, top + 8, 5, PALETTE.ink);
    layout.effects.push({ type: 'blink', x, y: top - 1, color: PALETTE.peach, period: 1.1 });
  },

  flags(pen, layout) {
    const colors = [PALETTE.peach, PALETTE.paper, PALETTE.cobaltBright];
    [0.3, 0.5, 0.7].forEach((share, index) => {
      const x = Math.round(layout.width * share);
      const base = layout.roof.y + 8;
      const top = base - 18;
      pen.vline(x, top, 18, PALETTE.ink);
      pen.rect(x + 1, top, 9, 6, PALETTE.ink).rect(x + 1, top + 1, 8, 4, colors[index]);
    });
  },

  rooftopUnits(pen, layout) {
    const { roof } = layout;
    [roof.x + 10, roof.x + roof.w - 24].forEach(x => {
      const y = roof.y + roof.h - 16;
      pen.rect(x, y, 14, 9, PALETTE.ink).rect(x + 1, y + 1, 12, 7, PALETTE.cream);
      pen.hline(x + 2, y + 3, 10, PALETTE.peachDeep).hline(x + 2, y + 5, 10, PALETTE.peachDeep);
    });
  },

  mast(pen, layout) {
    const centerX = Math.round(layout.width / 2);
    const top = 4;
    const base = layout.roof.y + Math.round(layout.roof.h / 2);
    for (let y = top, segment = 0; y < base; y += MAST_SEGMENT, segment++) {
      const half = (row) => Math.round(2 + 5 * ((row - top) / (base - top)));
      const fill = segment % 2 === 0 ? PALETTE.clay : PALETTE.paper;
      for (let row = y; row < Math.min(y + MAST_SEGMENT, base); row++) {
        const width = half(row);
        pen.hline(centerX - width, row, width * 2 + 1, fill);
        pen.dot(centerX - width, row, PALETTE.ink).dot(centerX + width, row, PALETTE.ink);
        const progress = (row - y) / MAST_SEGMENT;
        pen.dot(Math.round(centerX - width + progress * width * 2), row, PALETTE.brownDeep);
      }
    }
    [top + 12, top + 26].forEach(y => {
      pen.rect(centerX - 8, y, 3, 7, PALETTE.ink).rect(centerX - 7, y + 1, 1, 5, PALETTE.paper);
      pen.rect(centerX + 6, y, 3, 7, PALETTE.ink).rect(centerX + 7, y + 1, 1, 5, PALETTE.paper);
    });
    pen.vline(centerX, 0, top, PALETTE.ink);
    layout.effects.push({ type: 'blink', x: centerX, y: 0, color: PALETTE.peach, period: 1.4 });
  },

  clock(pen, layout) {
    const centerX = Math.round(layout.width / 2);
    const centerY = layout.roof.y + Math.round(layout.roof.h * 0.48);
    pen.disc(centerX, centerY, 7, PALETTE.ink).disc(centerX, centerY, 6, PALETTE.paper);
    pen.vline(centerX, centerY - 4, 4, PALETTE.ink).hline(centerX, centerY, 4, PALETTE.ink);
    pen.dot(centerX, centerY, PALETTE.brown);
  },

  belfry(pen, layout) {
    const centerX = Math.round(layout.width / 2);
    const y = layout.top - 6;
    pen.rect(centerX - 7, y - 1, 15, 13, PALETTE.ink).rect(centerX - 6, y, 13, 11, PALETTE.paper);
    pen.rect(centerX - 2, y + 2, 5, 6, PALETTE.cobaltNight).rect(centerX - 1, y + 4, 3, 3, PALETTE.peach);
    for (let row = 0; row < 7; row++) {
      const width = 16 - row * 2;
      pen.hline(centerX - width / 2, y - 2 - row, width + 1, row === 6 ? PALETTE.ink : PALETTE.cobalt);
      pen.dot(centerX - width / 2, y - 2 - row, PALETTE.ink).dot(centerX + width / 2, y - 2 - row, PALETTE.ink);
    }
  },

  controlTower(pen, layout) {
    const cab = { x: layout.width - 32, y: 5, w: 22, h: 10 };
    const shaftX = cab.x + 7;
    const shaftBottom = layout.roof.y + 12;
    pen.rect(shaftX - 1, cab.y + cab.h, 10, shaftBottom - cab.y - cab.h, PALETTE.ink);
    pen.rect(shaftX, cab.y + cab.h, 8, shaftBottom - cab.y - cab.h - 1, PALETTE.paper);
    pen.vline(shaftX + 6, cab.y + cab.h, shaftBottom - cab.y - cab.h - 1, PALETTE.cream);
    pen.rect(cab.x - 1, cab.y - 1, cab.w + 2, cab.h + 2, PALETTE.ink);
    pen.rect(cab.x, cab.y, cab.w, cab.h, PALETTE.cobaltBright);
    for (let x = cab.x + 4; x < cab.x + cab.w; x += 5) pen.vline(x, cab.y, cab.h, PALETTE.paper);
    pen.dot(cab.x + 1, cab.y + 1, PALETTE.sky).dot(cab.x + 2, cab.y + 1, PALETTE.sky);
    pen.rect(cab.x - 2, cab.y - 3, cab.w + 4, 3, PALETTE.brownDeep);
    pen.vline(cab.x + cab.w / 2, 0, cab.y - 3, PALETTE.ink);
    layout.effects.push({ type: 'blink', x: cab.x + cab.w / 2, y: 0, color: PALETTE.peach, period: 1.2 });
  },

  pediment(pen, layout) {
    const centerX = Math.round(layout.width / 2);
    const baseY = layout.wall.y + 2;
    const halfBase = Math.round(layout.width / 2) - 6;
    for (let row = 0; row <= PEDIMENT_HEIGHT; row++) {
      const half = Math.round((row / PEDIMENT_HEIGHT) * halfBase);
      const y = baseY - PEDIMENT_HEIGHT + row;
      pen.hline(centerX - half, y, half * 2 + 1, PALETTE.paper);
      pen.dot(centerX - half, y, PALETTE.ink).dot(centerX + half, y, PALETTE.ink);
    }
    pen.rect(4, baseY, layout.width - 8, 5, PALETTE.ink).rect(5, baseY + 1, layout.width - 10, 3, PALETTE.cream);
    layout.signY = baseY - 10;
  },

  columns(pen, layout) {
    const { wall, door } = layout;
    const top = wall.y + 9;
    const bottom = wall.y + wall.h - 4;
    for (let x = wall.x + 7; x < wall.x + wall.w - 10; x += COLUMN_SPACING) {
      if (x + 8 > door.x - 3 && x < door.x + door.w + 3) continue;
      pen.rect(x, top, 7, bottom - top, PALETTE.ink).rect(x + 1, top, 5, bottom - top, PALETTE.paper);
      pen.vline(x + 4, top, bottom - top, PALETTE.cream).vline(x + 5, top, bottom - top, PALETTE.cream);
      pen.rect(x - 1, top - 1, 9, 3, PALETTE.ink).rect(x, top, 7, 1, PALETTE.cream);
    }
    pen.rect(wall.x, wall.y + wall.h - 4, wall.w, 2, PALETTE.paper).hline(wall.x, wall.y + wall.h - 2, wall.w, PALETTE.cream);
  },

  envelope(pen, layout) {
    const { door } = layout;
    const x = Math.round(door.x + door.w / 2 - 6);
    const y = door.y - 12;
    pen.rect(x, y, 12, 8, PALETTE.ink).rect(x + 1, y + 1, 10, 6, PALETTE.paper);
    for (let step = 0; step < 5; step++) pen.dot(x + 1 + step, y + 1 + step, PALETTE.ink).dot(x + 10 - step, y + 1 + step, PALETTE.ink);
    pen.dot(x + 6, y + 6, PALETTE.peachDeep);
  },
};
