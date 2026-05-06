/* ═══════════════════════════════════════
   DATA — All narrative content for Terminus
   Organised by passenger, throw tier, and
   game events (opening, reset, window, etc.)
   ═══════════════════════════════════════ */

// ─────────────────────────────────────
// OPENING — Loop 1, first scene
// ─────────────────────────────────────

export const OPENING = {
  start: {
    t: "You are on a train.",
    nx: 'o2',
  },
  o2: {
    t: "You don't remember boarding. The seat beneath you is real — firm, slightly worn at the edges, the kind of upholstery that holds the shape of everyone who's sat in it. The window to your left shows dark fields. No moon. Power lines run alongside the track, leaning slightly, connecting to nothing visible.",
    nx: 'o3',
  },
  o3: {
    t: "The PA crackles.",
    nx: 'o4',
    voice: 'pa',
  },
  o4: {
    t: '"The next station is Acheron. Estimated arrival time is not available. Please remain in your seats."',
    nx: 'o5',
    voice: 'pa',
  },
  o5: {
    t: "The carriage is half-full. A woman across the aisle is settling a child — tucking a coat around small shoulders, murmuring something you can't hear. Further down, a figure sits facing the window. Still. You can't tell if they're awake.",
    nx: 'o6',
  },
  o6: {
    t: "The train moves. It has always been moving.",
    end: true,
    el: 'opening',
  },
};

// ─────────────────────────────────────
// CAR DESCRIPTIONS — what the player sees
// entering each car for the first time in a loop
// ─────────────────────────────────────

export function getCarDescription(carIndex, gameState) {
  const loop = gameState.loopCount;
  const doNothing = gameState.doNothingPhase;

  // Do-nothing phase overrides
  if (doNothing >= 4) {
    return _getDoNothingCarDesc(carIndex, gameState);
  }

  switch (carIndex) {
    case 0: return _getCar1Desc(gameState);
    case 1: return _getCar2Desc(gameState);
    case 2: return _getCar3Desc(gameState);
    case 3: return _getCar4Desc(gameState);
    case 4: return _getCar5Desc(gameState);
    default: return { start: { t: "A car.", end: true, el: 'car' } };
  }
}

function _getCar1Desc(gs) {
  const talkerTier = gs.getThrowTier('talker');
  const unnamed = gs.unnamed.filter(u => u.car === 0);

  let text;
  if (gs.loopCount === 0) {
    text = "Car 1. The front of the train. A man is talking — not to anyone, to the air. His voice is steady, specific, the cadence of someone giving testimony. Nobody is listening.";
  } else if (gs.loopCount < 5) {
    text = "Car 1. The talker is in his seat. Still talking. " + (unnamed.length > 0 ? `${unnamed.length} others sit in scattered seats.` : "The other seats are empty.");
  } else {
    text = "Car 1." + (unnamed.length > 0 ? ` ${unnamed.length} remain.` : " Empty, except for the talker.");
  }

  if (talkerTier >= 5) {
    text = "Car 1. He's standing at the door. Still talking.";
  }

  return { start: { t: text, end: true, el: 'car' } };
}

function _getCar2Desc(gs) {
  const counterTier = gs.getThrowTier('counter');
  const liarTier = gs.getThrowTier('liar');
  const unnamed = gs.unnamed.filter(u => u.car === 1);

  let text;
  if (gs.loopCount === 0) {
    text = "Car 2. The most populated car. A young man sits by the window — the wall beside him is covered in scratches, tidy groups of five. Further down, a woman in a good coat sits with her legs crossed, completely at ease.";
  } else if (gs.loopCount < 5) {
    text = "Car 2. The counter is at his wall. The liar is in her seat." + (unnamed.length > 0 ? ` ${unnamed.length} others.` : "");
  } else {
    text = "Car 2." + (counterTier >= 5 ? " The wall is scratched smooth." : "") + (unnamed.length > 0 ? ` ${unnamed.length} remain.` : " Mostly empty now.");
  }

  return { start: { t: text, end: true, el: 'car' } };
}

function _getCar3Desc(gs) {
  const motherTier = gs.getThrowTier('mother');
  const muteTier = gs.getThrowTier('mute');
  const unnamed = gs.unnamed.filter(u => u.car === 2);

  let text;
  if (gs.loopCount === 0) {
    text = "Car 3. Your car. The woman with the child has finished settling them. She sits back. Her posture is the kind you learn — back straight, hands in lap, the practised stillness of someone used to waiting. The figure by the window hasn't moved.";
  } else if (motherTier >= 3) {
    text = "Car 3. The mother is by the door. The child sits alone in her old seat." + (muteTier >= 1 ? " The quiet one is near your seat." : "");
  } else {
    text = "Car 3. Your seat. The mother and her child. The quiet one by the window.";
  }

  return { start: { t: text, end: true, el: 'car' } };
}

function _getCar4Desc(gs) {
  const sleeperTier = gs.getThrowTier('sleeper');
  const unnamed = gs.unnamed.filter(u => u.car === 3);

  let text;
  if (gs.loopCount === 0) {
    text = "Car 4. Quieter. The lights flicker — not dramatically, just enough. A young woman is in a window seat, head against the glass. Eyes closed. Still. She could be dead except for her breathing.";
  } else if (sleeperTier >= 4) {
    text = "Car 4. The sleeper's eyes are open. She's facing the door." + (unnamed.length > 0 ? ` ${unnamed.length} others.` : "");
  } else if (sleeperTier >= 1) {
    text = "Car 4. The sleeper is in a different seat." + (unnamed.length > 0 ? ` ${unnamed.length} others sit quietly.` : " Quiet.");
  } else {
    text = "Car 4. The lights flicker. The sleeper hasn't moved." + (unnamed.length > 0 ? ` ${unnamed.length} others.` : "");
  }

  return { start: { t: text, end: true, el: 'car' } };
}

function _getCar5Desc(gs) {
  const unnamed = gs.unnamed.filter(u => u.car === 4);

  let text;
  if (gs.loopCount === 0) {
    text = "Car 5. The rear car. Mostly empty seats. The windows here show the landscape behind the train — where it's been. Except the landscape behind and ahead look the same. At the far end, a door. No handle on this side.";
  } else if (unnamed.length > 0) {
    text = `Car 5. ${unnamed.length} ${unnamed.length === 1 ? 'person remains' : 'people remain'}. The sealed door at the end.`;
  } else {
    text = "Car 5. Empty. The sealed door at the far end. No handle. No window. Just a door that doesn't open.";
  }

  return { start: { t: text, end: true, el: 'car' } };
}

