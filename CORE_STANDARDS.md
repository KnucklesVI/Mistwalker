# Mistwalker Core Architecture Standards

**Version:** 1.0 — established at AlphaB v0.03l
**Purpose:** Keep the core portable, deterministic, and honest.

---

## The One Rule

**Core must never know it lives in a browser.**

Everything in `src/core/` must run identically in Node, a CLI, a test harness, a future Godot bridge, or a web worker. If you can't `import` it into a bare Node script and call `engine.advanceDay()` a thousand times with identical results from the same seed — something is broken.

---

## Rules

### 1. No Browser APIs in Core

Files under `src/core/` must never reference:

- `document`, `window`, `navigator`, `location`
- `HTMLElement`, `querySelector`, `createElement`, `addEventListener`
- `localStorage`, `sessionStorage`, `indexedDB`
- `fetch`, `XMLHttpRequest`, `WebSocket`
- CSS classes, style properties, HTML strings
- Any import from `src/shell/`

**Self-check:** Run `grep -rn "document\.\|window\.\|localStorage\|sessionStorage\|fetch(" src/core/` — it should return nothing.

### 2. No Non-Deterministic Calls in Core

Core logic must produce identical output from identical input. This means:

- **Never use `Math.random()`** — always use the seeded `rng` passed to your function
- **Never use `Date.now()`** — use `state.time.day` or `rng.randInt()` for IDs
- **Never use `performance.now()`** or any clock-based value for game logic

**Self-check:** `grep -rn "Math\.random\|Date\.now\|performance\.now" src/core/` — should return nothing (except comments explaining why not to use them).

### 3. Module Interface Contract

Every module in `src/core/modules/` must export a default object with at minimum:

```javascript
const MyModule = {
  update(state, rng, config, notifications) {
    // Mutate state, push to notifications. Return nothing.
  },
  getState(state) {
    // Return a read-only snapshot of this module's state slice.
  }
};
export default MyModule;
```

**Canonical parameter order:** `(state, rng, config, notifications)`

- `state` — the mutable game state object
- `rng` — the seeded RNG instance (use this, never Math.random)
- `config` — the game configuration (read-only)
- `notifications` — array to push UI-bound messages into

If a module doesn't need `config`, it may omit it: `(state, rng, notifications)`. But `rng` always comes before `config`.

**TimeModule exception:** TimeModule manages phase transitions and uses `nextPhase(state)` instead of `update()`. This is intentional — it's the orchestrator's clock, not a game system.

### 4. State Is the Only Shared Memory

Modules must never import other modules. All inter-module communication goes through the `state` object.

```javascript
// CORRECT — read another system's data through state
const soldiers = state.population.characters.filter(c => c.role === 'soldier');

// WRONG — import and call another module directly
import PopulationModule from './population.js';
PopulationModule.getSoldiers();
```

### 5. Config Is the Single Source of Truth for Balance

Game balance values — anything a designer might want to tweak — must live in `config.js`. Not in module files, not as constants at the top of a function.

**Belongs in config.js:**
- Stat thresholds, damage multipliers, resource rates
- Role requirements, training durations, costs
- Probability tables, loot weights, escalation curves
- Anything with a number that affects gameplay feel

**Belongs in the module:**
- Structural logic (loops, conditionals, state transitions)
- Algorithm shape (how damage is calculated, not what the multiplier is)
- Nothing with a magic number

**How to tell:** If you change the value and the game feels different but doesn't break, it's config. If you change it and the logic stops making sense, it's structural.

### 6. State Must Be Fully Serializable

`JSON.parse(JSON.stringify(state))` must produce a complete, restorable game state. This means:

- No functions in state
- No circular references
- No `Date` objects (use day numbers)
- No references to external objects (DOM nodes, RNG instances)
- IDs must be deterministic (no `Date.now()`, no `Math.random()`)

**The RNG seed must be stored in state** so that loading a saved game can reconstruct the exact random sequence.

### 7. Notifications Are Core's Only Voice

Core never calls shell functions, never triggers callbacks, never emits DOM events. The only way core talks to the outside world is by:

1. Returning new state from `engine.getState()`
2. Pushing typed objects into the `notifications` array

```javascript
notifications.push({
  type: 'RAID_INCOMING',
  data: { strength: 30, arrivalDay: 15 }
});
```

The shell decides what to do with these. Core doesn't care.

### 8. Engine Is the Only Entry Point

Shell code must never reach into modules directly. All interaction goes through `engine.js`:

- `engine.queueCommand(cmd)` — submit player intent
- `engine.advanceDay()` — tick the simulation forward
- `engine.getState()` — get an immutable snapshot
- `engine.getValidCommands(state)` — query what's legal

No shell file should ever `import` from `src/core/modules/`.

---

## Process: Before Every Change

1. **Am I adding a number?** → Put it in `config.js`, reference it from the module.
2. **Am I generating something random?** → Use the passed `rng`, never `Math.random()`.
3. **Am I generating an ID?** → Use `state.time.day` + `rng`, never `Date.now()`.
4. **Am I adding a new module?** → Follow the `{ update(state, rng, config, notifications), getState(state) }` contract.
5. **Am I adding a UI concern?** → It goes in `src/shell/`, not `src/core/`.
6. **Am I reading another system's data?** → Go through `state`, don't import the module.

## Process: After Every Change

Run the portability check:

```bash
# 1. No browser APIs in core
grep -rn "document\.\|window\.\|localStorage\|fetch(" src/core/
# Expected: no output

# 2. No non-deterministic calls
grep -rn "Math\.random\|Date\.now\|performance\.now" src/core/
# Expected: no output

# 3. Syntax check all core files
for f in src/core/*.js src/core/modules/*.js; do node --check "$f"; done
# Expected: no errors

# 4. Determinism test — same seed, same result
node -e "
import MistwalkEngine from './src/core/engine.js';
import defaultConfig from './src/core/config.js';
const e1 = new MistwalkEngine(defaultConfig, 42);
const e2 = new MistwalkEngine(defaultConfig, 42);
e1.initialize(); e2.initialize();
for (let i = 0; i < 30; i++) { e1.advanceDay(); e2.advanceDay(); }
const s1 = JSON.stringify(e1.getState());
const s2 = JSON.stringify(e2.getState());
console.log(s1 === s2 ? 'DETERMINISTIC ✓' : 'DIVERGED ✗');
" --input-type=module
# Expected: DETERMINISTIC ✓
```

---

## Current Violations (as of v0.05s)

| File | Line(s) | Violation | Rule | Status |
|------|---------|-----------|------|--------|
| building.js | 348 | `Math.random()` for build queue ID | Rule 2 | OPEN |
| creatures.js | 130 | `Date.now` ternary (dead code but present) | Rule 2 | OPEN |

**Previously fixed (v0.03l → v0.05s):**
- ~~exploration.js Math.random() calls~~ — replaced with seeded rng
- ~~underground.js Date.now() for tome IDs~~ — replaced with rng
- ~~engine.js RNG state not serialized~~ — _rngState now in getState()
- ~~exploration.js param order~~ — corrected to (state, rng, config, notifications)
- ~~knowledge.js param order~~ — corrected to (state, rng, config, notifications)

---

## What This Enables

When these standards are met, the core can be:

- **Tested headlessly** — spin up 1000 games, assert no crashes by day 100
- **Saved and loaded** — serialize state to JSON, restore it, keep playing
- **Replayed** — same seed = same game, every time
- **Ported** — drop `src/core/` into any JS runtime with a new shell
- **Balanced remotely** — swap `config.js`, ship new tuning without code changes
