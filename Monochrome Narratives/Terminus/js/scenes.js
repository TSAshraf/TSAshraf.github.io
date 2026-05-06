/* ═══════════════════════════════════════
   SCENES — TrainScene, HallucinationScene
   ═══════════════════════════════════════ */

import {
  CANVAS_W, CANVAS_H, CARS, CHAR,
  WALK_SPEED, INTERACT_RANGE, DOOR_RANGE,
  CAR_TRANSITION_DURATION, RESET_FADE_DURATION,
} from './config.js';
import {
  drawCarInterior, drawPassengerSilhouette, drawCharacter,
  drawInteractPrompt, drawCarTransition, drawHallucination,
  drawResetOverlay,
} from './renderer.js';
import { NarrativeController } from './narrative.js';
import {
  PASSENGERS, OPENING, getCarDescription, getCarActions,
  getThrowNarration, getSelfThrowNarration, getPostSelfThrow,
  getWindowNarration, getSealedCarNarration, getDoNothingNarration,
} from './data.js';
import { clamp } from './utils.js';

// ─────────────────────────────────────
// Seat positions within a car (screen X)
// ─────────────────────────────────────

const SEAT_POSITIONS = [
  // Left bank
  { x: CARS.wallLeft + 75, type: 'seated', bank: 'left' },     // seat 0
  { x: CARS.wallLeft + 195, type: 'seated', bank: 'left' },    // seat 1
  { x: CARS.wallLeft + 315, type: 'seated', bank: 'left' },    // seat 2
  // Right bank
  { x: CANVAS_W * 0.6 + 45, type: 'seated', bank: 'right' },  // seat 3
  { x: CANVAS_W * 0.6 + 165, type: 'seated', bank: 'right' }, // seat 4
  { x: CANVAS_W * 0.6 + 285, type: 'seated', bank: 'right' }, // seat 5
];

const DOOR_LEFT_X = 35;
const DOOR_RIGHT_X = CANVAS_W - 35;

// ─────────────────────────────────────
// TrainScene — main game scene
// ─────────────────────────────────────

export class TrainScene {
  constructor(ctx, bus, gameState) {
    this.ctx = ctx;
    this.bus = bus;
    this.gs = gameState;

    // Player position
    this.currentCar = 2; // start in Car 3 (index 2)
    this.playerX = CANVAS_W / 2;
    this.walking = false;
    this.animTime = 0;
    this.facing = 1;

    // Narrative
    this.narrative = new NarrativeController(bus);

    // Scene state
    this.mode = 'explore';  // explore | narrative | transition | actions | throwing | resetting
    this.transitionTimer = 0;
    this.transitionTarget = -1;
    this.nearestPassenger = null;
    this.nearestPassengerDist = Infinity;
    this.interactAlpha = 0;

    // Action menu state
    this.showingActions = false;

    // Event listeners
    this._onSceneEnd = (data) => this._handleSceneEnd(data);
    this._onAction = (action) => this._handleAction(action);
    bus.on('scene:end', this._onSceneEnd);
    bus.on('action', this._onAction);

    // Flags
    this.done = false;
    this.requestReset = false;
    this.requestHallucination = false;

    // Opening sequence flag
    this._needsOpening = (gameState.loopCount === 0);
    this._openingDone = false;
    this._needsCarDesc = false;
    this._inactivityTimer = 0;

    // Start with opening or car description
    if (this._needsOpening) {
      this.mode = 'narrative';
      this.narrative.load(OPENING, 'start');
    } else {
      this._showCarDescription();
    }
  }

  // ── Update ──

  update(dt, input) {
    this.animTime += dt;

    switch (this.mode) {
      case 'explore':
        this._updateExplore(dt, input);
        break;

      case 'narrative':
        this.narrative.update(dt);
        if (input.advance) {
          this.narrative.advance();
        }
        break;

      case 'actions':
        // Handled by DOM choices; narrative handles input
        this.narrative.update(dt);
        if (input.advance) {
          this.narrative.advance();
        }
        break;

      case 'transition':
        this.transitionTimer += dt;
        if (this.transitionTimer >= CAR_TRANSITION_DURATION) {
          const cameFromHigher = this.transitionTarget < this.currentCar;
          this.currentCar = this.transitionTarget;
          // Enter from the side we came from
          this.playerX = cameFromHigher
            ? CANVAS_W - CARS.wallLeft - 80   // came from higher car, enter from right
            : CARS.wallLeft + 80;              // came from lower car, enter from left
          this.mode = 'narrative';
          this._showCarDescription();
        }
        break;

      case 'resetting':
        this.transitionTimer += dt;
        if (this.transitionTimer >= RESET_FADE_DURATION) {
          this.requestReset = true;
        }
        break;
    }

    // Track inactivity
    if (this.mode === 'explore') {
      this._inactivityTimer += dt;
    }

    // Update interact prompt
    if (this.nearestPassenger && this.nearestPassengerDist < INTERACT_RANGE && this.mode === 'explore') {
      this.interactAlpha = Math.min(1, this.interactAlpha + dt * 4);
    } else {
      this.interactAlpha = Math.max(0, this.interactAlpha - dt * 4);
    }
  }

