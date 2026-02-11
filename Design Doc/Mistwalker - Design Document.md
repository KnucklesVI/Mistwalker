# Mistwalker

## Game Design Document — Alpha 0.38

A single-file browser-based survival management game where you guide a monastery through an apocalypse of mist, managing people, building infrastructure around discoveries, and pushing deeper into the unknown while balancing growth against the attention it draws.

---

## Core Concept

You are the organizing intelligence of a monastery — the last bastion of humanity in a world consumed by supernatural mist. You make decisions about where attention goes: who to train, what to research, where to explore, and how to turn discoveries into sustainable capability.

**The core loop:** Explore → Discover → Research → Build → Survive

**The core tension:** Growth requires exploration. Exploration reveals threats. Threats require capability. Capability requires growth. And all of it draws the attention of something in the mist.

**The feel:** You assign people, launch expeditions, and design systems. Once built, systems produce output automatically. Your attention stays on the frontier — new discoveries, incoming threats, opportunities for optimization.

---

## Setting

The mist came. No one knows exactly when or why — only that it rolled in and never left. Most of humanity fell. Cities went silent. The world beyond the fog exists only in memory and rumor.

Your monastery survived. Protected by the prayers of the faithful, surrounded by farms that feed you, ringed by priests who hold back the fog through constant vigil. You are what remains.

Somewhere below, in caves that wind beneath the earth, lies the source. If it could be found and reached, perhaps the fog would recede. Perhaps humanity could rebuild.

But first, you must survive.

---

## Geography

**The Monastery (Center)** — Where knowledge lives, training happens, and people recover. Safe from the mist, always.

**The Perimeter (Boundary)** — The edge of safety. Priests stationed at intervals hold the mist at bay through prayer and endurance. Gaps in the perimeter mean lost people, spoiled food, and worse.

**The Mist (Beyond)** — Everything outside the perimeter. Dangerous, disorienting, spiritually corrosive. Three depth tiers of increasing danger stretch outward.

**The Depths (Below)** — Cave systems beneath the monastery. Diggable, yielding discoveries. Somewhere down there lies the path to the source.

### The Mist Rings

The mist is organized into three concentric rings of increasing danger:

**The Shallows** (Range 1+) — The near mist. Encounter chance: 10%. Accessible to any Mistwalker. Relatively safe for scouting and early exploration.

**The Grey Reach** (Range 4+) — Deeper fog where corrupted creatures lurk. Encounter chance: 20%. Requires an experienced Mistwalker to navigate.

**The Deep** (Range 7+) — The furthest reaches where spiritual entities dwell. Encounter chance: 30%. Only the most capable Mistwalkers survive here. Pushing into the Deep unlocks the most dangerous — and most rewarding — content.

---

## Time and Flow

Time advances day by day. Each day, multiple systems process simultaneously: food production and consumption, perimeter maintenance, training progress, expedition movement, research advancement, construction, digging, threat approach, and random events.

Messages arrive in a feed as things happen. You read them, make decisions, move on. The game never asks you to re-decide things you've already decided.

---

## People

People are your only truly finite resource. Everyone has a name. Everyone matters. You start with 20 people distributed across roles.

### Traits

Every person has three innate traits rated 1–3:

**Spirit** — Affects priest effectiveness, Mistwalker range, and aptitude for spiritual roles. Priests need Spirit 3. Mistwalkers need Spirit 3.

**Body** — Affects fighter attack power, physical resilience, and Mistwalker washout chance. Fighters need Body 2. Engineers need Body 2.

**Mind** — Affects research speed, build speed, and scholarly aptitude. Scholars need Mind 3. Engineers need Mind 2.

### Experience

People gain experience through work. Experience provides an endurance bonus (floor of exp/5) that scales their role-specific stats over time. A veteran priest holds the perimeter far better than a fresh one.

### Status

People can be: active (working), injured (recovering), lost (in the mist, dying without rescue), on expedition, in training, or dead. Injured people recover at 1 day per day untended, or 2 days per day when a priest tends them. Lost people die after 10 days if not rescued by a Mistwalker.

### Population Growth

New survivors can arrive every 10 days — 50% base chance, rising to 65% after a death. They arrive with random traits and as unassigned workers, ready to be trained.

---

## Roles

### Worker
The foundation of the monastery. No trait requirements, 7 days to train. Workers farm food, chop wood, and assist engineers with digging. Their yield scales with Mind and experience.

### Fighter
The monastery's physical defenders. Requires Body 2, 10 days to train. Fighters garrison the walls and escort expeditions. They excel against physical creatures (1.5x) but struggle against spiritual ones (0.25x). Attack power scales with Body and experience.

