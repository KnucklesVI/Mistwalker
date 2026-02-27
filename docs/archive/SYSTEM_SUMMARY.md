# Mistwalker Structure Summary (Human-Facing)
This document is the same structure as the AI spec, but written so you can skim it.
It's meant to be "what exists" and "how it connects", not "why it's fun".
---
## 1. The Core Loop
Everything in the game feeds a single loop:
**Discover → Predict → Counter → Apply → Confirm**
The player's power does not mostly come from raw leveling.
It comes from learning what the world is doing and mitigating it.
---
## 2. How Monsters Do Damage
A monster has:
- a physical attack number (**P**)
- zero or more "essences" (traits like acid, heat, rot, etc.)
Each essence adds a parallel layer of damage equal to **P**.
So the more essences a monster has, the more dangerous it becomes even if its physical number stays the same.
Your job is to build counters that reduce essence damage.
You do not need perfect counters for everything.
A partial solution can be "enough" if your base defense is strong enough.
---
## 3. Two Meanings of "Essence"
There are two different things that got called essence:
1) **Essence as a monster trait**
- what creates parallel damage (acid, heat, etc.)
2) **Essence as a dropped resource**
- what you harvest from monsters and can use for crafting, wards, research, etc.
These don't have to be the same thing.
They can map to each other later, but the structure keeps them separate.
---
## 4. Knowledge States
For each monster's essences, your knowledge moves through stages:
- unknown
- suspected
- identified
- confirmed
The more confirmed you are, the better your counters can get.
Information comes from:
- Mistwalker fights and findings
- research
- cartography correlations
- battle results
---
## 5. Unit Roles (What Each Unit Does)
### Mistwalker
The "field engine".
What it does:
- **Explore** for multiple days (longer = better loot probabilities)
- **Scout** an incoming threat (1 day) to reduce uncertainty about arrival/tier/count
- **Expedition** to a discovered site with a troop
- **Rescue** lost units caught in mist events
Key rules:
- You cannot recall it once it leaves (default).
- It returns only when time is up or it gets injured.
- Injury sends it back and costs time (time off the field is the real penalty).
- It adds combat strength to the base if present.
- It can also "pray" like a priest to help coverage, but then it cannot fight.
---
### Priests
The survival engine.
Priests have mutually exclusive time allocation:
1) **Pray (perimeter coverage)**
- keeps mist out
- reduces gap
- prevents death spirals
2) **Heal**
- speeds healing
- required to prevent death from grievous injury
3) **Ward**
- place wards on walls/towers/structures (and possibly units)
4) **Battle rites / combat auras**
- buffs during battles
- but priests must leave prayer duty to do it
5) **Resurrection / human essence**
- on death events: resurrect vs leave dead vs extract essence for warding
Troop "bubble" rule:
- expeditions into mist need a priest bubble
- bubble size is spirit-based
- priest death collapses bubble and triggers a dangerous retreat
Priest towers:
- built by soldiers/engineers
- keep priests safe from mist snatch and/or battle loss (upgrade tiers)
If all priests die, the game is effectively over.
---
### Engineers
The infrastructure engine.
Engineers do:
- build walls
- build traps (strong but consumable)
- build and repair defenses
- build defensive siege gear (manned during attacks)
- build priest towers
- salvage metal at cleared sites (workers carry it)
They generally don't fight except by manning siege equipment during battles.
---
### Soldiers
The combat engine.
Soldiers:
- are the main source of base defense output
- form expeditions to clear sites
Their upgrades are meant to be more qualitative than infinite numbers:
- doctrines/stances/formations that counter certain essences
- veteran status from surviving fights (optional)
  - can improve survival
  - can improve essence identification during fights
---
### Workers
The resource engine.
Workers:
- chop wood
- quarry stone
- farm food
- carry salvaged metal from expeditions
Herb farming can be added later (optional).
---
### Scholars (and Specialist Rooms)
Scholars are the research engine.
Instead of "one scholar does everything", the game trends toward specialists:
- because specializations consume the input stream
- and because you cannot train a replacement in parallel on the same stream
Scholar tracks/rooms:
- **General Librarian** (searches broadly, finds strange books)
- **Essence Scholar** (monster/essence research, compendium)
- **Cartographer** (maps runs, increases warning range, predicts sources/sites)
- **Artificer** (identify/fuse/modify items, preserve rarity)
- **Herbologist/Alchemist** (herbs → consumables/potions/salves)
General Librarian is special:
- it's a mini-game of scanning titles, choosing what to read
- some books can harm or maddeningly affect the scholar (optional danger system)
---
## 6. The Base Mist System (Coverage and Gap)
Coverage comes from praying priests (and praying mistwalkers).
- coverage falls → gap rises
- gap rises → mist events happen more often
- below a threshold, a death spiral naturally emerges
Mist events can cause:
- injuries
- grievous injuries
- madness
- lost units (rescued by Mistwalker)
- deaths (rare early, common late)
---
## 7. Sites and Expeditions
Two site types:
- minor site: one fight
- major site: multiple fights, bigger loot, metal salvage
How sites appear:
- Mistwalker brings back fragments/notes
- Cartographer synthesizes them into site leads
Expeditions:
- generally require a priest bubble
- may benefit from:
  - engineer (siege/salvage)
  - scholar (lore extraction)
  - workers (carry metal)
---
## 8. Cartography and "Wave Sources"
Cartographer does not "find maps" as loot.
Instead:
- every Mistwalker run produces cartographic notes
- cartographer assembles them into predictions
Outputs:
- increases how early you can see incoming waves
- narrows likely essences based on region correlation
- identifies site leads
- optionally: identifies "source/breeding ground" for a wave
If the military destroys the source site:
- that wave ends
Optional emergency action:
- cartographer can "go personally" to guarantee a lead at high risk,
  sacrificing the unit for survival.
---
## 9. UI Activity Checklist (What the Shell Must Support)
The UI must support these activities:
Global:
- advance day
- show resources and timers
- show base defense and coverage/gap
People:
- roster
- training/role assignment on arrivals
- infirmary surfaced automatically
- per-unit status and assignment
Mistwalker:
- choose action (explore/scout/expedition/rescue)
- set duration
- show run progress + outcomes
- reveal loot on return
Priests:
- assign pray vs heal vs ward vs battle rites
- show coverage/gap impact
- build/upgrade priest towers
- ward placement
Scholars:
- assign to tracks/rooms
- manage queues
- general librarian book-choice mini-game
- monster compendium view
Engineers:
- build/repair
- traps and siege items
- tower construction
- siege manning
Soldiers:
- squad composition for expeditions
- doctrines
- veteran status (if implemented)
Sites:
- discovered site list
- requirements/threat info
- launch expedition
---
## 10. What's Still Vague (Known Unknowns)
- final essence list and how many can exist in a single run
- whether monster drops map directly to trait essences
- exact rule for turning hints into confidence/identification
- exact mitigation stacking and caps
- what wards exist and what they can be applied to
- how "source sites" are generated and how often they appear
- soldier progression: numeric vs qualitative split
- scholar danger system: how harsh, how recoverable
- population cap behavior (eg. stabilize near ~30)
- immigration source (mistwalker finds vs door arrivals)