function _getDoNothingCarDesc(carIndex, gs) {
  // Late do-nothing phase — third person, inventory style
  const carNum = carIndex + 1;
  if (gs.doNothingPhase >= 5) {
    const counts = _carPopCount(carIndex, gs);
    return { start: { t: `Car ${carNum}. ${counts}.`, end: true, el: 'car' } };
  }
  return { start: { t: `Car ${carNum}. The seated one enters.`, end: true, el: 'car' } };
}

function _carPopCount(carIndex, gs) {
  const named = Object.entries(gs.namedPositions)
    .filter(([_, p]) => p.car === carIndex)
    .map(([id]) => {
      const labels = { talker: 'the talker', counter: 'the counter', liar: 'the liar', mother: 'the mother', sleeper: 'the sleeper', mute: 'the quiet one' };
      return labels[id];
    });
  const unnamed = gs.unnamed.filter(u => u.car === carIndex);
  const parts = [...named];
  if (unnamed.length > 0) parts.push(`${unnamed.length} other${unnamed.length > 1 ? 's' : ''}`);
  return parts.length > 0 ? parts.join(', ') : 'empty';
}

// ─────────────────────────────────────
// PASSENGER DIALOGUES — per throw tier
// ─────────────────────────────────────

export const PASSENGERS = {

  // ═══════════════════════════════════
  // THE HELLMOUTH TALKER — Car 1
  // ═══════════════════════════════════

  talker: {
    name: 'The Talker',
    defaultCar: 1,
    ambient: {
      0: "He's talking. Not to you. To the air, to the seat beside him, to the room he's describing. His hands move when he describes dimensions.",
      1: "He's in the same seat. Still talking. He picks up from further along — the monologue has advanced. He was still going while he fell.",
      2: "He looks at you when you enter. Pauses for one beat. Then continues.",
      3: "He's quieter. The monologue has changed. He's describing something in the room now. Not the architecture. Something that moves.",
      5: "He's standing at the door. Still talking. His hand is on the handle.",
    },
    dialogue: {
      0: {
        start: {
          t: '"...and the ceiling was not high. The ceiling was the exact height of a man standing with his arms raised, which is to say the ceiling was designed, which is to say someone measured a man and used that measurement, and the man was not alive when they measured him, I think, because a living man would lower his arms..."',
          sp: 'the talker',
          ch: [
            { l: '"What are you talking about?"', nx: 't0a' },
            { l: '"Have you been there? The place you\'re describing?"', nx: 't0b' },
            { l: '"You sound insane."', nx: 't0c' },
          ],
        },
        t0a: {
          t: '"The room. I\'m talking about the room." He looks at you. First time he\'s focused on anyone. "The room with the low ceiling and the rows and the thing at the front that speaks. I\'m describing it. Someone should be describing it."',
          sp: 'the talker',
          end: true, el: 'talk',
        },
        t0b: {
          t: '"Been there." He tastes the word. "\'Been\' implies leaving. I\'m describing it, aren\'t I? Does a man who\'s left need to describe the place he\'s left? Or does he describe it because he hasn\'t?"',
          sp: 'the talker',
          nx: 't0b2',
        },
        t0b2: {
          t: '"I\'m being precise. The dimensions. The material. The arrangement. If I\'m precise enough, the description becomes proof. And proof is the opposite of faith. And faith is what the room runs on."',
          sp: 'the talker',
          end: true, el: 'talk',
        },
        t0c: {
          t: '"Yes. That\'s very useful, isn\'t it? For you. To decide that. Makes the train simpler." He smiles. It\'s a real smile. Warm, even. "The insane man in Car 1, talking about a room. Easy to dismiss. Easy to throw off a train, if it comes to that."',
          sp: 'the talker',
          end: true, el: 'talk',
        },
      },
      1: {
        start: {
          t: 'He\'s mid-sentence. Further along than where he was when you threw him — the monologue advanced during the fall.',
          ch: [
            { l: '"You\'re still talking."', nx: 't1a' },
            { l: '"What did you see when I threw you?"', nx: 't1b' },
          ],
        },
        t1a: {
          t: '"Did you think the fall would stop it?" He shakes his head. "I passed through it. On the way down. The room. I was falling and I was inside it. I was inside the description I was making."',
          sp: 'the talker',
          nx: 't1a2',
        },
        t1a2: {
          t: '"I got more details. The fall was very productive."',
          sp: 'the talker',
          end: true, el: 'talk',
        },
        t1b: {
          t: '"Your hands. And then the door. And then the wind, but the wind was brief. And then — red. Not the sky. Not the ground. The place between. The underneath."',
          sp: 'the talker',
          nx: 't1b2',
        },
        t1b2: {
          t: '"There were people. Seated. In rows. They were made of something I couldn\'t identify. Not flesh exactly. Older. Compressed. Like the people had been people for so long they\'d become geological."',
          sp: 'the talker',
          end: true, el: 'talk',
        },
      },
      3: {
        start: {
          t: '"...and there was one among the congregation who was not seated. Who was moving through the rows. Not walking — moving. In the way that a current moves through water. Displacing nothing. Touching everything..."',
          sp: 'the talker',
          nx: 't3a',
        },
        t3a: {
          t: 'He stops. Looks at you. "You. You move through the cars. Car to car. Talking to each of them. They face forward. You move behind them."',
          sp: 'the talker',
          nx: 't3b',
        },
        t3b: {
          t: '"I think you\'re the conductor."',
          sp: 'the talker',
          end: true, el: 'talk',
        },
      },
      5: {
        start: {
          t: '"...and the exit was part of the design, the exit was a feature of the room, the way a door in a church is a feature of the church, and the leaving was a form of worship, and the returning was a form of worship..."',
          sp: 'the talker',
          nx: 't5a',
        },
        t5a: {
          t: 'He walks through the door. Still talking. You hear him for three seconds after. Then the wind takes it.',
          end: true, el: 'throw_talker',
        },
      },
    },
  },

  // ═══════════════════════════════════
  // THE COUNTER — Car 2
  // ═══════════════════════════════════

  counter: {
    name: 'The Counter',
    defaultCar: 2,
    ambient: {
      0: "He's at his wall. Scratching tallies with something — a coin, a key. The groups are tidy. Organised. He's building something.",
      1: "There's a new section on the wall. A single mark, separated from the rest. A different kind of tally.",
      3: "His tallies have changed. The meticulous groups are looser. One section just says the same number, over and over.",
      5: "The wall is scratched smooth. No tallies. No groups. Just abrasion. He sits with his hands on his knees.",
    },
    dialogue: {
      0: {
        start: {
          t: 'He looks up from his wall. His fingertip is raw from scratching.',
          ch: [
            { l: '"What are you counting?"', nx: 'c0a' },
            { l: '"Have you found anything?"', nx: 'c0b' },
            { l: '"This seems pointless."', nx: 'c0c' },
          ],
        },
        c0a: {
          t: '"Resets. Events. Movements." He says it like you\'ve asked what language he speaks. "Every time the train does its thing — resets, loops, whatever word you want — I mark it. I note who was where. Who moved. What changed."',
          sp: 'the counter',
          nx: 'c0a2',
        },
        c0a2: {
          t: 'He gestures at the tallies. "Forty-seven resets. Seat distribution follows a pattern. Not predictable exactly, but bounded. There are rules." He looks at you with the intensity of someone who needs you to understand. "There are rules. That means there\'s a system. That means there\'s a way through."',
          sp: 'the counter',
          end: true, el: 'talk',
        },
        c0b: {
          t: '"Patterns. Several." He pulls you closer to the wall. "The unnamed ones — they drift. Toward the back. Every three to four resets, one of them moves a car further back. And then they\'re gone."',
          sp: 'the counter',
          nx: 'c0b2',
        },
        c0b2: {
          t: '"The sealed car. They go to the sealed car. I can\'t prove it. But the numbers work."',
          sp: 'the counter',
          end: true, el: 'talk',
        },
        c0c: {
          t: 'He flinches. Actually flinches. "It\'s not pointless. It\'s the only thing that isn\'t pointless. This is evidence. This is someone paying attention."',
          sp: 'the counter',
          nx: 'c0c2',
        },
        c0c2: {
          t: '"If there\'s ever an after — if someone finds this train, if something ends — this is proof that someone was trying to understand."',
          sp: 'the counter',
          end: true, el: 'talk',
        },
      },
      1: {
        start: {
          t: 'He stares at you. The new section on his wall has a single mark.',
          ch: [
            { l: '"I need your data."', nx: 'c1a' },
            { l: '"What did you observe during the fall?"', nx: 'c1b' },
          ],
        },
        c1a: {
          t: '"You threw me off a train and now you want my data." A beat. Then he laughs. It\'s not a good laugh. "Fine. Because you\'re right. Nobody else is doing this."',
          sp: 'the counter',
          nx: 'c1a2',
        },
        c1a2: {
          t: 'He shows you the new section. "That\'s you. That\'s what you did. I\'m tracking you now. You\'re the most significant variable on this train."',
          sp: 'the counter',
          end: true, el: 'talk',
        },
        c1b: {
          t: '"Duration: approximately four seconds subjective. Temperature: dropped sharply, then a sudden warmth. Visual: monochrome to red-spectrum transition at approximately second two."',
          sp: 'the counter',
          nx: 'c1b2',
        },
        c1b2: {
          t: '"I tried to count things on the way down. The rows. There were rows. I counted eleven before the reset." He marks something on the wall. Eleven scratches. "Eleven visible rows. In whatever that place is."',
          sp: 'the counter',
          end: true, el: 'talk',
        },
      },
      3: {
        start: {
          t: 'His tallies have collapsed. One section just repeats a single number.',
          ch: [
            { l: '"Your system is falling apart."', nx: 'c3a' },
            { l: 'Say nothing.', nx: 'c3b' },
          ],
        },
        c3a: {
          t: '"The system is fine. The system is — " He stops. Touches the repeated numbers. "I used to count everything. Resets. Seats. Movements. Now I just count... this. How many times."',
          sp: 'the counter',
          nx: 'c3a2',
        },
        c3a2: {
          t: '"Three is enough to establish a pattern. The pattern is: you will throw me again. The only variable is when."',
          sp: 'the counter',
          end: true, el: 'talk',
        },
        c3b: {
          t: 'You stand there. He stands there. He touches his tallies absently. "If I stop counting, I\'m just a man on a train." He says this to the wall. "If I\'m just a man on a train, then everything that\'s happening is just happening. Not a system. Not a pattern. Just — things, occurring."',
          sp: 'the counter',
          end: true, el: 'talk',
        },
      },
      5: {
        start: {
          t: 'The wall is scratched smooth. He looks up.',
          nx: 'c5a',
        },
        c5a: {
          t: 'He says a number. Just the number. Then stands, walks to the door, and waits. His hands are steady. His face is clear. He has counted himself down to a single data point.',
          end: true, el: 'throw_counter',
        },
      },
    },
  },

  // ═══════════════════════════════════
  // THE LIAR — Car 2
  // ═══════════════════════════════════

  liar: {
    name: 'The Liar',
    defaultCar: 2,
    ambient: {
      0: "She's sitting with her legs crossed, coat folded beside her, looking completely at ease — the only person on the train who doesn't seem distressed.",
      1: "She's less composed. Still performing, but the performance has cracks — she fidgets with her coat, she looks at the door.",
      3: "She's in the same seat but her coat is on the floor. She hasn't picked it up.",
      5: "She's standing. Looking at you. Her face is bare of any performance.",
    },
    dialogue: {
      0: {
        start: {
          t: 'She notices you immediately and smiles.',
          ch: [
            { l: '"Who are you?"', nx: 'l0a' },
            { l: '"You seem calm."', nx: 'l0b' },
            { l: '"Have you talked to the others?"', nx: 'l0c' },
          ],
        },
        l0a: {
          t: '"Margaret Chen. I\'m a publisher — independent press, mostly literary fiction, some poetry if it\'s good enough. I was on my way to a conference in — " She pauses. A micro-hesitation. " — well. Wherever the next stop was supposed to be."',
          sp: 'the liar',
          nx: 'l0a2',
        },
        l0a2: {
          t: '"I\'ve been on worse trains. The 11:40 from Kings Cross in February. A ferry in Crete that technically sank. This is inconvenient but I\'ve been inconvenienced before." None of this is true. You don\'t know that yet.',
          end: true, el: 'talk',
        },
        l0b: {
          t: '"I seem like whatever helps. Right now, calm helps. If panic helped, I\'d panic." She extends a hand. "Diana Osei. Psychotherapist. Retired, mostly." Different name. Different person. Same confidence. She doesn\'t blink.',
          sp: 'the liar',
          end: true, el: 'talk',
        },
        l0c: {
          t: '"The counter, yes. Sweet boy. I told him I was a statistician — we had a lovely conversation about sample bias. The man at the front who talks and talks — I listened for a while."',
          sp: 'the liar',
          nx: 'l0c2',
        },
        l0c2: {
          t: 'A shadow crosses her face. Brief. Gone. "He\'s describing somewhere real. I think. Somewhere very real that shouldn\'t be."',
          sp: 'the liar',
          end: true, el: 'talk',
        },
      },
      1: {
        start: {
          t: 'She looks at you. The performance has cracks.',
          ch: [
            { l: '"Which one were you? Margaret or Diana?"', nx: 'l1a' },
            { l: '"What was it like?"', nx: 'l1b' },
          ],
        },
        l1a: {
          t: '"Neither, if it matters. Both, if it helps." She fidgets with her coat. "I was Sarah Monroe. A teacher. Year 4. Twenty-seven children who needed me to be exactly the right version of a person for exactly the right moments."',
          sp: 'the liar',
          nx: 'l1a2',
        },
        l1a2: {
          t: 'She smiles, and it\'s the most honest expression you\'ve seen on her. "Or maybe I wasn\'t. Maybe that\'s another one. I\'ve been doing this so long I can\'t remember which face is under the others."',
          sp: 'the liar',
          end: true, el: 'talk',
        },
        l1b: {
          t: '"Being thrown off a train by a stranger?" She laughs. It\'s hollow. "It was fast. And then it was red. And then I was back here being someone."',
          sp: 'the liar',
          nx: 'l1b2',
        },
        l1b2: {
          t: '"Do you know what I saw, in the red? I saw an audience. Rows and rows of them. And I thought: finally, someone\'s watching. Isn\'t that horrible? I was falling through something awful and my first thought was: at least someone\'s paying attention."',
          sp: 'the liar',
          end: true, el: 'talk',
        },
      },
      3: {
        start: {
          t: 'Her coat is on the floor. She doesn\'t adjust herself when you approach.',
          ch: [
            { l: '"Tell me something real."', nx: 'l3a' },
          ],
        },
        l3a: {
          t: '"I had a sister. She died when I was fourteen. Leukaemia. Slow." No affect. No performance.',
          sp: 'the liar',
          nx: 'l3a2',
        },
        l3a2: {
          t: '"After she died I learned that if I was someone else, the grief couldn\'t find me. If I was confident, funny, someone with a different name — the grief would look for the girl whose sister died and that girl wasn\'t there."',
          sp: 'the liar',
          nx: 'l3a3',
        },
        l3a3: {
          t: '"I\'ve been someone else for twenty years. I don\'t remember stopping." She looks at you. "You\'re not going to stop throwing me, are you." It\'s not a question.',
          sp: 'the liar',
          end: true, el: 'talk',
        },
      },
      5: {
        start: {
          t: 'She tells you her name. Her real name. The original one. She says it once, clearly, looking at you.',
          nx: 'l5a',
        },
        l5a: {
          t: 'You hear it. You understand it. It sounds like a name that belongs to a person who exists, not a performance, not a shield, not a version. You will not remember it after the next reset. You know this. She knows this. She says it anyway.',
          nx: 'l5b',
        },
        l5b: {
          t: 'She walks to the door. Opens it. Steps through. The wind takes the sound of it. The name. Gone.',
          end: true, el: 'throw_liar',
        },
      },
    },
  },

  // ═══════════════════════════════════
  // THE MOTHER — Car 3
  // ═══════════════════════════════════

  mother: {
    name: 'The Mother',
    defaultCar: 3,
    ambient: {
      0: "She's settled the child. Sits with her back straight, hands in lap. She notices you looking. She notices everything.",
      1: "She sees you and her body changes — a tension in the shoulders, hands moving to the child.",
      2: "She's moved seats. Closer to the door. The child is in her old seat, with another passenger nearby.",
      3: "She's at the door when the loop starts. Standing. The child doesn't look at her.",
      4: "She doesn't look at the child. She doesn't look at you. She's by the door.",
      5: "She's at the door. She's already standing. Her hand is on the handle.",
    },
    dialogue: {
      0: {
        start: {
          t: 'She looks up. The child stirs but doesn\'t wake.',
          ch: [
            { l: '"Are you alright?"', nx: 'm0a' },
            { l: '"How long have you been on this train?"', nx: 'm0b' },
            { l: '"Do you know what\'s happening?"', nx: 'm0c' },
          ],
        },
        m0a: {
          t: '"We\'re fine. We\'re both fine." She says it like a gate closing. Not rude — complete. "Have you tried the front car? Someone up there seems to know things. Or thinks he does."',
          sp: 'the mother',
          end: true, el: 'talk',
        },
        m0b: {
          t: '"How long have you?" You don\'t have an answer. She nods as if you\'ve confirmed something. "The child fell asleep twenty minutes ago. Or an hour. The light hasn\'t changed. I\'ve stopped using the light."',
          sp: 'the mother',
          end: true, el: 'talk',
        },
        m0c: {
          t: '"The train hasn\'t stopped. That\'s what\'s happening." She looks at the window. "I\'ve been on delayed trains before. This isn\'t a delay. A delay implies an arrival."',
          sp: 'the mother',
          nx: 'm0c2',
        },
        m0c2: {
          t: '"I\'m keeping her settled. That\'s what I can do. If you find out more, I\'d like to know. But don\'t tell her."',
          sp: 'the mother',
          end: true, el: 'talk',
        },
      },
      1: {
        start: {
          t: 'She\'s in her seat. The child is beside her. She sees you and her body tenses.',
          ch: [
            { l: '"I\'m sorry."', nx: 'm1a' },
            { l: '"What did you see when you fell?"', nx: 'm1b' },
            { l: '"I had to."', nx: 'm1c' },
          ],
        },
        m1a: {
          t: '"You picked me up. You carried me to the door. You opened the door and you put me through it." A pause. "The wind was very loud. I could hear her crying from inside the car. And then I couldn\'t hear anything. And then I was here."',
          sp: 'the mother',
          nx: 'm1a2',
        },
        m1a2: {
          t: 'The child is awake, watching you. Not afraid. Assessing. "I don\'t need your sorry. I need you not to do it again."',
          sp: 'the mother',
          end: true, el: 'talk',
        },
        m1b: {
          t: '"Dark. And then not dark. Something red — I thought it was lights, emergency lights, the way they look through closed eyes. But my eyes were open." She stops. "I don\'t want to talk about what I saw."',
          sp: 'the mother',
          end: true, el: 'talk',
        },
        m1c: {
          t: '"No you didn\'t." She says it without anger. Just a correction. Like telling someone they\'ve got the time wrong. "You walked over here, and you decided, and you did it. That\'s not \'had to.\' I know what \'had to\' looks like. I\'m a mother."',
          sp: 'the mother',
          end: true, el: 'talk',
        },
      },
      3: {
        start: {
          t: 'She\'s at the door when the loop starts. Standing. The child is across the car. The child doesn\'t look at her.',
          ch: [
            { l: '"Your daughter — she\'s not coming to you."', nx: 'm3a' },
            { l: '"You don\'t have to stand there."', nx: 'm3b' },
            { l: '"I\'m not going to this time."', nx: 'm3c' },
          ],
        },
        m3a: {
          t: '"I know." Flat. No grief in it — or all grief, compressed to a frequency you can\'t hear. "The first time, she cried. The second time, she watched. Now she sits with the other woman."',
          sp: 'the mother',
          nx: 'm3a2',
        },
        m3a2: {
          t: '"She\'ll be fine. Children are made to survive their mothers. That\'s the whole design."',
          sp: 'the mother',
          end: true, el: 'talk',
        },
        m3b: {
          t: '"It\'s easier. For both of us." She\'s looking out the door\'s window. "I\'ve seen it three times now. The red place. It\'s not random. It has structure. Rows. Like seating."',
          sp: 'the mother',
          nx: 'm3b2',
        },
        m3b2: {
          t: '"I think it\'s where this train is. I think we\'re inside it and we don\'t know."',
          sp: 'the mother',
          end: true, el: 'talk',
        },
        m3c: {
          t: 'She laughs. Short, dry, gone. "You will. Or you won\'t. It doesn\'t matter. Someone does something or no one does anything and the train doesn\'t stop either way."',
          sp: 'the mother',
          nx: 'm3c2',
        },
        m3c2: {
          t: 'She sits on the floor by the door. Not defeated. Resting. "Do what you want. I\'ll be here."',
          sp: 'the mother',
          end: true, el: 'talk',
        },
      },
      4: {
        start: {
          t: 'She doesn\'t look at you. She doesn\'t look at the child.',
          ch: [
            { l: '"Tell me about before the train."', nx: 'm4a' },
          ],
        },
        m4a: {
          t: 'She\'s quiet for a long time. "There was a house. Two bedrooms. The garden had a wall that was too low — I kept meaning to fix it. She could climb it. She did climb it, once. Fell on the other side into the neighbour\'s roses."',
          sp: 'the mother',
          nx: 'm4a2',
        },
        m4a2: {
          t: '"I heard her crying and I was out the door before I knew I was standing. That\'s what it is. You don\'t decide. You\'re just already moving."',
          sp: 'the mother',
          nx: 'm4a3',
        },
        m4a3: {
          t: '"I can\'t do that anymore. You\'ve moved me too many times. The part that moves without thinking — you\'ve worn it out."',
          sp: 'the mother',
          end: true, el: 'talk',
        },
      },
      5: {
        start: {
          t: 'She\'s at the door. Already standing. When you enter the car she takes a step toward the door.',
          nx: 'm5a',
        },
        m5a: {
          t: 'She doesn\'t speak. She doesn\'t look at the child. The child is in the same seat. The child has stopped pretending to sleep. The child watches.',
          nx: 'm5b',
        },
        m5b: {
          t: 'She opens the door. The wind comes in. She looks at you — not accusation, not forgiveness, not anything you can name. Recognition, maybe. The way you\'d recognise a commute. She steps through. The door closes.',
          end: true, el: 'throw_mother',
        },
      },
    },
  },

  // ═══════════════════════════════════
  // THE SLEEPER — Car 4
  // ═══════════════════════════════════

  sleeper: {
    name: 'The Sleeper',
    defaultCar: 4,
    ambient: {
      0: "Head against the glass. Eyes closed. Still. She could be dead except for her breathing, which is deliberate — the kind of breathing someone does when they're making sure they keep doing it.",
      1: "Different seat. Eyes still closed. But her hands are in her lap — held together, interlaced.",
      3: "Closer to the door. Eyes closed, but the lids are tight — she's pressing them shut. It's not relaxation anymore. It's effort.",
      4: "Her eyes are open. First time. She's looking at the door.",
      5: "Standing at the door. Eyes open. Hands still. She isn't shaking anymore.",
    },
    dialogue: {
      0: {
        start: {
          t: 'You sit across from her. She doesn\'t move. After a while:',
          nx: 's0pre',
        },
        s0pre: {
          t: '"I know you\'re there." Eyes still closed. Voice flat, quiet.',
          sp: 'the sleeper',
          ch: [
            { l: '"Why won\'t you open your eyes?"', nx: 's0a' },
            { l: '"What do you know about the sealed car?"', nx: 's0b' },
          ],
        },
        s0a: {
          t: '"Why would I." Not aggressive. Genuine. "I\'ve seen the train. I\'ve seen the landscape. I\'ve seen the people and the doors and the sealed car at the end. There\'s nothing new to see."',
          sp: 'the sleeper',
          nx: 's0a2',
        },
        s0a2: {
          t: '"Closing my eyes was the best decision I ever made on this train. I recommend it."',
          sp: 'the sleeper',
          end: true, el: 'talk',
        },
        s0b: {
          t: '"It\'s there. Car 5 and then the sealed car. No handle on this side." She pauses. "People go in. I hear them — their footsteps stop at Car 5 and then there\'s a sound. Not a door exactly. More like pressure equalising."',
          sp: 'the sleeper',
          nx: 's0b2',
        },
        s0b2: {
          t: '"They don\'t make sounds after. Inside the sealed car. I\'ve listened. Not empty-silent. Full-silent. The silence of a room with too many people being very, very still."',
          sp: 'the sleeper',
          end: true, el: 'talk',
        },
      },
      1: {
        start: {
          t: 'Different seat. Her hands are interlaced in her lap.',
          ch: [
            { l: '"You didn\'t open your eyes. Even when I threw you."', nx: 's1a' },
          ],
        },
        s1a: {
          t: '"No." A long silence. "I felt your hands. I felt the door. I felt the wind. I felt the temperature change — cold, and then warm, very warm, the kind of warm that has a colour."',
          sp: 'the sleeper',
          nx: 's1a2',
        },
        s1a2: {
          t: '"I could hear it. The place you fall through. It sounds like a congregation breathing. Hundreds of them. All breathing at the same time, but not lungs — something larger. Something that breathes the way a building settles."',
          sp: 'the sleeper',
          nx: 's1a3',
        },
        s1a3: {
          t: '"I didn\'t open my eyes. I\'m glad I didn\'t open my eyes."',
          sp: 'the sleeper',
          end: true, el: 'talk',
        },
      },
      3: {
        start: {
          t: 'Closer to the door. Her lids are pressed shut. It\'s effort now.',
          ch: [
            { l: '"You can still hear them? The things you heard falling?"', nx: 's3a' },
          ],
        },
        s3a: {
          t: '"Yes." One word. Tight. "Not falling. Here. Now. Under the train. The breathing. I can hear it through the floor of the car."',
          sp: 'the sleeper',
          nx: 's3a2',
        },
        s3a2: {
          t: '"It started after the second time. You threw me through and I came back and the sound came back with me. Like each throw opens something a little wider."',
          sp: 'the sleeper',
          nx: 's3a3',
        },
        s3a3: {
          t: '"If you do it again, I\'ll hear the words. I don\'t want to hear the words. Please."',
          sp: 'the sleeper',
          end: true, el: 'talk',
        },
      },
      4: {
        start: {
          t: 'She opens her eyes. First time in the game. Brown, tired, the eyes of a young woman who hasn\'t slept in a very long time. She looks like someone you might know.',
          nx: 's4pre',
        },
        s4pre: {
          t: '"I can hear the words now." She says it to the door. "The sermon. Under the train."',
          sp: 'the sleeper',
          ch: [
            { l: '"What is it saying?"', nx: 's4a' },
            { l: '"I don\'t want to know."', nx: 's4b' },
          ],
        },
        s4a: {
          t: '"It\'s saying what the man in Car 1 is saying. The same thing. The same words. He\'s not making it up. He\'s transcribing."',
          sp: 'the sleeper',
          nx: 's4a2',
        },
        s4a2: {
          t: '"And it\'s saying the names. Every name. Everyone who\'s gone to the sealed car. Everyone who stopped. It\'s saying them like a register. Like attendance." Her hands are shaking. "It said mine. After the third time you threw me. It added my name."',
          sp: 'the sleeper',
          end: true, el: 'talk',
        },
        s4b: {
          t: '"Smart." She nods. She closes her eyes. But they open again immediately. Involuntary.',
          sp: 'the sleeper',
          nx: 's4b2',
        },
        s4b2: {
          t: '"I can\'t stop seeing now either. You took that from me. The not-seeing. I chose to close my eyes and you took the choice away by throwing me through a thing that burnt my eyelids off. Not literally. But the muscle that closes them. The voluntary part. It\'s gone."',
          sp: 'the sleeper',
          end: true, el: 'talk',
        },
      },
      5: {
        start: {
          t: 'She\'s standing at the door. Eyes open. Hands still. She isn\'t shaking anymore. She\'s past it.',
          nx: 's5a',
        },
        s5a: {
          t: 'She looks at you and says, without inflection, the throw count for every passenger. Every name. Every number. She knows them all. Not from the counter\'s tallies — from the sermon. From the register under the floor.',
          nx: 's5b',
        },
        s5b: {
          t: '"The sermon has all of it. The sermon is very thorough." She steps to the door. "It\'s warm. On the way down. You know that." She opens the door. She doesn\'t close her eyes. She falls watching.',
          end: true, el: 'throw_sleeper',
        },
      },
    },
  },

  // ═══════════════════════════════════
  // THE MUTE — Car 3
  // ═══════════════════════════════════

  mute: {
    name: 'The Mute',
    defaultCar: 3,
    ambient: {
      0: "By the window. Sitting. Hands on knees. Facing the glass. Their reflection is faint — the landscape shows through it, as if they're not quite opaque enough to block the light.",
      1: "One row closer to you than last loop. Facing the aisle now, not the window.",
      3: "Same car. One seat away. Facing you. They were here when the loop started.",
      5: "They're already at the door. Waiting. Patient.",
    },
    dialogue: {
      0: {
        start: {
          t: 'They\'re by the window. You approach.',
          ch: [
            { l: 'Sit beside them.', nx: 'mu0a' },
            { l: 'Stand at a distance. Watch.', nx: 'mu0b' },
          ],
        },
        mu0a: {
          t: 'They don\'t react. But after a moment, their posture shifts — a fraction of a turn toward you. Not looking. Acknowledging. You sit together. The train moves.',
          nx: 'mu0a2',
        },
        mu0a2: {
          t: 'After a while, they raise one hand and point. Out the window. At something in the landscape — a structure, maybe, or a shadow that moves differently from the others. By the time you look, it\'s gone. Or it was never there. They lower their hand.',
          end: true, el: 'talk',
        },
        mu0b: {
          t: 'They know you\'re there. The angle of their shoulders says so. You watch each other without looking at each other. The train moves.',
          nx: 'mu0b2',
        },
        mu0b2: {
          t: 'After a while, the Mute stands. Walks to the opposite end of the car. Sits facing you. Still no eye contact. But the orientation is clear. They\'ve given you their attention. It feels heavier than it should.',
          end: true, el: 'talk',
        },
      },
      1: {
        start: {
          t: 'One row closer. Facing the aisle. They look at you when you enter the car. First time. Direct eye contact. Two seconds, then they look away. In those two seconds you feel assessed. Not judged. Measured.',
          ch: [
            { l: 'Sit across from them.', nx: 'mu1a' },
          ],
        },
        mu1a: {
          t: 'They hold still. You can see details: a scar on the back of their left hand, old, white. Their breathing is even. Not calm — controlled.',
          nx: 'mu1a2',
        },
        mu1a2: {
          t: 'They reach out and touch the seat between you. Once. A tap. Then they withdraw. You don\'t know what it means. It means something.',
          end: true, el: 'talk',
        },
      },
      3: {
        start: {
          t: 'One seat away. Facing you. They\'ve placed their hand on the seat between you. Palm up. Open. Resting like an offering or a question.',
          ch: [
            { l: 'Take their hand.', nx: 'mu3a' },
            { l: 'Don\'t take their hand.', nx: 'mu3b' },
          ],
        },
        mu3a: {
          t: 'Their fingers close around yours. Firm. Dry. Certain. You sit together. The train moves. The landscape passes.',
          nx: 'mu3a2',
        },
        mu3a2: {
          t: 'Their hand is warm. Their grip doesn\'t change. After a while, you realise they\'re shaking — not their hand, their whole body, a fine tremor, like a wire under tension. They are afraid. They have been afraid the entire time. The stillness was not calm. The stillness was management. They hold your hand until the reset.',
          end: true, el: 'talk',
        },
        mu3b: {
          t: 'You sit beside them. The hand stays. After a while, they close their fingers. Slowly. And place their hand back on their knee. They don\'t look at you again this loop.',
          end: true, el: 'talk',
        },
      },
      5: {
        start: {
          t: 'They walk to the door before you stand up. There is no urgency in it. They move the way someone moves through their own house in the dark — knowing where everything is.',
          nx: 'mu5a',
        },
        mu5a: {
          t: 'This is not compliance. This is not what it looks like when the others do it. This is agreement. They\'ve decided that this is what you do together. You throw. They return.',
          nx: 'mu5b',
        },
        mu5b: {
          t: 'They\'re waiting at the door the way a partner waits at the front door — coat on, keys in hand, ready for wherever you\'re going. The door opens. They look at you. Eye contact. Steady. They step through without looking away.',
          end: true, el: 'throw_mute',
        },
      },
    },
  },
};