### Priest
Keepers of the perimeter. Requires Spirit 3, 14 days to train. Priests hold back the mist through prayer and endurance, tend the injured (one priest can tend up to 5 people at double healing rate), and escort expeditions with protective shields. They excel against spiritual creatures (1.5x) but are weak against physical ones (0.5x). Their shield capacity and endurance scale with Spirit and experience.

### Scholar
Seekers of knowledge. Requires Mind 3, 10 days to train. Scholars research discoveries, decipher clues to reveal locations, and craft compounds from creature carcasses. Research speed scales with Mind and experience.

### Engineer
Builders and diggers. Requires Body 2 and Mind 2, 14 days to train. Engineers construct buildings, excavate dig levels, produce traps from wood and compounds, and run salvage operations. Build speed and dig speed scale with Mind and experience.

### Mistwalker
Elite mist navigators. Requires Spirit 3 plus completed Fighter and Priest training, 20 days to train. Candidates may wash out — Body 3 guarantees success, Body 2 gives roughly 50/50 odds. Two failures means permanent disqualification. Mistwalkers explore the mist solo, lead escort expeditions, scout approaching threats, and rescue lost people. They excel against spiritual (1.5x) and corrupted (1.25x) creatures. Their range determines which mist depth they can reach. **Once someone becomes a Mistwalker, they can never switch to another role.**

### Mystic
Spiritual warriors. Requires Spirit 2 and Body 2 plus completed Fighter and Priest training, 14 days to train. Mystics garrison the walls and provide a team-wide boost against spiritual creatures — when a Mystic is active in the garrison, spiritual defense uses a minimum 1.5x multiplier for the whole team.

### Alchemist
Herb brewers and experimenters. Requires Spirit 2 and Mind 2, 12 days to train. Alchemists brew consumables from cultivated herbs and experiment to discover new recipes. Brew speed scales with Spirit and experience.

### Role Switching

People who have completed training in multiple roles can switch between them instantly — except Mistwalkers, who are permanently locked into their role. Training buttons only show roles a person hasn't yet completed; completed roles appear as switch options instead.

---

## Assignments

Each role has a default assignment and access to role-specific tasks:

**Garrison** — Fighters and Mystics defend against threats. Defense contribution based on stats.

**Farms** — Workers produce food. Yield based on worker stats and count.

**Perimeter** — Priests maintain the barrier. Stability based on priest endurance.

**Researching** — Scholars study discoveries. Progress based on research speed.

**Deciphering** — Scholars decode clues to reveal locations and the path to the source.

**Crafting** — Scholars convert carcasses into compounds (1 per day).

**Building** — Engineers construct buildable structures.

**Digging** — Engineers (required) plus workers excavate underground levels.

**Trapping** — Engineers produce traps from wood and compounds (1 per day).

**Chopping** — Workers produce wood for construction and traps.

**Herb Garden** — Workers cultivate known herbs, producing a random herb every 2 days.

**Brewing** — Alchemists brew known recipes into consumables using herbs.

**Experimenting** — Alchemists attempt to discover new recipes.

**Tending** — Priests automatically assigned to heal injured people (2x recovery rate, up to 5 patients per priest).

**Scouting** — Mistwalkers scout approaching threats to reveal exact arrival timing (1 day).

**Rescuing** — Mistwalkers rescue lost people from the mist (1 day).

---

## Resources

**Food** — Consumed daily by every living person. Produced by workers on farms. Running out ends the game. Food can spoil when the perimeter has gaps.

**Wood** — Produced by workers chopping. Used to build structures and produce traps.

**Metal** — Obtained from salvage runs on explored locations. Used to build structures.

**Carcasses** — Dropped by defeated creatures. Converted to compounds by scholars.

**Compounds** — Crafted from carcasses by scholars. Used to produce traps. Carried on expeditions for a 1.5x defense boost against corrupted creatures.

**Traps** — Produced by engineers from wood and compounds. Consume incoming enemy attacks during combat.

**Herbs** — Cultivated by workers on herb gardens after unlocking herb knowledge. Used by alchemists to brew consumables.

**Consumables** — Brewed by alchemists from herbs using known recipes. Single-use benefits.

---

## The Discovery System

Everything interesting begins with discovery. Discoveries come from expeditions, mist exploration, dig levels, and research.

### Discovery Types

**Buildable** — Unlocks a constructable structure. Must be researched before building. 7 buildable discoveries exist per game.

**Weakness** — Reveals a creature's vulnerability, granting bonus combat damage against that type.

**Detection** — Increases your ability to detect creatures at range.

**Buff** — Provides passive bonuses to monastery operations.

**Stat Boost** — Permanent stat increase assignable to a person.

**Training Shortcut** — Reduces training time for a specific role by 2 days.

**Event Modifier** — Alters the probability of certain events occurring.

**One-Time Effect** — Creates a single-use consumable with a powerful effect.

