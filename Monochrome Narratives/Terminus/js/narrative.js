/* ═══════════════════════════════════════
   NARRATIVE — Canvas text via Pretext,
   typing animation, choices (DOM)
   ═══════════════════════════════════════ */

import { TYPE_SPEED, ADVANCE_BLOCK_MS, CANVAS_W, CANVAS_H } from './config.js';
import { prepareWithSegments, layoutWithLines } from './lib/pretext/layout.js';

// ── Font configs ──
const NARRATOR_FONT = '18px "EB Garamond", Georgia, serif';
const NARRATOR_LINE_H = 30;
const VOICE_FONT = '14px "IBM Plex Mono", monospace';
const VOICE_LINE_H = 26;
const SPEAKER_FONT = '11px "IBM Plex Mono", monospace';
const PROMPT_FONT  = '10px "IBM Plex Mono", monospace';

// ── Layout constants ──
const BOX_PAD_X  = 38;
const BOX_PAD_Y  = 28;
const BOX_MAX_W  = CANVAS_W * 0.55;
const BOX_BOTTOM = CANVAS_H;

// ── Colours ──
const COL_TEXT     = '#c3bfb9';
const COL_VOICE    = '#5a5550';
const COL_SPEAKER  = '#7a7570';
const COL_PROMPT   = '#4a4540';
const COL_BG_START = 'rgba(10,9,8,0.92)';
const COL_BG_END   = 'rgba(10,9,8,0)';

export class NarrativeController {
  constructor(bus) {
    this.bus = bus;
    this.choicesEl = document.getElementById('choices-box');

    // State
    this.nodes        = {};
    this.currentId    = null;
    this.currentNode  = null;
    this.fullText     = '';
    this.displayText  = '';
    this.typeAcc      = 0;
    this.charIndex    = 0;
    this.typing       = false;
    this.waiting      = false;
    this.showingChoices = false;
    this.blocked      = false;
    this.active       = false;
    this.onEnd        = null;

    // Canvas text state
    this._lines       = [];
    this._speaker     = '';
    this._isVoice     = false;
    this._promptAlpha = 0;
    this._boxAlpha    = 0;
  }

  load(nodes, startId) {
    this.nodes = nodes;
    this.active = true;
    this.goNode(startId);
  }

  goNode(id) {
    const node = this.nodes[id];
    if (!node) {
      this._end();
      return;
    }

    this.currentId   = id;
    this.currentNode = node;
    this._speaker    = node.sp || '';
    this._isVoice    = node.voice === 'sermon' || node.voice === 'pa';

    this.fullText     = node.t || '';
    this.displayText  = '';
    this.charIndex    = 0;
    this.typeAcc      = 0;
    this.typing       = true;
    this.waiting      = false;
    this.showingChoices = false;
    this._lines       = [];
    this._promptAlpha = 0;
    this._boxAlpha    = 1;

    this.choicesEl.classList.add('hidden');
    this.choicesEl.innerHTML = '';

    this.blocked = true;
    setTimeout(() => { this.blocked = false; }, ADVANCE_BLOCK_MS);

    if (node.flag) this.bus.emit('flag', node.flag);
    if (node.fx)   this.bus.emit('fx', node.fx);

    this._resumeAfter = !!node.resume;
  }

  update(dt) {
    if (!this.active) return;

    if (this.typing) {
      this.typeAcc += dt;
      while (this.typeAcc >= TYPE_SPEED && this.charIndex < this.fullText.length) {
        this.typeAcc -= TYPE_SPEED;
        this.charIndex++;
      }
      this.displayText = this.fullText.slice(0, this.charIndex);

      if (this.charIndex >= this.fullText.length) {
        this.typing = false;
        this.displayText = this.fullText;
        this._onTypingDone();
      }
    }

    if (this.waiting && this._promptAlpha < 1) {
      this._promptAlpha = Math.min(1, this._promptAlpha + dt * 2);
    }
  }

  _onTypingDone() {
    if (this._resumeAfter) {
      this.bus.emit('narrative:resume');
    }

    const node = this.currentNode;
    if (node.ch && node.ch.length > 0) {
      this._showChoices(node.ch);
    } else {
      this.waiting = true;
    }
  }

