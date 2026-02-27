# IMPLEMENTATION MAP — Mistwalker
<!-- What's built, what works, what doesn't. Load this SECOND every session. -->
<!-- Last updated: v0.05s — 2026-02-17 -->

---

## STATE SHAPE (src/core/state.js)

```javascript
{
  time:       { day, phase, gamePhase },
  population: { characters[], assignments{} },
  mist:       { clock, natures[], discoveredNatures[], perimeterStability,
                raidQueue[], sourceAwareness },
  resources:  { food, wood, stone, metal, herbs, essences{}, compounds{} },
  exploration:{ mwState{}, locations{minor[]}, activeExpedition, completedExpeditions[] },
  combat:     { activeRaids[], defenseRating, traps[], trapInventory[],
                trapBuildProgress, trapProductionEnabled, trapTargetCount,
                trapTargetTotal, trapPlacementQueue,
                pendingSelections{}, confirmedDoctrines[], doctrineTests[] },
  knowledge:  { clues[], activeResearch[], completed[], artifacts[],
                mapFragments, sourceClues },
  library:    { librarianId, scholarStates{}, unlockedAbilities[] },
  buildings:  { workshop, structures[], buildQueue[], repairQueue[],
                unlockedTypes[], towerPins{} },
  creatures:  { types[], compendium{} },
  underground:{ level, progress, roomsDiscovered, rooms[], tomes[] },
  events:     { feed[], history[], notifications[] }
}
```

---

## COMMAND TYPES (src/core/commands.js)

### Population
| Command | Params | Description |
|---------|--------|-------------|
| ASSIGN | characterId, assignment | Change character's task |
| TRAIN | characterId, targetRole | Begin role conversion |
| CANCEL_TRAINING | characterId | Abort training |
| RESCUE_LOST | — | MW searches for lost character |

### Exploration
| Command | Params | Description |
|---------|--------|-------------|
| SEND_MW | ring | MW departs to explore ring |
| CANCEL_MW | — | Cancel MW trip before departure |
| SCOUT_RAID | raidId | MW scouts incoming raid (1 day) |
| SEND_EXPEDITION | party config | Troop expedition to location |
| CANCEL_EXPEDITION | — | Cancel expedition |

### Combat
| Command | Params | Description |
|---------|--------|-------------|
| SET_COMBAT_DOCTRINE | raidId, soldierId, doctrineId | Soldier doctrine vs raid trait |
| SET_COMBAT_PRIEST_ACTION | raidId, priestId, action | Priest action for combat |
| CONFIRM_COMBAT_SELECTIONS | raidId | Lock in selections before battle |
| TOGGLE_TRAP_PRODUCTION | — | Enable/disable engineer trap building |
| PLACE_TRAPS | count | Move traps from inventory → placement queue |

### Building
| Command | Params | Description |
|---------|--------|-------------|
| BUILD | category, type, count | Queue structure for construction |
| PIN_TOWER | towerId, priestId | Manually assign priest to tower |

### Knowledge & Library
| Command | Params | Description |
|---------|--------|-------------|
| CANCEL_RESEARCH | researchId | Remove active research |
| REORDER_RESEARCH | clueId, direction | Move clue up/down in queue |
| PROMOTE_LIBRARIAN | scholarId | Designate scholar as librarian |
| LIBRARY_BROWSE | scholarId | Librarian browses (1 day) |
| LIBRARY_SCAVENGE | scholarId | Grab 5 random books (1 day) |
| LIBRARY_STUDY | scholarId, bookId | Study book (1-7 days by tier) |
| LIBRARY_SEARCH_LANGUAGE | scholarId | Search for language prereq (1 day) |
| LIBRARY_SHELVE | scholarId, bookId | Move book to unread pile |
| LIBRARY_CANCEL | scholarId | Stop current activity |
| SET_STUDY_PREFERENCES | scholarId, prefs | Per-scholar category preferences |

### Items
| Command | Params | Description |
|---------|--------|-------------|
| EQUIP | characterId, itemId | Equip artifact to character |
| UNEQUIP | characterId, itemId | Remove artifact |
| USE_TOME | characterId, tomeId | Apply tome stat boost |

---

## SYSTEMS — STATUS & DETAILS

### POPULATION & CHARACTERS — ✅ IMPLEMENTED

**Module:** `population.js` | **UI:** People tab

