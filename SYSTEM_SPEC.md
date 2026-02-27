# Mistwalker System Specification (AI-Facing)
This document defines the mechanical structure of the game engine.
It is written for implementation, not for player explanation.
The goal is to formalize entities, systems, and relationships.
---
## 1. Core Design Principle
The game is an information war.
Players do not primarily increase raw stats.
They reduce unknown damage through discovery and mitigation.
All systems feed into:
DISCOVER → PREDICT → COUNTER → APPLY → CONFIRM
---
## 2. Combat Damage Model
### 2.1 Monster Structure
Each monster has:
- `physical_attack` (integer) = **P**
- `essences` (list of trait essences) = **[E1, E2, … En]**
### 2.2 Raw Damage
`raw_damage = P * (1 + n)` where `n = number_of_essences`
Each essence adds parallel damage equal to **P**.
Example:
- `P = 30`
- `essences = [acid, heat]` (n = 2)
- `raw_damage = 30 * 3 = 90`
---
### 2.3 Essence Mitigation
Player defenses apply mitigation per essence:
- `mitigation(Ei) ∈ [0.0, 1.0]`
Effective damage:
`effective_damage = P + Σ(P * (1 - mitigation(Ei)))`
Physical damage is not mitigated by essence counters (unless you later add a separate physical-counter system).
---
### 2.4 Survival Rule
Base defense output = **D**
If:
- `effective_damage <= D` → base survives
Else:
- loss occurs (unit injury/death mechanics apply)
---
## 3. Essence Taxonomy
Two separate systems use the word "essence".
### 3.1 Trait Essence (combat layer)
Defines parallel damage properties.
Examples:
- acid
- heat
- rot
- void
- shock
Used only in combat math and counter logic.
---
### 3.2 Core Essence (resource layer)
Dropped from monsters.
Used for:
- crafting
- upgrades
- research
- wards
- advanced doctrine
These are inventory resources.
They are not automatically equal to trait essences.
Mapping between the two is optional and design-dependent.
---
## 4. Discovery Pipeline
The player cannot counter unknown essences.
Essence knowledge exists in stages:
- unknown
- suspected
- identified
- confirmed
Each stage increases mitigation efficiency and research unlocks.
---
### 4.1 Information Sources
- Mistwalker encounters (explore fights)
- Base combat hints (defense encounters)
- Scholar/librarian research (books)
- Cartographer correlations (region-to-essence likelihood)
- Artifact/item study (properties revealed)
- Essence samples brought back (resource layer)
Each source contributes probability weighting.
Implementation suggestion: confidence score per essence, per monster.
---
## 5. Counter Generation
Counters are tagged against essences:
- `counter.name` (string)
- `counter.targets` (list of essences)
- `counter.mitigation_bonus` (float)
Example:
- name: "alkaline salve"
- targets: [acid]
- mitigation_bonus: 0.30
Counters stack additively per essence.
Caps may exist (design parameter).
---
## 6. Entities
### 6.1 Units Overview
Units (roles):
- Mistwalker
- Priest
- Soldier
- Engineer
- Worker
- Scholar-specialists (implemented as scholar skill tracks / rooms)
Scholars can become specialists via rooms:
- General Librarian (general book-finding + risk)
- Essence Scholar (monster/essence research + compendium)
- Cartographer (map synthesis + prediction + site discovery)
- Artificer (identify/fuse/modify artifacts)
- Herbologist/Alchemist (herbs → consumables/crafting inputs)
You may collapse or expand these.
---
## 7. Mistwalker
### 7.1 Core Facts
- Has Offense and Defense stats (O/D).
- Adds O/D to:
  - base defense if present at base (and not praying)
  - troop offense/defense if in expedition
- Cannot be recalled once sent (default).
- Can return early if injured (via amulet / forced return mechanic).
### 7.2 States
- At base
- Exploring (multi-day run; loot table improves each day)
- Scouting incoming threats (1-day action)
- Expeditioning a location (major/minor site)
### 7.3 Exploration
- Player chooses duration up to `range_days`.
- Loot quality probability increases per day out.
- Mistwalker only reveals results upon return:
  - win/loss indicator per day
  - "found something" indicator per day (artifact/lore/herb/essence/map fragment)
  - exact items revealed only on return
### 7.4 Combat in Exploration
- If it would face an obviously stronger encounter, it retreats and returns (no forced fight).
- If ambushed / forced fight:
  - on loss: escape attempt; injury roll:
    - no injury / injury / grievous injury
  - injury triggers return-to-base
