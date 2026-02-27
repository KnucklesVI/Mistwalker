# Mistwalker - Core Game Engine

A turn-based strategy game engine for the Mistwalker settlement survival game. This implementation follows a clean architecture with a portable core engine (no browser dependencies) and a separate shell for UI.

## Architecture

### Core `/src/core/`

**Portable game logic with no browser dependencies.**

#### Main Files

- **engine.js** - Main orchestrator. Manages the game loop, phase progression, command processing, and state updates.
- **state.js** - Central state store with `createInitialState()` factory function.
- **config.js** - Centralized game mechanics configuration with curve application system.
- **commands.js** - Command definitions and validation system.
- **rng.js** - Deterministic seeded pseudo-random number generator (LCG-based).

#### Modules (`/src/core/modules/`)

Each module owns a subsystem and follows a standard interface:
- `initialize(config, state)` - Setup
- `processCommands(commands, state, ...)` - Handle player commands
- `update(state, rng, config, ...)` - Execute phase logic
- `getState(state)` - Return read-only copy

**Module List:**
- **time.js** - Turn structure and phase progression (10 phases per day)
- **population.js** - Character roster, training, healing, XP
- **mist.js** - Mist clock, perimeter defense, raid generation
- **resources.js** - Food/wood/stone production and consumption
- **exploration.js** - Mistwalker exploration and findings
- **combat.js** - Raid resolution and combat calculations
- **knowledge.js** - Scholar research pipeline
- **events.js** - Event classification and feed building

### Data `/src/data/`

JSON configuration files for the game world:

- **names.json** - 100+ fantasy names for character generation
- **locations.json** - Ring 1 locations (3 vital, 5 minor with tiers and rewards)
- **raids.json** - Creature templates for raid generation
- **artifacts.json** - Equipment with stat bonuses and special effects

### Shell `/src/shell/`

Browser-specific UI layer (not implemented by this agent).

## Game Loop

The engine processes one complete day in 10 phases:

1. **WAITING_FOR_INPUT** - Player queues commands
2. **RESOLVE_COMMANDS** - Commands are executed
3. **MIST_TICK** - Clock advances, perimeter recalculated, raids generated
4. **COMBAT** - Raids resolved
5. **EXPLORATION** - Mistwalker travel/exploration/findings
6. **KNOWLEDGE** - Scholar research advancement
7. **PRODUCTION** - Workers produce resources
8. **GROWTH** - Training advances, healing, XP awarded
9. **EVENTS** - Notifications classified, feed updated
10. **RENDER** - UI signals (then loops back to phase 1 next day)

## Key Systems

### Command Queue

Every action is a command object validated against current state:

```javascript
engine.queueCommand({
  type: 'ASSIGN',
  characterId: 'char_0',
  assignment: 'perimeter'
});

engine.queueCommand({
  type: 'TRAIN',
  characterId: 'char_5',
  targetRole: 'soldier'
});
```

### State Machine

Phase-based progression with one active phase at a time:

```javascript
// Get current phase
const phase = engine.state.time.phase;

// Advance to next phase
TimeModule.nextPhase(engine.state);
```

### Notification Bus

All changes produce notifications describing what happened:

```javascript
const result = engine.advanceDay();
for (const notif of result.notifications) {
  console.log(`[${notif.type}] ${notif.message}`);
}
```

## Usage

```javascript
import MistwalkEngine from './src/core/engine.js';

// Initialize
const engine = new MistwalkEngine();

// Queue commands
engine.queueCommand({
  type: 'ASSIGN',
  characterId: char.id,
  assignment: 'farming'
});

// Advance one complete day
const { newState, notifications } = engine.advanceDay();

// Get current state (read-only)
const state = engine.getState();

// Get game summary
const summary = engine.getSummary();
// {
//   day: 1,
//   phase: 'WAITING_FOR_INPUT',
//   gamePhase: 'survival',
//   population: { priest: 4, soldier: 4, ... },
//   resources: { food: 100, wood: 30, ... },
//   perimeter: 84,
//   defense: 35
// }
```