- 18 starting chars + 4 unassigned (20 total)
- Role assignment with default task mapping
- Training with configurable durations (worker 3d, soldier 5d, engineer 7d, scholar 8d, priest 10d, MW 14d)
- Injury healing with auto-priest dispatch to infirmary
- XP accumulation (1/day active) + leveling (+1 all stats)
- Character stats: body, mind, spirit (1-3 scale)
- Health states: active, injured, gravely_injured, dead, lost

**Not yet wired:** Veteran/Elevated tier mechanical effects, specialization forks, character naming evolution.

---

### MIST & PERIMETER — ✅ IMPLEMENTED

**Module:** `mist.js` | **UI:** Dashboard (stability gauge)

**Perimeter formula:**
```
Per priest on perimeter:
  base 15 + (spirit - 1) × 3
  × tier bonus (veteran 1.2, elevated 1.5)
  × novice nature penalty (50% per unknown)
```

**Gap consequences (gap = 100 - stability):**
- Food spoilage: 5% at high gap
- Character exposure: 2% injury chance per active char
- Lost in mist: 0.2% per active char

**Raid generation:**
- First raid: day 8-12 (random)
- Interval tightens over time (8d → min 3d)
- Strength scales with mist clock
- Creature type selected from generated creature pool

**Not yet wired:** Mist nature escalation, multi-ring nature stacking, corruption/decay.

---

### COMBAT & RAIDS — ⚠️ PARTIAL

**Module:** `combat.js`, `doctrines.js` | **UI:** Dashboard (raid panel), Build tab (traps)

**Defense calculation:**
```
Soldiers on garrison: body × 2 (veteran ×1.5)
+ Traps: +2 each
+ Walls: +1 wood, +3 stone
+ MW at home: body × 1
```

**What works:**
- Doctrine/priest action selection UI
- Confirmation mechanism (blocks auto-resolve until player confirms)
- 21 creature traits across physical/elemental/supernatural
- Counter map (each trait → primary + secondary counters)
- Trap building with engineer mind bonus scaling
- Trap placement queue (multi-day)
- Combat outcome tiers (decisive/victory/narrow/defeat/catastrophic)
- Structure damage from raids

**What's partial:**
- Doctrine/priest action effectiveness captured but not fully applied to damage reduction
- Doctrine test results recorded but not yet feeding compendium knowledge
- Multi-nature raids not implemented
- Casualty rolls partially wired (structure damage only, no character casualty rolls)

---

### EXPLORATION & MISTWALKER — ✅ IMPLEMENTED

**Module:** `exploration.js` | **UI:** Explore tab

**MW journey:** home → traveling_out → exploring → returning → home
- Ring travel days: [1, 4, 7, 10] for rings 1-4
- Max range: 5 days (configurable)
- Findings table: clues, lore, creatures, artifacts, herbs, locations, map fragments

**Scouting:** 1-day action, reveals raid details + 10% defense bonus

**Expeditions (Layer 2):** MW + priest + party to location
- Challenge resolution logic exists
- Haul rates per role
- Injury risk at dangerous sites

**Not yet wired:** Ring 2+ access, rescue mechanics (template exists), multi-ring findings tables.

---

### KNOWLEDGE & RESEARCH — ✅ IMPLEMENTED

**Module:** `knowledge.js` | **UI:** Research tab (Scriptorium sub-tab)

- Auto-assignment: scholars on 'researching' claim pending clues (1:1)
- Duration: 3 days base, mind bonus +0.5/day per point above 2
- Completion: artifact discovery, location reveal, or clue analysis
- Queue reordering via keyboard

**Not yet wired:** Scholar collaboration bonuses (defined in config), source awareness accumulation, research failure/dead-end mechanic.

---

### LIBRARY SYSTEM — ⚠️ PARTIAL

**Module:** `library.js` | **UI:** Research tab (Library sub-tab)

**What works:**
- Librarian promotion (single designated librarian)
- Browse/scavenge mechanics (find books from 30+ title catalog)
- Study flow (days tracked, outcome on completion)
- Language learning with prerequisites (common → ancient_script → forgotten_tongue → primordial_glyphs)
- Book discovery, category XP tracking, study preferences

**What's partial:**
- Unlocked abilities recorded but NOT applied to game mechanics (priest invocations, soldier doctrines, etc.)
- Specialization thresholds reached but no mechanical outcome
- Librarian-specific bonuses planned but not implemented

---