  draw(ctx) {
    if (!this.active || !this.displayText) return;

    const font    = this._isVoice ? VOICE_FONT : NARRATOR_FONT;
    const lineH   = this._isVoice ? VOICE_LINE_H : NARRATOR_LINE_H;
    const textCol = this._isVoice ? COL_VOICE : COL_TEXT;

    ctx.font = font;
    const prepared = prepareWithSegments(this.displayText, font);
    const result   = layoutWithLines(prepared, BOX_MAX_W, lineH);
    this._lines    = result.lines;

    const speakerH  = this._speaker ? 20 : 0;
    const promptH   = (this.waiting || this.showingChoices) ? 24 : 0;
    const textH     = result.height || lineH;
    const totalH    = BOX_PAD_Y + speakerH + textH + promptH + BOX_PAD_Y;
    const boxTop    = BOX_BOTTOM - totalH;

    // Gradient background
    const grad = ctx.createLinearGradient(0, boxTop - 40, 0, BOX_BOTTOM);
    grad.addColorStop(0, COL_BG_END);
    grad.addColorStop(0.25, COL_BG_START);
    grad.addColorStop(1, COL_BG_START);
    ctx.fillStyle = grad;
    ctx.fillRect(0, boxTop - 40, CANVAS_W, totalH + 40);

    let cursorY = boxTop + BOX_PAD_Y;

    // Speaker label
    if (this._speaker) {
      ctx.font = SPEAKER_FONT;
      ctx.fillStyle = COL_SPEAKER;
      ctx.textBaseline = 'top';
      ctx.fillText(this._speaker.toUpperCase(), BOX_PAD_X, cursorY);
      cursorY += speakerH;
    }

    // Narrative text
    ctx.font = font;
    ctx.fillStyle = textCol;
    ctx.textBaseline = 'top';

    for (let i = 0; i < this._lines.length; i++) {
      ctx.fillText(this._lines[i].text, BOX_PAD_X, cursorY + i * lineH);
    }

    cursorY += textH;

    // Prompt
    if (this.waiting && !this.showingChoices) {
      ctx.font = PROMPT_FONT;
      ctx.fillStyle = COL_PROMPT;
      ctx.globalAlpha = this._promptAlpha * 0.7;
      ctx.fillText('— click or press space —', BOX_PAD_X, cursorY + 8);
      ctx.globalAlpha = 1;
    }
  }

  _showChoices(choices) {
    this.showingChoices = true;
    this.choicesEl.classList.remove('hidden');
    this.choicesEl.innerHTML = '';

    choices.forEach((ch, i) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = ch.l;
      btn.style.opacity = '0';
      btn.style.transition = 'opacity 0.3s ease, transform 0.25s ease, color 0.25s ease';

      btn.addEventListener('click', () => {
        if (ch.route) this.bus.emit('route', ch.route);
        if (ch.flag)  this.bus.emit('flag', ch.flag);
        this.showingChoices = false;
        this.choicesEl.classList.add('hidden');
        if (ch.action) {
          // Action handler manages next state; just clean up without scene:end
          this.active = false;
          this._lines = [];
          this.bus.emit('action', ch.action);
        } else if (ch.nx) {
          this.goNode(ch.nx);
        }
      });

      this.choicesEl.appendChild(btn);
      setTimeout(() => { btn.style.opacity = '1'; }, 150 + i * 120);
    });
  }

  advance() {
    if (!this.active || this.blocked) return;

    if (this.typing) {
      this.charIndex = this.fullText.length;
      this.displayText = this.fullText;
      this.typing = false;
      this._onTypingDone();
      return;
    }

    if (this.showingChoices) return;

    if (this.waiting) {
      const node = this.currentNode;
      if (node.end) {
        this._end(node.el);
        return;
      }
      if (node.nx) {
        this.goNode(node.nx);
      } else {
        this._end();
      }
    }
  }

  _end(label) {
    this.active = false;
    this._lines = [];
    this.choicesEl.classList.add('hidden');
    this.bus.emit('scene:end', { label });
    if (this.onEnd) this.onEnd(label);
  }

  hide() {
    this.active = false;
    this._lines = [];
    this.choicesEl.classList.add('hidden');
  }
}
