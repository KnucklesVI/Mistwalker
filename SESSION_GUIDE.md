# SESSION GUIDE — Mistwalker
<!-- Load this FIRST every session. Last updated: v0.05s — 2026-02-17 -->

---

## STANDING RULES (NON-NEGOTIABLE)

1. **"When I comment, don't do anything — always check with me."** If Yaro makes an observation or shares feedback, do NOT start implementing. Ask what he wants done first.
2. **Bump version letter on EVERY code change.** `v0.05a → v0.05b`. Increment through letters: `v0.01z → v0.02a`. Update the VERSION constant in `src/shell/components/header-bar.js`.
3. **Sync cache params across ALL files.** Every `?v=XX` in `index.html` must match. Add no-cache meta tags to index.html.
4. **SIX roles only:** Priest, Soldier, Engineer, Worker, Scholar, Mist Walker. **NO Alchemist. NO Mystic.** Those are Scholar specializations / Priest capabilities.
5. **Keyboard-first design** is a pillar. Navigation via `.ring-btn` in `.nav-group`.
6. **Visual presentation = separable skin layer** (skinning rule).
7. **Core must never know it lives in a browser.** See CORE_STANDARDS.md.

---

## ABOUT YARO

- **GitHub:** KnucklesVI
- **Repo:** https://github.com/KnucklesVI/Mistwalker
- **GitHub Pages:** https://knucklesvi.github.io/Mistwalker/
- **Email:** yarobrock@gmail.com
- **Note-taking tool:** Obsidian (markdown-based)

---

## PROJECT STRUCTURE

```
mistwalker/
├── index.html                    ← Entry point (cache-busted imports)
├── src/
│   ├── core/                     ← PORTABLE (no browser deps)
│   │   ├── engine.js             ← Orchestrator, command dispatch, day phases
│   │   ├── commands.js           ← Command type constants
│   │   ├── state.js              ← Initial state factory
│   │   ├── config.js             ← All balance values (single source of truth)
│   │   ├── rng.js                ← Seeded PRNG
│   │   └── modules/
│   │       ├── time.js           ← Day/phase management
│   │       ├── population.js     ← Characters, training, healing, XP
│   │       ├── mist.js           ← Perimeter stability, raid generation
│   │       ├── combat.js         ← Raid resolution, traps, defense calc
│   │       ├── exploration.js    ← MW journeys, expeditions, findings
│   │       ├── knowledge.js      ← Clue research, completion
│   │       ├── library.js        ← Books, languages, scholar study
│   │       ├── building.js       ← Structures, construction queue
│   │       ├── resources.js      ← Production/consumption
│   │       ├── creatures.js      ← Creature generation, bestiary
│   │       ├── doctrines.js      ← Soldier doctrines, priest actions
│   │       ├── events.js         ← Feed classification
│   │       └── underground.js    ← Digging (DISABLED)
│   ├── shell/                    ← BROWSER-SPECIFIC UI
│   │   ├── app.js                ← Bootstrap, wires engine to UI
│   │   ├── renderer.js           ← Tab routing, render orchestration
│   │   ├── keyboard.js           ← Full keyboard navigation system
│   │   ├── lexicon.js            ← Display name mappings
│   │   ├── components/
│   │   │   ├── header-bar.js     ← VERSION constant lives here
│   │   │   └── modal.js          ← Character sheet modal
│   │   └── tabs/
│   │       ├── dashboard.js      ← Overview, quick actions, event feed
│   │       ├── people.js         ← Full roster, assignments, health
│   │       ├── explore.js        ← MW status, expeditions, raids
│   │       ├── research.js       ← Clue queue + library workspace
│   │       ├── build.js          ← Engineer corps, structures, traps
│   │       ├── items.js          ← Artifacts, tomes
│   │       └── compendium.js     ← Creature bestiary
│   └── data/
│       ├── names.json            ← Character name pools
│       ├── locations.json        ← Location templates
│       ├── raids.json            ← Raid flavor text
│       └── artifacts.json        ← Artifact templates
├── styles.css
├── CORE_STANDARDS.md
├── SESSION_GUIDE.md              ← This file
├── IMPLEMENTATION_MAP.md         ← What's built, system by system
├── SYSTEM_SPEC.md                ← Mechanical design spec
├── CHANGELOG.md
└── Design Spec/                  ← 23-doc design bible (reference when needed)
```