**Herb Unlock** — Reveals a new cultivatable herb species.

**Recipe Unlock** — Reveals a new alchemical recipe for brewing.

### Research

Scholars study discoveries over time (study days vary by complexity). When research completes, the discovery's full potential is unlocked — buildable structures become available, weaknesses can be exploited, and lore effects activate.

---

## Locations

The world contains 10 procedurally generated locations across four tiers:

**Tier 1** (3 locations, distance 1–3) — Near the monastery. Low risk, basic rewards.

**Tier 2** (3 locations, distance 4–6) — Deeper into the mist. Moderate risk, better discoveries.

**Tier 3** (3 locations, distance 7–9) — The far reaches. High risk, powerful artifacts and knowledge.

**Tier 4** (1 location, distance 9) — The Source of the Mist. The endgame objective.

### Revealing Locations

Locations start hidden. To reveal one, scholars must decipher 3 location-specific clues. Clues are found during mist exploration, expeditions, and digging. Deciphering time scales with depth: 1 day for shallow clues, 2 for grey reach, 3 for deep.

36 total clues exist: 27 tied to specific locations (3 each) and 9 "final" clues (3 per tier). Deciphering all 9 final clues reveals "The Path to the Source" — the key to the endgame.

Locations can also be revealed through lucky finds during mist exploration.

---

## Expeditions

Expeditions are how you interact with the mist directly. They're the primary source of discovery and the primary source of risk.

### Solo Expeditions

A Mistwalker ventures alone to a revealed location within their range. If the location's creatures outmatch them, they scout it (marking it as scouted with intel on what's there) and return safely. If they can handle it, they explore it fully and bring back everything — discoveries, artifacts, carcasses, clues.

### Escort Expeditions

A Mistwalker leads a team: a priest (required for the protective bubble), plus fighters. The priest's shield capacity (based on endurance) limits how many fighters can join. The team carries compounds for combat advantage.

**Bubble failure** is a real risk on long trips. The chance scales with trip duration against priest endurance — a 20-day journey with a low-endurance priest has a 90% failure chance. Failure means the priest and Mistwalker survive but escort members may die.

### Travel Encounters

Each day in transit, there's roughly a 10% chance of encountering creatures along the way, separate from the location's own dangers.

### Expedition Recall

A second Mistwalker can recall an active expedition, doubling their return speed. Unused compounds are returned to the monastery.

---

## Mist Exploration

Separate from location-based expeditions, Mistwalkers can explore the mist itself. They venture into a chosen depth ring for a number of days equal to their range, with encounter chances each day based on the ring.

Rewards include food, survivors, creature weaknesses, artifacts, location reveals, and clues. Pushing into deeper rings unlocks harder creature types in the threat pool — entering the Grey Reach introduces corrupted creatures, and entering the Deep adds spiritual ones.

---

## Threats and Combat

### Attention

An invisible stat that rises as you expand, explore, and grow. When attention crosses the threshold, threats begin spawning every 8 days (up to 2 simultaneous).

### Threat Approach

Threats appear as warnings with an estimated arrival window. Mistwalkers can scout them to reveal exact timing (takes 1 day). When a threat arrives, combat resolves automatically based on your garrison strength.

### Creatures

8–11 creatures are generated per game across three categories:

**Physical** (Tier 1) — Straightforward combatants. Fighters excel against them (1.5x). Attack 2–5, defense 1–2.

**Corrupted** (Tier 2) — Tainted by the mist. Compounds provide a 1.5x defense boost. Mistwalkers are effective (1.25x). Attack 4–7, defense 1–3.

**Spiritual** (Tier 3) — Otherworldly entities. Priests and Mistwalkers excel (1.5x). Mystics boost the whole garrison's spiritual defense. Attack 3–6, defense 0–2.

### Combat Resolution

Defense is calculated from garrison members, global buffs from buildings, trap mitigation, compound boosts, and Mystic effects — all scaled by perimeter stability. A gap in the perimeter means weaker defense.

Outcomes range from decisive victory (no casualties, carcasses gained) through marginal wins (some injuries and deaths) to defeat (guaranteed casualties). Known weaknesses grant bonus damage.

---

## Digging

Engineers (with optional worker assistants) excavate underground levels beneath the monastery. Each level requires labor days to clear and yields exactly one discovery. The first dig always yields detection knowledge.

4 levels are generated initially, but new levels auto-generate as you clear them — you can dig indefinitely. Clearing levels also increases your detection range.

---

## Building

7 buildable structures exist per game, each unlocked by researching a specific discovery. Buildings require wood and metal, plus an engineer to construct. Each provides a permanent global effect:

**Defense** — Adds to garrison strength (e.g., Watchtower of Iron, Palisade of Stone).

**Food** — Adds to food production (e.g., Granary of Plenty, Irrigation of Harvest).

