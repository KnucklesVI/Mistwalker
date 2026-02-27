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

The game is organized into six tabs. Each tab represents a lens into the monastery's state and is owned by a specific role or purpose:

- **Dashboard:** Strategic readiness view. Capabilities unlocked/locked. What's needed to progress. Source progress. Dependency drawer.
- **People:** The roster. Role groups (collapsible by role). Click any character for universal character sheet modal. Also contains the Power Management view.
- **Explore:** MW scouting, trip planning, ring discoveries, and expedition management.
- **Research:** The complete scholar workspace. Discovery (clues, natures, lore, blueprints, essences, herbs), production (elixirs, compounds, wards), and the knowledge archive.
- **Build:** The complete engineer workspace. Blueprint study, facility construction, towers, traps, and underground excavation.
- **Items:** Inventory of finished goods. Artifacts, elixirs, consumables, essences, herbs, relics. Equip and use actions.

All tabs are present from Day 1, even if mostly empty. Empty tabs show a brief note about what will appear there as the game progresses.

### Tab Notification Badges

Tabs display a badge/indicator when there is an actionable situation — injured person needing tending, unassigned character, finished training, research complete, etc. The player can ignore badges and advance the day. That is a valid choice with consequences.

### Collapsible Sections (Universal Pattern)

A **universal UI convention** used throughout all tabs: sections can be collapsed (minimized) to hide information the player doesn't currently care about. This is essential for managing complexity as the game progresses.

Every grouping in every tab supports collapse/expand. On People, each role group collapses. On Explore, ring sections collapse. On Build, facility categories collapse. On Research, completed studies collapse. The pattern is consistent and learnable.

The collapse control is lightweight — a caret/arrow indicator, toggled by a key or click. Collapsed sections show a one-line summary (e.g., "Ring 1 — 3/3 vital locations cleared, 5 minor locations"). A keyboard hotkey toggles collapse on the focused section.

### The Feed

The daily event feed is the game's narrative voice. It tells the player what happened.

**Feed hierarchy must match the event hierarchy:**
- Routine events: Normal text. Scrolls by.
- Notable events: Highlighted or flagged. Stays visible longer.
- Mythic events: NOT in the feed. Full-screen interrupt. Then recorded in feed afterward.

**Feed linking:** Feed entries for actionable events should link the player directly to the relevant view/tab. A raid warning links to the Dashboard or People view. A location discovery links to Explore. A research completion links to Research. The feed is not just informational — it's navigational.

The feed filter (Q) allows the player to focus on specific event types. This is essential for managing information load in the mid-to-late game.

---

## Tab Details

### Dashboard

The Dashboard is NOT a daily overview — the header bar handles that job (resource counts, perimeter %, day counter, active threats). Instead, the Dashboard is a **strategic readiness view**: a roadmap, not a report.

**Contents:**
- **Capabilities Overview** — what the monastery has unlocked and what's still locked. Shows which facilities exist, which roles are active, which natures have been countered. A living checklist of progress.
- **What's Needed** — the next things the player could work toward and what they require. "Forge requires: Metal (0/10), Engineer with Blueprint studied." Surfaces the dependencies so the player knows what to prioritize.
- **Source Progress** — how many Source clues found, how many decoded, how close to each Source phase. The endgame tracker.
- **Dependency Drawer** — visual representation of what unlocks what. Research X to enable Building Y to produce Item Z. Shows the chain so the player understands why scholar work matters right now.
- **Incoming Threats** — raid warnings, mist pressure, underground alerts. The one operational element that lives here because it's strategic, not tactical.

No cards design. Text-forward, collapsible sections. The details are TBD but the intent is captured: the Dashboard answers "where am I, where am I going, and what do I need to get there?"

---

### People

The People tab manages the monastery's roster through two views:

#### Main View — Role Groups

Characters are organized into collapsible role groups: Priests, Soldiers, Engineers, Workers, Scholars, Mist Walkers, Unassigned. Each group shows its members as rows with name, current assignment, health status, and a key stat at a glance.

