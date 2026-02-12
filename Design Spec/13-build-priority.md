# Build Priority

What we build first, second, and third. The goal is to prove the core loop is fun before investing in the full vision.

## Principle

Each build layer must be playable on its own. Layer 1 is a complete (if minimal) game. Each subsequent layer adds depth without breaking what came before. If Layer 1 isn't fun, no amount of layering will save it.

## Layer 1 — The Core Loop (MVP)

**Goal:** Prove that managing 20 people against a ticking clock with scarce perception is fun.

**What's in:**
- Day advancement (the clock ticks)
- 20 named characters with basic role assignment (Priest, Soldier, Engineer, Worker, Scholar, Mist Walker)
- The mist: perimeter stability math, basic physical mist, degradation over time
- Priest assignment → perimeter coverage (the sacred bandwidth economy)
- MW: one action per day (explore only — returns clues)
- Scholar: clue decoding (3 clues → location revealed)
- Locations: one ring, 3-4 discoverable locations with simple rewards
- Basic raids: physical creatures, resolved by soldier count + traps
- Workers: food production and basic materials
- Engineers: trap construction
- The feed: routine and notable events in a scrollable log
- Keyboard-first navigation (Tab, arrows, Enter, Escape, Shift+Enter for next day)
- Dashboard: perimeter %, day counter, people assignments, food/material counts
- Win condition: find the source location and defeat it (simplified — a knowledge check)
- Lose condition: all priests dead or perimeter hits 0%

**What's NOT in (yet):**
- Veteran/Elevated tiers (everyone is a novice)
- Specialization paths
- Mist elements beyond physical
- Ring 2 and Ring 3
- Underground digging
- The dependency drawer
- Mythic events (only routine and notable)
- Character naming system (just base names)
- Non-standard transformations
- Crafting/compounds
- The full source boss fight

**What this proves:** Is the core tension of "spend scarce attention to outpace entropy" engaging? Does the MW one-action-per-day feel agonizing? Does assigning 20 people create real forks?

---

## Layer 2 — Depth

**Goal:** Add the knowledge pipeline and qualitative progression. The game starts to feel like the full vision.

**What's added:**
- Veteran tier: characters level up through use, gain quantitative improvements
- Mist escalation: corruption element appears on a clock. Priests must adapt or perimeter degrades.
- Ring 2: corrupt zone. New threats, new discoveries.
- Scholar expansion: threat forecasting, material conversion, lore research
- Crafting: basic corruption compounds (corpse essences + herbs → counter)
- Underground digging: engineers + workers excavate. Facilities discovered.
- The dependency drawer: sealed items with hints. Opens when dependencies are met.
- Multi-day expeditions: send teams out, base is vulnerable while they're gone.
- Notable events get proper highlighting. Feed filter (Q key).
- Character names gain veteran titles ("Hal the Steadfast")
- Rescue mechanic: lost people can be found by MW
- Save system (save-and-exit)

**What this proves:** Does the perception-interpretation-transformation pipeline create compelling long-term play? Does the mist clock create the right kind of pressure? Does digging create a satisfying second axis of discovery?

---

## Layer 3 — Identity

**Goal:** The game becomes fully itself. Wonder, attachment, and existential stakes.

**What's added:**
- Elevated tier: specialization forks for each role
- Non-standard transformations from lived experience
- Ring 3: second nature zone. Path to the source.
- Full mist nature pool (randomized per run, stacking additively across rings)
- Mythic events: full-screen interrupts for chapter moments
- Gandalf-style naming system: characters accumulate titles
- Tomes: bindable artifacts that change character capabilities
- The full source boss fight: multi-phase knowledge check
- The final push decision: when do you commit?
- Run summary: end-of-run recap showing key decisions, character fates, mysteries sealed and unsolved
- Difficulty options / modifiers for replayability
- Audio/visual polish: mist ambient sounds, typography-driven atmosphere

**What this proves:** Does the full 2-4 hour experience deliver on the six words? Does the player remember this run? Would they play again?

---

## What Gets Ported from the Current Prototype

The existing Alpha 0.40a has systems worth keeping. These should be **rebuilt clean, not copy-pasted**:

| System | Port? | Notes |
|--------|-------|-------|
| Labor ecology (20 workers, role switching) | Yes — core mechanic | Rebuild with clean module boundaries |
| Perimeter math (priests × coverage) | Yes — proven fun | Simplify, make data-driven |
| Expedition mechanics (send team, multi-day, return) | Yes — core rhythm | Rebuild with event bus |
| Clue pipeline (find → decode → reveal) | Yes — central pipeline | Expand for full knowledge system |
| Keyboard navigation system | Yes — design pillar | Port directly, extend for new views |
| Dig system (engineer + workers) | Yes — proven loop | Rebuild with procedural chamber discovery |
| Feed system (daily event log) | Yes — game's voice | Rebuild with proper event hierarchy |
| Modal system | Partial — interaction pattern | Simplify, use for character detail / forks |
| Trap crafting | Partial — concept is good | Rebuild as part of crafting module |
| Current UI layout (tabs, dashboard) | Partial — tab structure works | Rebuild with clean information architecture |

| System | Port? | Notes |
|--------|-------|-------|
| Single-file architecture | No | Modular from the start |
| Hardcoded content definitions | No | Data-driven configs |
| Tangled render/state/logic | No | Separated via event bus |
| Mystic/Alchemist as separate roles | No | They become specialization paths |
| The current "obvious decisions" | No | Every fork must be agonizing |
