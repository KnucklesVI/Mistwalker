# Technical Architecture

How game systems map to code. Three organizing principles working together: a **state machine** that controls turn flow, a **command queue** that makes every action explicit and replayable, and a **notification bus** that keeps the UI informed without tangling it into game logic.

## Why Three Patterns Instead of One

The first draft of this document used an event bus for everything. Research into how successful turn-based roguelikes are actually built (XCOM, Slay the Spire, Caves of Qud, Cogmind, Brogue) revealed that a pure event bus creates "invisible spaghetti" — it looks clean in diagrams but becomes impossible to debug because events trigger events trigger events with no clear thread to follow.

The games that work best use each pattern for what it's good at:

**State Machine** — Controls what CAN happen right now. The game is always in one explicit phase. You can't accidentally trigger combat during resource calculation because the state machine won't allow it. This is the backbone that prevents chaos.

**Command Queue** — Makes every action a first-class object. "Assign Brother Hal to perimeter" isn't a function call buried in a click handler — it's an `AssignCommand` object that gets validated, queued, executed, logged, and can be replayed. The mist clock, raid AI, and the player all produce commands through the same system. This makes debugging trivial: print the command log and you see exactly what happened.

**Notification Bus** — Tells the UI and feed about things that already happened. "Perimeter changed to 71%" is a notification. If you remove the handler, the game still works correctly — you just don't see the number update. Nothing critical flows through notifications. They're announcements, not instructions.

## The Core Pattern

```
┌─────────────────────────────────────────────────────────┐
│                    STATE MACHINE                         │
│                                                         │
│   Controls turn phases. Only one phase is active.       │
│   Each phase defines what systems run and in what       │
│   order. No ambiguity about "what happens when."        │
│                                                         │
│   PLAYER_INPUT → COMMAND_RESOLUTION → WORLD_UPDATE      │
│       → MIST_TICK → COMBAT → PRODUCTION → XP            │
│       → EVENT_CLASSIFICATION → RENDER → WAIT_FOR_INPUT  │
└──────────────────────────┬──────────────────────────────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
     ┌────────────┐ ┌────────────┐ ┌──────────────┐
     │  COMMAND    │ │   STATE    │ │ NOTIFICATION │
     │  QUEUE      │ │   STORE    │ │ BUS          │
     │             │ │            │ │              │
     │ All actions │ │ All data.  │ │ UI updates.  │
     │ from player │ │ Each       │ │ Feed entries.│
     │ and AI go   │ │ module     │ │ Sound cues.  │
     │ here first. │ │ owns a     │ │ Logging.     │
     │             │ │ namespace. │ │              │
     │ Validated.  │ │            │ │ Nothing      │
     │ Logged.     │ │ Readable   │ │ critical     │
     │ Replayable. │ │ by all.    │ │ flows here.  │
     └──────┬─────┘ └──────┬─────┘ └──────┬───────┘
            │              │               │
     ┌──────┴──────────────┴───────────────┴───────┐
     │                  MODULES                     │
     │                                              │
     │   Time · Population · Mist · Knowledge       │
     │   Exploration · Resources · Combat · Events  │
     │                                              │
     │   Called in explicit order by the state       │
     │   machine. Not reacting to events.            │
     │   Each module: reads state, processes          │
     │   commands, writes its own state, emits        │
     │   notifications.                               │
     └──────────────────────┬──────────────────────┘
                            │
     ┌──────────────────────┴──────────────────────┐
     │                 UI LAYER                     │
     │                                              │
     │   Reads state. Listens to notifications.     │
     │   Translates player input into commands.     │
     │   Never touches game logic.                  │
     │                                              │
     │   THIS IS THE ONLY PART THAT KNOWS           │
     │   ABOUT HTML/DOM/BROWSER.                    │
     └─────────────────────────────────────────────┘
```

## Portability: What Survives a Language Change

