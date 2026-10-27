import { TILE } from '../config.js';

const HITBOX_HALF_WIDTH = 5;
const HITBOX_HEIGHT = 6;
const FEET_OFFSET_IN_TILE = 12;
const STEP_LENGTH = 6;
const WALK_FRAMES = 4;
const CORNER_NUDGE = 6;

export function tileFeet(tile) {
  return { x: tile.x * TILE + TILE / 2, y: tile.y * TILE + FEET_OFFSET_IN_TILE };
}

export function facingFor(direction) {
  if (Math.abs(direction.x) > Math.abs(direction.y)) return direction.x > 0 ? 'right' : 'left';
  return direction.y > 0 ? 'down' : 'up';
}

// The player's feet are at (x, y); the hitbox is a small box above them.
export class Player {
  constructor(tile, facing) {
    this.facing = facing;
    this.isMoving = false;
    this.walkDistance = 0;
    this.placeAt(tile, facing);
  }

  placeAt(tile, facing = this.facing) {
    ({ x: this.x, y: this.y } = tileFeet(tile));
    this.facing = facing;
    this.isMoving = false;
  }

  get tile() {
    return { x: Math.floor(this.x / TILE), y: Math.floor((this.y - 1) / TILE) };
  }

  hitbox(x = this.x, y = this.y) {
    return { x: x - HITBOX_HALF_WIDTH, y: y - HITBOX_HEIGHT, w: HITBOX_HALF_WIDTH * 2, h: HITBOX_HEIGHT };
  }

  // Moves along `direction` (unit vector), sliding along walls and around corners.
  // Returns whether each axis was blocked.
  move(direction, distance, collision) {
    if (!direction || distance <= 0 || (direction.x === 0 && direction.y === 0)) {
      this.isMoving = false;
      return { blockedX: false, blockedY: false };
    }
    this.facing = facingFor(direction);
    const startX = this.x;
    const startY = this.y;
    const blockedX = !this.#tryStep(direction.x * distance, 0, collision);
    const blockedY = !this.#tryStep(0, direction.y * distance, collision);
    if (blockedY && direction.x === 0) this.#nudgeAround('x', direction.y * distance, distance, collision);
    if (blockedX && direction.y === 0) this.#nudgeAround('y', direction.x * distance, distance, collision);
    const travelled = Math.hypot(this.x - startX, this.y - startY);
    this.walkDistance += travelled;
    this.isMoving = travelled > 0;
    return { blockedX: blockedX && direction.x !== 0, blockedY: blockedY && direction.y !== 0 };
  }

  get frameIndex() {
    return this.isMoving ? Math.floor(this.walkDistance / STEP_LENGTH) % WALK_FRAMES : 0;
  }

  #tryStep(dx, dy, collision) {
    if (dx === 0 && dy === 0) return true;
    if (collision.blocks(this.hitbox(this.x + dx, this.y + dy))) return false;
    this.x += dx;
    this.y += dy;
    return true;
  }

  // When walking straight into a corner, shift sideways toward the nearest free lane.
  #nudgeAround(axis, step, distance, collision) {
    for (let offset = 1; offset <= CORNER_NUDGE; offset++) {
      for (const sign of [-1, 1]) {
        const shift = offset * sign;
        const box = axis === 'x'
          ? this.hitbox(this.x + shift, this.y + step)
          : this.hitbox(this.x + step, this.y + shift);
        if (collision.blocks(box)) continue;
        const nudge = Math.min(distance, offset) * sign;
        if (axis === 'x') this.#tryStep(nudge, 0, collision);
        else this.#tryStep(0, nudge, collision);
        return;
      }
    }
  }
}
