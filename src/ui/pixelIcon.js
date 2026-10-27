const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

// Pixel icons drawn with `#` cells, coloured with currentColor.
export const ICONS = {
  map: ['#.##.##', '##.##.#', '#.#.#.#', '#.#.#.#', '#.#.#.#', '##.##.#', '#.##.##'],
  soundOn: ['...#..#', '..##...', '####.#.', '####.#.', '####.#.', '..##...', '...#..#'],
  soundOff: ['...#...', '..##...', '####.#.', '####..#', '####.#.', '..##...', '...#...'],
  house: ['...#...', '..###..', '.#####.', '#######', '.#...#.', '.#.#.#.', '.#.#.#.'],
  gem: ['.#####.', '#######', '.#####.', '..###..', '...#...'],
  download: ['...#...', '...#...', '...#...', '.#####.', '..###..', '...#...', '#######'],
  close: ['#.....#', '.#...#.', '..#.#..', '...#...', '..#.#..', '.#...#.', '#.....#'],
  previous: ['...#', '..##', '.###', '####', '.###', '..##', '...#'],
  next: ['#...', '##..', '###.', '####', '###.', '##..', '#...'],
  pin: ['.###.', '#####', '##.##', '#####', '.###.', '..#..', '..#..'],
  check: ['......#', '.....##', '#...##.', '##.##..', '.###...', '..#....'],
  mail: ['#######', '##...##', '#.#.#.#', '#..#..#', '#.....#', '#######'],
};

export function pixelIcon(name, className = 'icon') {
  const rows = ICONS[name];
  const svg = document.createElementNS(SVG_NAMESPACE, 'svg');
  svg.setAttribute('viewBox', `0 0 ${rows[0].length} ${rows.length}`);
  svg.setAttribute('class', className);
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.setAttribute('shape-rendering', 'crispEdges');
  rows.forEach((row, y) => {
    [...row].forEach((cell, x) => {
      if (cell !== '#') return;
      const pixel = document.createElementNS(SVG_NAMESPACE, 'rect');
      pixel.setAttribute('x', x);
      pixel.setAttribute('y', y);
      pixel.setAttribute('width', 1);
      pixel.setAttribute('height', 1);
      svg.append(pixel);
    });
  });
  return svg;
}
