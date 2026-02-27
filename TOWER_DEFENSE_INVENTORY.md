# Tower-Defense Concept Inventory

Exhaustive reference inventory for 4 concept groups across the Mistwalker codebase.

Format: `ConceptGroup | Token | FilePath | Line(s) | ContextType | Description`

---

## 1. Traps

```
Traps | traps                    | core/state.js              | 242  | STATE_DEFINITION     | Active placed traps array in combat state
Traps | trapBuildProgress        | core/state.js              | 243  | STATE_DEFINITION     | Float accumulator for trap construction progress
Traps | trapProductionEnabled    | core/state.js              | 244  | STATE_DEFINITION     | Boolean flag enabling/disabling engineer trap crafting
Traps | trapTargetCount          | core/state.js              | 245  | STATE_DEFINITION     | Remaining traps to build (null=disabled, Infinity=continuous)
Traps | trapTargetTotal          | core/state.js              | 246  | STATE_DEFINITION     | Original target for progress display (null=infinite)
Traps | trapInventory            | core/state.js              | 247  | STATE_DEFINITION     | Array of built but not-yet-placed traps
Traps | trapPlacementQueue       | core/state.js              | 248  | STATE_DEFINITION     | Queue object tracking placement in progress
Traps | trapDefense              | core/config.js             | 91   | CONFIG               | Defense value per placed trap (multiplier)
Traps | traps                    | core/config.js             | 222  | CONFIG               | Trap economics config object
Traps | woodCost                 | core/config.js             | 223  | CONFIG               | Wood cost per trap (5)
Traps | baseBuildDays            | core/config.js             | 224  | CONFIG               | Base build time per trap (2 days)
Traps | mindBonusPerPoint        | core/config.js             | 225  | CONFIG               | Engineer mind bonus on build speed (0.25)
Traps | spike_traps              | core/library-catalog.js    | 172  | CONFIG               | Ability: improved trap damage from library research
Traps | crawler_trap             | core/library-catalog.js    | 584  | CONFIG               | Ability: collapse Fog Crawler tunnels
Traps | lure_craft               | core/library-catalog.js    | 606  | CONFIG               | Ability: engineers build lures to draw creatures to traps
Traps | Tunnel Collapse Traps    | core/modules/doctrines.js  | 17   | CONFIG               | Engineer combat doctrine for tunnel collapse traps
Traps | Slick Coating Traps      | core/modules/doctrines.js  | 38   | CONFIG               | Engineer doctrine secondary ability (eff. 0.5)
Traps | Cooling Flood Traps      | core/modules/doctrines.js  | 45   | CONFIG               | Engineer doctrine for cooling flood traps
Traps | Burning Pitch Traps      | core/modules/doctrines.js  | 74   | CONFIG               | Engineer doctrine secondary ability (eff. 0.5)
Traps | trap damage              | core/modules/knowledge.js  | 36   | CONFIG               | Character trait bonus: +1 trap damage
Traps | trap_wood (recipe)       | core/modules/building.js   | 54   | COMMAND_DEFINITION   | Recipe ID for wood trap in RECIPES array
Traps | category:'trap'          | core/modules/building.js   | 55   | COMMAND_DEFINITION   | Category designation for trap recipe
Traps | placeTraps               | core/modules/building.js   | 191  | COMMAND_DEFINITION   | Method to begin placing traps from inventory
Traps | trapInventory            | core/modules/building.js   | 192  | READ                 | Read inventory for available traps
Traps | trapPlacementQueue       | core/modules/building.js   | 197  | READ                 | Check if placement already in progress
Traps | trapPlacementQueue       | core/modules/building.js   | 206  | WRITE/MUTATE         | Initialize placement queue with count and daysLeft
Traps | trapProductionEnabled    | core/modules/building.js   | 225  | WRITE/MUTATE         | Enable trap production (infinite mode)
Traps | trapTargetCount          | core/modules/building.js   | 226  | WRITE/MUTATE         | Set to null for unlimited
Traps | trapTargetTotal          | core/modules/building.js   | 227  | WRITE/MUTATE         | Set to null for infinite signal
Traps | trapProductionEnabled    | core/modules/building.js   | 235  | WRITE/MUTATE         | Enable trap production (finite mode)
Traps | trapTargetCount          | core/modules/building.js   | 237-238 | WRITE/MUTATE      | Increment target count when queuing more
Traps | trapTargetTotal          | core/modules/building.js   | 242  | WRITE/MUTATE         | Store total for progress display
Traps | buildTraps               | core/modules/combat.js     | 31   | COMMAND_DEFINITION   | Auto-build traps when engineers assigned
Traps | trapProductionEnabled    | core/modules/combat.js     | 41   | READ                 | Check if production is enabled
Traps | trapBuildProgress        | core/modules/combat.js     | 53   | WRITE/MUTATE         | Accumulate daily building progress
Traps | trapBuildProgress        | core/modules/combat.js     | 56   | READ                 | Check if completion threshold reached
Traps | trapTargetCount          | core/modules/combat.js     | 58   | READ                 | Check remaining target count
Traps | trapProductionEnabled    | core/modules/combat.js     | 60   | WRITE/MUTATE         | Disable when target reached
Traps | trapTargetTotal          | core/modules/combat.js     | 61   | WRITE/MUTATE         | Clear target total when finished
Traps | trapBuildProgress        | core/modules/combat.js     | 65   | WRITE/MUTATE         | Decrement progress after building
Traps | trapInventory            | core/modules/combat.js     | 68-70| WRITE/MUTATE         | Push newly built trap to inventory
Traps | trapTargetCount          | core/modules/combat.js     | 74-77| WRITE/MUTATE         | Decrement remaining; disable on zero
Traps | processPlacementQueue    | core/modules/combat.js     | 93   | COMMAND_DEFINITION   | Process placement queue each tick
Traps | trapPlacementQueue       | core/modules/combat.js     | 94-103 | WRITE/MUTATE       | Decrement days, splice inventory, push to active traps
Traps | trapDefense              | core/modules/combat.js     | 109  | READ                 | Read config for defense calculation
Traps | traps.length             | core/modules/combat.js     | 134  | CALCULATION          | Include trap count × trapDefense in defense rating
Traps | traps                    | core/modules/combat.js     | 472-486 | WRITE/MUTATE      | Consume traps after combat (50%/75%/100% based on outcome)
Traps | handleToggleTrapProduction | core/modules/combat.js   | 527  | COMMAND_DEFINITION   | Toggle trap production on/off
Traps | trapProductionEnabled    | core/modules/combat.js     | 528  | WRITE/MUTATE         | Flip production flag
Traps | trapTargetTotal          | core/modules/combat.js     | 530  | WRITE/MUTATE         | Clear target total on disable
Traps | traps                    | core/modules/combat.js     | 546  | READ                 | Copy traps array for getState snapshot
Traps | trapBuildProgress        | core/modules/combat.js     | 547  | READ                 | Copy build progress for snapshot
Traps | trapProductionEnabled    | core/modules/combat.js     | 548  | READ                 | Copy production flag for snapshot
Traps | category:'trap'          | core/commands.js           | 300  | COMMAND_DEFINITION   | Validate build command for trap category
Traps | trapInventory            | core/commands.js           | 577  | READ                 | Validate traps available for PLACE_TRAPS
Traps | trapPlacementQueue       | core/commands.js           | 579  | READ                 | Validate no placement in progress
Traps | trapInventory            | shell/renderer.js          | 280-281 | UI_RENDER         | Set indicator when traps ready for placement
Traps | trapCount                | shell/components/header-bar.js | 143 | READ              | Get placed trap count for header
Traps | trapDefense              | shell/components/header-bar.js | 145 | READ              | Get trap defense config for header
Traps | trapCount                | shell/components/header-bar.js | 161-163 | UI_RENDER      | Display trap count and defense contribution
Traps | trapProductionEnabled    | shell/tabs/people.js       | 33   | READ                 | Check if production active for engineer display
Traps | trapTargetTotal          | shell/tabs/people.js       | 34   | READ                 | Get total for progress display
Traps | trapTargetCount          | shell/tabs/people.js       | 35   | READ                 | Get remaining for progress display
Traps | trapProductionEnabled    | shell/tabs/build.js        | 49   | READ                 | Check production for activity status
Traps | trapTargetTotal          | shell/tabs/build.js        | 50   | READ                 | Get total target
Traps | trapTargetCount          | shell/tabs/build.js        | 51   | READ                 | Get remaining target
Traps | trapCount                | shell/tabs/build.js        | 114  | READ                 | Get placed traps for summary
Traps | trapDefense              | shell/tabs/build.js        | 115  | CALCULATION          | Calculate trap defense contribution
Traps | trapInventory            | shell/tabs/build.js        | 246-296 | UI_RENDER         | Inventory count, place button, dropdown options
Traps | trapPlacementQueue       | shell/tabs/build.js        | 265-268 | UI_RENDER         | Show placement in progress with days remaining
Traps | trapCount                | shell/tabs/build.js        | 402  | READ                 | Placed count for recipe display
Traps | trapTarget/trapTotal     | shell/tabs/build.js        | 403-465 | UI_RENDER         | Progress display (built/target or ∞), cancel button
Traps | trapActive               | shell/tabs/build.js        | 522-529 | UI_RENDER         | Warning when no engineers assigned
Traps | trapProductionEnabled    | shell/tabs/dashboard.js    | 829  | READ                 | Check if production active for dashboard
Traps | trapEngineers            | shell/tabs/dashboard.js    | 825-835 | UI_RENDER         | Show count of available trap engineers
```

