// Seeded generator (mulberry32) so the town looks the same on every visit.
export function createRandom(seed) {
  let state = seed >>> 0;
  return function next() {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

// Stable pseudo-random value in [0, 1) for a tile, used for texture details.
export function tileNoise(x, y, salt = 0) {
  let hash = Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(salt, 1442695041);
  hash = Math.imul(hash ^ (hash >>> 13), 1274126177);
  return ((hash ^ (hash >>> 16)) >>> 0) / 4294967296;
}
