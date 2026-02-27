# CLAUDE REFERENCE — Mistwalker Truth Table
<!-- Compressed for LLM context. Read this FIRST every session. -->
<!-- Last updated: 2026-02-12 | Version: 0.60a (modular rebuild) -->

## RULES (NON-NEGOTIABLE)
- "When I comment, don't do anything — always check with me"
- Bump version LETTER for EVERY code change (0.60a→0.60b)
- Deploy to: versioned file + index.html + archive old snapshot
- Git path: `cd ~/Obsidian/Mistwalker`
- Keyboard-first navigation is a design pillar
- Refer to docs by name/section, NOT B-number labels
- Visual presentation = separable skin layer (skinning rule)
- Reference prototype 0.40a for proven patterns

## NORTH STAR
Six words: Comprehension, Wonder, Efficiency, Agency, Attachment, Tension
Thesis: Fragile monastery spending scarce attention/labor to sequence knowledge faster than entropy.
2-4 hour roguelike. Losing = expected, instructive, fun.

## SIX ROLES (NO MORE)
| Role | Function | Starting# |
|------|----------|-----------|
| Priest | Sacred bandwidth, perimeter barrier, mission bubbles, rites | 4 |
| Soldier | Combat, raids, escorts, base defense | 4 |
| Engineer | Build traps/facilities, dig underground, breach sealed locations | 1 |
| Worker | Farm food, harvest wood/stone/metal, assist digs | 5 |
| Scholar | Decode clues, forecast threats, convert materials, unlock transforms | 1 |
| Mist Walker | ONLY perception source. Explore, scout, rescue. PERMANENT commitment | 1 |
| Unassigned | Player's first identity decisions | 4 |
| **TOTAL** | | **20** |

NO Alchemist. NO Mystic. Those are Scholar specializations (Apothecary) and Priest capabilities.

## THREE-TIER PROGRESSION
- **Novice** — Starting. Lower efficiency, higher failure.
- **Veteran** — XP (~15-20 days active) + milestone gate. Same capabilities, done better.
- **Elevated** — Veteran + scholar research (one-time unlock) + catalyst/facility. Permanent specialization fork.

### Veteran Milestones
Priest=Vigil, Engineer=Breakthrough, Soldier=Stand, Worker=Surplus, Scholar=Decode, MW=Return

### Elevation Specializations (3 per role, MW=none)
- Priest: Shepherd (expedition bubbles), Oathkeeper (rites/resurrection), Chanter (amplify others)
- Engineer: Delver (dig), Ashwright (craft/build), Breacher (sealed locations/field)
- Soldier: Bulwark (defense), Watcher (offense-flip), Vanguard (field commander)
- Worker: Packer (haul heavy), Rootwalker (herbs/cultivate), Tinker (practical insights)
- Scholar: Apothecary (compounds), Cartographer (maps/locations), Ritualist (transformations)
- MW: No standard specs. Identity from lived experience + items + non-standard transforms.

## INTRINSIC STATS
Body (physical), Mind (analysis), Spirit (willpower/sacred)
Mostly fixed. Changed by: rare tomes, artifacts, mythic events, resurrection side effects, extreme mist exposure.
Role switching: resets to novice in new role, old progress FROZEN not erased. MW = never leave.

## ARCHITECTURE (Three Patterns)
1. **State Machine** — Controls turn phases. One phase active at a time.
2. **Command Queue** — Every action = data object. Player + AI both produce commands. Validated, logged, replayable.
3. **Notification Bus** — UI-only announcements. Remove handler = game still works.

### Turn Phases (in order)
```
WAITING_FOR_INPUT → RESOLVE_COMMANDS → MIST_TICK → COMBAT → EXPLORATION → KNOWLEDGE → PRODUCTION → GROWTH → EVENTS → RENDER → WAITING_FOR_INPUT
```

### Module Interface (all 8 modules)
```
module.initialize(config, state)
module.processCommands(commands)
module.update(state)
module.getNotifications()
module.getState()
```

### Eight Modules
| Module | Phase(s) | Owns | Commands |
|--------|----------|------|----------|
| Time | First | day, phase | ADVANCE_DAY |
| Population | RESOLVE, COMBAT, GROWTH | characters[], assignments | ASSIGN, COMMIT_MW, ELEVATE, SWITCH_ROLE |
| Mist | MIST_TICK | clock, natures, perimeterStability, raidQueue | GENERATE_RAID |
| Knowledge | KNOWLEDGE | clues[], decoded[], sealed[], forecasts[] | ASSIGN_SCHOLAR, DECODE, FORECAST |
| Exploration | EXPLORATION | rings[], locations[], expeditions[] | MW_ASSIGN, SEND_EXPEDITION, START_DIG |
| Resources | PRODUCTION | food, wood, stone, metal, herbs, compounds | CRAFT, APPLY_COMPOUND |
| Combat | COMBAT | activeRaids[], defenseRating, traps[] | SET_DEFENSE, BUILD_TRAP |
| Events | EVENTS (last) | feed[], mythicLog[] | None (read-only) |

### Engine Contract (core↔shell)
```
engine.initialize(config) → state
engine.getValidCommands(state) → Command[]
engine.executeCommand(state, cmd) → { newState, notifications[] }
engine.advanceDay(state) → { newState, notifications[] }
engine.getState() → state
```

