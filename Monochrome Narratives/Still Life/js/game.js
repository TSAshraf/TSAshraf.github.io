/* ═══════════════════════════════════════
   GAME — Orchestrator, chapter manager, init
   ═══════════════════════════════════════ */

import { CANVAS_W, CANVAS_H } from './config.js';
import { EventBus, SaveManager } from './utils.js';
import { CHAPTERS } from './data.js';
import { WalkScene, InteriorScene } from './scenes.js';

class Game {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx    = this.canvas.getContext('2d');
    this.bus    = new EventBus();

    // DPR scaling
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width  = CANVAS_W * this.dpr;
    this.canvas.height = CANVAS_H * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);

    // State
    this.currentChapter = 1;
    this.sceneIndex     = 0;
    this.scene          = null;
    this.state          = 'title';
    this.lastTime       = 0;

    // Input
    this.input = {
      right: false,
      advance: false,
    };

    // DOM
    this.titleScreen  = document.getElementById('title-screen');
    this.chapterOverlay = document.getElementById('chapter-overlay');
    this.chapterLabel   = this.chapterOverlay.querySelector('.chapter-label');
    this.chapterSubtitle = this.chapterOverlay.querySelector('.chapter-subtitle');

    // Transition
    this.transitionTimer = 0;
    this.transitionDuration = 3.5;

    this._bindInput();
    this._bindTitle();

    this.bus.on('scene:end', () => {
      this._onSceneEnd();
    });

    this._frame = this._frame.bind(this);
    requestAnimationFrame(this._frame);

    this._fallback = setInterval(() => {
      if (this.state !== 'title' && this.state !== 'ending') {
        this._update(0.033);
      }
    }, 33);
  }

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

    this.canvas.addEventListener('click', () => {
      this.input.advance = true;
    });

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

    if (SaveManager.hasSave()) {
      btnCont.style.display = '';
      btnCont.addEventListener('click', () => {
        const save = SaveManager.load();
        this.currentChapter = save.currentChapter || 1;
        this._startGame();
      });
    }

    btnNew.addEventListener('click', () => {
      SaveManager.clear();
      this.currentChapter = 1;
      this._startGame();
    });
  }

  _startGame() {
    this.titleScreen.classList.add('fading');
    setTimeout(() => {
      this.titleScreen.style.display = 'none';
      this._startChapter(this.currentChapter);
    }, 1500);
  }

  _startChapter(num) {
    this.currentChapter = num;
    this.sceneIndex = 0;
    this.state = 'chapterTransition';
    this.transitionTimer = 0;

    const config = CHAPTERS[num];
    if (!config) {
      this.state = 'ending';
      return;
    }

    this.chapterLabel.textContent = `chapter ${num}`;
    this.chapterSubtitle.textContent = config.subtitle || '';
    this.chapterOverlay.classList.remove('hidden');
    this.chapterOverlay.style.opacity = '1';

    SaveManager.save({ currentChapter: num, version: 1 });
  }

  _startScene() {
    const config = CHAPTERS[this.currentChapter];
    if (!config) return;

    const scenes = config.scenes;
    if (this.sceneIndex >= scenes.length) {
      this._startChapter(this.currentChapter + 1);
      return;
    }

    const sceneData = scenes[this.sceneIndex];

    if (this.scene) {
      this.scene.destroy();
      this.scene = null;
    }

    if (sceneData.type === 'walk') {
      this.scene = new WalkScene(this.ctx, this.bus, config, sceneData);
    } else if (sceneData.type === 'interior') {
      this.scene = new InteriorScene(this.ctx, this.bus, config, sceneData);
    }

    if (this.scene) {
      this.scene.setChapterNum(this.currentChapter);
    }

    this.state = 'playing';
  }

  _onSceneEnd() {
    if (this.state !== 'playing') return;

    this.sceneIndex++;

    const config = CHAPTERS[this.currentChapter];
    if (config && this.sceneIndex < config.scenes.length) {
      this.state = 'sceneTransition';
      this.transitionTimer = 0;
    } else {
      if (this.scene) {
        this.scene.destroy();
        this.scene = null;
      }
      this._startChapter(this.currentChapter + 1);
    }
  }

  _frame(timestamp) {
    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.05);
    this.lastTime = timestamp;

    this._update(dt);
    this._draw();

    this.input.advance = false;

    requestAnimationFrame(this._frame);
  }

  _update(dt) {
    switch (this.state) {
      case 'title':
        break;

      case 'chapterTransition':
        this.transitionTimer += dt;
        if (this.transitionTimer >= this.transitionDuration) {
          this.chapterOverlay.style.opacity = '0';
          this.chapterOverlay.style.transition = 'opacity 1s ease';
          setTimeout(() => {
            this.chapterOverlay.classList.add('hidden');
            this.chapterOverlay.style.transition = '';
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
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    switch (this.state) {
      case 'title':
      case 'chapterTransition':
      case 'waitingForScene':
        ctx.fillStyle = '#0a090b';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        break;

      case 'sceneTransition':
        ctx.fillStyle = `rgba(10,9,11,${Math.min(this.transitionTimer / 0.5, 1)})`;
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        break;

      case 'playing':
        if (this.scene) {
          this.scene.draw();
        }
        break;

      case 'ending':
        ctx.fillStyle = '#0a090b';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        break;
    }
  }
}

// ── Bootstrap ──
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => { new Game(); });
} else {
  new Game();
}