  _updateExplore(dt, input) {
    const narrativeActive = this.narrative.active &&
      (this.narrative.typing || this.narrative.waiting || this.narrative.showingChoices);

    if (narrativeActive) {
      this.walking = false;
      if (input.advance) {
        this.narrative.advance();
      }
      this.narrative.update(dt);
      return;
    }

    // Walking
    if (input.right) {
      this.walking = true;
      this.facing = 1;
      this.playerX += WALK_SPEED * dt;
    } else if (input.left) {
      this.walking = true;
      this.facing = -1;
      this.playerX -= WALK_SPEED * dt;
    } else {
      this.walking = false;
    }

    this.playerX = clamp(this.playerX, CARS.wallLeft + 20, CARS.wallRight - 20);

    // Check door proximity
    if (this.playerX <= CARS.wallLeft + 30 && this.currentCar > 0) {
      this._transitionToCar(this.currentCar - 1);
      return;
    }
    if (this.playerX >= CARS.wallRight - 30 && this.currentCar < 4) {
      this._transitionToCar(this.currentCar + 1);
      return;
    }

    // Find nearest passenger
    this._findNearestPassenger();

    // Interact
    if (input.advance && !narrativeActive) {
      this._inactivityTimer = 0;
      if (this.nearestPassenger && this.nearestPassengerDist < INTERACT_RANGE) {
        this._showPassengerActions(this.nearestPassenger);
      } else {
        this._showCarActionMenu();
      }
    }
  }

  // ── Passenger Finding ──

  _getPassengersInCar(carIndex) {
    const passengers = [];

    // Named passengers
    for (const [id, pos] of Object.entries(this.gs.namedPositions)) {
      if (pos.car === carIndex) {
        const seatPos = SEAT_POSITIONS[pos.seatIndex] || SEAT_POSITIONS[0];
        const tier = this.gs.getThrowTier(id);
        const type = tier >= 5 ? 'byDoor' : (tier >= 3 ? 'standing' : 'seated');
        passengers.push({
          id,
          x: tier >= 5 ? DOOR_RIGHT_X - 30 : seatPos.x,
          type,
          named: true,
          tier,
        });
      }
    }

    // Unnamed passengers
    for (const u of this.gs.unnamed) {
      if (u.car === carIndex) {
        const seatIdx = (passengers.length + 3) % SEAT_POSITIONS.length;
        const seatPos = SEAT_POSITIONS[seatIdx] || SEAT_POSITIONS[4];
        passengers.push({
          id: u.id,
          x: seatPos.x,
          type: u.type === 'panicker' ? 'standing' : 'seated',
          named: false,
          label: u.label,
        });
      }
    }

    return passengers;
  }

  _findNearestPassenger() {
    const passengers = this._getPassengersInCar(this.currentCar)
      .filter(p => p.named);
    let nearest = null;
    let nearestDist = Infinity;

    for (const p of passengers) {
      const dist = Math.abs(this.playerX - p.x);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = p;
      }
    }