### State Shape
```javascript
{ time: { day, phase },
  population: { characters: [], assignments: {} },
  mist: { clock: 0, natures: [], perimeterStability: 0.68, raidQueue: [], sourceAwareness: 0 },
  knowledge: { clues: [], decoded: [], sealed: [], forecasts: [] },
  exploration: { rings: [], locations: [], expeditions: [], underground: [] },
  resources: { food: 80, wood: 40, stone: 20, metal: 5, herbs: 3 },
  combat: { activeRaids: [], defenseRating: 0, traps: [] },
  events: { feed: [], mythicLog: [] },
  ui: { activeTab: 'dashboard', selectedCharacter: null } }
```

## FILE STRUCTURE (ES Modules)
```
mistwalker/
├── index.html
├── src/
│   ├── core/          ← PORTABLE (no browser deps)
│   │   ├── engine.js, commands.js, state.js, rng.js
│   │   └── modules/ (time, population, mist, knowledge, exploration, resources, combat, events)
│   ├── shell/         ← BROWSER-SPECIFIC
│   │   ├── renderer.js, keyboard.js, notifications.js, save.js
│   │   ├── tabs/ (dashboard, people, expeditions, research, engineering)
│   │   └── styles.css
│   └── data/          ← PORTABLE (JSON configs)
│       ├── roles.json, names.json, config.json, locations.json, raids.json
```

## MIST SYSTEM
- Mist = emanation of living intelligence (the Source/final boss). Clock ticks regardless.
- 4 rings: Ring1=standard, Ring2=standard+NatureA, Ring3=+NatureB, Ring4=+SourceNature
- Natures from randomized pool (crystalline, darkness, decay, silence, hunger, glorious, more)
- No repeats within a run. Hidden until discovered via knowledge pipeline.
- Adaptation cycle: MW clues → scholar decode → priest trains (OFF the wall) → vulnerability window

### Perimeter
- Gap mechanic: gap = 100 - stability. Proportional risk per day (spoilage, injury, lost-to-mist).
- Priest contribution = base + stat bonuses. Must counter each active nature for full coverage.
- Watchtowers protect priests from mist exposure.

### Source Attention
- NOT a meter. Discrete per-action costs with transparent penalties stated before commit.
- Triggers: activating facilities, major rites, breaching sealed locations, elevation rites.
- Effects: increased raid frequency, mist pressure, targeted raids. Temporary.

## KNOWLEDGE PIPELINE
Perceive (MW) → Interpret (Scholar) → Unlock (capability) → Transform (monastery)
- MW: ONE action/day (explore, scout, rescue, investigate)
- Scholar: pass/fail never misinterpret. Collaboration speeds work.
- Knowledge states: Unknown → Perceived → Interpreted → Sealed (waiting for dependency)
- Map fragments (assembled directly) reveal vital location WHERE. Source clues (scholar decoded) reveal WHAT.

## EXPLORATION
- Rings: outward axis (MW/expeditions, fast, dangerous, info-rich)
- Underground: downward axis (Engineer/workers, slow, resource-hungry, capability-rich)
- Vital locations: 3/ring (Rings 1-3), 1 in Ring 4 (Source lair). Three-tier mini-dungeons (Approach→Chamber→Heart).
- Minor locations: random single-tier encounters. Persist on map. Revisitable.
- Expeditions: multi-day, need MW+soldiers+priest(bubble)+optional engineer/worker.

## COMBAT
- Raids escalate with mist clock. Creatures flavored by ring's mist nature.
- Adjective + stat change on base types. 1-3 signature creatures per nature.
- Scouted raids = advance warning + tactical advantage.

## CRAFTING & FACILITIES (Layer 2+)
5 materials: Organics, Stone/Wood, Metal (expedition-only), Essences (nature-specific), Relics (unique)
3 facility tiers: Basic (anyone), Advanced (right role), Specialized (veteran+)
Recipes discovered via knowledge pipeline. Staffing = resource decision.

## BUILD LAYERS
- **Layer 1 (MVP):** Day tick, 6 roles, basic mist, perimeter, MW explore, scholar decode, Ring 1 locations, basic raids, workers, engineers(traps), feed, keyboard nav, dashboard. Win=find source. Lose=all priests dead OR perimeter=0.
- **Layer 2:** Veteran tier, mist escalation/natures, Ring 2, crafting, digging, multi-day expeditions, dependency drawer, rescue, save system.
- **Layer 3:** Elevated tier + specializations, Ring 3-4, full nature pool, mythic events, naming system, tomes, source boss fight, run summary.

## INTERFACE
7 tabs: Dashboard, Units, Mistwalker, Scholar, Engineer, Artifacts, Alchemy
Keyboard: Tab/Shift+Tab=cycle tabs, Arrows=navigate, Enter=activate, Shift+Enter=next day, Escape=close, Q=feed filter
Feed hierarchy: routine (scroll), notable (highlighted), mythic (full-screen interrupt)
Collapsible sections throughout. Feed entries link to relevant tab.

## SOURCE (FINAL BOSS)
- Ring 4, own unique nature. Must be found via exploration.
- 9 guaranteed Source clues (Tier 3 of vital locations in Rings 1-3) + 3 bonus (Ring 4 exploration)
- Three phases: Shell (Ring 4 prep), Echo (Ring 1-3 thoroughness), Core (deep comprehension)
- Missing clues = harder fight, not impossible. Knowledge fight, not stat check.
- The commitment decision: who goes on assault vs. who stays to hold 4-layer perimeter.
