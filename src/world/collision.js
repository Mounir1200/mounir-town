import { TILE } from '../config.js';

export class CollisionMap {
  constructor(solidGrid) {
    this.solid = solidGrid;
  }

  isWalkableTile(x, y) {
    return this.solid.get(x, y, true) === false;
  }

  // `box` is in world pixels; any overlapped solid tile blocks it.
  blocks(box) {
    const left = Math.floor(box.x / TILE);
    const right = Math.floor((box.x + box.w - 0.001) / TILE);
    const top = Math.floor(box.y / TILE);
    const bottom = Math.floor((box.y + box.h - 0.001) / TILE);
    for (let y = top; y <= bottom; y++) {
      for (let x = left; x <= right; x++) {
        if (!this.isWalkableTile(x, y)) return true;
      }
    }
    return false;
  }
}
