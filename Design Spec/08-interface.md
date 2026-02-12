# Interface & Controls

## Design Philosophy

The interface is the player's instrument panel. It should surface the right information at the right time without overwhelming. The player is a pilot, not a spreadsheet operator.

**Carry-forward principle:** The prototype established patterns that work — MW-relevant information surfaced in the MW view, feed entries linking to the relevant context, keyboard navigation feel. These are proven. The interface extends to cover new systems, it doesn't rework what's already working.

## Keyboard-First Design

The game is designed for full keyboard navigation. Mouse/touch is supported but the keyboard experience is primary.

### Core Controls
- **Tab / Shift+Tab:** Cycle through main tabs (forward/backward)
- **Down/Up Arrows:** Navigate actionable items within the current view
- **Left/Right Arrows:** Move between multiple actions within a selected row
- **Enter:** Activate the highlighted item (does nothing if nothing is highlighted)
- **Shift+Enter:** Advance to next day
- **Escape:** Deselect current highlight, or close modal/overlay
- **Q:** Toggle feed filter; arrows cycle filter types while open

### Modal/Overlay Controls
- **Tab / Shift+Tab:** Cycle through interactive elements in the modal
- **Enter:** Activate the highlighted modal element
- **Escape:** Close the modal

### Design Rules
- Nothing is highlighted by default — the player chooses to engage
- First item auto-highlights when a modal opens (immediate engagement)
- Keyboard navigation should feel snappy and responsive
- Every clickable element must also be keyboard-accessible

## Information Architecture

### The Tabs
The game is organized into seven views/tabs, matching the prototype 0.40a structure. Each tab represents a lens into the monastery's state:

- **Dashboard:** Overview of the monastery. Key metrics. Pending actions. Current threats.
- **Units:** The roster. Each character's role, tier, specialization, status, assignment. Also contains the Power Management view (see below).
- **Mistwalker:** The MW's scouting view AND expedition management. Discovered locations by ring. Engagement state. Active/planned expeditions. Team composition. This is WHERE the player sees the world outside the monastery and manages all outward action.
- **Scholar:** Knowledge streams: map fragment assembly, Source clue interpretation, mist nature research, priest training status, forecasts. Dependency drawer. Threat forecasting.
- **Engineer:** Construction projects. Facility management and staffing. Infrastructure. Underground dig progress, level status, chamber discoveries, threat alerts.
- **Artifacts:** Items, relics, discovered objects. Source clue tracker. What the monastery HAS.
- **Alchemy:** Crafting recipes. Material management. Facility output. Recipe discovery status. What the monastery can MAKE.

### Collapsible Sections

A **general UI convention** used throughout: sections can be collapsed (minimized) to hide information the player doesn't currently care about. This is essential for managing complexity as the game progresses.

Use case: In MW Exploration, Ring 1 locations can be collapsed once the player has moved on to Ring 2. In Research, completed studies can be collapsed. In People, roles the player isn't actively managing can be minimized.

The collapse control should be lightweight — a caret/arrow indicator, toggled by a key or click. Collapsed sections show a one-line summary (e.g., "Ring 1 — 3/3 vital locations cleared, 5 minor locations").

### The Feed
The daily event feed is the game's narrative voice. It tells the player what happened.

**Feed hierarchy must match the event hierarchy:**
- Routine events: Normal text. Scrolls by.
- Notable events: Highlighted or flagged. Stays visible longer.
- Mythic events: NOT in the feed. Full-screen interrupt. Then recorded in feed afterward.

**Feed linking:** Feed entries for actionable events should link the player directly to the relevant view/tab. A raid warning links to the Dashboard or People view. A location discovery links to MW Exploration. A research completion links to Research. The feed is not just informational — it's navigational.

The feed filter (Q) allows the player to focus on specific event types. This is essential for managing information load in the mid-to-late game.

## Mistwalker Tab — Exploration & Expeditions

The MW's scouting perspective on the world outside the monastery, plus expedition management. Locations are organized by ring, with vital and minor locations displayed separately within each ring. Active and planned expeditions are managed here too — the MW is on every one, so it's natural.

### Location Display

Each location shows its **engagement state** — what the player knows depends on how far they've explored:

**Unscouted locations** show as unknown — a marker on the map with no detail. The MW or expedition hasn't been there yet.

**Scouted locations** show what the MW discovered: creatures present, estimated difficulty, visible rewards, tier structure. For vital locations with multiple tiers (Approach → Chamber → Heart), each tier shows its own state — scouted vs. unscouted, cleared vs. uncleared.

**Cleared locations** show what was found: creatures defeated, treasures recovered, clues obtained. For vital locations, this is per-tier — a player might have cleared the Approach but not yet entered the Chamber.

**In-progress locations** show current expedition status if a team is actively engaged.

This gives the player a living picture of the world: where they've been, what's left, what's partially done, and what's completely unknown.

## Mid-Screen Event Presentation

A **middle tier of visual presentation** between feed entries and full mythic interruptions. For notable moments that deserve more than a text line but aren't mythic-level.

These appear center-screen with **programmatic sprite-style imagery** — generated visually, not pre-made GIFs. They may include sound. Examples: a new mist nature revealing itself, a vital location's Heart being breached, a veteran achieving their milestone, a creature breaking through the perimeter.

This is distinct from Source Attention confirmation dialogs (which are decision prompts). Mid-screen events are moments of narrative impact — the game saying "pay attention, something just happened."

