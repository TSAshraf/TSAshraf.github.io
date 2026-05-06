/* ═══════════════════════════════════════
   RENDERER — All canvas drawing systems
   Suburban streets & living room interior
   ═══════════════════════════════════════ */

import {
  CANVAS_W, CANVAS_H, PALETTE, PARALLAX,
  HORIZON_Y, GROUND_Y, CHAR, RAIN_BASE_COUNT
} from './config.js';
import { SeededRNG, lerp, clamp } from './utils.js';

// ─────────────────────────────────────
// Sky
// ─────────────────────────────────────

export function drawSky(ctx, distortion = 0) {
  const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H * HORIZON_Y);
  // Fade sky as distortion increases
  const alpha = 1 - distortion * 0.4;
  grad.addColorStop(0, lerpColor(PALETTE.skyTop, '#c8c8cc', distortion * 0.5));
  grad.addColorStop(0.5, lerpColor(PALETTE.skyMid, '#d0d0d4', distortion * 0.5));
  grad.addColorStop(1, lerpColor(PALETTE.skyBottom, '#d8d8da', distortion * 0.5));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
}

// ─────────────────────────────────────
// Suburban houses (far layer)
// ─────────────────────────────────────

export function drawFarHouses(ctx, cameraX, seed = 1, distortion = 0) {
  const rng = new SeededRNG(seed + 50);
  const offsetX = cameraX * PARALLAX.farHouses;
  const baseY = CANVAS_H * 0.50;

  ctx.globalAlpha = Math.max(0.15, 0.35 - distortion * 0.3);

  for (let i = 0; i < 12; i++) {
    const hx = i * 180 + rng.range(-20, 20) - offsetX;
    if (hx < -200 || hx > CANVAS_W + 200) continue;

    const hw = rng.range(50, 80);
    const hh = rng.range(40, 65);
    const roofH = rng.range(12, 22);

    // Building
    ctx.fillStyle = PALETTE.brickLight;
    ctx.fillRect(hx, baseY - hh, hw, hh);

    // Roof
    ctx.fillStyle = PALETTE.roof;
    ctx.beginPath();
    ctx.moveTo(hx - 4, baseY - hh);
    ctx.lineTo(hx + hw / 2, baseY - hh - roofH);
    ctx.lineTo(hx + hw + 4, baseY - hh);
    ctx.closePath();
    ctx.fill();

    // Chimney
    if (rng.next() > 0.4) {
      const cx = hx + hw * rng.range(0.3, 0.7);
      ctx.fillStyle = PALETTE.brick;
      ctx.fillRect(cx, baseY - hh - roofH - 8, 6, roofH + 8);
    }
  }

  ctx.globalAlpha = 1;
}

// ─────────────────────────────────────
// Suburban houses (mid layer — main street)
// ─────────────────────────────────────