**Trap totals: ~85 distinct references across 13 files**

---

## 2. Structures (HP / Build / Pinning)

```
Structures | structures           | core/state.js              | 299  | STATE_DEFINITION     | Structures array in buildings object
Structures | buildQueue           | core/state.js              | 305  | STATE_DEFINITION     | Build queue array
Structures | repairQueue          | core/state.js              | 306  | STATE_DEFINITION     | Repair queue array
Structures | towerPins            | core/state.js              | 309  | STATE_DEFINITION     | Tower-to-priest pin assignments object
Structures | defenseRating        | core/state.js              | 241  | STATE_DEFINITION     | Defense rating initial value (cross-ref)
Structures | structures           | core/config.js             | 283  | CONFIG               | Structures config object header
Structures | towers               | core/config.js             | 284  | CONFIG               | Tower types configuration
Structures | walls                | core/config.js             | 289  | CONFIG               | Wall types configuration
Structures | raidDamage           | core/config.js             | 293  | CONFIG               | Raid damage to structures config
Structures | BUILD                | core/commands.js           | 14   | COMMAND_DEFINITION   | BUILD command type definition
Structures | PIN_TOWER            | core/commands.js           | 35   | COMMAND_DEFINITION   | PIN_TOWER command type definition
Structures | BUILD                | core/commands.js           | 64   | COMMAND_DEFINITION   | BUILD command validation case
Structures | PIN_TOWER            | core/commands.js           | 112  | COMMAND_DEFINITION   | PIN_TOWER validation case
Structures | getTypeConfig        | core/modules/building.js   | 20   | COMMAND_DEFINITION   | Look up structure type config (tower/wall)
Structures | towers               | core/modules/building.js   | 64   | READ                 | Tower iteration in getRecipes
Structures | walls                | core/modules/building.js   | 69   | READ                 | Wall iteration in getRecipes
Structures | getWallDefense       | core/modules/building.js   | 77   | CALCULATION          | Sum wall defense for active walls
Structures | getTowerMistReductions | core/modules/building.js | 88   | CALCULATION          | Compute mist reduction per intact tower
Structures | getTowerAssignments  | core/modules/building.js   | 115  | CALCULATION          | Compute tower-priest assignments (pins + auto-sort)
Structures | towerPins            | core/modules/building.js   | 123  | READ                 | Read tower pins for assignment logic
Structures | startBuild           | core/modules/building.js   | 217  | COMMAND_DEFINITION   | Start building a structure or trap
Structures | buildQueue           | core/modules/building.js   | 349  | WRITE/MUTATE         | Push new build to queue
Structures | structures           | core/modules/building.js   | 175  | READ                 | Read structures for status
Structures | structures           | core/modules/building.js   | 470  | READ                 | Read structures in applyRaidDamage
Structures | raidDamage           | core/modules/building.js   | 466  | READ                 | Read raid damage config
Structures | raidDamage           | core/modules/building.js   | 483  | CALCULATION          | Apply raid damage to structure HP
Structures | repairQueue          | core/modules/building.js   | 382  | READ                 | Read repair queue in processEngineers
Structures | buildQueue           | core/modules/building.js   | 421  | READ                 | Read build queue in processEngineers
Structures | handlePinTower       | core/modules/building.js   | 534  | COMMAND_DEFINITION   | Pin/unpin priest to tower
Structures | towerPins            | core/modules/building.js   | 534  | WRITE/MUTATE         | Mutate tower pin assignments
Structures | startBuild           | core/engine.js             | 308  | COMMAND_DEFINITION   | BUILD dispatch to BuildingModule
Structures | placeTraps           | core/engine.js             | 316  | COMMAND_DEFINITION   | PLACE_TRAPS dispatch
Structures | handlePinTower       | core/engine.js             | 320  | COMMAND_DEFINITION   | PIN_TOWER dispatch
Structures | getTowerAssignments  | core/modules/mist.js       | 118  | READ                 | Tower assignments for exposure protection
Structures | building (lexicon)   | shell/lexicon.js           | 40   | CONFIG               | "building" assignment label
Structures | getTowerAssignments  | shell/components/header-bar.js | 67 | READ              | Tower assignments for header display
Structures | getTypeConfig        | shell/components/header-bar.js | 73 | READ              | Tower type names for header
Structures | getWallDefense       | shell/components/header-bar.js | 166 | READ             | Wall defense for header
Structures | getTowerAssignments  | shell/tabs/build.js        | 135  | READ                 | Tower assignments for build tab
Structures | getTypeConfig        | shell/tabs/build.js        | 62   | READ                 | Type config for project display
Structures | structures           | shell/tabs/build.js        | 106  | READ                 | Structures array for UI
Structures | towers               | shell/tabs/build.js        | 107  | READ                 | Tower filter for UI
Structures | walls                | shell/tabs/build.js        | 108  | READ                 | Wall filter for UI
Structures | repairQueue          | shell/tabs/build.js        | 109  | READ                 | Repair queue for UI
Structures | buildQueue           | shell/tabs/build.js        | 348  | READ                 | Build queue for UI display
```

