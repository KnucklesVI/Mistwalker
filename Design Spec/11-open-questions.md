# Open Questions — Single Source of Truth

Everything unresolved. When a question is answered, check the box and record the decision + date inline. Individual system docs may also list their questions for context, but THIS document is the authoritative tracker.

See **[14 — Collaboration Roadmap](14-collaboration-roadmap.md)** for the suggested order to resolve these.

---

## Phase A — Foundational (Resolve First)

### Roles & Progression
- [x] Starting roster: Fixed + 4 Unassigned. Composition: 4P / 4S / 1E / 5W / 1Sch / 1MW / 4U. MW pre-committed. *(Resolved 2026-02-12)*
- [x] Role switching: anyone can switch (even elevated), resets to novice in new role. Previous role progress is FROZEN (not erased) — switching back restores prior tier/specialization. Intrinsic stat boosts carry across all roles. MW is permanent and irreversible. *(Resolved 2026-02-12)*
- [x] Veteran progression: Hybrid model. XP from active duty (transparent, predictable) + milestone gate (defining moment required). *(Resolved 2026-02-12)*
- [x] Veteran milestones (first-draft, playtest-tunable): Priest=Vigil, Engineer=Breakthrough, Soldier=Stand, Worker=Surplus, Scholar=Decode, MW=Return. Emerge from play, not assigned as quests. *(Resolved 2026-02-12)*
- [x] Population cap: 30. Start at 20, grow through rescues/events. Resurrection available. New characters are novices. *(Resolved 2026-02-12)*

### The Mist
- [x] Mist escalation: player-triggered tiers + within-tier time pressure. Within each tier, threats intensify daily. Difficulty resets to standard baseline when advancing to next tier. *(Resolved 2026-02-12)*
- [x] Mist natures: drawn from a randomized pool, NOT a fixed progression. Each ring gets a unique nature. Ring 1 = standard mist (baseline). Ring 2 = standard + Nature A. Ring 3 = standard + A + B (always different from Ring 2). Ring 4 = standard + A + B + Source's unique nature. Natures stack additively. *(Resolved 2026-02-12)*
- [x] Mist elements always in the same order? **No.** Nature pool is random per run. Discovery through knowledge pipeline is survival-critical. *(Resolved 2026-02-12)*
- [x] Creatures reflect the ring's mist nature — base types get adjective + stat change. Each nature also has 1-3 signature creatures unique to it. *(Resolved 2026-02-12)*

### A Day in the Life
- [x] Starting roster composition: 4P / 4S / 1E / 5W / 1Sch / 1MW / 4U. *(Resolved 2026-02-12)*
- [ ] How many days of food do you start with?

---

## Phase B — System Specifics (Resolve Second)

### Roles & Progression
- [x] Specialization paths for all roles — RESOLVED. Scholar: Apothecary/Cartographer/Ritualist. Priest: Shepherd/Oathkeeper/Chanter. Engineer: Delver/Ashwright/Breacher. Soldier: Bulwark/Watcher/Vanguard. Worker: Packer/Rootwalker/Tinker. MW: No standard specs (experience + items). These are the standard 3 per role — the floor, not the ceiling. More can emerge through non-standard transformations, itemization, cross-role training, etc. *(Resolved 2026-02-12)*
- [x] Mist natures handled through scholar research + priest training, not automatic progression. Priests must study specific counters for each run's natures. Body/Mind/Spirit intrinsic stats added. *(Resolved 2026-02-12)*
- [x] Elevation triggers: Veteran status + scholar research (one-time path unlock for the monastery) + catalyst/facility (per-character cost). May draw Source Attention. Underground facilities can serve as elevation infrastructure. *(Resolved 2026-02-12)*
- [ ] Can a character hold multiple non-standard transformations, or is there a cap?
- [x] Specializations require scholar research to unlock the path (one-time) AND a catalyst/facility per character to perform the elevation. *(Resolved 2026-02-12)*
- [ ] What does Mist Walker progression look like specifically?

