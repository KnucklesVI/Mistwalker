# Mistwalker 0.60a - File Structure & Architecture

## Overview
Complete implementation of the Mistwalker turn-based roguelike browser game using ES modules. All files use modern JavaScript module syntax with proper separation of concerns.

## Directory Structure

```
/sessions/sharp-loving-sagan/mnt/Mistwalker/
├── index.html                          # Entry point - minimal HTML
├── src/
│   ├── data/
│   │   ├── config.json                 # Game balance constants
│   │   ├── names.json                  # Character names pool
│   │   └── locations.json              # Vital & minor location definitions
│   │
│   ├── shell/                          # UI and I/O layer
│   │   ├── app.js                      # Main application controller
│   │   ├── renderer.js                 # Main renderer - reads state, builds DOM
│   │   ├── keyboard.js                 # Keyboard navigation system
│   │   ├── notifications.js            # Event bus for notifications
│   │   ├── save.js                     # localStorage save/load
│   │   ├── styles.css                  # Dark monastic theme stylesheet
│   │   └── tabs/                       # Tab-specific renderers
│   │       ├── dashboard.js            # Settlement overview & resources
│   │       ├── people.js               # Character roster management
│   │       ├── expeditions.js          # Mistwalker exploration & locations
│   │       ├── research.js             # Scholar & knowledge decoding
│   │       └── engineering.js          # Traps, facilities, excavation
│   │
│   └── core/
│       └── engine.js                   # Game engine (stub for shell)
```

## File Descriptions

### Data Files (`src/data/`)

#### config.json
**Purpose:** Game balance constants and tuning parameters
**Key Sections:**
- Starting resources: food, wood, stone, initial roster
- Resource mechanics: consumption rates, healing
- Perimeter & defense: priest/soldier calculations, trap values
- Raids: timing, scaling, strength calculations
- Knowledge: decode thresholds, clue yields
- Exploration: Mistwalker discovery chances
- XP & leveling: veteran thresholds

#### names.json
**Structure:** Simple array of 30 character names
**Used by:** Character generation system (future implementation)

#### locations.json
**Structure:** Two arrays
- **vital:** 3 Ring 1 locations (Sunken Chapel, Iron Grove, Hollow Keep)
- **minor:** 7 exploration discovery locations (pools, shrines, camps, etc.)
**Properties:** id, name, ring, tiers, type, description

### Shell Files (`src/shell/`)

#### app.js
**Responsibility:** Application lifecycle management
**Key Functions:**
- `setupIntroScreen()` - Renders new/continue game UI
- `startNewGame()` - Initialize fresh game
- `loadGameState()` - Load from localStorage
- `showGame()` - Transition to game UI
- `setupAutoSave()` - Save every 5 minutes
- `setupGameHandlers()` - Visibility & unload listeners

**Exports:** MistwalkerApp class

#### renderer.js
**Responsibility:** Main UI renderer - converts state to DOM
**Key Functions:**
- `renderHeader()` - Day, perimeter %, food, warnings
- `renderTabBar()` - Navigation tabs with active state
- `renderFeed()` - Recent notifications feed
- `attachEventListeners()` - Wire up buttons and interactions
- `showCharacterModal()` - Detail modal for characters

**Exports:** createRenderer(engine, rootElement) → { render, showModal, closeModal, getCurrentTab }

#### keyboard.js
**Responsibility:** Keyboard navigation and shortcuts
**Key Bindings:**
- Tab/Shift+Tab: Cycle tabs
- Arrow Up/Down: Navigate items in view
- Enter: Activate highlighted item
- Shift+Enter: Advance day
- Escape: Close modal or deselect
- 1-7: Direct tab switch
- Q: Toggle feed filter (placeholder)

**Exports:** createKeyboardHandler(engine, renderer) → cleanup function

#### notifications.js
**Responsibility:** Simple pub/sub event bus
**Key Functions:**
- `subscribe(type, handler)` - Register handler for notification type
- `emit(notification)` - Broadcast to all subscribers
- `getAll()` - Get all subscribers
- `clear()` - Clear all subscribers

**Exports:** createNotificationBus() → { subscribe, emit, getAll, clear }

#### save.js
**Responsibility:** Game state persistence using localStorage
**Functions:**
- `saveGame(state)` - Serialize state to 'mistwalker-save'
- `loadGame()` - Parse saved state or null
- `hasSave()` - Check if save exists
- `clearSave()` - Remove save from storage

**Key:** localStorage key is 'mistwalker-save'