// ─────────────────────────────────────
// THROW NARRATION — what happens when
// the player throws a passenger
// ─────────────────────────────────────

export function getThrowNarration(passengerId, tier) {
  // Generic throw narration that varies by tier
  if (tier === 0) {
    return {
      start: {
        t: 'You go to them. You take hold of their arm. They resist — confused, afraid, not understanding. You pull them toward the door.',
        nx: 'tw1',
      },
      tw1: {
        t: 'The door opens. The wind is immediate, solid, a wall of air that tastes of metal and distance. You push them through. Their face — the expression on their face as they go — you\'ll remember it.',
        nx: 'tw2',
      },
      tw2: {
        t: 'The door closes. The wind stops. The car is quieter. Someone is crying. You\'re standing at the door and the train moves on.',
        end: true, el: 'thrown',
      },
    };
  }
  if (tier === 1) {
    return {
      start: {
        t: 'You go to them. They see you coming. This time they know what it means.',
        nx: 'tw1',
      },
      tw1: {
        t: 'The door opens. The wind. You push them through. The narration is shorter this time. You\'ve read this before.',
        end: true, el: 'thrown',
      },
    };
  }
  if (tier === 2) {
    return {
      start: {
        t: 'They\'ve repositioned. Closer to the door. They know. The door opens. They go.',
        end: true, el: 'thrown',
      },
    };
  }
  if (tier === 3) {
    return {
      start: {
        t: 'They\'re already standing. The door opens. They step through.',
        end: true, el: 'thrown',
      },
    };
  }
  // tier 4+
  return {
    start: {
      t: 'They go.',
      end: true, el: 'thrown',
    },
  };
}

