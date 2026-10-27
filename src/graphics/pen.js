export function createCanvas(width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.ceil(width));
  canvas.height = Math.max(1, Math.ceil(height));
  return canvas;
}

// Small drawing helper that keeps every primitive on whole pixels.
export class Pen {
  constructor(context) {
    this.context = context;
  }

  static forCanvas(canvas) {
    return new Pen(canvas.getContext('2d'));
  }

  rect(x, y, width, height, color) {
    if (width <= 0 || height <= 0) return this;
    this.context.fillStyle = color;
    this.context.fillRect(Math.round(x), Math.round(y), Math.round(width), Math.round(height));
    return this;
  }

  dot(x, y, color) {
    return this.rect(x, y, 1, 1, color);
  }

  hline(x, y, width, color) {
    return this.rect(x, y, width, 1, color);
  }

  vline(x, y, height, color) {
    return this.rect(x, y, 1, height, color);
  }

  frame(x, y, width, height, color) {
    this.hline(x, y, width, color).hline(x, y + height - 1, width, color);
    return this.vline(x, y, height, color).vline(x + width - 1, y, height, color);
  }

  // Filled ellipse built from horizontal runs so edges stay crisp.
  ellipse(centerX, centerY, radiusX, radiusY, color) {
    for (let dy = -radiusY; dy <= radiusY; dy++) {
      const ratio = 1 - (dy * dy) / ((radiusY + 0.5) * (radiusY + 0.5));
      if (ratio < 0) continue;
      const half = Math.round(radiusX * Math.sqrt(ratio));
      this.rect(centerX - half, centerY + dy, half * 2 + 1, 1, color);
    }
    return this;
  }

  disc(centerX, centerY, radius, color) {
    return this.ellipse(centerX, centerY, radius, radius, color);
  }
}
