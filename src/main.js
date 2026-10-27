import { MusicPlayer } from './audio/musicPlayer.js';
import { SoundController } from './audio/soundController.js';
import { SoundEffects } from './audio/soundEffects.js';
import { MAX_FRAME_SECONDS, MUSIC_VOLUME, PROGRESS_STORAGE_KEY, TILE } from './config.js';
import { LOCATIONS } from './content/locations.js';
import { PROFILE } from './content/profile.js';
import { SKILLS, skillById } from './content/skills.js';
import { isTouchFirst, prefersReducedMotion } from './core/dom.js';
import { KeyboardInput } from './core/keyboardInput.js';
import { PointerInput } from './core/pointerInput.js';
import { createSafeStorage } from './core/storage.js';
import { attractPoint } from './game/attractTour.js';
import { Game } from './game/game.js';
import { createInteractionRunner } from './game/interactionRunner.js';
import { ProgressTracker } from './game/progress.js';
import { WorldArt } from './graphics/worldArt.js';
import { LanguageService } from './i18n/language.js';
import { createTranslator } from './i18n/translator.js';
import { Camera } from './render/camera.js';
import { Viewport } from './render/viewport.js';
import { WorldRenderer } from './render/worldRenderer.js';
import { Announcer } from './ui/announcer.js';
import { DialogueBox } from './ui/dialogueBox.js';
import { HoverLabel } from './ui/hoverLabel.js';
import { Hud } from './ui/hud.js';
import { InteractionPrompt } from './ui/interactionPrompt.js';
import { MapMenu } from './ui/mapMenu.js';
import { PANEL_RENDERERS } from './ui/panels/index.js';
import { PanelHost } from './ui/panelHost.js';
import { PhotoViewer } from './ui/photoViewer.js';
import { pixelIcon } from './ui/pixelIcon.js';
import { TitleScreen } from './ui/titleScreen.js';
import { Toasts } from './ui/toasts.js';
import { CollisionMap } from './world/collision.js';
import { buildInteractables } from './world/interactables.js';
import { buildWorld } from './world/worldBuilder.js';
import { TOWN_PLAN } from './world/townPlan.js';

// Composition root: builds every service once and wires them together.

const dom = {
  canvas: document.querySelector('[data-world]'),
  hud: document.querySelector('[data-hud]'),
  prompt: document.querySelector('[data-prompt]'),
  toasts: document.querySelector('[data-toasts]'),
  dialogue: document.querySelector('[data-dialogue]'),
  title: document.querySelector('[data-title]'),
  hoverLabel: document.querySelector('[data-hover-label]'),
  announcer: document.querySelector('[data-announcer]'),
  panel: document.querySelector('[data-panel]'),
  menu: document.querySelector('[data-menu]'),
  viewer: document.querySelector('[data-viewer]'),
  music: document.querySelector('[data-music]'),
  description: document.querySelector('meta[name="description"]'),
};

const reducedMotion = prefersReducedMotion();
const isTouch = isTouchFirst();
const storage = createSafeStorage();
const language = new LanguageService({ storage, location, history, navigator });
const i18n = createTranslator(language);

const world = buildWorld(TOWN_PLAN);
const collision = new CollisionMap(world.solid);
const art = new WorldArt(world, i18n);
const interactables = buildInteractables(world, art, collision);
const progress = new ProgressTracker(storage, PROGRESS_STORAGE_KEY, { places: LOCATIONS.length, skills: SKILLS.length });
const sound = new SoundController(new MusicPlayer(dom.music, MUSIC_VOLUME), new SoundEffects());

const portraits = {
  photo: PROFILE.portrait,
  ...Object.fromEntries(Object.entries(art.portraits).map(([name, canvas]) => [name, canvas.toDataURL()])),
};
const toasts = new Toasts(dom.toasts);
const announcer = new Announcer(dom.announcer);
const hoverLabel = new HoverLabel(dom.hoverLabel);
const viewer = new PhotoViewer(dom.viewer, { i18n });
const dialogue = new DialogueBox(dom.dialogue, { i18n, sound, portraits, reducedMotion, isTouch });
const panels = new PanelHost(dom.panel, {
  i18n,
  sound,
  renderers: PANEL_RENDERERS,
  context: {
    i18n,
    sound,
    openPhoto: (photos, index) => viewer.open(photos, index),
    travelTo: id => panels.close({ travelTo: id }),
  },
});
const menu = new MapMenu(dom.menu, {
  i18n, progress, art, world,
  onReset: () => {
    progress.reset();
    location.reload();
  },
});