This architecture is designed so that one day — if the game outgrows the browser — the core can be lifted into another environment. Here's what ports and what doesn't:

### The Portable Core (language-agnostic)

Everything below this line is pure logic. No `document`, no `window`, no DOM, no browser API. Just functions that take data and return data. This ports to C#, Rust, Godot, Unity, or anything else.

- **State Machine** — turn phases and transitions (this is just an enum and a switch)
- **Command definitions** — `AssignCommand`, `AdvanceDayCommand`, `SendExpeditionCommand`, etc. (these are just data objects)
- **Command resolution** — the rules that validate and execute commands (pure functions)
- **All 8 game modules** — mist clock math, perimeter calculation, combat resolution, XP progression, resource production, clue decoding, exploration logic, event classification
- **State Store structure** — the shape of the game's data
- **Data configs** — JSON files for locations, recipes, raids, names, boss definition
- **RNG system** — seeded random number generator (portable math)

### The Non-Portable Shell (browser-specific)

- **UI rendering** — DOM manipulation, CSS, HTML templates
- **Keyboard input** — `addEventListener('keydown', ...)`
- **File I/O** — localStorage, save/load from browser storage
- **Build system** — bundling to single HTML file
- **Sound** — Web Audio API (if we ever add audio)

### The Contract Between Them

The portable core exposes a simple interface:

```
// The core engine — no browser knowledge
engine.initialize(config)           → state
engine.getValidCommands(state)      → Command[]
engine.executeCommand(state, cmd)   → { newState, notifications[] }
engine.advanceDay(state)            → { newState, notifications[] }
engine.getState()                   → state (read-only)
```

The UI shell calls these functions and renders the result. That's it. If you rebuild the shell in Unity or Godot, you call the same functions (rewritten in C# or GDScript) and build a different renderer. The game rules don't change.

This separation also means the core engine can be tested without any browser at all — just feed it commands and check the output state.

## The State Machine: Turn Phases

The game is always in exactly one phase. The state machine controls what happens and in what order. No ambiguity.

```
┌──────────────┐
│ WAITING_FOR   │◄──────────────────────────────────┐
│ INPUT         │   Player can assign people,        │
│               │   plan expeditions, craft,         │
│               │   or press Shift+Enter to          │
│               │   advance the day.                 │
└──────┬───────┘                                    │
       │ Shift+Enter                                │
       ▼                                            │
┌──────────────┐                                    │
│ RESOLVE       │   Execute all queued commands      │
│ COMMANDS      │   from player input phase.         │
│               │   (Assign, Craft, Dig, etc.)       │
└──────┬───────┘                                    │
       ▼                                            │
┌──────────────┐                                    │
│ MIST_TICK     │   Clock advances. Escalation       │
│               │   check. Perimeter recalculation.  │
│               │   New elements? Raids generated?   │
└──────┬───────┘                                    │
       ▼                                            │
┌──────────────┐                                    │
│ COMBAT        │   Resolve any active raids.        │
│               │   Apply casualties and damage.     │
└──────┬───────┘                                    │
       ▼                                            │
┌──────────────┐                                    │
│ EXPLORATION   │   MW daily action resolves.        │
│               │   Expeditions advance.             │
│               │   Digs progress.                   │
└──────┬───────┘                                    │
       ▼                                            │
┌──────────────┐                                    │
│ KNOWLEDGE     │   Scholar work advances.           │
│               │   Clues decoded. Forecasts made.   │
│               │   Dependencies checked.            │
└──────┬───────┘                                    │
       ▼                                            │
┌──────────────┐                                    │
│ PRODUCTION    │   Workers produce food/materials.  │
│               │   Resources consumed. Starvation?  │
└──────┬───────┘                                    │
       ▼                                            │
┌──────────────┐                                    │
│ GROWTH        │   XP processed. Level ups.         │
│               │   Veteran promotions. Healing.     │
└──────┬───────┘                                    │
       ▼                                            │
┌──────────────┐                                    │
│ EVENTS        │   Classify everything that         │
│               │   happened this day. Write feed.   │
│               │   Detect mythic events.            │
└──────┬───────┘                                    │
       ▼                                            │
┌──────────────┐                                    │
│ RENDER        │   UI reads final state.            │
│               │   Feed displayed. Warnings shown.  │
│               │   If mythic: full-screen interrupt. │
└──────┬───────┘                                    │
       │                                            │
       └────────────────────────────────────────────┘
```