**Structure totals: ~42 distinct references across 9 files**

---

## 3. DefenseRating / Garrison

```
DefenseRating | defenseRating      | core/state.js              | 241  | STATE_DEFINITION     | Initial defense rating in combat state
DefenseRating | calculateDefense   | core/modules/combat.js     | 117  | CALCULATION          | Method: sum garrison + traps + walls + doctrines
DefenseRating | garrisonSoldiers   | core/modules/combat.js     | 121  | READ                 | Filter soldiers on garrison for defense calc
DefenseRating | soldierDefense     | core/config.js             | 89   | CONFIG               | Base defense per garrison soldier
DefenseRating | veteranBonus       | core/config.js             | 90   | CONFIG               | Veteran tier defense bonus
DefenseRating | elevatedBonus      | core/config.js             | (near 90) | CONFIG          | Elevated tier defense bonus
DefenseRating | bodyBonus          | core/config.js             | 259  | CONFIG               | Body stat bonus per point
DefenseRating | trapDefense        | core/config.js             | 91   | CONFIG               | Defense per placed trap (cross-ref Traps)
DefenseRating | defenseRating      | core/engine.js             | 51   | WRITE/MUTATE         | Recalculate on initialize
DefenseRating | defenseRating      | core/modules/combat.js     | 215  | WRITE/MUTATE         | Recalculate each combat tick
DefenseRating | garrison           | core/modules/population.js | 109  | CONFIG               | Default soldier assignment
DefenseRating | garrison           | shell/lexicon.js           | 38   | CONFIG               | "garrison" assignment label
DefenseRating | garrison           | shell/components/header-bar.js | 142 | READ              | Filter garrison soldiers for display
DefenseRating | defenseRating      | shell/components/header-bar.js | 144 | READ              | Read defense rating for header
DefenseRating | defenseRating      | shell/components/header-bar.js | 147 | UI_RENDER          | Display defense rating line
DefenseRating | veteranBonus       | shell/components/header-bar.js | 154 | CALCULATION        | Apply veteran bonus in contribution calc
DefenseRating | garrison           | shell/tabs/dashboard.js    | 602  | READ                 | Filter garrison soldiers for dashboard
DefenseRating | defenseRating      | shell/tabs/build.js        | 113  | READ                 | Read defense for build tab summary
```

