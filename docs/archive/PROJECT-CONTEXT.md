# Mistwalker — Project Context

*Read this at the start of every session.*

---

## About Yaro

- **GitHub:** KnucklesVI
- **Repo:** https://github.com/KnucklesVI/Mistwalker
- **GitHub Pages:** https://knucklesvi.github.io/Mistwalker/
- **Email:** yarobrock@gmail.com
- **Local project path:** /Users/yarobrock/Obsidian/Mistwalker
- **Note-taking tool:** Obsidian (markdown-based, so .md files render natively in the vault)

---

## Key Rule

**"When I comment, I don't want you to do anything — always check with me."**

If Yaro makes an observation, shares feedback, or describes an idea, do NOT start implementing. Ask what he wants done first.

---

## What Is Mistwalker

A single-file HTML/CSS/JS browser game. No dependencies, no build step. Everything lives in one .html file. It's a survival management roguelike where you guide a monastery through an apocalypse of mist.

The game is procedurally generated — locations, creatures, discoveries, artifacts, buildables, herbs, recipes, clue text, and equipment are all assembled from name pools and weighted tables at init.

---

## Folder Structure

```
/Users/yarobrock/Obsidian/Mistwalker/
├── Mistwalker (Current)/
│   └── Mistwalker.html          ← THE game file. This is what you edit.
├── index.html                    ← Copy of Mistwalker.html for GitHub Pages
├── mistwalker-0.XX.html          ← Current version snapshot
├── MW Versions/                  ← Archived version snapshots
├── Design Doc/
│   ├── Mistwalker - Design Document.md
│   ├── Mistwalker - Content Bible.md
│   └── the-last-light-design-doc.md  (original, archived)
├── CHANGELOG.md
├── CHANGELOG-RULES.md
├── PROJECT-CONTEXT.md            ← This file
└── .git/
```

---

## Workflow Rules

### Versioning Scheme
- **Major updates** bump the minor number: 0.39 → 0.40, 0.40 → 0.41, etc.
- **Flash updates** (small fixes, tweaks, single features) get letter suffixes: 0.39a, 0.39b, 0.39c, etc.
- Yaro decides when something qualifies as a full version bump vs. a letter suffix.

### Version Snapshots
- When creating a new version, **move the previous snapshot** from root to `MW Versions/`.
- The current snapshot stays at root as `mistwalker-0.XX.html` (or `mistwalker-0.XXa.html` for letter versions).
- `index.html` is always a copy of the latest build (for GitHub Pages).
- `Mistwalker (Current)/Mistwalker.html` is the working game file.

### Changelog
- Follow rules in `CHANGELOG-RULES.md`.
- Newest version at top.
- Categories in order: Systems, Content, UI, Fixes, QoL.
- Present tense, concise, no code references.
- Snapshot filename at bottom of each version block.

### Testing
- Test file lives in the sandbox working directory (not in the project folder).
- Path: `/sessions/[session-id]/test-v3.js` — update the file path at line 4 to point to the working copy.
- Run with `node test-v3.js`.
- Currently 691+ tests. All must pass before deploying.
- Some tests are flaky due to randomness (~20% fail rate on: "Marcus back to active", "Game survives 20 days"). These are pre-existing and not from your changes.

### Deploying
After changes pass tests:
1. Copy working file → `Mistwalker (Current)/Mistwalker.html`
2. Copy working file → `index.html` (GitHub Pages)
3. Copy working file → `mistwalker-0.XX.html` (snapshot)
4. Update `CHANGELOG.md`
5. Give Yaro the git push commands

### GitHub Push (Yaro runs these)
```bash
cd "/Users/yarobrock/Obsidian/Mistwalker"
git add -A
git commit -m "Alpha 0.XX: description"
git push
```
Note: Push uses a personal access token baked into the remote URL. If auth fails, Yaro may need to regenerate a token at https://github.com/settings/tokens.

**Cannot push from sandbox** — the sandbox proxy blocks outbound git (403). Always give Yaro the commands to run locally.

---

## Technical Reference

### Current Version
Alpha 0.39b (as of Feb 2026)

### Roles (8)
Worker, Fighter, Priest, Scholar, Engineer, Mistwalker, Mystic, Alchemist