// ─────────────────────────────────────
// SELF-THROW NARRATION
// ─────────────────────────────────────

export function getSelfThrowNarration(tier) {
  if (tier === 0) {
    return {
      start: {
        t: 'You go to the door. The space between cars — the gap with the wind and the hum beneath the wind. The door opens outward. The wind is immediate.',
        nx: 'st1',
      },
      st1: {
        t: 'You step through.',
        end: true, el: 'self_throw',
        fx: 'hallucination',
      },
    };
  }
  if (tier === 1) {
    return {
      start: {
        t: 'You go again. The door. The wind. You know the weight of it now.',
        nx: 'st1',
      },
      st1: {
        t: 'You step through.',
        end: true, el: 'self_throw',
        fx: 'hallucination',
      },
    };
  }
  if (tier >= 2) {
    return {
      start: {
        t: 'You go.',
        end: true, el: 'self_throw',
        fx: 'hallucination',
      },
    };
  }
}

// ─────────────────────────────────────
// POST-SELF-THROW (returning to seat)
// ─────────────────────────────────────

export function getPostSelfThrow(tier) {
  if (tier === 1) {
    return {
      start: {
        t: 'You\'re in your seat. Your hands are cold. Your teeth ache.',
        nx: 'pst1',
      },
      pst1: {
        t: 'The PA crackles. "The next station is Acheron. Estimated arrival time is not available. Welcome back." Nobody else reacts to the announcement. They didn\'t hear the difference. Or they\'ve always heard it.',
        voice: 'pa',
        end: true, el: 'returned',
      },
    };
  }
  if (tier === 2) {
    return {
      start: {
        t: 'Your seat. Your hands are shaking. Warm, not cold this time. Your palms are flushed — as if you\'ve been holding something hot.',
        end: true, el: 'returned',
      },
    };
  }
  if (tier === 3) {
    return {
      start: {
        t: 'You\'re in your seat. Something is different. Not the train. You. A scratch on your wrist you didn\'t have. Thin, white, old-looking. It hasn\'t been there. It wasn\'t there last loop.',
        nx: 'pst1',
      },
      pst1: {
        t: 'The Sleeper is looking at you. Eyes open. "You were gone longer this time," she says. You were gone for two seconds. "You were gone for a very long time," she says.',
        end: true, el: 'returned',
      },
    };
  }
  return {
    start: {
      t: 'Your seat. Your hands look like your hands. They feel like someone else\'s.',
      end: true, el: 'returned',
    },
  };
}