**DefenseRating totals: ~18 distinct references across 8 files**

---

## 4. Raids / Combat Events

```
Raids | raidQueue               | core/state.js              | 195  | STATE_DEFINITION     | Mist raid queue array
Raids | nextRaidDay             | core/state.js              | 198  | STATE_DEFINITION     | Day of next scheduled raid
Raids | raidCount               | core/state.js              | 199  | STATE_DEFINITION     | Total raids generated (escalation counter)
Raids | activeRaids             | core/state.js              | 240  | STATE_DEFINITION     | Active raids array in combat state
Raids | combatSelections        | core/state.js              | (near 240) | STATE_DEFINITION | Per-raid combat selection state
Raids | raids                   | core/config.js             | 101  | CONFIG               | Raids config section (intervals, strength, escalation)
Raids | firstRaidDayMin/Max     | core/config.js             | 102-103 | CONFIG             | First raid timing range
Raids | baseStrengthMin/Max     | core/config.js             | 104-105 | CONFIG             | Base raid strength range
Raids | strengthPerRaid         | core/config.js             | 106  | CONFIG               | Strength escalation per raid
Raids | intervalMin/Max         | core/config.js             | 107-108 | CONFIG             | Raid interval range
Raids | intervalShrinkPerRaid   | core/config.js             | 109  | CONFIG               | Interval shrink per raid
Raids | minInterval             | core/config.js             | 110  | CONFIG               | Minimum interval floor
Raids | unannouncedChance       | core/config.js             | 111  | CONFIG               | Chance of unannounced raid
Raids | warningDays             | core/config.js             | 112  | CONFIG               | Days warning before announced raid
Raids | SCOUT_RAID              | core/commands.js           | 30   | COMMAND_DEFINITION   | SCOUT_RAID command type
Raids | SET_COMBAT_DOCTRINE     | core/commands.js           | 31   | COMMAND_DEFINITION   | Soldier doctrine selection command
Raids | SET_COMBAT_PRIEST_ACTION| core/commands.js           | 32   | COMMAND_DEFINITION   | Priest combat action command
Raids | CONFIRM_COMBAT_SELECTIONS| core/commands.js          | 33   | COMMAND_DEFINITION   | Confirm all selections for a raid
Raids | raidQueue               | core/modules/mist.js       | 185  | READ                 | Check for existing incoming raids
Raids | raid (object)           | core/modules/mist.js       | 226  | WRITE/MUTATE         | Create raid object with creature type, size, count
Raids | raidQueue               | core/modules/mist.js       | 241  | WRITE/MUTATE         | Push new raid to queue
Raids | raidCount               | core/modules/mist.js       | 242  | WRITE/MUTATE         | Increment raid counter
Raids | nextRaidDay             | core/modules/mist.js       | 277  | WRITE/MUTATE         | Schedule next raid with shrinking interval
Raids | raidQueue               | core/modules/mist.js       | 282  | READ                 | Iterate for incoming→active promotion
Raids | activeRaids             | core/modules/mist.js       | 261  | WRITE/MUTATE         | Push unannounced raid directly to active
Raids | activeRaids             | core/modules/mist.js       | 286  | WRITE/MUTATE         | Push arriving raid to active
Raids | RAID_WARNING            | core/modules/mist.js       | 250  | EVENT/NOTIFICATION   | Warning notification (strength, arrival day)
Raids | RAID_ARRIVED            | core/modules/mist.js       | 264  | EVENT/NOTIFICATION   | Unannounced raid arrival notification
Raids | RAID_ARRIVED            | core/modules/mist.js       | 297  | EVENT/NOTIFICATION   | Announced raid arrival notification
Raids | raidQueue               | core/modules/mist.js       | 314  | READ                 | Map raid queue for player visibility in getState
Raids | activeRaids             | core/modules/combat.js     | 217  | READ                 | Iterate active raids for resolution
Raids | raidStrength            | core/modules/combat.js     | 154  | CALCULATION          | Compare raid strength vs defense
Raids | RAID_RESOLVED           | core/modules/combat.js     | 490  | EVENT/NOTIFICATION   | Raid resolution notification (outcome, casualties)
Raids | activeRaids             | core/modules/combat.js     | 520  | WRITE/MUTATE         | Filter out resolved raids
Raids | activeRaids             | core/modules/combat.js     | 544  | READ                 | Map active raids for state snapshot
Raids | combatSelections        | core/modules/doctrines.js  | 335  | WRITE/MUTATE         | Initialize combat selections for a raid
Raids | initCombatSelections    | core/modules/doctrines.js  | (near 335) | COMMAND_DEFINITION | Method to set up per-raid combat selections
Raids | setSoldierDoctrine      | core/modules/doctrines.js  | (method) | WRITE/MUTATE      | Assign doctrine to soldier for raid
Raids | setPriestAction         | core/modules/doctrines.js  | (method) | WRITE/MUTATE      | Assign priest action for raid
Raids | confirmSelections       | core/modules/doctrines.js  | (method) | WRITE/MUTATE      | Lock in selections for raid
Raids | handleScoutRaid         | core/modules/exploration.js| 54   | COMMAND_DEFINITION   | Scout incoming raid (MW mission)
Raids | RAID_WARNING            | core/modules/events.js     | 50   | EVENT/NOTIFICATION   | Event handler for raid warning
Raids | RAID_ARRIVED            | core/modules/events.js     | 57   | EVENT/NOTIFICATION   | Event handler for raid arrival
Raids | unscoutedRaids          | core/engine.js             | 148  | READ                 | Filter for unscouted incoming raids (valid commands)
Raids | SCOUT_RAID              | core/engine.js             | 228  | COMMAND_DEFINITION   | SCOUT_RAID dispatch
Raids | SET_COMBAT_DOCTRINE     | core/engine.js             | 232  | COMMAND_DEFINITION   | Dispatch to DoctrinesModule
Raids | SET_COMBAT_PRIEST_ACTION| core/engine.js             | 236  | COMMAND_DEFINITION   | Dispatch to DoctrinesModule
Raids | CONFIRM_COMBAT_SELECTIONS| core/engine.js            | 240  | COMMAND_DEFINITION   | Dispatch to DoctrinesModule
Raids | SCOUT_RAID              | shell/renderer.js          | 86   | COMMAND_DEFINITION   | Shell command dispatch
Raids | SET_COMBAT_DOCTRINE     | shell/renderer.js          | 70   | COMMAND_DEFINITION   | Shell command dispatch
Raids | SET_COMBAT_PRIEST_ACTION| shell/renderer.js          | 71   | COMMAND_DEFINITION   | Shell command dispatch
Raids | CONFIRM_COMBAT_SELECTIONS| shell/renderer.js         | 72   | COMMAND_DEFINITION   | Shell command dispatch
Raids | raidQueue               | shell/tabs/explore.js      | 124  | READ                 | Filter unscouted raids for explore tab
Raids | raidQueue               | shell/tabs/explore.js      | 127  | READ                 | Filter scouted raids for explore tab
Raids | activeRaids             | shell/tabs/dashboard.js    | 434  | READ                 | Filter active raids for combat prep display
Raids | combatSelections        | shell/tabs/dashboard.js    | (near 434) | READ            | Read selections for combat prep UI
```

