# Mistwalker Core Engine - Quick Start Guide

## Installation & Setup

```javascript
import MistwalkEngine from './src/core/engine.js';

// Create engine with default config
const engine = new MistwalkEngine();

// Or with custom seed for reproducible games
const engine = new MistwalkEngine(defaultConfig, 12345);
```

## Basic Game Loop

```javascript
// 1. Get current state
const state = engine.getState();
console.log(`Day ${state.time.day}, Phase: ${state.time.phase}`);

// 2. Get valid commands
const commands = engine.getValidCommands(state);

// 3. Player selects and queues commands
const priestChar = state.population.characters[0];
engine.queueCommand({
  type: 'ASSIGN',
  characterId: priestChar.id,
  assignment: 'perimeter'
});

// 4. Advance one complete day (all 10 phases)
const { newState, notifications } = engine.advanceDay();

// 5. Listen to what happened
for (const notif of notifications) {
  console.log(`[${notif.type}] ${notif.message || notif.text}`);
}
```

## Common Tasks

### Get Game Status
```javascript
const summary = engine.getSummary();
// {
//   day: 5,
//   phase: 'WAITING_FOR_INPUT',
//   gamePhase: 'survival',
//   population: { priest: 4, soldier: 4, ... },
//   resources: { food: 85, wood: 30, stone: 15, metal: 0, herbs: 0 },
//   perimeter: 84,
//   defense: 35
// }
```

### Assign a Character
```javascript
const worker = state.population.characters.find(c => c.role === 'worker');
engine.queueCommand({
  type: 'ASSIGN',
  characterId: worker.id,
  assignment: 'farming'  // or 'chopping', 'quarrying'
});
```

### Start Character Training
```javascript
const unassigned = state.population.characters.find(c => c.role === 'unassigned');
engine.queueCommand({
  type: 'TRAIN',
  characterId: unassigned.id,
  targetRole: 'soldier'  // Takes 5 days
});
```

### Send Mistwalker to Explore
```javascript
engine.queueCommand({
  type: 'SEND_MW',
  ring: 1  // Ring 1 takes 1 day to reach
});
```

### Check Perimeter Status
```javascript
const state = engine.getState();
const priests = state.population.characters.filter(c => c.role === 'priest');
const priestsOnPerimeter = priests.filter(c => c.assignment === 'perimeter');
console.log(`${priestsOnPerimeter.length}/${priests.length} priests on perimeter`);
console.log(`Perimeter stability: ${state.mist.perimeterStability.toFixed(0)}/100`);
```

### Check Resources
```javascript
const state = engine.getState();
const res = state.resources;
console.log(`Food: ${res.food}, Wood: ${res.wood}, Stone: ${res.stone}`);

const activeChars = state.population.characters.filter(c => c.health === 'active').length;
const foodPerDay = activeChars; // 1 per character
console.log(`Food sustainability: ${Math.floor(res.food / foodPerDay)} days`);
```

### Check Character Health
```javascript
const state = engine.getState();
const injured = state.population.characters.filter(c => c.health !== 'active' && c.health !== 'dead');
for (const char of injured) {
  console.log(`${char.name}: ${char.health} (recovers in ${char.healingDaysRemaining} days)`);
}
```

### View Event Feed
```javascript
const state = engine.getState();
const recentFeed = state.events.feed.slice(-10);
for (const entry of recentFeed) {
  console.log(`Day ${entry.day} [${entry.classification}]: ${entry.text}`);
}
```

## Advanced Usage

### Get Notifications from Last Day
```javascript
const lastNotifications = engine.getNotifications();
const combatNotifs = lastNotifications.filter(n => n.type.includes('COMBAT'));
```

### Multi-Day Simulation
```javascript
// Simulate 30 days with no player input
for (let i = 0; i < 30; i++) {
  const { newState, notifications } = engine.advanceDay();
  
  // Check for important events
  const deathNotifs = notifications.filter(n => n.type === 'CHARACTER_LOST' || n.type.includes('death'));
  if (deathNotifs.length > 0) {
    console.log(`Day ${engine.state.time.day}: ${deathNotifs.length} character(s) lost`);
  }
}
```

### Execute Command Immediately
```javascript
const cmd = {
  type: 'ASSIGN',
  characterId: char.id,
  assignment: 'farming'
};

const result = engine.executeCommand(engine.getState(), cmd);
if (result.success) {
  // Process result.notifications
} else {
  console.error(result.reason);
}
```

### Reset Game
```javascript
const freshEngine = new MistwalkEngine();
// or
engine.initialize(defaultConfig);
```

## Command Types Reference

