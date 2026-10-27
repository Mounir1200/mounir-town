import { createCanvas } from './pen.js';

export function assertRectangularRows(rows, name = 'sprite') {
  const width = rows[0]?.length ?? 0;
  rows.forEach((row, index) => {
    if (row.length !== width) throw new Error(`${name}: row ${index} has ${row.length} pixels, expected ${width}`);
  });
  return width;
}

// Each character of a row is a pixel; characters missing from `colors` stay transparent.
export function spriteFromRows(rows, colors, name) {
  const width = assertRectangularRows(rows, name);
  const canvas = createCanvas(width, rows.length);
  const context = canvas.getContext('2d');
  rows.forEach((row, y) => {
    [...row].forEach((symbol, x) => {
      const color = colors[symbol];
      if (!color) return;
      context.fillStyle = color;
      context.fillRect(x, y, 1, 1);
    });
  });
  return canvas;
}

export function mirrored(source) {
  const canvas = createCanvas(source.width, source.height);
  const context = canvas.getContext('2d');
  context.translate(source.width, 0);
  context.scale(-1, 1);
  context.drawImage(source, 0, 0);
  return canvas;
}

export function cropped(source, x, y, width, height) {
  const canvas = createCanvas(width, height);
  canvas.getContext('2d').drawImage(source, x, y, width, height, 0, 0, width, height);
  return canvas;
}
