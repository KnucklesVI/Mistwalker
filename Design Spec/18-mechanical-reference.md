# Mechanical Reference

This document contains the concrete numbers, formulas, and scaling models for all game systems. These are the values the code builds from. All values are config-driven and playtest-tunable, but these are the starting numbers.

---

## Scaling Model Framework

Every numeric relationship in the game uses one of four curve types, controlled by a curve intensity parameter:

**Linear** — each additional unit adds the same amount. Predictable, easy for the player to reason about.

**Diminishing returns (logarithmic)** — first units matter enormously, each additional one matters less. Prevents stacking from being dominant.

**Exponential (accelerating)** — early units barely matter, late ones matter dramatically. Creates breakthrough moments and mounting pressure.

**Sigmoid (S-curve)** — slow start, rapid middle, plateau. Creates a "sweet spot" where investment pays off most.

### Curve Assignments

| Relationship | Curve Type | Why |
|---|---|---|
| Workers → food/wood/stone | Linear | Predictable, player can plan |
| Stat → role output bonus | Sigmoid | Sweet spot matters, extremes plateau |
| Multiple people on same task | Diminishing | Stacking possible but not dominant |
| Mist escalation within tier | Exponential | Slow burn then crisis |
| MW range growth with XP | Exponential | Breakthrough moments |
| Priest → perimeter contribution | Diminishing | First priests critical, extras marginal |
| Ring depth → finding quality | Linear | Deeper = better, straightforward |
| Scholar count → research speed | Diminishing | Second scholar good, third barely helps |
| Day count → raid frequency | Exponential | Slow then overwhelming |
| Tier → combat difficulty | Exponential | Each ring is dramatically harder |
| Defense contribution per soldier | Linear | More soldiers = proportionally more |
| Raid strength escalation | Gentle exponential | Mounting pressure, no surprise cliffs |
| Casualty severity | Sigmoid | Minimal when winning, spikes at tipping point |

Every relationship is defined in config with three values: base value, curve type, and curve intensity.

---

## 1. Training

**Mechanic:** Player selects an unassigned (or role-switching) character and chooses "Begin Training" for a target role. Character status becomes "training" — they cannot do anything else. When duration completes, they become Novice in that role with a default assignment.

**Durations:**
- Worker: 3 days
- Soldier: 5 days
- Engineer: 7 days
- Scholar: 8 days
- Priest: 10 days
- Mist Walker: 14 days (permanent, irreversible commitment)

**Rules:**
- One training slot per person (no queuing)
- Training can be cancelled; person returns to previous role or unassigned, all time lost
- No partial credit — cancel on day 6 of 7, start over
- Person in training consumes food but produces nothing
- Role switching: anyone can switch roles, resets to Novice in new role, previous progress frozen (not erased). Switching back restores prior tier/specialization. Only MW is permanent and irreversible.

---

## 2. Assignments Per Role

Each role has a default assignment (what they do automatically) and additional assignments the player can choose.

### Priest
- **Perimeter** (default) — holds back the mist, contributes to stability %
- **Tending** — heals injured characters (faster recovery)
- **Nature Training** — studying a counter for a specific mist nature (offline from perimeter while learning)
- **Expedition** — on a mission as bubble/shield provider
- **Available** — idle, ready for assignment

### Soldier
- **Garrison** (default) — defends against raids, contributes to defense rating
- **Expedition** — escorting a team in the field
- **Interior Guard** — protects monastery from underground threats during digs
- **Available**

### Engineer
- **Trapping** (default) — builds traps, consumes 1 wood/day
- **Digging** — excavating underground levels
- **Building** — constructing a facility
- **Expedition** — field engineering (Breacher work)
- **Available**

### Worker
- **Farming** (default) — produces food
- **Chopping** — harvests wood
- **Quarrying** — harvests stone
- **Dig Assist** — helps engineers dig faster
- **Facility Operator** — staffs a facility (storehouse, herbarium, etc.)
- **Available**

### Scholar
- **Researching** (default) — working on clues, lore, relics, nature identification, Source clues
- **Forecasting** — predicting upcoming threats
- **Facility Operator** — staffs alchemical chamber or similar
- **Expedition** — field research
- **Available**

### Mist Walker
- **Exploring** — scouting a ring for clues/fragments/encounters
- **Investigating** — checking out a known location (Tier 1 scout)
- **Scouting Threats** — gathering intel on incoming raids
- **Rescuing** — retrieving someone lost in the mist
- **Leading Expedition** — guiding a full team to a location
- **Available**