export function drawHouses(ctx, cameraX, seed = 1, chapter = 1, distortion = 0) {
  const rng = new SeededRNG(seed + 100);
  const offsetX = cameraX * PARALLAX.midHouses;
  const groundLine = CANVAS_H * GROUND_Y;

  const houseCount = 8;
  const startX = 100;
  const spacing = 200;

  for (let i = 0; i < houseCount; i++) {
    const hx = startX + i * spacing - offsetX;
    if (hx < -250 || hx > CANVAS_W + 250) continue;

    const hw = rng.range(80, 120);
    const floors = rng.int(2, 3);
    const floorH = rng.range(35, 45);
    const roofH = rng.range(18, 28);
    const totalH = floors * floorH + roofH;

    // Distortion — houses become transparent, outlines only
    const houseAlpha = Math.max(0.08, 1 - distortion * 0.9);

    ctx.save();
    ctx.globalAlpha = houseAlpha;

    // Lean with distortion
    if (distortion > 0.1) {
      const lean = (distortion - 0.1) * rng.range(-0.02, 0.03);
      ctx.translate(hx + hw / 2, groundLine);
      ctx.rotate(lean);
      ctx.translate(-(hx + hw / 2), -groundLine);
    }

    // ── Main wall ──
    ctx.fillStyle = PALETTE.brick;
    ctx.fillRect(hx, groundLine - totalH + roofH, hw, floors * floorH);

    // ── Side shading ──
    ctx.fillStyle = PALETTE.brickDark;
    ctx.fillRect(hx, groundLine - totalH + roofH, 3, floors * floorH);

    // ── Roof ──
    ctx.fillStyle = PALETTE.roof;
    ctx.beginPath();
    ctx.moveTo(hx - 5, groundLine - totalH + roofH);
    ctx.lineTo(hx + hw / 2, groundLine - totalH);
    ctx.lineTo(hx + hw + 5, groundLine - totalH + roofH);
    ctx.closePath();
    ctx.fill();

    // Roof ridge
    ctx.strokeStyle = PALETTE.roofTile;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(hx + hw * 0.2, groundLine - totalH + roofH * 0.4);
    ctx.lineTo(hx + hw * 0.8, groundLine - totalH + roofH * 0.4);
    ctx.stroke();

    // ── Chimney ──
    if (rng.next() > 0.3) {
      const cx = hx + hw * rng.range(0.3, 0.6);
      ctx.fillStyle = PALETTE.brick;
      ctx.fillRect(cx, groundLine - totalH - 6, 7, roofH + 6);
      // Chimney pot
      ctx.fillStyle = PALETTE.brickDark;
      ctx.fillRect(cx - 1, groundLine - totalH - 8, 9, 3);
    }

    // ── Windows ──
    for (let f = 0; f < floors; f++) {
      const fy = groundLine - (f + 1) * floorH + roofH;
      const winCount = rng.int(2, 3);

      for (let w = 0; w < winCount; w++) {
        const wx = hx + 10 + w * (hw / winCount);
        const wy = fy + 8;
        const ww = rng.range(14, 20);
        const wh = rng.range(18, 24);

        // Window recess
        ctx.fillStyle = PALETTE.window;
        ctx.fillRect(wx, wy, ww, wh);

        // Frame
        ctx.strokeStyle = PALETTE.windowFrame;
        ctx.lineWidth = 1;
        ctx.strokeRect(wx, wy, ww, wh);

        // Sash
        ctx.beginPath();
        ctx.moveTo(wx + ww / 2, wy);
        ctx.lineTo(wx + ww / 2, wy + wh);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(wx, wy + wh * 0.45);
        ctx.lineTo(wx + ww, wy + wh * 0.45);
        ctx.stroke();

        // Lamp glow in windows (warm amber!)
        if (chapter >= 4 && distortion < 0.7) {
          ctx.fillStyle = PALETTE.lampGlow;
          ctx.fillRect(wx + 1, wy + 1, ww - 2, wh - 2);
        }
      }
    }

    // ── Door ──
    const doorX = hx + hw * rng.range(0.3, 0.5);
    const doorW = 16;
    const doorH = floorH - 6;
    ctx.fillStyle = PALETTE.door;
    ctx.fillRect(doorX, groundLine - doorH, doorW, doorH);
    // Door frame
    ctx.strokeStyle = PALETTE.windowFrame;
    ctx.lineWidth = 0.8;
    ctx.strokeRect(doorX, groundLine - doorH, doorW, doorH);

    // ── Front garden ──
    // Low wall
    const wallH = rng.range(12, 18);
    ctx.fillStyle = PALETTE.brick;
    ctx.fillRect(hx - 15, groundLine - wallH, 12, wallH);
    ctx.fillRect(hx + hw + 3, groundLine - wallH, 12, wallH);

    // Fence/hedge between walls
    if (rng.next() > 0.5) {
      ctx.fillStyle = PALETTE.hedge;
      const hedgeH = rng.range(18, 28);
      ctx.fillRect(hx - 15, groundLine - hedgeH, hw + 30, hedgeH * 0.4);
      // Hedge top (rough)
      for (let hj = 0; hj < hw + 30; hj += 6) {
        const bh = rng.range(3, 8);
        ctx.fillRect(hx - 15 + hj, groundLine - hedgeH - bh * 0.3, 5, bh);
      }
    }

    // Path to door
    ctx.fillStyle = PALETTE.path;
    ctx.fillRect(doorX + 2, groundLine, doorW - 4, 8);

    ctx.restore();
  }
}

