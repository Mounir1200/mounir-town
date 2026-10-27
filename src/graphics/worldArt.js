import { TILE } from '../config.js';
import { locationById } from '../content/locations.js';
import { BUILDING_STYLES } from './buildingStyles.js';
import { paintBuilding } from './buildingPainter.js';
import { buildCatSprites, buildCharacterSprites, portraitOf } from './characterSprites.js';
import { paintBookIcon, paintInteractionBubble, paintSignIcon, paintSkillGem } from './icons.js';
import { cropped } from './pixelSprite.js';
import { paintProp } from './propPainter.js';
import { paintGround } from './terrainPainter.js';
import { TREE_BASE_Y, TREE_SIZE, paintTree } from './treePainter.js';

const TREE_VARIANTS = ['round', 'pine', 'blossom'];

// Owns every pre-rendered image of the town. Signs depend on the language,
// so buildings and lettered props are repainted when it changes.
export class WorldArt {
  constructor(world, translator) {
    this.world = world;
    this.translator = translator;
    this.treeSprites = Object.fromEntries(TREE_VARIANTS.map(variant => [variant, paintTree(variant)]));
    this.characters = {
      mounir: buildCharacterSprites('mounir'),
      guide: buildCharacterSprites('guide'),
      traveller: buildCharacterSprites('traveller'),
      cat: buildCatSprites(),
    };
    this.gem = paintSkillGem();
    this.bubble = paintInteractionBubble();
    this.portraits = {
      guide: portraitOf(this.characters.guide),
      traveller: portraitOf(this.characters.traveller),
      cat: cropped(this.characters.cat.left[0], 0, 0, 14, 12),
      sign: paintSignIcon(),
      book: paintBookIcon(),
    };
    this.ground = paintGround(world, this.#shadows());
    this.trees = world.trees.map(tree => this.#treeDrawable(tree));
    this.refreshLanguage();
  }

  refreshLanguage() {
    this.buildings = this.world.buildings.map(building => this.#buildingDrawable(building));
    this.props = this.world.props.map(prop => this.#propDrawable(prop));
    this.statics = [...this.buildings, ...this.props, ...this.trees];
  }

  #buildingDrawable(building) {
    const sign = this.translator.pick(locationById(building.id).sign);
    const { canvas, offsetY, effects } = paintBuilding(building, BUILDING_STYLES[building.id], sign);
    return this.#placed(canvas, building.rect.x * TILE, building.rect.y * TILE - offsetY, (building.rect.y + building.rect.h) * TILE, effects, building.id);
  }

  #propDrawable(prop) {
    const lines = prop.lines ? this.translator.pick(prop.lines) : [];
    const { canvas, offsetY, effects } = paintProp(prop, lines);
    return this.#placed(canvas, prop.rect.x * TILE, prop.rect.y * TILE - offsetY, (prop.rect.y + prop.rect.h) * TILE - 1, effects, prop.id);
  }

  #treeDrawable(tree) {
    const x = tree.x * TILE + TILE / 2 - TREE_SIZE.width / 2;
    const baseline = tree.y * TILE + TILE - 1;
    return this.#placed(this.treeSprites[tree.variant], x, baseline - TREE_BASE_Y, baseline, [], null);
  }

  #placed(image, x, y, baseline, effects, id) {
    return { id, image, x, y, baseline, effects, bounds: { x, y, w: image.width, h: image.height } };
  }

  #shadows() {
    const buildings = this.world.buildings.map(({ rect }) => ({
      x: (rect.x + rect.w / 2) * TILE + 3, y: (rect.y + rect.h) * TILE, radiusX: (rect.w * TILE) / 2, radiusY: 4,
    }));
    const props = this.world.props.map(({ rect }) => ({
      x: (rect.x + rect.w / 2) * TILE + 1, y: (rect.y + rect.h) * TILE - 2, radiusX: (rect.w * TILE) / 2 - 1, radiusY: 2,
    }));
    const trees = this.world.trees.map(({ x, y }) => ({ x: x * TILE + TILE / 2 + 1, y: y * TILE + TILE - 2, radiusX: 9, radiusY: 3 }));
    return [...buildings, ...props, ...trees];
  }
}