### General Statuses (Any Role)
- **Training** — learning a new role
- **Injured** — recovering, cannot work (3-5 days recovery)
- **Gravely Injured** — recovering, longer timer (6-10 days), priest tending critical
- **Lost** — taken by the mist, MW must rescue within X days or they die
- **Dead** — permanent (unless resurrected via essence system)

### Tab Notification Badges
Tabs display a badge/indicator when there is an actionable situation — injured person needing tending, unassigned character, finished training, etc. The player can ignore badges and advance day. That is a valid choice with consequences.

---

## 3. Perimeter Math

**Priest contribution formula:**
- Base: 15 per priest
- Bonus: + (Spirit × 3)
- Example: novice priest with Spirit 2 = 21 points

**Target stability:** 100 points = 100%.

**Stacking natures:** When a new mist nature is active, each priest only contributes fully if they've trained against it. An untrained priest contributes 50% of their normal amount against that nature's layer.

**Watchtowers:** Priests stationed in a watchtower are protected from mist exposure injury while on the wall.

**Gap consequences per day:**
- Food spoilage: gap% × 0.1% of total food stores
- Exposure risk: each non-sheltered person has gap% × 0.5% chance of injury per day
- Lost in mist: each non-sheltered person has gap% × 0.1% chance of going lost per day

**Curve type for priest stacking: Diminishing.** First 3 priests are critical. Priests 4-5 add meaningful coverage. Priests 6-7 add very little.

---

## 4. Starting State (Day 1)

### Resources
- Food: 100
- Wood: 30
- Stone: 15
- Metal: 0 (forces expeditions)
- Herbs: 0 (forces Rootwalker or exploration)
- Essences: none