// ─────────────────────────────────────
// RESET NARRATION — between loops
// ─────────────────────────────────────

export function getResetNarration(loopCount) {
  if (loopCount <= 2) {
    return {
      start: {
        t: 'The train lurches. Not a normal lurch — a grammatical one, as if the sentence you were in ended before the thought finished. A cut. A splice.',
        nx: 'r1',
      },
      r1: {
        t: 'You\'re in your seat. You were standing. Now you\'re in your seat. The transition had no duration. The passengers are in their seats. Everything is exactly, precisely, meticulously the same.',
        nx: 'r2',
      },
      r2: {
        t: 'Except you remember.',
        end: true, el: 'reset',
      },
    };
  }

  if (loopCount <= 6) {
    return {
      start: {
        t: 'Reset. You\'re in your seat. Your body knows the lurch now — anticipates it. The transitions are getting heavier. Not longer. Heavier.',
        nx: 'r1',
      },
      r1: {
        t: 'Fewer people. The car is less full. You don\'t count. You already know.',
        nx: 'r2',
      },
      r2: {
        t: '"The next station is Acheron. Please remain."',
        voice: 'pa',
        end: true, el: 'reset',
      },
    };
  }

  // Late game
  return {
    start: {
      t: 'Reset. Seat. Hands. Window. Acheron.',
      end: true, el: 'reset',
    },
  };
}

