/* ═══════════════════════════════════════
   RENDERER — Train interiors, passengers,
   landscape, hallucination
   ═══════════════════════════════════════ */

import {
  CANVAS_W, CANVAS_H, PALETTE, CARS, CHAR
} from './config.js';
import { SeededRNG, lerp, clamp } from './utils.js';

// ─────────────────────────────────────
// Train car interior — cross-section view
// ─────────────────────────────────────

export function drawCarInterior(ctx, carIndex, gameState) {
  const P = PALETTE;
  const C = CARS;
  const loopCount = gameState ? gameState.loopCount : 0;

  // ── Background (dark train interior) ──
  ctx.fillStyle = P.carWall;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // ── Ceiling ──
  ctx.fillStyle = P.carCeiling;
  ctx.fillRect(0, 0, CANVAS_W, C.ceilingY);

  // Ceiling detail — panel lines
  ctx.strokeStyle = P.dark;
  ctx.lineWidth = 0.5;
  for (let x = 100; x < CANVAS_W; x += 200) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, C.ceilingY);
    ctx.stroke();
  }

  // ── Ceiling lights ──
  const flickerRate = loopCount > 7 ? 0.03 : 0;
  for (let x = 200; x < CANVAS_W; x += 300) {
    const flicker = flickerRate > 0 && Math.random() < flickerRate ? 0.3 : 1;
    // Light fixture
    ctx.fillStyle = P.mid;
    ctx.fillRect(x - 20, C.ceilingY - 4, 40, 4);
    // Glow
    const grd = ctx.createRadialGradient(x, C.ceilingY, 0, x, C.ceilingY, 120);
    grd.addColorStop(0, `rgba(200,195,185,${0.04 * flicker})`);
    grd.addColorStop(1, 'rgba(200,195,185,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(x - 120, C.ceilingY, 240, 200);
  }

  // ── Floor ──
  ctx.fillStyle = P.carFloor;
  ctx.fillRect(0, C.floorY, CANVAS_W, CANVAS_H - C.floorY);

  // Floor line
  ctx.strokeStyle = P.mid;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, C.floorY);
  ctx.lineTo(CANVAS_W, C.floorY);
  ctx.stroke();

  // Aisle floor detail
  ctx.fillStyle = `rgba(26,23,19,0.3)`;
  ctx.fillRect(CANVAS_W * 0.4, C.floorY, CANVAS_W * 0.2, CANVAS_H - C.floorY);

  // ── Windows ──
  _drawWindows(ctx, carIndex, loopCount, gameState);

  // ── Seats ──
  _drawSeats(ctx, carIndex);

  // ── Luggage rack ──
  ctx.strokeStyle = P.mid;
  ctx.lineWidth = 1;
  // Left side rack
  ctx.beginPath();
  ctx.moveTo(C.wallLeft + 10, C.ceilingY + 15);
  ctx.lineTo(CANVAS_W * 0.35, C.ceilingY + 15);
  ctx.stroke();
  // Right side rack
  ctx.beginPath();
  ctx.moveTo(CANVAS_W * 0.65, C.ceilingY + 15);
  ctx.lineTo(C.wallRight - 10, C.ceilingY + 15);
  ctx.stroke();

  // ── Walls (side edges) ──
  ctx.fillStyle = P.dark;
  ctx.fillRect(0, 0, C.wallLeft - 20, CANVAS_H);
  ctx.fillRect(C.wallRight + 20, 0, CANVAS_W - C.wallRight - 20, CANVAS_H);

  // ── Doors ──
  _drawDoors(ctx, carIndex);
}

// ── Windows ──

