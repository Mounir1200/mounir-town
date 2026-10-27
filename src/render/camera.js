import { CAMERA_SMOOTHING } from '../config.js';

function clampAxis(target, view, world) {
  if (view >= world) return (world - view) / 2;
  return Math.min(Math.max(target, 0), world - view);
}

// Top-left corner of the visible world area, in world pixels.
export class Camera {
  constructor(worldWidth, worldHeight) {
    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;
    this.viewWidth = 0;
    this.viewHeight = 0;
    this.x = 0;
    this.y = 0;
  }

  setViewSize(width, height) {
    this.viewWidth = width;
    this.viewHeight = height;
  }

  // Eases toward `point` so the view does not jerk with every step.
  follow(point, deltaSeconds) {
    const target = this.#centeredOn(point);
    const blend = 1 - Math.exp(-CAMERA_SMOOTHING * deltaSeconds);
    this.x += (target.x - this.x) * blend;
    this.y += (target.y - this.y) * blend;
  }

  snapTo(point) {
    ({ x: this.x, y: this.y } = this.#centeredOn(point));
  }

  get pixelX() {
    return Math.round(this.x);
  }

  get pixelY() {
    return Math.round(this.y);
  }

  #centeredOn(point) {
    return {
      x: clampAxis(point.x - this.viewWidth / 2, this.viewWidth, this.worldWidth),
      y: clampAxis(point.y - this.viewHeight / 2, this.viewHeight, this.worldHeight),
    };
  }
}
