// Checks the parts of the game that run without a browser:
// language choice, CV routing, translations, content and town layout.
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { DIALOGUES, SPEAKERS } from '../src/content/dialogues.js';
import { EDUCATION, ERASMUS } from '../src/content/education.js';
import { EXPERIENCES } from '../src/content/experiences.js';
import { GAMING, MUSIC, READING } from '../src/content/hobbies.js';
import { LOCATIONS } from '../src/content/locations.js';
import { GAMES, MOMENTS, PHOTOGRAPHY } from '../src/content/photos.js';
import { PROFILE, cvDownload } from '../src/content/profile.js';
import { FEATURED_PROJECTS, OTHER_PROJECTS } from '../src/content/projects.js';
import { SKILLS } from '../src/content/skills.js';
import { createSafeStorage } from '../src/core/storage.js';
import { CAT_FRAMES, CHARACTER_FRAMES, CHARACTER_HEIGHT, CHARACTER_WIDTH } from '../src/graphics/characterTemplates.js';
import { GLYPHS, GLYPH_HEIGHT } from '../src/graphics/pixelFont.js';
import { assertRectangularRows } from '../src/graphics/pixelSprite.js';
import { LanguageService, resolveLanguage } from '../src/i18n/language.js';
import { UI_STRINGS } from '../src/i18n/strings.js';
import { createTranslator } from '../src/i18n/translator.js';
import { CollisionMap } from '../src/world/collision.js';
import { findPath } from '../src/world/pathfinding.js';
import { TOWN_PLAN } from '../src/world/townPlan.js';
import { buildWorld } from '../src/world/worldBuilder.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function checkLanguageChoice() {
  const cases = [
    [['fr-FR'], 'fr'], [['fr-CA'], 'fr'], [['en-GB'], 'en'], [['EN-us'], 'en'],
    [['de-DE', 'fr-BE', 'en'], 'fr'], [['de-DE', 'en-US', 'fr'], 'en'], [['ja-JP'], 'en'], [[], 'en'],
  ];
  cases.forEach(([preferences, expected]) => {
    assert.equal(resolveLanguage({ requested: null, saved: null, preferences }), expected, `Browser preferences ${preferences}`);
  });
  assert.equal(resolveLanguage({ requested: null, saved: 'fr', preferences: ['en-US'] }), 'fr', 'Saved choice beats browser');
  assert.equal(resolveLanguage({ requested: 'fr', saved: 'en', preferences: ['en-US'] }), 'fr', 'Link beats saved choice');
  assert.equal(resolveLanguage({ requested: 'xx', saved: 'invalid', preferences: ['en-US'] }), 'en', 'Invalid values are ignored');
}

function checkLanguageService() {
  const memory = new Map();
  const storage = createSafeStorage({ getItem: key => memory.get(key) ?? null, setItem: (key, value) => memory.set(key, value), removeItem: key => memory.delete(key) });
  const location = { href: 'https://example.test/Mounir/?music=chill#town' };
  const history = { state: null, replaceState: (_state, _title, url) => { location.href = String(url); } };
  const service = new LanguageService({ storage, location, history, navigator: { languages: ['fr-FR'] } });
  const changes = [];
  service.subscribe(language => changes.push(language));
  assert.equal(service.current, 'fr');
  service.toggle();
  assert.equal(service.current, 'en');
  assert.equal(memory.get('mounir-language'), 'en');
  const url = new URL(location.href);
  assert.equal(url.searchParams.get('lang'), 'en');
  assert.equal(url.searchParams.get('music'), 'chill', 'Other query parameters are kept');
  assert.equal(url.hash, '#town');
  assert.deepEqual(changes, ['en']);

  const blocked = createSafeStorage({ getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); } });
  const resilient = new LanguageService({ storage: blocked, location: { href: 'https://example.test/' }, history, navigator: { languages: ['en'] } });
  resilient.set('fr');
  assert.equal(resilient.current, 'fr', 'Switching works without storage');
}

function checkCvRouting() {
  assert.deepEqual(cvDownload('fr'), { href: 'assets/Mounir-DABIRE-CV.pdf', filename: 'DABIRE_Mounir_CV_FR.pdf' });
  assert.deepEqual(cvDownload('en'), { href: 'assets/Mounir-DABIRE-CV-EN.pdf', filename: 'DABIRE_Mounir_CV_EN.pdf' });
  assert.equal(cvDownload('de').href, PROFILE.cv.fr, 'Unknown languages fall back to French');
}