**Why this is better than the event cascade:** In the old design, step 3 (Mist) could trigger step 4 (Combat) could trigger step 5 (Population) could trigger step 3 (Mist) again in a loop. Here, each phase runs once, in order, and is done. If the mist kills a priest and that changes the perimeter, it happens during MIST_TICK — not as a surprise cascade three phases later.

## The Command Queue

Every meaningful action is a command object. Player and AI both produce them.

### What a Command Looks Like

```javascript
// Commands are just data. No logic in the object itself.
{
  type: 'ASSIGN',
  characterId: 'hal_007',
  assignment: 'perimeter',
  source: 'player'        // or 'system' for AI/automated actions
}

{
  type: 'COMMIT_MW',
  characterId: 'kael_003',
  source: 'player'
}

{
  type: 'ADVANCE_DAY',
  source: 'player'
}

{
  type: 'GENERATE_RAID',
  raidTemplate: 'corrupt_swarm_02',
  arrivalDay: 45,
  source: 'system'         // mist clock generated this
}
```

### Command Flow

```
1. Player presses a key or clicks something
2. UI translates input into a Command object
3. Command is validated (is this legal right now?)
4. If valid: added to the queue
5. If invalid: UI shows why (e.g., "Cannot assign — character is on expedition")
6. When RESOLVE_COMMANDS phase runs, all queued commands execute in order
7. Every command is logged to the command history
```

### Why Commands Matter

**Debugging:** "Why did Brother Hal die on day 38?" → Print the command log. See every assignment, every expedition, every mist tick. Trace the exact chain of decisions that led to his death.

**Save/Load:** Save the game = save the command history + the initial RNG seed. Load = replay commands from the start. Guaranteed identical state.

**Replay:** End-of-run recap can show key decisions: "Day 12: You committed Kael as Mist Walker. Day 23: You chose Alchemist over Cartographer for Wren. Day 38: You sent the expedition to Ring 2 despite Scholar warning."

**AI uses commands too:** The mist clock doesn't directly mutate state. It generates commands like `GENERATE_RAID` and `ESCALATE_ELEMENT` that go through the same validation and logging as player commands. One system for everything.

**Portability:** A command is just data. `{ type: 'ASSIGN', characterId: 'hal', assignment: 'perimeter' }` is the same concept in any language.

## The Notification Bus

What the old architecture called the "event bus" — but scoped down to announcements only.

### What Notifications Are For

- Telling the UI to update: `{ type: 'PERIMETER_CHANGED', value: 0.71 }`
- Writing to the feed: `{ type: 'FEED_ENTRY', level: 'notable', text: 'Raid incoming in 3 days' }`
- Triggering mythic overlays: `{ type: 'MYTHIC_EVENT', event: { ... } }`
- Logging for debug: `{ type: 'DEBUG', module: 'mist', message: 'Clock ticked to 45' }`

### What Notifications Are NOT For

- Triggering game logic (use commands)
- Changing state in other modules (use the turn phase sequence)
- Making decisions (use the state machine)

### The Test

"If I remove this notification handler, does the game still play correctly?" If yes — it's a proper notification. If no — it should be a command or a phase step, not a notification.

## The Modules

Same 8 modules as before. What changes is HOW they're called: explicitly by the state machine in a defined order, not reacting to events in an unpredictable cascade.

### Module Contract

Every module follows the same interface:

