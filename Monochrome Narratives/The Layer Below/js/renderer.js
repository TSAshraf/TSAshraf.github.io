/* ═══════════════════════════════════════
   RENDERER — All canvas drawing systems
   ═══════════════════════════════════════ */

import {
  CANVAS_W, CANVAS_H, PALETTE, PARALLAX,
  HORIZON_Y, GROUND_Y, CHAR, SNOW_BASE_COUNT
} from './config.js';
import { SeededRNG, lerp, clamp } from './utils.js';

// ─────────────────────────────────────
// Sky & atmosphere
// ─────────────────────────────────────

export function drawSky(ctx, palette = PALETTE, dayProgress = 0) {
  const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H * HORIZON_Y);
  grad.addColorStop(0, palette.skyTop);
  grad.addColorStop(0.5, palette.skyMid);
  grad.addColorStop(1, palette.skyBottom);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
}

export function drawNightSky(ctx) {
  const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
  grad.addColorStop(0, PALETTE.nightSkyTop);
  grad.addColorStop(0.4, PALETTE.nightSkyMid);
  grad.addColorStop(1, PALETTE.nightSkyBottom);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
}

// ─────────────────────────────────────
// Distant hills / landscape
// ─────────────────────────────────────

export function drawHills(ctx, cameraX, seed = 1) {
  const rng = new SeededRNG(seed);
  const offsetX = cameraX * PARALLAX.hills;
  const baseY = CANVAS_H * 0.52;

  ctx.fillStyle = PALETTE.skyBottom;
  ctx.beginPath();
  ctx.moveTo(-50, CANVAS_H);

  for (let x = -50; x <= CANVAS_W + 50; x += 30) {
    const wx = x + offsetX;
    const h = Math.sin(wx * 0.003) * 25
            + Math.sin(wx * 0.007 + 1.3) * 15
            + Math.sin(wx * 0.015 + rng.next() * 0.5) * 8;
    ctx.lineTo(x, baseY - h);
  }

  ctx.lineTo(CANVAS_W + 50, CANVAS_H);
  ctx.closePath();
  ctx.fill();
}

// ─────────────────────────────────────
// Terraria-style cross-section housing
// ─────────────────────────────────────

