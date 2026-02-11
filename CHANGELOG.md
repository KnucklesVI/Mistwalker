# Mistwalker Changelog

## Alpha 0.39a
*Watchtowers, stone quarrying, and priest/mystic defense overhaul.*

**Systems**
- New resource: Stone. Quarried by workers (new assignment) and produced as a byproduct of excavation.
- Watchtower system: engineers build towers from wood and stone. Each tower protects one priest.
- Towers can be upgraded with metal to allow a mystic to channel from within.
- Mystics now require a reinforced tower to contribute against spiritual/ethereal threats. No tower, no spiritual defense.
- Priests on perimeter without a tower are 3x more vulnerable to mist exposure (injury, loss, death).
- Priests in towers contribute to perimeter stability while remaining protected.
- Towers degrade 1 HP per day and take damage from physical attacks. If destroyed, occupants die.
- Engineers can be assigned to repair towers, restoring HP over time.
- Tower damage scales with combat outcome: minimal on decisive wins, heavy on defeats.

**UI**
- Stone displayed in header with production rate.
- Watchtower section added to Engineering tab showing tower HP, occupants, build/upgrade/repair controls.
- Quarry button added to worker assignment options.
- Tower button added for priests and mystics in person modal.
- Repair Towers button added for engineers.

> Snapshot: mistwalker-0.39a.html

## Alpha 0.39
*Combat rebalance — traps nerfed, late-game difficulty scaling.*

**Systems**
- Traps now only affect physical creatures. Corrupted and spiritual creatures pass right through them — you need real defenders for those.
- Threat intensity scales with time and depth. Creature effective attack and defense increase by 15% per 30 days, multiplied by depth (1.2x at Grey Reach, 1.5x at Deep).
- Threat pack sizes now scale with day count in addition to distance traveled, plus a bonus for depth entered.
- Threat spawn interval tightens over time (starts at 8 days, decreases by 1 per 30 days, minimum 3 days).
- Entering the Deep allows a 3rd simultaneous threat.

**Fixes**
- Late-game threats no longer plateau in difficulty — a Day 90 Deep attack is significantly harder than a Day 30 Shallows attack.

> Snapshot: mistwalker-0.39.html

## Alpha 0.38
*Role switching for cross-trained people.*

**Systems**
- Cross-trained people can now switch between any role they've completed training for, instantly and without retraining.
- Mistwalkers are permanently bonded to the mist and can never switch roles.
- Training buttons no longer show for roles already completed — use the new Switch Role section instead.

**UI**
- New "Switch Role" section in person modal showing all completed roles (except current).
- Trait hints updated to show Alchemist requirements.

> Snapshot: mistwalker-0.38.html

## Alpha 0.37
*Procedural generation overhaul — equipment, lore, herbs, alchemy, and buildable names are all randomized.*

**Systems**
- Procedural equipment generation: items assembled from base type + prefix + modifier + optional suffix. Base type determines bonus category (blade → combat, tome → research, censer → perimeter, etc.).
- Rarity system: common / uncommon / rare / legendary. Daily finds weighted toward common (70%), conquest rewards guarantee at least one uncommon+.
- Procedural lore/discovery types: stat boosts, training shortcuts, event modifiers, one-time consumable effects, herb unlocks, and recipe unlocks — weighted by tier.
- Herb system: workers can cultivate discovered herbs via herb garden assignment. Herbs accumulate in supply over time.
- New role: Alchemist — spirit 2+, mind 2+, 12-day training. Can brew known recipes (consuming herb supply) or experiment to discover new recipes.
- Mist exploration daily finds now generate truly random equipment instead of drawing from a pre-seeded pool.
- Location conquest grants 1–2 bonus items using a conquest rarity table.

**Content**
- Procedural buildable names matching effect type (Watchtower of Iron, Granary of Plenty, etc.) with slight cost variation per run.
- Removed old static name pools for artifacts, discoveries, and buildables.

**UI**
- Herb Garden button appears for workers when herbs are known.
- Brew and Experiment buttons for alchemists.
- Alchemist group shown in People tab.

> Snapshot: mistwalker-0.37.html

## Alpha 0.36
*Stability and animation cleanup.*

**Fixes**
- Fixed scholar assigned to farms permanently losing scholar role (reassignPerson role-lock bug).
- Fixed Mistwalker assigned to garrison permanently switching to fighter.
- Removed all header animations (day counter, population) to eliminate persistent layout reflow.

**QoL**
- Ruth now starts assigned to chopping.

> Snapshot: mistwalker-0.36.html

## Alpha 0.35
*Sound effects, staggered feed, infirmary, and UI polish.*

**Systems**
- Sound effects for key events (alerts, treasure, victory, defeat, injury, arrival, mist exploration, death).
- Staggered message feed: day messages reveal one at a time with sound-synced delays.
- Infirmary group in People tab showing injured and tending priests together.

**UI**
- Dropdown filter for expedition and research modals.
- Day and population stat animations (later removed in 0.36).

> Snapshot: mistwalker-0.35.html

## Alpha 0.34
*Clue deciphering and deep mist progression.*

**Systems**
- Clue system: scholars can decipher clues found during mist exploration to reveal locations.
- Three clue types (location, lore, final) with escalating decipher times.
- Deep mist final clue chain unlocking endgame content.

> Snapshot: mistwalker-0.34.html

## Alpha 0.33
*Mystic role and combat effectiveness rework.*

**Systems**
- New role: Mystic — spirit 2+, body 2+, or fighter+priest cross-train. Hybrid combat role.
- Category-based combat effectiveness: roles have multipliers vs physical, spiritual, and corrupted creatures.
- Creature categories (physical, spiritual, corrupted) with tiered stats.

> Snapshot: mistwalker-0.33.html