// ─────────────────────────────────────
// Trees (street trees / garden trees)
// ─────────────────────────────────────

export function drawTrees(ctx, cameraX, layer, seed = 1, distortion = 0) {
  const rng = new SeededRNG(seed + 200 + layer * 50);
  const parallax = layer === 0 ? PARALLAX.midHouses : PARALLAX.nearTrees;
  const offsetX = cameraX * parallax;
  const groundLine = CANVAS_H * GROUND_Y;

  const count = layer === 0 ? 6 : 4;
  const spacing = layer === 0 ? 350 : 500;
  const startX = layer === 0 ? 50 : 150;

  const alpha = Math.max(0.1, 1 - distortion * 0.7);
  ctx.globalAlpha = alpha;

  for (let i = 0; i < count; i++) {
    const tx = startX + i * spacing + rng.range(-40, 40) - offsetX;
    if (tx < -100 || tx > CANVAS_W + 100) continue;

    const trunkH = rng.range(50, 80);
    const trunkW = rng.range(3, 6);
    const canopyR = rng.range(20, 40);

    // Trunk
    ctx.fillStyle = PALETTE.brickDark;
    ctx.fillRect(tx - trunkW / 2, groundLine - trunkH, trunkW, trunkH);

    // Canopy (bare winter branches)
    ctx.strokeStyle = PALETTE.mid;
    ctx.lineWidth = layer === 0 ? 0.8 : 1.2;

    const branches = rng.int(4, 7);
    for (let b = 0; b < branches; b++) {
      const angle = rng.range(-Math.PI * 0.8, -Math.PI * 0.2);
      const len = rng.range(canopyR * 0.5, canopyR);
      const startY = groundLine - trunkH + rng.range(0, trunkH * 0.3);

      ctx.beginPath();
      ctx.moveTo(tx, startY);

      // Main branch
      const endX = tx + Math.cos(angle) * len;
      const endY = startY + Math.sin(angle) * len;
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // Sub-branches
      if (rng.next() > 0.3) {
        const subAngle = angle + rng.range(-0.4, 0.4);
        const subLen = len * rng.range(0.3, 0.5);
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX + Math.cos(subAngle) * subLen, endY + Math.sin(subAngle) * subLen);
        ctx.stroke();
      }
    }
  }

  ctx.globalAlpha = 1;
}

// ─────────────────────────────────────
// Lampposts (street lamps — thematic!)
// ─────────────────────────────────────

