import { createRandom } from '../core/random.js';
import { TERRAIN, isBlockingTerrain } from './terrain.js';
import { TileGrid, inflateRect } from './tileGrid.js';

const INTERIOR_TREE_VARIANTS = ['round', 'round', 'pine', 'blossom'];
const BORDER_TREE_VARIANTS = ['round', 'pine'];
const MAX_DOOR_PATH_LENGTH = 4;

// Turns the declarative town plan into grids and entity lists. Pure data, no drawing.
export function buildWorld(plan) {
  const terrain = paintTerrain(plan);
  const buildings = plan.buildings.map(describeBuilding);
  connectDoorsToRoads(terrain, buildings);
  const trees = plantTrees(plan, terrain, reservedForTrees(plan, terrain, buildings));
  const solid = computeSolidTiles(plan, terrain, buildings, trees);
  return {
    width: plan.width,
    height: plan.height,
    spawn: plan.spawn,
    terrain,
    solid,
    buildings,
    trees,
    props: plan.props,
    npcs: plan.npcs,
    skills: plan.skills,
  };
}

export function isBorderTile(plan, x, y) {
  const edge = plan.borderThickness;
  return x < edge || y < edge || x >= plan.width - edge || y >= plan.height - edge;
}

function describeBuilding(building) {
  const bottom = building.rect.y + building.rect.h;
  return {
    ...building,
    door: { x: building.doorX, y: bottom - 1 },
    spot: { x: building.doorX, y: bottom },
  };
}

function paintTerrain(plan) {
  const terrain = new TileGrid(plan.width, plan.height, TERRAIN.GRASS);
  plan.terrain.forEach(area => {
    if (area.shape === 'ellipse') fillEllipse(terrain, area.rect, area.terrain);
    else terrain.fillRect(area.rect, area.terrain);
  });
  return terrain;
}

function fillEllipse(grid, rect, value) {
  const radiusX = rect.w / 2;
  const radiusY = rect.h / 2;
  const centerX = rect.x + radiusX;
  const centerY = rect.y + radiusY;
  for (let y = rect.y; y < rect.y + rect.h; y++) {
    for (let x = rect.x; x < rect.x + rect.w; x++) {
      const dx = (x + 0.5 - centerX) / radiusX;
      const dy = (y + 0.5 - centerY) / radiusY;
      if (dx * dx + dy * dy <= 1) grid.set(x, y, value);
    }
  }
}

function connectDoorsToRoads(terrain, buildings) {
  buildings.forEach(({ spot }) => {
    for (let y = spot.y; y < spot.y + MAX_DOOR_PATH_LENGTH; y++) {
      if (terrain.get(spot.x, y) !== TERRAIN.GRASS) return;
      terrain.set(spot.x, y, TERRAIN.PATH);
    }
  });
}

function reservedForTrees(plan, terrain, buildings) {
  const reserved = new TileGrid(plan.width, plan.height, false);
  terrain.forEach((value, x, y) => {
    if (value !== TERRAIN.GRASS) reserved.set(x, y, true);
  });
  const keepClear = rect => reserved.fillRect(inflateRect(rect, 1), true);
  const tileRect = ({ x, y }) => ({ x, y, w: 1, h: 1 });
  buildings.forEach(building => {
    keepClear(building.rect);
    keepClear(tileRect(building.spot));
  });
  plan.props.forEach(prop => keepClear(prop.rect));
  plan.npcs.forEach(npc => keepClear(tileRect(npc.tile)));
  plan.skills.forEach(skill => keepClear(tileRect(skill.tile)));
  keepClear(tileRect(plan.spawn));
  return reserved;
}

function plantTrees(plan, terrain, reserved) {
  const random = createRandom(plan.treeSeed);
  const pick = variants => variants[Math.floor(random() * variants.length)];
  const occupied = new TileGrid(plan.width, plan.height, false);
  const trees = [];

  terrain.forEach((_, x, y) => {
    // A checkerboard keeps the forest wall dense without stacking every tile.
    if (isBorderTile(plan, x, y) && (x + y) % 2 === 0) trees.push({ x, y, variant: pick(BORDER_TREE_VARIANTS) });
  });

  terrain.forEach((_, x, y) => {
    if (isBorderTile(plan, x, y) || reserved.get(x, y) || hasOccupiedNeighbour(occupied, x, y)) return;
    if (random() >= plan.treeDensity) return;
    trees.push({ x, y, variant: pick(INTERIOR_TREE_VARIANTS) });
    occupied.set(x, y, true);
  });

  return trees;
}

function hasOccupiedNeighbour(grid, x, y) {
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (grid.get(x + dx, y + dy, false)) return true;
    }
  }
  return false;
}

function computeSolidTiles(plan, terrain, buildings, trees) {
  const solid = new TileGrid(plan.width, plan.height, false);
  terrain.forEach((value, x, y) => {
    if (isBlockingTerrain(value) || isBorderTile(plan, x, y)) solid.set(x, y, true);
  });
  buildings.forEach(building => solid.fillRect(building.rect, true));
  plan.props.forEach(prop => solid.fillRect(prop.rect, true));
  plan.npcs.forEach(({ tile }) => solid.set(tile.x, tile.y, true));
  trees.forEach(({ x, y }) => solid.set(x, y, true));
  return solid;
}
