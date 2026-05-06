/* ═══════════════════════════════════════
   CONFIG — Constants, palette, settings
   ═══════════════════════════════════════ */

export const CANVAS_W = 1200;
export const CANVAS_H = 675;

export const WALK_SPEED = 50;
export const DRIFT_SPEED = 0;
export const TYPE_SPEED = 0.028;
export const ADVANCE_BLOCK_MS = 350;

export const PALETTE = {
  // Day palette — winter archaeological site
  skyTop:      '#9a9590',
  skyMid:      '#b5b0aa',
  skyBottom:   '#c8c3bd',
  ground:      '#c2bdb7',
  soil:        '#6b6560',
  soilDark:    '#4a4540',
  soilDeep:    '#2e2a26',
  clay:        '#7a6e62',
  chalk:       '#a8a298',
  dark:        '#1a1713',
  darkest:     '#0c0b09',
  mid:         '#5a5550',
  light:       '#d1cdc8',
  accent:      '#3a3530',      // subtle warm-dark for artefact
  bone:        '#c8c0b0',      // bone/antler colour
  metal:       '#6a6a6e',      // corroded metal
  stone:       '#8a8580',      // worked stone

  // Night palette
  nightSkyTop:    '#060504',
  nightSkyMid:    '#0e0d0b',
  nightSkyBottom: '#141210',
  nightGround:    '#0b0a08',
  nightDark:      '#070605',
  nightDarkest:   '#040303',
  windowGlow:     'rgba(200,180,140,0.04)',
  lampGlow:       'rgba(220,200,160,0.03)',
};

// Parallax layer speeds
export const PARALLAX = {
  sky:       0.0,
  hills:     0.08,
  houses:    0.18,
  midTrees:  0.35,
  nearTrees: 0.55,
  ground:    1.0,
};

// Ground and horizon positions (fractions of canvas height)
export const HORIZON_Y = 0.58;
export const GROUND_Y  = 0.72;
export const TRENCH_Y  = 0.72;

// Character dimensions
export const CHAR = {
  height: 55,
  width: 14,
  headR: 6,
  armLen: 17,
  legLen: 20,
  torsoLen: 20,
};

// Snow/weather
export const SNOW_BASE_COUNT = 55;