// ─────────────────────────────────────
// WINDOW NARRATION — looking outside
// ─────────────────────────────────────

export function getWindowNarration(gameState) {
  const loop = gameState.loopCount;
  const selfThrows = gameState.selfThrowCount;

  if (loop <= 3) {
    return {
      start: {
        t: 'Dark fields. A sky without stars, without moon — not cloudy, just empty. Power lines run alongside the track, leaning slightly, their wires catching no light. In the distance, structures. Not buildings — shapes. They don\'t get closer.',
        nx: 'w1',
      },
      w1: {
        t: 'Your reflection in the glass is clear. Behind you, the car. The passengers. You can count them in the reflection. The count is correct.',
        end: true, el: 'window',
      },
    };
  }

  if (loop <= 7) {
    return {
      start: {
        t: 'The fields are the same field. You\'ve seen this stretch of nothing before — the same lean in the power lines. The landscape is repeating. Not looping the way the train loops — stuttering. The same frame held too long.',
        nx: 'w1',
      },
      w1: {
        t: 'A tree passes. You\'ve seen it before. The same tree. It passes again. Your reflection: the car behind you. Fewer passengers. You count them in the glass.' + (loop > 5 ? ' One more than there should be. You turn around. The car is correct. You turn back. The extra reflection is gone.' : ''),
        end: true, el: 'window',
      },
    };
  }

  if (selfThrows > 0) {
    return {
      start: {
        t: 'The landscape. You look. For a moment — a frame, a flicker — the landscape is red. The field, the sky, all of it, the colour you saw when you fell. And in the red, just for that frame: the rows. The seated figures.',
        nx: 'w1',
      },
      w1: {
        t: 'Then it\'s gone. Dark fields. Empty sky. Power lines that aren\'t there anymore.',
        end: true, el: 'window',
      },
    };
  }

  return {
    start: {
      t: 'The landscape is wrong. The field is made of something that isn\'t earth. Flat, textured, the consistency of skin. And in the distance — shapes, the size of buildings, the shape of seats. Train seats. Standing upright in the field, rows deep, stretching to where the horizon should be.',
      end: true, el: 'window',
    },
  };
}

