# The Last Light

## Game Design Document

A text-based systems-building survival game where you guide a monastery through an apocalypse of mist, building infrastructure around discoveries while balancing expansion against the attention it draws.

---

## Core Concept

You are not a character. You are the organizing intelligence of a monastery - the last bastion of humanity in a world consumed by supernatural mist. Your role is to make decisions about where attention goes: who to train, what to research, where to explore, and how to systematize discoveries into sustainable capability.

**The core loop:** Discover → Systematize → Capability

**The core tension:** Growth requires exploration. Exploration reveals threats. Threats require capability. Capability requires growth.

**The feel:** You design systems, you don't operate them. Once built, systems run automatically. Your attention stays on the frontier - new discoveries, incoming threats, opportunities for optimization. The game never asks you to re-decide things you've already decided.

---

## Setting

### The Situation

The mist came. No one knows exactly when or why - only that it rolled in and never left. Most of humanity fell. Cities went silent. The world beyond the fog exists only in memory and rumor.

Your monastery survived. Protected by the prayers of the faithful, surrounded by farms that feed you, ringed by priests who hold back the fog through constant vigil. You are what remains.

Somewhere below, in caves that wind beneath the earth, portals were opened. The mist pours from them still. If they could be found and sealed, perhaps the fog would recede. Perhaps humanity could rebuild.

But first, you must survive.

### Geography

**The Monastery (Center)**
- Where knowledge lives
- Where training happens
- Where people rest and recover
- Contains: chapel, dormitories, library, workshops, infirmary
- Safe from the mist, always

**The Farms (Inner Ring)**
- Food production for the community
- Vulnerable - requires protection
- Worked by common folk
- Within the protected perimeter

**The Perimeter (Boundary)**
- The edge of safety
- Priests stationed at intervals, praying, holding the mist at bay
- Exhausting work requiring rotation
- Expanding the perimeter requires more priests
- A gap in the perimeter means incursion

**The Mist (Beyond)**
- Everything outside the perimeter
- Dangerous, disorienting, spiritually corrosive
- Contains: creatures, ruins, other survivors, fallen monasteries, caves
- Only mist walkers can navigate it safely
- The deeper you go, the worse it gets

**The Depths (Below)**
- Cave systems beneath the land
- Somewhere down there: the portals
- Source of the mist
- Sealable, if you can reach them
- Late game objective

---

## Time and Flow

Time flows continuously, not in discrete turns. Events occur, expeditions return, threats emerge. You respond when you can.

**Time Units:**
- Actions are measured in days
- Training takes weeks to months
- Expeditions take days to weeks depending on distance
- Perimeter shifts are measured in hours (abstracted to rotation schedules)

**The Feel:**
Messages arrive. You read them, make decisions, move on. Multiple things happen in parallel. You're not clicking "end turn" - you're managing ongoing processes and responding to events.

Example message flow:
- "Brother Aldric has returned from the eastern fog. He found ruins. Awaiting instructions."
- "The northern perimeter is thin. Sister Maren requests relief."
- "Something large was spotted in the mist. Moving west."
- "Scholar Petra has completed her study of the strange metal. She has findings to report."

---

## People

People are your only truly finite resource. Everyone has a name. Everyone matters.

### Attributes

People start with minimal definition - just a name, an age, and their current role. Attributes emerge from what they do.

**Innate (discovered over time):**
- Spiritual sensitivity (affects priest effectiveness, mist walking aptitude)
- Physical resilience (affects expedition survival, labor capacity)
- Mental acuity (affects research speed, training speed)
- Hidden traits (revealed through events - "Maria has an unusual resistance to the mist")

