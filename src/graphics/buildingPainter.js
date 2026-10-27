import { TILE } from '../config.js';
import { tileNoise } from '../core/random.js';
import { BUILDING_FEATURES } from './buildingFeatures.js';
import { PALETTE } from './palette.js';
import { Pen, createCanvas } from './pen.js';
import { ACCENT_ROOM, GLYPH_HEIGHT, drawPixelText, measurePixelText } from './pixelFont.js';

const ROOF_SHARE = 0.44;
const GABLE_OVERHANG = 2;
const DOOR_WIDTH = 12;
const DOOR_MAX_HEIGHT = 18;
const WINDOW_SIZE = 10;
const WINDOW_SPACING = 22;
const SIGN_PADDING = 4;

// Paints a building sprite and returns it with anchors for animated effects.
export function paintBuilding(building, style, signText) {
  const width = building.rect.w * TILE;
  const bodyHeight = building.rect.h * TILE;
  const canvas = createCanvas(width, bodyHeight + style.extraTop);
  const pen = Pen.forCanvas(canvas);
  const layout = computeLayout(building, style, width, bodyHeight);

  ROOFS[style.roofKind](pen, layout.roof, style);
  paintWall(pen, layout.wall, style);
  WINDOWS[style.windows](pen, layout, style);
  paintDoor(pen, layout.door, style);
  style.features.forEach(feature => BUILDING_FEATURES[feature](pen, layout, style));
  paintSign(pen, layout, signText);

  return { canvas, offsetY: style.extraTop, effects: layout.effects };
}

function computeLayout(building, style, width, bodyHeight) {
  const top = style.extraTop;
  const bottom = top + bodyHeight;
  const roofHeight = Math.round(bodyHeight * ROOF_SHARE);
  const overhang = style.roofKind === 'gable' ? GABLE_OVERHANG : 0;
  const wall = { x: overhang, y: top + roofHeight, w: width - overhang * 2, h: bodyHeight - roofHeight };
  const doorHeight = Math.min(DOOR_MAX_HEIGHT, wall.h - 6);
  const doorX = (building.doorX - building.rect.x) * TILE + (TILE - DOOR_WIDTH) / 2;
  return {
    width,
    top,
    bottom,
    roof: { x: 0, y: top, w: width, h: roofHeight },
    wall,
    door: { x: doorX, y: bottom - doorHeight, w: DOOR_WIDTH, h: doorHeight },
    signY: wall.y - 5,
    windows: [],
    effects: [],
  };
}

const ROOFS = {
  gable(pen, roof, style) {
    const { x, y, w, h } = roof;
    pen.rect(x, y, w, h, style.roof);
    for (let row = y + 5; row < y + h - 3; row += 4) {
      pen.hline(x + 1, row, w - 2, style.roofShade);
      const offset = ((row - y) / 4) % 2 < 1 ? 0 : 3;
      for (let joint = x + 3 + offset; joint < x + w - 3; joint += 6) pen.vline(joint, row - 3, 3, style.roofShade);
    }
    pen.hline(x, y + 1, w, style.roofLight).hline(x, y + 2, w, style.roofLight);
    pen.vline(x + 1, y, h, style.roofLight);
    pen.vline(x + w - 2, y, h, style.roofShade).vline(x + w - 3, y, h, style.roofShade);
    pen.hline(x, y + h - 3, w, style.roofShade).hline(x, y + h - 2, w, style.roofShade);
    pen.frame(x, y, w, h, PALETTE.ink);
  },

  flat(pen, roof, style) {
    const { x, y, w, h } = roof;
    pen.rect(x, y, w, h, style.roofLight);
    pen.rect(x + 3, y + 3, w - 6, h - 6, style.roof);
    pen.hline(x + 3, y + 3, w - 6, style.roofShade).vline(x + 3, y + 3, h - 6, style.roofShade);
    for (let index = 0; index < w / 6; index++) {
      const px = x + 5 + Math.floor(tileNoise(index, w, 7) * (w - 10));
      const py = y + 5 + Math.floor(tileNoise(index, h, 9) * (h - 10));
      pen.dot(px, py, style.roofShade);
    }
    pen.hline(x, y + h - 2, w, style.roofShade);
    pen.frame(x, y, w, h, PALETTE.ink);
  },
};

const TEXTURES = {
  plaster(pen, wall, style) {
    for (let index = 0; index < (wall.w * wall.h) / 40; index++) {
      const px = wall.x + Math.floor(tileNoise(index, wall.w, 3) * wall.w);
      const py = wall.y + Math.floor(tileNoise(index, wall.h, 5) * wall.h);
      pen.dot(px, py, style.wallShade);
    }
  },

  brick(pen, wall, style) {
    for (let row = wall.y + 3; row < wall.y + wall.h; row += 4) {
      pen.hline(wall.x, row, wall.w, style.wallShade);
      const offset = ((row - wall.y) / 4) % 2 < 1 ? 0 : 4;
      for (let joint = wall.x + offset; joint < wall.x + wall.w; joint += 8) pen.vline(joint, row - 3, 3, style.wallShade);
    }
  },

  glass(pen, wall, style) {
    for (let x = wall.x + 4; x < wall.x + wall.w - 2; x += 8) pen.vline(x, wall.y, wall.h, style.wallShade);
    for (let y = wall.y + 10; y < wall.y + wall.h - 4; y += 10) pen.hline(wall.x, y, wall.w, style.wallShade);
    for (let x = wall.x + 6; x < wall.x + wall.w - 6; x += 24) {
      for (let step = 0; step < 6; step++) pen.dot(x + step, wall.y + 8 - step, PALETTE.cobaltBright);
      for (let step = 0; step < 4; step++) pen.dot(x + step + 3, wall.y + 8 - step, PALETTE.sky);
    }
  },
};

