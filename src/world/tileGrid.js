export class TileGrid {
  constructor(width, height, fill = 0) {
    this.width = width;
    this.height = height;
    this.cells = new Array(width * height).fill(fill);
  }

  inBounds(x, y) {
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
  }

  get(x, y, outside = undefined) {
    return this.inBounds(x, y) ? this.cells[y * this.width + x] : outside;
  }

  set(x, y, value) {
    if (this.inBounds(x, y)) this.cells[y * this.width + x] = value;
  }

  fillRect({ x, y, w, h }, value) {
    for (let row = y; row < y + h; row++) {
      for (let column = x; column < x + w; column++) this.set(column, row, value);
    }
  }

  forEach(callback) {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) callback(this.cells[y * this.width + x], x, y);
    }
  }
}

export function rectContains(rect, x, y) {
  return x >= rect.x && y >= rect.y && x < rect.x + rect.w && y < rect.y + rect.h;
}

export function inflateRect(rect, amount) {
  return { x: rect.x - amount, y: rect.y - amount, w: rect.w + amount * 2, h: rect.h + amount * 2 };
}