Clicking a character name (or pressing Enter on a highlighted row) opens the **Universal Character Sheet** modal.

#### Universal Character Sheet (Modal)

A layered character sheet that all characters share, even if some layers are mostly empty for certain roles. The layers are:

**Layer 1 — Identity:** Name, titles, role, tier (Novice/Veteran/Elevated), specialization if any. The "who" of this person.

**Layer 2 — Intrinsic Stats:** Body, Mind, Spirit values (1-5 scale, can exceed 5 with boosts). These are the permanent foundation. Shows the raw numbers.

**Layer 3 — Derived Stats:** The game-relevant outputs calculated from intrinsics. Each shows a visible formula so the player can see HOW intrinsics produce effects. Examples: "Combat Contribution: Body(4) × 2 = 8", "Perimeter Contribution: Base(15) + Spirit(4) × 3 = 27", "Mist Endurance: Spirit(4) + bonuses = X days". The player should never wonder "why is this number what it is."

**Layer 4 — Modifiers:** Everything currently affecting this character beyond their base stats. Equipped artifacts, active buffs, nature counter training status, temporary effects. Each modifier shows what it changes. Equipped items here may have a "Use" action if the item supports manual activation (architecture supports this even if not used initially).

**Layer 5 — History:** A chronological list of notable events involving this character. "Day 14: Survived raid, injured." "Day 23: Completed Veteran training." "Day 41: Discovered the Whispering Pool." Builds identity and attachment over time.

**Layer 6 — Actions:** What can be done with this character right now. Train, reassign, equip item, begin expedition. Context-dependent — only shows valid actions for their current state.

#### Power Management View

An advanced roster management mode accessed via toggle or hotkey from the People tab. A sortable, filterable table of the entire living roster.

**Columns:** Name | Role | Assignment | Body | Mind | Spirit | Health | Notable Trait

**Sorting:** Click any column header (or keyboard shortcut) to sort by that column. Sort by Spirit descending to instantly find priest candidates. Sort by Assignment to group unassigned characters.

**Filtering:** Filter bar with stackable filters. By role, by assignment status (Assigned / Unassigned / Injured), by stat threshold ("Spirit 4+"). Filters combine — "show me unassigned characters with Mind 4+" surfaces scholar candidates.

**Bulk Assignment:** Select multiple rows (Shift+click or checkbox column), then choose a role or assignment from a dropdown. "All idle soldiers → Garrison." Confirm, done.

**Best Fit Helper:** A hotkey or button for "Find Best Fit: [Role]." Automatically sorts by the relevant stat, highlights characters meeting the role's minimum requirements, dims those who don't qualify. Instant candidate surfacing.

**Keyboard-driven:** Arrow keys navigate rows. A key toggles selection. Enter opens bulk-assign. The feel is almost terminal-like — fast, efficient, no wasted motion.

The Power Management view does NOT show character detail. No history, no modifiers. For that, click a name to get the full character sheet modal. Power Management is purely operational — who goes where, right now.

---

### Explore

The Explore tab is the Mist Walker's domain. It manages scouting, discoveries, and group expeditions.

#### MW Status Bar (Always Visible)

Shows the MW's current state at a glance: At Monastery, Traveling (Day 2 of 4 to Ring 2), Exploring Ring 2 (Day 3), or Returning. Health status if injured. Always at the top of the tab.

#### Trip Planner

When the MW is home, this is the primary action. The player picks a target ring and the tab shows: travel time out, exploration days available based on range, and the 1-day return. Confirm and the MW departs. Inline, no modal needed.

#### Ring Sections (Collapsible)

One section per ring, each collapsible. Shows everything discovered in that ring: locations found (vital and minor), nature status (identified or unknown), clues collected, encounters logged. Ring 1 starts expanded, others collapsed until reached.

This is the exploration journal — a running record of what the mist has revealed. Persists across trips. Grows over the course of the game.

#### Active Trip Log

