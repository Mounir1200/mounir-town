import { MAX_SCALE, MIN_SCALE, TILE, TILES_ON_SHORT_SIDE } from '../config.js';

const MAX_PIXEL_RATIO = 3;

// Sizes the canvas backing store to the screen and picks a whole-number zoom
// so every world pixel maps to a crisp square of device pixels.
export class Viewport {
  constructor(canvas) {
    this.canvas = canvas;
    this.pixelRatio = 1;
    this.scale = MIN_SCALE;
  }

  resize() {
    const bounds = this.canvas.getBoundingClientRect();
    this.pixelRatio = Math.min(globalThis.devicePixelRatio || 1, MAX_PIXEL_RATIO);
    this.canvas.width = Math.max(1, Math.round(bounds.width * this.pixelRatio));
    this.canvas.height = Math.max(1, Math.round(bounds.height * this.pixelRatio));
    const shortSide = Math.min(this.canvas.width, this.canvas.height);
    this.scale = Math.min(MAX_SCALE * this.pixelRatio, Math.max(MIN_SCALE, Math.floor(shortSide / (TILE * TILES_ON_SHORT_SIDE))));
    return { width: this.canvas.width / this.scale, height: this.canvas.height / this.scale };
  }

  toWorld(clientX, clientY, camera) {
    const bounds = this.canvas.getBoundingClientRect();
    return {
      x: camera.pixelX + ((clientX - bounds.left) * this.pixelRatio) / this.scale,
      y: camera.pixelY + ((clientY - bounds.top) * this.pixelRatio) / this.scale,
    };
  }

  toClient(worldX, worldY, camera) {
    const bounds = this.canvas.getBoundingClientRect();
    return {
      x: bounds.left + ((worldX - camera.pixelX) * this.scale) / this.pixelRatio,
      y: bounds.top + ((worldY - camera.pixelY) * this.scale) / this.pixelRatio,
    };
  }
}
