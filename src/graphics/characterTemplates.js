// 16×20 character templates. Symbols: o outline, h hair, s skin, S skin shade,
// f glasses frame, e eye, c jacket, C jacket shade, p T-shirt, b trousers, k shoes.
// Bodies (16 rows) and legs (4 rows) are combined to build walking frames.

export const CHARACTER_WIDTH = 16;
export const CHARACTER_HEIGHT = 20;

const BODY_FRONT = [
  '................',
  '.....oooooo.....',
  '....ohhhhhho....',
  '...ohhhhhhhho...',
  '...ohhhhhhhho...',
  '...ohssssssho...',
  '...osffssffso...',
  '...osfessefso...',
  '...osssssssso...',
  '...osssSSssso...',
  '....osssssso....',
  '..occCppppCcco..',
  '.occcCppppCccco.',
  '.occcCppppCccco.',
  '.occcCppppCccco.',
  '.osccccccccccso.',
];

const BODY_BACK = [
  '................',
  '.....oooooo.....',
  '....ohhhhhho....',
  '...ohhhhhhhho...',
  '...ohhhhhhhho...',
  '...ohhhhhhhho...',
  '...ohhhhhhhho...',
  '...ohhhhhhhho...',
  '...oshhhhhhso...',
  '...ohhhhhhhho...',
  '....osssssso....',
  '..occcccccccco..',
  '.occcccCCccccco.',
  '.occcccCCccccco.',
  '.occcccCCccccco.',
  '.osccccccccccso.',
];

const BODY_SIDE = [
  '................',
  '......ooooo.....',
  '.....ohhhhho....',
  '....ohhhhhhho...',
  '....ohhhhhhho...',
  '....ohhhhssso...',
  '....ohhsssffo...',
  '....ohssssefo...',
  '....osssssssso..',
  '....ossssssSo...',
  '.....ossssso....',
  '....occcccppo...',
  '....occCcccpo...',
  '....occCcccpo...',
  '....occCcccpo...',
  '....occscccco...',
];

const LEGS_FRONT = {
  idle: ['...obbbbbbbbo...', '...obbboobbbo...', '...okkkookkko...', '....ooo..ooo....'],
  stepLeft: ['...obbbbbbbbo...', '...obbbookkko...', '...okkko.ooo....', '....ooo.........'],
  stepRight: ['...obbbbbbbbo...', '...okkkoobbbo...', '....ooo.okkko...', '.........ooo....'],
};

const LEGS_SIDE = {
  idle: ['.....obbbbo.....', '.....obbbbo.....', '.....okkkkko....', '......oooooo....'],
  stride: ['....obbbbbbo....', '...obbo..obbo...', '..okkko..okkko..', '...ooo....ooo...'],
};

// Frame order is the walk cycle; frame 0 is also the standing pose.
export const CHARACTER_FRAMES = {
  down: [
    [...BODY_FRONT, ...LEGS_FRONT.idle],
    [...BODY_FRONT, ...LEGS_FRONT.stepLeft],
    [...BODY_FRONT, ...LEGS_FRONT.idle],
    [...BODY_FRONT, ...LEGS_FRONT.stepRight],
  ],
  up: [
    [...BODY_BACK, ...LEGS_FRONT.idle],
    [...BODY_BACK, ...LEGS_FRONT.stepLeft],
    [...BODY_BACK, ...LEGS_FRONT.idle],
    [...BODY_BACK, ...LEGS_FRONT.stepRight],
  ],
  right: [
    [...BODY_SIDE, ...LEGS_SIDE.idle],
    [...BODY_SIDE, ...LEGS_SIDE.stride],
    [...BODY_SIDE, ...LEGS_SIDE.idle],
    [...BODY_SIDE, ...LEGS_SIDE.stride],
  ],
};

// 14×12 sitting cat, facing left. Symbols: o outline, C fur, w chest, e eye, n nose.
export const CAT_FRAMES = [
  [
    '.o...o........',
    '.oCo.oCo......',
    '.oCCCCCo......',
    'oCeCCeCCo.....',
    'oCCCnCCCo.....',
    '.oCwwwCo......',
    '.oCwwwCCo..oo.',
    'oCCwwwCCCo.oCo',
    'oCCCwCCCCCooCo',
    'oCCCCCCCCCCCo.',
    '.oCoCoCCCCCo..',
    '..o.o.ooooo...',
  ],
  [
    '.o...o........',
    '.oCo.oCo......',
    '.oCCCCCo......',
    'oCoCCoCCo.....',
    'oCCCnCCCo.....',
    '.oCwwwCo......',
    '.oCwwwCCo.....',
    'oCCwwwCCCo..oo',
    'oCCCwCCCCCooCo',
    'oCCCCCCCCCCCo.',
    '.oCoCoCCCCCo..',
    '..o.o.ooooo...',
  ],
];
