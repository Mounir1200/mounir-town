import { TILE } from '../config.js';
import { tileNoise } from '../core/random.js';
import { TERRAIN } from '../world/terrain.js';
import { PALETTE } from './palette.js';
import { Pen, createCanvas } from './pen.js';

const SPECKLES_PER_TILE = 4;
const PLAZA_STONE = 8;
const TARMAC_DASH = 6;

// Bakes the whole ground (terrain + soft shadows) into one canvas, drawn once per frame.
export function paintGround(world, shadowCasters) {
  const canvas = createCanvas(world.width * TILE, world.height * TILE);
  const pen = Pen.forCanvas(canvas);
  const painters = {
    [TERRAIN.GRASS]: paintGrass,
    [TERRAIN.FLOWERS]: paintFlowers,
    [TERRAIN.PATH]: paintPath,
    [TERRAIN.PLAZA]: paintPlaza,
    [TERRAIN.WATER]: paintWater,
    [TERRAIN.TARMAC]: paintTarmac,
    [TERRAIN.SAND]: paintSand,
  };
  world.terrain.forEach((terrain, x, y) => {
    const tile = { x, y, left: x * TILE, top: y * TILE, terrain, world };
    painters[terrain](pen, tile);
  });
  shadowCasters.forEach(shadow => pen.ellipse(shadow.x, shadow.y, shadow.radiusX, shadow.radiusY, PALETTE.shadow));
  return canvas;
}

function sameTerrain(tile, dx, dy) {
  return tile.world.terrain.get(tile.x + dx, tile.y + dy, tile.terrain) === tile.terrain;
}

function speckle(pen, tile, color, salt, count = SPECKLES_PER_TILE) {
  for (let index = 0; index < count; index++) {
    const px = Math.floor(tileNoise(tile.x, tile.y, salt + index * 2) * TILE);
    const py = Math.floor(tileNoise(tile.x, tile.y, salt + index * 2 + 1) * TILE);
    pen.dot(tile.left + px, tile.top + py, color);
  }
}

function paintGrass(pen, tile) {
  pen.rect(tile.left, tile.top, TILE, TILE, PALETTE.peach);
  speckle(pen, tile, PALETTE.peachDeep, 1);
  speckle(pen, tile, PALETTE.peachLight, 20, 2);
  if (tileNoise(tile.x, tile.y, 40) < 0.35) {
    const x = tile.left + 3 + Math.floor(tileNoise(tile.x, tile.y, 41) * 9);
    const y = tile.top + 4 + Math.floor(tileNoise(tile.x, tile.y, 42) * 9);
    pen.dot(x, y, PALETTE.clay).dot(x + 2, y, PALETTE.clay).dot(x + 1, y + 1, PALETTE.clay);
  }
}

function paintFlowers(pen, tile) {
  paintGrass(pen, tile);
  const petals = [PALETTE.paper, PALETTE.cobaltBright, PALETTE.paper];
  for (let index = 0; index < 3; index++) {
    const x = tile.left + 3 + Math.floor(tileNoise(tile.x, tile.y, 60 + index) * 10);
    const y = tile.top + 3 + Math.floor(tileNoise(tile.x, tile.y, 70 + index) * 10);
    const petal = petals[index];
    pen.dot(x - 1, y, petal).dot(x + 1, y, petal).dot(x, y - 1, petal).dot(x, y + 1, petal);
    pen.dot(x, y, PALETTE.brownWarm);
  }
}

function paintPath(pen, tile) {
  pen.rect(tile.left, tile.top, TILE, TILE, PALETTE.cream);
  speckle(pen, tile, PALETTE.peachLight, 80, 5);
  speckle(pen, tile, PALETTE.paper, 90, 3);
  paintSoftEdges(pen, tile, PALETTE.peachLight, PALETTE.peachDeep);
}

