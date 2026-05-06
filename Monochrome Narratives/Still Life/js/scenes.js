/* ═══════════════════════════════════════
   SCENES — WalkScene, InteriorScene
   ═══════════════════════════════════════ */

import {
  CANVAS_W, CANVAS_H, WALK_SPEED, GROUND_Y, CHAR
} from './config.js';
import {
  drawSky, drawFarHouses, drawHouses, drawTrees,
  drawLampposts, drawGround, drawCharacter,
  RainSystem, drawFog, drawInterior
} from './renderer.js';
import { NarrativeController } from './narrative.js';
import { clamp } from './utils.js';

// ─────────────────────────────────────
// WalkScene — side-scrolling street scene
// ─────────────────────────────────────

export class WalkScene {
  constructor(ctx, bus, chapterConfig, sceneData) {
    this.ctx = ctx;
    this.bus = bus;
    this.config = chapterConfig;
    this.data = sceneData;

    // World
    this.worldWidth = chapterConfig.worldWidth || 2000;
    this.cameraX    = 0;
    this.charWorldX = 80;
    this.charY      = CANVAS_H * GROUND_Y - CHAR.legLen - 2;
    this.walking    = false;
    this.walkHeld   = false;
    this.anim       = 0;
    this.facing     = 1;
    this.autoWalk   = true;

    // Narrative
    this.narrative = new NarrativeController(bus);
    this.narrative.load(sceneData.nodes, 'start');
    this.autoWalk = false;

    // POIs
    this.pois = (sceneData.pois || []).map(p => ({ ...p, triggered: false }));
    if (this.pois.length > 0) this.pois[0].triggered = true;

    // Weather
    this.rain = new RainSystem(chapterConfig.rainCount || 0);

    // Events
    this._onResume = () => { this.autoWalk = true; };
    bus.on('narrative:resume', this._onResume);

    this._onSceneEnd = () => { this.done = true; };
    bus.on('scene:end', this._onSceneEnd);

    this.done = false;
  }

  update(dt, input) {
    const narrativeActive = this.narrative.active &&
      (this.narrative.typing || this.narrative.waiting || this.narrative.showingChoices);

    if (this.autoWalk) {
      this.walking = true;
    } else if (!narrativeActive && input.right) {
      this.walking = true;
      this.walkHeld = true;
    } else if (!narrativeActive && !input.right) {
      this.walking = false;
      this.walkHeld = false;
    } else if (narrativeActive) {
      this.walking = false;
    }

    if (this.walking) {
      this.charWorldX += WALK_SPEED * dt;
      this.anim += dt;
      this.facing = 1;
      this.charWorldX = clamp(this.charWorldX, 0, this.worldWidth);

      for (const poi of this.pois) {
        if (!poi.triggered && this.charWorldX >= poi.worldX) {
          poi.triggered = true;
          this.autoWalk = false;
          this.walking = false;
          this.narrative.load(this.data.nodes, poi.nodeId);
          break;
        }
      }

      if (this.charWorldX >= this.worldWidth - 50 && !this.narrative.active) {
        const untriggered = this.pois.find(p => !p.triggered);
        if (untriggered) {
          untriggered.triggered = true;
          this.autoWalk = false;
          this.narrative.load(this.data.nodes, untriggered.nodeId);
        }
      }
    }

    // Camera
    const targetCameraX = this.charWorldX - CANVAS_W * 0.35;
    this.cameraX += (targetCameraX - this.cameraX) * 0.08;
    this.cameraX = clamp(this.cameraX, 0, Math.max(0, this.worldWidth - CANVAS_W));

    // Weather
    this.rain.update(dt);

    // Narrative
    this.narrative.update(dt);

    if (input.advance) {
      if (this.narrative.active) {
        this.narrative.advance();
      } else if (!this.walking) {
        this.autoWalk = true;
      }
    }
  }

  draw() {
    const ctx = this.ctx;
    const cam = this.cameraX;
    const cfg = this.config;
    const dist = cfg.distortion || 0;

    drawSky(ctx, dist);
    drawFarHouses(ctx, cam, cfg.seed, dist);
    drawTrees(ctx, cam, 0, cfg.seed, dist);
    drawHouses(ctx, cam, cfg.seed, parseInt(this._chapterNum) || 1, dist);
    drawGround(ctx, cam, dist);
    drawLampposts(ctx, cam, cfg.seed, dist);
    drawTrees(ctx, cam, 1, cfg.seed, dist);

    // Character
    const screenX = this.charWorldX - cam;
    drawCharacter(ctx, screenX, this.charY, this.walking, this.anim, this.facing);

    // Rain
    this.rain.draw(ctx);

    // Fog
    if (cfg.fog) {
      drawFog(ctx, cfg.fog);
    }

    // Narrative
    this.narrative.draw(ctx);
  }

  setChapterNum(n) {
    this._chapterNum = n;
  }

  destroy() {
    this.bus.off('narrative:resume', this._onResume);
    this.bus.off('scene:end', this._onSceneEnd);
    this.narrative.hide();
  }
}

// ─────────────────────────────────────
// InteriorScene — the living room
// ─────────────────────────────────────

export class InteriorScene {
  constructor(ctx, bus, chapterConfig, sceneData) {
    this.ctx = ctx;
    this.bus = bus;
    this.config = chapterConfig;
    this.data = sceneData;

    // Narrative
    this.narrative = new NarrativeController(bus);
    this.narrative.load(sceneData.nodes, 'start');

    this._onSceneEnd = () => { this.done = true; };
    bus.on('scene:end', this._onSceneEnd);

    this.done = false;
    this.time = 0;
  }

  update(dt, input) {
    this.time += dt;
    this.narrative.update(dt);

    if (input.advance) {
      this.narrative.advance();
    }
  }

  draw() {
    const ctx = this.ctx;
    const cfg = this.config;
    const chapterNum = parseInt(this._chapterNum) || 1;

    drawInterior(ctx, chapterNum, cfg.distortion || 0, cfg.lampWrong || 0, this.time);

    // Narrative
    this.narrative.draw(ctx);
  }

  setChapterNum(n) {
    this._chapterNum = n;
  }

  destroy() {
    this.bus.off('scene:end', this._onSceneEnd);
    this.narrative.hide();
  }
}
