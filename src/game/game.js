import { PICKUP_RADIUS, PLAYER_SPEED, TILE } from '../config.js';
import { PathFollower } from '../entities/pathFollower.js';
import { Player, facingFor, tileFeet } from '../entities/player.js';
import { focusedInteractable, interactableAt } from '../world/interactables.js';
import { findPath, nearestWalkable } from '../world/pathfinding.js';
import { rectContains } from '../world/tileGrid.js';

const GEM_FLOAT_HEIGHT = 4;
const TAP_SEARCH_RADIUS = 2;

// Game rules: movement, picking up skills, finding what the player can use and
// running interactions. Rendering and UI are injected collaborators.
export class Game {
  #mode = 'title';
  #focus = null;
  #pendingTarget = null;
  #isDoorArmed = true;

  constructor({ world, collision, interactables, progress, keyboard, runInteraction, hooks }) {
    this.world = world;
    this.collision = collision;
    this.interactables = interactables;
    this.progress = progress;
    this.keyboard = keyboard;
    this.runInteraction = runInteraction;
    this.hooks = hooks;
    this.player = new Player(world.spawn, world.spawn.facing);
    this.path = new PathFollower();
    this.marker = null;
    this.npcs = world.npcs.map(npc => ({ ...npc, ...tileFeet(npc.tile) }));
    this.gems = world.skills
      .filter(skill => !progress.hasSkill(skill.id))
      .map(skill => ({ id: skill.id, x: skill.tile.x * TILE + TILE / 2, y: skill.tile.y * TILE + TILE - GEM_FLOAT_HEIGHT }));
  }

  get mode() {
    return this.#mode;
  }

  get isPlaying() {
    return this.#mode === 'playing';
  }

  get focus() {
    return this.#focus;
  }

  start() {
    this.#setMode('playing');
    this.#refreshFocus();
  }

  update(deltaSeconds) {
    if (!this.isPlaying) {
      this.player.isMoving = false;
      return;
    }
    const keyboardDirection = this.keyboard.direction();
    if (keyboardDirection) this.#cancelWalk();
    const steering = keyboardDirection ? null : this.path.steer(this.player);
    const direction = keyboardDirection ?? steering;
    const distance = Math.min(PLAYER_SPEED * deltaSeconds, steering?.distance ?? Infinity);
    const before = { x: this.player.x, y: this.player.y };
    const blocked = this.player.move(direction, distance, this.collision);
    if (this.path.isActive) this.path.reportProgress(this.player.x !== before.x || this.player.y !== before.y, deltaSeconds);

    this.#collectGems();
    this.#refreshFocus();
    if (!this.path.isActive) this.#arrive();
    this.#enterDoorWhenPushed(keyboardDirection, blocked);
  }

  async interact(target = this.#focus) {
    if (!target || !this.isPlaying) return;
    this.#cancelWalk();
    this.#faceEachOther(target);
    const followUp = await this.runModal(() => this.runInteraction(target));
    if (followUp?.travelTo) await this.travelTo(followUp.travelTo);
  }

  async runModal(task) {
    this.#setMode('busy');
    try {
      return await task();
    } finally {
      this.#setMode('playing');
    }
  }

  async travelTo(locationId) {
    const target = this.interactables.find(candidate => candidate.id === locationId);
    if (!target) return;
    this.#cancelWalk();
    this.player.placeAt(target.approach, 'up');
    this.hooks.onTeleport(this.player);
    this.#refreshFocus();
    await this.interact(target);
  }

  handleTap(point) {
    if (!this.isPlaying) return;
    const target = interactableAt(this.interactables, point);
    if (target) {
      if (rectContains(target.zone, this.player.x, this.player.y)) this.interact(target);
      else if (target.approach) this.#walkTo(target.approach, target);
      return;
    }
    const isWalkable = (x, y) => this.collision.isWalkableTile(x, y);
    const destination = nearestWalkable(isWalkable, { x: Math.floor(point.x / TILE), y: Math.floor(point.y / TILE) }, TAP_SEARCH_RADIUS);
    if (destination) this.#walkTo(destination, null);
  }

  hoverAt(point) {
    return this.isPlaying ? interactableAt(this.interactables, point) : null;
  }

  #walkTo(tile, target) {
    const route = findPath((x, y) => this.collision.isWalkableTile(x, y), this.player.tile, tile);
    if (!route) return;
    this.path.start(route);
    this.#pendingTarget = target;
    this.marker = { ...tileFeet(tile), isTarget: Boolean(target) };
  }

  #cancelWalk() {
    this.path.clear();
    this.#pendingTarget = null;
    this.marker = null;
  }

  #arrive() {
    const target = this.#pendingTarget;
    this.#pendingTarget = null;
    this.marker = null;
    if (target && rectContains(target.zone, this.player.x, this.player.y)) this.interact(target);
  }

  // Walking into a door enters it, once per push.
  #enterDoorWhenPushed(direction, blocked) {
    const isPushingUp = direction?.y < 0;
    if (!isPushingUp) {
      this.#isDoorArmed = true;
      return;
    }
    if (this.#focus?.kind === 'location' && blocked.blockedY && this.#isDoorArmed) {
      this.#isDoorArmed = false;
      this.interact(this.#focus);
    }
  }

  #faceEachOther(target) {
    const towards = { x: target.anchor.x - this.player.x, y: target.anchor.y - 8 - this.player.y };
    if (towards.x !== 0 || towards.y !== 0) this.player.facing = facingFor(towards);
    const npc = this.npcs.find(candidate => candidate.id === target.id);
    if (npc && npc.look !== 'cat') npc.facing = facingFor({ x: this.player.x - npc.x, y: this.player.y - npc.y });
  }

  #collectGems() {
    this.gems = this.gems.filter(gem => {
      const isTouching = Math.hypot(gem.x - this.player.x, gem.y - this.player.y) < PICKUP_RADIUS;
      if (isTouching) this.hooks.onSkillFound(gem.id);
      return !isTouching;
    });
  }

  #refreshFocus() {
    const focus = this.isPlaying ? focusedInteractable(this.interactables, this.player) : null;
    if (focus === this.#focus) return;
    this.#focus = focus;
    this.hooks.onFocusChange(focus);
  }

  #setMode(mode) {
    this.#mode = mode;
    this.keyboard.reset();
    this.#refreshFocus();
    this.hooks.onModeChange(mode);
  }
}