When the MW is out, findings appear day by day: "Day 3: Found herb cache." "Day 5: Nothing." A live feed of the current trip. Entries persist into the ring section's history after the MW returns.

#### Expedition Management (Collapsible)

Below the MW section. Shows active group expeditions: who's on them, destination, goal, days remaining.

**Planning a new expedition:** Inline form. Pick a known destination, assign a goal (retrieve metal, search library, fight creature, etc.), compose the team.

**Expedition composition rules:**
- MW required (does not count against bubble limit)
- Priest required (provides portable perimeter — the party's lifeline)
- Additional members as needed for the goal, up to the priest's bubble capacity
- Expedition range limited by the LOWER of MW's or Priest's mist endurance
- The MW explores alone; expeditions are purposeful group missions to known locations with specific goals

#### Location Display

Each location shows its **engagement state:**
- **Unscouted:** A marker with no detail. Haven't been there yet.
- **Scouted:** What the MW discovered — creatures, difficulty, visible rewards. Vital locations show per-tier state (Approach → Chamber → Heart).
- **Cleared:** What was found — creatures defeated, treasures recovered, clues obtained. Per-tier for vital locations.
- **In-Progress:** Current expedition status if a team is actively engaged.

---

### Research

The Research tab is the complete scholar workspace. Everything about turning unknowns into knowledge and knowledge into products.

#### Active Research (Collapsible)

What each assigned scholar is currently working on. Scholar name, task type (Researching clue, Identifying nature, Studying lore, Analyzing essence, Producing elixir), days remaining, progress indicator. Collaborating scholars show grouped with the collaboration bonus noted.

#### Research Queue (Collapsible)

Available tasks not yet started. Unresearched clues, unidentified natures, lore fragments, relics awaiting analysis, Source clues, raw essences, raw herbs. Each item shows what it is, estimated duration, and what completing it unlocks. Assign a scholar to start work.

Task categories include:
- **Clue research** — decoding clues to reveal locations, recipes, nature information
- **Nature identification** — survival-critical, unlocks priest counter-training
- **Counter-research** — figuring out how to fight a specific nature
- **Lore/relic study** — unlocks recipes, blueprints, transformation paths
- **Essence analysis** — discovers what a nature's essence can produce, unlocks crafting recipes
- **Herb cataloguing** — identifies herb properties, unlocks elixir recipes
- **Blueprint identification** — determines that a found object is a building plan, sends to Build tab for engineer study
- **Source clue interpretation** — the endgame knowledge work
- **Crafting/Production** — producing elixirs, compounds, corruption wards from known recipes using available materials

#### Knowledge Archive (Collapsible)

Everything already learned, organized by category: identified natures and their counters, decoded clues and what they revealed, lore entries, discovered recipes, Source intelligence. The cumulative encyclopedia of the mist. Grows throughout the game.

#### Dependency Drawer

When viewing a research item, shows what completing it unlocks. "Identifying this nature lets priests train against it." "This Source clue is 2 of 5 needed for Phase 1." "This essence analysis unlocks Corruption Ward recipe." Connects the scholar's work to the bigger picture.

#### Scholar Assignment

Assign scholars to tasks directly in this tab. Pick a scholar from a dropdown or list, assign to a task. No need to visit the People tab. The scholar's assignment in People reflects where they're working (Researching vs. crafting).

---

### Build

The Build tab is the complete engineer workspace. Physical construction, defense infrastructure, and underground exploration.

#### Blueprint Study (Collapsible)

When a scholar identifies a found object as a blueprint in Research, it appears here as "Available to Study." An engineer is assigned to study it — their Mind stat affects study duration. Once studied, it moves to the Blueprint Library as buildable.

This is the engineer's learning step. Scholar answers "what is this," engineer answers "how do I build this." Neither can skip their step.

#### Active Construction (Collapsible)

Current building/digging/crafting projects. Engineer name, project, days remaining, progress indicator. Multiple engineers on the same project may speed it up (collaboration bonus, diminishing returns).

#### Blueprint Library (Collapsible)

Studied blueprints ready to build. Each shows: what it builds, material costs (wood, stone, metal), build duration, what it enables once complete. Unaffordable blueprints show what resources are missing.

#### Existing Facilities (Collapsible)

Everything already built, current tier, upgrade path. Shows whether an upgrade blueprint has been studied. Engineers assign here for upgrade work.

#### Towers (Collapsible)

Build, repair, and upgrade perimeter towers. Towers are the monastery's ablative defense layer — they absorb raid damage so people don't have to.

**Tower tiers:**
- **Tier 1 — Basic Tower:** Defense value only. Wood and stone construction. No ward slots.
- **Tier 2 — Reinforced Tower:** Higher defense, requires metal. More durable (takes less damage per raid). **One ward slot** — can be warded against one specific mist nature by a priest.
- **Tier 3 — Fortified Tower:** Maximum defense. Expensive materials. **Three ward slots** — can be warded against all known natures simultaneously.

**Towers are the only units with hit points.** People use binary health states (Active/Injured/Gravely Injured/Dead), but towers degrade numerically. They take damage during raids, can be partially damaged, and need engineer time and materials to repair.

**Warding:** A priest consecrates a tower's ward slot against a specific identified nature. Warded towers reduce the nature mismatch penalty during raids from matching creatures. Re-warding (changing a ward's nature) costs priest time but not materials.