```javascript
// Every module has this shape
module.initialize(config, state)    // Load data configs, set initial state
module.processCommands(commands)    // Handle commands relevant to this module
module.update(state)                // Called during this module's phase
module.getNotifications()           // Return notifications generated this tick
module.getState()                   // Return this module's state slice
```

The state machine calls each module's `update()` during its assigned phase. The module reads whatever state it needs, does its work, writes its own state, and returns notifications. No module calls another module. No module reaches into another module's state to write.

### TimeModule
**Phase:** First (drives everything)
**Owns:** `{ day, phase }`
**Processes commands:** `ADVANCE_DAY`
**Reads from other state:** Nothing
**Writes:** Increments day, transitions phase

### PopulationModule
**Phase:** RESOLVE_COMMANDS (assignments), COMBAT (casualties), GROWTH (XP/leveling)
**Owns:** `{ characters[], assignments{}, rosterSize }`
**Processes commands:** `ASSIGN`, `COMMIT_MW`, `ELEVATE`, `SWITCH_ROLE`
**Reads from other state:** combat results, mist perimeter failures
**Writes:** Character stats, assignments, tier changes, death/injury status

### MistModule
**Phase:** MIST_TICK
**Owns:** `{ clock, elements[], perimeterStability, raidQueue[], sourceAwareness }`
**Processes commands:** `GENERATE_RAID` (self-generated), `SLOW_CLOCK` (if we allow it)
**Reads from other state:** population (priest count/quality for perimeter calc)
**Writes:** Clock progression, element introduction, perimeter value, raid scheduling

### KnowledgeModule
**Phase:** KNOWLEDGE
**Owns:** `{ clues[], decodingQueue[], decoded[], sealed[], dependencies{}, forecasts[], recipes[] }`
**Processes commands:** `ASSIGN_SCHOLAR`, `DECODE`, `FORECAST`
**Reads from other state:** exploration results (new clues), population (scholar assignments)
**Writes:** Decoded knowledge, forecasts, dependency drawer updates, revealed locations

