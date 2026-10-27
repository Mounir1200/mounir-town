export const TERRAIN = Object.freeze({
  GRASS: 0,
  PATH: 1,
  PLAZA: 2,
  WATER: 3,
  TARMAC: 4,
  SAND: 5,
  FLOWERS: 6,
});

const BLOCKING_TERRAIN = new Set([TERRAIN.WATER]);

export function isBlockingTerrain(terrain) {
  return BLOCKING_TERRAIN.has(terrain);
}