function _drawWindows(ctx, carIndex, loopCount, gameState) {
  const P = PALETTE;
  const C = CARS;
  const winW = C.windowWidth;
  const winH = C.windowBottom - C.windowTop;

  // Left-side windows
  const leftStartX = C.wallLeft + 30;
  for (let i = 0; i < 2; i++) {
    const wx = leftStartX + i * (winW + C.windowGap);
    _drawSingleWindow(ctx, wx, C.windowTop, winW, winH, carIndex, loopCount, gameState);
  }

  // Right-side windows
  const rightStartX = CANVAS_W * 0.6;
  for (let i = 0; i < 2; i++) {
    const wx = rightStartX + i * (winW + C.windowGap);
    _drawSingleWindow(ctx, wx, C.windowTop, winW, winH, carIndex, loopCount, gameState);
  }
}

function _drawSingleWindow(ctx, x, y, w, h, carIndex, loopCount, gameState) {
  const P = PALETTE;

  // Window glass — dark with landscape
  ctx.fillStyle = P.window;
  ctx.fillRect(x, y, w, h);

  // Landscape through window
  _drawWindowLandscape(ctx, x, y, w, h, loopCount, gameState);

  // Window frame
  ctx.strokeStyle = P.windowFrame;
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);

  // Cross frame
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x + w / 2, y);
  ctx.lineTo(x + w / 2, y + h);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y + h * 0.55);
  ctx.lineTo(x + w, y + h * 0.55);
  ctx.stroke();
}

function _drawWindowLandscape(ctx, x, y, w, h, loopCount, gameState) {
  const P = PALETTE;

  ctx.save();
  ctx.beginPath();
  ctx.rect(x + 1, y + 1, w - 2, h - 2);
  ctx.clip();

  // Sky gradient
  const skyGrad = ctx.createLinearGradient(x, y, x, y + h * 0.55);
  skyGrad.addColorStop(0, '#0e0d0b');
  skyGrad.addColorStop(1, '#1a1713');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(x, y, w, h * 0.55);

  // Ground
  ctx.fillStyle = '#0e0d0b';
  ctx.fillRect(x, y + h * 0.55, w, h * 0.45);

  // Ground line
  ctx.strokeStyle = '#2a2622';
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(x, y + h * 0.55);
  ctx.lineTo(x + w, y + h * 0.55);
  ctx.stroke();

  // Power lines (early loops)
  if (loopCount < 8) {
    ctx.strokeStyle = '#2a2622';
    ctx.lineWidth = 0.5;
    const lineY = y + h * 0.25;
    ctx.beginPath();
    ctx.moveTo(x, lineY);
    ctx.lineTo(x + w, lineY);
    ctx.stroke();
    // Pole
    const poleX = x + w * 0.7;
    ctx.beginPath();
    ctx.moveTo(poleX, lineY - 5);
    ctx.lineTo(poleX, y + h * 0.55);
    ctx.stroke();
  }

  // Late game: wrong landscape
  if (loopCount >= 8 && gameState) {
    // Field of seats
    ctx.fillStyle = '#1a1713';
    const groundY = y + h * 0.55;
    for (let sx = x + 10; sx < x + w; sx += 12) {
      const seatH = 4 + Math.sin(sx * 0.1) * 2;
      ctx.fillRect(sx, groundY - seatH, 3, seatH);
    }
  }

  // Distant structure (always present, never closer)
  if (loopCount < 10) {
    ctx.fillStyle = '#1a1713';
    ctx.fillRect(x + w * 0.2, y + h * 0.35, 15, h * 0.2);
    ctx.fillRect(x + w * 0.22, y + h * 0.32, 11, 3);
  }

  // Flash of red after self-throw
  if (gameState && gameState.selfThrowCount > 0 && Math.random() < 0.005) {
    ctx.fillStyle = `rgba(106,16,16,0.15)`;
    ctx.fillRect(x, y, w, h);
  }

  ctx.restore();
}

// ── Seats ──