## Character Generation

Characters are generated with:
- Name (random from names.json)
- Role (priest/soldier/engineer/worker/scholar/mistwalker/unassigned)
- Stats: Body, Mind, Spirit (1-5 with weighted distribution biased toward role requirements)
- Default assignment (role-specific)
- Initial health status (active)

Role requirements:
- **Priest:** Spirit 4+
- **Soldier:** Body 4+
- **Engineer:** Mind 3+ AND Body 3+
- **Scholar:** Mind 4+
- **Mistwalker:** Spirit 4+ AND Body 4+
- **Worker:** None

## Perimeter Defense

Calculated each MIST_TICK:

```
Stability = Sum of:
  - Per priest on perimeter: 15 + (spirit - 1) × 3
  - Tier multiplier (veteran: ×1.2, elevated: ×1.5)
  - Novice penalty if unaware of local natures

Gap Consequences (when stability < target of 100):
  - Food spoilage: gap% × 0.001
  - Exposure injuries: gap% × 0.005 per character
  - Lost in mist: gap% × 0.001 per character
```

## Combat Resolution

Defense rating vs. Raid strength:

| Defense | Outcome | Injuries | Deaths |
|---------|---------|----------|--------|
| ≥ raid × 1.5 | Decisive Victory | 0 | 0 |
| ≥ raid | Victory | 0-1 | 0 |
| ≥ raid × 0.7 | Narrow Victory | 1-2 | 0 |
| ≥ raid × 0.4 | Defeat | 1-3 | 1 |
| < raid × 0.4 | Catastrophic | 3-5 | 2 |

## Resource Economy

**Production (per day):**
- Farmers: 3 food + Body bonus (0.5 per point above 3)
- Choppers: 2 wood + Body bonus
- Quarriers: 2 stone + Body bonus

**Consumption:**
- 1 food per living character per day

## Mistwalker Exploration

MW states: `home`, `traveling_out`, `exploring`, `returning`

**Ring Travel Days:** [1, 4, 7, 10] for rings 1-4

**Ring 1 Findings Table:**
- 50% nothing
- 15% map_fragment
- 10% clue
- 8% minor_location
- 7% herbs_or_cache
- 5% lore
- 3% nature_hint
- 2% artifact

## Configuration

All game mechanics are in `/src/core/config.js`:

```javascript
{
  training: { worker: 3, soldier: 5, engineer: 7, ... },
  resources: { foodPerWorker: 3, woodPerWorker: 2, ... },
  perimeter: { basePerPriest: 15, spiritMultiplier: 3, ... },
  combat: { soldierBodyMultiplier: 2, ... },
  raids: { firstRaidDayMin: 8, firstRaidDayMax: 12, ... },
  exploration: { ringTravelDays: [1,4,7,10], ... },
  health: { injuredRecoveryMin: 3, ... },
  scaling: { curveType, intensity }
}
```

## Testing

Run the included test file:

```bash
node src/core/engine.test.js
```

This demonstrates:
- Engine initialization
- Command queueing
- Day advancement
- Multi-day simulation
- Event feed generation

## Design Principles

1. **Determinism** - Seeded RNG allows replays and testing
2. **Composition** - Modules are independent and composable
3. **Validation** - All commands validated before execution
4. **Immutability** - State is deep-copied, originals never modified
5. **Observability** - Every change produces notifications
6. **Configuration** - No hardcoded numbers, all in config.js
7. **Separation of Concerns** - Core logic isolated from UI

## Future Enhancements

- Building system (build commands, structure tiers)
- Crafting system (craft commands, recipes)
- Equipment system (equip/unequip items)
- Advanced research trees
- Trap placement and management
- Multi-ring exploration
- Nature discovery and counter-abilities
- Character specializations
- Mission/expedition system
- Seasonal effects
- Advanced AI for NPC roles

---

**Note:** This is the core game engine. The shell (UI layer) will be implemented separately and communicate via the command queue and notification bus.
