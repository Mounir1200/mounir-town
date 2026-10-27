import { PALETTE } from './palette.js';

const TWO_PI = Math.PI * 2;
const SMOKE_PUFFS = 3;
const SMOKE_RISE = 14;
const LIGHT_COLORS = [PALETTE.cobaltBright, PALETTE.peach, PALETTE.paper, PALETTE.peachDeep];

// Animated details drawn on top of static sprites. Coordinates are world pixels.
// `scene` carries the time and shared state such as whether music is playing.
export const EFFECTS = {
  blink(context, effect, x, y, scene) {
    if (Math.sin((scene.time * TWO_PI) / effect.period) < 0) return;
    context.fillStyle = effect.color;
    context.fillRect(x - 1, y - 1, 2, 2);
    context.globalAlpha = 0.35;
    context.fillRect(x - 2, y - 2, 4, 4);
    context.globalAlpha = 1;
  },

  smoke(context, effect, x, y, scene) {
    if (scene.reducedMotion) return;
    context.fillStyle = PALETTE.paper;
    for (let index = 0; index < SMOKE_PUFFS; index++) {
      const phase = (scene.time * 0.45 + index / SMOKE_PUFFS) % 1;
      const size = 2 + Math.round(phase * 3);
      const drift = Math.round(Math.sin(phase * 6 + index) * 2 + phase * 4);
      context.globalAlpha = (1 - phase) * 0.75;
      context.fillRect(x + drift - size / 2, y - phase * SMOKE_RISE - size / 2, size, size);
    }
    context.globalAlpha = 1;
  },

  screen(context, effect, x, y, scene) {
    const line = Math.floor((scene.time * 10) % effect.h);
    context.globalAlpha = 0.5;
    context.fillStyle = PALETTE.cobaltBright;
    context.fillRect(x, y + line, effect.w, 1);
    context.globalAlpha = 1;
  },

  glow(context, effect, x, y, scene) {
    context.globalAlpha = 0.18 + 0.06 * Math.sin(scene.time * 2);
    context.fillStyle = PALETTE.paper;
    context.fillRect(x - 6, y - 4, 12, 9);
    context.globalAlpha = 1;
  },

  lights(context, effect, x, y, scene) {
    effect.points.forEach(([dx, dy], index) => {
      const step = scene.musicPlaying ? Math.floor(scene.time * 6) + index : index;
      context.fillStyle = scene.musicPlaying ? LIGHT_COLORS[step % LIGHT_COLORS.length] : PALETTE.brownWarm;
      context.fillRect(x + dx, y + dy, 1, 1);
    });
    if (scene.musicPlaying && !scene.reducedMotion) {
      const bounce = Math.floor(scene.time * 3) % 2;
      context.fillStyle = PALETTE.cobaltBright;
      context.fillRect(x + 14, y - 2 - bounce, 1, 3);
      context.fillRect(x + 13, y - bounce, 2, 1);
    }
  },

  fountain(context, effect, x, y, scene) {
    context.fillStyle = PALETTE.sky;
    const drops = scene.reducedMotion ? 0 : 6;
    for (let index = 0; index < drops; index++) {
      const phase = (scene.time * 0.9 + index / drops) % 1;
      const side = index % 2 === 0 ? -1 : 1;
      const dropX = x + side * Math.round(phase * 9);
      const dropY = y + Math.round(-4 * Math.sin(phase * Math.PI) + phase * (effect.basinY - effect.y - 2));
      context.fillRect(dropX, dropY, 1, 2);
    }
    context.fillStyle = PALETTE.paper;
    context.fillRect(x - 1, y - 3, 2, 3);
  },
};

export function drawEffects(context, effects, originX, originY, scene) {
  effects.forEach(effect => EFFECTS[effect.type](context, effect, originX + effect.x, originY + effect.y, scene));
}