```javascript
// Movement & Assignment
{ type: 'ASSIGN', characterId: string, assignment: string }

// Training
{ type: 'TRAIN', characterId: string, targetRole: string }
{ type: 'CANCEL_TRAINING', characterId: string }

// Exploration
{ type: 'SEND_MW', ring: number }
{ type: 'RECALL_MW' }

// Building & Crafting
{ type: 'BUILD', buildingId: string }
{ type: 'CRAFT', itemId: string }

// Equipment
{ type: 'EQUIP', characterId: string, itemId: string }
{ type: 'UNEQUIP', characterId: string, itemId: string }

// Game Control
{ type: 'ADVANCE_DAY' }
```

## Notification Types

```javascript
// Character Events
'CHARACTER_ASSIGNED'        // Assignment changed
'TRAINING_STARTED'          // Training began
'TRAINING_COMPLETE'         // Training finished (notable)
'TRAINING_CANCELLED'        // Training stopped
'CHARACTER_RECOVERED'       // Healed from injury
'CHARACTER_EXPOSED'         // Took injury from mist
'CHARACTER_LOST'            // Lost in mist (mythic)

// Perimeter & Defense
'PERIMETER_STRENGTHENED'    // Stability increased
'PERIMETER_WEAKENED'        // Stability decreased
'RAID_GENERATED'            // New raid detected (notable)
'COMBAT_RESULT'             // Combat resolved (notable/mythic)

// Resources
'PRODUCTION'                // Resources produced (routine)
'CONSUMPTION'               // Food consumed (routine)
'RESOURCES_UPDATE'          // Current resource levels
'FOOD_SPOILAGE'             // Food lost to gap (routine)
'STARVATION'                // Food at 0 (mythic)

// Exploration
'MW_SENT'                   // MW started exploring
'MW_ARRIVED'                // MW reached ring
'EXPLORATION_ROLL'          // Daily exploration check
'MW_FINDING'                // Found something (notable)
'MW_RETURNED'               // MW came home

// Knowledge
'RESEARCH_COMPLETE'         // Research finished (notable)

// System
'RENDER'                    // Update UI signal
```

## Performance Tips

1. **Cache getState()** - Copying state is O(n), do sparingly:
   ```javascript
   const state = engine.getState();  // Expensive
   // Use state multiple times
   ```

2. **Batch commands** - Queue multiple commands before advancing:
   ```javascript
   engine.queueCommand(cmd1);
   engine.queueCommand(cmd2);
   engine.queueCommand(cmd3);
   engine.advanceDay();  // Process all at once
   ```

3. **Filter notifications** - Only listen to relevant events:
   ```javascript
   const importantNotifs = notifications.filter(n => {
     const type = n.type;
     return type.includes('COMBAT') || type.includes('LOST') || type.includes('COMPLETE');
   });
   ```

## Debugging

### Log all notifications
```javascript
const { newState, notifications } = engine.advanceDay();
for (const n of notifications) {
  console.log(JSON.stringify(n, null, 2));
}
```

### Track specific character
```javascript
const char = engine.state.population.characters[0];
console.log(`${char.name}:`);
console.log(`  Role: ${char.role}, Tier: ${char.tier}`);
console.log(`  Stats: Body ${char.body}, Mind ${char.mind}, Spirit ${char.spirit}`);
console.log(`  Health: ${char.health}, XP: ${char.xp}`);
if (char.training) {
  console.log(`  Training: ${char.training.targetRole} (${char.training.daysRemaining}/${char.training.daysTotal} days)`);
}
```

### Monitor perimeter pressure
```javascript
const state = engine.getState();
const gap = 100 - state.mist.perimeterStability;
console.log(`Perimeter pressure: ${gap.toFixed(0)}`);
console.log(`Priests assigned: ${state.population.characters.filter(c => c.role === 'priest' && c.assignment === 'perimeter').length}`);
```

### Track MW journey
```javascript
const mw = engine.state.exploration.mwState;
console.log(`MW Status: ${mw.status}`);
console.log(`Ring: ${mw.ring || 'None'}`);
console.log(`Days out: ${mw.daysOut}`);
console.log(`Findings: ${mw.findings.map(f => f.type).join(', ')}`);
```

## Save/Load (Client Responsibility)

```javascript
// Save
const saveData = JSON.stringify(engine.getState());
localStorage.setItem('mistwalker_save', saveData);

// Load
const loadedState = JSON.parse(localStorage.getItem('mistwalker_save'));
engine.state = loadedState;
```

## Next Steps

1. Read `CORE_ENGINE_INDEX.md` for detailed file documentation
2. Check `README.md` for architecture overview
3. Run `engine.test.js` to see it in action
4. Build the shell (UI layer) that consumes this engine
5. Integrate command handling into UI

---

The engine is self-contained and requires no external dependencies. All game logic is portable and deterministic.