    this.nearestPassenger = nearest;
    this.nearestPassengerDist = nearestDist;
  }

  // ── Actions ──

  _showPassengerActions(passenger) {
    const id = passenger.id;
    const tier = this.gs.getThrowTier(id);
    const p = PASSENGERS[id];

    // Check if at auto-throw tier (tier 5+)
    if (tier >= 5) {
      // Auto-throw: play the tier 5 dialogue which includes the throw
      this._talkToPassenger(id);
      return;
    }

    // Build action choices
    const choices = [];

    choices.push({
      l: `Talk to ${p.name.toLowerCase()}`,
      nx: '__talk__',
      action: `talk:${id}`,
    });

    choices.push({
      l: `Throw ${p.name.toLowerCase()}`,
      nx: '__throw__',
      action: `throw:${id}`,
    });

    choices.push({
      l: 'Walk away',
      nx: '__cancel__',
      action: 'cancel',
    });

    // Show as narrative choices
    const nodes = {
      start: {
        t: p.ambient[Math.min(tier, 5)] || p.ambient[0] || `${p.name} is here.`,
        ch: choices,
      },
      __talk__: { t: '', end: true, el: 'menu' },
      __throw__: { t: '', end: true, el: 'menu' },
      __cancel__: { t: '', end: true, el: 'menu' },
    };

    this.mode = 'actions';
    this.narrative.load(nodes, 'start');
  }

  _showCarActionMenu() {
    const actions = getCarActions(this.currentCar, this.gs);
    const choices = actions.map(a => ({
      l: a.l,
      nx: `__action_${a.action}__`,
      action: `${a.action}${a.target !== undefined ? ':' + a.target : ''}`,
    }));

    choices.push({ l: 'Never mind', nx: '__cancel__', action: 'cancel' });

    const nodes = { start: { t: '', ch: choices } };
    // Add end nodes for each action
    for (const a of actions) {
      nodes[`__action_${a.action}__`] = { t: '', end: true, el: 'menu' };
    }
    nodes.__cancel__ = { t: '', end: true, el: 'menu' };

    this.mode = 'actions';
    this.narrative.load(nodes, 'start');
  }

  _talkToPassenger(id) {
    const tier = this.gs.getThrowTier(id);
    const p = PASSENGERS[id];

    // Find the best dialogue tier (use highest available <= current tier)
    let dialogueTier = 0;
    for (const t of [0, 1, 2, 3, 4, 5]) {
      if (t <= tier && p.dialogue[t]) {
        dialogueTier = t;
      }
    }

    const nodes = p.dialogue[dialogueTier];
    if (!nodes) return;

    this.gs.markAction();
    this.mode = 'narrative';
    this.narrative.load(nodes, 'start');
  }

  _throwPassenger(id) {
    const tier = this.gs.getThrowTier(id);
    const nodes = getThrowNarration(id, tier);

    this.gs.throwPassenger(id);
    this.gs.markAction();
    this.mode = 'narrative';
    this.narrative.load(nodes, 'start');
  }

  _throwSelf() {
    const tier = this.gs.getSelfThrowTier();
    const nodes = getSelfThrowNarration(tier);

    this.gs.throwSelf();
    this.gs.markAction();
    this.gs.hasJumped = true;
    this.mode = 'narrative';
    this.narrative.load(nodes, 'start');
  }

  // ── Scene End Handling ──

  _handleSceneEnd(data) {
    const label = data && data.label;

    if (label === 'opening') {
      this._openingDone = true;
      this._showCarDescription();
      return;
    }

    if (label === 'car') {
      this.mode = 'explore';
      this.narrative.hide();
      return;
    }

    if (label === 'menu') {
      // Action was selected — handled by _handleAction
      this.mode = 'explore';
      this.narrative.hide();
      return;
    }

    if (label === 'talk') {
      this.mode = 'explore';
      this.narrative.hide();
      return;
    }

    if (label === 'window' || label === 'sealed') {
      this.mode = 'explore';
      this.narrative.hide();
      return;
    }

    if (label === 'thrown' || label && label.startsWith('throw_')) {
      // Passenger thrown — trigger reset
      this._startReset();
      return;
    }

    if (label === 'self_throw') {
      // Self throw — trigger hallucination
      this.requestHallucination = true;
      return;
    }

    if (label === 'returned') {
      // After self-throw + hallucination, trigger reset
      this.narrative.hide();
      this._startReset();
      return;
    }

    if (label === 'reset') {
      this.mode = 'explore';
      this.narrative.hide();
      return;
    }

    if (label === 'donothing') {
      this.mode = 'explore';
      this.narrative.hide();
      return;
    }

    if (label === 'ending_donothing') {
      // The do-nothing ending
      this.done = true;
      return;
    }

    // Default: return to explore
    this.mode = 'explore';
    this.narrative.hide();
  }

  _handleAction(actionStr) {
    if (!actionStr) return;

    const [action, target] = actionStr.split(':');

    switch (action) {
      case 'talk':
        this._talkToPassenger(target);
        break;

      case 'throw':
        this._throwPassenger(target);
        break;

      case 'self_throw':
        this._throwSelf();
        break;

      case 'window':
        this.mode = 'narrative';
        this.narrative.load(getWindowNarration(this.gs), 'start');
        this.gs.markAction();
        break;

      case 'sit':
        // Sitting is deliberate inaction — don't mark as action
        this.mode = 'explore';
        this.narrative.hide();
        break;

      case 'sealed_approach':
        this.mode = 'narrative';
        this.narrative.load(getSealedCarNarration('approach'), 'start');
        this.gs.markAction();
        break;

      case 'sealed_touch':
        this.mode = 'narrative';
        this.narrative.load(getSealedCarNarration('touch'), 'start');
        this.gs.markAction();
        break;

      case 'sealed_listen':
        this.mode = 'narrative';
        this.narrative.load(getSealedCarNarration('listen'), 'start');
        this.gs.markAction();
        break;

      case 'sealed_knock':
        this.mode = 'narrative';
        this.narrative.load(getSealedCarNarration('knock'), 'start');
        this.gs.markAction();
        break;

      case 'go_car':
        this._transitionToCar(parseInt(target));
        break;

      case 'cancel':
        this.mode = 'explore';
        this.narrative.hide();
        break;
    }
  }

  // ── Transitions ──

  _transitionToCar(targetCar) {
    if (targetCar < 0 || targetCar > 4) return;
    this.mode = 'transition';
    this.transitionTimer = 0;
    this.transitionTarget = targetCar;
  }

  _showCarDescription() {
    const desc = getCarDescription(this.currentCar, this.gs);
    this.mode = 'narrative';
    this.narrative.load(desc, 'start');
  }

  _startReset() {
    this.mode = 'resetting';
    this.transitionTimer = 0;
  }

  // ── Post-Hallucination ──

  returnFromHallucination() {
    this.currentCar = 2; // back to player's car
    this.playerX = CANVAS_W / 2;
    const tier = this.gs.getSelfThrowTier();
    const nodes = getPostSelfThrow(tier);
    this.mode = 'narrative';
    this.narrative.load(nodes, 'start');
  }

  // ── Post-Reset ──

  startNewLoop() {
    this.currentCar = 2;
    this.playerX = CANVAS_W / 2;
    this.requestReset = false;
    this.requestHallucination = false;
    this._pendingReset = false;
    this._inactivityTimer = 0;

    // Check do-nothing phase
    const doNothingNarr = getDoNothingNarration(this.gs.doNothingPhase);
    if (doNothingNarr && this.gs.doNothingPhase >= 1) {
      this.mode = 'narrative';
      this.narrative.load(doNothingNarr, 'start');
    } else {
      this._showCarDescription();
    }
  }

  // ── Draw ──

  draw() {
    const ctx = this.ctx;

    // Draw car interior
    drawCarInterior(ctx, this.currentCar, this.gs);

    // Draw passengers in this car
    const passengers = this._getPassengersInCar(this.currentCar);
    for (const p of passengers) {
      const isHighlighted = this.nearestPassenger && this.nearestPassenger.id === p.id &&
                            this.nearestPassengerDist < INTERACT_RANGE;
      drawPassengerSilhouette(ctx, p.x, CARS.floorY, p.type, {
        highlighted: isHighlighted,
        throwTier: p.tier || 0,
        passengerId: p.id,
      });
    }

    // Draw player character
    if (this.mode !== 'resetting') {
      drawCharacter(ctx, this.playerX, CARS.floorY, this.walking, this.animTime, this.facing);
    }

    // Interact prompt
    if (this.nearestPassenger && this.mode === 'explore') {
      drawInteractPrompt(ctx, this.nearestPassenger.x, CARS.floorY, this.interactAlpha);
    }

    // Narrative overlay
    this.narrative.draw(ctx);

    // Car transition overlay
    if (this.mode === 'transition') {
      const progress = this.transitionTimer / CAR_TRANSITION_DURATION;
      drawCarTransition(ctx, progress);
    }

    // Reset overlay
    if (this.mode === 'resetting') {
      const progress = this.transitionTimer / RESET_FADE_DURATION;
      drawResetOverlay(ctx, progress);
    }
  }

  destroy() {
    this.bus.off('scene:end', this._onSceneEnd);
    this.bus.off('action', this._onAction);
    this.narrative.hide();
  }
}

// ─────────────────────────────────────
// HallucinationScene — the red place
// ─────────────────────────────────────

export class HallucinationScene {
  constructor(ctx, bus, selfThrowTier) {
    this.ctx = ctx;
    this.bus = bus;
    this.tier = selfThrowTier;
    this.time = 0;
    this.done = false;

    // Duration varies by tier
    this.duration = this.tier >= 3 ? 12 : (this.tier >= 2 ? 8 : 5);
    if (this.tier >= 4) this.duration = 2; // 4+ is instant
  }

  update(dt, input) {
    this.time += dt;

    // Click/space to cut short (after minimum time)
    if (input.advance && this.time > 2) {
      this.done = true;
    }

    if (this.time >= this.duration) {
      this.done = true;
    }
  }

  draw() {
    const progress = clamp(this.time / this.duration, 0, 1);
    drawHallucination(this.ctx, progress, this.tier, this.time);
  }

  destroy() {
    // Nothing to clean up
  }
}