function _drawSeats(ctx, carIndex) {
  const P = PALETTE;
  const C = CARS;
  const floorY = C.floorY;

  // Left bank of seats (facing right)
  const leftSeats = [
    C.wallLeft + 50,
    C.wallLeft + 50 + 120,
    C.wallLeft + 50 + 240,
  ];

  for (const sx of leftSeats) {
    _drawSeat(ctx, sx, floorY, 1);
  }

  // Right bank of seats (facing left)
  const rightSeats = [
    CANVAS_W * 0.6 + 20,
    CANVAS_W * 0.6 + 140,
    CANVAS_W * 0.6 + 260,
  ];

  for (const sx of rightSeats) {
    _drawSeat(ctx, sx, floorY, -1);
  }
}

function _drawSeat(ctx, x, floorY, facing) {
  const P = PALETTE;
  const seatW = CARS.seatWidth;
  const seatH = CARS.seatHeight;
  const backH = CARS.seatBackH;

  // Seat base
  ctx.fillStyle = P.seat;
  ctx.fillRect(x, floorY - seatH, seatW, seatH);

  // Seat top cushion
  ctx.fillStyle = P.seatTop;
  ctx.fillRect(x, floorY - seatH, seatW, 6);

  // Seat back
  const backX = facing > 0 ? x : x + seatW - 6;
  ctx.fillStyle = P.seat;
  ctx.fillRect(backX, floorY - seatH - backH + 10, 6, backH);

  // Seat back top
  ctx.fillStyle = P.seatTop;
  ctx.fillRect(backX - 1, floorY - seatH - backH + 10, 8, 4);
}

// ── Doors ──

function _drawDoors(ctx, carIndex) {
  const P = PALETTE;
  const C = CARS;

  // Left door (to previous car, or wall if Car 1)
  _drawDoor(ctx, 10, C.doorTop, C.doorWidth, C.floorY - C.doorTop, carIndex > 0);

  // Right door (to next car, or sealed car door if Car 5)
  const isSealed = carIndex === 4; // Car 5 (index 4) — right door is sealed car
  _drawDoor(ctx, CANVAS_W - C.doorWidth - 10, C.doorTop, C.doorWidth, C.floorY - C.doorTop, true, isSealed);
}

function _drawDoor(ctx, x, y, w, h, hasHandle = true, isSealed = false) {
  const P = PALETTE;

  // Door frame
  ctx.fillStyle = P.doorFrame;
  ctx.fillRect(x - 3, y - 3, w + 6, h + 6);

  // Door
  ctx.fillStyle = isSealed ? '#1a1713' : P.door;
  ctx.fillRect(x, y, w, h);

  // Door panels
  ctx.strokeStyle = P.mid;
  ctx.lineWidth = 0.5;
  ctx.strokeRect(x + 6, y + 10, w - 12, h * 0.35);
  ctx.strokeRect(x + 6, y + h * 0.45, w - 12, h * 0.35);

  // Handle
  if (hasHandle && !isSealed) {
    ctx.fillStyle = P.light;
    ctx.fillRect(x + w - 14, y + h * 0.45, 6, 12);
  }

  // Sealed car visual — no handle, warm tint
  if (isSealed) {
    // Subtle warmth
    ctx.fillStyle = 'rgba(160,80,40,0.03)';
    ctx.fillRect(x, y, w, h);
    // Fire safety notice (illegible)
    ctx.fillStyle = P.midLight;
    ctx.fillRect(x + 8, y + h * 0.3, w - 16, 8);
    ctx.fillStyle = P.mid;
    ctx.fillRect(x + 10, y + h * 0.3 + 2, w - 20, 1);
    ctx.fillRect(x + 10, y + h * 0.3 + 5, w * 0.4, 1);
  }
}

// ─────────────────────────────────────
// Passenger silhouettes
// ─────────────────────────────────────

