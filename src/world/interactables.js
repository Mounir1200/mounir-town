import { TILE } from '../config.js';
import { locationById } from '../content/locations.js';
import { SPEAKERS } from '../content/dialogues.js';
import { tileFeet } from '../entities/player.js';
import { inflateRect, rectContains } from './tileGrid.js';

const LOCATION_ZONE_MARGIN = 5;
// Feet stand 12 px into the tile in front of an object, so the zone must reach past that.
const OBJECT_ZONE_MARGIN = 14;
const APPROACH_ORDER = [[0, 1], [-1, 0], [1, 0], [0, -1]];

const tileToPixels = ({ x, y, w = 1, h = 1 }) => ({ x: x * TILE, y: y * TILE, w: w * TILE, h: h * TILE });

// Everything the player can use: building doors, talking characters and props.
// `zone` is where the player's feet must be, `approach` the tile to walk to,
// `bounds` the clickable sprite area and `anchor` where the "!" bubble floats.
export function buildInteractables(world, art, collision) {
  const spriteBounds = id => art.statics.find(drawable => drawable.id === id)?.bounds;
  const locations = world.buildings.map(building => ({
    id: building.id,
    kind: 'location',
    verb: 'enter',
    label: locationById(building.id).name,
    action: { type: 'panel', id: building.id },
    approach: building.spot,
    zone: inflateRect(tileToPixels(building.spot), LOCATION_ZONE_MARGIN),
    bounds: spriteBounds(building.id),
    anchor: { x: building.door.x * TILE + TILE / 2, y: (building.door.y + 1) * TILE - 30 },
  }));

  const props = world.props.filter(prop => prop.interaction).map(prop => {
    const area = tileToPixels(prop.rect);
    return {
      id: prop.id,
      kind: 'prop',
      verb: prop.interaction.verb,
      label: prop.interaction.label,
      action: prop.interaction.action,
      approach: approachTile(prop.rect, collision),
      zone: inflateRect(area, OBJECT_ZONE_MARGIN),
      bounds: spriteBounds(prop.id),
      anchor: { x: area.x + area.w / 2, y: spriteBounds(prop.id).y - 3 },
    };
  });

  const npcs = world.npcs.map(npc => {
    const feet = tileFeet(npc.tile);
    const speaker = npc.look === 'cat' ? 'cat' : npc.look;
    return {
      id: npc.id,
      kind: 'npc',
      verb: 'talk',
      label: SPEAKERS[speaker].name,
      action: { type: 'dialogue', script: npc.script, speakerId: npc.id },
      approach: approachTile({ ...npc.tile, w: 1, h: 1 }, collision),
      zone: inflateRect(tileToPixels(npc.tile), OBJECT_ZONE_MARGIN),
      bounds: { x: feet.x - 8, y: feet.y - 20, w: 16, h: 22 },
      anchor: { x: feet.x, y: feet.y - 24 },
    };
  });

  return [...locations, ...npcs, ...props];
}

function approachTile(rect, collision) {
  const centerX = rect.x + Math.floor(rect.w / 2);
  const centerY = rect.y + Math.floor(rect.h / 2);
  for (const [dx, dy] of APPROACH_ORDER) {
    const x = dx === 0 ? centerX : dx < 0 ? rect.x - 1 : rect.x + rect.w;
    const y = dy === 0 ? centerY : dy < 0 ? rect.y - 1 : rect.y + rect.h;
    if (collision.isWalkableTile(x, y)) return { x, y };
  }
  return null;
}

export function focusedInteractable(interactables, feet) {
  let best = null;
  let bestDistance = Infinity;
  interactables.forEach(target => {
    if (!rectContains(target.zone, feet.x, feet.y)) return;
    const distance = Math.hypot(target.anchor.x - feet.x, target.anchor.y - feet.y);
    if (distance < bestDistance) {
      best = target;
      bestDistance = distance;
    }
  });
  return best;
}

// The sprite drawn in front (lowest bottom edge) wins when several overlap.
export function interactableAt(interactables, point) {
  const bottom = ({ bounds }) => bounds.y + bounds.h;
  return interactables
    .filter(target => target.bounds && rectContains(target.bounds, point.x, point.y))
    .reduce((front, target) => (!front || bottom(target) > bottom(front) ? target : front), null);
}