### Key Mechanics
- **Mistwalkers are permanently locked** — cannot train in other roles or switch back.
- **Traps only affect physical creatures** — corrupted and spiritual pass through.
- **Difficulty scales** with day count (15% per 30 days) × depth multiplier (1.2x Grey Reach, 1.5x Deep).
- **Threat spawn interval tightens** over time (8d → min 3d). Deep allows 3rd concurrent threat.
- **Perimeter stability** scales defense. Gaps cause food spoilage, lost people, injuries.
- **Clue system** reveals locations (3 clues each). 9 final clues unlock the Source.
- **Lore types** use a `_loreType` tagging pattern: all discoveries start as buff/null for linkContent(), then convert to their desired type after linking.
- **Stone resource** — quarried by workers, also a byproduct of excavation (0.3 × dig speed per day).
- **Watchtowers** — built by engineers (8W + 6S), upgraded with metal (5M). Protect priests, enable mystics.
- **Priests without towers** are 3x more vulnerable on perimeter. Priests in towers contribute to perimeter safely.
- **Mystics require a reinforced tower** to contribute against spiritual threats. No tower = no spiritual boost.
- **Towers degrade** 1 HP/day, take damage from physical attacks. If HP hits 0, occupants die.
- **Tower damage scales** with combat result: decisive win → ⌈eAtk/20⌉, narrow → ⌈eAtk/10⌉, defeat → ⌈eAtk/5⌉.

### Key Functions to Know
- `initState()` / `generateContent()` — game setup
- `advanceDay()` — processes all daily systems
- `resolveThreatAttack()` — threat combat resolution
- `resolveExpedition()` — expedition completion
- `processThreats()` — threat spawning and approach
- `getThreatScaling()` — day + depth difficulty multiplier
- `showPersonModal()` — person UI (training, switching, assignments)
- `playSound()` — Web Audio API sound effects (death = Pac-Man style)
- `linkContent()` — connects discoveries to buildables/weaknesses/locations
- `buildTower()` / `upgradeTower()` — tower construction and upgrade
- `processTowerProject()` / `processTowerDegradation()` / `processTowerRepair()` — daily tower processing
- `assignToTower()` / `removeTowerOccupant()` — tower occupant management
- `getMysticInTower()` — checks if mystic is in reinforced tower (replaces getMysticInGarrison for spiritual boost)
- `damageTowers()` / `destroyTower()` — tower damage and destruction
- `getStoneRate()` / `processQuarrying()` — stone resource system
- `renderAlchemy()` — alchemy tab UI (herb garden, recipes, brewing, experimentation, stockpile)
- `processHerbCultivation()` / `processAlchemy()` — daily herb harvesting and brewing/experimenting
- `startDirectBrew()` — player-initiated brew of specific recipe
- `equipConsumable()` / `unequipConsumable()` — elixir equip system (potion slot on people)
- `showEquipConsumableModal()` — modal to pick who gets an elixir

### Sound Types
pop, alert, treasure, victory, defeat, injury, mist, death, arrival

### CONFIG Highlights
- startingFood: 120, foodPerPerson: 1
- threatThreshold: 20 attention
- threatSpawnInterval: 8 (tightens with day count)
- maxOverlappingThreats: 2 (+1 at Deep)
- Training days: worker 3, fighter 7, engineer 8, scholar 10, alchemist 12, priest 14, mystic 14, mistwalker 21

---

## Best Practices for the Folder

### Do
- Keep `Mistwalker (Current)/` clean — just `Mistwalker.html`, nothing else.
- Archive every version snapshot in `MW Versions/` before replacing.
- Use `.md` files for documentation (they render in Obsidian).
- Keep the test file in the sandbox, not in the project folder (it's dev-only tooling).
- Always syntax-check before running tests: extract `<script>` content and run through `new Function()`.

### Don't
- Don't put zip files, temp files, or .DS_Store in git.
- Don't edit `index.html` directly — always copy from `Mistwalker (Current)/Mistwalker.html`.
- Don't push from the sandbox (403 proxy error). Give Yaro the commands to run locally.
- Don't create a `.gitignore` without asking (Yaro may want to track certain files).

### Suggested Additions (When Ready)
- **`.gitignore`** — to exclude `.DS_Store`, `.obsidian/`, and temp files from git.
- **Playtester feedback log** — a markdown file to capture Discord feedback between sessions.
- **Roadmap** — a prioritized feature list for upcoming versions.

---

*Last updated: Alpha 0.39b — February 11, 2026*