### 7.5 Injuries
- Injury: heals over time; faster with priest healing.
- Grievous injury: will die unless healed by priest.
### 7.6 Scouting Incoming Threat
- Does not fight.
- Reveals:
  - exact arrival day (reduces window uncertainty)
  - approximate size class (regular/small/medium/large)
  - count estimate
  - may reveal 1 hint about essence or type (optional)
- Grants base defense bonus via preparedness:
  - model as `+X% base defense` or `-X% enemy effective_damage`
### 7.7 Rescue Action (Base Event)
- Mist intrusion can cause units to become "lost in the mist".
- Mistwalker can be sent to rescue (time-sensitive).
- Successful rescue prevents permanent loss.
### 7.8 Mist Prayer Mode
- Mistwalker can function as a priest:
  - contributes spirit to perimeter/mist-threshold
- Tradeoff:
  - if praying, it cannot contribute combat defense/offense
---
## 8. Priests
### 8.1 Core Jobs (mutually exclusive time allocation)
Priests can do:
1) **Pray / Maintain Perimeter**
- reduces "gap"
- prevents mist events and death spiral
- primary survival layer
2) **Ward**
- place wards on structures or assets
- wards may require essence resources or learned rites
3) **Combat Auras / Battle Rites**
- offensive/defensive buffs in combat
- only active if priest leaves prayer duty
- increases mitigation or increases D during fights
4) **Healing / Infirmary**
- heals injuries faster
- required to heal grievous injuries (or unit dies)
- pulling priest off prayer increases gap risk
5) **Resurrection / Essence Extraction**
- on unit death: choice:
  - resurrect (if allowed by rules)
  - leave dead
  - extract human essence for warding (special resource)
### 8.2 Bubble / Shield System (Expeditions)
- Troop entering mist must have a priest.
- Priest creates a bubble sized by spirit:
  - `bubble_slots = spirit_score` (or other mapping)
- Priest counts as 1 slot.
- Other units consume slots.
- Mistwalker does not consume a slot (can enter/exit bubble).
If priest dies on expedition:
- bubble collapses
- remaining units suffer daily death roll while returning:
  - e.g. 20% chance/day/unit (tunable)
- Mistwalker stays to escort unless injured (injury triggers teleport-back, leaving others)
### 8.3 Priest Towers
Built by soldiers/engineers.
Effects:
- keeps priests safer from mist-snatch events
- upgraded tiers also reduce priest casualty risk during battles (tunable)
---
## 9. Engineers
### 9.1 Core Jobs
- Build structures:
  - walls
  - traps (consumable, replaced after fights)
  - defensive siege equipment (manned during fights)
  - priest towers
- Repair walls after fights.
- Salvage metal at cleared sites (but workers carry it).
### 9.2 Resource Use
Structures cost:
- wood
- stone
- metal (higher tiers)
Optional:
- essence resources as construction blockers or enhancement reagents
### 9.3 Combat Participation
- Engineers typically do not fight directly.
- They can man siege equipment during attacks.
- If battle is lost, they can die/injure like others present.
---
## 10. Soldiers
### 10.1 Role
- Primary contributors to base defense output **D**.
- Also form expedition troops to clear sites.
### 10.2 Doctrines / Martial Responses
Soldiers can learn doctrines (from books/lore) that target essences.
Examples:
- "Spear Distance Drill" → improves mitigation vs acid
- "Heat Shield Formation" → reduces heat essence damage
Mechanically:
- doctrines add mitigation bonuses or alter stacking caps.
### 10.3 Veteran Progression
Optional but desired:
- soldiers gain veteran status from surviving fights
- veterans unlock qualitative benefits:
  - better essence identification in battle
  - doctrine mastery bonuses
  - survivability improvements
Keep quantitative scaling linear.
---
## 11. Workers
### 11.1 Jobs
- Chop wood
- Quarry stone
- Farm food
- Carry salvaged metal from cleared sites (on expeditions)
Optional later:
- farm herbs (once herb system enabled)
Workers do not contribute to defense unless assigned to special duty (if you add that).
---
## 12. Scholars and Specialization
### 12.1 High-Level Rule
Scholars are the research engine.
They process incoming "researchable objects" and/or search the library.
Important constraint:
- once a specialization is active, it consumes that category's inflow,
  preventing "training in parallel" on the same inflow.
