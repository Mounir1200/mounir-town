export const TILE = 16;

// World pixels per second (about five tiles).
export const PLAYER_SPEED = 84;

// The camera zoom keeps roughly this many tiles on the short side of the screen.
export const TILES_ON_SHORT_SIDE = 11;
export const MIN_SCALE = 2;
export const MAX_SCALE = 6;

// Longer frames (tab switch, debugger) are clamped so nobody walks through walls.
export const MAX_FRAME_SECONDS = 0.05;

export const CAMERA_SMOOTHING = 8;
export const TAP_MAX_TRAVEL_PX = 12;
export const PICKUP_RADIUS = 10;

export const PROGRESS_STORAGE_KEY = 'mounir-game-progress';
export const MUSIC_VOLUME = 0.18;
