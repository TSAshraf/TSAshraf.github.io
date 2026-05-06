/* ═══════════════════════════════════════
   GAME — Orchestrator, loop manager, init
   ═══════════════════════════════════════ */

import { CANVAS_W, CANVAS_H } from './config.js';
import { EventBus, SaveManager } from './utils.js';
import { GameState } from './state.js';
import { TrainScene, HallucinationScene } from './scenes.js';
import { getResetNarration } from './data.js';
import { NarrativeController } from './narrative.js';
import { drawTitleBackground, drawResetOverlay } from './renderer.js';

class Game {
  constructor() {
    // Canvas setup
    this.canvas = document.getElementById('game-canvas');
    this.ctx    = this.canvas.getContext('2d');
    this.bus    = new EventBus();

    // DPR scaling
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width  = CANVAS_W * this.dpr;
    this.canvas.height = CANVAS_H * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);

    // Game state
    this.gameState = new GameState();

    // Scenes
    this.scene = null;
    this.hallucinationScene = null;

    // State machine
    // title | playing | hallucination | resetTransition | resetNarration | ending
    this.state = 'title';
    this.lastTime = 0;

    // Reset narration
    this.resetNarrative = null;

    // Input
    this.input = {
      right: false,
      left: false,
      advance: false,
    };

    // DOM refs
    this.titleScreen = document.getElementById('title-screen');
    this.loopOverlay = document.getElementById('loop-overlay');
    this.loopLabel   = this.loopOverlay ? this.loopOverlay.querySelector('.loop-label') : null;

    // Bind
    this._bindInput();
    this._bindTitle();

    window.__game = this; // debug

    // Start render loop
    this._frame = this._frame.bind(this);
    requestAnimationFrame(this._frame);
  }

  // ── Input ──

  _bindInput() {
    document.addEventListener('keydown', (e) => {
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        this.input.right = true;
      }
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        this.input.left = true;
      }
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        this.input.advance = true;
      }
    });

    document.addEventListener('keyup', (e) => {
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        this.input.right = false;
      }
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        this.input.left = false;
      }
    });

    this.canvas.addEventListener('click', () => {
      this.input.advance = true;
    });

    this.canvas.addEventListener('touchstart', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      if (x > rect.width * 0.6) {
        this.input.right = true;
      } else if (x < rect.width * 0.4) {
        this.input.left = true;
      } else {
        this.input.advance = true;
      }
    });

    this.canvas.addEventListener('touchend', () => {
      this.input.right = false;
      this.input.left = false;
    });
  }

  _bindTitle() {
    const btnNew = document.getElementById('btn-new-game');
    const btnCont = document.getElementById('btn-continue');

    if (SaveManager.hasSave()) {
      btnCont.style.display = '';
      btnCont.addEventListener('click', () => {
        const save = SaveManager.load();
        this.gameState.deserialize(save);
        this._startGame();
      });
    }

    btnNew.addEventListener('click', () => {
      SaveManager.clear();
      this.gameState.reset();
      this._startGame();
    });
  }

  // ── Game Flow ──

  _startGame() {
    this.titleScreen.classList.add('fading');
    setTimeout(() => {
      this.titleScreen.style.display = 'none';
      this._startLoop();
    }, 1500);
  }

  _startLoop() {
    // Create the train scene
    if (this.scene) {
      this.scene.destroy();
    }

    this.scene = new TrainScene(this.ctx, this.bus, this.gameState);
    this.state = 'playing';

    // Save
    SaveManager.save(this.gameState.serialize());
  }

  _triggerReset() {
    // Advance the loop
    this.gameState.nextLoop();

    // Show reset narration
    const resetNodes = getResetNarration(this.gameState.loopCount);
    this.resetNarrative = new NarrativeController(this.bus);

    this._resetEndHandler = (data) => {
      if (data && data.label === 'reset') {
        this.bus.off('scene:end', this._resetEndHandler);
        this.resetNarrative.hide();
        this.resetNarrative = null;
        this._startLoop();
      }
    };
    this.bus.on('scene:end', this._resetEndHandler);

    this.resetNarrative.load(resetNodes, 'start');
    this.state = 'resetNarration';
  }

  _triggerHallucination() {
    const tier = this.gameState.getSelfThrowTier();
    this.hallucinationScene = new HallucinationScene(this.ctx, this.bus, tier);
    this.state = 'hallucination';
  }

  _returnFromHallucination() {
    if (this.hallucinationScene) {
      this.hallucinationScene.destroy();
      this.hallucinationScene = null;
    }

    // Return to train scene with post-throw narration
    this.state = 'playing';
    if (this.scene) {
      this.scene.returnFromHallucination();
    }

    // Reset is triggered by 'returned' label in scene's _handleSceneEnd
  }

  // ── Main Loop ──

  _frame(timestamp) {
    try {
      const dt = Math.min((timestamp - this.lastTime) / 1000, 0.05);
      this.lastTime = timestamp;

      this._update(dt);
      this._draw();

      this.input.advance = false;
    } catch (e) {
      console.error('Frame error:', e);
    }

    requestAnimationFrame(this._frame);
  }

  _update(dt) {
    switch (this.state) {
      case 'title':
        break;

      case 'playing':
        if (this.scene) {
          this.scene.update(dt, this.input);

          // Check if scene requests reset
          if (this.scene.requestReset) {
            this.scene.requestReset = false;
            this._triggerReset();
          }

          // Check if scene requests hallucination
          if (this.scene.requestHallucination) {
            this.scene.requestHallucination = false;
            this._triggerHallucination();
          }

          // Check if scene is done (do-nothing ending)
          if (this.scene.done) {
            this.state = 'ending';
          }
        }
        break;

      case 'hallucination':
        if (this.hallucinationScene) {
          this.hallucinationScene.update(dt, this.input);
          if (this.hallucinationScene.done) {
            this._returnFromHallucination();
          }
        }
        break;

      case 'resetNarration':
        if (this.resetNarrative) {
          this.resetNarrative.update(dt);
          if (this.input.advance) {
            this.resetNarrative.advance();
          }
        }
        break;

      case 'ending':
        // Fade to black — the do-nothing ending
        this._endingTimer = (this._endingTimer || 0) + dt;
        break;
    }
  }

  _draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    switch (this.state) {
      case 'title':
        drawTitleBackground(ctx);
        break;

      case 'playing':
        if (this.scene) {
          this.scene.draw();
        }
        break;

      case 'hallucination':
        if (this.hallucinationScene) {
          this.hallucinationScene.draw();
        }
        break;

      case 'resetNarration':
        // Dark background with reset narration
        ctx.fillStyle = '#0a0908';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        if (this.resetNarrative) {
          this.resetNarrative.draw(ctx);
        }
        break;

      case 'ending': {
        // Fade to black
        const alpha = Math.min((this._endingTimer || 0) / 3, 1);
        ctx.fillStyle = '#0a0908';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

        if (alpha < 0.8) {
          // Show final text
          ctx.globalAlpha = 1 - alpha;
          ctx.font = '18px "EB Garamond", Georgia, serif';
          ctx.fillStyle = '#c3bfb9';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('The seat holds the shape of everyone who\'s sat in it.', CANVAS_W / 2, CANVAS_H / 2);
          ctx.globalAlpha = 1;
          ctx.textAlign = 'left';
        }
        break;
      }
    }
  }
}

// ── Bootstrap ──
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => { new Game(); });
} else {
  new Game();
}