function checkInterfaceStrings() {
  const french = Object.keys(UI_STRINGS.fr).sort();
  const english = Object.keys(UI_STRINGS.en).sort();
  assert.deepEqual(english, french, 'Both languages define the same interface strings');
  Object.entries(UI_STRINGS).forEach(([language, strings]) => {
    Object.entries(strings).forEach(([key, value]) => assert.ok(value.trim(), `${language}:${key} is empty`));
  });
  const translator = createTranslator({ current: 'en' });
  assert.equal(translator.t('viewer.counter', { current: 2, total: 16 }), '2 / 16');
  assert.equal(translator.pick({ fr: 'Bonjour', en: 'Hello' }), 'Hello');
}

// Every { fr, en } pair in the content must be filled in both languages.
function checkBilingualContent(value, path) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => checkBilingualContent(item, `${path}[${index}]`));
    return;
  }
  if (!value || typeof value !== 'object') return;
  const keys = Object.keys(value);
  if (keys.includes('fr') || keys.includes('en')) {
    assert.ok(typeof value.fr === 'string' && value.fr.trim(), `${path}.fr is missing`);
    if (!Array.isArray(value.en)) assert.ok(typeof value.en === 'string' && value.en.trim(), `${path}.en is missing`);
    return;
  }
  keys.forEach(key => checkBilingualContent(value[key], `${path}.${key}`));
}

function checkContent() {
  const content = { DIALOGUES, SPEAKERS, EDUCATION, ERASMUS, EXPERIENCES, GAMING, MUSIC, READING, LOCATIONS, FEATURED_PROJECTS, OTHER_PROJECTS, PROFILE };
  Object.entries(content).forEach(([name, value]) => checkBilingualContent(value, name));
  Object.entries(DIALOGUES).forEach(([script, lines]) => {
    lines.forEach(line => assert.ok(SPEAKERS[line.speaker], `${script}: unknown speaker ${line.speaker}`));
  });
  const photos = [...PHOTOGRAPHY, ...GAMES, ...MOMENTS, ...ERASMUS.trips.flatMap(trip => trip.photos)];
  checkBilingualContent(photos, 'photos');
  const assetPaths = [...photos.flatMap(photo => [photo.full, photo.thumb]), PROFILE.portrait, ...Object.values(PROFILE.cv)];
  assetPaths.forEach(path => assert.ok(existsSync(join(ROOT, path)), `Missing asset ${path}`));
  assert.equal(PHOTOGRAPHY.length, 16);
}

function checkSprites() {
  Object.entries(CHARACTER_FRAMES).forEach(([direction, frames]) => frames.forEach((rows, index) => {
    assert.equal(assertRectangularRows(rows, `${direction} ${index}`), CHARACTER_WIDTH);
    assert.equal(rows.length, CHARACTER_HEIGHT);
  }));
  CAT_FRAMES.forEach((rows, index) => assertRectangularRows(rows, `cat ${index}`));
  Object.entries(GLYPHS).forEach(([glyph, rows]) => {
    assertRectangularRows(rows, `glyph ${glyph}`);
    assert.equal(rows.length, GLYPH_HEIGHT, `glyph ${glyph}`);
  });
}

function checkTown() {
  const world = buildWorld(TOWN_PLAN);
  const collision = new CollisionMap(world.solid);
  const isWalkable = (x, y) => collision.isWalkableTile(x, y);
  assert.ok(isWalkable(world.spawn.x, world.spawn.y), 'Spawn tile is walkable');
  assert.deepEqual(world.buildings.map(building => building.id).sort(), LOCATIONS.map(location => location.id).sort(), 'One building per location');
  assert.deepEqual(world.skills.map(skill => skill.id).sort(), SKILLS.map(skill => skill.id).sort(), 'Every skill is placed');
  const targets = [
    ...world.buildings.map(building => [`door of ${building.id}`, building.spot]),
    ...world.skills.map(skill => [`skill ${skill.id}`, skill.tile]),
  ];
  targets.forEach(([name, tile]) => assert.ok(findPath(isWalkable, world.spawn, tile), `${name} is reachable from the spawn`));
}

checkLanguageChoice();
checkLanguageService();
checkCvRouting();
checkInterfaceStrings();
checkContent();
checkSprites();
checkTown();
console.log('Game checks passed: languages, CV routing, translations, content, assets, sprites and town layout.');
