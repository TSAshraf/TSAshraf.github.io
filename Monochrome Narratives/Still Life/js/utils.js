/* ═══════════════════════════════════════
   UTILS — RNG, EventBus, easing helpers
   ═══════════════════════════════════════ */

// ── Seeded pseudo-random number generator ──
export class SeededRNG {
  constructor(seed) {
    this.seed = seed % 2147483647;
    if (this.seed <= 0) this.seed += 2147483646;
  }

  next() {
    this.seed = (this.seed * 16807) % 2147483647;
    return (this.seed - 1) / 2147483646;
  }

  range(min, max) {
    return min + this.next() * (max - min);
  }

  int(min, max) {
    return Math.floor(this.range(min, max + 1));
  }
}

// ── Lightweight event bus ──
export class EventBus {
  constructor() {
    this._listeners = {};
  }

  on(event, fn) {
    (this._listeners[event] ||= []).push(fn);
    return () => this.off(event, fn);
  }

  off(event, fn) {
    const arr = this._listeners[event];
    if (arr) this._listeners[event] = arr.filter(f => f !== fn);
  }

  emit(event, data) {
    (this._listeners[event] || []).forEach(fn => fn(data));
  }

  clear() {
    this._listeners = {};
  }
}

// ── Easing functions ──
export const ease = {
  linear: t => t,
  inQuad: t => t * t,
  outQuad: t => t * (2 - t),
  inOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  inCubic: t => t * t * t,
  outCubic: t => (--t) * t * t + 1,
};

// ── Utility helpers ──
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

// ── Save manager ──
export const SaveManager = {
  KEY: 'stillLife_save',

  save(data) {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(data));
    } catch (e) { /* silent */ }
  },

  load() {
    try {
      const raw = localStorage.getItem(this.KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  },

  clear() {
    try { localStorage.removeItem(this.KEY); } catch (e) { /* silent */ }
  },

  hasSave() {
    return this.load() !== null;
  }
};