**Raid damage flow:** Damage hits towers first. If towers are overwhelmed or destroyed, consequences fall on people (injuries, deaths). After a bad raid, the Build tab shows tower damage status — Tower 3 at 40%, Tower 1 destroyed. Repair vs. other engineer priorities is a real fork.

#### Trap Workshop (Collapsible)

Engineers craft traps from materials. Shows available trap types, material costs, current trap inventory count. Each trap adds 2 defense in combat and is consumed after use. Nature-specific traps (crafted with matching essence) are full-value against nature creatures; standard traps are half-value against them.

#### Underground Excavation (Collapsible)

The underground is 4 levels plus the Abyss. Engineers dig to open new chambers — costs time, materials, and carries risk to the monastery.

Shows: current dig depth, available dig targets, active dig projects, discovered chambers, threat alerts from below. Each level deeper increases risk but reveals valuable resources and knowledge.

---

### Items

The Items tab is the inventory of everything the monastery has collected, produced, or found. Pure stuff management with equip and use actions.

#### Artifacts (Collapsible)

Equippable items found by the MW and studied by scholars. Weapons, armor, tomes, relics. Each shows: what it does, stat effects, who it's equipped to (if anyone). **Equip** action assigns to a character — a roster selector (dropdown sorted by role with name and relevant stats) lets you pick a person without leaving the tab. **Unequip** and **Reassign** available for equipped items.

#### Elixirs & Consumables (Collapsible)

Items produced by scholars in Research. Healing salves, corruption wards, temporary buffs, nature-specific protections. Shows quantity on hand, what each does. Two action types:

- **Equip** — assign to a character as a prepared item. They carry it and use it when the situation calls for it (e.g., fire resistance elixir triggers when fighting fire-natured creatures). Equipped items show on the character sheet's Modifiers layer.
- **Use** — immediate application. Heal a specific injured person right now, apply a ward to a tower. Direct, instant, consumed.

Some items may support either action depending on context. The item's data determines which options appear.

**Future flexibility note:** The Modifiers layer on the character sheet should support an optional "Use" action on equipped items, even though we may not use timed buff mechanics initially. The data model for equipped items includes a flag for passively active vs. manually activated. Don't close this door.

#### Essences (Collapsible)

Raw materials from creatures. Unprocessed until a scholar works on them in Research. Shows nature type, quantity, and whether a recipe has been unlocked for processing.

#### Herbs (Collapsible)

Raw herbs from exploration. Same pattern as essences — raw until processed. Shows variety, quantity, recipe status.

#### Relics (Collapsible)