export function drawLampposts(ctx, cameraX, seed = 1, distortion = 0) {
  const rng = new SeededRNG(seed + 300);
  const offsetX = cameraX * PARALLAX.midHouses;
  const groundLine = CANVAS_H * GROUND_Y;

  const count = 5;
  const spacing = 380;

  for (let i = 0; i < count; i++) {
    const lx = 250 + i * spacing + rng.range(-10, 10) - offsetX;
    if (lx < -50 || lx > CANVAS_W + 50) continue;

    const postH = 70;

    // Post
    ctx.strokeStyle = PALETTE.mid;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(lx, groundLine);
    ctx.lineTo(lx, groundLine - postH);
    ctx.stroke();

    // Arm
    ctx.beginPath();
    ctx.moveTo(lx, groundLine - postH);
    ctx.quadraticCurveTo(lx + 10, groundLine - postH - 5, lx + 15, groundLine - postH + 2);
    ctx.stroke();

    // Lamp housing
    ctx.fillStyle = PALETTE.mid;
    ctx.fillRect(lx + 11, groundLine - postH, 8, 6);

    // Glow (warm amber — foreshadowing the living room lamp)
    if (distortion < 0.6) {
      const glowR = 25 + distortion * 15;
      const grad = ctx.createRadialGradient(
        lx + 15, groundLine - postH + 3, 2,
        lx + 15, groundLine - postH + 3, glowR
      );
      grad.addColorStop(0, 'rgba(220,190,130,0.12)');
      grad.addColorStop(0.5, 'rgba(220,190,130,0.04)');
      grad.addColorStop(1, 'rgba(220,190,130,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(lx + 15 - glowR, groundLine - postH + 3 - glowR, glowR * 2, glowR * 2);
    }
  }
}

// ─────────────────────────────────────
// Ground / pavement / road
// ─────────────────────────────────────

export function drawGround(ctx, cameraX, distortion = 0) {
  const groundY = CANVAS_H * GROUND_Y;
  const alpha = Math.max(0.2, 1 - distortion * 0.5);

  ctx.globalAlpha = alpha;

  // Pavement
  ctx.fillStyle = PALETTE.pavement;
  ctx.fillRect(0, groundY, CANVAS_W, 20);

  // Kerb
  ctx.fillStyle = PALETTE.kerb;
  ctx.fillRect(0, groundY + 18, CANVAS_W, 4);

  // Road
  ctx.fillStyle = PALETTE.road;
  ctx.fillRect(0, groundY + 22, CANVAS_W, CANVAS_H - groundY - 22);

  // Road markings
  ctx.strokeStyle = PALETTE.pavement;
  ctx.lineWidth = 1;
  ctx.setLineDash([20, 30]);
  ctx.beginPath();
  ctx.moveTo(0, groundY + 55);
  ctx.lineTo(CANVAS_W, groundY + 55);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.globalAlpha = 1;
}

// ─────────────────────────────────────
// Living room interior
// ─────────────────────────────────────

export function drawInterior(ctx, chapter = 1, distortion = 0, lampWrong = 0, time = 0) {
  const w = CANVAS_W;
  const h = CANVAS_H;

  // Room dimensions
  const roomL = w * 0.08;
  const roomR = w * 0.92;
  const roomT = h * 0.10;
  const roomB = h * 0.80;
  const roomW = roomR - roomL;
  const roomH = roomB - roomT;

  // ── Background (outside the room — void) ──
  ctx.fillStyle = PALETTE.nightBg;
  ctx.fillRect(0, 0, w, h);

  // ── Room alpha (fades in later chapters) ──
  const roomAlpha = Math.max(0.15, 1 - distortion * 0.6);

  ctx.save();
  ctx.globalAlpha = roomAlpha;

  // ── Ceiling ──
  ctx.fillStyle = PALETTE.ceiling;
  ctx.fillRect(roomL, roomT, roomW, 8);

  // ── Walls ──
  const wallGrad = ctx.createLinearGradient(roomL, roomT, roomL, roomB);
  wallGrad.addColorStop(0, PALETTE.wallLight);
  wallGrad.addColorStop(0.6, PALETTE.wallMid);
  wallGrad.addColorStop(1, lerpColor(PALETTE.wallMid, PALETTE.nightWall, distortion * 0.5));
  ctx.fillStyle = wallGrad;
  ctx.fillRect(roomL, roomT + 8, roomW, roomH - 8);

  // ── Floor ──
  const floorGrad = ctx.createLinearGradient(roomL, roomB, roomL, h);
  floorGrad.addColorStop(0, PALETTE.floorWood);
  floorGrad.addColorStop(1, PALETTE.nightFloor);
  ctx.fillStyle = floorGrad;
  ctx.fillRect(roomL, roomB, roomW, h - roomB);

  // ── Skirting board ──
  ctx.fillStyle = PALETTE.skirting;
  ctx.fillRect(roomL, roomB - 6, roomW, 6);

  // ── Left wall edge (depth) ──
  ctx.fillStyle = PALETTE.brickDark;
  ctx.fillRect(roomL, roomT, 4, roomH + (h - roomB));

  // ── Right wall edge ──
  ctx.fillStyle = PALETTE.brickDark;
  ctx.fillRect(roomR - 4, roomT, 4, roomH + (h - roomB));

  ctx.restore();

  // ── Window (left side) ──
  const winX = roomL + roomW * 0.12;
  const winY = roomT + roomH * 0.15;
  const winW = roomW * 0.15;
  const winH = roomH * 0.45;

  ctx.save();
  ctx.globalAlpha = roomAlpha;

  // Window opening
  ctx.fillStyle = lerpColor('#4a5058', '#2a2a2e', distortion);
  ctx.fillRect(winX, winY, winW, winH);

  // Window frame
  ctx.strokeStyle = PALETTE.windowFrame;
  ctx.lineWidth = 2;
  ctx.strokeRect(winX, winY, winW, winH);

  // Sash
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(winX + winW / 2, winY);
  ctx.lineTo(winX + winW / 2, winY + winH);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(winX, winY + winH * 0.45);
  ctx.lineTo(winX + winW, winY + winH * 0.45);
  ctx.stroke();

  // Curtains
  ctx.fillStyle = PALETTE.fabricMid;
  ctx.fillRect(winX - 8, winY - 5, 12, winH + 10);
  ctx.fillRect(winX + winW - 4, winY - 5, 12, winH + 10);

  ctx.restore();

  // ── Bookshelf (left of window) ──
  ctx.save();
  ctx.globalAlpha = roomAlpha * 0.9;
  const shelfX = winX + winW + roomW * 0.05;
  const shelfY = roomT + roomH * 0.20;
  const shelfW = roomW * 0.10;
  const shelfH = roomH * 0.55;

  // Frame
  ctx.fillStyle = PALETTE.shelf;
  ctx.fillRect(shelfX, shelfY, shelfW, shelfH);
  ctx.strokeStyle = PALETTE.furniture;
  ctx.lineWidth = 1;
  ctx.strokeRect(shelfX, shelfY, shelfW, shelfH);

  // Shelf rows
  const shelfRows = 4;
  for (let s = 0; s < shelfRows; s++) {
    const sy = shelfY + (s + 1) * (shelfH / (shelfRows + 1));
    ctx.fillStyle = PALETTE.furniture;
    ctx.fillRect(shelfX, sy, shelfW, 2);

    // Books
    const bookCount = 5 + (s * 2);
    const bookW = (shelfW - 4) / bookCount;
    for (let b = 0; b < bookCount; b++) {
      const bh = 10 + Math.sin(b * 1.7 + s) * 4;
      ctx.fillStyle = lerpColor(PALETTE.book, PALETTE.mid, Math.sin(b * 2.3 + s) * 0.3 + 0.3);
      ctx.fillRect(shelfX + 2 + b * bookW, sy - bh, bookW - 1, bh);
    }
  }
  ctx.restore();

  // ── Sofa (center-right) ──
  ctx.save();
  ctx.globalAlpha = roomAlpha;
  const sofaX = roomL + roomW * 0.48;
  const sofaY = roomB - roomH * 0.28;
  const sofaW = roomW * 0.22;
  const sofaH = roomH * 0.16;

  // Back
  ctx.fillStyle = PALETTE.fabricDark;
  ctx.fillRect(sofaX, sofaY - sofaH * 0.4, sofaW, sofaH * 0.4);
  // Seat
  ctx.fillStyle = PALETTE.fabricMid;
  ctx.fillRect(sofaX, sofaY, sofaW, sofaH);
  // Arm rests
  ctx.fillStyle = PALETTE.fabricDark;
  ctx.fillRect(sofaX - 6, sofaY - sofaH * 0.2, 8, sofaH + sofaH * 0.2);
  ctx.fillRect(sofaX + sofaW - 2, sofaY - sofaH * 0.2, 8, sofaH + sofaH * 0.2);
  ctx.restore();

  // ── Armchair (right side) ──
  ctx.save();
  ctx.globalAlpha = roomAlpha;
  const chairX = roomL + roomW * 0.73;
  const chairY = roomB - roomH * 0.22;
  const chairW = roomW * 0.10;
  const chairH = roomH * 0.12;

  ctx.fillStyle = PALETTE.fabricDark;
  ctx.fillRect(chairX, chairY - chairH * 0.5, chairW, chairH * 0.5);
  ctx.fillStyle = PALETTE.fabricMid;
  ctx.fillRect(chairX, chairY, chairW, chairH);
  ctx.fillStyle = PALETTE.fabricDark;
  ctx.fillRect(chairX - 4, chairY - chairH * 0.3, 6, chairH + chairH * 0.3);
  ctx.fillRect(chairX + chairW - 2, chairY - chairH * 0.3, 6, chairH + chairH * 0.3);
  ctx.restore();

  // ── Coffee table ──
  ctx.save();
  ctx.globalAlpha = roomAlpha * 0.8;
  const tableX = roomL + roomW * 0.52;
  const tableY = roomB - roomH * 0.10;
  const tableW = roomW * 0.14;

  ctx.fillStyle = PALETTE.shelf;
  ctx.fillRect(tableX, tableY, tableW, 3);
  ctx.fillRect(tableX + 4, tableY + 3, 3, 12);
  ctx.fillRect(tableX + tableW - 7, tableY + 3, 3, 12);
  ctx.restore();

  // ── Side table (for the lamp) ──
  const lampTableX = roomL + roomW * 0.85;
  const lampTableY = roomB - roomH * 0.15;
  const lampTableW = roomW * 0.06;

  ctx.save();
  ctx.globalAlpha = roomAlpha * 0.9;
  ctx.fillStyle = PALETTE.shelf;
  ctx.fillRect(lampTableX, lampTableY, lampTableW, 3);
  ctx.fillRect(lampTableX + 3, lampTableY + 3, 2, 16);
  ctx.fillRect(lampTableX + lampTableW - 5, lampTableY + 3, 2, 16);
  ctx.restore();

  // ═══════════════════════════════════
  // THE LAMP — the only warm thing
  // ═══════════════════════════════════

  const lampX = lampTableX + lampTableW / 2;
  const lampBaseY = lampTableY;
  const lampH = roomH * 0.35;
  const lampTopY = lampBaseY - lampH;
  const shadeW = roomW * 0.06;
  const shadeH = lampH * 0.28;

  // ── Lamp glow (the warm light that fills the room) ──
  // This glow intentionally doesn't create a proper shadow behind the lamp
  const glowRadius = 180 + lampWrong * 80;
  const glowStrength = 0.06 + lampWrong * 0.08;

  // Main glow on ceiling/wall
  const ceilGrad = ctx.createRadialGradient(
    lampX, lampTopY + shadeH / 2, 5,
    lampX, lampTopY + shadeH / 2, glowRadius
  );
  ceilGrad.addColorStop(0, `rgba(220,190,130,${glowStrength * 2})`);
  ceilGrad.addColorStop(0.3, `rgba(220,190,130,${glowStrength})`);
  ceilGrad.addColorStop(0.7, `rgba(220,190,130,${glowStrength * 0.3})`);
  ceilGrad.addColorStop(1, 'rgba(220,190,130,0)');
  ctx.fillStyle = ceilGrad;
  ctx.fillRect(0, 0, w, h);

  // The "wrong" light — in later chapters, the glow bleeds evenly
  // where shadows should fall
  if (lampWrong > 0.1) {
    const wrongGlow = ctx.createRadialGradient(
      lampX + 20, lampTopY, 30,
      lampX + 20, lampTopY, glowRadius * 1.3
    );
    wrongGlow.addColorStop(0, `rgba(220,190,130,${lampWrong * 0.06})`);
    wrongGlow.addColorStop(1, 'rgba(220,190,130,0)');
    ctx.fillStyle = wrongGlow;
    ctx.fillRect(0, 0, w, h);
  }

  // ── Lamp stem ──
  ctx.strokeStyle = PALETTE.lampBase;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(lampX, lampBaseY);
  ctx.lineTo(lampX, lampTopY + shadeH);
  ctx.stroke();

  // ── Lamp base ──
  ctx.fillStyle = PALETTE.lampBase;
  ctx.beginPath();
  ctx.ellipse(lampX, lampBaseY, 10, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // ── Lamp shade ──
  ctx.fillStyle = PALETTE.lampShade;
  ctx.beginPath();
  ctx.moveTo(lampX - shadeW * 0.3, lampTopY);
  ctx.lineTo(lampX - shadeW * 0.5, lampTopY + shadeH);
  ctx.lineTo(lampX + shadeW * 0.5, lampTopY + shadeH);
  ctx.lineTo(lampX + shadeW * 0.3, lampTopY);
  ctx.closePath();
  ctx.fill();

  // Shade edge highlight
  ctx.strokeStyle = PALETTE.lampWarm;
  ctx.lineWidth = 0.5;
  ctx.stroke();

  // ── Bulb glow (inside shade) ──
  const bulbGrad = ctx.createRadialGradient(
    lampX, lampTopY + shadeH * 0.5, 2,
    lampX, lampTopY + shadeH * 0.5, shadeW * 0.4
  );
  bulbGrad.addColorStop(0, PALETTE.lampBulb);
  bulbGrad.addColorStop(0.5, `rgba(232,216,168,${0.3 + lampWrong * 0.3})`);
  bulbGrad.addColorStop(1, 'rgba(232,216,168,0)');
  ctx.fillStyle = bulbGrad;
  ctx.beginPath();
  ctx.ellipse(lampX, lampTopY + shadeH * 0.5, shadeW * 0.35, shadeH * 0.4, 0, 0, Math.PI * 2);
  ctx.fill();

  // ── Lamp flicker in later chapters ──
  if (lampWrong > 0.3) {
    const flicker = Math.sin(time * 3.7) * 0.5 + Math.sin(time * 7.3) * 0.3;
    if (flicker > 0.6) {
      const flickGrad = ctx.createRadialGradient(
        lampX, lampTopY + shadeH * 0.5, 1,
        lampX, lampTopY + shadeH * 0.5, glowRadius * 0.5
      );
      flickGrad.addColorStop(0, `rgba(240,210,140,${lampWrong * 0.08})`);
      flickGrad.addColorStop(1, 'rgba(240,210,140,0)');
      ctx.fillStyle = flickGrad;
      ctx.fillRect(0, 0, w, h);
    }
  }

  // ── Rug ──
  ctx.save();
  ctx.globalAlpha = roomAlpha * 0.5;
  const rugX = roomL + roomW * 0.40;
  const rugW = roomW * 0.25;
  ctx.fillStyle = PALETTE.fabricDark;
  ctx.fillRect(rugX, roomB + 2, rugW, 8);
  ctx.restore();

  // ── People silhouettes ──
  drawPeople(ctx, chapter, roomL, roomR, roomT, roomB, roomW, roomH, roomAlpha, sofaX, sofaY, sofaW, time);
}

// ─────────────────────────────────────
// People silhouettes in the interior
// ─────────────────────────────────────

function drawPeople(ctx, chapter, roomL, roomR, roomT, roomB, roomW, roomH, alpha, sofaX, sofaY, sofaW, time) {
  ctx.save();
  ctx.globalAlpha = Math.max(0.1, alpha * 0.8);
  ctx.fillStyle = PALETTE.dark;

  // Wife on sofa (chapters 1-6)
  if (chapter <= 6) {
    const px = sofaX + sofaW * 0.4;
    const py = sofaY - 5;

    // Body
    ctx.fillRect(px - 5, py - 25, 10, 25);
    // Head
    ctx.beginPath();
    ctx.arc(px, py - 30, 6, 0, Math.PI * 2);
    ctx.fill();

    // Book in hands (chapters 1-3)
    if (chapter <= 3) {
      ctx.fillStyle = PALETTE.mid;
      ctx.fillRect(px + 5, py - 18, 6, 8);
      ctx.fillStyle = PALETTE.dark;
    }
  }

  // Child on floor (chapters 2, 5, 7)
  if (chapter === 2 || chapter === 5 || chapter === 7) {
    const cx = roomL + roomW * 0.55;
    const cy = roomB - 5;

    // Sitting body
    ctx.fillRect(cx - 4, cy - 18, 8, 18);
    // Head
    ctx.beginPath();
    ctx.arc(cx, cy - 22, 5, 0, Math.PI * 2);
    ctx.fill();

    // Drawing materials
    ctx.fillStyle = PALETTE.light;
    ctx.fillRect(cx + 8, cy - 4, 12, 8);
    ctx.fillStyle = PALETTE.dark;
  }

  // Chapter 7: both looking at you
  if (chapter === 7) {
    // Reposition wife — she's closer, facing forward
    const px = sofaX + sofaW * 0.5;
    const py = sofaY - 5;

    // Eyes (two dots of light — the last detail)
    ctx.fillStyle = PALETTE.textLight;
    ctx.fillRect(px - 3, py - 31, 2, 2);
    ctx.fillRect(px + 1, py - 31, 2, 2);
  }

  ctx.restore();
}

// ─────────────────────────────────────
// Character (walking figure)
// ─────────────────────────────────────

export function drawCharacter(ctx, x, y, walking, anim, facing) {
  ctx.save();
  ctx.translate(x, y);
  if (facing < 0) ctx.scale(-1, 1);

  ctx.strokeStyle = PALETTE.dark;
  ctx.fillStyle = PALETTE.dark;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';

  const walk = walking ? anim * 4 : 0;
  const legSwing = Math.sin(walk) * 0.35;
  const armSwing = Math.sin(walk + Math.PI) * 0.25;
  const bob = Math.abs(Math.sin(walk)) * 1.5;

  const headY = -CHAR.torsoLen - CHAR.headR - bob;

  // Head
  ctx.beginPath();
  ctx.arc(0, headY, CHAR.headR, 0, Math.PI * 2);
  ctx.fill();

  // Torso
  ctx.beginPath();
  ctx.moveTo(0, headY + CHAR.headR);
  ctx.lineTo(0, headY + CHAR.headR + CHAR.torsoLen);
  ctx.stroke();

  const hipY = headY + CHAR.headR + CHAR.torsoLen;
  const shoulderY = headY + CHAR.headR + 3;

  // Legs
  ctx.beginPath();
  ctx.moveTo(0, hipY);
  ctx.lineTo(Math.sin(legSwing) * CHAR.legLen * 0.5, hipY + CHAR.legLen);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, hipY);
  ctx.lineTo(Math.sin(-legSwing) * CHAR.legLen * 0.5, hipY + CHAR.legLen);
  ctx.stroke();

  // Arms
  ctx.beginPath();
  ctx.moveTo(0, shoulderY);
  ctx.lineTo(Math.sin(armSwing) * CHAR.armLen * 0.5, shoulderY + CHAR.armLen);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, shoulderY);
  ctx.lineTo(Math.sin(-armSwing) * CHAR.armLen * 0.5, shoulderY + CHAR.armLen);
  ctx.stroke();

  ctx.restore();
}