export function drawHousing(ctx, cameraX, seed = 1, day = 1, distortion = 0) {
  const rng = new SeededRNG(seed + 100);
  const offsetX = cameraX * PARALLAX.houses;
  const groundLine = CANVAS_H * GROUND_Y;

  const houseCount = 5;
  const startX = 200;
  const spacing = 280;

  for (let i = 0; i < houseCount; i++) {
    const hx = startX + i * spacing - offsetX;

    // Skip if offscreen
    if (hx < -200 || hx > CANVAS_W + 200) continue;

    const hw = rng.range(90, 130);
    const floors = rng.int(2, 3);
    const floorH = rng.range(40, 50);
    const roofH = rng.range(20, 35);
    const baseY = groundLine;
    const totalH = floors * floorH + roofH;

    // Foundation / basement (below ground)
    const basementH = rng.range(25, 40);

    // Distortion effect — houses lean toward trench on later days
    const leanAngle = distortion * rng.range(-0.02, 0.04);

    ctx.save();
    ctx.translate(hx + hw / 2, baseY);
    ctx.rotate(leanAngle);
    ctx.translate(-(hx + hw / 2), -baseY);

    // ── Basement ──
    ctx.fillStyle = PALETTE.soilDark;
    ctx.fillRect(hx, baseY, hw, basementH);

    // Basement interior detail
    ctx.strokeStyle = PALETTE.soil;
    ctx.lineWidth = 0.5;
    ctx.strokeRect(hx + 5, baseY + 5, hw - 10, basementH - 8);

    // Foundation stones
    ctx.fillStyle = PALETTE.mid;
    for (let s = 0; s < 3; s++) {
      const sx = hx + 8 + s * (hw / 3 - 4);
      ctx.fillRect(sx, baseY + basementH - 8, hw / 3 - 10, 5);
    }

    // ── Main structure ──
    // Back wall
    ctx.fillStyle = '#2a2622';
    ctx.fillRect(hx, baseY - totalH + roofH, hw, floors * floorH);

    // Side wall shading
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fillRect(hx, baseY - totalH + roofH, 4, floors * floorH);

    // ── Floors and rooms ──
    for (let f = 0; f < floors; f++) {
      const fy = baseY - (f + 1) * floorH;

      // Floor line
      ctx.strokeStyle = PALETTE.dark;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(hx, fy);
      ctx.lineTo(hx + hw, fy);
      ctx.stroke();

      // Room divider
      const divX = hx + hw * rng.range(0.35, 0.65);
      ctx.strokeStyle = PALETTE.darkest;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(divX, fy);
      ctx.lineTo(divX, fy + floorH);
      ctx.stroke();

      // Windows (exterior facing)
      const winCount = rng.int(1, 2);
      for (let w = 0; w < winCount; w++) {
        const wx = hx + 12 + w * (hw / 2 - 8);
        const wy = fy + 10;
        const ww = rng.range(14, 20);
        const wh = rng.range(16, 22);

        // Window frame
        ctx.strokeStyle = PALETTE.mid;
        ctx.lineWidth = 1;
        ctx.strokeRect(wx, wy, ww, wh);

        // Window pane
        ctx.fillStyle = day >= 5
          ? `rgba(20,18,15,${0.6 + distortion * 0.3})`
          : 'rgba(30,28,25,0.5)';
        ctx.fillRect(wx + 1, wy + 1, ww - 2, wh - 2);

        // Window sash (vertical divider)
        ctx.strokeStyle = PALETTE.mid;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(wx + ww / 2, wy);
        ctx.lineTo(wx + ww / 2, wy + wh);
        ctx.stroke();

        // Warm glow on early days
        if (day <= 4) {
          ctx.fillStyle = PALETTE.windowGlow;
          ctx.fillRect(wx - 2, wy - 2, ww + 4, wh + 4);
        }
      }

      // Furniture silhouettes (interior detail)
      ctx.fillStyle = PALETTE.darkest;

      if (f === 0) {
        // Ground floor: table and chair
        ctx.fillRect(hx + hw * 0.55, fy + floorH - 14, 18, 2);  // table top
        ctx.fillRect(hx + hw * 0.57, fy + floorH - 12, 2, 12);  // leg
        ctx.fillRect(hx + hw * 0.68, fy + floorH - 12, 2, 12);  // leg
        // Chair
        ctx.fillRect(hx + hw * 0.75, fy + floorH - 10, 8, 2);   // seat
        ctx.fillRect(hx + hw * 0.75, fy + floorH - 8, 2, 8);    // leg
        ctx.fillRect(hx + hw * 0.75, fy + floorH - 16, 2, 8);   // back
      } else if (f === 1) {
        // Upper floor: bed
        ctx.fillRect(hx + hw * 0.5, fy + floorH - 8, 22, 3);    // mattress
        ctx.fillRect(hx + hw * 0.5, fy + floorH - 5, 2, 5);     // leg
        ctx.fillRect(hx + hw * 0.5 + 20, fy + floorH - 5, 2, 5);// leg
        ctx.fillRect(hx + hw * 0.5, fy + floorH - 14, 2, 8);    // headboard
      }

      // Stairs between floors (visible through cross-section)
      if (f < floors - 1) {
        ctx.strokeStyle = PALETTE.mid;
        ctx.lineWidth = 0.8;
        const stairX = hx + hw * 0.15;
        for (let step = 0; step < 5; step++) {
          const sy = fy + floorH - step * (floorH / 5);
          ctx.beginPath();
          ctx.moveTo(stairX + step * 4, sy);
          ctx.lineTo(stairX + step * 4 + 4, sy);
          ctx.lineTo(stairX + step * 4 + 4, sy - floorH / 5);
          ctx.stroke();
        }
      }
    }

    // ── Roof ──
    ctx.fillStyle = PALETTE.dark;
    ctx.beginPath();
    ctx.moveTo(hx - 5, baseY - floors * floorH);
    ctx.lineTo(hx + hw / 2, baseY - totalH - 5);
    ctx.lineTo(hx + hw + 5, baseY - floors * floorH);
    ctx.closePath();
    ctx.fill();

    // Chimney
    if (rng.next() > 0.3) {
      const cx = hx + hw * rng.range(0.6, 0.8);
      const ch = rng.range(15, 25);
      ctx.fillStyle = PALETTE.dark;
      ctx.fillRect(cx, baseY - totalH - ch, 8, ch + 5);
      // Chimney cap
      ctx.fillRect(cx - 2, baseY - totalH - ch, 12, 3);
    }

    // ── Outer walls ──
    ctx.strokeStyle = PALETTE.darkest;
    ctx.lineWidth = 2;
    ctx.strokeRect(hx, baseY - floors * floorH, hw, floors * floorH);

    // Garden wall (low wall between houses and ground)
    ctx.fillStyle = PALETTE.dark;
    ctx.fillRect(hx - 8, baseY - 6, hw + 16, 6);

    ctx.restore();

    // ── Day-dependent distortion effects ──
    if (day >= 6) {
      // Cracks in walls on late days
      ctx.strokeStyle = `rgba(90,85,80,${distortion * 0.4})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(hx + hw * 0.3, baseY - totalH * 0.5);
      ctx.lineTo(hx + hw * 0.35, baseY - totalH * 0.3);
      ctx.lineTo(hx + hw * 0.32, baseY - totalH * 0.1);
      ctx.stroke();
    }
  }
}

// ─────────────────────────────────────
// Procedural bare winter trees
// ─────────────────────────────────────

export function drawTrees(ctx, cameraX, layer, seed = 1) {
  const rng = new SeededRNG(seed + layer * 50);
  const speed = layer === 0 ? PARALLAX.midTrees : PARALLAX.nearTrees;
  const offsetX = cameraX * speed;

  const count = layer === 0 ? 8 : 6;
  const alpha = layer === 0 ? 0.25 : 0.5;
  const scale = layer === 0 ? 0.6 : 0.85;
  const baseY = CANVAS_H * (layer === 0 ? 0.64 : GROUND_Y);

  ctx.save();
  ctx.globalAlpha = alpha;

  for (let i = 0; i < count; i++) {
    const tx = rng.range(-100, 2000) - offsetX;
    if (tx < -80 || tx > CANVAS_W + 80) continue;

    const treeRng = new SeededRNG(seed + layer * 50 + i * 13);
    drawTree(ctx, tx, baseY, scale, treeRng);
  }

  ctx.restore();
}

function drawTree(ctx, x, y, scale, rng) {
  ctx.strokeStyle = PALETTE.dark;
  ctx.lineCap = 'round';

  const trunkH = rng.range(50, 80) * scale;
  const trunkW = rng.range(3, 5) * scale;

  // Trunk
  ctx.lineWidth = trunkW;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y - trunkH);
  ctx.stroke();

  // Branches
  drawBranch(ctx, x, y - trunkH * 0.4, trunkH * 0.5, -Math.PI / 2 + rng.range(-0.3, 0.3), trunkW * 0.6, 0, rng, scale);
}

function drawBranch(ctx, x, y, len, angle, width, depth, rng, scale) {
  if (depth > 5 || len < 3) return;

  const endX = x + Math.cos(angle) * len;
  const endY = y + Math.sin(angle) * len;

  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(endX, endY);
  ctx.stroke();

  const children = depth < 2 ? rng.int(2, 3) : rng.int(1, 2);
  for (let i = 0; i < children; i++) {
    const childAngle = angle + rng.range(-0.6, 0.6);
    const childLen = len * rng.range(0.5, 0.72);
    const childWidth = width * 0.65;
    drawBranch(ctx, endX, endY, childLen, childAngle, childWidth, depth + 1, rng, scale);
  }
}

// ─────────────────────────────────────
// Ground
// ─────────────────────────────────────

export function drawGround(ctx, cameraX) {
  const y = CANVAS_H * GROUND_Y;

  // Ground fill
  ctx.fillStyle = PALETTE.ground;
  ctx.fillRect(0, y, CANVAS_W, CANVAS_H - y);

  // Ground edge
  ctx.strokeStyle = PALETTE.soil;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(CANVAS_W, y);
  ctx.stroke();

  // Grass tufts
  const rng = new SeededRNG(42);
  ctx.strokeStyle = PALETTE.mid;
  ctx.lineWidth = 0.5;
  for (let i = 0; i < 40; i++) {
    const gx = rng.range(0, CANVAS_W);
    const offsetGx = gx - (cameraX * PARALLAX.ground) % CANVAS_W;
    ctx.beginPath();
    ctx.moveTo(offsetGx, y);
    ctx.lineTo(offsetGx - 2, y - rng.range(3, 8));
    ctx.moveTo(offsetGx, y);
    ctx.lineTo(offsetGx + 2, y - rng.range(3, 6));
    ctx.stroke();
  }
}

// ─────────────────────────────────────
// Trench (archaeological excavation)
// ─────────────────────────────────────

export function drawTrench(ctx, cameraX, trenchX, day = 1, distortion = 0) {
  const offsetX = trenchX - cameraX;
  const groundY = CANVAS_H * GROUND_Y;

  const trenchW = 180 + day * 8 + distortion * 40;
  const trenchD = 60 + day * 5 + distortion * 15;
  const tx = offsetX - trenchW / 2;

  if (tx > CANVAS_W + 50 || tx + trenchW < -50) return;

  // ── Spoil heaps ──
  ctx.fillStyle = PALETTE.soil;
  // Left heap
  ctx.beginPath();
  ctx.moveTo(tx - 30, groundY);
  ctx.quadraticCurveTo(tx - 15, groundY - 18, tx - 2, groundY);
  ctx.fill();
  // Right heap
  ctx.beginPath();
  ctx.moveTo(tx + trenchW + 2, groundY);
  ctx.quadraticCurveTo(tx + trenchW + 15, groundY - 15, tx + trenchW + 30, groundY);
  ctx.fill();

  // ── Trench cut ──
  ctx.fillStyle = PALETTE.soilDark;
  ctx.fillRect(tx, groundY, trenchW, trenchD);

  // ── Stratigraphy layers ──
  const layers = [
    { color: PALETTE.soil,     h: 0.15 },
    { color: PALETTE.clay,     h: 0.2  },
    { color: PALETTE.soilDark, h: 0.25 },
    { color: PALETTE.chalk,    h: 0.15 },
    { color: PALETTE.soilDeep, h: 0.25 },
  ];

  let ly = groundY;
  for (const layer of layers) {
    const lh = trenchD * layer.h;
    ctx.fillStyle = layer.color;
    ctx.globalAlpha = 0.6;
    ctx.fillRect(tx + 2, ly, trenchW - 4, lh);

    // Layer boundary line
    ctx.strokeStyle = PALETTE.darkest;
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.moveTo(tx + 2, ly + lh);
    ctx.lineTo(tx + trenchW - 2, ly + lh);
    ctx.stroke();

    ly += lh;
  }
  ctx.globalAlpha = 1;

  // ── Trench walls (section face) ──
  ctx.strokeStyle = PALETTE.darkest;
  ctx.lineWidth = 1.5;
  // Left wall
  ctx.beginPath();
  ctx.moveTo(tx, groundY);
  ctx.lineTo(tx, groundY + trenchD);
  ctx.stroke();
  // Right wall
  ctx.beginPath();
  ctx.moveTo(tx + trenchW, groundY);
  ctx.lineTo(tx + trenchW, groundY + trenchD);
  ctx.stroke();
  // Base
  ctx.beginPath();
  ctx.moveTo(tx, groundY + trenchD);
  ctx.lineTo(tx + trenchW, groundY + trenchD);
  ctx.stroke();

  // ── Burial arrangement (visible from day 2+) ──
  if (day >= 2) {
    drawBurial(ctx, tx + trenchW / 2, groundY + trenchD - 15, day, distortion);
  }

  // ── Recording equipment ──
  // Planning frame
  ctx.strokeStyle = PALETTE.mid;
  ctx.lineWidth = 0.8;
  ctx.strokeRect(tx + 10, groundY + 5, 30, 30);
  ctx.beginPath();
  ctx.moveTo(tx + 10, groundY + 20);
  ctx.lineTo(tx + 40, groundY + 20);
  ctx.moveTo(tx + 25, groundY + 5);
  ctx.lineTo(tx + 25, groundY + 35);
  ctx.stroke();

  // Scale bar
  ctx.fillStyle = PALETTE.dark;
  ctx.fillRect(tx + trenchW - 35, groundY + trenchD - 5, 25, 2);
  ctx.fillStyle = PALETTE.light;
  ctx.fillRect(tx + trenchW - 35, groundY + trenchD - 5, 12, 2);

  // ── Distortion effects (late days) ──
  if (distortion > 0.2) {
    // Features shifting — wavering lines in the section
    ctx.strokeStyle = `rgba(90,85,80,${distortion * 0.5})`;
    ctx.lineWidth = 0.8;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      const wy = groundY + trenchD * (0.3 + i * 0.2);
      for (let wx = tx + 5; wx < tx + trenchW - 5; wx += 5) {
        const waver = Math.sin(wx * 0.05 + distortion * 3 + i) * distortion * 4;
        if (wx === tx + 5) ctx.moveTo(wx, wy + waver);
        else ctx.lineTo(wx, wy + waver);
      }
      ctx.stroke();
    }
  }
}

// ─────────────────────────────────────
// Burial arrangement
// ─────────────────────────────────────

function drawBurial(ctx, cx, cy, day, distortion) {
  ctx.save();

  // Burial cut outline
  const bw = 50 + distortion * 15;
  const bh = 20 + distortion * 5;

  ctx.strokeStyle = day >= 3 ? PALETTE.bone : PALETTE.soilDark;
  ctx.lineWidth = day >= 3 ? 1 : 0.5;
  ctx.beginPath();
  ctx.ellipse(cx, cy, bw / 2, bh / 2, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Skeletal remains (simplified)
  if (day >= 2) {
    ctx.fillStyle = PALETTE.bone;
    ctx.globalAlpha = 0.5 + day * 0.07;

    // Skull
    ctx.beginPath();
    ctx.ellipse(cx - 12, cy - 2, 5, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Spine
    ctx.strokeStyle = PALETTE.bone;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 7, cy);
    ctx.lineTo(cx + 10, cy + 1);
    ctx.stroke();

    // Ribs
    for (let r = 0; r < 4; r++) {
      ctx.beginPath();
      ctx.moveTo(cx - 4 + r * 4, cy);
      ctx.quadraticCurveTo(cx - 4 + r * 4, cy - 3, cx - 2 + r * 4, cy - 4);
      ctx.stroke();
    }

    // Long bones
    ctx.beginPath();
    ctx.moveTo(cx + 10, cy + 1);
    ctx.lineTo(cx + 18, cy + 5);
    ctx.moveTo(cx + 10, cy + 1);
    ctx.lineTo(cx + 17, cy - 3);
    ctx.stroke();

    ctx.globalAlpha = 1;
  }

  // ── Composite artefact (the anchor) ──
  if (day >= 2 && day <= 3) {
    drawArtefact(ctx, cx + 8, cy - 8, 1.0);
  } else if (day >= 4) {
    // Artefact impression (it's been lifted)
    ctx.strokeStyle = `rgba(${hexToRgb(PALETTE.chalk)},${0.3 + distortion * 0.3})`;
    ctx.lineWidth = 0.5;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.ellipse(cx + 8, cy - 8, 6, 4, 0.3, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  ctx.restore();
}

// ─────────────────────────────────────
// Composite artefact (stone + bone + metal)
// ─────────────────────────────────────

export function drawArtefact(ctx, x, y, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // Stone base
  ctx.fillStyle = PALETTE.stone;
  ctx.beginPath();
  ctx.moveTo(-5, 3);
  ctx.lineTo(-3, -2);
  ctx.lineTo(3, -3);
  ctx.lineTo(5, 2);
  ctx.lineTo(2, 5);
  ctx.lineTo(-4, 4);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = PALETTE.mid;
  ctx.lineWidth = 0.5;
  ctx.stroke();

  // Bone/antler shaft
  ctx.fillStyle = PALETTE.bone;
  ctx.beginPath();
  ctx.moveTo(-1, -3);
  ctx.lineTo(0, -10);
  ctx.lineTo(2, -10);
  ctx.lineTo(2, -3);
  ctx.closePath();
  ctx.fill();

  // Antler tines
  ctx.strokeStyle = PALETTE.bone;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, -8);
  ctx.lineTo(-3, -12);
  ctx.moveTo(1, -9);
  ctx.lineTo(3, -13);
  ctx.stroke();

  // Metal binding
  ctx.strokeStyle = PALETTE.metal;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-2, -1);
  ctx.lineTo(3, -1);
  ctx.moveTo(-1, -4);
  ctx.lineTo(2, -4);
  ctx.stroke();

  // Patina/corrosion detail
  ctx.fillStyle = 'rgba(90,100,90,0.3)';
  ctx.fillRect(-1, -2, 3, 2);

  ctx.restore();
}

// ─────────────────────────────────────
// Character — archaeologist silhouette
// ─────────────────────────────────────

export function drawCharacter(ctx, x, y, walking = false, anim = 0, facing = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facing, 1);

  const charColor = PALETTE.darkest;
  ctx.fillStyle = charColor;
  ctx.strokeStyle = charColor;
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';

  const bob = walking ? Math.sin(anim * 8) * 2 : 0;
  const armSwing = walking ? Math.sin(anim * 8) * 0.35 : 0;
  const legSwing = walking ? Math.sin(anim * 8) * 0.4 : 0;

  // Shadow
  ctx.fillStyle = 'rgba(10,9,8,0.25)';
  ctx.beginPath();
  ctx.ellipse(0, CHAR.legLen + 2, 10, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Legs
  ctx.strokeStyle = charColor;
  ctx.save();
  ctx.translate(0, bob * 0.5);
  // Left leg
  ctx.beginPath();
  ctx.moveTo(0, 0);
  const llX = Math.sin(-legSwing) * CHAR.legLen;
  const llY = Math.cos(-legSwing) * CHAR.legLen;
  ctx.lineTo(llX, llY);
  ctx.stroke();
  // Right leg
  ctx.beginPath();
  ctx.moveTo(0, 0);
  const rlX = Math.sin(legSwing) * CHAR.legLen;
  const rlY = Math.cos(legSwing) * CHAR.legLen;
  ctx.lineTo(rlX, rlY);
  ctx.stroke();
  ctx.restore();

  // Torso
  ctx.strokeStyle = charColor;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, -CHAR.torsoLen + bob);
  ctx.lineTo(0, 0 + bob * 0.5);
  ctx.stroke();

  // Hi-vis vest strip (subtle lighter band on torso)
  ctx.strokeStyle = PALETTE.mid;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-3, -CHAR.torsoLen + 8 + bob);
  ctx.lineTo(3, -CHAR.torsoLen + 8 + bob);
  ctx.stroke();

  // Arms
  ctx.strokeStyle = charColor;
  ctx.lineWidth = 2.5;
  ctx.save();
  ctx.translate(0, -CHAR.torsoLen + 3 + bob);
  // Left arm
  ctx.beginPath();
  ctx.moveTo(0, 0);
  const laX = Math.sin(-armSwing) * CHAR.armLen;
  const laY = Math.cos(-armSwing) * CHAR.armLen;
  ctx.lineTo(laX, laY);
  ctx.stroke();
  // Right arm
  ctx.beginPath();
  ctx.moveTo(0, 0);
  const raX = Math.sin(armSwing) * CHAR.armLen;
  const raY = Math.cos(armSwing) * CHAR.armLen;
  ctx.lineTo(raX, raY);
  ctx.stroke();
  ctx.restore();

  // Head
  ctx.fillStyle = charColor;
  ctx.beginPath();
  ctx.arc(0, -CHAR.torsoLen - CHAR.headR + bob, CHAR.headR, 0, Math.PI * 2);
  ctx.fill();

  // Hard hat
  ctx.fillStyle = PALETTE.mid;
  ctx.beginPath();
  ctx.arc(0, -CHAR.torsoLen - CHAR.headR - 1 + bob, CHAR.headR + 1, Math.PI, Math.PI * 2);
  ctx.fill();
  // Brim
  ctx.fillRect(-CHAR.headR - 2, -CHAR.torsoLen - CHAR.headR - 1 + bob, CHAR.headR * 2 + 4, 2);

  ctx.restore();
}

// ─────────────────────────────────────
// Weather — snow particles
// ─────────────────────────────────────

export class WeatherSystem {
  constructor(count = SNOW_BASE_COUNT) {
    this.particles = [];
    this.resize(count);
  }

  resize(count) {
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push(this._newParticle());
    }
  }

  _newParticle(fromTop = false) {
    return {
      x: Math.random() * CANVAS_W,
      y: fromTop ? -5 : Math.random() * CANVAS_H,
      r: Math.random() * 1.8 + 0.6,
      vy: Math.random() * 25 + 12,
      vx: Math.random() * 4 - 2,
      alpha: Math.random() * 0.4 + 0.2,
    };
  }

  update(dt) {
    for (const p of this.particles) {
      p.y += p.vy * dt;
      p.x += p.vx * dt + Math.sin(p.y * 0.01) * 0.5;

      if (p.y > CANVAS_H + 5) {
        Object.assign(p, this._newParticle(true));
      }
      if (p.x < -5) p.x = CANVAS_W + 5;
      if (p.x > CANVAS_W + 5) p.x = -5;
    }
  }

  draw(ctx) {
    ctx.fillStyle = PALETTE.light;
    for (const p of this.particles) {
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
}

// ─────────────────────────────────────
// Fog overlay
// ─────────────────────────────────────

export function drawFog(ctx, intensity = 0.05) {
  ctx.fillStyle = `rgba(180,175,168,${intensity})`;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
}

// ─────────────────────────────────────
// Night scene — site office interior
// ─────────────────────────────────────

export function drawNightInterior(ctx, day = 1, distortion = 0) {
  // Dark room
  ctx.fillStyle = PALETTE.nightDarkest;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Wall
  ctx.fillStyle = '#121110';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H * 0.75);

  // Floor
  ctx.fillStyle = '#0e0d0b';
  ctx.fillRect(0, CANVAS_H * 0.75, CANVAS_W, CANVAS_H * 0.25);
  ctx.strokeStyle = '#1a1816';
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(0, CANVAS_H * 0.75);
  ctx.lineTo(CANVAS_W, CANVAS_H * 0.75);
  ctx.stroke();

  // ── Window ──
  const winX = CANVAS_W * 0.35;
  const winY = CANVAS_H * 0.2;
  const winW = CANVAS_W * 0.3;
  const winH = CANVAS_H * 0.4;

  // Window frame
  ctx.strokeStyle = '#2a2825';
  ctx.lineWidth = 3;
  ctx.strokeRect(winX, winY, winW, winH);

  // Night sky through window
  const skyGrad = ctx.createLinearGradient(winX, winY, winX, winY + winH);
  skyGrad.addColorStop(0, '#0a0908');
  skyGrad.addColorStop(1, '#141210');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(winX + 2, winY + 2, winW - 4, winH - 4);

  // Window sash
  ctx.strokeStyle = '#2a2825';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(winX + winW / 2, winY);
  ctx.lineTo(winX + winW / 2, winY + winH);
  ctx.moveTo(winX, winY + winH / 2);
  ctx.lineTo(winX + winW, winY + winH / 2);
  ctx.stroke();

  // Stars through window
  const rng = new SeededRNG(day * 7 + 99);
  ctx.fillStyle = PALETTE.light;
  for (let i = 0; i < 12; i++) {
    const sx = rng.range(winX + 8, winX + winW - 8);
    const sy = rng.range(winY + 8, winY + winH * 0.4);
    ctx.globalAlpha = rng.range(0.08, 0.2);
    ctx.beginPath();
    ctx.arc(sx, sy, rng.range(0.5, 1.2), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // View of trench through window (later days)
  if (day >= 4) {
    ctx.fillStyle = `rgba(30,28,25,${0.3 + distortion * 0.2})`;
    // Distant trench shape
    const ty = winY + winH * 0.7;
    ctx.fillRect(winX + winW * 0.3, ty, winW * 0.4, winH * 0.15);
  }

  // ── Desk ──
  const deskX = CANVAS_W * 0.1;
  const deskY = CANVAS_H * 0.6;
  ctx.fillStyle = '#1a1816';
  ctx.fillRect(deskX, deskY, 180, 5);
  ctx.fillRect(deskX + 5, deskY + 5, 4, 40);
  ctx.fillRect(deskX + 170, deskY + 5, 4, 40);

  // Papers on desk
  ctx.fillStyle = '#252320';
  ctx.fillRect(deskX + 20, deskY - 2, 40, 30);
  ctx.fillRect(deskX + 70, deskY - 1, 35, 25);

  // Lines on paper (field notes)
  ctx.strokeStyle = '#3a3835';
  ctx.lineWidth = 0.5;
  for (let l = 0; l < 4; l++) {
    ctx.beginPath();
    ctx.moveTo(deskX + 24, deskY + 4 + l * 5);
    ctx.lineTo(deskX + 55, deskY + 4 + l * 5);
    ctx.stroke();
  }

  // Lamp
  ctx.fillStyle = '#1e1c1a';
  ctx.fillRect(deskX + 140, deskY - 25, 3, 25);
  ctx.beginPath();
  ctx.moveTo(deskX + 133, deskY - 25);
  ctx.lineTo(deskX + 141, deskY - 35);
  ctx.lineTo(deskX + 150, deskY - 25);
  ctx.closePath();
  ctx.fill();

  // Lamp glow
  ctx.fillStyle = 'rgba(220,200,160,0.015)';
  ctx.beginPath();
  ctx.arc(deskX + 141, deskY - 20, 50, 0, Math.PI * 2);
  ctx.fill();

  // ── Bed (far side) ──
  ctx.fillStyle = '#151413';
  ctx.fillRect(CANVAS_W * 0.72, CANVAS_H * 0.62, 120, 8);
  ctx.fillRect(CANVAS_W * 0.72, CANVAS_H * 0.63, 4, 20);
  ctx.fillRect(CANVAS_W * 0.72 + 116, CANVAS_H * 0.63, 4, 20);
  // Pillow
  ctx.fillStyle = '#1e1c19';
  ctx.fillRect(CANVAS_W * 0.72, CANVAS_H * 0.58, 25, 6);

  // ── Distortion effects ──
  if (distortion > 0.3) {
    // Subtle dark shape near window
    ctx.fillStyle = `rgba(5,4,3,${distortion * 0.15})`;
    ctx.beginPath();
    ctx.ellipse(winX + winW * 0.5, winY + winH * 0.8, 15, 30, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  if (day >= 6) {
    // Floor vibration lines
    ctx.strokeStyle = `rgba(40,38,35,${distortion * 0.3})`;
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      const fy = CANVAS_H * 0.78 + i * 12;
      for (let fx = 0; fx < CANVAS_W; fx += 8) {
        const wave = Math.sin(fx * 0.02 + distortion * 5 + i) * distortion * 2;
        if (fx === 0) ctx.moveTo(fx, fy + wave);
        else ctx.lineTo(fx, fy + wave);
      }
      ctx.stroke();
    }
  }
}

// ─────────────────────────────────────
// Inspect close-up — artefact detail view
// ─────────────────────────────────────

export function drawInspectArtefact(ctx, day) {
  // Dark background with radial gradient
  const grad = ctx.createRadialGradient(
    CANVAS_W / 2, CANVAS_H / 2, 50,
    CANVAS_W / 2, CANVAS_H / 2, 400
  );
  grad.addColorStop(0, '#1a1816');
  grad.addColorStop(1, '#0a0908');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Soil/context texture
  const rng = new SeededRNG(88);
  ctx.fillStyle = PALETTE.soil;
  ctx.globalAlpha = 0.1;
  for (let i = 0; i < 80; i++) {
    ctx.beginPath();
    ctx.arc(rng.range(0, CANVAS_W), rng.range(0, CANVAS_H), rng.range(1, 3), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Large artefact view
  drawArtefact(ctx, CANVAS_W / 2, CANVAS_H / 2, 8);
}

// ─────────────────────────────────────
// Bypass road (background element)
// ─────────────────────────────────────

export function drawBypass(ctx, cameraX, seed = 1) {
  const offsetX = cameraX * PARALLAX.houses;
  const rng = new SeededRNG(seed + 200);

  const roadY = CANVAS_H * GROUND_Y + 15;
  const roadX = 1200 - offsetX;

  if (roadX > CANVAS_W + 100) return;

  // Road surface
  ctx.fillStyle = PALETTE.soilDark;
  ctx.fillRect(roadX, CANVAS_H * GROUND_Y, 200, 30);

  // Road markings
  ctx.strokeStyle = PALETTE.mid;
  ctx.lineWidth = 1;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.moveTo(roadX, roadY);
  ctx.lineTo(roadX + 200, roadY);
  ctx.stroke();
  ctx.setLineDash([]);

  // Construction barrier
  ctx.fillStyle = PALETTE.accent;
  ctx.fillRect(roadX - 5, CANVAS_H * GROUND_Y - 15, 3, 15);
  ctx.fillRect(roadX + 203, CANVAS_H * GROUND_Y - 15, 3, 15);
  ctx.strokeStyle = PALETTE.mid;
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(roadX - 5, CANVAS_H * GROUND_Y - 10);
  ctx.lineTo(roadX + 206, CANVAS_H * GROUND_Y - 10);
  ctx.stroke();
}

// ─────────────────────────────────────
// Utility — hex to rgb string
// ─────────────────────────────────────

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}
