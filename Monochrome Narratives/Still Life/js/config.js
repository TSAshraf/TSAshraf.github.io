/* ═══════════════════════════════════════
   CONFIG — Constants, palette, settings
   ═══════════════════════════════════════ */

export const CANVAS_W = 1200;
export const CANVAS_H = 675;

export const WALK_SPEED = 45;
export const TYPE_SPEED = 0.030;
export const ADVANCE_BLOCK_MS = 350;

export const PALETTE = {
  // Dream palette — cool blue-greys
  skyTop:      '#7e848c',
  skyMid:      '#9aa0a8',
  skyBottom:   '#b4bac0',
  ground:      '#a8adb2',
  pavement:    '#8e9298',
  road:        '#5e6268',
  kerb:        '#7a7e84',

  // Building tones
  brick:       '#6e6a66',
  brickLight:  '#8a8682',
  brickDark:   '#4a4844',
  mortar:      '#7e7a76',
  roof:        '#3e3c3a',
  roofTile:    '#4a4846',
  door:        '#3a3836',
  window:      '#2a2a2e',
  windowFrame: '#6a6866',

  // Garden / nature
  hedge:       '#4a5048',
  hedgeLight:  '#5a6058',
  grass:       '#6a7068',
  fence:       '#5a5856',
  path:        '#8a8e8a',

  // Interior
  wallLight:   '#c8c4c0',
  wallMid:     '#a8a4a0',
  floorWood:   '#5a5450',
  floorLight:  '#6a6460',
  skirting:    '#4a4642',
  ceiling:     '#d0ccc8',
  furniture:   '#3a3632',
  fabricDark:  '#2e2c2a',
  fabricMid:   '#4a4644',
  shelf:       '#5a5652',
  book:        '#3a3836',

  // The Lamp — the only warmth in the world
  lampBase:    '#5a5048',
  lampShade:   '#b8a880',
  lampBulb:    '#e8d8a8',
  lampGlow:    'rgba(220,190,130,0.08)',
  lampGlowStr: 'rgba(220,190,130,0.18)',
  lampWarm:    '#d4c088',
  lampRing:    'rgba(200,170,100,0.04)',

  // General
  dark:        '#141214',
  darkest:     '#0a090b',
  mid:         '#5a5856',
  light:       '#d0ccc8',
  textLight:   '#c0bcb8',

  // Night / late interior
  nightBg:     '#0e0d0f',
  nightWall:   '#1a1918',
  nightFloor:  '#121112',
};

// Parallax layer speeds (walk scenes)
export const PARALLAX = {
  sky:       0.0,
  farHouses: 0.10,
  midHouses: 0.25,
  nearTrees: 0.45,
  ground:    1.0,
};

// Ground and horizon positions (fractions of canvas height)
export const HORIZON_Y = 0.55;
export const GROUND_Y  = 0.72;

// Character dimensions
export const CHAR = {
  height: 52,
  width: 13,
  headR: 6,
  armLen: 16,
  legLen: 19,
  torsoLen: 19,
};

// Rain
export const RAIN_BASE_COUNT = 80;
