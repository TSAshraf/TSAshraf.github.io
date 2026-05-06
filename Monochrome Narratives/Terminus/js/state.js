/* ═══════════════════════════════════════
   STATE — Loop, throw, and population tracking
   ═══════════════════════════════════════ */

// Named passenger IDs
export const PASSENGER_IDS = [
  'talker', 'counter', 'liar', 'mother', 'sleeper', 'mute'
];

// Unnamed passenger types
const UNNAMED_INITIAL = [
  // Followers
  { id: 'f1', type: 'follower', car: 1, label: 'a woman clutching her bag' },
  { id: 'f2', type: 'follower', car: 2, label: 'a man in a grey coat' },
  { id: 'f3', type: 'follower', car: 0, label: 'someone hunched in their seat' },
  // Panickers
  { id: 'p1', type: 'panicker', car: 1, label: 'a young man pacing the aisle' },
  { id: 'p2', type: 'panicker', car: 3, label: 'a woman pulling at the windows' },
  { id: 'p3', type: 'panicker', car: 0, label: 'someone crying by the door' },
  // Still ones
  { id: 's1', type: 'still', car: 3, label: 'a figure staring at nothing' },
  { id: 's2', type: 'still', car: 4, label: 'someone sitting very still' },
  // The child
  { id: 'child', type: 'child', car: 2, label: 'the child' },
];

// Where named passengers sit (car assignments by default)
const NAMED_DEFAULTS = {
  talker:  { car: 0, seatIndex: 2 },
  counter: { car: 1, seatIndex: 1 },
  liar:    { car: 1, seatIndex: 3 },
  mother:  { car: 2, seatIndex: 1 },
  sleeper: { car: 3, seatIndex: 2 },
  mute:    { car: 2, seatIndex: 3 },
};

export class GameState {
  constructor() {
    this.reset();
  }

  reset() {
    // Loop tracking
    this.loopCount = 0;
    this.totalThrows = 0;
    this.selfThrowCount = 0;

    // Per-passenger throw counts
    this.throwCounts = {};
    for (const id of PASSENGER_IDS) {
      this.throwCounts[id] = 0;
    }

    // Named passenger positions (car, seatIndex)
    this.namedPositions = {};
    for (const id of PASSENGER_IDS) {
      this.namedPositions[id] = { ...NAMED_DEFAULTS[id] };
    }

    // Unnamed passengers still present
    this.unnamed = UNNAMED_INITIAL.map(u => ({ ...u }));

    // Flags
    this.flags = new Set();

    // Do-nothing tracking
    this.inactivityLoops = 0;        // loops in a row with no action
    this.hasActedThisLoop = false;
    this.doNothingPhase = 0;         // 0-5, escalating

    // Dialogue history (which nodes have been visited per passenger per tier)
    this.dialogueVisited = {};

    // Whether the player has thrown themselves
    this.hasJumped = false;
  }

  // ── Loop Management ──

  nextLoop() {
    this.loopCount++;

    // Track inactivity
    if (!this.hasActedThisLoop) {
      this.inactivityLoops++;
      this._updateDoNothingPhase();
    } else {
      this.inactivityLoops = 0;
      this.doNothingPhase = 0;
    }
    this.hasActedThisLoop = false;

    // Thin unnamed population
    this._thinPopulation();

    // Update named passenger positions based on throw counts
    this._updatePositions();
  }

  markAction() {
    this.hasActedThisLoop = true;
  }

  // ── Throw Management ──

  throwPassenger(id) {
    this.throwCounts[id]++;
    this.totalThrows++;
    this.hasActedThisLoop = true;
  }

  throwSelf() {
    this.selfThrowCount++;
    this.hasActedThisLoop = true;
  }

  getThrowTier(id) {
    const count = this.throwCounts[id] || 0;
    if (count === 0) return 0;
    if (count === 1) return 1;
    if (count === 2) return 2;
    if (count === 3) return 3;
    if (count === 4) return 4;
    return 5; // 5+
  }

  getSelfThrowTier() {
    const count = this.selfThrowCount;
    if (count === 0) return 0;
    if (count === 1) return 1;
    if (count === 2) return 2;
    if (count === 3) return 3;
    return 4; // 4+
  }

  // ── Population Thinning ──

  _thinPopulation() {
    // Every 2-3 loops, remove an unnamed passenger
    // Order: panickers first, then followers, then still ones
    // The child never disappears
    if (this.loopCount < 3) return;
    if (this.loopCount % 2 !== 0) return;

    const removable = this.unnamed.filter(u => u.type !== 'child');
    if (removable.length === 0) return;

    // Priority: panickers → still → followers
    const priority = ['panicker', 'still', 'follower'];
    for (const type of priority) {
      const candidates = removable.filter(u => u.type === type);
      if (candidates.length > 0) {
        // Remove the one in the highest-numbered car (drifting toward sealed car)
        candidates.sort((a, b) => b.car - a.car);
        const toRemove = candidates[0];
        this.unnamed = this.unnamed.filter(u => u.id !== toRemove.id);
        return;
      }
    }
  }

  // ── Position Updates Based on Throw Count ──

  _updatePositions() {
    // The Mute moves closer to the player (car 2, i.e. Car 3) over throws
    const muteThrows = this.throwCounts.mute;
    if (muteThrows >= 1) {
      this.namedPositions.mute.car = 2;
      this.namedPositions.mute.seatIndex = 2; // closer
    }

    // The Mother moves toward the door after throws
    const motherThrows = this.throwCounts.mother;
    if (motherThrows >= 3) {
      this.namedPositions.mother.seatIndex = 0; // by the door
    }

    // The Sleeper moves closer to the door
    const sleeperThrows = this.throwCounts.sleeper;
    if (sleeperThrows >= 3) {
      this.namedPositions.sleeper.seatIndex = 0;
    }
  }

  // ── Do-Nothing Path ──

  _updateDoNothingPhase() {
    if (this.inactivityLoops >= 10) this.doNothingPhase = 5;
    else if (this.inactivityLoops >= 7) this.doNothingPhase = 4;
    else if (this.inactivityLoops >= 5) this.doNothingPhase = 3;
    else if (this.inactivityLoops >= 3) this.doNothingPhase = 2;
    else if (this.inactivityLoops >= 1) this.doNothingPhase = 1;
  }

  // ── Serialization ──

  serialize() {
    return {
      loopCount: this.loopCount,
      totalThrows: this.totalThrows,
      selfThrowCount: this.selfThrowCount,
      throwCounts: { ...this.throwCounts },
      unnamed: this.unnamed.map(u => ({ ...u })),
      flags: [...this.flags],
      inactivityLoops: this.inactivityLoops,
      doNothingPhase: this.doNothingPhase,
      hasJumped: this.hasJumped,
      version: 1,
    };
  }

  deserialize(data) {
    if (!data || data.version !== 1) return;
    this.loopCount = data.loopCount || 0;
    this.totalThrows = data.totalThrows || 0;
    this.selfThrowCount = data.selfThrowCount || 0;
    this.throwCounts = data.throwCounts || {};
    this.unnamed = data.unnamed || [];
    this.flags = new Set(data.flags || []);
    this.inactivityLoops = data.inactivityLoops || 0;
    this.doNothingPhase = data.doNothingPhase || 0;
    this.hasJumped = data.hasJumped || false;
    this._updatePositions();
  }
}