## Alpha 0.32
*Salvage runs and metal economy.*

**Systems**
- Engineers can salvage explored locations for metal.
- Metal resource used for advanced buildable construction.
- Salvage duration and yield scale with location tier.

> Snapshot: mistwalker-0.32.html

## Alpha 0.31
*Engineer trapping and wood chopping.*

**Systems**
- Engineers can build traps (costs wood, adds to camp defense).
- Workers can chop wood (new assignment and resource).
- Scholar crafting: compounds from available assignments.

> Snapshot: mistwalker-0.31.html

## Alpha 0.30
*Clue-based location reveals replace discovery-type locations.*

**Systems**
- Locations are now revealed via clue deciphering instead of discovery research.
- Dig levels with escalating depth, labor requirements, and scholar needs.

> Snapshot: mistwalker-0.30.html

## Alpha 0.29
*Threat scouting and MW permanent failure.*

**Systems**
- Threat scouting: fighters can scout incoming threats for intel and countdown visibility.
- MW training permanent failure: failed MW training can be permanent under certain conditions.
- Solo MW auto-scout when outmatched at a location.

> Snapshot: mistwalker-0.29.html

## Alpha 0.28
*Person modal rework and cross-training.*

**UI**
- Reworked person modal with traits display, stat breakdown, equipment list, and training options.
- Cross-training: people can train into new roles if they meet trait requirements.

> Snapshot: mistwalker-0.28.html

## Alpha 0.27
*Expedition recall and rescue system.*

**Systems**
- Expedition recall: pull back in-progress expeditions at 2x speed.
- Lost-in-mist rescue: Mistwalkers can rescue lost people within 10-day window.

> Snapshot: mistwalker-0.27.html

## Alpha 0.26
*Survivor system and population growth.*

**Systems**
- Periodic survivor check: chance to find new people in the mist.
- Survivor chance increases after deaths.

> Snapshot: mistwalker-0.26.html

## Alpha 0.25
*Team expeditions and bubble escort.*

**Systems**
- Team expeditions: MW + priest bubble + fighter escort to dangerous locations.
- Priest bubble failure mechanic on long trips with low endurance.

> Snapshot: mistwalker-0.25.html

## Alpha 0.24
*Creature and weakness system.*

**Systems**
- Creatures guard locations with attack/defense stats and pack sizes.
- Weakness discoveries reduce creature defense in combat.

> Snapshot: mistwalker-0.24.html

## Alpha 0.23
*Building system.*

**Systems**
- Engineers can construct discovered buildables for global buffs.
- Build costs (wood, metal) and build time scale with effect magnitude.

> Snapshot: mistwalker-0.23.html

## Alpha 0.22
*Research system.*

**Systems**
- Scholars can research found discoveries for unlocks (buffs, buildable blueprints, creature weaknesses).
- Research speed affected by scholar stats and equipment.

> Snapshot: mistwalker-0.22.html

## Alpha 0.21
*Artifact and equipment system.*

**Systems**
- Artifacts found during exploration with stat-boosting effects.
- Artifact equip system: assign artifacts to people matching role requirements.

> Snapshot: mistwalker-0.21.html

## Alpha 0.20
*Location exploration and discovery.*

**Systems**
- Location system with tiered distances and discovery yields.
- Exploration resolves with combat against location guardians.
- Discoveries looted from explored locations.

> Snapshot: mistwalker-0.20.html

## Alpha 0.19
*Threat system and camp defense.*

**Systems**
- Periodic threats spawn based on attention level.
- Garrison defense calculation from fighters and other assigned roles.
- Threat attacks with casualties based on defense vs threat power.

> Snapshot: mistwalker-0.19.html

## Alpha 0.18
*Dashboard tooltips and stat card rework.*

**UI**
- All dashboard stat cards now have hover tooltips with per-person breakdowns.
- Research card shows completed count with awaiting/in-progress detail.
- Explored card shows looted vs known locations.

> Snapshot: mistwalker-0.18.html

## Alpha 0.17
*Title rename and perimeter rework.*

**UI**
- Game title changed from "The Last Light" to "Mistwalker."
- Perimeter card reworked: shows priest count with individual % contribution hover.

> Snapshot: mistwalker-0.17.html

## Alpha 0.16
*Defense rework and training UI.*

**Systems**
- Farmers no longer contribute to defense unless garrisoned.
- Travel encounters: 10% daily random encounter chance on expeditions to known locations.
- MW artifact restriction: only attack, defense, or endurance effects.

**UI**
- "Mist Walker" renamed to "Mistwalker" throughout.
- Training buttons show duration (e.g. "Fighter (7d)").
- Combat messages: proper creature name pluralization, active stat bolded.
- Conditional "+ Scholar" and "+ Engineer" buttons only appear when available.

> Snapshot: mistwalker-0.16.html

## Alpha 0.15
*Endurance rework and perimeter stability.*

**Systems**
- Spirit is now the foundation of mist endurance: `spirit + floor(exp/5)`.
- Perimeter stability is endurance-based per priest: each contributes `15 + endurance×2` percent.
- Bubble failure on expeditions: long trips with low-endurance priests risk collapse.

**QoL**
- Auto-assign for single-candidate workflows (lone engineer for dig, lone scholar for research).

> Snapshot: mistwalker-0.15.html

## Alpha 0.14
*Mist exploration system.*

**Systems**
- MW can explore the mist without a specific destination across three depth rings.
- The Shallows (any MW), The Grey Reach (range 4+), The Deep (range 7+).
- Each day rolls encounter and reward tables. Encounters end exploration early with injuries.
- Ring-appropriate rewards: locations, discoveries, food, survivors, artifacts, creature intel.

> Snapshot: mistwalker-0.14.html
