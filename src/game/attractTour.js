import { TILE } from '../config.js';

// Camera tour of the town behind the title screen, in tiles.
const STOPS = [
  { x: 28, y: 22 }, { x: 10, y: 9 }, { x: 28, y: 8 }, { x: 46, y: 9 },
  { x: 49, y: 21 }, { x: 46, y: 33 }, { x: 28, y: 32 }, { x: 10, y: 33 }, { x: 10, y: 20 },
];
const SECONDS_PER_STOP = 7;

const smoothstep = value => value * value * (3 - 2 * value);

export function attractPoint(seconds, isStill = false) {
  if (isStill) return { x: STOPS[0].x * TILE, y: STOPS[0].y * TILE };
  const position = (seconds / SECONDS_PER_STOP) % STOPS.length;
  const index = Math.floor(position);
  const from = STOPS[index];
  const to = STOPS[(index + 1) % STOPS.length];
  const blend = smoothstep(position - index);
  return {
    x: (from.x + (to.x - from.x) * blend) * TILE,
    y: (from.y + (to.y - from.y) * blend) * TILE,
  };
}