## Source Attention Confirmations

When the player attempts an action that draws the Source's attention, a **confirmation dialog** appears with the specific, transparent cost:

- What the action does
- What the Source's response will be (exact penalty)
- Confirm or cancel

This is a decision prompt, not an interruption. The player is choosing to proceed with full knowledge of the cost. Every action that triggers Source Attention must go through this dialog — no exceptions, no hidden costs.

## Power Management View

An **advanced roster management mode** within the Units tab. For mid-to-late game when the monastery has 20-30+ people and individual assignment becomes tedious.

**Spreadsheet-like interface:** Sortable columns (name, role, tier, stats, current assignment, status). Filterable by any attribute — show all unassigned soldiers, everyone with Body above 5, all veterans, everyone currently idle.

**Multi-select and bulk assignment:** Select multiple characters and assign them to a location, facility, or role in one action. "All idle soldiers → perimeter." "Both veteran priests → Ring 3 wall duty."

**Keyboard-driven:** Arrow keys navigate rows. A key toggles selection. Enter opens bulk-assign. Search/filter via a command line or hotkey. The feel should be almost terminal-like — fast, efficient, no wasted motion.

This is the power user's tool. The normal Units tab works fine for browsing and individual management. The Power Management view is for when the player knows exactly what they want and needs to execute it quickly.

## Key UI Signals

The interface must make the game's state legible at a glance. The player should NEVER be surprised by something the UI could have warned them about.

### Always Visible
- Perimeter stability percentage (overall score — single number)
- Current ring and day counter
- Active threats or warnings
- People out on missions vs. people at base

### On Hover / Drill-In
- **Per-nature perimeter breakdown:** When the player hovers or drills into the perimeter score, they see the percentage for each stacking mist layer (e.g., Standard: 95%, Crystalline: 78%, Darkness: 62%). The top-level number is the aggregate; the detail shows where the pressure points are.
- Sacred bandwidth allocation breakdown
- Individual character details (via modal)
- Research progress across all knowledge streams
- Resource stockpiles
- Source clue tracker (clues found, clues decoded, scholar interpretations so far)

### Warning System
Warnings should be clear and actionable:
- "Perimeter below 80% — mist exposure risk increasing"
- "New mist nature detected at Ring 2 boundary — priests cannot yet counter"
- "Raid incoming in ~3 days — X soldiers available for defense"
- "Scholar forecasts: secondary nature pressure increasing within 10 days"
- "Underground breach — hostile presence loose in the monastery"

**Next-ring foreshadowing:** The warning system also surfaces early signals about the next ring's nature BEFORE the player pushes in. These are ambient hints — the MW smells something wrong, sees a color shift at the boundary, notices creatures behaving strangely near the ring edge. Not the full decoded answer, but enough to start thinking about what's coming. The mechanic for how these hints trigger is undesigned — but the UI must be ready to surface them when they arrive.

These warnings serve the **legible failure** principle. If the player dies, they should have seen it coming — or chosen to ignore the warning.

## Visual Language

The game is text-forward. No sprites or complex graphics. Aesthetic is monastic, muted, and atmospheric.

- Dark background, warm accent colors (gold/amber)
- Typography-driven design
- Status communicated through color, weight, and iconography
- Mythic events use larger text, more dramatic presentation
- Mid-screen events use programmatic sprite imagery — a step up from text, but generated, not pre-rendered
- Character names grow visually as titles accumulate

### Skinning Rule (Architectural Requirement)

**All visual presentation must be a separable skin layer.** Colors, fonts, font sizes, spacing, sprite styles, sound — everything visual and auditory must be swappable without touching game logic or system code. This is a hard technical requirement, not a nice-to-have.

This means: no hardcoded colors in game logic. No font sizes embedded in system calculations. No layout assumptions baked into state management. The game's appearance is a theme that sits on top of the systems, and replacing one theme with another should never break anything.

This enables: visual polish iterations without regression risk, accessibility themes (high contrast, larger text), eventual reskinning for different aesthetics, and clean separation of design review feedback from system development.

### Visual Design Review (Phase C)

A dedicated visual and interaction design review should happen once the UI skeleton is built and functional. Focus areas: typography (font sizes, spacing, line height), information density, scan-ability of key data, tab navigation feel, and overall polish. The prototype's typography and spacing were functional but could be improved — this review addresses that. Recommendations should be implementable as skin changes only, per the skinning rule above.

## Open Questions

- [ ] Should the dashboard show a visual representation of the monastery (layout/map)?
- [ ] How do we represent the underground dig visually?
- [x] Should the ring system have a map view? **Yes — the MW Exploration view organizes locations by ring with engagement state per location. Vital and minor locations displayed separately. Collapsible by ring.** *(Resolved 2026-02-12)*
- [ ] How do we show the mist's escalation visually (not just numerically)?
- [ ] Should there be an explicit "readiness assessment" screen before committing to ring advancement?
- [ ] How do we handle the feed at high volumes (late game might generate 15+ events per day)?
- [ ] What term do we use for the individual mist nature layers in the perimeter breakdown?
- [ ] How does the next-ring foreshadowing mechanically trigger? What does the MW perceive?
- [ ] What programmatic sprite styles work for mid-screen events? What's the visual vocabulary?
- [ ] What columns/filters does the Power Management view include by default?
- [ ] How does the Source clue tracker present partially-decoded vs. fully-decoded clues?