### 12.2 Inputs Scholars Can Process
- books/tomes (general research)
- artifacts/items (identification, rarity preservation, fusion)
- essences (classification, compendium)
- cartographic data (map synthesis)
- herbs (identification, recipes)
- map fragments (site unlocking, region correlation)
### 12.3 General Librarian (Mini-game)
- performs broad searches for books
- presents multiple book titles; player chooses which to read
- risk: some texts can cause madness/injury/death (optional but desired)
- outputs:
  - unit upgrades
  - doctrine unlocks
  - recipe unlocks
  - essence hints
  - cartography methods
  - rare "strategy-changing" finds
### 12.4 Essence Scholar (Monster Research)
- builds monster compendium (unlocked by assigning scholar to essence track)
- compendium records:
  - known monsters
  - observed attack/defense
  - suspected essences (confidence)
  - confirmed essences
  - mitigation progress (% handled by current counters)
### 12.5 Artificer (Items)
Two key design options:
Option A: early identification can "ruin" rarity if done by low-tier scholar.
Option B: items remain "latent" until a skilled artificer identifies them.
Artificer abilities:
- identify items
- preserve rarity
- fuse items (creates new qualitative interactions)
- modify items (limited, expensive)
### 12.6 Herbologist / Alchemist
- identifies herbs
- unlocks recipes: salves, poultices, potions
- recipes can target essences or provide utility (heals, buffs, research speed)
### 12.7 Cartographer
Cartographer assembles data coming back from Mistwalker runs.
Core outputs:
- increases early warning range (days until attack known)
- correlates regions → essence likelihood
- unlocks and predicts locations/sites
- provides probability narrowing for incoming wave essences
Advanced concept:
- identifies "source"/breeding-ground sites for waves
- if military clears the site, that wave ends
Optional Hail Mary:
- Cartographer can "go personally" (high chance of death) to guarantee a source location.
---
## 13. Base Systems
### 13.1 Gap / Mist Coverage
Coverage from praying priests (and praying mistwalkers).
If coverage falls, "mist events" occur.
Definitions:
- `coverage` in %
- `gap = 100% - coverage`
Daily mist event chance:
- scales with gap (tunable)
- below a safe threshold, a death spiral naturally emerges.
Mist events can cause:
- injury
- grievous injury
- madness
- lost in mist
- death (rare early, common late)
If all priests die:
- game loss (mist overwhelms base)
Mistwalker death does not instantly end game, but is effectively fatal long-term.
---
## 14. Sites and Expeditions
### 14.1 Site Types
- Minor site: single fight, quick loot
- Major site: multiple fights / stages, deeper loot, metal salvage
### 14.2 Unlocking Sites
Unlocked via cartography synthesis and/or map fragments.
Mistwalker finds "map fragments" (or returns cartographic notes).
Cartographer converts accumulated notes into site leads.
### 14.3 Expedition Requirements
- Typically requires priest bubble.
- May optionally benefit from:
  - engineer (walls/siege access, salvage efficiency)
  - scholar (library salvage or lore extraction)
  - workers (carry metal)
Not all sites require these roles.
---
## 15. UI Support Requirements (Activity Checklist)
This is a non-visual list of actions the UI must support.
### 15.1 Global
- Advance day
- Show resources: food/wood/stone/metal/population
- Show day number and next-attack timer
- Show base defense D and coverage/gap
### 15.2 People / Units Tab
- roster list
- role assignment / training on arrival
- infirmary list (auto surfaced when non-empty)
- per-unit:
  - role
  - stats (body/mind/spirit; plus O/D as relevant)
  - current assignment
  - injury state
### 15.3 Mistwalker Tab
- choose action: scout / explore / expedition / rescue
- configure explore duration
- show "out in field" status and days remaining
- show daily feed of outcomes (win/loss/found-something)
- loot reveal screen on return
### 15.4 Priest / Perimeter Tab
- assign priests to pray vs heal vs ward vs battle rites
- show coverage/gap
- build/upgrade priest towers (engineer/soldier interface hook)
- ward placement interface
### 15.5 Scholar / Library Tab
- assign scholars to tracks/rooms
- per-track backlog queues
- general librarian "book selection" mini-game UI
- essence compendium UI:
  - monsters list
  - confidence bars
  - confirmed essences
  - mitigation status per essence
