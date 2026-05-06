/* ═══════════════════════════════════════
   GAME — Orchestrator, day manager, init
   ═══════════════════════════════════════ */

import { CANVAS_W, CANVAS_H } from './config.js';
import { EventBus, SaveManager } from './utils.js';
import { DAYS } from './data.js';
import { WalkScene, NightScene } from './scenes.js';

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

    // State
    this.currentDay   = 1;
    this.sceneIndex   = 0;
    this.scene        = null;
    this.state        = 'title'; // title | dayTransition | playing | ending
    this.lastTime     = 0;

    // Input state
    this.input = {
      right: false,
      advance: false,
    };

    // DOM refs
    this.titleScreen  = document.getElementById('title-screen');
    this.dayOverlay   = document.getElementById('day-overlay');
    this.dayLabel     = this.dayOverlay.querySelector('.day-label');
    this.daySubtitle  = this.dayOverlay.querySelector('.day-subtitle');

    // Day transition timer
    this.transitionTimer = 0;
    this.transitionDuration = 3.5;

    // Bind events
    this._bindInput();
    this._bindTitle();

    // Listen for scene end
    this.bus.on('scene:end', () => {
      this._onSceneEnd();
    });

    // Start render loop
    this._frame = this._frame.bind(this);
    requestAnimationFrame(this._frame);

    // Fallback timer for background tabs (covers all states)
    this._fallback = setInterval(() => {
      if (this.state !== 'title' && this.state !== 'ending') {
        this._update(0.033);
      }
    }, 33);
  }

  // ── Input binding ──

  _bindInput() {
    document.addEventListener('keydown', (e) => {
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        this.input.right = true;
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
    });

    // Touch/click
    this.canvas.addEventListener('click', () => {
      this.input.advance = true;
    });

    // Touch hold for walking (right half of screen)
    this.canvas.addEventListener('touchstart', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      if (x > rect.width * 0.5) {
        this.input.right = true;
      }
    });

    this.canvas.addEventListener('touchend', () => {
      this.input.right = false;
    });
  }

  _bindTitle() {
    const btnNew = document.getElementById('btn-new-game');
    const btnCont = document.getElementById('btn-continue');

    // Check for save
    if (SaveManager.hasSave()) {
      btnCont.style.display = '';
      btnCont.addEventListener('click', () => {
        const save = SaveManager.load();
        this.currentDay = save.currentDay || 1;
        this._startGame();
      });
    }

    btnNew.addEventListener('click', () => {
      SaveManager.clear();
      this.currentDay = 1;
      this._startGame();
    });
  }

  // ── Game flow ──

  _startGame() {
    this.titleScreen.classList.add('fading');
    setTimeout(() => {
      this.titleScreen.style.display = 'none';
      this._startDay(this.currentDay);
    }, 1500);
  }

  _startDay(dayNum) {
    this.currentDay = dayNum;
    this.sceneIndex = 0;
    this.state = 'dayTransition';
    this.transitionTimer = 0;

    const dayConfig = DAYS[dayNum];
    if (!dayConfig) {
      this.state = 'ending';
      return;
    }

    // Show day overlay
    this.dayLabel.textContent = `day ${dayNum}`;
    this.daySubtitle.textContent = dayConfig.subtitle || '';
    this.dayOverlay.classList.remove('hidden');
    this.dayOverlay.style.opacity = '1';

    // Save progress
    SaveManager.save({ currentDay: dayNum, version: 1 });
  }

  _startScene() {
    const dayConfig = DAYS[this.currentDay];
    if (!dayConfig) return;

    const scenes = dayConfig.scenes;
    if (this.sceneIndex >= scenes.length) {
      // Day complete — advance to next day
      this._startDay(this.currentDay + 1);
      return;
    }

    const sceneData = scenes[this.sceneIndex];

    // Destroy previous scene
    if (this.scene) {
      this.scene.destroy();
      this.scene = null;
    }

    // Create new scene
    if (sceneData.type === 'walk') {
      this.scene = new WalkScene(this.ctx, this.bus, dayConfig, sceneData);
    } else if (sceneData.type === 'night') {
      this.scene = new NightScene(this.ctx, this.bus, dayConfig, sceneData);
    }

    if (this.scene) {
      this.scene.setDayNum(this.currentDay);
    }

    this.state = 'playing';
  }

  _onSceneEnd() {
    if (this.state !== 'playing') return;

    // Fade out then start next scene
    this.sceneIndex++;

    const dayConfig = DAYS[this.currentDay];
    if (dayConfig && this.sceneIndex < dayConfig.scenes.length) {
      // More scenes in this day — brief transition
      this.state = 'sceneTransition';
      this.transitionTimer = 0;
    } else {
      // Day complete
      if (this.scene) {
        this.scene.destroy();
        this.scene = null;
      }
      this._startDay(this.currentDay + 1);
    }
  }

  // ── Main loop ──

  _frame(timestamp) {
    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.05);
    this.lastTime = timestamp;

    this._update(dt);
    this._draw();

    // Clear one-shot inputs
    this.input.advance = false;

    requestAnimationFrame(this._frame);
  }

  _update(dt) {
    switch (this.state) {
      case 'title':
        break;

      case 'dayTransition':
        this.transitionTimer += dt;
        if (this.transitionTimer >= this.transitionDuration) {
          // Fade out overlay
          this.dayOverlay.style.opacity = '0';
          this.dayOverlay.style.transition = 'opacity 1s ease';
          setTimeout(() => {
            this.dayOverlay.classList.add('hidden');
            this.dayOverlay.style.transition = '';
            this._startScene();
          }, 1000);
          this.state = 'waitingForScene';
        }
        break;

      case 'waitingForScene':
        break;

      case 'sceneTransition':
        this.transitionTimer += dt;
        if (this.transitionTimer >= 1.5) {
          this._startScene();
        }
        break;

      case 'playing':
        if (this.scene) {
          this.scene.update(dt, this.input);
          if (this.scene.done) {
            this._onSceneEnd();
          }
        }
        break;

      case 'ending':
        break;
    }
  }

  _draw() {
    const ctx = this.ctx;

    // Clear
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    switch (this.state) {
      case 'title':
        ctx.fillStyle = '#0a0908';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        break;

      case 'dayTransition':
      case 'waitingForScene':
        ctx.fillStyle = '#0a0908';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        break;

      case 'sceneTransition':
        // Fade to black between scenes
        ctx.fillStyle = `rgba(10,9,8,${Math.min(this.transitionTimer / 0.5, 1)})`;
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        break;

      case 'playing':
        if (this.scene) {
          this.scene.draw();
        }
        break;

      case 'ending':
        ctx.fillStyle = '#0a0908';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        break;
    }
  }
}

// ── Bootstrap ──
// Module scripts are deferred — DOM is ready when this executes.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => { window._game = new Game(); });
} else {
  window._game = new Game();
}