### ExplorationModule
**Phase:** EXPLORATION
**Owns:** `{ rings[], locations[], expeditions[], digSites[], underground[] }`
**Processes commands:** `MW_ASSIGN`, `SEND_EXPEDITION`, `START_DIG`
**Reads from other state:** population (who's assigned), knowledge (revealed locations)
**Writes:** MW results, expedition progress, dig progress, discovered items

### ResourceModule
**Phase:** PRODUCTION
**Owns:** `{ food, wood, stone, metal, herbs, compounds{}, sacredBandwidth }`
**Processes commands:** `CRAFT`, `APPLY_COMPOUND`
**Reads from other state:** population (worker count, priest count), knowledge (recipes)
**Writes:** Resource quantities, compound inventory, production/consumption rates

### CombatModule
**Phase:** COMBAT
**Owns:** `{ activeRaids[], defenseRating, traps[], combatLog[] }`
**Processes commands:** `SET_DEFENSE`, `BUILD_TRAP`
**Reads from other state:** population (soldier count/quality), mist (incoming raids)
**Writes:** Raid resolution results, trap status, casualty list

### EventModule
**Phase:** EVENTS (last game phase, before render)
**Owns:** `{ feed[], mythicLog[], eventHistory[] }`
**Processes commands:** None (this module only reads)
**Reads from other state:** All notifications generated this day
**Writes:** Classified feed entries, mythic event triggers

## The State Store

Same as before. Central object, namespaced by module, read-global, write-namespaced.

```javascript
const state = {
  time:        { day: 1, phase: 'survival' },
  population:  { characters: [], assignments: {} },
  mist:        { clock: 0, elements: [], perimeterStability: 0.68 },
  knowledge:   { clues: [], decoded: [], sealed: [], forecasts: [] },
  exploration: { rings: [], locations: [], expeditions: [], underground: [] },
  resources:   { food: 80, wood: 40, stone: 20, metal: 5, herbs: 3 },
  combat:      { activeRaids: [], defenseRating: 0, traps: [] },
  events:      { feed: [], mythicLog: [] },
  ui:          { activeTab: 'dashboard', selectedCharacter: null }
}
```

## Day Lifecycle (Revised)

What happens when the player presses Shift+Enter. Compare to the old event cascade — this is an explicit sequence with no surprises.

```
PHASE: WAITING_FOR_INPUT
  Player has been making assignments, planning, crafting.
  Commands are queued but not yet executed.
  Player presses Shift+Enter → ADVANCE_DAY command queued.

PHASE: RESOLVE_COMMANDS
  All queued player commands execute in order.
  PopulationModule processes ASSIGN, COMMIT_MW, ELEVATE commands.
  ResourceModule processes CRAFT commands.
  ExplorationModule processes MW_ASSIGN, SEND_EXPEDITION, START_DIG commands.
  CombatModule processes SET_DEFENSE, BUILD_TRAP commands.
  Each module writes its own state and emits notifications.

PHASE: MIST_TICK
  MistModule runs.
  Clock advances. Escalation check.
  Perimeter recalculated based on current priest assignments.
  If new element threshold: element introduced (notification emitted).
  If perimeter check fails: character taken by mist (written to population state).
  If raid scheduled for today: raid becomes active (written to combat state).

PHASE: COMBAT
  CombatModule runs.
  Any active raids resolved against current defense rating.
  Results: casualties list, damage, loot.
  Casualties written to population state.

PHASE: EXPLORATION
  ExplorationModule runs.
  MW daily action resolves (returns clue, scouting data, rescue result, etc.).
  Active expeditions advance by one day. Returning expeditions deposit results.
  Active digs progress. Breakthrough? Chamber discovered.

PHASE: KNOWLEDGE
  KnowledgeModule runs.
  Scholar work queues advance.
  Clue decoded? Location revealed? Lore interpreted?
  Dependency drawer checked — any dependencies met by today's discoveries?
  Threat forecast updated.

PHASE: PRODUCTION
  ResourceModule runs.
  Workers produce food/materials based on assignments.
  Everyone consumes food.
  Sacred bandwidth calculated from priest assignments.
  If food = 0: starvation effects applied.

PHASE: GROWTH
  PopulationModule runs again (growth pass).
  XP awarded based on assignments.
  Anyone cross veteran threshold? → Level up.
  Anyone healing? → Progress toward recovery.

PHASE: EVENTS
  EventModule runs.
  Collects all notifications from the entire day.
  Classifies each: routine, notable, or mythic.
  Writes feed entries.
  If mythic threshold met: flags mythic event for UI.

PHASE: RENDER
  UI reads final state from all modules.
  Dashboard numbers update.
  Feed entries display.
  Warnings display.
  If mythic event flagged: full-screen interrupt before returning to input.

PHASE: WAITING_FOR_INPUT
  Back to the player. Next day begins when they're ready.
```

**Key difference from the old cascade:** Each phase runs, finishes, and is done. If the mist kills a priest in MIST_TICK, the perimeter recalculates immediately within that same phase — not as a surprise event three phases later. Combat casualties are written directly — the PopulationModule doesn't need to "hear" about it through an event; the combat results are in the state store for it to read during GROWTH.

## File Structure

```
mistwalker/
├── index.html                 ← Entry point. Loads the app.
├── src/
│   ├── core/                  ← ★ PORTABLE — no browser dependencies
│   │   ├── engine.js          ← State machine + day loop + command queue
│   │   ├── commands.js        ← Command definitions + validation
│   │   ├── state.js           ← State store structure + read/write rules
│   │   ├── rng.js             ← Seeded random number generator
│   │   └── modules/
│   │       ├── time.js
│   │       ├── population.js
│   │       ├── mist.js
│   │       ├── knowledge.js
│   │       ├── exploration.js
│   │       ├── resources.js
│   │       ├── combat.js
│   │       └── events.js
│   │
│   ├── shell/                 ← BROWSER-SPECIFIC — rebuild for other platforms
│   │   ├── notifications.js   ← Notification bus
│   │   ├── renderer.js        ← Main render loop
│   │   ├── keyboard.js        ← Keyboard navigation system
│   │   ├── save.js            ← localStorage save/load
│   │   ├── tabs/
│   │   │   ├── dashboard.js
│   │   │   ├── people.js
│   │   │   ├── expeditions.js
│   │   │   ├── research.js
│   │   │   └── engineering.js
│   │   ├── components/
│   │   │   ├── feed.js
│   │   │   ├── modal.js
│   │   │   ├── mythic-overlay.js
│   │   │   └── warnings.js
│   │   └── styles.css
│   │
│   └── data/                  ← ★ PORTABLE — pure JSON configs
│       ├── names.json
│       ├── locations.json
│       ├── recipes.json
│       ├── events.json
│       ├── raids.json
│       ├── specializations.json
│       └── source.json
│
├── tests/
│   ├── core/                  ← Tests that run without a browser
│   │   ├── engine.test.js
│   │   ├── commands.test.js
│   │   ├── modules/
│   │   │   ├── time.test.js
│   │   │   ├── population.test.js
│   │   │   ├── mist.test.js
│   │   │   └── ...
│   │   └── integration/
│   │       ├── day-cycle.test.js
│   │       └── full-run.test.js
│   └── shell/                 ← Tests that need a browser/DOM
│       ├── keyboard.test.js
│       └── renderer.test.js
│
└── tools/
    ├── command-logger.js      ← Debug: prints all commands + results
    ├── replay.js              ← Replay a saved command log
    └── simulate.js            ← Run N automated games, report statistics
```

Note the explicit `core/` vs `shell/` split. Everything in `core/` and `data/` is what you'd port to another language. Everything in `shell/` is what you'd rebuild for the new platform. The contract between them is the engine interface:

```
engine.initialize(config) → state
engine.getValidCommands(state) → Command[]
engine.executeCommand(state, cmd) → { newState, notifications[] }
engine.advanceDay(state) → { newState, notifications[] }
```

## Data-Driven Design

Same as before — game content lives in JSON, not in code.

- Adding a new location = editing `locations.json`
- Adding a new recipe = editing `recipes.json`
- Adding a new raid type = editing `raids.json`
- Adding a new specialization = editing `specializations.json`
- Balancing numbers = editing JSON, never JavaScript

Modules read their data configs on initialization. They don't contain content definitions.

## Single-File Deployment

For deployment, a build step bundles `core/` + `shell/` + `data/` into a single HTML file:

```
npm run build → dist/mistwalker.html
```

Preserves the "open a file and play" experience. Development uses the modular source.

## Testing Strategy

**Core tests (no browser needed):**
- Feed a module commands and initial state
- Check output state and notifications
- Run in Node.js, fast, no DOM

**Integration tests:**
- Wire up real engine with all modules
- Simulate multi-day runs with scripted commands
- Verify: no death spirals from stable states, no impossible states, no resource underflows

**Replay tests:**
- Save command log from a manual playthrough
- Replay it programmatically
- Verify identical final state (deterministic guarantee)

**Simulation tests:**
- Run 1000 automated games with random decisions
- Report: average run length, death causes, common failure points, balance outliers

## Open Technical Questions

- [ ] Build tool for single-file output: Vite? Rollup? Custom script?
- [ ] State serialization for saves: full state snapshot vs command replay?
- [ ] RNG seeding: seeded PRNG for deterministic replay (recommended yes)
- [ ] Performance: command log size over a 100-day run — is memory a concern?
- [ ] Mobile/touch: do we need tap targets alongside keyboard-first?
- [ ] Should the command queue support undo during WAITING_FOR_INPUT phase?