Special found objects. Some have passive effects, some are lore-significant. Shows as "Unidentified" until a scholar studies them in Research. Once identified, shows effects and can be equipped if applicable.

#### Resources

Wood, stone, metal, food quantities and daily consumption/production rates may optionally be shown here for detailed stockpile management, though the header bar handles at-a-glance resource tracking. TBD whether this section is needed or if the header bar is sufficient.

---

## Event Presentation Tiers

Events are presented through three tiers of visual and audio intensity. The tier determines how much the game interrupts the player. Sound design is integral to each tier — audio cues build the game's identity and give the player ambient awareness of what's happening.

### Tier 1 — Feed Entries

Text in the feed log. Routine events that scroll by: "Day 47: Workers harvested 12 food." "Scholar Aldric continues researching the Crystalline nature (Day 3 of 5)." No overlay, no interruption.

**Sound:** Minimal or none. Subtle ambient sounds may accompany the daily tick (soft chime for a new day). The feed is quiet by default — it's reference material, not drama.

### Tier 2 — Mid-Screen Overlays

For events that deserve more than a text line but aren't mythic-level. These appear as a center-screen overlay. The feed pauses. The event unfolds **step by step, paced sequentially** — not dumped as a wall of text. Each line appears with a beat between them.

**Sound is integral to Tier 2.** Each phase of the event has its own audio:

**Battle example:**
1. "Raid approaches from Ring 2 — Crystalline creatures, strength 45." *(low rumble, tension building)*
2. "Garrison holds the line — Defense: 52." *(clash sounds, impact)*
3. "Towers absorb the first wave. Tower 3 takes damage." *(cracking, stress)*
4. "Soldiers repel the breach. Narrow victory." *(resolution tone, exhale)*
5. Summary: injuries, tower damage, essences recovered.

**Expedition return example:**
1. "The expedition returns from the Shattered Archive." *(footsteps, gate sound)*
2. "Scholar Aldric recovered a blueprint." *(positive chime)*
3. "Engineer Maren is injured." *(somber tone)*

**Other Tier 2 events:** New mist nature revealing itself, vital location Heart breached, veteran achieving milestone, creature breaking through perimeter, expedition departure, training completion for rare roles.

**Pacing:** The player doesn't click through — events play out at a readable pace. **Escape** fast-forwards to the final result for players who want to skip. After the overlay dismisses, results are recorded in the feed for reference.

**Visuals:** Programmatic sprite-style imagery — generated visually, not pre-made GIFs. Text-forward but with atmospheric presentation. The overlay is a moment of narrative impact — the game saying "pay attention, something just happened."

### Tier 3 — Full Mythic Interruptions

Rare. Screen takeover. Dramatic text, unique sound, maximum gravity. Maybe a handful across an entire playthrough. The Source speaks. A nature reveals for the first time. Someone undergoes a transformation. A character achieves something unprecedented.

**Sound:** Unique audio per mythic event. These sounds should be memorable — the player associates them with the biggest moments in their playthrough.

**After the interruption:** The event is recorded in the feed and in the relevant character's History layer.

### Sound Design Principles

Sound is part of the game's identity, not decoration. The audio vocabulary should be learnable:
- A low rumble means a raid is coming (before the overlay even appears)
- A chime means someone finished training or research
- A deep tone means someone died
- Ambient monastery sounds shift based on perimeter stability (calm when safe, uneasy when low)
- The mist itself has a sound presence that intensifies as perimeter drops

Sound must be implementable as part of the skin layer (per the skinning rule). Different themes could have different sound sets. Volume and individual sound toggling should be available in settings.

### Source Attention Confirmations

A special case — neither a feed entry nor an event overlay. When the player attempts an action that draws the Source's attention, a **confirmation dialog** appears with the specific, transparent cost:

- What the action does
- What the Source's response will be (exact penalty)
- Confirm or cancel

This is a decision prompt, not an interruption. The player is choosing to proceed with full knowledge of the cost. Every action that triggers Source Attention must go through this dialog — no exceptions, no hidden costs.

## Key UI Signals

