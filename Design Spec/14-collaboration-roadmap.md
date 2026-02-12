# Collaboration Roadmap

What we need to work through together, in order, before code starts. Each item is a conversation, not a task. Some will take five minutes. Some will take an hour.

## Phase A — Foundational Decisions

These are load-bearing. Everything else depends on them. We resolve these first.

### A1. Starting Roster Composition
How many of each role do you begin with? Are there unassigned people? Does the player choose, or is it fixed?
- **Why it matters:** This defines the opening minutes of every run. Get it wrong and Day 1 is either boring or impossible.
- **Proposal to discuss:** 4 Priests, 3 Soldiers, 2 Engineers, 6 Workers, 3 Scholars, 2 Unassigned. Player assigns the 2 unassigned on Day 1.
- **Connected to:** 12-a-day-in-the-life.md (Day 1 scenario)

### A2. The Mist Clock
How fast does it tick? What is the relationship between in-game days and mist escalation?
- **Why it matters:** The clock is the game's pacing engine. Too fast = no time to think. Too slow = no tension.
- **Proposal to discuss:** Phase 1 (physical mist) = days 1-25. Phase 2 (corrupt mist) = days 26-55. Phase 3 (ethereal mist) = days 56-80. Final push window = days 80-100. Hard loss = day 120 (mist overwhelms).
- **Connected to:** 03-the-mist.md, 07-pacing-and-tension.md

### A3. Population Cap
Is 20 a hard cap? Can rescued people push it to 21, 22? Is there a maximum?
- **Why it matters:** Changes the value of rescue missions and the meaning of loss.
- **Proposal to discuss:** Start at 20. Can grow to 24 max through rescues and rare events. Cannot recruit — only find. Every person above 20 is a gift, not an expectation.
- **Connected to:** 01-the-organism.md, 12-a-day-in-the-life.md

### A4. Role Switching Rules
Can someone change roles? At what cost?
- **Why it matters:** If roles are permanent, early assignment is an existential fork. If they're switchable, it's a resource cost.
- **Proposal to discuss:** Novices can switch roles (costs 5 days of retraining, resets to day 0 of new role). Veterans and Elevated cannot switch — they've invested too much. Mist Walkers can never switch (already established).
- **Connected to:** 02-roles-and-progression.md, 09-forks-and-decisions.md

### A5. Veteran Progression
How does Novice → Veteran work? Time-based? Milestone-based? How long?
- **Why it matters:** This determines when the player starts feeling quantitative growth.
- **Proposal to discuss:** XP earned by performing role actions. ~15-20 days of active role duty for a novice to become veteran. Specific thresholds vary by role.
- **Connected to:** 02-roles-and-progression.md

---

## Phase B — System Specifics

Once the foundation is solid, we define how each system actually works with numbers and mechanics.

### B1. Specialization Paths (All 6 Roles)
Name them, define their tradeoffs, describe what new capabilities they unlock.
- **Why it matters:** These ARE the mid-to-late game forks. They define "what kind of monastery are we?"
- **Approach:** Work through one role at a time. For each: 2-3 specializations with names, tradeoffs, and one signature ability.
- **Connected to:** 02-roles-and-progression.md

### B2. Elevation Triggers
What does it take to become Elevated? Just reaching veteran, or something more?
- **Why it matters:** This determines pacing of the mid-game and whether elevation feels earned.
- **Proposal to discuss:** Veteran status + a specific catalyst (tome, facility, or scholar research project). Different catalysts for different roles.
- **Connected to:** 02-roles-and-progression.md, 05-knowledge-system.md

### B3. The Crafting System
What materials exist? What recipes? How does crafting interact with facilities?
- **Why it matters:** Crafting connects resources → scholars → capability. If it's too complex, it's bookkeeping. Too simple, it's not a system.
- **Approach:** Define 4-6 material categories and 8-12 recipes. Recipes require specific facilities (alchemy lab, forge, etc.)
- **Connected to:** 05-knowledge-system.md, 04-exploration.md