### Roster (20 people)
- 4 Priests (all Novice, assigned to Perimeter)
- 4 Soldiers (all Novice, assigned to Garrison)
- 1 Engineer (Novice, assigned to Trapping)
- 5 Workers (Novice — 3 Farming, 1 Chopping, 1 Available)
- 1 Scholar (Novice, assigned to Researching)
- 1 Mist Walker (Novice, assigned to Available)
- 4 Unassigned (player's first identity decisions)

### Starting Conditions
- Perimeter: ~84% with 4 novice priests
- 1 archive clue already found (scholar has immediate work)
- 0 map fragments, 0 source clues
- Ring 1 accessible, Rings 2-4 unknown
- No active raids; first raid generates around Day 8-12
- Level 1 underground accessible for digging
- Workshop (Tier 1) already built
- All other facilities must be built or discovered

### Starting Facilities
- Workshop (Tier 1, pre-built)

---

## 5. Body/Mind/Spirit

### Scale: 1-5
- 1 = Deficient
- 2 = Below average
- 3 = Average
- 4 = Strong
- 5 = Exceptional (rare at game start)

### Generation Distribution
- 1: 10% chance
- 2: 30% chance
- 3: 35% chance
- 4: 20% chance
- 5: 5% chance

Starting characters in a role have higher primary stat (weighted generation), but not guaranteed.

### Role Minimums (Requirements)
- **Priest:** Spirit 4+ minimum
- **Soldier:** Body 4+ minimum
- **Engineer:** Mind 3+ AND Body 3+ minimum
- **Worker:** No minimums (Body drives output)
- **Scholar:** Mind 4+ minimum
- **Mist Walker:** Spirit 4+ AND Body 4+ minimum (hardest to qualify)

### Primary Stats by Role
- Priest: Spirit
- Soldier: Body
- Engineer: Mind
- Worker: Body
- Scholar: Mind
- Mist Walker: Spirit

### Stat Effects
- **Body** — carrying capacity, dig speed assist, melee combat, injury recovery speed, worker output
- **Mind** — research speed, forecasting accuracy, trap quality, facility operation efficiency
- **Spirit** — perimeter contribution, priest bubble range, mist resistance, MW exploration endurance

### Stat Boosts
Rare and permanent. Can boost above 5 (to 6 or 7) through tomes, mythic events, artifact binding. High stats open non-standard transformation paths.

### Stat Scaling Curve: Sigmoid
Sweet spot at 3-4. Body 1-2 gives minimal bonus. Body 3-4 is where each point dramatically improves output. Body 5+ levels off.

---

## 6. Mist Walker Exploration

### Travel Model
- Ring 1: 1 day travel out
- Ring 2: 4 days travel out (3 days crossing Ring 1 + 1 day into Ring 2)
- Ring 3: 7 days travel out
- Ring 4: 10 days travel out

**Return: always 1 day regardless of distance.** (Gameplay concession — outward journey is the cost, return is bookkeeping.)

### Range
MW range = max days out (one way). Range 3 = can travel 3 days out. Total trip = outward travel + exploration days + 1 day return.

Player picks a ring and trip length via dropdown, defaults to max range. If targeting an inner ring, MW stays in that ring for the full exploration duration.

Exploration days in ring = range - travel days to ring.

Example: Range 7 MW targeting Ring 2: 4 days travel + 3 days exploring + 1 day return = 8 days total.

### Range Growth Curve: Exponential
Early trips barely extend range. Veteran MW with sustained XP suddenly opens deeper rings. Feels like a breakthrough.

### MW Injury Rule
If MW is injured during exploration, they head home immediately. Travel time still applies (1 day return). MW is invincible — they always make it back, but days are lost.

### Exploration Findings (per exploration day in a ring)

**Ring 1:**
- 50% — nothing notable
- 15% — map fragment
- 10% — clue
- 8% — minor location (pools, walls, dens, shrines)
- 7% — herbs or food cache
- 5% — lore
- 3% — nature hint about Ring 2
- 2% — artifact (simple, low-tier)

**Ring 2:**
- 50% — nothing
- 12% — map fragment
- 8% — clue
- 8% — minor location
- 6% — lore
- 5% — herbs
- 4% — encounter/monster
- 3% — artifact
- 2% — nature hint about Ring 3
- 2% — lost person

**Ring 3:**
- 50% — nothing
- 10% — map fragment
- 8% — encounter/monster (more dangerous)
- 7% — clue
- 7% — minor location
- 5% — lore
- 5% — artifact (better quality)
- 4% — herbs (rarer varieties)
- 2% — nature hint about Ring 4
- 2% — lost person

**Ring 4:**
- 50% — nothing
- 10% — map fragment (toward finding Source lair)
- 10% — encounter/monster (dangerous)
- 8% — source clue (bonus, 3 possible total)
- 7% — minor location
- 5% — lore
- 5% — artifact (high quality)
- 3% — essence
- 2% — lost person

### Categories of Discoverable Things (Master List)

1. **Map Fragments** — cartographic data. Enough fragments for a ring reveal a vital location. Accumulate naturally, not scholar work.
2. **Clues** — information scholars research. Produce useful knowledge: location reveals, nature hints, recipes, transformation paths.
3. **Source Clues** — the 9+3 special clues about the Source. Found in vital location Hearts (guaranteed) and Ring 4 exploration (bonus). Scholars cross-reference to decode Source weaknesses.
4. **Lore** — tangible knowledge objects (books, tablets, mural rubbings). Scholars study to unlock recipes, transformation paths, facility blueprints, mist nature information.
5. **Artifacts** — equippable items. Weapons, armor, tomes, relics. Give stat bonuses or unique abilities. Each unique or semi-unique.
6. **Minor Locations** — persistent places on the map. Pools, walls, dens, shrines, groves, outposts. Stay on map after discovery. Some MW can attempt alone, others need expedition team. Have own encounters and rewards.
7. **Herbs** — botanical materials for crafting compounds and counters.
8. **Food/Material Caches** — supplies found in the mist.
9. **Lost People** — survivors. MW brings them back, adds to population.
10. **Nature Hints** — foreshadowing about the next ring's mist nature. Low percentage. Feeds scholars so priests can prepare before pushing deeper.
11. **Essences** — nature-specific materials from creature corpses and mist samples. Scholars use to synthesize nature counters and compounds. Combat-to-scholarship-to-defense pipeline.
12. **Encounters/Monsters** — hostile creatures found at minor locations or wandering in rings. Risk of injury. Defeating them yields essences and possibly artifacts.

---

## 7. Scholar Work Durations

**Researching a clue:** 2-3 days (Ring 1 clues simpler, Ring 3 clues longer)

**Identifying a mist nature:** 4-5 days. Survival-critical. Until complete, priests can't begin training.

**Researching a nature counter:** 3-4 days after identification. Produces knowledge priests need for counter training.

**Studying lore/relics:** 3-6 days depending on complexity.

**Interpreting Source clues:** 5-7 days per clue. Cross-referencing accelerates: first clue 7 days, each subsequent 1 day less, minimum 3 days.

**Forecasting threats:** Passive/ongoing. Scholar on forecasting generates warning 2-3 days before raid. Higher Mind / veteran+ gives more detail.

**Collaboration bonus:** Two scholars on same task = ~35% faster. Three scholars = ~50% faster. Diminishing returns curve.

**Mind stat impact:** Each point of Mind above 3 reduces task duration by roughly half a day.

---

## 8. Resource Production

**Food:**
- 1 worker farming = 3 food/day
- Consumption = 1 food per living person per day
- Body stat bonus: +0.5 food/day per Body above 3
- Curve type: Linear (workers → food)
- Stat bonus curve: Sigmoid

**Wood:**
- 1 worker chopping = 2 wood/day
- Body stat bonus: +0.5/day per Body above 3
- Consumed by: traps (1 wood each), facilities, dig supports

**Stone:**
- 1 worker quarrying = 2 stone/day
- Body stat bonus: +0.5/day per Body above 3
- Consumed by: facilities, dig supports, fortifications

**Metal:**
- Cannot be produced at monastery
- Found at locations during expeditions
- Typical yield: 3-8 metal per expedition
- Packers (elevated workers) haul more efficiently

**Herbs:**
- Wild herbs found during MW exploration (uncommon)
- Cultivated by Rootwalker at Herbarium: 1-2/day
- Scarce before Rootwalker/Herbarium

**Engineer rates:**
- Trapping: 1 trap/day, costs 1 wood
- Building: facility-specific progress rates
- Digging: progress toward chamber breakthrough

**Perimeter food spoilage:** gap% × 0.1% of total food stores per day

---

## 9. Raid Generation

**First raid:** Around Day 8-12. Scholar forecasting gives 3-5 days warning. First raid is gentle (teaching moment).

**Unannounced raids: 10% chance.** Even with scholar forecasting, 1-in-10 raids arrive with no warning. Config-tunable.

**Frequency curve: Exponential within each tier.**

Ring 1 tier:
- Days 1-15: raids every 10-14 days
- Days 16-30: raids every 7-10 days
- Days 30+: raids every 4-6 days

Ring 2 tier (resets on ring advancement):
- Starts every 8-12 days, compresses to every 3-5 days

Ring 3 tier:
- Starts every 6-10 days, compresses to every 2-4 days

Ring 4 tier:
- Constant pressure, every 2-3 days

**Strength scaling: Gentle exponential within tier.** No surprise cliffs. Player should feel it getting harder each time but no single day-to-day jump feels unfair.

**Raid composition by tier:**
- Ring 1: physical creatures only
- Ring 2: physical + nature-A creatures
- Ring 3: physical + A + B creatures
- Ring 4: all above + Source-aligned creatures

**Scouting:** MW spends a day scouting. Reveals creature type, strength, exact arrival. Grants +10% defense bonus.

---

## 10. Combat Resolution

**Defense rating contributions:**
- Soldier on garrison: Body × 2 (primary defenders)
- Soldier veteran bonus: +50% contribution
- Traps: 2 defense each, consumed after use
- Watchtower: flat defense bonus while standing
- MW at home: Body × 1
- Other roles at home: Body × 0.3

**Resolution (defense vs raid strength ratio):**

- **Decisive victory (defense ≥ raid × 1.5):** No injuries. All essences recovered. Possible artifact.
- **Victory (defense ≥ raid):** 0-1 minor injuries. Most essences recovered.
- **Narrow victory (defense ≥ raid × 0.7):** 1-2 injuries. Partial essences. Traps consumed.
- **Defeat (defense < raid × 0.7):** 1 death, additional injuries. Food/material losses. Traps destroyed.
- **Catastrophic defeat (defense < raid × 0.4):** 2 deaths, widespread injuries. Significant resource loss. Temporary perimeter penalty.

**Key rule: All victories are zero deaths. Defeat is where deaths begin.**

**Nature mismatch penalty:** Uncontested nature creatures bypass defense — treated as if defense were 30% lower against their portion of the raid. Makes priest nature training survival-critical.

**Trap effectiveness:** Full value against physical creatures. Half value against nature-aligned creatures (unless trap crafted with matching essence).

**Scouting bonus:** +10% defense if MW scouted the raid. Additional +5% if scholar forecasted type and monastery has matching counter compounds.

---

## 11. Health System

**Binary states, not HP percentages:**
- **Active** — fully functional
- **Injured** — cannot work, recovering (3-5 days). Priest tending roughly halves recovery time.
- **Gravely Injured** — cannot work, longer recovery (6-10 days). Priest tending critical.
- **Lost** — taken by mist, MW must rescue within X days or death
- **Dead** — permanent (unless resurrected)

**No HP bar.** Events cause state transitions (active → injured, active → dead). Severity depends on the event.

**Tending is never automatic.** Injured people recover at base rate. Player must explicitly pull a priest off perimeter to assign Tending. The game surfaces the situation via tab notification badge but never prompts a decision.

**Gravely injured** generates a Notable feed event noting the situation and expected recovery time. Not a prompt — information the player acts on or doesn't.

---

## 12. Expedition Mechanics

**Expedition vs. Solo Exploration:** The MW explores alone — scouting the unknown, finding things. Expeditions are purposeful group missions to known locations with specific goals.

### Composition Rules
- **MW required** — does not count against bubble limit. Leads the expedition.
- **Priest required** — provides the portable perimeter (bubble). The party's lifeline.
- **Additional members** — as needed for the goal, up to the priest's bubble capacity. Engineers for extraction, scholars for research, soldiers for combat.
- **Goal required** — every expedition must have a specific objective: retrieve metal from a ruin, search a library for clues, fight a creature at a den, harvest herbs from a grove.
- **Destination required** — must be a previously discovered location. Cannot send an expedition into the unknown.

### Range Limitation
Expedition range is limited by **whichever is lower**: the MW's mist endurance or the priest's mist endurance. Both are Spirit-derived plus bonuses. All other party members ride inside the priest's bubble and don't need a range stat.

### Priest Failure (Overstay Mechanic)
If the expedition exceeds the priest's safe time outside:
- **Day 1 over limit:** 10% chance of priest failure (bubble collapse)
- **Day 2 over limit:** 20% chance
- **Day 3 over limit:** 30% chance
- Linear escalation: +10% per day beyond the limit

If the priest fails (bubble collapses): **everyone except the MW dies.** The MW is invincible and returns home in 1 day.

If the priest dies during any expedition event (combat, encounter): **everyone except the MW dies.** Same outcome — the priest IS the bubble.

### Return Trip Hazard
Return is always 1 day regardless of distance. There is a small chance of a combat encounter on the return trip — a single roll. If they lose, the expedition is delayed 1 extra day (which could push them over the priest's range limit, triggering the overstay mechanic). If they win, they arrive home safely.

### Loop
MW scouts alone → finds locations → reports back → player plans expedition to known location with specific goal → assembles team (MW + Priest + specialists) → sends them out → they accomplish the goal (or don't) and return.

---

## 13. Tower Mechanics

Towers are the monastery's ablative defense layer. They absorb raid damage so people don't have to.

### Tower Tiers
- **Tier 1 — Basic Tower:** Defense value only. Wood and stone construction. No ward slots.
- **Tier 2 — Reinforced Tower:** Higher defense, requires metal. More durable (less damage per raid). **One ward slot.**
- **Tier 3 — Fortified Tower:** Maximum defense. Expensive materials. **Three ward slots** — can be warded against all known natures simultaneously.

### Hit Points
**Towers are the only game entity with hit points.** All people use binary health states (Active/Injured/Gravely Injured/Dead). Towers degrade numerically — they take damage during raids, can be partially damaged, and require engineer time and materials to repair.

### Warding
A priest consecrates a tower's ward slot against a specific identified mist nature. Requirements: the nature must be identified (scholar work) and the priest must have trained against that nature.

- Warded towers reduce the nature mismatch penalty during raids from matching creatures.
- **Re-warding** (changing which nature a slot protects against) costs priest time but not materials — the structure stays, only the consecration changes.
- Tier 2: one ward slot = protection against one nature. Player must choose which.
- Tier 3: three ward slots = can cover all known natures. Full coverage, but expensive to reach.

### Raid Damage Flow
1. Raid damage hits towers first
2. Warded towers absorb more from matching-nature attacks
3. If towers are overwhelmed or destroyed, consequences fall on people (injuries, deaths)
4. After a raid, tower damage is visible in the Build tab (Tower 3 at 40%, Tower 1 destroyed)
5. Engineer repair is a competing priority against other engineer work

### Construction
Engineers build and upgrade towers. Each tier requires more expensive materials and (for Tier 3) more roles involved. Specific material costs TBD.

---

## 14. Open Mechanical Questions

- [ ] Exact MW range formula (Spirit + Body/2 + XP/N — what is N?)
- [ ] How many map fragments needed to reveal a vital location per ring?
- [ ] Training milestone gates — what are the specific defining moments?
- [ ] Facility construction costs and durations
- [ ] How many days does priest nature training take?
- [ ] Lost person rescue time limit (how many days before death?)
- [ ] Exact starvation effects when food hits 0
- [ ] XP rates per assignment type
- [ ] Veteran XP threshold per role