**Raid totals: ~58 distinct references across 12 files**

---

## Summary

### Shell Boundary Violations (Rule 8 Risk)

Shell files that directly import core module functions:

| Shell File | Core Import | Tokens Used |
|---|---|---|
| `shell/components/header-bar.js` | `BuildingModule` | `getTowerAssignments`, `getTypeConfig`, `getWallDefense` |
| `shell/components/header-bar.js` | (direct config reads) | `trapDefense`, `veteranBonus` |
| `shell/tabs/build.js` | `BuildingModule` | `getTowerAssignments`, `getTypeConfig`, `getRecipes` |
| `shell/tabs/dashboard.js` | `DoctrinesModule` | `combatSelections` reads |
| `shell/tabs/dashboard.js` | (direct state reads) | `activeRaids`, `trapEngineers`, `trapProductionEnabled` |
| `shell/tabs/people.js` | (direct state reads) | `trapProductionEnabled`, `trapTargetTotal`, `trapTargetCount` |

These are all **read-only** violations (no shell file mutates core state), but they create coupling that would break if the underlying data shape changes.

### Multi-Module Write Risk (State Ownership)

Tokens written by more than one module:

| Token | Writers | Risk |
|---|---|---|
| `trapProductionEnabled` | `building.js` (startBuild), `combat.js` (buildTraps, handleToggle) | Two modules flip the same flag |
| `trapTargetCount` | `building.js` (startBuild), `combat.js` (buildTraps) | building sets, combat decrements |
| `trapTargetTotal` | `building.js` (startBuild), `combat.js` (buildTraps, handleToggle) | building sets, combat clears |
| `activeRaids` | `mist.js` (push on arrival), `combat.js` (filter on resolve) | Two modules push/remove from same array |
| `combat.defenseRating` | `engine.js` (initialize), `combat.js` (update) | engine seeds, combat recalculates |
| `towerPins` | `building.js` (handlePinTower) | Single writer — clean |
| `buildQueue` | `building.js` (startBuild, processEngineers) | Single writer — clean |