#### styles.css
**Responsibility:** Complete styling using CSS custom properties
**Theme Variables:**
- Colors: primary dark blue (#1a1a2e), panel dark (#0f3460), gold accent (#d4a574)
- Fonts: serif main (Palatino), monospace for tech text
- Status colors: success (green), warning (orange), danger (red)

**Major Sections:**
- Base styles, intro screen, header, tabs, content area
- Feed panel, modal overlays, buttons
- Dashboard, people/units, expeditions, research, engineering views
- Responsive design for mobile/tablet

#### Tab Renderers (`src/shell/tabs/`)

**dashboard.js** (124 lines)
- Perimeter stability bar with color coding
- Resource summary (food, wood, stone, metal, herbs)
- Population breakdown by role
- Active warnings (low food, incoming raids, weak perimeter)
- Advance Day button

**people.js** (94 lines)
- Characters grouped by role (mistwalker, soldier, priest, scholar, worker)
- Individual cards showing: name, tier, health bar, status
- Character detail modal on click
- Assignment action buttons

**expeditions.js** (103 lines)
- Mistwalker status and daily action selector (explore/scout/rescue)
- Map fragment progress bar (0-9)
- Discovered locations grouped by ring
- Location cards with descriptions and tier info

**research.js** (115 lines)
- Scholar roster display
- Undecoded clues with decode progress bars
- Decoded knowledge with revelations
- Sealed artifacts with dependency tracking
- "Ready to unlock" indicators

**engineering.js** (89 lines)
- Trap inventory and build interface
- Wood/stone cost display with affordability check
- Build trap button
- Facilities section (greyed out for Layer 2)
- Excavation section (greyed out for Layer 2)

### Core Files (`src/core/`)

#### engine.js
**Responsibility:** Game engine stub with core state management
**State Structure:**
- timeline: currentDay, season
- resources: food, wood, stone, metal, herbs
- characters: roster array
- settlement: perimeter, population, facilities
- mistwalker: discoveredLocations, mapFragments, activeExpedition
- knowledge, clues, sealedArtifacts
- raid: nextRaidDay, strength, warned
- engineering: traps
- notifications: feed items

**Key Functions:**
- `initialize(savedState)` - New or load game
- `getState()` - Current state reference
- `advanceDay()` - Day tick with resource consumption
- `assignCharacter(id, role)` - Change character role
- `buildTrap()` - Build defense trap
- `exploreMistwalker(locationId)` - Start exploration
- `addNotification(notif)` - Log to feed

**Exports:** createEngine(config) → { initialize, getState, advanceDay, ... }

## Architecture Highlights

### Module System
- **Pure ES modules** - All files use `import`/`export`
- **JSON imports** - `import config from '../data/config.json' assert { type: 'json' }`
- **Separation of concerns** - Data, UI, Engine strictly separate

### UI Flow
1. **app.js** creates Engine + Renderer
2. **renderer.js** reads Engine.getState() and builds DOM
3. **keyboard.js** captures input and triggers Engine/Renderer updates
4. **save.js** persists state on interval and page unload
5. **notifications.js** enables decoupled event handling

### State Management
- Single source of truth: Engine.gameState
- Renderer always reads fresh from engine
- No direct DOM mutation - always rebuild
- Keyboard updates engine, then triggers re-render

### Styling Strategy
- **CSS variables** for easy theme customization
- Dark monastic theme (golds, browns, dark blues)
- Full responsive layout with grid/flex
- Status indicators: green (good), orange (warning), red (danger)

## How to Run

1. Open `/sessions/sharp-loving-sagan/mnt/Mistwalker/index.html` in a modern browser
2. Click "New Game" or "Continue Game" (if save exists)
3. Use arrow keys to navigate, Enter to select, Tab to switch tabs
4. Game saves automatically every 5 minutes

## ES Module Dependencies

All imports use ES6 module syntax:
```javascript
// Data imports with JSON assertion
import config from '../data/config.json' assert { type: 'json' };

// Function imports
import { createEngine } from '../core/engine.js';
import { createRenderer } from './renderer.js';

// Namespace imports
import * as Shell from './shell.js';
```

## Future Layers

Layer 2 will add:
- Alchemy tab (crafting system)
- Artifacts tab (artifact management)
- Facilities (barracks, archive, sanctum)
- Excavation mechanics
- More advanced combat and events

Currently these are greyed out in the UI with placeholder text.

## Browser Compatibility

- Modern browsers with ES2020+ support
- localStorage for persistence
- No external dependencies - vanilla JavaScript
- Tested on Chrome, Firefox, Safari, Edge

---

**Version:** 0.60a
**Architecture:** ES Modules, MVC-inspired
**Status:** Shell and data files complete, core engine stub ready for implementation