**Perimeter** — Adds to perimeter stability (e.g., Ward Stone of Grace, Prayer Sanctum of Warding).

**Research** — Adds to research speed (e.g., Library of Insight, Observatory of the Ancients).

**Range** — Adds to Mistwalker exploration range (e.g., Beacon of Far Sight, Signal Tower of the Horizon).

Building names are procedurally generated from base structures and modifiers that match their effect type.

---

## Artifacts and Equipment

11–16 artifacts are generated per game with procedural names, effects, and rarity levels:

**Common** (most frequent) — Modest stat bonuses.

**Uncommon** (~30%) — Notable improvements.

**Rare** (~15%) — Significant power.

**Legendary** (<6%) — Game-changing equipment.

Artifacts are found during expeditions and mist exploration. Each has role restrictions — a research artifact can only be equipped by a scholar, combat artifacts by fighters or Mistwalkers. Effects include attack, defense, endurance, research speed, mist endurance, and shield bonuses. When someone dies in combat at home, their artifacts are recovered; lost to the mist, they're gone forever.

---

## The Herb and Alchemy System

When herb unlock discoveries are researched, workers can be assigned to herb gardens, cultivating a random known herb every 2 days. Alchemists with known recipes can brew herbs into consumables, or experiment to discover new recipes. This creates a production chain: discovery → herb cultivation → recipe knowledge → consumable brewing.

---

## Progression

### Early Game: Survival (Days 1–30)

Focus on keeping the perimeter staffed, food production stable, and not losing anyone. Train your first Mistwalker. Send short reconnaissance into the shallows. Start digging. Learn about your immediate threats.

### Mid Game: Expansion (Days 30–80)

Push into the Grey Reach. Decipher clues to reveal locations. Launch expeditions. Build your first structures. Train specialists. Manage the growing attention your success attracts. Creatures get harder. Resources get more complex with compounds, traps, and herbs.

### Late Game: The Source (Days 80+)

Push into the Deep. Decipher the final clues. Unlock the path to the source. Build a team capable of reaching Tier 4. Balance escalating surface threats against the need to commit your best people to the expedition below.

### Endgame

Reach the Source of the Mist. What happens there depends on what you've built, who you've trained, and what you've learned.

---

## Losing

**Starvation** — If food drops below daily consumption, the game ends.

**Total loss** — If everyone dies, the game ends.

**Attrition** — The perimeter can collapse into a cascade: gaps cause lost people and spoiled food, which weakens defense, which causes more gaps.

---

## Interface

### Tabs

**Dashboard** — Overview of resources, population, active threats, and key stats.

**People** — Full roster with current assignments. Training, role switching, equipment, and assignment management per person.

**Expeditions** — Launch and monitor expeditions. Mist exploration. Recall active teams.

**Research** — Active research progress. Discovery list. Clue deciphering.

**Engineering** — Building construction. Dig progress. Salvage runs.

**Feed** — Chronological message log of everything happening.

### Messages

Events arrive categorized by type: status, warning, combat, research, building, dig, discovery, threat, perimeter, expedition, training, injury, death. The feed is the heartbeat of the game — it tells you what's happening and what needs your attention.

---

## Technical Notes

Single HTML file, no dependencies. All state managed in a single JavaScript object. Procedural content generation at game start: locations, creatures, discoveries, artifacts, buildables, clues, and dig levels. Day processing runs all systems sequentially. 680 automated tests cover all mechanics. Hosted on GitHub Pages for instant browser access.

---

## What Changed from the Original Vision

The original design document ("The Last Light") imagined a more free-form, systems-building game with a message-feed-driven interface and heavy emphasis on systematization of discoveries. The game that emerged — Mistwalker — kept the core tension and setting but developed into something more structured:

**Kept:** The monastery setting, mist as the central threat, the discover-research-build loop, named people who matter, the perimeter system, expeditions into danger, the source as endgame objective, the feeling that growth draws attention.

**Evolved:** Discrete day advancement instead of continuous time. Eight specialized roles instead of four broad ones. A clue-based location revelation system. Three-ring mist depth with gated creature categories. A compound/trap production chain. Procedural generation of all content — names, locations, creatures, equipment, discoveries, buildings. Artifact equipment with rarity tiers. An herb and alchemy system. Underground digging as a parallel progression track.

**Deferred:** Detailed expedition event trees with in-field decisions. Other monasteries and diplomacy. Magic/ritual system. Save/load. Seed-based determinism. The "specialists emerge from work" concept (replaced by formal role training).

The game found its own identity somewhere between the original vision of a systems-design sandbox and a more traditional survival management game. The mist remains mysterious. Names still matter. Discovery still feels like wonder. And the tension between growth and attention still drives every decision.

---

*Alpha 0.38 — February 2026*
