# Mistwalker 0.60a - Quick Reference

## File Paths (All in `/sessions/sharp-loving-sagan/mnt/Mistwalker/`)

### Entry Point
- **index.html** - Open this in browser to play

### Data Configs
- **src/data/config.json** - Game balance constants (38 tuning parameters)
- **src/data/names.json** - 30 character names
- **src/data/locations.json** - 3 vital + 7 minor locations

### Shell/UI Files
- **src/shell/app.js** - Application lifecycle controller
- **src/shell/renderer.js** - DOM rendering from game state
- **src/shell/keyboard.js** - Keyboard input & navigation
- **src/shell/notifications.js** - Event bus system
- **src/shell/save.js** - localStorage persistence
- **src/shell/styles.css** - Dark monastic theme (25 KB, self-contained)

### Tab Views
- **src/shell/tabs/dashboard.js** - Resources, perimeter, population overview
- **src/shell/tabs/people.js** - Character roster by role
- **src/shell/tabs/expeditions.js** - Mistwalker exploration status
- **src/shell/tabs/research.js** - Scholar decoding & knowledge
- **src/shell/tabs/engineering.js** - Traps, facilities (Layer 2 locked)

### Core Engine
- **src/core/engine.js** - Game logic stub (ready for expansion)

### Documentation
- **STRUCTURE.md** - Detailed architecture guide
- **BUILD_MANIFEST.txt** - Complete file manifest
- **QUICK_REFERENCE.md** - This file

---

## Keyboard Controls

| Key | Action |
|-----|--------|
| **Tab** | Next tab |
| **Shift+Tab** | Previous tab |
| **1-7** | Jump to specific tab |
| **↑ / ↓** | Navigate items up/down |
| **Enter** | Activate selected item |
| **Shift+Enter** | Advance day |
| **Escape** | Close modal / deselect |
| **Q** | Toggle feed filter (future) |

---

## Tabs (in order)

1. **Dashboard** - Settlement overview, resources, population, advance day
2. **Units** - Character roster management, detail modal
3. **Mistwalker** - Explorer status, locations discovered, map progress
4. **Scholar** - Decoding clues, sealed artifacts, knowledge
5. **Engineer** - Build traps, manage defense
6. **Artifacts** - (Layer 2, locked)
7. **Alchemy** - (Layer 2, locked)

---

## Game State Structure

```javascript
{
  timeline: { currentDay, season },
  resources: { food, wood, stone, metal, herbs },
  characters: [ /* roster array */ ],
  settlement: { perimeter, population, facilities },
  mistwalker: { discoveredLocations, mapFragments },
  knowledge: { /* decoded lore */ },
  clues: [ /* undecoded clues */ ],
  sealedArtifacts: [ /* locked items */ ],
  raid: { nextRaidDay, strength, warned },
  engineering: { traps },
  notifications: [ /* feed items */ ]
}
```

---

## CSS Custom Properties (Theming)

```css
--bg-primary: #1a1a2e      /* Main background */
--bg-secondary: #16213e    /* Header/tabs bg */
--bg-panel: #0f3460        /* Content panel bg */
--text-primary: #e8d5b7    /* Main text */
--text-secondary: #9a8866  /* Secondary text */
--accent-gold: #d4a574     /* Highlights */
--accent-warm: #c49b5a     /* Buttons */
--success: #4a8a4a         /* Green - good */
--warning: #c4884a         /* Orange - caution */
--danger: #8a3a3a          /* Red - critical */
```

---

## Common API Calls

### From app.js
```javascript
const engine = createEngine(config);
engine.initialize();           // New game
engine.initialize(savedState); // Load game
const state = engine.getState();
engine.advanceDay();
engine.assignCharacter(id, role);
engine.buildTrap();
engine.addNotification(notif);
```

### From renderer.js
```javascript
const renderer = createRenderer(engine, contentEl);
renderer.render();             // Full re-render
renderer.showModal(html);
renderer.closeModal();
const currentTab = renderer.getCurrentTab();
```

### From keyboard.js
```javascript
const cleanup = createKeyboardHandler(engine, renderer);
cleanup();                     // Remove listeners
```

### From save.js
```javascript
saveGame(state);               // To localStorage
const state = loadGame();      // From localStorage
const exists = hasSave();
clearSave();                   // Delete save
```

### From notifications.js
```javascript
const bus = createNotificationBus();
bus.subscribe('raid', handler);
bus.emit({ type: 'raid', message: '...' });
const subscribers = bus.getAll();
bus.clear();
```

---

## Color Coding

| Status | Color | Meaning |
|--------|-------|---------|
| Green | #4a8a4a | Healthy, good perimeter, safe |
| Yellow/Orange | #c4884a | Warning, caution needed |
| Red | #8a3a3a / #c45a5a | Danger, critical condition |
| Gold | #d4a574 | Important, highlight |
| Brown | #9a8866 / #5a4a3a | Muted, secondary |

---

## Perimeter Display

- **80%+ (Green)** - Strong defense
- **50-79% (Yellow)** - Adequate, but weakening
- **<50% (Red)** - Critical, vulnerable to raids

---

## Resource Indicators

- **Food** - Primary consumption resource
- **Wood** - Building/crafting (traps need 10 wood each)
- **Stone** - Building/crafting (traps need 5 stone each)
- **Metal** - Advanced crafting (future)
- **Herbs** - Healing/potions (future)

---

## Character Roles

1. **Mistwalker** - Explorer, gains XP
2. **Soldier** - Defense, increases perimeter
3. **Priest** - Morale/spirituality, perimeter bonus
4. **Scholar** - Decoding, knowledge advancement
5. **Worker** - General labor, resource production
6. **Idle** - Unassigned

---

## Starting Resources (config.json defaults)

- Roster: 20 people
- Food: 80 units
- Wood: 40 units
- Stone: 20 units
- Perimeter: 100 (required)

---

## File Import Pattern

```javascript
// Config
import config from '../data/config.json' assert { type: 'json' };

// Factory functions
import { createEngine } from '../core/engine.js';
import { createRenderer } from './renderer.js';

// Tab renderers
import { renderDashboard } from './tabs/dashboard.js';

// Utilities
import { saveGame, loadGame } from './save.js';
```

---

## Next Layer (Layer 2) Features

Currently greyed out and locked:
- Alchemy tab - crafting system
- Artifacts tab - artifact management
- Facilities - barracks, archive, sanctum
- Excavation - deep dig mechanics
- Advanced combat
- Tier 2+ locations

---

## Testing Notes

- localStorage saves to browser's local storage
- No external dependencies - pure vanilla JS
- All modern browsers: Chrome, Firefox, Safari, Edge (90+)
- Responsive to mobile/tablet (CSS responsive)
- Can open browser console for debug logs

---

## Common Entry Points for Core Implementation

1. **Character Generation** - engine.js `createInitialState()`
2. **Daily Actions** - engine.js `advanceDay()`
3. **Combat** - engine.js need new function
4. **Exploration** - engine.js `exploreMistwalker()`
5. **Decoding** - Need knowledge module
6. **Raid Events** - Need raid module
7. **Resource Production** - Need production module

---

**Version:** 0.60a | **Status:** Shell Complete | **Last Updated:** 2026-02-12
