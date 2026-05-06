/* ═══════════════════════════════════════
   SCENES — WalkScene, NightScene
   ═══════════════════════════════════════ */

import {
  CANVAS_W, CANVAS_H, WALK_SPEED, GROUND_Y, CHAR
} from './config.js';
import {
  drawSky, drawHills, drawHousing, drawTrees,
  drawGround, drawTrench, drawBypass, drawCharacter,
  WeatherSystem, drawFog, drawNightInterior
} from './renderer.js';
import { NarrativeController } from './narrative.js';
import { clamp } from './utils.js';

// ─────────────────────────────────────
// WalkScene — side-scrolling day scene
// ─────────────────────────────────────

export class WalkScene {
  constructor(ctx, bus, dayConfig, sceneData) {
    this.ctx = ctx;
    this.bus = bus;
    this.config = dayConfig;
    this.data = sceneData;

    // World
    this.worldWidth = dayConfig.worldWidth || 2200;
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
    this.autoWalk = false; // Start with narrative, don't walk

    // POIs (points of interest that trigger narrative)
    this.pois = (sceneData.pois || []).map(p => ({ ...p, triggered: false }));
    // Mark first POI as triggered since we start with 'start' node
    if (this.pois.length > 0) this.pois[0].triggered = true;

    // Weather
    this.weather = new WeatherSystem(dayConfig.snowCount || 55);

    // Event listeners
    this._onResume = () => {
      this.autoWalk = true;
    };
    bus.on('narrative:resume', this._onResume);

    this._onSceneEnd = () => {
      this.done = true;
    };
    bus.on('scene:end', this._onSceneEnd);

    this.done = false;
  }

  update(dt, input) {
    // Walking logic
    const narrativeActive = this.narrative.active &&
      (this.narrative.typing || this.narrative.waiting || this.narrative.showingChoices);

    if (this.autoWalk) {
      // Walk when autoWalk is set, even during narrative (resume behaviour)
      this.walking = true;
    } else if (!narrativeActive && input.right) {
      this.walking = true;
      this.walkHeld = true;
    } else if (!narrativeActive && !input.right) {
      // Not auto-walking and no input — stop
      this.walking = false;
      this.walkHeld = false;
    } else if (narrativeActive) {
      // Narrative active and not autoWalk — stop
      this.walking = false;
    }

    if (this.walking) {
      const speed = WALK_SPEED;
      this.charWorldX += speed * dt;
      this.anim += dt;
      this.facing = 1;

      // Clamp to world bounds
      this.charWorldX = clamp(this.charWorldX, 0, this.worldWidth);

      // Check POI triggers
      for (const poi of this.pois) {
        if (!poi.triggered && this.charWorldX >= poi.worldX) {
          poi.triggered = true;
          this.autoWalk = false;
          this.walking = false;
          this.narrative.load(this.data.nodes, poi.nodeId);
          break;
        }
      }

      // Auto-end if reached world end and no active narrative
      if (this.charWorldX >= this.worldWidth - 50 && !this.narrative.active) {
        // Trigger last narrative node if untriggered
        const untriggered = this.pois.find(p => !p.triggered);
        if (untriggered) {
          untriggered.triggered = true;
          this.autoWalk = false;
          this.narrative.load(this.data.nodes, untriggered.nodeId);
        }
      }
    }

    // Camera follows character
    const targetCameraX = this.charWorldX - CANVAS_W * 0.35;
    this.cameraX += (targetCameraX - this.cameraX) * 0.08;
    this.cameraX = clamp(this.cameraX, 0, Math.max(0, this.worldWidth - CANVAS_W));

    // Weather
    this.weather.update(dt);

    // Narrative
    this.narrative.update(dt);

    // Handle advance input
    if (input.advance) {
      if (this.narrative.active) {
        this.narrative.advance();
      } else if (!this.walking) {
        // Resume walking if narrative isn't active
        this.autoWalk = true;
      }
    }
  }

  draw() {
    const ctx = this.ctx;
    const cam = this.cameraX;
    const day = this.config;
    const dist = day.distortion || 0;

    // Sky
    drawSky(ctx);

    // Hills
    drawHills(ctx, cam, day.seed);

    // Housing (Terraria-style cross-section)
    drawHousing(ctx, cam, day.seed, parseInt(this._dayNum) || 1, dist);

    // Trees (far layer)
    drawTrees(ctx, cam, 0, day.seed);

    // Ground
    drawGround(ctx, cam);

    // Bypass road
    drawBypass(ctx, cam, day.seed);

    // Trees (near layer)
    drawTrees(ctx, cam, 1, day.seed);

    // Trench
    if (day.trenchX) {
      drawTrench(ctx, cam, day.trenchX, parseInt(this._dayNum) || 1, dist);
    }

    // Character
    const screenX = this.charWorldX - cam;
    drawCharacter(ctx, screenX, this.charY, this.walking, this.anim, this.facing);

    // Weather
    this.weather.draw(ctx);

    // Fog
    if (day.fog) {
      drawFog(ctx, day.fog);
    }

    // Narrative text (Canvas via Pretext)
    this.narrative.draw(ctx);
  }

  setDayNum(n) {
    this._dayNum = n;
  }

  destroy() {
    this.bus.off('narrative:resume', this._onResume);
    this.bus.off('scene:end', this._onSceneEnd);
    this.narrative.hide();
  }
}

// ─────────────────────────────────────
// NightScene — static interior scene
// ─────────────────────────────────────

export class NightScene {
  constructor(ctx, bus, dayConfig, sceneData) {
    this.ctx = ctx;
    this.bus = bus;
    this.config = dayConfig;
    this.data = sceneData;

    // Narrative
    this.narrative = new NarrativeController(bus);
    this.narrative.load(sceneData.nodes, 'start');

    this._onSceneEnd = () => {
      this.done = true;
    };
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
    const dist = this.config.distortion || 0;
    const dayNum = parseInt(this._dayNum) || 1;

    drawNightInterior(ctx, dayNum, dist);

    // Narrative text (Canvas via Pretext)
    this.narrative.draw(ctx);
  }

  setDayNum(n) {
    this._dayNum = n;
  }

  destroy() {
    this.bus.off('scene:end', this._onSceneEnd);
    this.narrative.hide();
  }
}