const camera = new Camera(world.width * TILE, world.height * TILE);
const viewport = new Viewport(dom.canvas);
const renderer = new WorldRenderer(dom.canvas, viewport, art);

let game = null;
const keyboard = new KeyboardInput(window, {
  isActive: () => game?.isPlaying ?? false,
  onInteract: () => game.interact(),
  onMenu: () => openMenu(),
});
const prompt = new InteractionPrompt(dom.prompt, { i18n, isTouch, onActivate: target => game.interact(target) });

game = new Game({
  world,
  collision,
  interactables,
  progress,
  keyboard,
  runInteraction: createInteractionRunner({ i18n, panels, dialogue, sound, progress, toasts }),
  hooks: {
    onFocusChange(target) {
      if (!target) {
        prompt.hide();
        return;
      }
      prompt.show(target);
      announcer.say(prompt.label.textContent);
    },
    onModeChange(mode) {
      if (mode !== 'playing') hoverLabel.hide();
    },
    onSkillFound: collectSkill,
    onTeleport: player => camera.snapTo(player),
  },
});

function collectSkill(id) {
  if (!progress.collect(id)) return;
  sound.play('collect');
  toasts.show(i18n.t('toast.skill', { name: skillById(id).name, count: progress.skillCount, total: SKILLS.length }), pixelIcon('gem'));
  if (progress.hasAllSkills && progress.celebrateOnce('skills')) game.runModal(() => dialogue.play('allSkills'));
}

async function openMenu() {
  if (!game.isPlaying) return;
  const choice = await game.runModal(() => menu.open(game.player));
  if (choice) await game.travelTo(choice);
}

async function toggleSound() {
  const isWorking = await sound.toggle();
  if (!isWorking) toasts.show(i18n.t('toast.musicError'));
}

const hud = new Hud(dom.hud, {
  i18n, progress, sound,
  onMap: openMenu,
  onToggleSound: toggleSound,
  onToggleLanguage: () => language.toggle(),
});
const title = new TitleScreen(dom.title, {
  i18n, progress, sound, isTouch,
  onToggleLanguage: () => language.toggle(),
  onToggleSound: toggleSound,
});

new PointerInput(dom.canvas, {
  onTap(clientX, clientY) {
    game.handleTap(viewport.toWorld(clientX, clientY, camera));
  },
  onHover(clientX, clientY) {
    const target = game.hoverAt(viewport.toWorld(clientX, clientY, camera));
    dom.canvas.classList.toggle('is-pointing', Boolean(target));
    if (target) hoverLabel.show(i18n.t('hover.goTo', { name: i18n.pick(target.label) }), clientX, clientY);
    else hoverLabel.hide();
  },
  onLeave: () => hoverLabel.hide(),
});

function applyDocumentLanguage() {
  document.documentElement.lang = language.current;
  document.title = i18n.t('meta.title');
  dom.description.content = i18n.t('meta.description');
  dom.canvas.setAttribute('aria-label', i18n.t('canvas.label'));
}

language.subscribe(() => {
  applyDocumentLanguage();
  art.refreshLanguage();
  [hud, title, prompt].forEach(component => component.render());
  [dialogue, panels, viewer, menu].forEach(component => component.refreshLanguage());
});

function resize() {
  const view = viewport.resize();
  camera.setViewSize(view.width, view.height);
}

let elapsed = 0;
let previousFrame = performance.now();
function frame(now) {
  const deltaSeconds = Math.min((now - previousFrame) / 1000, MAX_FRAME_SECONDS);
  previousFrame = now;
  elapsed += deltaSeconds;
  game.update(deltaSeconds);
  camera.follow(game.mode === 'title' ? attractPoint(elapsed, reducedMotion) : game.player, deltaSeconds);
  renderer.render({
    camera,
    player: game.player,
    npcs: game.npcs,
    gems: game.gems,
    focus: game.focus,
    marker: game.marker,
    time: elapsed,
    reducedMotion,
    musicPlaying: sound.isMusicPlaying,
  });
  requestAnimationFrame(frame);
}

async function start() {
  applyDocumentLanguage();
  resize();
  window.addEventListener('resize', resize);
  camera.snapTo(attractPoint(0, reducedMotion));
  requestAnimationFrame(frame);
  document.documentElement.classList.add('is-ready');

  await title.show();
  hud.setVisible(true);
  game.start();
  await game.runModal(() => dialogue.play(progress.introSeen ? 'welcomeBack' : 'intro'));
  progress.markIntroSeen();
}

start();
