/* ═══════════════════════════════════════
   DATA — Narrative content & chapter configs
   All 7 chapters of Still Life
   ═══════════════════════════════════════

   Based on the lamp story. A man is knocked
   unconscious and lives years inside a dream.
   He marries, has a child, builds a life.
   One day he notices a lamp in his living room.
   Something about it is wrong. He can't stop
   looking. People tell him not to look. The dream
   unravels. He wakes up to a life that was never real.

   Scene types: 'walk', 'interior'
   Narrative nodes:
     t      — text content
     sp     — speaker label (optional)
     nx     — next node id
     ch     — choices array [{l, nx, flag?}]
     end    — marks scene end
     el     — end label text
     voice  — 'dream' for the dream's voice
     flag   — set a story flag
     resume — resume walking after text
*/

export const CHAPTERS = {

  // ═══════════════════════════════════
  // CHAPTER 1: THE ROOM
  // ═══════════════════════════════════
  1: {
    seed: 7213,
    subtitle: 'the room',
    rainCount: 0,
    fog: 0.01,
    worldWidth: 2000,
    distortion: 0,
    lampWrong: 0,
    scenes: [
      {
        type: 'walk',
        nodes: {
          start: {
            t: "Light through curtains. Thin, grey, the particular quality of a weekday morning in a town you have always lived in.",
            nx: 'w1'
          },
          w1: {
            t: "You stand in the hallway. The house smells of toast and something floral — lavender, maybe, from the fabric softener. The radiator ticks as it cools.",
            nx: 'w2',
            resume: true
          },
          w2: {
            t: "Through the kitchen window the street is still. Terraced houses in a long row, each one a minor variation on the one beside it. Slate roofs. Pebbledash walls. Small front gardens behind low walls.",
            nx: 'w3',
            resume: true
          },
          w3: {
            t: "You walk to work. The route is automatic — left at the post box, past the chemist, along the road that runs parallel to the park. You have walked it a thousand times.",
            nx: 'w4'
          },
          w4: {
            t: "The sky is the colour of old paper. Trees along the pavement hold their branches still. No wind today. The air is close and soft and unremarkable.",
            ch: [
              { l: '[ keep walking ]',        nx: 'w5' },
              { l: '[ stop at the bench ]',    nx: 'w5b' },
            ]
          },
          w5: {
            t: "You pass the row of shops — newsagent, laundrette, the place that used to be a butcher's. Everything is where it should be. Everything has always been where it is.",
            nx: 'w6'
          },
          w5b: {
            t: "You sit for a moment. The bench is cold through your coat. From here you can see the whole street — the houses, the gardens, the parked cars with condensation on their windscreens. It is entirely ordinary.",
            nx: 'w6'
          },
          w6: {
            t: "At the end of the road the park opens up — a flat green space with a path cutting through it. You take the path. On the far side, the rooftops of another row of houses. Chimneys. Aerials. A satellite dish.",
            nx: 'w7'
          },
          w7: {
            t: "You arrive at work. The building is unexceptional. You go inside and the day begins and the hours pass and the day ends and you walk home the same way you came.",
            end: true,
            el: 'end of the morning'
          }
        },
        pois: [
          { worldX: 150,  nodeId: 'start' },
          { worldX: 500,  nodeId: 'w2' },
          { worldX: 850,  nodeId: 'w4' },
          { worldX: 1200, nodeId: 'w6' },
        ]
      },
      {
        type: 'interior',
        nodes: {
          start: {
            t: "Evening. The living room. She is on the sofa reading, her feet tucked beneath her, a mug going cold on the side table.",
            nx: 'n1'
          },
          n1: {
            t: "The lamp is on in the corner. A standard lamp with a fabric shade — off-white, slightly yellowed at the edges. It casts a warm circle on the wall and the ceiling.",
            nx: 'n2'
          },
          n2: {
            t: "You sit in the armchair. The television is off. The room is quiet except for the occasional turn of a page and the faint hum of the refrigerator from the kitchen.",
            sp: 'she',
            nx: 'n3'
          },
          n3: {
            t: '"You\'re quiet tonight."',
            sp: 'she',
            nx: 'n4'
          },
          n4: {
            t: '"Just tired."',
            nx: 'n5'
          },
          n5: {
            t: "She smiles without looking up. The lamp light catches the side of her face. The room is warm. The room is safe. You have lived in this room for years and it has never been anything other than this.",
            ch: [
              { l: '[ close your eyes ]',   nx: 'n6a' },
              { l: '[ watch the lamp ]',     nx: 'n6b' },
            ]
          },
          n6a: {
            t: "You close your eyes. Behind them, briefly, you see nothing at all — a gap, a moment where there should be the afterimage of the room but isn't. Then it returns. The warmth. The hum. Home.",
            nx: 'n7'
          },
          n6b: {
            t: "The lamp. You watch the light it makes. The circle on the ceiling is even, steady. The shade doesn't move. The bulb hums at a frequency too low to hear but just high enough to feel.",
            nx: 'n7'
          },
          n7: {
            t: "Later, in bed, you listen to her breathing beside you and the house settling around you both. Pipes. Floorboards. The small sounds a house makes when it thinks no one is listening.",
            end: true,
            el: 'night one'
          }
        }
      }
    ]
  },

  // ═══════════════════════════════════
  // CHAPTER 2: THE ROUTINE
  // ═══════════════════════════════════
  2: {
    seed: 7213,
    subtitle: 'the routine',
    rainCount: 30,
    fog: 0.02,
    worldWidth: 2000,
    distortion: 0,
    lampWrong: 0,
    scenes: [
      {
        type: 'walk',
        nodes: {
          start: {
            t: "Saturday. You walk with your daughter to the park. She is seven, maybe eight — the age where everything is a question and no answer is sufficient.",
            nx: 'w1'
          },
          w1: {
            t: '"Why is the sky that colour?"',
            sp: 'the child',
            nx: 'w2'
          },
          w2: {
            t: '"Because it\'s overcast."',
            nx: 'w3',
            resume: true
          },
          w3: {
            t: '"But what colour is it?"',
            sp: 'the child',
            nx: 'w4'
          },
          w4: {
            t: "You look up. She's right to ask. It isn't grey, exactly. It isn't white. It is the colour of something that has been left out in the weather — the absence of a colour rather than a colour itself.",
            nx: 'w5'
          },
          w5: {
            t: '"I don\'t know what you\'d call it."',
            nx: 'w6',
            resume: true
          },
          w6: {
            t: "She runs ahead. Her red coat is the brightest thing on the street. You watch her disappear around the corner toward the park gate and you follow, and the day is ordinary and whole.",
            nx: 'w7'
          },
          w7: {
            t: "Rain begins as you reach the swings. A fine drizzle, more mist than rain. She doesn't notice. Children never notice rain until they're soaked through.",
            ch: [
              { l: '[ let her play ]',     nx: 'w8a' },
              { l: '[ call her in ]',       nx: 'w8b' },
            ]
          },
          w8a: {
            t: "You stand at the edge of the playground with your hands in your pockets and watch her climb and swing and shout at nothing. The rain thickens. The park empties around you both.",
            nx: 'w9'
          },
          w8b: {
            t: '"Come on. We\'ll get chips on the way home." She comes willingly — the promise of chips is enough. You walk together through the rain, her hand in yours, her coat impossibly bright against the grey.',
            nx: 'w9'
          },
          w9: {
            t: "Walking home. The houses. The gardens. The parked cars. Everything in its place. You have this. You have all of this.",
            end: true,
            el: 'end of saturday'
          }
        },
        pois: [
          { worldX: 150,  nodeId: 'start' },
          { worldX: 450,  nodeId: 'w3' },
          { worldX: 750,  nodeId: 'w5' },
          { worldX: 1100, nodeId: 'w7' },
        ]
      },
      {
        type: 'interior',
        nodes: {
          start: {
            t: "The three of you in the living room. Your daughter draws at the coffee table. Felt tips on printer paper. She is making a house.",
            nx: 'n1'
          },
          n1: {
            t: "The lamp is on. It is always on in the evenings. The room organises itself around its light — the sofa facing toward it, the armchair angled in its warmth, the shadows falling away from it toward the walls.",
            nx: 'n2'
          },
          n2: {
            t: '"Dad. What colour is our house?"',
            sp: 'the child',
            nx: 'n3'
          },
          n3: {
            t: "You think about this. You have lived in this house for — how long? You should know the colour of your own house. But standing here in the living room, you cannot picture the exterior.",
            ch: [
              { l: '[ "grey" ]',   nx: 'n4a' },
              { l: '[ "I\'ll check tomorrow" ]', nx: 'n4b' },
            ]
          },
          n4a: {
            t: '"Grey." She considers this, then draws grey walls with a grey felt tip. The house in her drawing looks like every other house on the street. She adds a yellow window. The lamp.',
            nx: 'n5'
          },
          n4b: {
            t: "She frowns, then chooses a grey felt tip anyway. All the houses on this street are grey or close to it. She draws the house and adds a yellow square for the window. The lamp, seen from outside.",
            nx: 'n5'
          },
          n5: {
            t: "She holds up the drawing. A grey house under a grey sky. One yellow window. The lamp visible through it.",
            nx: 'n6'
          },
          n6: {
            t: '"That\'s the lamp," she says, pointing to the yellow square. "It\'s always on."',
            sp: 'the child',
            nx: 'n7'
          },
          n7: {
            t: "You look at the lamp. The off-white shade. The metal stem. The base, heavy and dark, sitting on the side table. It is always on. You cannot remember the last time it was off. You are not sure you have ever seen it off.",
            nx: 'n8'
          },
          n8: {
            t: "Later, after she's in bed, you sit in the armchair and the lamp is on and the room is warm and you think: how long have I lived here? And the answer comes easily — years. Many years. But the number won't attach to anything specific.",
            end: true,
            el: 'night two'
          }
        }
      }
    ]
  },

  // ═══════════════════════════════════
  // CHAPTER 3: THE YEARS
  // ═══════════════════════════════════
  3: {
    seed: 7213,
    subtitle: 'the years',
    rainCount: 40,
    fog: 0.03,
    worldWidth: 2000,
    distortion: 0,
    lampWrong: 0.05,
    scenes: [
      {
        type: 'walk',
        nodes: {
          start: {
            t: "Time has passed. You know this because the trees along the pavement are larger and the chemist has become a coffee shop and your daughter's coat is no longer red but dark blue.",
            nx: 'w1'
          },
          w1: {
            t: "You walk the same route. Left at the post box, past the coffee shop, along the road that runs parallel to the park. The route is the same but the texture of it has changed — thicker, more layered, as though the walk itself has accumulated weight.",
            nx: 'w2',
            resume: true
          },
          w2: {
            t: "How many times have you walked this? Hundreds. Thousands. Each walk laid down on top of the last, a stratigraphy of habit.",
            nx: 'w3'
          },
          w3: {
            t: "The houses along the street are the same. They have always been the same. You cannot remember any of them being built or altered or repaired. They are simply there, as though they grew out of the pavement.",
            nx: 'w4',
            resume: true
          },
          w4: {
            t: "At the park, the path cuts through the green. New benches. A plaque on one of them that you stop to read but the words won't quite resolve — you can see letters but they slide away before they form words.",
            ch: [
              { l: '[ look more closely ]',   nx: 'w5a' },
              { l: '[ keep walking ]',          nx: 'w5b' },
            ]
          },
          w5a: {
            t: "The letters. You stare at them. They are definitely letters — serif font, cut into brass — but they rearrange themselves each time you try to read the full sentence. You step back. It doesn't matter. It's just a bench.",
            nx: 'w6'
          },
          w5b: {
            t: "Plaques. Benches. You pass them every day. You've never read any of them. It doesn't matter.",
            nx: 'w6'
          },
          w6: {
            t: "Home. The house. Grey walls — she was right about that. A door you've opened ten thousand times. The handle worn smooth in exactly the shape of your hand.",
            end: true,
            el: 'the years accumulate'
          }
        },
        pois: [
          { worldX: 150,  nodeId: 'start' },
          { worldX: 500,  nodeId: 'w2' },
          { worldX: 850,  nodeId: 'w4' },
        ]
      },
      {
        type: 'interior',
        nodes: {
          start: {
            t: "The living room. Evening. She has gone to bed early. Your daughter is at a friend's house. You are alone with the lamp.",
            nx: 'n1'
          },
          n1: {
            t: "You sit in the armchair and you look at the lamp.",
            nx: 'n2'
          },
          n2: {
            t: "The shade is off-white. Fabric over a wire frame, slightly yellowed where the heat has aged it. The stem is brushed metal — steel, probably, or nickel. The base is a weighted disc, dark, sitting on the side table beside a coaster and an old magazine.",
            nx: 'n3'
          },
          n3: {
            t: "The light it casts makes a circle on the ceiling. Warm. Steady. The edges of the circle are soft, graded, the light fading into shadow over a distance of perhaps ten centimetres.",
            nx: 'n4'
          },
          n4: {
            t: "Except. You look at the shadow side. The wall behind the lamp should be in shadow — the shade is opaque, the light source is directional. But the wall behind the lamp is the same brightness as the wall beside it.",
            nx: 'n5'
          },
          n5: {
            t: "That's wrong. You know how light works. You have lived in this room for years, sat in this chair, looked at this wall. The shadow behind the lamp should be darker than the surrounding wall. It isn't.",
            ch: [
              { l: '[ get up and look ]',    nx: 'n6a' },
              { l: '[ it doesn\'t matter ]', nx: 'n6b' },
            ]
          },
          n6a: {
            t: "You stand beside the lamp. You put your hand behind the shade. Your hand casts a shadow on the wall — clear, sharp, behaving as a shadow should. But the lamp itself does not. The lamp lights the room without obeying the room's rules.",
            nx: 'n7'
          },
          n6b: {
            t: "It doesn't matter. Lamps light rooms. The physics of it are not important. But your eyes keep returning to the wall behind the lamp, and the wrongness of it sits in your chest like a weight you cannot put down.",
            nx: 'n7'
          },
          n7: {
            t: "You sit back down. The lamp is on. The room is warm. But something has shifted — not in the room, in you. You have noticed something and you cannot un-notice it.",
            end: true,
            el: 'night three'
          }
        }
      }
    ]
  },

  // ═══════════════════════════════════
  // CHAPTER 4: THE NOTICING
  // ═══════════════════════════════════
  4: {
    seed: 7213,
    subtitle: 'the noticing',
    rainCount: 55,
    fog: 0.04,
    worldWidth: 2000,
    distortion: 0.08,
    lampWrong: 0.2,
    scenes: [
      {
        type: 'walk',
        nodes: {
          start: {
            t: "You walk to work. The same route. But today you look at things differently. The lampposts along the pavement — their light at night, does it behave correctly? Do they cast shadows?",
            nx: 'w1'
          },
          w1: {
            t: "The houses. You look at the windows. Behind each window, a room. In each room, presumably, a lamp. How many of those lamps cast correct shadows?",
            nx: 'w2',
            resume: true
          },
          w2: {
            t: "You stop at the corner. The chemist — no, the coffee shop. When did it change? You remember the chemist. You remember the coffee shop. But you cannot remember the transition. There was no renovation, no closed-for-refurbishment sign. The chemist was, and then the coffee shop is.",
            nx: 'w3'
          },
          w3: {
            t: "A man passes you on the pavement. Grey coat, dark hair, walking with purpose. You have seen him before — every day, maybe, on this route. But you cannot remember his face from yesterday. Only from now.",
            nx: 'w4',
            resume: true
          },
          w4: {
            t: "The park. The bench with the plaque you couldn't read. You try again. The letters are there. They are definitely letters. But they won't hold still long enough to become words.",
            ch: [
              { l: '[ sit on the bench ]',     nx: 'w5a' },
              { l: '[ walk past it ]',          nx: 'w5b' },
            ]
          },
          w5a: {
            t: "You sit. The bench is solid beneath you. The wood is real — grain, weathering, a splinter at the edge. But the plaque is nothing. A pattern that resembles language without being language. Decoration pretending to be information.",
            nx: 'w6'
          },
          w5b: {
            t: "You walk on. But the bench stays in your mind — an object with a plaque that cannot be read. How many other things in this town exist at that resolution? Solid enough to sit on, detailed enough to seem real, but empty where the meaning should be.",
            nx: 'w6'
          },
          w6: {
            t: "At work, the building. You go inside. But you cannot describe what you do here. You work. The hours pass. Papers, perhaps, or screens, or conversations. The content of the work dissolves the moment you stop looking at it.",
            nx: 'w7'
          },
          w7: {
            t: "Walking home. The houses. The gardens. The parked cars. Everything in its place. But the places feel thinner than they did yesterday.",
            end: true,
            el: 'the cracks begin'
          }
        },
        pois: [
          { worldX: 150,  nodeId: 'start' },
          { worldX: 450,  nodeId: 'w2' },
          { worldX: 750,  nodeId: 'w4' },
          { worldX: 1100, nodeId: 'w6' },
        ]
      },
      {
        type: 'interior',
        nodes: {
          start: {
            t: "The living room. The lamp is on. You sit in the armchair and you stare at it.",
            nx: 'n1'
          },
          n1: {
            t: "The shade. The stem. The base. The circle of light on the ceiling. The absent shadow on the wall behind. You have been looking at this lamp for an hour.",
            nx: 'n2'
          },
          n2: {
            t: '"You\'ve been staring at that lamp."',
            sp: 'she',
            nx: 'n3'
          },
          n3: {
            t: '"The shadow is wrong."',
            nx: 'n4'
          },
          n4: {
            t: "She looks at the lamp. She looks at the wall behind it. She looks at you.",
            nx: 'n5'
          },
          n5: {
            t: '"What shadow?"',
            sp: 'she',
            nx: 'n6'
          },
          n6: {
            t: '"That\'s what I mean. There should be one. The shade is opaque. The light is directional. The wall behind it should be darker than the wall beside it. Look."',
            nx: 'n7'
          },
          n7: {
            t: "She looks. For a long moment she looks at the wall, and in that moment something crosses her face — not confusion, not agreement, but a flicker of something else. Something that might be fear.",
            nx: 'n8'
          },
          n8: {
            t: '"It\'s just a lamp. Come to bed."',
            sp: 'she',
            nx: 'n9'
          },
          n9: {
            t: "you are looking too closely. the room is warm. the light is warm. this is your home. you have always lived here. do not look at the edges of things.",
            voice: 'dream',
            nx: 'n10'
          },
          n10: {
            t: "You turn off the lamp. The room goes dark. And in the dark, for one instant, you see — or think you see — that the lamp's glow persists for a fraction of a second after the switch clicks. Not an afterimage. The light itself, lingering, as though reluctant to stop.",
            end: true,
            el: 'night four'
          }
        }
      }
    ]
  },

  // ═══════════════════════════════════
  // CHAPTER 5: THE CONCERN
  // ═══════════════════════════════════
  5: {
    seed: 7213,
    subtitle: 'the concern',
    rainCount: 70,
    fog: 0.06,
    worldWidth: 2000,
    distortion: 0.20,
    lampWrong: 0.4,
    scenes: [
      {
        type: 'walk',
        nodes: {
          start: {
            t: "The street is quieter this morning. Fewer people. The man in the grey coat is absent. The coffee shop is open but through the window you can see it is empty — not closed, not unwelcoming, simply unpopulated. A set dressed for a scene no one is performing.",
            nx: 'w1'
          },
          w1: {
            t: "You look at the houses more carefully now. The details are there — brickwork, guttering, window catches, doorbells. But they repeat. The same crack in the same position on three different walls. The same curtain pattern in five different windows.",
            nx: 'w2',
            resume: true
          },
          w2: {
            t: "A neighbour waves from her garden. You wave back. She is smiling. She is always smiling. You have never had a conversation with her that wasn't about the weather, and you realise now that you have never been certain she has a name.",
            nx: 'w3'
          },
          w3: {
            t: '"Lovely morning."',
            sp: 'the neighbour',
            nx: 'w4'
          },
          w4: {
            t: "It's raining.",
            nx: 'w5',
            resume: true
          },
          w5: {
            t: "The park. The benches. The path. You walk it automatically, your feet knowing the route better than your mind does. But the park feels smaller today, as though the boundaries have contracted overnight.",
            ch: [
              { l: '[ measure the path ]',    nx: 'w6a' },
              { l: '[ keep going ]',            nx: 'w6b' },
            ]
          },
          w6a: {
            t: "You count your steps. Three hundred and twelve from the gate to the far side. Tomorrow you will count again and the number will be different and you will not be able to explain why.",
            nx: 'w7'
          },
          w6b: {
            t: "The far gate. The other row of houses. Chimneys and aerials and satellite dishes and not one of them connected to anything you could trace to a signal or a programme or a frequency.",
            nx: 'w7'
          },
          w7: {
            t: "A friend — you have a friend, you're certain of it — meets you at the corner. He looks at you with careful concern.",
            nx: 'w8'
          },
          w8: {
            t: '"She called me. She says you\'ve been staring at the lamp. She says you sit in the armchair and you don\'t move and you just look at it. For hours."',
            sp: 'the friend',
            nx: 'w9'
          },
          w9: {
            t: '"The shadow is wrong."',
            nx: 'w10'
          },
          w10: {
            t: "He puts his hand on your shoulder. It is warm and heavy and it feels like the most real thing that has touched you in weeks.",
            nx: 'w11'
          },
          w11: {
            t: '"Mate. It\'s a lamp. Don\'t — just don\'t think about it too much. Come round Saturday. We\'ll watch the match."',
            sp: 'the friend',
            nx: 'w12'
          },
          w12: {
            t: "you have people who care about you. you have a home. you have a life. why would you pull at the seam of something this good?",
            voice: 'dream',
            nx: 'w13'
          },
          w13: {
            t: "You walk home. The rain is heavier now. The houses stand in their rows and their windows glow with warm light and behind every window is a lamp and not one of them casts a shadow.",
            end: true,
            el: 'the others notice'
          }
        },
        pois: [
          { worldX: 150,  nodeId: 'start' },
          { worldX: 500,  nodeId: 'w2' },
          { worldX: 750,  nodeId: 'w5' },
          { worldX: 1100, nodeId: 'w7' },
        ]
      },
      {
        type: 'interior',
        nodes: {
          start: {
            t: "Your daughter sits on the floor beside your armchair. She has brought her drawing things.",
            nx: 'n1'
          },
          n1: {
            t: '"Dad. Mum says you\'re sad."',
            sp: 'the child',
            nx: 'n2'
          },
          n2: {
            t: '"I\'m not sad. I\'m just looking at something."',
            nx: 'n3'
          },
          n3: {
            t: '"The lamp?"',
            sp: 'the child',
            nx: 'n4'
          },
          n4: {
            t: '"Yes."',
            nx: 'n5'
          },
          n5: {
            t: "She is quiet for a while. She draws. You hear the felt tip moving across the paper in small careful strokes.",
            nx: 'n6'
          },
          n6: {
            t: '"I can see it too," she says, very quietly. "The shadow thing."',
            sp: 'the child',
            nx: 'n7'
          },
          n7: {
            t: "You look at her. She is not looking at you. She is looking at the lamp.",
            nx: 'n8'
          },
          n8: {
            t: '"But Mum says not to look. She says if you look too hard the room goes funny. She says it\'s like when you say a word too many times and it stops sounding like a word."',
            sp: 'the child',
            nx: 'n9'
          },
          n9: {
            t: "She holds up her drawing. It is the living room. The armchair. The sofa. The lamp in the corner. But in her drawing the lamp has no shade — just the bulb, naked, impossibly bright, and the room around it is dissolving into the light. The walls are not walls. They are the edges of the light pretending to be walls.",
            ch: [
              { l: '[ "what are the walls made of?" ]',  nx: 'n10a' },
              { l: '[ put the drawing down ]',            nx: 'n10b' },
            ]
          },
          n10a: {
            t: '"Light," she says. "They\'re made of light. It\'s all light. The lamp is the only bit that says so."',
            sp: 'the child',
            nx: 'n11'
          },
          n10b: {
            t: "You put the drawing face-down on the table. Your hands are shaking. She watches you with the patient, serious expression that children have when they know they've said something true.",
            nx: 'n11'
          },
          n11: {
            t: "do not listen to the child. children see edges that adults have learned to look past. the room is solid. the walls are walls. the lamp is a lamp. you are home.",
            voice: 'dream',
            nx: 'n12'
          },
          n12: {
            t: "She goes to bed. You sit with the lamp. The light is warm. The shadow is absent. And you understand, with a certainty that feels like falling, that she is right.",
            end: true,
            el: 'night five'
          }
        }
      }
    ]
  },

  // ═══════════════════════════════════
  // CHAPTER 6: THE UNRAVELING
  // ═══════════════════════════════════
  6: {
    seed: 7213,
    subtitle: 'the unraveling',
    rainCount: 85,
    fog: 0.09,
    worldWidth: 2000,
    distortion: 0.45,
    lampWrong: 0.65,
    scenes: [
      {
        type: 'walk',
        nodes: {
          start: {
            t: "The street is thin today. That is the only word for it. The houses are there but they are thinner — the brickwork visible only from the front, as though the houses have no depth, as though they are painted on a surface that faces you and you alone.",
            nx: 'w1'
          },
          w1: {
            t: "You walk. The pavement is solid underfoot. Your shoes make the right sound on the right surface. But the sound doesn't carry. It stops at your ears as though the air has a shorter range than it should.",
            nx: 'w2',
            resume: true
          },
          w2: {
            t: "The coffee shop window: inside, a figure behind the counter. Not moving. Not waiting. Simply present, the way furniture is present. You watch for a full minute and the figure does not blink.",
            nx: 'w3'
          },
          w3: {
            t: "The neighbour is in her garden. She waves. She smiles. She says, 'Lovely morning,' and it is raining harder than it has ever rained and she does not appear to notice.",
            nx: 'w4',
            resume: true
          },
          w4: {
            t: "The park is smaller. You are certain of it now. The path takes two hundred steps, not three hundred. The far gate is closer. The green space is narrower. As though the park has contracted — or as though it was never as large as you remember.",
            nx: 'w5'
          },
          w5: {
            t: "the world was built for you. every house, every street, every face. it was made carefully, with attention, with love. why do you look for the joins? why do you press at the edges?",
            voice: 'dream',
            nx: 'w6'
          },
          w6: {
            t: "Because the joins are there. And once you see them you cannot stop seeing them. The crack that repeats. The curtain that copies. The plaque that won't resolve into words. The lamp that won't cast a shadow.",
            nx: 'w7'
          },
          w7: {
            t: "A woman stops you on the pavement. You don't know her but she looks at you with an expression you recognise from your wife, from your friend, from your daughter — that careful, urgent concern.",
            nx: 'w8'
          },
          w8: {
            t: '"Please don\'t look." That is all she says. "Please don\'t look." And she walks on and you watch her go and she turns the corner and you know — you know — that the moment she is out of sight she ceases to exist.',
            ch: [
              { l: '[ follow her ]',    nx: 'w9a' },
              { l: '[ go home ]',        nx: 'w9b' },
            ]
          },
          w9a: {
            t: "You turn the corner. The street is empty. Not just empty of her — empty in a way that suggests the street was built the moment you turned the corner and she was not included in its construction.",
            nx: 'w10'
          },
          w9b: {
            t: "You go home. The door. The handle worn in the shape of your hand. You open it and the hallway is warm and familiar and wrong in a way that is no longer subtle.",
            nx: 'w10'
          },
          w10: {
            t: "The light is failing. Not the daylight — the world-light. The overall illumination of everything. As though someone is slowly, gently turning the brightness down.",
            end: true,
            el: 'the seams show'
          }
        },
        pois: [
          { worldX: 150,  nodeId: 'start' },
          { worldX: 450,  nodeId: 'w2' },
          { worldX: 750,  nodeId: 'w4' },
          { worldX: 1050, nodeId: 'w7' },
        ]
      },
      {
        type: 'interior',
        nodes: {
          start: {
            t: "The living room is darker than usual. The only light is the lamp. Your wife sits on the sofa. She is not reading. She is watching you.",
            nx: 'n1'
          },
          n1: {
            t: '"I know what you\'re going to say. And I need you not to say it."',
            sp: 'she',
            nx: 'n2'
          },
          n2: {
            t: '"The lamp—"',
            nx: 'n3'
          },
          n3: {
            t: '"Don\'t."',
            sp: 'she',
            nx: 'n4'
          },
          n4: {
            t: "Her voice is different. Not angry. Not pleading. Something else. The voice of someone defending a position they know is indefensible.",
            nx: 'n5'
          },
          n5: {
            t: '"I know it doesn\'t cast a shadow. I\'ve always known. Do you understand? I have always known. And it didn\'t matter until you started looking."',
            sp: 'she',
            nx: 'n6'
          },
          n6: {
            t: "The room is very quiet. The lamp hums at its impossible frequency.",
            nx: 'n7'
          },
          n7: {
            t: '"The room is made of it. The walls. The floor. The house. The street. All of it. It\'s all the lamp. It has always been the lamp."',
            sp: 'she',
            nx: 'n8'
          },
          n8: {
            t: '"What do you mean?"',
            nx: 'n9'
          },
          n9: {
            t: '"I mean the lamp doesn\'t cast a shadow because the lamp is the only thing that\'s real. Everything else is what it makes. We\'re what it makes."',
            sp: 'she',
            nx: 'n10'
          },
          n10: {
            t: "Silence. The lamp hums. The circle of light on the ceiling wavers — barely, almost imperceptibly, as though the room is breathing.",
            ch: [
              { l: '[ "are you real?" ]',    nx: 'n11a' },
              { l: '[ "am I real?" ]',        nx: 'n11b' },
            ]
          },
          n11a: {
            t: '"I\'m real enough. I\'m real to you. Isn\'t that enough?"',
            sp: 'she',
            nx: 'n12'
          },
          n11b: {
            t: "She looks at you for a long time. The lamp light catches her face, and for one moment you see through her — not metaphorically, literally — the wall behind her visible through her cheek like light through a curtain.",
            nx: 'n12'
          },
          n12: {
            t: "please stay. the light is warm. the room is yours. you have a wife and a child and a life and it is good and it is yours and it does not matter what it is made of. please. please stay.",
            voice: 'dream',
            nx: 'n13'
          },
          n13: {
            t: "You reach for the lamp. The switch is cold. Colder than metal should be. Colder than anything in a warm room should be.",
            nx: 'n14'
          },
          n14: {
            t: '"Don\'t turn it off," she says. "If you turn it off you will see what is underneath."',
            sp: 'she',
            nx: 'n15'
          },
          n15: {
            t: "You hold the switch. The lamp hums. The room waits.",
            end: true,
            el: 'night six'
          }
        }
      }
    ]
  },

  // ═══════════════════════════════════
  // CHAPTER 7: THE WAKING
  // ═══════════════════════════════════
  7: {
    seed: 7213,
    subtitle: 'the waking',
    rainCount: 100,
    fog: 0.14,
    worldWidth: 1600,
    distortion: 0.85,
    lampWrong: 1.0,
    scenes: [
      {
        type: 'walk',
        nodes: {
          start: {
            t: "The street is barely here. The houses are outlines — shapes that suggest brickwork and roofing and gardens but hold no detail. They are sketches of houses, performed in light.",
            nx: 'w1'
          },
          w1: {
            t: "You walk. The pavement is still solid. Your shoes still make a sound. But the sound is quieter and the solidity is less certain — not soft, but conditional, as though the ground is choosing to be ground and might at any moment choose to be something else.",
            nx: 'w2',
            resume: true
          },
          w2: {
            t: "There are no people. The neighbour's garden is empty. The coffee shop is a shape. The park is a green rectangle that, from this distance, could be painted on a surface rather than existing in three dimensions.",
            nx: 'w3'
          },
          w3: {
            t: "The rain has stopped. Not because the weather has changed but because the sky can no longer sustain the detail. It is a flat, featureless grey — not overcast but absent, a ceiling rather than a sky.",
            nx: 'w4',
            resume: true
          },
          w4: {
            t: "Your daughter's school. You can see it from here — or you can see where it should be. The building is a shape without edges, a suggestion of a school, and you realise you have never been inside it. You have dropped her at the gate and she has walked in and the school has existed only as far as the gate.",
            nx: 'w5'
          },
          w5: {
            t: "this is what looking does. this is what noticing does. the world was complete. the world was furnished and populated and detailed and sufficient and you looked at one lamp and now the world is dissolving because you could not stop looking.",
            voice: 'dream',
            nx: 'w6'
          },
          w6: {
            t: "You stand in the street. The houses are translucent. Through their walls you can see — nothing. Not darkness. Not light. Nothing. The absence of a rendered surface.",
            nx: 'w7'
          },
          w7: {
            t: "Home. Your house. It still has depth. It still has walls and a door and a window behind which the lamp is on and the warm light spills out into the dissolving street like the last solid thing in a world that is remembering it was never solid.",
            end: true,
            el: 'the last walk home'
          }
        },
        pois: [
          { worldX: 150,  nodeId: 'start' },
          { worldX: 450,  nodeId: 'w2' },
          { worldX: 750,  nodeId: 'w4' },
        ]
      },
      {
        type: 'interior',
        nodes: {
          start: {
            t: "The living room. She is on the sofa. Your daughter is on the floor. They are both looking at you. The lamp is on.",
            nx: 'n1'
          },
          n1: {
            t: "The room is the last room. You understand this. Beyond the walls there is nothing now — not a street, not a town, not a world. Just the room and the lamp and the three of you inside it.",
            nx: 'n2'
          },
          n2: {
            t: '"Please," she says. "Please don\'t."',
            sp: 'she',
            nx: 'n3'
          },
          n3: {
            t: '"Dad."',
            sp: 'the child',
            nx: 'n4'
          },
          n4: {
            t: "Your daughter. Your wife. The armchair. The sofa. The side table with the coaster and the old magazine. The lamp with the off-white shade and the metal stem and the heavy base and the warm light that doesn't cast a shadow because it is the only thing that exists and everything else is what it dreams.",
            nx: 'n5'
          },
          n5: {
            t: "you built a life here. you loved here. you were loved. does it matter what the walls are made of? does it matter where the light comes from? you were happy. you were happy. please let that be enough.",
            voice: 'dream',
            nx: 'n6'
          },
          n6: {
            t: "You walk to the lamp. You put your hand on the switch.",
            nx: 'n7'
          },
          n7: {
            t: "She is crying. Your daughter is holding your wife's hand. The room contracts — not physically, but in significance, in density, becoming more itself, becoming the last iteration of a place that tried its best to be real and nearly succeeded.",
            ch: [
              { l: '[ turn it off ]',          nx: 'end_a' },
              { l: '[ take your hand away ]',   nx: 'end_b' },
              { l: '[ look at the bulb ]',      nx: 'end_c' },
            ]
          },

          // ── Ending A: Turn it off (The Waking) ──
          end_a: {
            t: "Click.",
            nx: 'end_a2'
          },
          end_a2: {
            t: "The light goes out. The room goes. The sofa, the armchair, the coffee table, the drawings, the coaster, the magazine — all of it, instantly, as though it was never there. Because it was never there.",
            nx: 'end_a3'
          },
          end_a3: {
            t: "And you are somewhere else.",
            nx: 'end_a4'
          },
          end_a4: {
            t: "Fluorescent light. Hard floor. Ceiling tiles. Voices — real voices, with edges and breath and the imperfect rhythm of people who exist whether you look at them or not.",
            nx: 'end_a5'
          },
          end_a5: {
            t: '"He\'s coming round. He\'s coming round."',
            nx: 'end_a6'
          },
          end_a6: {
            t: "A hospital. You are lying on a hospital floor. There are people above you. Their faces are vivid and detailed and they cast shadows in the fluorescent light and every shadow is exactly where it should be.",
            nx: 'end_a7'
          },
          end_a7: {
            t: "Someone hit you. A car, or a fall, or something you will never clearly remember. You were unconscious for — how long? Minutes. Perhaps minutes.",
            nx: 'end_a8'
          },
          end_a8: {
            t: "Years. You lived years. You had a house and a wife and a daughter and a lamp and a life and it was real, it was real, it was more real than this floor and these tiles and these voices, and it is gone. All of it. Gone in the time it takes a switch to click.",
            nx: 'end_a9'
          },
          end_a9: {
            t: "The grief comes later. Not now — now there is only confusion and the harsh light and hands helping you up and someone saying your name. But later, in a bed that is not your bed in a room that is not your room, you will lie in the dark and you will reach for the switch of a lamp that was never there and the absence of it will be the most real thing you have ever felt.",
            nx: 'end_a10'
          },
          end_a10: {
            t: "You will spend years in this world — the real one, the solid one, the one with shadows that behave — and you will never stop missing a room that didn't exist, made of light from a lamp that couldn't cast a shadow, holding a family that the dark dissolved.",
            end: true,
            el: 'still life'
          },

          // ── Ending B: Take your hand away (The Staying) ──
          end_b: {
            t: "You take your hand away from the switch.",
            nx: 'end_b2'
          },
          end_b2: {
            t: "The lamp stays on. The room stays. She exhales — a long, shaking breath — and your daughter runs to you and wraps her arms around your waist and the warmth of her is real. Not true, perhaps. But real.",
            nx: 'end_b3'
          },
          end_b3: {
            t: "You sit in the armchair. She sits on the sofa. Your daughter draws on the floor. The lamp makes its circle of light on the ceiling and the shadow is still absent and the walls are still light and none of it matters because the room is warm and they are here and you are here and the switch is where you left it.",
            nx: 'end_b4'
          },
          end_b4: {
            t: "Outside the room there is nothing. Inside it there is everything you have. And you choose this. You choose the warm light and the absent shadow and the wife and the child and the room that is made of the lamp's dreaming.",
            nx: 'end_b5'
          },
          end_b5: {
            t: "The lamp stays on. Somewhere, on a hospital floor, a body lies unconscious and the people around it wait for it to wake. And it doesn't wake. And it doesn't wake. And the lamp stays on.",
            end: true,
            el: 'the warm light'
          },

          // ── Ending C: Look at the bulb (The Seeing) ──
          end_c: {
            t: "You don't turn it off. Instead, you lift the shade and look directly at the bulb.",
            nx: 'end_c2'
          },
          end_c2: {
            t: "The filament. A thin wire inside a glass envelope, incandescent, trembling at a frequency you have never been able to hear but have always been able to feel. You look at it. You look into it.",
            nx: 'end_c3'
          },
          end_c3: {
            t: "And you see both. You see the room — your wife, your daughter, the sofa, the armchair, the walls made of light — and you see through the light to what is behind it. The hospital floor. The fluorescent ceiling. The faces. Both at once. Both real. Both yours.",
            nx: 'end_c4'
          },
          end_c4: {
            t: "You stand between them. The living room and the hospital. The lamp and the fluorescent tube. The family made of light and the strangers made of flesh. And you understand that the filament is the seam — the point where one world is stitched to the other.",
            nx: 'end_c5'
          },
          end_c5: {
            t: "You open your eyes on the hospital floor. The fluorescent light is harsh. The hands help you up. The voices say your name.",
            nx: 'end_c6'
          },
          end_c6: {
            t: "But in the corner of the room — the hospital room, the real room — there is a lamp. A standard lamp with a fabric shade, slightly yellowed at the edges. It is not on. But the switch is within reach.",
            nx: 'end_c7'
          },
          end_c7: {
            t: "And you know — with a certainty that is either madness or the truest thing you have ever understood — that if you turn it on, the living room will be there. The sofa. The armchair. The daughter drawing on the floor. The wife watching you from across the room. All of it, waiting inside the light for you to come home.",
            nx: 'end_c8'
          },
          end_c8: {
            t: "You reach for the switch.",
            end: true,
            el: 'the filament'
          }
        }
      }
    ]
  }
};