// ─────────────────────────────────────
// Fog / atmosphere
// ─────────────────────────────────────

export function drawFog(ctx, amount = 0.03) {
  ctx.fillStyle = `rgba(180,186,192,${amount})`;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
}

// ─────────────────────────────────────
// Rain system
// ─────────────────────────────────────

export class RainSystem {
  constructor(count = 80) {
    this.drops = [];
    for (let i = 0; i < count; i++) {
      this.drops.push(this._makeDrop());
    }
  }

  _makeDrop() {
    return {
      x: Math.random() * CANVAS_W,
      y: Math.random() * CANVAS_H,
      speed: 300 + Math.random() * 200,
      length: 8 + Math.random() * 12,
      alpha: 0.1 + Math.random() * 0.2,
    };
  }

  update(dt) {
    for (const d of this.drops) {
      d.y += d.speed * dt;
      d.x -= 20 * dt; // slight wind
      if (d.y > CANVAS_H) {
        d.y = -d.length;
        d.x = Math.random() * CANVAS_W;
      }
    }
  }

  draw(ctx) {
    ctx.strokeStyle = PALETTE.skyMid;
    ctx.lineWidth = 0.8;

    for (const d of this.drops) {
      ctx.globalAlpha = d.alpha;
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x - 2, d.y + d.length);
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
  }
}

// ─────────────────────────────────────
// Colour utilities
// ─────────────────────────────────────

function hexToRGB(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(v =>
    Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0')
  ).join('');
}

function lerpColor(hex1, hex2, t) {
  const [r1, g1, b1] = hexToRGB(hex1);
  const [r2, g2, b2] = hexToRGB(hex2);
  return rgbToHex(
    lerp(r1, r2, t),
    lerp(g1, g2, t),
    lerp(b1, b2, t)
  );
}