### The Mist
- [x] How many phases does the source/boss have? **Three phases: Shell (Ring 4 nature test), Echo (Ring 1-3 thoroughness test), Core (deep comprehension test). Multi-day assault. 9 guaranteed Source clues from vital location Hearts + 3 bonus clues from Ring 4 exploration (not guaranteed). Missing clues = harder, not impossible.** *(Resolved 2026-02-12)*
- [x] What determines perimeter degradation when new elements appear? **Gap-based risk system carries forward from prototype. Each priest contributes stability based on stats. Gap below 100% = proportional risk (food spoilage, injuries, mist exposure). With stacking natures, priests must counter each active layer to contribute fully — untrained priests only partially cover. Exact numbers playtest-tunable.** *(Resolved 2026-02-12)*
- [ ] Can the player slow the clock through specific actions?
- [x] Does deeper exploration attract the source's attention (tit-for-tat + clock)? **Source Attention is discrete costs on specific high-value actions (not a meter). Normal exploration is invisible. See Doc 03.** *(Resolved 2026-02-12)*
- [x] How does the final assault mechanically work? **Multi-day push through Source's lair (4+ tiers, randomized depth). Three-phase fight (Shell/Echo/Core). Team commitment fork — who goes vs. who stays to defend. Decoded Source clues reduce phase difficulty. See Doc 03.** *(Resolved 2026-02-12)*