// ─────────────────────────────────────
// SEALED CAR INTERACTIONS
// ─────────────────────────────────────

export function getSealedCarNarration(action) {
  switch (action) {
    case 'approach':
      return {
        start: {
          t: 'The door at the end of Car 5. No handle. No window. The surface is the same as every other door on the train — grey, metal, a fire safety notice that you can\'t quite read. The only difference is the absence. No way to open it. Not locked. Simply not designed to be opened from this side.',
          end: true, el: 'sealed',
        },
      };
    case 'touch':
      return {
        start: {
          t: 'It\'s warm. Not hot — warm. Body temperature. The temperature of something alive, or something that contains something alive, or something that was alive recently enough that the warmth hasn\'t left.',
          end: true, el: 'sealed',
        },
      };
    case 'listen':
      return {
        start: {
          t: 'Nothing. You press your ear to the metal. Nothing. But the nothing is thick — the nothing of a room with held breath, not the nothing of a room that\'s empty. Pressurised silence. The silence of very still people.',
          end: true, el: 'sealed',
        },
      };
    case 'knock':
      return {
        start: {
          t: 'You knock. The sound doesn\'t carry the way it should. It deadens immediately, as if the door absorbed it. As if the door was hungry for sound and took it before it could echo.',
          end: true, el: 'sealed',
        },
      };
    default:
      return { start: { t: 'The sealed door. No handle.', end: true, el: 'sealed' } };
  }
}