### B4. Underground Layout
How deep? How many levels? What's the reward structure per level?
- **Why it matters:** Digging is the second axis of exploration. It needs to feel distinct from mist exploration.
- **Approach:** Define 3-4 dig levels with escalating rewards and risks. Each level has 2-3 discoverable chambers.
- **Connected to:** 04-exploration.md

### B5. Location Content
What do the locations in each ring actually contain? How many per ring?
- **Why it matters:** Locations are where discoveries happen. If they're generic, exploration is boring.
- **Approach:** Define a pool of 6-8 locations per ring. Each run draws 3-4 from the pool. Each location has a unique discovery.
- **Connected to:** 04-exploration.md, 05-knowledge-system.md

### B6. The Source / Final Boss
How many phases? What weaknesses? What does the assault look like?
- **Why it matters:** The ending defines whether the whole run was worth it.
- **Approach:** 3-phase boss. Each phase requires knowledge of 2 weaknesses. 6 weaknesses total, discoverable through exploration + scholarship. The assault is a multi-day event, not a single check.
- **Connected to:** 03-the-mist.md, 07-pacing-and-tension.md

---

## Phase C — Polish & Feel

These are important but don't block code. We can iterate on them while building.

### C1. Character Names
Generation method, cultural theme, how titles accumulate.
- **Connected to:** 06-wonder-and-identity.md

### C2. Mythic Event Catalog
What are the 5-8 mythic events per run? What triggers them? What do they look like?
- **Connected to:** 06-wonder-and-identity.md

### C3. Non-Standard Transformation Catalog
What are the possible triggered transformations? What causes them?
- **Connected to:** 02-roles-and-progression.md, 06-wonder-and-identity.md

### C4. Feed Writing Style
What does the game's voice sound like? Spare and monastic? Warm? Grim?
- **Connected to:** 08-interface.md

### C5. Visual Design Language
Color palette, typography choices, how mythic events look vs routine.
- **Connected to:** 08-interface.md

### C6. ~~Save System~~ — RESOLVED
~~Save-and-exit, phase checkpoints, or ironman? (May need playtesting to decide.)~~
- **Decision:** Save-and-quit, single save slot. Testing mode allows multiple saves. *(Resolved 2026-02-12)*

### C7. Visual & Interaction Design Review
Dedicated review once UI skeleton is built. Font sizes, spacing, typography, scan-ability, tab navigation feel. Should result in skin-layer-only changes. Consider bringing in a focused design agent for recommendations.
- **Connected to:** 08-interface.md

### C8. Character Naming System
Generic fantasy trope naming. Handled by design team (not a user-facing decision). Must support the Gandalf-style title accumulation system.
- **Connected to:** 06-wonder-and-identity.md

---

## Suggested Working Order

1. **A1 → A2 → A3 → A4 → A5** (one conversation, probably 30-60 min)
2. **B1** (one role at a time — may take several conversations)
3. **B2 → B3** (connected — elevation often requires crafting/facilities)
4. **B4 → B5** (connected — underground and surface locations define the discovery map)
5. **B6** (last — needs everything else to be defined first)
6. **Start building Layer 1** (13-build-priority.md) while resolving Phase C in parallel
7. Phase C items iterate alongside development

---

## Decision Log

As we resolve questions, we record them here. This becomes the authoritative record of what we decided and why.