export function drawPassengerSilhouette(ctx, x, floorY, type, state) {
  // type: 'seated', 'standing', 'byDoor'
  // state: { highlighted, throwTier, passengerId }

  const P = PALETTE;
  const headR = 5;
  const color = state && state.highlighted ? P.lighter : P.midLight;

  ctx.fillStyle = color;

  if (type === 'seated') {
    const seatY = floorY - CARS.seatHeight;

    // Head
    ctx.beginPath();
    ctx.arc(x + 25, seatY - 30, headR, 0, Math.PI * 2);
    ctx.fill();

    // Torso (seated)
    ctx.fillRect(x + 21, seatY - 25, 8, 20);

    // Legs (bent)
    ctx.fillRect(x + 18, seatY - 5, 14, 5);

  } else if (type === 'standing') {
    const baseY = floorY;

    // Head
    ctx.beginPath();
    ctx.arc(x, baseY - 48, headR, 0, Math.PI * 2);
    ctx.fill();

    // Torso
    ctx.fillRect(x - 4, baseY - 43, 8, 20);

    // Legs
    ctx.beginPath();
    ctx.moveTo(x - 2, baseY - 23);
    ctx.lineTo(x - 5, baseY);
    ctx.moveTo(x + 2, baseY - 23);
    ctx.lineTo(x + 5, baseY);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();

  } else if (type === 'byDoor') {
    // Standing near door, slightly hunched
    const baseY = floorY;

    ctx.beginPath();
    ctx.arc(x, baseY - 45, headR, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillRect(x - 4, baseY - 40, 8, 18);

    ctx.beginPath();
    ctx.moveTo(x - 2, baseY - 22);
    ctx.lineTo(x - 4, baseY);
    ctx.moveTo(x + 2, baseY - 22);
    ctx.lineTo(x + 3, baseY);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

// ─────────────────────────────────────
// Player character
// ─────────────────────────────────────

export function drawCharacter(ctx, screenX, floorY, walking, animTime, facing) {
  const P = PALETTE;
  const C = CHAR;

  const baseY = floorY;
  const headY = baseY - C.legLen - C.torsoLen - C.headR;
  const walkCycle = walking ? Math.sin(animTime * 6) : 0;
  const bob = walking ? Math.abs(Math.sin(animTime * 12)) * 1.5 : 0;

  ctx.save();
  ctx.translate(screenX, -bob);

  // All coordinates relative to 0 since we translated to screenX
  const x = 0;

  // ── Head ──
  ctx.fillStyle = P.lightest;
  ctx.beginPath();
  ctx.arc(x, headY, C.headR, 0, Math.PI * 2);
  ctx.fill();

  // ── Torso ──
  ctx.strokeStyle = P.lightest;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(x, headY + C.headR);
  ctx.lineTo(x, headY + C.headR + C.torsoLen);
  ctx.stroke();

  // ── Arms ──
  const shoulderY = headY + C.headR + 3;
  const armSwing = walkCycle * 12;

  ctx.lineWidth = 2;
  // Left arm
  ctx.beginPath();
  ctx.moveTo(x, shoulderY);
  ctx.lineTo(x - 6, shoulderY + C.armLen + armSwing * 0.3);
  ctx.stroke();
  // Right arm
  ctx.beginPath();
  ctx.moveTo(x, shoulderY);
  ctx.lineTo(x + 6, shoulderY + C.armLen - armSwing * 0.3);
  ctx.stroke();

  // ── Legs ──
  const hipY = headY + C.headR + C.torsoLen;
  const legSwing = walkCycle * 10;

  ctx.lineWidth = 2.5;
  // Left leg
  ctx.beginPath();
  ctx.moveTo(x, hipY);
  ctx.lineTo(x - 4 + legSwing, baseY);
  ctx.stroke();
  // Right leg
  ctx.beginPath();
  ctx.moveTo(x, hipY);
  ctx.lineTo(x + 4 - legSwing, baseY);
  ctx.stroke();

  ctx.restore();
}

// ─────────────────────────────────────
// Interaction indicator
// ─────────────────────────────────────

export function drawInteractPrompt(ctx, x, y, alpha) {
  if (alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha = alpha * 0.6;
  ctx.fillStyle = PALETTE.textDim;
  ctx.font = '10px "IBM Plex Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.fillText('space', x, y - 55);
  ctx.restore();
}

// ─────────────────────────────────────
// Hallucination sequence
// ─────────────────────────────────────

const SERMON_FRAGMENTS_1 = [
  'and the mouth was opened and the mouth did not close',
  'the blood is not a punishment. the blood is the room.',
  'they were arranged in rows and the rows were the structure',
  'the flesh was not torn. the flesh was the door.',
  'and the congregation was seated and the congregation was still',
  'the sermon is not spoken. the sermon is the shape of the room.',
];

const SERMON_FRAGMENTS_2 = [
  'the ceiling is low. the ceiling is made of hands.',
  'every hand is open. every hand is facing down.',
  'the pews are not wood. the pews are the people who came before.',
  'the congregation sits on the congregation.',
  'the pulpit is a wound. the wound is speaking.',
  'the blood on the floor is warm. it has always been warm.',
  'the floor is blood the way a lake is water.',
  'the depth is not measurable. the depth is the point.',
];

const SERMON_FRAGMENTS_3 = [
  'the station was announced and the station was the wound.',
  'the conductor is the blood.',
  'there is a door at the end of the sermon.',
  'you were given a seat. the seat was always yours.',
  'the congregation does not die. the congregation accumulates.',
  'the pews get deeper. the ceiling gets lower.',
  'the hands press down. the wound speaks louder.',
];

export function drawHallucination(ctx, progress, tier, time) {
  // progress: 0-1 (how far through the hallucination)
  // tier: self-throw count (1-4+)
  // time: elapsed seconds

  const P = PALETTE;

  // Background — deep red
  const redIntensity = Math.min(progress * 1.5, 1);
  const bgR = Math.floor(lerp(10, 42, redIntensity));
  const bgG = Math.floor(lerp(9, 8, redIntensity));
  const bgB = Math.floor(lerp(8, 8, redIntensity));
  ctx.fillStyle = `rgb(${bgR},${bgG},${bgB})`;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Select fragments based on tier
  const fragments = tier <= 1 ? SERMON_FRAGMENTS_1
                  : tier <= 2 ? SERMON_FRAGMENTS_2
                  : SERMON_FRAGMENTS_3;

  // ── Layer 1: Structural words (large) ──
  if (progress > 0.1) {
    const structWords = ['CEILING', 'ROW', 'CONGREGATION', 'WOUND', 'SERMON', 'BLOOD'];
    ctx.font = 'bold 72px "EB Garamond", Georgia, serif';
    ctx.fillStyle = `rgba(106,16,16,${0.15 * progress})`;

    for (let i = 0; i < structWords.length; i++) {
      const wx = (CANVAS_W * 0.15) + (i % 3) * (CANVAS_W * 0.3);
      const wy = 100 + Math.floor(i / 3) * 280 + Math.sin(time * 0.3 + i) * 20;
      ctx.fillText(structWords[i], wx, wy);
    }
  }

  // ── Layer 2: Sermon text (medium, scrolling) ──
  if (progress > 0.2) {
    ctx.font = '16px "EB Garamond", Georgia, serif';
    const textAlpha = clamp(progress - 0.2, 0, 0.8);
    ctx.fillStyle = `rgba(195,191,185,${textAlpha * 0.7})`;

    const scrollOffset = time * 20;
    for (let i = 0; i < fragments.length; i++) {
      const fy = (200 + i * 60 - scrollOffset % 400 + 400) % (CANVAS_H + 100) - 50;
      const fx = 100 + Math.sin(i * 1.7 + time * 0.2) * 80;
      ctx.fillText(fragments[i], fx, fy);
    }
  }

  // ── Layer 3: Dense texture text (small) ──
  if (progress > 0.4) {
    const texWords = ['flesh', 'door', 'congregation', 'arranged', 'rows',
                      'the warm', 'the breathing', 'the seated', 'the wound',
                      'the mouth that does not close'];
    ctx.font = '10px "IBM Plex Mono", monospace';
    const texAlpha = clamp((progress - 0.4) * 2, 0, 0.4);

    const rng = new SeededRNG(Math.floor(time * 2));
    for (let i = 0; i < 60; i++) {
      const tx = rng.range(0, CANVAS_W);
      const ty = rng.range(0, CANVAS_H);
      const word = texWords[rng.int(0, texWords.length - 1)];
      ctx.fillStyle = `rgba(138,24,24,${texAlpha})`;
      ctx.fillText(word, tx, ty);
    }
  }

  // ── Seated figures (silhouettes made of text) ──
  if (progress > 0.5 && tier >= 2) {
    _drawTextFigures(ctx, progress, time);
  }

  // ── Central wound/pulpit ──
  if (progress > 0.6 && tier >= 3) {
    const cx = CANVAS_W / 2;
    const cy = CANVAS_H / 2;
    const woundAlpha = clamp((progress - 0.6) * 2.5, 0, 1);

    // Radiating glow
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 200);
    grad.addColorStop(0, `rgba(170,32,32,${woundAlpha * 0.3})`);
    grad.addColorStop(0.5, `rgba(106,16,16,${woundAlpha * 0.15})`);
    grad.addColorStop(1, 'rgba(42,8,8,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(cx - 200, cy - 200, 400, 400);

    // Wound shape
    ctx.fillStyle = `rgba(170,32,32,${woundAlpha * 0.6})`;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 30 + Math.sin(time) * 5, 60 + Math.cos(time * 0.7) * 10, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // ── Vignette ──
  const vigGrad = ctx.createRadialGradient(
    CANVAS_W / 2, CANVAS_H / 2, CANVAS_W * 0.2,
    CANVAS_W / 2, CANVAS_H / 2, CANVAS_W * 0.7
  );
  vigGrad.addColorStop(0, 'rgba(0,0,0,0)');
  vigGrad.addColorStop(1, `rgba(0,0,0,${0.4 + progress * 0.3})`);
  ctx.fillStyle = vigGrad;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
}

function _drawTextFigures(ctx, progress, time) {
  const figAlpha = clamp((progress - 0.5) * 3, 0, 0.5);
  ctx.font = '8px "IBM Plex Mono", monospace';
  ctx.fillStyle = `rgba(106,16,16,${figAlpha})`;

  // Rows of seated figures built from dense text
  const rowY = [CANVAS_H * 0.7, CANVAS_H * 0.75, CANVAS_H * 0.8, CANVAS_H * 0.85];
  const word = 'seated';

  for (const ry of rowY) {
    for (let fx = 50; fx < CANVAS_W - 50; fx += 40) {
      // Head
      ctx.fillText('o', fx + 8, ry - 12);
      // Body (repeated word)
      ctx.fillText(word, fx, ry - 4);
      ctx.fillText(word, fx, ry + 4);
    }
  }
}

// ─────────────────────────────────────
// Reset transition
// ─────────────────────────────────────

export function drawResetOverlay(ctx, progress) {
  // progress: 0-1 (fade to black and back)
  const alpha = progress < 0.5
    ? progress * 2         // fade to black
    : (1 - progress) * 2;  // fade from black

  ctx.fillStyle = `rgba(10,9,8,${clamp(alpha, 0, 1)})`;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
}

// ─────────────────────────────────────
// Car transition
// ─────────────────────────────────────

export function drawCarTransition(ctx, progress) {
  ctx.fillStyle = `rgba(10,9,8,${clamp(progress * 2, 0, 1)})`;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
}

// ─────────────────────────────────────
// Title screen background
// ─────────────────────────────────────

export function drawTitleBackground(ctx) {
  ctx.fillStyle = PALETTE.black;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
}