---

## SERVER & WORKFLOW

**Start server:**
```bash
cd /sessions/sharp-loving-sagan/mnt/Mistwalker && nohup python3 server.py > /dev/null 2>&1 &
```
Server runs on port 8000. Access at `http://localhost:8000/`.

**After every code change:**
1. Bump VERSION in `src/shell/components/header-bar.js`
2. Sync `?v=` cache params in `index.html`
3. Hard-refresh browser to pick up changes

**Cannot push from sandbox** — the sandbox proxy blocks outbound git (403). Give Yaro commands to run locally.

---

## NORTH STAR

**Six words:** Comprehension, Wonder, Efficiency, Agency, Attachment, Tension

**Thesis:** Fragile monastery spending scarce attention/labor to sequence knowledge faster than entropy.

**Core loop:** DISCOVER → PREDICT → COUNTER → APPLY → CONFIRM

2-4 hour roguelike. Losing = expected, instructive, fun.

---

## ARCHITECTURE PATTERNS

1. **State Machine** — 10-phase day cycle, one phase active at a time
2. **Command Queue** — Every player action = data object, validated, logged, replayable
3. **Notification Bus** — Core pushes typed notifications, shell renders them

### Day Phases (in order)
```
WAITING_FOR_INPUT → RESOLVE_COMMANDS → MIST_TICK → COMBAT → EXPLORATION → KNOWLEDGE → PRODUCTION → GROWTH → EVENTS → RENDER
```

### Engine Contract (core ↔ shell)
```javascript
engine.queueCommand(cmd)              // Submit player intent
engine.advanceDay()                   // Tick all 10 phases
engine.getState()                     // Deep-cloned immutable snapshot
engine.executeCommand(state, cmd)     // Immediate command execution
```

### Module Parameter Order
```javascript
module.update(state, rng, config, notifications)
```
All balance values in `config.js`. All randomness via seeded `rng`. State is the only shared memory between modules.

---

## KEYBOARD SHORTCUTS

| Key | Action |
|-----|--------|
| Tab / Home | Cycle tabs forward |
| Shift+Tab / Shift+Home | Cycle tabs backward |
| 1-7 | Jump to specific tab |
| ↑/↓ | Navigate within tab content |
| ←/→ | Navigate within nav-group / toggle collapsible |
| Enter | Activate focused element / open character sheet |
| Shift+Enter | Advance day (Next Dawn) |
| Escape | Close modal / clear focus |
| Q | Toggle feed filter |

---

## THREE-TIER PROGRESSION

- **Novice** — Starting tier. Lower efficiency.
- **Veteran** — XP milestone (~15-20 active days) + role-specific gate. Same capabilities, done better.
- **Elevated** — Veteran + scholar research unlock + catalyst. Permanent specialization fork (3 per role, MW=none).

---

## BUILD LAYERS

- **Layer 1 (MVP):** Day tick, 6 roles, mist perimeter, MW explore, scholar decode, Ring 1, basic raids, traps, feed, keyboard nav. ← **~95% COMPLETE**
- **Layer 2:** Veteran mechanics, natures, Ring 2, crafting, digging, multi-day expeditions, rescue, save UI.
- **Layer 3:** Elevated tier + specializations, Ring 3-4, full nature pool, mythic events, naming, source boss.

---

## CURRENT VERSION

**AlphaB v0.05s** (modular ES6 rebuild)

*Note: The old single-file prototype was v0.39b. The modular rebuild started fresh at v0.01a.*