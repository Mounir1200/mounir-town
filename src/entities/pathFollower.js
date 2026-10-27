import { tileFeet } from './player.js';

const ARRIVAL_RADIUS = 1.5;
const STUCK_SECONDS = 0.35;

// Walks the player through a list of tiles produced by the pathfinder.
export class PathFollower {
  #waypoints = [];
  #stuckFor = 0;

  get isActive() {
    return this.#waypoints.length > 0;
  }

  get destination() {
    return this.#waypoints.at(-1) ?? null;
  }

  start(tiles) {
    this.#waypoints = tiles.map(tileFeet);
    this.#stuckFor = 0;
  }

  clear() {
    this.#waypoints = [];
  }

  // Unit direction toward the next waypoint and the distance left to it.
  steer(position) {
    while (this.#waypoints.length > 0) {
      const target = this.#waypoints[0];
      const dx = target.x - position.x;
      const dy = target.y - position.y;
      const distance = Math.hypot(dx, dy);
      if (distance > ARRIVAL_RADIUS) return { x: dx / distance, y: dy / distance, distance };
      this.#waypoints.shift();
    }
    return null;
  }

  // Gives up when the player has been pushed against something for a while.
  reportProgress(hasMoved, deltaSeconds) {
    this.#stuckFor = hasMoved ? 0 : this.#stuckFor + deltaSeconds;
    if (this.#stuckFor > STUCK_SECONDS) this.clear();
  }
}
