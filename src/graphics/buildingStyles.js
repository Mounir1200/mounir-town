import { PALETTE } from './palette.js';

// Visual recipe of each building. `extraTop` is the room above the footprint
// for tall details (antennas, chimney, control tower) drawn behind nothing.
export const BUILDING_STYLES = {
  home: {
    roofKind: 'gable', roof: PALETTE.clay, roofShade: PALETTE.brownWarm, roofLight: PALETTE.peachDeep,
    wall: PALETTE.cream, wallShade: PALETTE.peachLight, texture: 'plaster',
    windows: 'standard', trim: PALETTE.brown, door: PALETTE.brown,
    signPlacement: 'eave', features: ['chimney', 'flowerBoxes'], extraTop: 12,
  },
  lab: {
    roofKind: 'gable', roof: PALETTE.cobalt, roofShade: PALETTE.cobaltDeep, roofLight: PALETTE.cobaltBright,
    wall: PALETTE.paper, wallShade: PALETTE.cream, texture: 'plaster',
    windows: 'screen', trim: PALETTE.cobaltDeep, door: PALETTE.cobaltDeep,
    signPlacement: 'eave', features: ['dish', 'antenna'], extraTop: 14,
  },
  essca: {
    roofKind: 'flat', roof: PALETTE.brown, roofShade: PALETTE.brownDeep, roofLight: PALETTE.brownWarm,
    wall: PALETTE.cobaltDeep, wallShade: PALETTE.cobaltNight, texture: 'glass',
    windows: 'none', trim: PALETTE.paper, door: PALETTE.cobaltNight,
    signPlacement: 'eave', features: ['flags', 'rooftopUnits'], extraTop: 14,
  },
  tower: {
    roofKind: 'flat', roof: PALETTE.brownWarm, roofShade: PALETTE.brown, roofLight: PALETTE.clay,
    wall: PALETTE.paper, wallShade: PALETTE.cream, texture: 'plaster',
    windows: 'small', trim: PALETTE.brown, door: PALETTE.brown,
    signPlacement: 'eave', features: ['mast'], extraTop: 56,
  },
  school: {
    roofKind: 'gable', roof: PALETTE.cobalt, roofShade: PALETTE.cobaltDeep, roofLight: PALETTE.cobaltBright,
    wall: PALETTE.clay, wallShade: PALETTE.brownWarm, texture: 'brick',
    windows: 'standard', trim: PALETTE.paper, door: PALETTE.brown,
    signPlacement: 'eave', features: ['clock', 'belfry'], extraTop: 16,
  },
  airport: {
    roofKind: 'flat', roof: PALETTE.cobalt, roofShade: PALETTE.cobaltDeep, roofLight: PALETTE.cobaltBright,
    wall: PALETTE.paper, wallShade: PALETTE.cream, texture: 'plaster',
    windows: 'band', trim: PALETTE.cobaltDeep, door: PALETTE.cobaltDeep,
    signPlacement: 'eave', features: ['controlTower'], extraTop: 30,
  },
  museum: {
    roofKind: 'gable', roof: PALETTE.cream, roofShade: PALETTE.peachLight, roofLight: PALETTE.paper,
    wall: PALETTE.peachLight, wallShade: PALETTE.peachDeep, texture: 'plaster',
    windows: 'none', trim: PALETTE.brown, door: PALETTE.brown,
    signPlacement: 'pediment', features: ['pediment', 'columns'], extraTop: 8,
  },
  post: {
    roofKind: 'gable', roof: PALETTE.cobalt, roofShade: PALETTE.cobaltDeep, roofLight: PALETTE.cobaltBright,
    wall: PALETTE.cream, wallShade: PALETTE.peachLight, texture: 'plaster',
    windows: 'standard', trim: PALETTE.cobaltDeep, door: PALETTE.cobalt,
    signPlacement: 'eave', features: ['envelope'], extraTop: 6,
  },
};