### Exploration
- [x] Locations per ring: Rings 1-3 have 3 vital locations each (three-tier mini-dungeons with Source clues). Ring 4 has 1 vital location (the Source's lair, randomized depth of 4+ tiers). 10 vital locations total. All rings have scattered minor locations (single-tier, persistent, revisitable). *(Resolved 2026-02-12)*
- [x] Locations fixed or pooled? **Pooled.** Vital locations drawn from a per-ring pool, randomized each run. Minor locations drawn from a shared pool with nature flavor applied. *(Resolved 2026-02-12)*
- [x] Underground depth: 4 defined levels (Foundation, Old Halls, Sealed Depths, The Root) + The Abyss (open-ended, unpredictable, below Level 4). Each level has 2-3 chambers. *(Resolved 2026-02-12)*
- [x] Can digging reveal threats? **Yes.** Trapped chambers, flooded chambers, mist seepage at Level 4, and unpredictable catastrophic outcomes in the Abyss. *(Resolved 2026-02-12)*
- [ ] Does the underground connect to the ring system? (Tunnels that surface in Ring 1 or 2?)
- [x] Underground discovery order: Player chooses where to dig. Hidden chambers require Cartographer clues. Sealed chambers require Breacher. Levels are sequential (must dig through 1 to reach 2). *(Resolved 2026-02-12)*
- [x] Expedition duration: multi-day for vital locations (3+ days per location plus travel). Same-day for MW scouting in Ring 1 and minor location encounters. Ring 2+ scouting is multi-day. *(Resolved 2026-02-12)*

### Knowledge System
- [ ] How many MW actions per day? Always one, or upgradeable?
- [x] How fast do scholars work? **Pass/fail system (never misinterpret). Pacing numbers are playtest-tunable config values. Initial build set fast to match clock philosophy.** *(Resolved 2026-02-12)*
- [x] Can multiple scholars collaborate on the same task? **Yes. Multiple scholars on the same research task compress the timeline. Makes additional scholars genuinely valuable.** *(Resolved 2026-02-12)*
- [ ] Is threat forecasting automatic or player-assigned?
- [ ] How transparent are dependency drawer hints?
- [x] Can scholars fail in interesting ways (misinterpretation)? **No. Pass or fail only. Failed = needs more time/data/facility. Never gives wrong intel. Player never second-guesses scholar output.** *(Resolved 2026-02-12)*
- [ ] What is the complete list of material conversion recipes?

### Mist Nature Pool
- [ ] How many mist natures in the full pool? (Enough for variety but each one needs real design work)
- [ ] What are the specific natures? Names, visual signatures, counters, signature creatures
- [ ] How long does it take a scholar to identify a new nature?
- [ ] How long does it take a priest to train against a newly identified nature?
- [ ] Does every priest on the wall need the counter, or can one specialist cover a section?
- [ ] Legacy/Memory system: when significant characters die, what persists mechanically?
- [x] Source Attention mechanic: specific high-value actions (activating ancient facilities, major rites, rare synthesis, breaching sealed locations) draw Source attention. NOT a meter — discrete costs on individual actions. Penalty is transparent and stated before the player commits (e.g., "raids +1 for 5 days" or "mist pressure +15%"). Normal monastery operations are invisible. *(Resolved 2026-02-12)*
- [x] Silence/Noise as a separate resource? **No.** Replaced by Source Attention as discrete action costs. No new meter to track. *(Resolved 2026-02-12)*
- [ ] Which specific actions carry Source Attention costs? (Full curated list TBD)
- [x] Legacy/Memory system: **Essence system. Body recovery preserves essence. Two paths: Resurrection (character returns, may have side effects, draws Source Attention) or Repurpose (essence binding, offering, crafting, or memory imprint). Fork with no easy answer. See Doc 06.** *(Resolved 2026-02-12)*
- [x] What does Mist Walker progression look like? **Endurance (stay out longer, push further), combat (offense + defense improve), random effects from lived experience. No specialization tree. See Doc 02.** *(Resolved 2026-02-12)*

### Systems & Crafting
- [x] Material categories: Organics (food + herbs), Stone & Wood, Metal (expedition-only), Essences (nature-specific, from creatures/mist/underground), Relics (unique knowledge objects). *(Resolved 2026-02-12)*
- [x] Recipe system: discovered through knowledge pipeline (scholar studies relics/lore). Start with basic recipes only. Each recipe = 2-3 material categories + specific facility. Priority queue system. *(Resolved 2026-02-12)*
- [x] Facilities gate crafting: 3 tiers. T1 (Workshop/Storehouse/Forge) = any worker/engineer. T2 (Alchemical Chamber/Herbarium/Advanced Forge) = right role required. T3 (Ritual Sanctum/Deep Forge/Ancient) = veteran+ of correct role. *(Resolved 2026-02-12)*
- [x] Recipes discovered, not known from start. *(Resolved 2026-02-12)*
- [x] Anti-bookkeeping: player assigns people to facilities, not individual recipes. Priority queue with notifications. Feels like managing a department, not a vending machine. *(Resolved 2026-02-12)*
- [ ] Full recipe list (depends on mist nature pool)
- [ ] Exact material costs for facility construction
- [ ] Recipe completion times
- [ ] Can multiple operators staff the same facility?
- [ ] What specific ancient facilities exist underground?

---

## Phase C — Polish & Feel (Can Resolve Alongside Development)

### Wonder & Identity
- [ ] How many mythic events per typical run?
- [ ] Do mythic events have mechanical consequences or are they purely narrative + transformation?
- [ ] Character name generation: fixed pool? procedural? cultural theme?
- [ ] Can characters accumulate unlimited non-standard traits?
- [ ] Should players name characters or are names always generated?
- [ ] How do we handle attachment for characters who die early?

### Pacing & Tension
- [ ] Exactly how many in-game days correspond to each phase?
- [ ] How do we signal phase transitions?
- [ ] Should there be "calm before the storm" moments?
- [ ] Is there a point of no return in the final phase?
- [ ] How do we handle runs exceeding 4 hours?
- [x] Save system: **Save-and-quit, single save slot. Game exits on save. Testing mode allows multiple saves for iteration. No save-scumming in normal play.** *(Resolved 2026-02-12)*

### Interface
- [ ] Should the dashboard show a visual representation of the monastery (layout/map)?
- [ ] How do we represent the underground dig visually?
- [x] Should rings have a map view? **Yes — MW Exploration view organizes locations by ring with engagement state. Vital and minor locations split. Collapsible by ring.** *(Resolved 2026-02-12)*
- [ ] How do we show mist escalation visually?
- [ ] Should there be a "readiness assessment" screen?
- [ ] How do we handle feed volume in late game?
- [ ] What term for individual mist nature layers in perimeter breakdown?
- [ ] How does next-ring foreshadowing mechanically trigger?
- [ ] What programmatic sprite styles work for mid-screen events?
- [ ] What default columns/filters for Power Management view?
- [ ] How does Source clue tracker show partial vs full decode?

### Forks & Decisions
- [ ] How do we ensure daily forks don't feel routine?
- [ ] Explicit fork presentation vs. emergent from context?
- [ ] How many existential forks per run?
- [ ] Can avoiding a decision be itself a decision?
- [ ] Should the game track key player decisions?

### Architecture & Code
- [ ] Build tool for single-file output: Webpack? Rollup? Vite? Custom script?
- [ ] State serialization for saves: JSON.stringify full state? Version the format?
- [ ] RNG seeding: should runs be replayable from a seed?
- [ ] Performance: log all bus events in production, or only debug mode?
- [ ] Mobile/touch: keyboard-first, but do we need tap targets?

---

## Decision Log

Resolved questions move here with their answer and date.

| # | Question | Decision | Date |
|---|----------|----------|------|
| — | *(none yet)* | — | — |