// Darker rim where the tile meets a different terrain.
function paintSoftEdges(pen, tile, inner, outer) {
  const { left, top } = tile;
  if (!sameTerrain(tile, 0, -1)) pen.hline(left, top, TILE, outer).hline(left, top + 1, TILE, inner);
  if (!sameTerrain(tile, 0, 1)) pen.hline(left, top + TILE - 1, TILE, outer).hline(left, top + TILE - 2, TILE, inner);
  if (!sameTerrain(tile, -1, 0)) pen.vline(left, top, TILE, outer).vline(left + 1, top, TILE, inner);
  if (!sameTerrain(tile, 1, 0)) pen.vline(left + TILE - 1, top, TILE, outer).vline(left + TILE - 2, top, TILE, inner);
}

function paintPlaza(pen, tile) {
  const { left, top } = tile;
  pen.rect(left, top, TILE, TILE, PALETTE.paper);
  for (let row = 0; row < TILE / PLAZA_STONE; row++) {
    const y = top + row * PLAZA_STONE;
    const offset = (tile.y * 2 + row) % 2 === 0 ? 0 : PLAZA_STONE / 2;
    pen.hline(left, y, TILE, PALETTE.cream);
    for (let x = left + offset; x < left + TILE; x += PLAZA_STONE) pen.vline(x, y, PLAZA_STONE, PALETTE.cream);
  }
  speckle(pen, tile, PALETTE.cream, 110, 2);
  paintSoftEdges(pen, tile, PALETTE.cream, PALETTE.peachDeep);
}

function paintWater(pen, tile) {
  const { left, top } = tile;
  pen.rect(left, top, TILE, TILE, PALETTE.cobalt);
  for (let index = 0; index < 2; index++) {
    const x = left + 2 + Math.floor(tileNoise(tile.x, tile.y, 130 + index) * 10);
    const y = top + 3 + Math.floor(tileNoise(tile.x, tile.y, 140 + index) * 10);
    pen.hline(x, y, 3, PALETTE.cobaltBright);
  }
  if (!sameTerrain(tile, 0, -1)) pen.hline(left, top, TILE, PALETTE.brownWarm).hline(left, top + 1, TILE, PALETTE.cobaltDeep).hline(left, top + 2, TILE, PALETTE.cobaltDeep);
  if (!sameTerrain(tile, 0, 1)) pen.hline(left, top + TILE - 1, TILE, PALETTE.cream).hline(left, top + TILE - 2, TILE, PALETTE.cobaltBright);
  if (!sameTerrain(tile, -1, 0)) pen.vline(left, top, TILE, PALETTE.cream).vline(left + 1, top, TILE, PALETTE.cobaltBright);
  if (!sameTerrain(tile, 1, 0)) pen.vline(left + TILE - 1, top, TILE, PALETTE.cream).vline(left + TILE - 2, top, TILE, PALETTE.cobaltBright);
}

function contiguousRows(tile, direction) {
  let count = 0;
  while (tile.world.terrain.get(tile.x, tile.y + direction * (count + 1)) === tile.terrain) count++;
  return count;
}

function paintTarmac(pen, tile) {
  const { left, top } = tile;
  pen.rect(left, top, TILE, TILE, PALETTE.brownDeep);
  speckle(pen, tile, PALETTE.brown, 150, 5);
  if (!sameTerrain(tile, 0, -1)) pen.hline(left, top, TILE, PALETTE.cream);
  if (!sameTerrain(tile, 0, 1)) pen.hline(left, top + TILE - 1, TILE, PALETTE.cream);
  // Centre line: drawn at the top of the first tile of the apron's lower half.
  if (tile.x % 2 === 0 && contiguousRows(tile, -1) === contiguousRows(tile, 1) + 1) {
    pen.rect(left + (TILE - TARMAC_DASH) / 2, top, TARMAC_DASH, 2, PALETTE.peach);
  }
}

function paintSand(pen, tile) {
  pen.rect(tile.left, tile.top, TILE, TILE, PALETTE.peachLight);
  speckle(pen, tile, PALETTE.clay, 170, 3);
  speckle(pen, tile, PALETTE.cream, 180, 3);
  paintSoftEdges(pen, tile, PALETTE.cream, PALETTE.peachDeep);
}