// ─────────────────────────────────────
// DO-NOTHING PATH — escalating
// ─────────────────────────────────────

export function getDoNothingNarration(phase) {
  switch (phase) {
    case 1:
      return {
        start: {
          t: 'You\'re still here. Same seat. The train has reset since you last stood up.',
          end: true, el: 'donothing',
        },
      };
    case 2:
      return {
        start: {
          t: 'Other passengers glance at you. Not with fear — with something else. Recognition. The panickers panic less around you. You are becoming a fixed point.',
          end: true, el: 'donothing',
        },
      };
    case 3:
      return {
        start: {
          t: 'The man in Car 3 has not moved. He sits in his seat. The landscape passes.',
          end: true, el: 'donothing',
        },
      };
    case 4:
      return {
        start: {
          t: 'Car 3. A seat is occupied. The window shows dark fields.',
          end: true, el: 'donothing',
        },
      };
    case 5:
      return {
        start: {
          t: 'The seat holds the shape of everyone who\'s sat in it.',
          end: true, el: 'ending_donothing',
        },
      };
    default:
      return null;
  }
}

// ─────────────────────────────────────
// ACTIONS MENU — what the player can do
// in each car
// ─────────────────────────────────────

export function getCarActions(carIndex, gameState) {
  const actions = [];

  // Always available: look out window
  actions.push({ l: 'Look out the window', action: 'window' });

  // Named passengers in this car
  const namedInCar = Object.entries(gameState.namedPositions)
    .filter(([_, p]) => p.car === carIndex)
    .map(([id]) => id);

  for (const id of namedInCar) {
    const tier = gameState.getThrowTier(id);
    const p = PASSENGERS[id];
    const name = p.name;

    // Talk option (if not at auto-throw tier)
    if (tier < 5) {
      actions.push({ l: `Talk to ${name.toLowerCase()}`, action: 'talk', target: id });
    }

    // Throw option
    if (tier < 5) {
      actions.push({ l: `Throw ${name.toLowerCase()}`, action: 'throw', target: id });
    }
  }

  // Self-throw (available in any car via the between-car door)
  actions.push({ l: 'Throw yourself off', action: 'self_throw' });

  // Sit down / do nothing
  if (carIndex === 2) { // player's starting car is 3 (index 2)
    actions.push({ l: 'Sit down', action: 'sit' });
  }

  // Sealed car (only in Car 5)
  if (carIndex === 4) {
    actions.push({ l: 'Approach the sealed door', action: 'sealed_approach' });
    actions.push({ l: 'Touch the door', action: 'sealed_touch' });
    actions.push({ l: 'Listen at the door', action: 'sealed_listen' });
    actions.push({ l: 'Knock', action: 'sealed_knock' });
  }

  // Navigation
  if (carIndex > 0) {
    actions.push({ l: `Go to Car ${carIndex}`, action: 'go_car', target: carIndex - 1 });
  }
  if (carIndex < 4) {
    actions.push({ l: `Go to Car ${carIndex + 2}`, action: 'go_car', target: carIndex + 1 });
  }

  return actions;
}
