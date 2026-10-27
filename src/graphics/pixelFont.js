// Five-pixel-high capitals for signs painted in the world.
// Accented letters reuse a base glyph and add one pixel above it.
export const GLYPH_HEIGHT = 5;
export const ACCENT_ROOM = 2;
const LETTER_SPACING = 1;
const SPACE_WIDTH = 2;

export const GLYPHS = {
  A: ['.#.', '#.#', '###', '#.#', '#.#'],
  B: ['##.', '#.#', '##.', '#.#', '##.'],
  C: ['.##', '#..', '#..', '#..', '.##'],
  D: ['##.', '#.#', '#.#', '#.#', '##.'],
  E: ['###', '#..', '##.', '#..', '###'],
  F: ['###', '#..', '##.', '#..', '#..'],
  G: ['.##', '#..', '#.#', '#.#', '.##'],
  H: ['#.#', '#.#', '###', '#.#', '#.#'],
  I: ['###', '.#.', '.#.', '.#.', '###'],
  J: ['..#', '..#', '..#', '#.#', '.#.'],
  K: ['#.#', '#.#', '##.', '#.#', '#.#'],
  L: ['#..', '#..', '#..', '#..', '###'],
  M: ['#...#', '##.##', '#.#.#', '#...#', '#...#'],
  N: ['#..#', '##.#', '#.##', '#..#', '#..#'],
  O: ['.#.', '#.#', '#.#', '#.#', '.#.'],
  P: ['##.', '#.#', '##.', '#..', '#..'],
  Q: ['.#.', '#.#', '#.#', '##.', '.##'],
  R: ['##.', '#.#', '##.', '#.#', '#.#'],
  S: ['.##', '#..', '.#.', '..#', '##.'],
  T: ['###', '.#.', '.#.', '.#.', '.#.'],
  U: ['#.#', '#.#', '#.#', '#.#', '###'],
  V: ['#.#', '#.#', '#.#', '#.#', '.#.'],
  W: ['#...#', '#...#', '#.#.#', '##.##', '#...#'],
  X: ['#.#', '#.#', '.#.', '#.#', '#.#'],
  Y: ['#.#', '#.#', '.#.', '.#.', '.#.'],
  Z: ['###', '..#', '.#.', '#..', '###'],
  0: ['###', '#.#', '#.#', '#.#', '###'],
  1: ['.#.', '##.', '.#.', '.#.', '###'],
  2: ['##.', '..#', '.#.', '#..', '###'],
  3: ['##.', '..#', '.#.', '..#', '##.'],
  4: ['#.#', '#.#', '###', '..#', '..#'],
  5: ['###', '#..', '##.', '..#', '##.'],
  6: ['.##', '#..', '###', '#.#', '###'],
  7: ['###', '..#', '.#.', '.#.', '.#.'],
  8: ['###', '#.#', '###', '#.#', '###'],
  9: ['###', '#.#', '###', '..#', '##.'],
  '.': ['.', '.', '.', '.', '#'],
  '-': ['...', '...', '###', '...', '...'],
  '·': ['.', '.', '#', '.', '.'],
  '!': ['#', '#', '#', '.', '#'],
  "'": ['#', '#', '.', '.', '.'],
  '’': ['#', '#', '.', '.', '.'],
};

const ACCENTED = { É: 'E', È: 'E', À: 'A' };

function glyphFor(character) {
  const base = ACCENTED[character] ?? character;
  return { rows: GLYPHS[base], isAccented: base !== character };
}

export function measurePixelText(text) {
  let width = 0;
  [...text.toUpperCase()].forEach((character, index) => {
    if (index > 0) width += LETTER_SPACING;
    width += character === ' ' ? SPACE_WIDTH : (glyphFor(character).rows?.[0].length ?? SPACE_WIDTH);
  });
  return width;
}

// Draws with the top of the capitals at `y`; accents sit in the two pixels above.
export function drawPixelText(context, text, x, y, color) {
  context.fillStyle = color;
  let cursor = Math.round(x);
  [...text.toUpperCase()].forEach((character, index) => {
    if (index > 0) cursor += LETTER_SPACING;
    if (character === ' ') {
      cursor += SPACE_WIDTH;
      return;
    }
    const { rows, isAccented } = glyphFor(character);
    if (!rows) {
      cursor += SPACE_WIDTH;
      return;
    }
    rows.forEach((row, rowIndex) => {
      [...row].forEach((pixel, column) => {
        if (pixel === '#') context.fillRect(cursor + column, y + rowIndex, 1, 1);
      });
    });
    if (isAccented) context.fillRect(cursor + rows[0].length - 1, y - ACCENT_ROOM, 1, 1);
    cursor += rows[0].length;
  });
  return cursor;
}
