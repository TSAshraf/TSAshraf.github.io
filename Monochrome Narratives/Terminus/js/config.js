/* ═══════════════════════════════════════
   CONFIG — Constants, palette, train layout
   ═══════════════════════════════════════ */

export const CANVAS_W = 1200;
export const CANVAS_H = 675;

export const TYPE_SPEED = 0.028;
export const ADVANCE_BLOCK_MS = 350;
export const WALK_SPEED = 60;

// ── Monochrome palette ──
export const PALETTE = {
  black:      '#0a0908',
  darkest:    '#0c0b09',
  dark:       '#1a1713',
  mid:        '#3a3530',
  midLight:   '#5a5550',
  light:      '#7a7570',
  lighter:    '#a09a94',
  lightest:   '#c3bfb9',
  white:      '#d1cdc8',

  // Train specific
  carWall:    '#1e1b18',
  carCeiling: '#141210',
  carFloor:   '#0e0d0b',
  seat:       '#2a2622',
  seatTop:    '#332f2b',
  window:     '#0c0b09',
  windowFrame:'#3a3530',
  door:       '#2e2a26',
  doorFrame:  '#3a3530',
  luggage:    '#252220',

  // Landscape through windows
  skyDark:    '#141210',
  skyMid:     '#1e1b18',
  ground:     '#0e0d0b',

  // Hallucination
  bloodDeep:  '#2a0808',
  bloodMid:   '#4a0c0c',
  blood:      '#6a1010',
  bloodLight: '#8a1818',
  bloodBright:'#aa2020',

  // Text
  text:       '#c3bfb9',
  textDim:    '#7a7570',
  textDark:   '#5a5550',
  speaker:    '#7a7570',
  prompt:     '#4a4540',
};

// ── Train layout ──
export const CARS = {
  count: 5,
  // Car width on canvas (each car fills the screen)
  width: CANVAS_W,
  // Interior boundaries
  floorY:   CANVAS_H * 0.75,
  ceilingY: CANVAS_H * 0.12,
  wallLeft:  60,
  wallRight: CANVAS_W - 60,
  // Window area
  windowTop:    CANVAS_H * 0.20,
  windowBottom: CANVAS_H * 0.50,
  windowWidth:  140,
  windowGap:    60,
  // Doors
  doorWidth: 50,
  doorTop:   CANVAS_H * 0.25,
  // Seats
  seatWidth:  50,
  seatHeight: 35,
  seatBackH:  50,
};

// ── Character ──
export const CHAR = {
  height: 50,
  headR:  5.5,
  torsoLen: 18,
  armLen: 15,
  legLen: 18,
};

// ── Interaction ──
export const INTERACT_RANGE = 60;  // how close to a passenger to interact
export const DOOR_RANGE = 40;      // how close to a door to transition

// ── Timing ──
export const RESET_FADE_DURATION = 2.0;   // seconds for reset fade
export const CAR_TRANSITION_DURATION = 0.8;
export const INACTIVITY_RESET_TIME = 120;  // seconds of inaction before auto-reset (do-nothing path)
