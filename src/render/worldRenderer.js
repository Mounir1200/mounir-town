import { TILE } from '../config.js';
import { tileNoise } from '../core/random.js';
import { drawEffects } from '../graphics/effects.js';
import { PALETTE } from '../graphics/palette.js';
import { TERRAIN } from '../world/terrain.js';

const CULL_MARGIN = 48;
const CHARACTER_ANCHOR = { x: 8, y: 19 };
const CAT_ANCHOR = { x: 7, y: 11 };
const POLLEN_COUNT = 18;
const CAT_BLINK_PERIOD = 3.2;
const CAT_BLINK_LENGTH = 0.18;
const IDLE_BOB_PERIOD = 0.9;

function intersects(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

// Draws one frame: ground, then everything sorted by its base line so
// characters walk behind trees and in front of doors naturally.
export class WorldRenderer {
  constructor(canvas, viewport, art) {
    this.context = canvas.getContext('2d');
    this.canvas = canvas;
    this.viewport = viewport;
    this.art = art;
  }

  render(scene) {
    const { context, canvas, viewport } = this;
    const { camera } = scene;
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.fillStyle = PALETTE.cobaltNight;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.setTransform(viewport.scale, 0, 0, viewport.scale, -camera.pixelX * viewport.scale, -camera.pixelY * viewport.scale);
    context.imageSmoothingEnabled = false;

    const view = { x: camera.pixelX, y: camera.pixelY, w: camera.viewWidth, h: camera.viewHeight };
    context.drawImage(this.art.ground, 0, 0);
    this.#drawWaterSparkles(view, scene);
    this.#drawMarker(scene);
    this.#collectDrawables(view, scene)
      .sort((a, b) => a.baseline - b.baseline)
      .forEach(drawable => drawable.draw(context, scene));
    this.#drawBubble(scene);
    if (!scene.reducedMotion) this.#drawPollen(view, scene);
  }

  #collectDrawables(view, scene) {
    const cullView = { x: view.x - CULL_MARGIN, y: view.y - CULL_MARGIN, w: view.w + CULL_MARGIN * 2, h: view.h + CULL_MARGIN * 2 };
    const statics = this.art.statics
      .filter(drawable => intersects(drawable.bounds, cullView))
      .map(drawable => ({
        baseline: drawable.baseline,
        draw: (context) => {
          context.drawImage(drawable.image, drawable.x, drawable.y);
          drawEffects(context, drawable.effects, drawable.x, drawable.y, scene);
        },
      }));
    const npcs = scene.npcs.map(npc => ({ baseline: npc.y, draw: context => this.#drawNpc(context, npc, scene) }));
    const gems = scene.gems.map((gem, index) => ({ baseline: gem.y, draw: context => this.#drawGem(context, gem, index, scene) }));
    const player = { baseline: scene.player.y, draw: context => this.#drawCharacter(context, this.art.characters.mounir, scene.player, scene.player.frameIndex) };
    return [...statics, ...npcs, ...gems, player];
  }

  #drawShadow(context, x, y, halfWidth) {
    context.fillStyle = PALETTE.shadow;
    context.fillRect(Math.round(x) - halfWidth, Math.round(y) - 1, halfWidth * 2 + 1, 2);
    context.fillRect(Math.round(x) - halfWidth + 1, Math.round(y) + 1, halfWidth * 2 - 1, 1);
  }

  #drawCharacter(context, sprites, entity, frameIndex, bob = 0) {
    this.#drawShadow(context, entity.x, entity.y, 5);
    const frame = sprites[entity.facing][frameIndex];
    context.drawImage(frame, Math.round(entity.x) - CHARACTER_ANCHOR.x, Math.round(entity.y) - CHARACTER_ANCHOR.y - bob);
  }

  #drawNpc(context, npc, scene) {
    if (npc.look === 'cat') {
      const isBlinking = (scene.time % CAT_BLINK_PERIOD) < CAT_BLINK_LENGTH;
      this.#drawShadow(context, npc.x, npc.y, 5);
      const frame = this.art.characters.cat[npc.facing][isBlinking ? 1 : 0];
      context.drawImage(frame, Math.round(npc.x) - CAT_ANCHOR.x, Math.round(npc.y) - CAT_ANCHOR.y);
      return;
    }
    const bob = scene.reducedMotion ? 0 : Math.floor((scene.time / IDLE_BOB_PERIOD) % 2);
    this.#drawCharacter(context, this.art.characters[npc.look], npc, 0, bob);
  }

  #drawGem(context, gem, index, scene) {
    const float = scene.reducedMotion ? 0 : Math.round(Math.sin(scene.time * 3 + index) * 2);
    this.#drawShadow(context, gem.x, gem.y, 3);
    context.drawImage(this.art.gem, Math.round(gem.x) - 6, Math.round(gem.y) - 16 + float);
    if (Math.sin(scene.time * 4 + index * 2) > 0.6) {
      context.fillStyle = PALETTE.paper;
      context.fillRect(Math.round(gem.x) + 4, Math.round(gem.y) - 17 + float, 1, 1);
    }
  }

  #drawBubble(scene) {
    const { focus } = scene;
    if (!focus) return;
    const bob = scene.reducedMotion ? 0 : Math.round(Math.sin(scene.time * 5));
    const image = this.art.bubble;
    this.context.drawImage(image, Math.round(focus.anchor.x - image.width / 2), Math.round(focus.anchor.y - image.height + bob));
  }

  #drawMarker(scene) {
    const { marker } = scene;
    if (!marker) return;
    const spread = 4 + Math.round((Math.sin(scene.time * 8) + 1) * 1.5);
    const x = Math.round(marker.x);
    const y = Math.round(marker.y) - 4;
    this.context.fillStyle = marker.isTarget ? PALETTE.cobaltBright : PALETTE.brown;
    // Four corner brackets whose arms point toward the destination.
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([dx, dy]) => {
      const cornerX = x + dx * spread;
      const cornerY = y + dy * spread;
      this.context.fillRect(dx < 0 ? cornerX : cornerX - 1, cornerY, 2, 1);
      this.context.fillRect(cornerX, dy < 0 ? cornerY : cornerY - 1, 1, 2);
    });
  }

  #drawWaterSparkles(view, scene) {
    const { terrain } = this.art.world;
    const firstX = Math.max(0, Math.floor(view.x / TILE));
    const firstY = Math.max(0, Math.floor(view.y / TILE));
    const lastX = Math.min(terrain.width - 1, Math.ceil((view.x + view.w) / TILE));
    const lastY = Math.min(terrain.height - 1, Math.ceil((view.y + view.h) / TILE));
    this.context.fillStyle = PALETTE.sky;
    for (let y = firstY; y <= lastY; y++) {
      for (let x = firstX; x <= lastX; x++) {
        if (terrain.get(x, y) !== TERRAIN.WATER) continue;
        const seed = tileNoise(x, y, 200);
        if (Math.sin(scene.time * 1.7 + seed * 40) < 0.8) continue;
        this.context.fillRect(x * TILE + 3 + Math.floor(seed * 9), y * TILE + 4 + Math.floor(tileNoise(x, y, 201) * 8), 3, 1);
      }
    }
  }

  // Drifting specks of light, positioned relative to the view so they are always visible.
  #drawPollen(view, scene) {
    this.context.fillStyle = PALETTE.paper;
    for (let index = 0; index < POLLEN_COUNT; index++) {
      const speedX = 4 + tileNoise(index, 1, 300) * 6;
      const speedY = 2 + tileNoise(index, 2, 300) * 3;
      const x = view.x + ((tileNoise(index, 3, 300) * view.w + scene.time * speedX) % view.w);
      const y = view.y + ((tileNoise(index, 4, 300) * view.h + scene.time * speedY + Math.sin(scene.time + index) * 3) % view.h);
      this.context.globalAlpha = 0.35 + 0.3 * Math.sin(scene.time * 2 + index);
      this.context.fillRect(Math.round(x), Math.round(y), 1, 1);
    }
    this.context.globalAlpha = 1;
  }
}