| # | Decision | Date | Rationale |
|---|----------|------|-----------|
| A1a | Roster type: Fixed + Unassigned | 2026-02-12 | First fork happens immediately. Player shapes the monastery from Day 1. |
| A1b | Starting composition: 4P / 4S / 1E / 5W / 1Sch / 1MW / 4U = 20 | 2026-02-12 | MW pre-committed so perception pipeline is live from Day 1. Bare minimum growth roles (1E, 1Sch). 4 unassigned = identity decisions. Second engineer/scholar feels earned. |
| A2a | Mist escalation: player-triggered tiers + within-tier time pressure | 2026-02-12 | Qualitative shifts (physical→corrupt→ethereal) triggered by player pushing into new ring. Within each tier, raids and threats intensify over time. Player controls the tempo but can't turtle for free. |
| A2b | Tier difficulty resets on advancement | 2026-02-12 | Pushing into Ring 2 resets to standard Tier 2 baseline — doesn't carry over inflated Ring 1 difficulty. Pushing forward is a relief from the escalation curve, but introduces new threat TYPE requiring new tools. |
| A3 | Population cap: 30. Start at 20, grow through rescues/events. Resurrection available. | 2026-02-12 | 30 allows expedition teams, role flexibility, growth as reward. New characters are novices — useful but can't replace experienced veterans. Late-game recruits are bodies, not capabilities. |
| A4 | Role switching: anyone can switch (even elevated), resets to novice in new role. MW permanent. | 2026-02-12 | Switching is always possible but costly — you reset to novice in the new role. However, previous role progress is FROZEN, not erased. Switching back restores prior tier/specialization. Intrinsic stat boosts (Body/Mind/Spirit) carry across all roles naturally. Only MW commitment is truly permanent and irreversible. |
| A5 | Veteran progression: Hybrid (XP from active duty + milestone gate) | 2026-02-12 | XP accumulates transparently from doing the job. Promotion requires XP threshold AND a defining moment (milestone). Milestones per role TBD in Phase B. Feels earned on both counts — not just a counter, but also not blocked by RNG. |
| B1a | Scholar specs: Apothecary, Cartographer, Ritualist | 2026-02-12 | Substance mastery, information mastery, transformation mastery. Three philosophies for solving the same problems. |
| B1b | Priest specs: Shepherd, Oathkeeper, Chanter | 2026-02-12 | Expedition protection, rites/resurrection, amplify others. Mist elements handled through standard progression, NOT specialization. |
| B1c | Engineer specs: Delver, Ashwright, Breacher | 2026-02-12 | Underground master, infrastructure/crafting, expedition engineering. Breaching is an engineering skill (moved from soldiers). |
| B1d | Soldier specs: Bulwark, Watcher, Vanguard | 2026-02-12 | Immovable defense, offense-first combat flip, field commander. |
| B1e | Worker specs: Packer, Rootwalker, Tinker | 2026-02-12 | Heavy hauling, herb cultivation, practical insight generator. |
| B1f | MW: No standard specializations | 2026-02-12 | Identity emerges from lived experience + itemization. No menu. Story IS specialization. |
| B1g | Intrinsic stats: Body, Mind, Spirit | 2026-02-12 | Mostly fixed stats. Rare boosts from tomes/artifacts/events. Boosted stats open non-standard transformation paths across role boundaries. |
| B1h | Mist element adaptation through progression, not specialization | 2026-02-12 | Novice = physical. Veteran = corrupt. Elevated = ethereal. All roles adapt through tiers. Specializations are about capabilities BEYOND element handling. |
| B1i | Specializations are a floor, not a ceiling | 2026-02-12 | The 3 named specializations per role are the standard paths. More can emerge through non-standard transformations, intrinsic stat boosts, cross-role training, itemization, or mythic events. Discovering a rare unique class is part of the fun. |
| B1j | Mist natures: randomized pool, not fixed progression | 2026-02-12 | Mist natures (crystalline, darkness, glorious, etc.) drawn from a pool. Each ring gets a unique nature. R1 = standard. R2 = standard + Nature A. R3 = standard + A + B. R4 = standard + A + B + Source nature. Natures stack additively. No repeats within a run. |
| B1k | Priest adaptation is run-specific, not automatic | 2026-02-12 | Priests learn nature counters through MW clues → scholar research → training. Must come off the wall to study. Creates temporary vulnerability window each time a new ring is opened. Learned counters are permanent and stack. |
| B1l | Creatures reflect ring nature | 2026-02-12 | Most creatures are base types with adjective + stat change matching the nature. Each nature also has 1-3 signature creatures unique to it. Makes each ring feel like its own ecosystem. |
| B1m | Ring 4 (Source) has its own unique nature | 2026-02-12 | Source must be found through exploration of Ring 4. Ring 4 has a unique mist nature different from Rings 2 and 3. Pre-assault preparation includes identifying and countering this nature. |
| B1n | AI consultation review: Legacy system, crafting-attracts-attention, Source as knowledge lock, Silence/Noise | 2026-02-12 | Reviewed Gemini + ChatGPT proposals. Specializations confirmed (independent convergence). Flagged 4 ideas for adoption: Legacy/Memory system, crafting-attracts-attention mechanic, Source as puzzle-lock (not DPS race), Silence/Noise push/rest rhythm (to discuss). |
| B1o | Source Attention: discrete costs, not a meter | 2026-02-12 | High-value actions (ancient facility activation, major rites, rare synthesis, breaching) draw Source attention with transparent, pre-stated penalties. Normal operations are invisible. No Silence/Noise resource — just individual "is this worth the heat?" decisions embedded in existing systems. |
| B2a | Veteran milestone gates defined (first-draft) | 2026-02-12 | Priest=Vigil, Engineer=Breakthrough, Soldier=Stand, Worker=Surplus, Scholar=Decode, MW=Return. Milestones emerge from play, not assigned as quests. Explicitly flagged as playtest-tunable. Goal: fire naturally within the XP window for actively-used characters. |
| B2b | Elevation triggers: hybrid (research + catalyst) | 2026-02-12 | Requires: veteran status + scholar research (one-time path unlock) + catalyst/facility (per-character). Scholar unlocks the specialization once for the monastery; each individual elevation costs a catalyst. May draw Source Attention. Underground facilities can serve as elevation infrastructure. |
| B3a | Material categories: 5 types | 2026-02-12 | Organics (food + herbs), Stone & Wood, Metal (expedition-only bottleneck), Essences (nature-specific from creatures/mist/underground), Relics (unique knowledge objects). Metal forces expeditions. Essences connect combat→scholarship→defense. |
| B3b | Recipe system: discovered, not known | 2026-02-12 | Recipes unlocked through knowledge pipeline (scholar studies relics/lore). Start with basics only. Each recipe = 2-3 material categories + facility. Priority queue. Recipe list grows as scholars uncover more. |
| B3c | Facility tiers: 3 levels with staffing rules | 2026-02-12 | T1 (Workshop/Storehouse/Forge) = any worker/engineer, scales with tier. T2 (Alchemical Chamber/Herbarium/Advanced Forge) = right role required, specialization bonuses. T3 (Ritual Sanctum/Deep Forge/Ancient underground) = veteran+ only, may draw Source Attention. Staffing IS a resource decision. |
| B3d | Anti-bookkeeping principle | 2026-02-12 | Player assigns people to facilities, not individual recipes. Priority queue with notifications. Managing a department, not a vending machine. |
| B4a | Underground structure: 4 levels + Abyss | 2026-02-12 | Level 1 (Foundation) = basic upgrades, teaches digging. Level 2 (Old Halls) = advanced facilities, elevation infrastructure. Level 3 (Sealed Depths) = unique ancient facilities, Source intel. Level 4 (The Root) = Source-critical knowledge, mist seepage, non-standard transformations. The Abyss (below L4) = open-ended, unpredictable, potentially glorious or catastrophic. |
| B4b | Abyss design: no transparent costs | 2026-02-12 | Unlike normal Source Attention (which states penalties upfront), abyss digs are genuinely blind — outcomes unknown. Delver required. Optional — not needed to win. Serves Wonder, Tension, Agency. The monastery's ultimate gamble. |
| B4c | Dig team and monastery risk | 2026-02-12 | Engineer primary operator, workers assist, scholars optional. Underground threats are NOT contained to the dig — they're loose in the monastery. Anyone inside (scholars, engineers, workers, recovering characters) is at risk. Soldiers stationed at home are the defense. Creates three-way pull on soldiers: perimeter raids, expedition escort, interior security during digs. |
| B4d | Chamber types | 2026-02-12 | Standard (revealed on breakthrough), Hidden (require Cartographer clues), Sealed (require Breacher), Trapped (scholar analysis can detect beforehand), Flooded (engineering solution needed, contents well-preserved). |
| B5a | Location structure: vital + minor | 2026-02-12 | Rings 1-3: 3 vital locations each (three-tier). Ring 4: 1 vital location (Source's lair, randomized depth 4+ tiers). 10 vital total. Minor locations: single-tier, persistent on map, revisitable by expedition if too hard for MW alone. All drawn from randomized pools. |
| B5b | Three-tier vital locations | 2026-02-12 | Tier 1 (Approach) = MW scouts, sees defenders/rewards, one day. Tier 2 (Chamber) = expedition pushes in, new defenders, better reward, second day. Tier 3 (Heart) = essential Source clue + best reward, third day. Failed push doesn't destroy location — retreat and return later. Multi-trip strategic campaigns. |
| B5c | Map fragments vs Source clues | 2026-02-12 | Map fragments reveal WHERE vital locations are (assembled by MW, not scholar work). Source clues found in the Heart reveal WHAT you need to know about the enemy (require scholar interpretation, cross-referencing). Two separate knowledge types. |
| B5d | Expedition duration: multi-day | 2026-02-12 | Vital locations = 3+ days plus travel. Ring 3 location might take 5-7 days total. Significant manpower pull (MW + soldiers + priest + optional engineer/worker = 15-25% of population gone). Minor locations resolved during MW daily action. |
| B5e | Ring 4 Source lair: single deep vital location | 2026-02-12 | One vital location in Ring 4 with randomized depth (4+ tiers). Player doesn't know how deep until inside. Source waits at the bottom. Everything above is the gauntlet. Ring 4 still has minor locations for MW exploration. |
| B5f | Minor locations: persistent and revisitable | 2026-02-12 | Minor locations persist on the map after MW discovery. If too dangerous for MW alone, expedition team can return later. Appear in MW exploration view as named places. Double duty: discoveries during scouting AND potential expedition targets. |
| B6a | Source fight: 3-phase knowledge-lock | 2026-02-12 | Phase 1 (Shell) = Ring 4 nature prep test. Phase 2 (Echo) = Ring 1-3 thoroughness test. Phase 3 (Core) = deep comprehension test. Multi-day assault, not a single check. Missing clues = harder, not impossible. |
| B6b | Source clues: 9 guaranteed + 3 bonus | 2026-02-12 | 9 guaranteed clues from vital location Hearts (Rings 1-3). 3 bonus clues found through Ring 4 MW exploration (not guaranteed). Max 12 total. More clues = decoded weaknesses = easier phases. Creates final strategic tension: search Ring 4 or commit to assault. |
| B6c | Assault commitment as final fork | 2026-02-12 | Launching assault commits the team to a multi-day push through the Source's lair (4+ tiers, randomized depth). Monastery must hold four-layer perimeter without assault team. Team composition is a resource allocation fork — who goes, who stays. |
| UI1 | Perimeter display: overall score + hover detail | 2026-02-12 | Single aggregate perimeter percentage always visible. Per-nature breakdown (each stacking layer's individual percentage) available on hover/drill-in. Keeps top bar clean, detail accessible. |
| UI2 | MW Exploration view: locations by ring with engagement state | 2026-02-12 | Locations organized by ring, split vital vs minor. Each shows engagement state: unscouted (unknown), scouted (creatures/difficulty/rewards visible), cleared (loot recovered, clues obtained), in-progress. Vital location tiers tracked individually (Approach/Chamber/Heart). |
| UI3 | Collapsible sections as general UI convention | 2026-02-12 | Caret/arrow toggle to collapse any section. Collapsed shows one-line summary. Used everywhere: rings in exploration, completed research, role groups in People, etc. Essential for managing late-game information density. |
| UI4 | Mid-screen event presentation tier | 2026-02-12 | Middle tier between feed entries and mythic interruptions. Center-screen, programmatic sprite-style imagery (not GIFs), possibly with sound. For notable moments: new nature reveal, veteran milestone, perimeter breach, vital location Heart cleared. |
| UI5 | Source Attention confirmation dialogs | 2026-02-12 | Every Source Attention action gets a confirmation modal: what it does, exact penalty, confirm/cancel. No hidden costs. Consistent pattern across all triggering actions. |
| UI6 | Power Management view: spreadsheet-like roster management | 2026-02-12 | Advanced mode in People tab. Sortable columns, filterable by any attribute, multi-select, bulk assignment. Keyboard-driven (arrow nav, toggle select, enter to assign). Terminal-like feel for power users managing 20-30+ people. |
| UI7 | Knowledge pipeline: split research streams | 2026-02-12 | Research tab shows separate streams: map fragment assembly, Source clue interpretation, mist nature research, priest training status, forecasts. Not a single flat queue. |
| UI8 | Next-ring foreshadowing in warning system | 2026-02-12 | Ambient hints about next ring's nature before player pushes in (MW perceives color shifts, strange behavior at boundary). Mechanic undesigned but UI must surface it. Part of the warning system. |
| UI9 | Carry-forward from prototype | 2026-02-12 | Proven patterns preserved: MW-relevant info in MW view, feed entries link to relevant context, keyboard navigation feel. New systems extend the interface, don't rework what works. |
| CLK1 | Clock speed: fast for playtest | 2026-02-12 | Discoveries frequent, player experiences every system in one run. Tune slower after testing. Clock speed, day-counts, escalation curves all exposed as config values — playtest-tunable, not hardcoded. |
| SAV1 | Save system: save-and-quit, single slot | 2026-02-12 | One save file per run. Game exits on save. No save-scumming in normal play. Testing mode allows multiple saves for iteration. |
| MW1 | MW progression: endurance + combat + random effects | 2026-02-12 | Endurance increases (stay out longer, push further). Combat stats improve (offense + defense). Random effects from lived experience (nature-specific capabilities from surviving encounters). No specialization tree — identity emerges from what happened. |
| ESS1 | Legacy/Essence system | 2026-02-12 | Body recovery preserves essence. Two paths (fork): Resurrection (character returns changed, draws Source Attention) or Repurpose (binding to living character, offering to facility/perimeter, crafting component, memory imprint for undecoded observations). Body recovery during expeditions is itself a decision — slower/riskier return vs. essence lost forever. |
| SCH1 | Scholar mechanics: pass/fail, collaboration, no misinterpret | 2026-02-12 | Scholars pass or fail, never misinterpret. Multiple scholars can collaborate (compresses timeline). Pacing numbers are config values, playtest-tunable. Player never second-guesses scholar output — if they say it, it's true. |
| PER1 | Perimeter mechanic: gap-based risk from prototype | 2026-02-12 | Carries forward from prototype. Each priest contributes stability based on stats. Gap below 100% = proportional risk (food spoilage, injuries, mist exposure). With stacking natures, priests must counter each active layer to contribute fully. Untrained priests only partially cover. Watchtowers protect priests. Exact numbers playtest-tunable. |
| UI10 | Tab structure: 7 tabs matching prototype 0.40a | 2026-02-12 | Dashboard, Units (with Power Management), Mistwalker (exploration + expeditions), Scholar (knowledge streams), Engineer (construction + underground), Artifacts (items/relics/clue tracker), Alchemy (crafting/recipes/materials). Keeps proven prototype structure. New systems mapped onto existing tabs. |
| UI11 | Skinning rule: visual layer must be separable | 2026-02-12 | Hard architectural requirement. No hardcoded colors/fonts/spacing in game logic. All visual presentation is a theme layer. Swapping themes never breaks systems. Enables: polish iterations, accessibility themes, reskinning without risk. |
| C7 | Visual design review: Phase C item | 2026-02-12 | Dedicated review once UI skeleton is built. Focus on typography, spacing, font sizes, scan-ability. Consider design agent for recommendations. All changes must be skin-layer only per UI11. |
| C8 | Naming: generic fantasy trope | 2026-02-12 | Handled by design team. Generic fantasy naming that supports Gandalf-style title accumulation. Not a user-facing decision. |