function paintWall(pen, wall, style) {
  const { x, y, w, h } = wall;
  pen.rect(x, y, w, h, style.wall);
  TEXTURES[style.texture](pen, wall, style);
  pen.hline(x, y, w, style.wallShade).hline(x, y + 1, w, style.wallShade);
  pen.rect(x, y + h - 3, w, 2, PALETTE.brownWarm);
  pen.vline(x, y, h, PALETTE.ink).vline(x + w - 1, y, h, PALETTE.ink).hline(x, y + h - 1, w, PALETTE.ink);
}

function windowSlots(layout, size) {
  const { wall, door } = layout;
  const count = Math.max(1, Math.floor((wall.w - 8) / WINDOW_SPACING));
  const step = wall.w / (count + 1);
  const slots = [];
  for (let index = 1; index <= count; index++) {
    const x = Math.round(wall.x + step * index - size / 2);
    const overlapsDoor = x + size > door.x - 4 && x < door.x + door.w + 4;
    if (!overlapsDoor) slots.push({ x, y: wall.y + 8, w: size, h: size });
  }
  return slots;
}

function paintWindowFrame(pen, window, style, glass) {
  const { x, y, w, h } = window;
  pen.rect(x - 1, y - 1, w + 2, h + 2, PALETTE.ink);
  pen.rect(x, y, w, h, style.trim);
  pen.rect(x + 1, y + 1, w - 2, h - 2, glass);
}

const WINDOWS = {
  none() {},

  standard(pen, layout, style) {
    windowSlots(layout, WINDOW_SIZE).forEach(window => {
      paintWindowFrame(pen, window, style, PALETTE.cobaltDeep);
      const { x, y, w, h } = window;
      pen.vline(x + w / 2, y + 1, h - 2, style.trim).hline(x + 1, y + h / 2, w - 2, style.trim);
      pen.dot(x + 2, y + 2, PALETTE.sky).dot(x + 3, y + 2, PALETTE.cobaltBright).dot(x + 2, y + 3, PALETTE.cobaltBright);
      layout.windows.push(window);
    });
  },

  screen(pen, layout, style) {
    windowSlots(layout, WINDOW_SIZE + 2).forEach(window => {
      paintWindowFrame(pen, window, style, PALETTE.cobaltNight);
      const { x, y } = window;
      pen.hline(x + 2, y + 3, 5, PALETTE.cobaltBright).hline(x + 3, y + 5, 6, PALETTE.paper);
      pen.hline(x + 2, y + 7, 4, PALETTE.peach).hline(x + 4, y + 9, 5, PALETTE.cobaltBright);
      layout.windows.push(window);
      layout.effects.push({ type: 'screen', x: x + 1, y: y + 1, w: window.w - 2, h: window.h - 2 });
    });
  },

  small(pen, layout, style) {
    windowSlots(layout, 6).forEach(window => {
      paintWindowFrame(pen, window, style, PALETTE.cobaltDeep);
      pen.dot(window.x + 1, window.y + 1, PALETTE.sky);
    });
  },

  band(pen, layout, style) {
    const { wall, door } = layout;
    const y = wall.y + 6;
    const height = 9;
    const segments = [
      { x: wall.x + 5, w: door.x - 6 - (wall.x + 5) },
      { x: door.x + door.w + 6, w: wall.x + wall.w - 5 - (door.x + door.w + 6) },
    ];
    segments.forEach(({ x, w }) => {
      if (w <= 4) return;
      paintWindowFrame(pen, { x, y, w, h: height }, style, PALETTE.cobaltDeep);
      for (let mullion = x + 7; mullion < x + w - 2; mullion += 8) pen.vline(mullion, y + 1, height - 2, style.trim);
      for (let shine = x + 2; shine < x + w - 4; shine += 16) pen.dot(shine, y + 2, PALETTE.sky).dot(shine + 1, y + 2, PALETTE.cobaltBright);
    });
  },
};

function paintDoor(pen, door, style) {
  const { x, y, w, h } = door;
  pen.rect(x - 1, y - 1, w + 2, h + 1, PALETTE.ink);
  pen.rect(x, y, w, h, style.door);
  pen.vline(x + w / 2, y, h, PALETTE.ink);
  pen.rect(x + 2, y + 2, w / 2 - 3, 4, PALETTE.cobaltBright).rect(x + w / 2 + 1, y + 2, w / 2 - 3, 4, PALETTE.cobaltBright);
  pen.dot(x + w / 2 - 2, y + h / 2 + 2, PALETTE.peach).dot(x + w / 2 + 1, y + h / 2 + 2, PALETTE.peach);
  pen.hline(x - 1, y + h - 1, w + 2, PALETTE.cream);
}

function paintSign(pen, layout, text) {
  if (!text) return;
  const hasAccent = /[ÉÈÀ]/.test(text);
  const width = measurePixelText(text) + SIGN_PADDING * 2;
  const height = GLYPH_HEIGHT + 4 + (hasAccent ? ACCENT_ROOM : 0);
  const centerX = layout.door.x + layout.door.w / 2;
  const x = Math.round(Math.min(Math.max(centerX - width / 2, 2), layout.width - width - 2));
  const y = layout.signY;
  pen.rect(x, y, width, height, PALETTE.ink);
  pen.rect(x + 1, y + 1, width - 2, height - 2, PALETTE.paper);
  pen.hline(x + 1, y + height - 2, width - 2, PALETTE.cream);
  drawPixelText(pen.context, text, x + SIGN_PADDING, y + 2 + (hasAccent ? ACCENT_ROOM : 0), PALETTE.brown);
}