### CREATURES & BESTIARY — ✅ IMPLEMENTED

**Module:** `creatures.js` | **UI:** Compendium tab

- 5 creature types generated per world (configurable)
- Random name generation (prefix + suffix)
- 4 traits per type (raids use 2/3/4 based on size)
- 21 traits across 3 categories with scout descriptions
- Compendium tracking: sightings, traits_known, traits_confirmed, doctrine_tests

---

### BUILDINGS & STRUCTURES — ✅ IMPLEMENTED

**Module:** `building.js` | **UI:** Build tab

**Towers:** Wood (8w, 2d, 50% mist reduction), Stone (8s, 4d, 50%), Fortified (8s+3m, 6d, 75%)
**Walls:** Wood (10w, 2d, +1 def), Stone (8s, 4d, +3 def)
**Traps:** 5 wood, 2d base, +2 defense each when placed

- Engineer assignment to construction (unified 'building' assignment)
- Tower priest auto-assignment by spirit (highest → best tower)
- Manual tower pin override
- Trap building with mind scaling, Cancel button, progress display (0/3, ∞)
- Auto-assign engineer to 'building' when trap production starts

---

### RESOURCES — ✅ IMPLEMENTED

**Module:** `resources.js` | **UI:** Dashboard (header bar)

- Farmers: 3 food/day + body bonus
- Choppers: 2 wood/day + body bonus
- Quarriers: 2 stone/day + body bonus
- Consumption: 1 food per living character per day
- Perimeter-driven spoilage

**Not yet wired:** Metal production (expedition only), herb collection (MW finds only), essence extraction, crafting/compounds.

---

### UNDERGROUND — ⚠️ DISABLED

**Module:** `underground.js` | **UI:** None (disabled)

Mechanics complete but not called in advanceDay():
- Workers dig (1 + body bonus × 0.2), engineers speed boost (+0.5)
- Room discovery at 25/50/75/100% thresholds
- Tome generation (~12% per day)
- Costs 1 wood + 1 stone per day

---

### EVENTS & FEED — ✅ IMPLEMENTED

**Module:** `events.js` | **UI:** Dashboard (chronicle sidebar)

- Classification: routine, notable, critical, mythic
- Category tagging: people, combat, exploration, research, build, perimeter, resources
- Feed limit: 500 entries
- Day + text + classification color display
- Filter toggle (Q key)

---

### SAVE/LOAD — ✅ IMPLEMENTED (no UI)

- `engine.getState()` returns deep copy with _rngState
- `engine.loadState(savedState)` restores full state
- RNG seed preserved for deterministic replay
- No save/load buttons exposed in UI yet

---

## UI TABS

| # | Tab | Key | Status | Primary Content |
|---|-----|-----|--------|----------------|
| 1 | Dashboard | 1 | ✅ | Day status, quick actions, event feed, raid alerts |
| 2 | People | 2 | ✅ | Full roster, role assignments, health, training, stats |
| 3 | Explore | 3 | ✅ | MW status, scouting, expedition panel, raid list |
| 4 | Scholar | 4 | ✅ | Clue research queue (reorderable) + library workspace |
| 5 | Engineer | 5 | ✅ | Engineer corps, structure queue, trap production, tower pins |
| 6 | Items | 6 | ✅ | Artifact inventory (equip/unequip), tome usage |
| 7 | Compendium | 7 | ✅ | Creature bestiary with progressive reveal |

---

## KEY FORMULAS

**Perimeter:** `15 + (spirit-1)×3` per priest on perimeter, ×tier bonus, ×nature penalty
**Defense:** `body×2` per soldier on garrison + `2` per trap + wall bonuses + `body×1` for MW at home
**Production:** `3 food` (farmer), `2 wood` (chopper), `2 stone` (quarrier) + `(body-2)×0.5` bonus
**Research:** `3 days` base - `(mind-2)×0.5` mind bonus
**Trap build:** `2 days` base, engineer mind bonus `+0.25/day per mind above 2`

---

## NOT YET STARTED (from spec)

- Ring 2-4 access and content
- Crafting & compound system
- Specialization forks (Elevated tier)
- Mist nature escalation and counter training
- Mythic event system (full-screen interrupts)
- Win condition (source found + knowledge check)
- Lose condition (all priests dead OR perimeter 0%)
- Save/Load UI
- Character naming evolution (veteran titles)
- Non-standard transformations
- Source boss fight