The trap flags (`trapProductionEnabled`, `trapTargetCount`, `trapTargetTotal`) are the worst offenders — building.js initializes them while combat.js mutates and clears them during production ticks.

### Tower-Defense Gravity Anchors

Tokens that are load-bearing for the current tower-defense model and would need removal or replacement for a pressure/containment pivot:

| Anchor | Why It's Load-Bearing | Entanglement |
|---|---|---|
| `defenseRating` | Central metric: garrison + traps + walls → single number compared to raid strength | 8 files, displayed in header and build tab |
| `calculateDefense()` | Aggregation function that fuses soldiers, traps, walls, doctrines into one score | Called every combat tick + initialize |
| `activeRaids` | Discrete wave objects — the entire combat loop iterates this array | Written by mist.js, consumed by combat.js, displayed in dashboard.js |
| `raidQueue` / `nextRaidDay` / `raidCount` | Wave scheduling state — the core escalation mechanic | Mist.js owns generation, explore.js reads for scouting, shell renders |
| `traps` (placed array) | Consumed on combat resolution (50%/75%/100%) — disposable defense | combat.js owns lifecycle, build tab renders, header shows count |
| `combatSelections` | Per-raid tactical prep (doctrine + priest action per combatant) | doctrines.js owns, dashboard.js renders, engine dispatches 3 commands |
| `raidDamage` (structures) | Post-combat structure HP degradation — ties structures to raid outcomes | building.js applies damage, config defines values |

**Cleanest removal target:** `traps` — no other system depends on traps except defense rating and combat resolution. Removing traps requires editing 13 files but breaks zero non-combat mechanics.

**Hardest removal target:** `activeRaids` + `combatSelections` — these are the skeleton of the entire combat loop. Removing them guts combat.js and requires a replacement resolution system.

**Dual-purpose (survives pivot):** `getTowerAssignments` / towers — used by mist.js for exposure reduction even without raids. Towers serve containment purposes independent of tower-defense.