The interface must make the game's state legible at a glance. The player should NEVER be surprised by something the UI could have warned them about.

### Header Bar (Always Visible)

The header bar is the operational overview. It does the at-a-glance job so the Dashboard doesn't have to.
- Resource counts (food, wood, stone, metal, herbs)
- Perimeter stability percentage
- Current ring and day counter
- Active threats or warnings
- People out on missions vs. people at base

### On Hover / Drill-In
- **Per-nature perimeter breakdown:** When the player hovers or drills into the perimeter score, they see the percentage for each stacking mist layer (e.g., Standard: 95%, Crystalline: 78%, Darkness: 62%). The top-level number is the aggregate; the detail shows where the pressure points are.
- Sacred bandwidth allocation breakdown
- Individual character details (via modal)
- Research progress across all knowledge streams
- Resource stockpile details and rates
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

## Developer Tuning Panel

A developer-only overlay for viewing and adjusting all config-driven game parameters in real time. Not part of the player-facing game. Toggled by a dev hotkey (backtick or F12).

### Purpose
Every numeric relationship in the game is config-driven (base value, curve type, curve intensity — see Mechanical Reference, Scaling Model Framework). The tuning panel provides a visual interface over the config object so balance adjustments happen in real time during playtesting, with no code changes or restarts.

### Layout
Parameters grouped by system: Resource Production, Combat, Raids, Perimeter, Exploration, Research, Training, etc. Each parameter shows:
- Current base value (editable)
- Curve type (dropdown: Linear, Diminishing, Exponential, Sigmoid)
- Curve intensity (slider)
- A small visual of the curve shape so the developer can see what "gentle exponential" looks like vs. "steep exponential"

### Live Adjustment
Change a value in the panel, the config updates, the game responds immediately. Bump food production from 3 to 4 per worker, see resource balance shift. Change raid frequency intensity, watch the escalation curve reshape. Switch priest contribution from diminishing to linear, see perimeter math recalculate.

### Live Graphs
The panel includes trend graphs showing key metrics over the last N days:
- Resource levels over time (food, wood, stone, metal)
- Raid frequency actual vs. projected curve
- Perimeter stability trend
- Population changes
- Defense rating trend

These let the developer tune a value, fast-forward 20 days, and see the downstream impact on actual gameplay curves.

### Build Alongside Layer 1
This is not a post-launch tool — it ships with the first playable build. Having the tuning panel from day one means every playtest session produces useful balance data. It's the primary tool for iterating on the numbers in the Mechanical Reference.

### Architecture Note
Since all game parameters are already config-driven, the panel is a UI layer over the config object. It reads and writes the same config the game engine uses. No separate data model needed. The panel itself is part of the shell (browser-specific), not the core.

---

## Open Questions

- [ ] Should the Dashboard show a visual representation of the monastery (layout/map)?
- [ ] How do we represent the underground dig visually?
- [x] Should the ring system have a map view? **Yes — the Explore tab organizes locations by ring with engagement state per location. Vital and minor locations displayed separately. Collapsible by ring.** *(Resolved 2026-02-12)*
- [ ] How do we show the mist's escalation visually (not just numerically)?
- [ ] Should there be an explicit "readiness assessment" screen before committing to ring advancement?
- [ ] How do we handle the feed at high volumes (late game might generate 15+ events per day)?
- [ ] What term do we use for the individual mist nature layers in the perimeter breakdown?
- [ ] How does the next-ring foreshadowing mechanically trigger? What does the MW perceive?
- [ ] What programmatic sprite styles work for mid-screen events? What's the visual vocabulary?
- [x] What columns/filters does the Power Management view include by default? **Name, Role, Assignment, Body, Mind, Spirit, Health, Notable Trait. Filters by role, assignment status, stat thresholds. Best Fit helper per role.** *(Resolved 2026-02-12)*
- [ ] How does the Source clue tracker present partially-decoded vs. fully-decoded clues?
- [ ] Should Resources section live in Items tab or is the header bar sufficient?
