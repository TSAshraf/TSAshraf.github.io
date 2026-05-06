/* ═══════════════════════════════════════
   DATA — Narrative content & day configs
   All 7 days of The Layer Below
   ═══════════════════════════════════════ */

// Day configuration: seed, weather, scene list, world dimensions
// Scene types: 'walk', 'night', 'inspect'
// Narrative nodes use:
//   t      — text content
//   sp     — speaker label (optional)
//   nx     — next node id
//   ch     — choices array [{l, nx, route?, flag?}]
//   end    — marks scene end
//   el     — end label text
//   voice  — 'burial' for ritual voice styling
//   flag   — set a story flag
//   fx     — trigger visual effect
//   resume — resume walking after text

export const DAYS = {

  // ═══════════════════════════════════
  // DAY 1: THE CUT
  // ═══════════════════════════════════
  1: {
    seed: 4471,
    subtitle: 'the cut',
    snowCount: 45,
    fog: 0.03,
    worldWidth: 2200,
    trenchX: 1100,
    distortion: 0,
    scenes: [
      {
        type: 'walk',
        nodes: {
          start: {
            t: "You arrive at the site just after eight. The bypass route cuts a wide scar through the field to the east. To the west, a row of terraced houses backs onto what remains of the open ground.",
            nx: 'w1'
          },
          w1: {
            t: "The planning condition was straightforward: rescue excavation ahead of construction. Two weeks to record whatever the topsoil strip exposes. Standard procedure.",
            nx: 'w2',
            resume: true
          },
          w2: {
            t: "The machine has already taken the turf off. Beneath it, the subsoil is a pale chalky clay, winter-hard and flecked with frost. Good conditions for seeing features, at least.",
            nx: 'w3',
            resume: true
          },
          w3: {
            t: "You walk the length of the stripped area. Linear features run roughly north-south — field boundaries, probably post-medieval. A few pits. Nothing unexpected.",
            nx: 'w4'
          },
          w4: {
            t: "Near the eastern end of the site, closer to the bypass corridor, the subsoil changes colour. A darker patch, roughly oval, maybe two metres across.",
            nx: 'w5'
          },
          w5: {
            t: "You kneel at the edge of the feature and press a trowel into the fill. It comes away easily — dark, organic-rich soil, distinctly different from the surrounding clay.",
            ch: [
              { l: '[ mark it for excavation ]', nx: 'c1' },
              { l: '[ photograph and move on ]', nx: 'c2' },
            ]
          },
          c1: {
            t: "You flag the feature and note its position on the site plan. Something about its shape — the regularity of the cut — holds your attention a moment longer than it should.",
            nx: 'end1'
          },
          c2: {
            t: "You take a record shot and walk on. But you find yourself looking back at it twice before you reach the site cabin.",
            nx: 'end1'
          },
          end1: {
            t: "The light is already failing by four. You lock the equipment store and head for the accommodation. Behind you, the stripped ground holds the last of the grey winter light like a shallow bowl.",
            end: true,
            el: 'end of day one'
          }
        },
        pois: [
          { worldX: 200,  nodeId: 'start' },
          { worldX: 600,  nodeId: 'w2' },
          { worldX: 900,  nodeId: 'w3' },
          { worldX: 1050, nodeId: 'w4' },
        ]
      },
      {
        type: 'night',
        nodes: {
          start: {
            t: "The site office smells of damp plaster and instant coffee. You spread the day's paperwork across the desk and begin writing context descriptions.",
            nx: 'n1'
          },
          n1: {
            t: "Context 003: sub-oval cut, aligned roughly east-west. Fill dark brown silty clay with occasional charcoal flecks. Relationship to surrounding features unclear.",
            nx: 'n2'
          },
          n2: {
            t: "You pause. You wrote east-west. You're certain the feature ran north-south when you looked at it this afternoon.",
            ch: [
              { l: '[ check the site plan ]', nx: 'n3a' },
              { l: '[ you must be tired ]',   nx: 'n3b' },
            ]
          },
          n3a: {
            t: "The plan shows it running north-south. Your written description says east-west. One of them is wrong. You cross out the description and rewrite it, carefully.",
            nx: 'n4'
          },
          n3b: {
            t: "Long first days do this. Transpose an axis, misread a level. You correct the description and move on.",
            nx: 'n4'
          },
          n4: {
            t: "Outside, the wind moves against the prefab walls. The site is very quiet. You turn off the desk lamp and lie on the narrow bed without undressing.",
            end: true,
            el: 'night one'
          }
        }
      }
    ]
  },

  // ═══════════════════════════════════
  // DAY 2: THE ARRANGEMENT
  // ═══════════════════════════════════
  2: {
    seed: 4471,
    subtitle: 'the arrangement',
    snowCount: 55,
    fog: 0.04,
    worldWidth: 2200,
    trenchX: 1100,
    distortion: 0,
    scenes: [
      {
        type: 'walk',
        nodes: {
          start: {
            t: "Morning. The frost has hardened the spoil heaps into rigid shapes. You walk to the trench with your trowel kit and kneel at the edge of context 003.",
            nx: 'w1'
          },
          w1: {
            t: "Half a day of careful excavation reveals it. A burial. Not a standard inhumation — the skeleton is arranged, certainly, but arranged with purpose that goes beyond funerary convention.",
            nx: 'w2'
          },
          w2: {
            t: "The bones lie in a tight, deliberate pattern. Arms crossed not over the chest but beneath it, hands tucked under the ribcage as though holding something in place. The skull faces downward.",
            nx: 'w3'
          },
          w3: {
            t: "And there, beneath the sternum, half-pressed into the grave cut: an object. Composite. You can see three distinct materials even before you've cleaned it.",
            nx: 'w4'
          },
          w4: {
            t: "A worked stone base, roughly triangular. A shaft of bone or antler, socketed into the stone and extending upward. And binding them together, a corroded metal band — iron, perhaps, or an alloy.",
            ch: [
              { l: '[ clean it in situ ]',   nx: 'c1' },
              { l: '[ record it first ]',     nx: 'c2' },
              { l: '[ call the finds officer ]', nx: 'c3' },
            ]
          },
          c1: {
            t: "You work around it with a wooden tool, exposing its edges. The stone is smooth — deliberately shaped, not broken. The bone shaft is carved with shallow parallel grooves that catch the low sun.",
            nx: 'w5'
          },
          c2: {
            t: "You photograph it from four angles before touching it. In the viewfinder, the object seems more defined than it does to the naked eye, as though the camera sees it differently.",
            nx: 'w5'
          },
          c3: {
            t: "Rachel comes over with her kit. She kneels for a long time without speaking. Then she says, very quietly: 'I've never seen anything like this composite before.'",
            nx: 'w5'
          },
          w5: {
            t: "The arrangement is what strikes you. Not the object alone but the way the body has been placed around it. Arms beneath. Face down. As though the burial itself were a structure — a frame built to hold the object in position.",
            nx: 'w6'
          },
          w6: {
            t: "You spend the rest of the afternoon recording. The light fades. The object remains in the ground, uncovered but unlifted, and you cannot quite explain why you're reluctant to remove it today.",
            end: true,
            el: 'end of day two'
          }
        },
        pois: [
          { worldX: 300,  nodeId: 'start' },
          { worldX: 800,  nodeId: 'w2' },
          { worldX: 1050, nodeId: 'w3' },
        ]
      },
      {
        type: 'night',
        nodes: {
          start: {
            t: "You sit with the day's context sheets and photographs. The burial plan is clean, well-drawn. Everything is where it should be.",
            nx: 'n1'
          },
          n1: {
            t: "Except. The plan shows the skull facing east. You are certain — entirely certain — that it was face down. You drew it face down.",
            nx: 'n2'
          },
          n2: {
            t: "You hold the plan under the lamp and turn it. The pencil lines are yours. The handwriting is yours. But the skull faces east.",
            ch: [
              { l: '[ redraw the plan ]',    nx: 'n3a' },
              { l: '[ leave it for now ]',    nx: 'n3b' },
            ]
          },
          n3a: {
            t: "You draw a corrected version on a fresh sheet. Face down. Arms beneath. The object at the centre. You paperclip it to the original and put both in the folder.",
            nx: 'n4'
          },
          n3b: {
            t: "It can wait until morning. You'll check the photographs against the plan and correct whichever is wrong.",
            nx: 'n4'
          },
          n4: {
            t: "In the dark, the wind sounds different. Lower. More sustained. Not gusting but pressing, as though something were leaning against the walls from outside.",
            end: true,
            el: 'night two'
          }
        }
      }
    ]
  },

  // ═══════════════════════════════════
  // DAY 3: THE LIFT
  // ═══════════════════════════════════
  3: {
    seed: 4471,
    subtitle: 'the lift',
    snowCount: 60,
    fog: 0.05,
    worldWidth: 2200,
    trenchX: 1100,
    distortion: 0.05,
    scenes: [
      {
        type: 'walk',
        nodes: {
          start: {
            t: "You reach the trench at first light. The object is still there, undisturbed, exactly as you left it. The frost has traced the outline of the burial cut in white.",
            nx: 'w1'
          },
          w1: {
            t: "Today you'll lift it. Standard procedure: photograph, record, bag. The bypass construction schedule won't wait. The object needs to come out of the ground.",
            nx: 'w2',
            resume: true
          },
          w2: {
            t: "You work the wooden tool beneath the stone base. It's lodged firmly — pressed into the natural clay as though it has been there a very long time. Centuries, at least. Perhaps longer.",
            nx: 'w3'
          },
          w3: {
            t: "You ease it upward. The soil releases it with a sound you will not be able to describe later — not a crack, not a pop, but a settling. As though something around the burial has exhaled.",
            nx: 'w4',
            fx: 'lift'
          },
          w4: {
            t: "The object sits in your hand. Heavier than expected. The metal binding is cold — genuinely cold, not winter-cold, a deeper cold that seems to radiate from the join between materials.",
            nx: 'w5'
          },
          w5: {
            t: "You place it in the finds tray lined with acid-free tissue. Behind you, the trench is very still.",
            ch: [
              { l: '[ look at the burial ]',  nx: 'c1' },
              { l: '[ walk away ]',            nx: 'c2' },
            ]
          },
          c1: {
            t: "The skeleton lies in its cut, unchanged. But the impression where the object was — the hollow in the clay beneath the sternum — is deeper than you expected. Much deeper. As though the object had been pressing downward, not just resting.",
            nx: 'w6'
          },
          c2: {
            t: "You carry the finds tray toward the site cabin. Halfway across the field, you stop. The quality of the air has changed. Not the temperature — the weight of it.",
            nx: 'w6'
          },
          w6: {
            t: "You set the tray on the cabin table and open your notebook. Your hand moves to write, and you notice your writing has changed — the letters are smaller, tighter, pressed harder into the page.",
            nx: 'w7'
          },
          w7: {
            t: "At the edge of hearing, something that is not the wind and not the bypass traffic and not any sound you can assign a source to.",
            nx: 'v1'
          },
          v1: {
            t: "the arrangement held. the arrangement was sufficient. you have lifted the centre and the edges will now follow.",
            voice: 'burial',
            nx: 'w8'
          },
          w8: {
            t: "You close the notebook. The afternoon light is flat and grey and the terraced houses along the western edge of the site seem closer than they did this morning.",
            end: true,
            el: 'end of day three'
          }
        },
        pois: [
          { worldX: 200,  nodeId: 'start' },
          { worldX: 700,  nodeId: 'w2' },
          { worldX: 1050, nodeId: 'w3' },
        ]
      },
      {
        type: 'night',
        nodes: {
          start: {
            t: "You do not turn on the lamp for a long time. You sit in the dark with the finds tray on the desk and listen to the site.",
            nx: 'n1'
          },
          n1: {
            t: "the binding was three-part. stone for the ground. bone for the body. metal for the years. each element in its place. each place in its element.",
            voice: 'burial',
            nx: 'n2'
          },
          n2: {
            t: "You turn on the lamp. The artefact sits in its tissue, inert. Three materials joined with a precision that speaks of knowledge, not improvisation.",
            ch: [
              { l: '[ examine the metal binding ]', nx: 'n3a' },
              { l: '[ put it away ]',                nx: 'n3b' },
            ]
          },
          n3a: {
            t: "The metal band wraps tightly where stone meets bone. Under the lamp, you can see fine incised lines — not decoration, not random scoring, but something systematic. A notation, perhaps.",
            nx: 'n4'
          },
          n3b: {
            t: "You close the finds tray and slide it into the storage box. But your hand stays on the lid longer than it should, as though waiting for something to move inside.",
            nx: 'n4'
          },
          n4: {
            t: "You lie in the dark. The prefab walls tick and settle around you. Below the floor, you think you can hear the clay.",
            end: true,
            el: 'night three'
          }
        }
      }
    ]
  },

  // ═══════════════════════════════════
  // DAY 4: THE SHIFT
  // ═══════════════════════════════════
  4: {
    seed: 4471,
    subtitle: 'the shift',
    snowCount: 65,
    fog: 0.06,
    worldWidth: 2200,
    trenchX: 1100,
    distortion: 0.15,
    scenes: [
      {
        type: 'walk',
        nodes: {
          start: {
            t: "The trench looks different this morning. The cut that held the burial — context 003 — seems to have shifted. Not dramatically. But the edges are softer, the shape less oval, more elongated.",
            nx: 'w1'
          },
          w1: {
            t: "You check the plan. The plan shows what you drew. But what you're looking at doesn't match what you drew. The northern edge has curved westward by perhaps twenty centimetres.",
            nx: 'w2'
          },
          w2: {
            t: "Features don't move. This is archaeology's one certainty: what's in the ground stays where it is. The cut was made once, centuries ago. Its shape was fixed the moment the tool left the soil.",
            nx: 'w3',
            resume: true
          },
          w3: {
            t: "And yet the plan no longer matches the ground. You measure again. The discrepancy is real.",
            nx: 'w4'
          },
          w4: {
            t: "Rachel hasn't come to site today. Neither has Jamie. The site feels emptier than two absent colleagues can account for.",
            ch: [
              { l: '[ call them ]',           nx: 'c1' },
              { l: '[ keep working alone ]',   nx: 'c2' },
            ]
          },
          c1: {
            t: "Rachel's phone rings out. Jamie's goes to voicemail. You leave a message about the discrepancy in the site records and put the phone away.",
            nx: 'w5'
          },
          c2: {
            t: "The work doesn't require three people. You can excavate and record alone. You've done it before, on difficult sites, in bad weather. This is no different.",
            nx: 'w5'
          },
          w5: {
            t: "You re-plan the burial cut. As you draw, you notice that the linear features to the north — the field boundaries — have shifted too. They no longer run straight. They curve, gently, toward the burial.",
            nx: 'v1'
          },
          v1: {
            t: "the arrangement was not the body alone. the arrangement was the body and the object and the ground beneath and the ground above. you removed the centre. the rest is remembering what it was.",
            voice: 'burial',
            nx: 'w6'
          },
          w6: {
            t: "You look up from the trench. The row of houses to the west — three-storey terraces with slate roofs and narrow gardens — seems to lean very slightly toward the site. A trick of perspective. It must be.",
            end: true,
            el: 'end of day four'
          }
        },
        pois: [
          { worldX: 200,  nodeId: 'start' },
          { worldX: 600,  nodeId: 'w2' },
          { worldX: 1050, nodeId: 'w4' },
        ]
      },
      {
        type: 'night',
        nodes: {
          start: {
            t: "You compare today's plans with yesterday's. The discrepancies are consistent. Every feature on site has moved — slightly, uniformly — toward the point where the burial was found.",
            nx: 'n1'
          },
          n1: {
            t: "This is not possible. You know this. And yet the measurements are there, in your own handwriting, and they do not agree with each other.",
            nx: 'n2'
          },
          n2: {
            t: "the object was placed. the body was arranged around it. the cut was dug to hold the body. the field was shaped to hold the cut. each layer a wall. each wall a word in a sentence that said: stay.",
            voice: 'burial',
            nx: 'n3'
          },
          n3: {
            t: "You look out the window toward the trench. In the darkness, you think you see movement — not above the ground, but in it. A slow, settling motion, as though the earth were rearranging itself.",
            ch: [
              { l: '[ go outside ]',      nx: 'n4a' },
              { l: '[ stay at the desk ]', nx: 'n4b' },
            ]
          },
          n4a: {
            t: "You stand at the edge of the trench in the dark. The air is very still. The burial cut is visible even without a torch — a darker shape in the dark ground, and you cannot tell whether it is the same shape it was this afternoon.",
            nx: 'n5'
          },
          n4b: {
            t: "You stay. You sit at the desk with the plans spread before you and listen to the site through the thin walls. Something is different about the frequency of the silence.",
            nx: 'n5'
          },
          n5: {
            t: "Beneath the floor of the prefab, you hear what might be soil moving. Not falling — moving. Shifting laterally, as though something beneath the surface were adjusting its position.",
            end: true,
            el: 'night four'
          }
        }
      }
    ]
  },

  // ═══════════════════════════════════
  // DAY 5: THE UNDERSTANDING
  // ═══════════════════════════════════
  5: {
    seed: 4471,
    subtitle: 'the understanding',
    snowCount: 70,
    fog: 0.07,
    worldWidth: 2200,
    trenchX: 1100,
    distortion: 0.35,
    scenes: [
      {
        type: 'walk',
        nodes: {
          start: {
            t: "You wake early and spend an hour reading. Not the site records — older material. Parallels. Composite artefacts in depositional contexts. Structured deposits in funerary archaeology.",
            nx: 'w1'
          },
          w1: {
            t: "The literature is sparse but consistent. Objects made of multiple materials — stone, bone, metal — appear in a narrow range of contexts: always in burials, always placed centrally, always with the body arranged around them rather than beside them.",
            nx: 'w2',
            resume: true
          },
          w2: {
            t: "The reports use the word 'anchor.' Not metaphorically. They describe the objects as anchor points — devices intended to fix something in place through the combination of materials.",
            nx: 'w3'
          },
          w3: {
            t: "Stone for the ground. Bone for the flesh. Metal for permanence. Three elements joined to create a single constraint, placed at the centre of a human body arranged not for burial but for containment.",
            nx: 'w4'
          },
          w4: {
            t: "You walk to the trench. The burial cut has changed again. It is wider now, the edges more diffuse, the stratigraphy harder to read. The soil layers don't follow natural deposition. They bend.",
            nx: 'w5'
          },
          w5: {
            t: "The skeleton remains. But the space where the artefact was — the impression in the clay — has deepened further. It now extends below the base of the burial cut, into natural geology that should be undisturbed.",
            ch: [
              { l: '[ measure the depth ]',    nx: 'c1' },
              { l: '[ step back from the edge ]', nx: 'c2' },
            ]
          },
          c1: {
            t: "You lower a ranging rod into the impression. It goes deeper than the burial. Deeper than the ploughsoil. Deeper than the natural clay. You cannot find the bottom without a longer rod.",
            nx: 'w6'
          },
          c2: {
            t: "The edge of the trench feels uncertain beneath your boots. Not soft — the ground is still frozen — but uncertain, as though the soil is deciding whether to be there.",
            nx: 'w6'
          },
          w6: {
            t: "the body was not buried. the body was placed. the object was not deposited. the object was set. the cut was not dug. the cut was built. each act a layer. each layer a seal. you have broken the last intact seal.",
            voice: 'burial',
            nx: 'w7'
          },
          w7: {
            t: "The houses along the western edge of the site have changed. You can see it clearly now. The foundations are visible — exposed, somehow, as though the ground has dropped around them. The houses are deeper than they should be.",
            end: true,
            el: 'end of day five'
          }
        },
        pois: [
          { worldX: 200,  nodeId: 'start' },
          { worldX: 600,  nodeId: 'w2' },
          { worldX: 900,  nodeId: 'w4' },
          { worldX: 1050, nodeId: 'w5' },
        ]
      },
      {
        type: 'night',
        nodes: {
          start: {
            t: "You sit with the artefact. Not examining it — sitting with it. The metal binding is cold. It has not warmed to room temperature since you lifted it two days ago.",
            nx: 'n1'
          },
          n1: {
            t: "the layers are not soil. the layers are intention. each generation laid down a surface and called it ground and the surface held because beneath it the arrangement was intact.",
            voice: 'burial',
            nx: 'n2'
          },
          n2: {
            t: "You understand now. Or you are beginning to understand. The burial was not a grave. It was a mechanism. The body, the object, the cut, the soil above — each element was a component in a structure designed to keep something in position.",
            nx: 'n3'
          },
          n3: {
            t: "And archaeology — your discipline, your careful methodology, your trowels and notebooks and measured drawings — has taken the mechanism apart.",
            ch: [
              { l: '[ can it be put back ]',   nx: 'n4a' },
              { l: '[ what is beneath it ]',    nx: 'n4b' },
            ]
          },
          n4a: {
            t: "You look at the artefact. You look at the site plan. You could replace it. Drive back to the trench, lower it into the impression, rebury it. But the body has been removed. The bones are in finds bags. The arrangement has been disassembled.",
            nx: 'n5'
          },
          n4b: {
            t: "You don't know. The literature doesn't say. The reports describe the anchor, the body, the containment structure — but never what was being contained. As though the authors understood that naming it would be another kind of removal.",
            nx: 'n5'
          },
          n5: {
            t: "The floor of the prefab feels lower tonight. Not much. A centimetre, perhaps. As though the building has settled — or as though the ground beneath it has begun to give way.",
            end: true,
            el: 'night five'
          }
        }
      }
    ]
  },

  // ═══════════════════════════════════
  // DAY 6: THE EXPOSURE
  // ═══════════════════════════════════
  6: {
    seed: 4471,
    subtitle: 'the exposure',
    snowCount: 75,
    fog: 0.09,
    worldWidth: 2200,
    trenchX: 1100,
    distortion: 0.6,
    scenes: [
      {
        type: 'walk',
        nodes: {
          start: {
            t: "The trench has changed overnight. Not shifted — transformed. New features are visible that were not there yesterday. Cuts within cuts, layers within layers, a stratigraphy that defies natural process.",
            nx: 'w1'
          },
          w1: {
            t: "The soil layers are wrong. The chalk natural, which should be the oldest deposit, appears above the clay fill. A medieval horizon sits beneath a prehistoric one. The stratigraphy has inverted.",
            nx: 'w2',
            resume: true
          },
          w2: {
            t: "You are alone on site. Rachel has not answered her phone since day four. Jamie's voicemail is full. The site manager's office in town does not pick up.",
            nx: 'w3'
          },
          w3: {
            t: "you were the last to touch it. you were the last to understand the arrangement. the others have stepped back from the edge. you remain because you still hold the instrument of undoing.",
            voice: 'burial',
            nx: 'w4'
          },
          w4: {
            t: "The burial cut is now three times its original size. The skeleton has not moved, but the space around it has expanded, as though the ground were opening outward from the point where the artefact was removed.",
            nx: 'w5'
          },
          w5: {
            t: "You can see the houses clearly from the trench. They lean toward you. The foundations are fully exposed — rough stone and mortar, far deeper than residential foundations should extend. And below the foundations, older stonework. Much older.",
            ch: [
              { l: '[ approach the houses ]',   nx: 'c1' },
              { l: '[ stay at the trench ]',     nx: 'c2' },
            ]
          },
          c1: {
            t: "You walk toward the nearest house. Through the exposed cross-section of the foundation, you can see rooms — not modern rooms, older ones, stone-floored, following a layout that predates the terrace by centuries. The houses were built on something. The something is still there.",
            nx: 'w6'
          },
          c2: {
            t: "You kneel at the edge and look down. The impression where the artefact was is no longer an impression. It is an opening — narrow, vertical, descending into the clay with an evenness that cannot be natural.",
            nx: 'w6'
          },
          w6: {
            t: "the layer below is not soil. the layer below is not stone. the layer below is what the arrangement was built to cover. every surface you have walked on — every floor, every field, every road — was laid down by hands that understood what was beneath.",
            voice: 'burial',
            nx: 'w7'
          },
          w7: {
            t: "The wind has stopped. The bypass traffic is inaudible. The only sound is the slow, deep settling of the ground beneath your feet, adjusting itself to the absence of the anchor.",
            end: true,
            el: 'end of day six'
          }
        },
        pois: [
          { worldX: 200,  nodeId: 'start' },
          { worldX: 500,  nodeId: 'w2' },
          { worldX: 900,  nodeId: 'w4' },
          { worldX: 1050, nodeId: 'w5' },
        ]
      },
      {
        type: 'night',
        nodes: {
          start: {
            t: "The prefab lists to one side. Not dramatically — a few degrees — but enough that the desk lamp slides to the edge of the table. The floor is no longer level.",
            nx: 'n1'
          },
          n1: {
            t: "You can hear it now without ambiguity. Beneath the floor: movement. Not animal movement, not mechanical movement, but the deep lateral displacement of soil and clay and stone rearranging itself around an absence.",
            nx: 'n2'
          },
          n2: {
            t: "the anchor is in your hands. the anchor is on your desk. the anchor is in a finds tray wrapped in tissue and it is not in the ground and the ground knows.",
            voice: 'burial',
            nx: 'n3'
          },
          n3: {
            t: "You pick up the artefact. It is colder than it has ever been. The metal binding seems tighter. The bone shaft has developed fine cracks that weren't visible before, as though the object itself is under strain.",
            ch: [
              { l: '[ hold it ]',      nx: 'n4a' },
              { l: '[ put it down ]',   nx: 'n4b' },
            ]
          },
          n4a: {
            t: "You hold it. It weighs more than it did. Or perhaps gravity is different here, at the edge of the excavation, in the radius of what the arrangement was designed to contain.",
            nx: 'n5'
          },
          n4b: {
            t: "You set it on the desk. It sits there, inert but present, and the room seems to settle around it — the walls leaning inward, the floor dipping gently toward the point where it rests.",
            nx: 'n5'
          },
          n5: {
            t: "Tomorrow. You will go to the trench tomorrow and you will look at what the removal has exposed and you will record it, because recording is what you know how to do, even when what you are recording should not exist.",
            end: true,
            el: 'night six'
          }
        }
      }
    ]
  },

  // ═══════════════════════════════════
  // DAY 7: THE LAYER BELOW
  // ═══════════════════════════════════
  7: {
    seed: 4471,
    subtitle: 'the layer below',
    snowCount: 80,
    fog: 0.12,
    worldWidth: 2200,
    trenchX: 1100,
    distortion: 0.85,
    scenes: [
      {
        type: 'walk',
        nodes: {
          start: {
            t: "The last day. You walk to the trench carrying the artefact. The site is unrecognisable.",
            nx: 'w1'
          },
          w1: {
            t: "The stripped area has expanded beyond its original limits. The bypass corridor, the houses, the field boundaries — all have been drawn inward. The ground slopes toward the burial from every direction.",
            nx: 'w2',
            resume: true
          },
          w2: {
            t: "The trench is open. Wider than any machine could have stripped it, deeper than any hand could have dug. The stratigraphy is fully exposed — every layer, every deposit, every surface laid down across centuries of occupation, all curving downward toward a single point.",
            nx: 'w3'
          },
          w3: {
            t: "The burial cut is empty. The bones have not been moved — you can see the finds bags in the cabin — but the skeleton is no longer in the ground. The arrangement has undone itself.",
            nx: 'w4'
          },
          w4: {
            t: "What remains is the impression. The space where the artefact was. It extends downward through the clay, through the chalk, through every geological layer, with the smooth regularity of something made rather than formed.",
            nx: 'w5'
          },
          w5: {
            t: "You kneel at the edge and look down. Below the archaeology, below the geology, below everything that has a name and a context number and a place in a sequence, there is another surface.",
            nx: 'v1'
          },
          v1: {
            t: "you see it now. the layer below. not soil. not stone. not anything you have a word for. the surface that was there before surfaces. the ground beneath the ground. the thing the arrangement was built to keep covered.",
            voice: 'burial',
            nx: 'w6'
          },
          w6: {
            t: "You hold the artefact over the opening. The stone, the bone, the metal. Three materials. Three principles. Earth, flesh, permanence. An anchor forged to hold something in place that should not be allowed to move.",
            ch: [
              { l: '[ lower it back ]',       nx: 'end_a' },
              { l: '[ keep holding it ]',      nx: 'end_b' },
              { l: '[ let go ]',               nx: 'end_c' },
            ]
          },
          end_a: {
            t: "You lower the artefact into the impression. It settles into the clay as though remembering its shape. The cold radiates outward from the metal binding and the ground closes around it — slowly, gently, with the patience of something that has waited a very long time to be whole again.",
            nx: 'end_a2'
          },
          end_a2: {
            t: "You step back. The stratigraphy is already reforming. Layers rebuilding themselves from the base upward, each one a seal, each seal a word in a sentence that says: stay.",
            nx: 'end_a3'
          },
          end_a3: {
            t: "You pick up your notebook. You cross out every context description. You erase every plan. You delete every photograph. And when the ground has closed over the burial and the surface is smooth and featureless, you walk away from the site and you do not record what you have seen.",
            nx: 'end_a4'
          },
          end_a4: {
            t: "Some things are buried for a reason. The discipline of archaeology assumes that knowledge is always better than ignorance. Standing here, watching the last of the clay settle over the anchor, you understand that this assumption is not always correct.",
            end: true,
            el: 'the arrangement holds'
          },
          end_b: {
            t: "You hold it. The cold passes through your hands, through your arms, into the centre of your body. You understand the burial now — the arms crossed beneath the sternum, the face pressed down. The body was holding the anchor in place. The body was the final layer of the containment.",
            nx: 'end_b2'
          },
          end_b2: {
            t: "And now you are the one holding it.",
            nx: 'end_b3'
          },
          end_b3: {
            t: "You kneel at the edge of the opening. Your arms fold beneath your chest. Your face turns down. The artefact presses against the clay and the ground begins to close, and you realise that the burial was never a record of the past. It was a position that needed to be filled.",
            nx: 'end_b4'
          },
          end_b4: {
            t: "The snow falls. The ground settles. The arrangement is remade, and in the centuries to come, someone will find you here and wonder what you were holding, and why.",
            end: true,
            el: 'the new arrangement'
          },
          end_c: {
            t: "You open your hand. The artefact falls. It does not hit the bottom of the impression. It continues downward, through the clay, through the chalk, through every layer, accelerating into the dark below the ground, and the sound it makes as it passes through each surface is the sound of a lock opening.",
            nx: 'end_c2'
          },
          end_c2: {
            t: "The layer below is exposed. You see it for one full second — a surface that is not soil, not stone, not anything you have a name for. Something older than geology. Something that was there before the ground was built over it, layer by patient layer, by hands that understood what they were covering.",
            nx: 'end_c3'
          },
          end_c3: {
            t: "And then it moves.",
            nx: 'end_c4'
          },
          end_c4: {
            t: "The record will show that the site was abandoned due to ground instability. The bypass was rerouted. The houses were demolished. The field was left open, and no one built on it again, and no one could say exactly why, only that the ground there felt wrong — as though it were not quite solid, not quite still, not quite finished with whatever it was doing beneath the surface.",
            end: true,
            el: 'the layer below'
          }
        },
        pois: [
          { worldX: 200,  nodeId: 'start' },
          { worldX: 600,  nodeId: 'w2' },
          { worldX: 900,  nodeId: 'w4' },
          { worldX: 1050, nodeId: 'w5' },
        ]
      }
    ]
  }
};