### 15.6 Engineer Tab
- build structures
- repair structures
- trap inventory / replacement
- siege equipment build + manning assignment
### 15.7 Soldier Tab
- squad composition (for expeditions)
- doctrine list + assignment
- veteran progression display
- base defense contribution overview
### 15.8 Sites Tab
- discovered sites list
- requirements and expected threats (if known)
- launch expedition
---
## 16. Open Vagaries (Explicit Unknowns)
These should be tracked as TODO decisions.
- exact essence list and count limits per game
- whether monster drops (resource essence) map directly to trait essences
- how hints translate into confidence / identification
- exact mitigation stacking and caps
- exact structure/ward system (what wards exist, how acquired, where applied)
- whether "source sites" end waves universally or only sometimes
- soldier leveling: how much is numeric vs qualitative
- scholar death/madness system: severity, recovery, triggers
- how many units exist and whether population hard-caps near ~30
- immigration cadence (mistwalker finds vs door arrivals)
---
## 17. Session Decisions (Clarifications to Spec)
These decisions were made during implementation sessions and override or clarify the original spec above.

### 17.1 Traits Are a Broad Category
The spec's "essences" and the existing "traits" are unified under the term **traits**.
Traits include both mechanical behaviors (burrowing, armored, flying) AND elemental damage types (acid, heat, rot, void, shock).
Different roles/specialists counter different trait categories:
- Soldiers counter mechanical/behavioral traits via doctrines
- Herbologist/alchemist counters elemental traits via salves/potions
- Some counters are collaborative (herbologist brews, soldiers apply)
The existing 19 mechanical traits stay and expand to include elemental types.

### 17.2 Attack/Defense = Body Stat (For Now)
The spec's "O/D" for the Mistwalker is NOT a separate stat pair.
Both offense and defense derive from the **Body** stat for MW and soldiers.
- MW at home: Body contributes to monastery defense
- MW attacking in mist: Body is offense
- MW surprised/ambushed: Body is defense
- Soldiers on garrison: Body × multiplier = defense contribution
Items, modifiers, and other game elements may adjust these values later.

### 17.3 Combat Outcomes Stay Tiered
The spec's `effective_damage <= D → survives` describes the survival threshold concept, NOT a binary outcome.
The current tiered system (decisive victory, victory, narrow victory, defeat, catastrophic) is correct and stays.
The damage formula feeds INTO the tiered comparison, not a binary pass/fail.

### 17.4 Leveling Placeholder
When characters level up, all stats increase by +1. This is a placeholder.
XP thresholds, progression tiers (novice → veteran → elevated), and how progression gates scholar discoveries are DEFERRED to a future session.

### 17.5 Scholar Specializations
Six roles remain (Priest, Soldier, Engineer, Worker, Scholar, Mistwalker). NO Alchemist or Mystic as standalone roles.
Scholar specializations are TRACKS, not roles:
- General Librarian (book discovery + class upgrades)
- Essence Scholar (monster/essence research + compendium)
- Cartographer (map synthesis + prediction + site discovery)
- Artificer (artifact identification/fusion/modification)
- Herbologist (herb identification + recipes + salves/potions)
The herbologist/alchemist is one track — the person who manages herbs.

### 17.6 Disabled Systems (Temporary)
These systems exist in code but are currently hidden from UI:
- Underground/digging (disabled v0.04j)
- Mist Currents / ring system (disabled v0.04k, always ring 1 internally)
- Archivist promotion (disabled v0.04l, replaced by open library access)

### 17.7 Unified Engineer Assignment (v0.05r)
The legacy 'trapping' assignment was removed. Engineers on 'building' handle ALL engineer work:
- Structure construction (towers, walls)
- Trap production (consumes wood, builds traps)
- Repairs
Clicking Build on traps auto-assigns an available engineer to 'building' if none already assigned.
Cancel on traps does NOT unassign the engineer (they stay on 'building' for other work).

### 17.8 Tab Names (current implementation)
The spec's tab names (Units, Mistwalker, Scholar, Engineer, Artifacts, Alchemy) were simplified:
- Dashboard, People, Explore, Scholar, Engineer, Items, Compendium (7 tabs)
- Scholar tab contains both Scriptorium (clue research) and Library (book study) as sub-tabs

### 17.9 Trait Count (current implementation)
21 traits across 3 categories (physical, elemental, supernatural) instead of the spec's original "essences" concept. Each creature type gets 4 traits from the pool; raids use 2/3/4 traits based on small/medium/large size.
