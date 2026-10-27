import { TILE } from '../config.js';
import { LOCATIONS } from '../content/locations.js';
import { MUSIC } from '../content/hobbies.js';
import { el, externalLink } from '../core/dom.js';
import { PALETTE } from '../graphics/palette.js';
import { pixelIcon } from './pixelIcon.js';

const MINIMAP_PIXELS_PER_TILE = 4;

// Pause menu: town plan, direct travel to every place, controls and credits.
// `open` resolves with the chosen location id, or null when closed.
export class MapMenu {
  #choice = null;
  #resolve = null;

  constructor(dialog, { i18n, progress, art, world, onReset }) {
    this.dialog = dialog;
    this.i18n = i18n;
    this.progress = progress;
    this.art = art;
    this.world = world;
    this.onReset = onReset;

    this.title = el('h2', { className: 'menu__title', id: 'menu-title' });
    this.closeButton = el('button', { className: 'panel__close', type: 'button', on: { click: () => this.close() } }, pixelIcon('close'), el('span', { className: 'panel__close-label' }));
    this.intro = el('p', { className: 'menu__intro' });
    this.minimap = el('canvas', { className: 'menu__minimap', width: world.width * MINIMAP_PIXELS_PER_TILE, height: world.height * MINIMAP_PIXELS_PER_TILE, attrs: { role: 'img' } });
    this.placesTitle = el('h3', { className: 'menu__subtitle' });
    this.places = el('ol', { className: 'menu__places' });
    this.extras = el('div', { className: 'menu__extras' });

    dialog.setAttribute('aria-labelledby', 'menu-title');
    dialog.append(el('div', { className: 'panel__frame menu__frame' },
      el('header', { className: 'panel__header' }, el('div', { className: 'panel__heading' }, this.title, this.intro), this.closeButton),
      el('div', { className: 'panel__body menu__body' },
        el('div', { className: 'menu__layout' }, el('figure', { className: 'menu__map' }, this.minimap), el('div', {}, this.placesTitle, this.places)),
        this.extras)));
    dialog.addEventListener('close', () => {
      const resolve = this.#resolve;
      this.#resolve = null;
      resolve?.(this.#choice);
    });
    dialog.addEventListener('click', event => {
      if (event.target === dialog) this.close();
    });
  }

  open(player) {
    this.#choice = null;
    this.player = player;
    this.#render();
    this.dialog.showModal();
    this.places.querySelector('button')?.focus({ preventScroll: true });
    return new Promise(resolve => { this.#resolve = resolve; });
  }

  close(choice = null) {
    this.#choice = choice;
    if (this.dialog.open) this.dialog.close();
  }

  refreshLanguage() {
    if (this.dialog.open) this.#render();
  }

  #render() {
    const { t } = this.i18n;
    this.title.textContent = t('menu.title');
    this.intro.textContent = t('menu.intro');
    this.closeButton.querySelector('.panel__close-label').textContent = t('menu.resume');
    this.placesTitle.textContent = t('menu.places');
    this.minimap.setAttribute('aria-label', t('menu.minimap'));
    this.places.replaceChildren(...LOCATIONS.map((location, index) => this.#placeItem(location, index)));
    this.extras.replaceChildren(...this.#extras());
    this.#drawMinimap();
  }

  #placeItem(location, index) {
    const { t, pick } = this.i18n;
    const isVisited = this.progress.hasVisited(location.id);
    return el('li', {},
      el('button', { className: 'menu__place', type: 'button', on: { click: () => this.close(location.id) } },
        el('span', { className: 'menu__number', text: String(index + 1) }),
        el('span', { className: 'menu__place-text' },
          el('strong', { text: pick(location.name) }),
          el('span', { text: pick(location.theme) })),
        el('span', { className: `menu__status${isVisited ? ' is-visited' : ''}` },
          isVisited ? pixelIcon('check') : null,
          el('span', { text: t(isVisited ? 'menu.visited' : 'menu.notVisited') }))));
  }

  #extras() {
    const { t } = this.i18n;
    return [
      el('section', { className: 'menu__note' },
        el('h3', { className: 'menu__subtitle', text: t('menu.controls') }),
        el('p', { text: t('menu.controlsMove') }),
        el('p', { text: t('menu.controlsInteract') }),
        el('p', { text: t('menu.controlsMenu') })),
      el('section', { className: 'menu__note' },
        el('h3', { className: 'menu__subtitle', text: t('menu.credits') }),
        el('p', {}, t('menu.creditsMusic'), ' ', externalLink(MUSIC.source, 'Pixabay')),
        el('p', { text: t('menu.creditsFonts') }),
        el('p', { text: t('menu.creditsArt') }),
        el('button', { className: 'button button--quiet', type: 'button', text: t('menu.reset'), on: { click: () => this.onReset() } })),
    ];
  }

  #drawMinimap() {
    const context = this.minimap.getContext('2d');
    const scale = MINIMAP_PIXELS_PER_TILE / TILE;
    context.imageSmoothingEnabled = true;
    context.drawImage(this.art.ground, 0, 0, this.minimap.width, this.minimap.height);
    context.imageSmoothingEnabled = false;
    this.art.trees.forEach(tree => {
      context.fillStyle = PALETTE.cobaltDeep;
      context.fillRect(Math.round((tree.x + 12) * scale), Math.round((tree.y + 8) * scale), 3, 3);
    });
    context.font = '700 10px "Space Grotesk", sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    this.world.buildings.forEach(building => {
      const { x, y, w, h } = building.rect;
      const size = MINIMAP_PIXELS_PER_TILE;
      const isVisited = this.progress.hasVisited(building.id);
      context.fillStyle = PALETTE.ink;
      context.fillRect(x * size - 1, y * size - 1, w * size + 2, h * size + 2);
      context.fillStyle = isVisited ? PALETTE.cobalt : PALETTE.brownWarm;
      context.fillRect(x * size, y * size, w * size, h * size);
      context.fillStyle = PALETTE.paper;
      const number = LOCATIONS.findIndex(location => location.id === building.id) + 1;
      context.fillText(String(number), (x + w / 2) * size, (y + h / 2) * size + 1);
    });
    const playerX = Math.round(this.player.x * scale);
    const playerY = Math.round(this.player.y * scale);
    context.fillStyle = PALETTE.ink;
    context.fillRect(playerX - 4, playerY - 4, 8, 8);
    context.fillStyle = PALETTE.peach;
    context.fillRect(playerX - 3, playerY - 3, 6, 6);
  }
}