**Developed (through assignment):**
- Skills in their trained role
- Experience with specific threats, artifacts, or knowledge areas
- Relationships (who they work well with, who they've lost)

### Roles

**Common Folk**
- Default role for new arrivals and untrained population
- Can work farms, perform labor, assist others
- Can be trained into any other role (with varying aptitude)

**Priests**
- Hold the perimeter through prayer and ritual
- Perform blessings, consecrations, spiritual protection
- Training time: months
- Requires: spiritual sensitivity helps, but dedication matters more

**Scholars**
- Study artifacts, creatures, lore
- Unlock knowledge that enables new systems
- Training time: months to years
- Requires: mental acuity helps significantly

**Mist Walkers**
- Can survive and navigate the mist
- Scouts, explorers, expedition leaders
- Training time: months, plus exposure conditioning
- Requires: rare aptitude (spiritual sensitivity + physical resilience), many candidates wash out

**Fighters**
- Protect expeditions, defend against incursions
- Combat capability against physical threats
- Training time: weeks to months
- Requires: physical resilience helps

**Specialists**
- Emerge from discovery and research
- Someone who understands a particular artifact, creature type, technique, or system
- Not trained directly - develop through assignment to relevant work

### Population Dynamics

**People arrive through:**
- Natural growth (slow, requires stable food supply)
- Refugees (random events, more common as you become known)
- Rescue missions (expeditions to other monasteries or survivor groups)
- The mist sometimes spits people out (rare, mysterious)

**People leave through:**
- Death (expeditions, incursions, illness, old age)
- Corruption (too much mist exposure without proper protection)
- Departure (if conditions become intolerable - rare)

---

## The Discovery System

Everything interesting begins with discovery. Discoveries come from expeditions, visitors, research, and consequences.

### Discovery Types

**Natural Resources**
- Plants with useful properties (Whispervine, Moonpetal, etc.)
- Animals that can be domesticated or harvested
- Materials (strange metals, blessed stones, fog-resistant fibers)
- Terrain features (clean water sources, defensible positions, cave entrances)

**Knowledge**
- Fighting techniques effective against specific creatures
- Ritual variations that strengthen the perimeter
- Crafting methods for useful items
- Lore about the world before, the mist's nature, the portals

**Artifacts**
- Objects with properties you must study to understand
- May be dangerous, useful, or both
- Often keys to unlocking new capabilities
- Found in ruins, on creatures, in the depths

**People**
- Survivors with skills or knowledge
- Individuals with rare aptitudes
- Those who remember useful things from before

**Locations**
- Ruins that can be salvaged
- Other monasteries (fallen or surviving)
- Cave entrances leading to the depths
- Safe paths through the mist

**Creatures**
- Initially threats, but understanding them unlocks counters
- Some may be tameable or useful
- Their remains may have properties
- Knowing their patterns makes expeditions safer

**Portals**
- The source of the mist
- Found in the depths
- Can be sealed with sufficient knowledge and capability
- Each one sealed reduces mist pressure

---

## The Systematization Model

When you discover something, you choose: ignore it, use it crudely, or build a system around it.

### The Pipeline: Build → Run → Upgrade

**Build (requires your attention)**
- Decide to create a system around a discovery
- Assign people to set it up
- Provide any prerequisites (knowledge, facilities, materials)
- Takes time to establish
- Once complete, transitions to Run

**Run (automatic)**
- System produces output without your attention
- People assigned to it do their work
- You see results in a summary/dashboard view
- Only interrupts you if something goes wrong
- Example: "Whispervine Cultivation: 2 farmers, +3 herbs/week, running"

**Upgrade (optional, pull not push)**
- New discoveries may enable improvements
- You choose when to revisit a system
- Upgrades might: reduce people needed, increase output, change output type, reduce risk
- The game never forces you to upgrade

### System Components

Every system has:

**Inputs**
- People (always required)
- Raw materials (sometimes)
- Knowledge prerequisites (sometimes)
- Facilities (sometimes)

**Process**
- What the assigned people actually do
- May have stages (acquisition → processing → application)
- Takes time to produce output

**Outputs**
- Capability added to the monastery
- May be: resources, trained people, knowledge, defensive strength, equipment

**Risk**
- Some systems have ongoing risk (edge harvesting, mist exposure)
- Risk can often be reduced through upgrades or knowledge

### Example Systems

**Whispervine Cultivation**
- Discovery: Whispervine grows at mist's edge, makes alertness tea
- Build: Assign farmers to edge harvesting (risky), someone to brewing
- Run: Produces alertness tea regularly
- Output: Priests can hold longer/sharper perimeter shifts
- Upgrade path: Better preparation method (requires scholar research), safer harvesting technique (requires mist walker knowledge)

**Creature Lore: Fog Stalkers**
- Discovery: Expedition encountered and survived Fog Stalkers
- Build: Assign scholar to study survivor accounts, any remains brought back
- Run: Produces knowledge about Fog Stalkers
- Output: Fighters gain effectiveness against them, expeditions can avoid them
- Upgrade path: Capture a live one (dangerous expedition), find pre-mist records about similar creatures

**Mist Walker Training Program**
- Discovery: You've identified what makes someone able to walk the mist
- Build: Assign experienced mist walker to train candidates, build exposure chamber
- Run: Candidates progress through training, some wash out, some graduate
- Output: New mist walkers over time
- Upgrade path: Better selection criteria (fewer washouts), safer conditioning (less corruption risk)

---

## Expeditions

Expeditions are how you interact with the mist. They're the primary source of discovery and the primary source of risk.

### Expedition Types

**Reconnaissance**
- Purpose: Map an area, identify what's there
- Composition: Mist walker solo or small team
- Duration: Days
- Risk: Low to medium
- Returns: Information, possible discoveries

**Investigation**
- Purpose: Examine something specific (ruin, creature territory, anomaly)
- Composition: Mist walker + specialists relevant to target
- Duration: Days to weeks
- Risk: Medium
- Returns: Detailed knowledge, artifacts, possibly survivors

**Salvage**
- Purpose: Retrieve materials from a known location
- Composition: Mist walker + laborers + fighters for protection
- Duration: Depends on distance and volume
- Risk: Medium (known route) to high (contested area)
- Returns: Materials, artifacts

**Contact**
- Purpose: Reach another monastery or survivor group
- Composition: Mist walker + priest (for credibility) + fighters
- Duration: Weeks
- Risk: High (long distance)
- Returns: Alliance, trade, refugees, knowledge

**Descent**
- Purpose: Enter the caves, seek portals
- Composition: Full team (mist walker, fighters, priest, scholar)
- Duration: Weeks
- Risk: Very high
- Returns: Progress toward sealing portals, major discoveries, major losses

### Expedition Mechanics

**Planning:**
- Choose destination/objective
- Assemble team (select individuals by name)
- Allocate supplies (food, equipment, ritual materials)
- Set risk tolerance (aggressive exploration vs. careful progress)

**Execution (abstracted):**
- Expedition departs
- Time passes
- You receive occasional updates if something significant happens
- Expedition returns (or doesn't)

**Resolution:**
- Survivors return with report
- Discoveries are presented for your decision
- Losses are reported
- Participants gain experience (if they survived)

### Expedition Events (examples)

During an expedition, events may occur that require no input (resolved by team composition and luck) or that send a message asking for guidance:

- "The team has found a sealed door with inscriptions. Oren believes he can read them but it will take two days. Press on or wait?"
- "Fog Stalkers detected nearby. The team can fight, hide, or retreat."
- "Brother Cassius has become separated in the mist. Search (risky) or continue without him?"

---

## Threats

The mist is not passive. As you grow, it notices. As it notices, it responds.

### Threat Scaling

**Attention** is an invisible stat that increases when you:
- Expand the perimeter
- Send expeditions into the mist
- Seal portals (major attention spike)
- Become known to other survivors
- Grow in population and capability

Higher attention means:
- More frequent incursions
- Larger/more dangerous creatures
- Coordinated attacks (late game)
- The mist "adapting" to your defenses

### Threat Types

**Incursions**
- Creatures breach the perimeter
- Require immediate response
- Scale: single creature (early) to swarms (late)
- Resolution: Fighters engage, priests support, possible casualties

**Perimeter Pressure**
- The mist pushes harder against a section
- Priests in that section are overwhelmed
- Requires: reinforcement, rotation, or accepting a breach
- Can be persistent (some areas are just harder to hold)

**Creature Types (examples):**

*Fog Stalkers*
- Pack hunters, physical
- Dangerous but straightforward to fight
- Early game threat

*Whisper Things*
- Spiritual, attack the mind
- Priests are effective, fighters are not
- Corrupt rather than kill

*The Hollow*
- Former humans consumed by the mist
- Disturbing to fight, former survivors/monks
- Mid game revelation

*Mist Titans*
- Massive, rare, devastating
- Require coordinated defense, special knowledge
- Late game event

*The Presence*
- Something that guards the portals
- Not fully physical
- Endgame threat

### Threat Mechanics

**Warning:**
Threats don't appear instantly. You get notice:
- "Movement in the eastern fog. Larger than usual."
- "The mist is thickening near the north perimeter."
- "Brother Ivan reports whispers that won't stop."

**Preparation Window:**
Time between warning and threat arrival. Use it to:
- Reinforce the area
- Research counters
- Prepare rituals
- Evacuate if necessary

**Resolution:**
- Threats are resolved through capability you've built
- Not tactical combat - abstracted based on defenders, equipment, knowledge
- Outcomes: repelled (clean), repelled (losses), breach (contained), breach (catastrophic)

**Consequences:**
- Victory may yield discoveries (creature remains, dropped artifacts)
- Defeat costs people, infrastructure, possibly territory
- Some threats leave lasting effects (corruption, fear, damaged perimeter)

---

## Progression

### Early Game: Survival

**Focus:** Keeping the perimeter staffed, food production stable, not dying.

**Challenges:**
- Few trained people
- No knowledge of what's in the mist
- Thin margins - one bad incursion could be catastrophic

**Activities:**
- Training first generation of priests, first mist walker
- Short reconnaissance expeditions
- Learning about immediate threats
- Building basic systems (food, basic training)

**Milestone:** Stable perimeter rotation, first successful expedition, first systematic knowledge

### Mid Game: Expansion

**Focus:** Growing capability, pushing back the mist, accumulating knowledge.

**Challenges:**
- Balancing growth against attention
- Managing more complex systems
- Threats are getting harder
- Tantalizing discoveries in distant places

**Activities:**
- Regular expeditions
- Contact with other survivors
- Research programs
- Expanding the perimeter
- Developing specialized systems
- First cave explorations

**Milestone:** Self-sustaining training pipelines, first portal location discovered, alliance with another monastery

### Late Game: The Source

**Focus:** Finding and sealing portals, confronting what's down there.

**Challenges:**
- Portals are guarded
- Sealing them draws massive attention
- The depths are worse than the surface mist
- You may learn things you wish you hadn't

**Activities:**
- Deep expeditions into the cave system
- Researching portal sealing
- Building capability for the final confrontation
- Managing escalating surface threats while committing resources below

**Milestone:** First portal sealed, understanding of the mist's true nature

### Endgame

**Possibility 1: Seal all portals**
- The mist recedes
- Humanity can rebuild
- Victory

**Possibility 2: Sustainable containment**
- You can't seal them all, or choose not to
- But you've built systems that can hold indefinitely
- A different kind of victory

**Possibility 3: Fall**
- The monastery is overwhelmed
- Record how long you lasted, what you achieved
- Try again

---

## Interface Concepts

### Main View: The Message Feed

The primary interface is a feed of events, reports, and requests:

```
--- Day 147 ---

[EXPEDITION] Brother Marcus has returned from the eastern ruins.
He found a sealed chamber and old texts. Scholar analysis available.
[Assign Scholar] [Store for Later] [Details]

[PERIMETER] Sister Agatha reports the western section is quiet today.
Rotation proceeding normally.

[ALERT] Movement detected in the northern fog.
Scout estimates arrival in 2-3 days. Medium-sized, multiple contacts.
[Prepare Defenses] [Request Details] [Assign Scout]

[RESEARCH] Scholar Petra has completed analysis of the strange metal.
It resists corruption. Possible applications for equipment.
[Create System] [Note Knowledge] [Details]

[SYSTEM] Whispervine Cultivation operating normally. +3 herbs.
```

### Systems Dashboard

A summary view of all running systems:

```
RUNNING SYSTEMS

Training:
  Priest Training ▶ 2 candidates, 3 weeks remaining
  Fighter Training ▶ 4 candidates, 1 week remaining

Production:
  Whispervine Cultivation ▶ 2 farmers, +3 herbs/week
  Farm District A ▶ 8 farmers, food +20/week

Research:
  Fog Stalker Lore ▶ Scholar Marcus, 60% complete
  
Perimeter:
  12 priests on rotation, coverage 100%, strain: low
```

### People View

List of all people with current assignment:

```
PRIESTS (12)
  Sister Agatha - Perimeter West (6 years exp)
  Brother Ivan - Perimeter North (2 years exp, shaken)
  ...

MIST WALKERS (3)
  Brother Marcus - Returned from expedition, resting
  Sister Vera - Expedition to southern caves (day 4)
  Elena - Training candidates

SCHOLARS (2)
  Petra - Researching strange metal
  Oren - Available

FIGHTERS (8)
  ...

UNASSIGNED (4)
  Thomas (farmer, candidate for fighter training)
  ...
```

### Expedition Planning

```
NEW EXPEDITION

Objective: [Investigate the sealed chamber Marcus found]

Team:
  Mist Walker: [Brother Marcus ▼] (experienced with area)
  Scholar: [Oren ▼] (can read old texts)  
  Fighters: [2 ▼]
  
Supplies: [Standard ▼]
Risk Approach: [Careful ▼]

Estimated duration: 8-12 days
Risk assessment: Medium (known route, unknown interior)

[Launch Expedition] [Cancel]
```

---

## Minimum Viable Prototype

For initial Claude Code implementation, focus on:

### Core State

```
- days_elapsed: number
- people: list of {name, role, assignment, status}
- perimeter: {priests_required, priests_assigned, stability}
- food: {supply, production_rate, consumption_rate}
- systems: list of {name, type, people_assigned, output, status}
- knowledge: list of discovered facts
- threats: list of {type, arrival_day, severity}
- expeditions: list of {team, destination, return_day}
```

### Core Actions

1. Assign person to role/task
2. Launch expedition (select team, destination)
3. Create system from discovery
4. Respond to threat
5. Advance time

### Core Events

1. Expedition returns (with discoveries or losses)
2. Threat arrives (requires response)
3. System produces output
4. Random event (visitor, incident, opportunity)

### First Playable Loop

1. Start with: 20 people (mix of roles), stable perimeter, basic food, no knowledge
2. Each "turn": see what's happening, make decisions, advance time
3. Early decision: send first expedition or focus on stability?
4. First discovery: find something, decide whether to systematize
5. First threat: something comes, see if you can handle it
6. Play until: collapse or reach some milestone (first portal found?)

### What to Defer

- Complex attribute system for people
- Detailed expedition event trees  
- Full creature bestiary
- Magic/ritual system details
- Other monasteries and diplomacy
- The actual portal sealing endgame
- Save/load
- Seed-based determinism

---

## Open Questions for Playtesting

1. How much should the player see of expedition progress? Updates, or just departure and return?

2. How granular are time decisions? Click to advance one day? Set speed and pause when events occur?

3. How much detail in threat resolution? Just outcomes, or moment-by-moment choices?

4. Should people have visible stats, or should capability be opaque and emergent?

5. How to handle the tension between "systems run automatically" and "you need to staff them"? Is staffing a one-time assignment or ongoing management?

6. What's the right frequency of events to make it feel active but not overwhelming?

---

## Tone and Feel

**Not grimdark, but serious.** People die, situations are dire, but there's hope. The monastery has survived this long. It can survive longer. Maybe it can even win.

**Names matter.** When Brother Cassius dies in the mist, that should feel like a loss, not a stat change.

**Discovery is wonder.** Finding something new should be exciting. What is this? What can we do with it?

**Systems are satisfying.** Building a working system should feel like an accomplishment. Watching it run should feel like progress.

**Threats are meaningful.** Not constant harassment, but real danger when they come. Preparation matters.

**The mist is mysterious.** Never fully explained. The more you learn, the more questions. What opened those portals? Why? Is the mist alive? Does it want something?

---

## Summary

The Last Light is a game about building infrastructure for survival. You discover things in a hostile world, create systems to exploit those discoveries, and grow capable enough to confront the source of the threat.

Your attention is always on the frontier. Built systems run themselves. You're not micromanaging - you're designing.

Growth draws attention. The mist notices. The challenge scales. Eventually, something will be too much - or you'll seal the last portal and watch the fog recede.

Good luck, Abbot.
