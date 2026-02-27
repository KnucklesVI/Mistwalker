# Creature & Trait System Proposal (v3 — Refined)

## Overview

Creatures have randomly assigned **traits** that make up their offensive power. These traits are hidden from the player and must be discovered through scouting, fighting, lore, and research. Countering a trait requires finding the right book in your library, studying it, and applying the resulting doctrine/ability in combat. All knowledge feeds into a **Compendium** managed by the **Librarian** (a unique scholar promotion).

---

## Creature Stats

- **Base damage/defense** (same number for both): doubles per size
  - Small: 4 base → 2 traits
  - Medium: 8 base → 3 traits
  - Large: 16 base → 4 traits
- **Each trait** adds 3-5 bonus damage/defense (randomly rolled per creature type at world gen)
- **Total effective power** = base + sum of all trait bonuses
- Example medium creature: 8 base + 3 traits averaging 4 each = 20 total
- **Size is raid-specific** — creatures have all three sizes. Size only matters when a raid is composed (how many, how big). MW field encounters don't involve size.

---

## The 20 Traits

Each trait describes HOW the creature fights. When countered, its bonus is negated. Planning to double to 40 eventually.

### Physical Traits (how they attack/move)
| # | Trait | Scout Description | Counter Approach |
|---|-------|------------------|-----------------|
| 1 | **Burrowing** | "They seem to move beneath the surface" | Collapse tunnels, ground wards |
| 2 | **Armored** | "Their hide looks thick as stone" | Target weak joints, piercing weapons |
| 3 | **Flying** | "They approach from above the walls" | Nets, ranged volleys, sky wards |
| 4 | **Swarming** | "They move in eerie coordination, as one" | Area denial, disruption formations |
| 5 | **Charging** | "They build terrifying speed before impact" | Bracing structures, redirecting barriers |
| 6 | **Grappling** | "Long limbs designed for seizing and holding" | Slick coatings, severing techniques |
| 7 | **Camouflaged** | "They blend into the mist until nearly upon you" | Detection wards, perimeter alarms |

### Elemental Traits (energy they wield)
| # | Trait | Scout Description | Counter Approach |
|---|-------|------------------|-----------------|
| 8 | **Heat Aura** | "The air shimmers with heat around them" | Cooling agents, frost wards |
| 9 | **Electric** | "Sparks crackle across their bodies" | Grounding pylons, insulation |
| 10 | **Frost Touch** | "A numbing cold radiates from their presence" | Warming fires, thermal wraps |
| 11 | **Corrosive** | "A foul liquid drips from their appendages" | Purification, resistant coatings |
| 12 | **Shadow Cloak** | "Darkness clings to them like a second skin" | Light sources, luminous wards |
| 13 | **Spore Cloud** | "A haze of particles drifts in their wake" | Air filtration, wind channeling |

### Supernatural Traits (strange abilities)
| # | Trait | Scout Description | Counter Approach |
|---|-------|------------------|-----------------|
| 14 | **Phasing** | "They flicker in and out of visibility" | Spiritual anchoring, true-sight |
| 15 | **Regenerating** | "Wounds close almost as fast as they open" | Cauterizing strikes, burning pitch |
| 16 | **Sonic** | "A terrible keening precedes their approach" | Sound dampening, morale fortification |
| 17 | **Fear Aura** | "A paralysing dread washes over those nearby" | Mental discipline, courage rites |
| 18 | **Life Drain** | "The living feel weaker in their presence" | Soul wards, vital sealing |
| 19 | **Mimic** | "They seem to learn and repeat what they see" | Unpredictable tactics, feint drills |
| 20 | **Hive Mind** | "Wound one and the others react as if they felt it" | Simultaneous strikes, severance rites |

---

## Roles, Stations & Combat

### Priest
**Stations:** Perimeter (holding back mist), Tower
**Combat — active choice each fight (pop-up):**
| Action | Timing | Effect | Trade-off |
|--------|--------|--------|-----------|
| **Ward** | Before combat (prep phase) | Place a persistent effect on a wall, tower, or area | Takes prep time, limited number active |
| **Invoke** | During combat | Active spiritual power targeting a specific threat | Stops mist-holding while active |
| **Pray** | During combat | General spiritual buff to nearby allies | Stops mist-holding while active |
| **Cancel** | During combat | Do nothing — stay on perimeter duty | No offensive contribution |

Each fight, each priest gets this pop-up. The key trade-off: use your priest offensively (invoke/pray) and risk the mist pushing in, or keep them on perimeter (cancel).

### Soldier
**Stations:** Garrison (default), Tower (protecting a priest — special, against priest-targeting creatures), Expedition, Dig Detail
**Combat — doctrine selection:**
- Soldiers learn **doctrines** from books (passive abilities)
- Each fight, the player selects which doctrine a soldier should **try**
- After the fight, feedback: "Cauterizing strikes seemed effective" or "No noticeable effect"
- This is how the player field-tests counters against creature traits
- Doctrines apply automatically once confirmed — the testing is the active part

### Engineer
**Stations:** Workshop, Dig, Expedition
**Combat — all pre-combat prep:**
| Action | Timing | Effect |
|--------|--------|--------|
| **Build** | Days before raid | Construct a device, trap, or structure. Costs resources + prep days |
| **Modify** | Days before raid | Upgrade or adapt existing defenses for a specific threat |
| **Deploy** | During combat | Activate a pre-built mechanism (one-shot use) |

Engineers don't make active decisions during combat — everything is preparation. Deploy triggers automatically or is pre-assigned.

### Scholar (non-librarian)
**Station:** Always in the research area
**No combat role.** Scholars process incoming field intel:

| Work Type | Source | Duration | Output |
|-----------|--------|----------|--------|
| **Creature field notes** | MW observations from encounters/sightings | 1-2 days | Decoded info → compendium (via librarian) |
| **Lore fragments** | MW finds (inscriptions, carvings, old records) | 1-3 days | Trait hints, historical context, or dead end |
| **Map fragments** | MW finds, expedition discoveries | 1 day each | Accumulate toward revealing a location on Explore tab |
| **Creature remains** | Brought back from field/battles | 2-3 days | Could confirm a trait or reveal base stats |
| **Unique artifacts** | Rare MW finds (2-3 per game) | 5+ days | Game-changing unlock (see Unique Finds below) |
| **General research** | Existing clue/research queue | Varies | Broader knowledge progression |

### Librarian (unique promotion from Scholar — only one per settlement)
**Station:** Library (permanent, full-time)
**What they do:**
- **Browse/Scavenge** for books (the two library modes)
- **Study** books to unlock abilities and doctrines for other roles
- **Identify** traits from accumulated clues
- **Maintain the Compendium** — all knowledge feeds here
- **Unlocks the Library tab** with the Compendium when promoted

The librarian is the only person who works the library. This is their full-time job. Other scholars are freed to process field intel.

### Mist Walker
**Stations:** Home (default — passive defense bonus to monastery), Perimeter (can substitute for priest on mist duty — loses defense bonus), Scouting, Expedition
**One active form:**
| Action | Duration | Effect |
|--------|----------|--------|
| **Scout** | 1 day | Recon incoming raid — reveals name, size, count, exact days, trait descriptions. +10% defense bonus (intel advantage, not surprised) |

Otherwise passive:
- **Home**: Monastery gets a defensive bonus just from MW being present
- **Perimeter**: MW can hold mist like a priest, but loses the passive defense bonus
- MW always survives combat (even if injured)
- MW does NOT carry items — artifacts auto-retrieved from monastery battles

### Worker
**Stations:** Resource gathering (food/wood/stone), Dig, Expedition (hauling)
**No combat role.**

---

## Library System: Two Browse Modes

### Targeted Browse (1 book/day)
- Librarian picks a topic (priest, soldier, engineer, creature, or a specific trait keyword)
- Gets 1 relevant title from that category
- Use when you KNOW what you're looking for

### General Scavenge (5 books/day)
- Librarian grabs 5 random books from the full catalog (~580 titles)
- ~80% are filler (no mechanical value, just flavour titles)
- ~20% relate to a trait counter, role ability, or creature knowledge
- On average: ~1 useful book per scavenge session
- All 5 go onto the personal unread shelf
- Use early game to stockpile, or when you don't know what threats are coming

### Personal Shelf
- Books accumulate over time
- **Title only** visible at a glance
- **Click a book** to see its hint (the "back cover" description)
- **Commit a day** to actually read it and learn what's inside
- Picking what to read is the core strategic decision

---

## How Books Enter the Library

| Source | How |
|--------|-----|
| Librarian browsing/scavenging | Main pipeline, daily activity |
| MW brings books from expeditions | Found in the field, handed to librarian |
| Dig teams unearth books | Existing tomeChancePerDay mechanic |
| Expedition parties find books at locations | Ancient libraries, caches, etc. |

---

## MW Intel Categories

### What the MW brings back from exploration:

**Creature Intel:**
| Type | What happens | Compendium result |
|------|-------------|-------------------|
| **Sighting** | Saw creatures at a distance | New creature added, no stats |
| **Field combat** | Fought a creature | Base damage/defense learned + one trait hint |
| **Signs/tracks** | Found evidence (gouges, residue, nests) | Trait hint added, no stats |
| **Behavioral observation** | Watched from hiding | Trait description, no combat data |

**Location Intel:**
| Type | What happens |
|------|-------------|
| **Partial clue** | Trail markers, structures glimpsed, unusual terrain → progress toward revealing a site |
| **Full discovery** | Enough clues accumulated → site revealed on Explore tab |

**Physical Finds:**
| Type | Goes to |
|------|---------|
| Books/tomes | Librarian |
| Map fragments | Scholar (processing) → Explore tab |
| Construction materials | Stockpile |
| Creature remains | Scholar (analysis) → Compendium |
| Weapons/armor/tools | Usable or need repair |
| Religious/spiritual objects | Priest use or scholar analysis |
| Alchemical supplies | Engineer use |
| Personal effects (journals, letters) | Scholar (lore fragments) |

---

## Unique Finds (2-3 per game per ring)

One-of-a-kind discoveries that make each playthrough different. These are rare, exciting, and game-changing:

| Type | Effect |
|------|--------|
| **Class Tome** | Unlocks a unique role variant for one character. Only exists in this playthrough. Changes strategic options, not strictly better — just different. |
| **Structure Blueprint** | A building you can't normally construct. Opens up a strategy that wouldn't otherwise exist. |
| **Unique Weapon/Artifact** | Named item with a specific power that changes how a fight plays out. |
| **Ancient Technique** | A one-of-a-kind ability for a specific role, not found in any book. |
| **Sealed Knowledge** | Requires significant effort to unlock (many days, specific language). Huge payoff — could reveal all traits of one creature type, or permanent stat buff. |

These are found by the MW during exploration. Scholar takes 5+ days to analyze before the player knows what they have.

---

## The Compendium (Library Tab — Librarian only)

The central repository of all creature knowledge. Each creature type gets a profile that fills in as you learn:

### Compendium Entry Progression:

**Empty** → Just learned this creature exists (MW sighting or signs)
- Name: "Unknown Creature" or physical description
- No stats, no traits

**Partial** → Some intel gathered
- Base stats (if MW fought it or librarian studied creature books)
- Total damage (if fought in a raid)
- Gap between base and total noted (tells you how much comes from traits)
- Scout descriptions (if scouted a raid with this creature)
- Trait hints from MW lore, signs, observations
- Doctrines tested: "Cauterizing Strike: EFFECTIVE" / "Insulated Stance: NO EFFECT"

**Full** → All traits identified and countered
- All traits listed with confirmed counters
- Complete damage breakdown (base + each trait's contribution)
- Optimal defense loadout documented

### What feeds the Compendium:
- MW field encounters and observations
- MW scouting reports
- Raid combat results
- Soldier doctrine test results
- Librarian studying creature books (base stats)
- Scholar analysis of creature remains
- Scholar-decoded lore fragments

---

## How Counters Connect to Traits

Each trait has a **primary counter** (full negation) and a **secondary counter** (~50% negation).

| Trait | Primary Counter | Role:Form | Secondary Counter | Role:Form |
|-------|----------------|-----------|-------------------|-----------|
| **Burrowing** | Tunnel Collapse Traps | Engineer:Build | Ground Consecration | Priest:Ward |
| **Armored** | Weak Point Targeting | Soldier:Doctrine | Armor-Piercing Bolts | Engineer:Build |
| **Flying** | Net Launchers | Engineer:Deploy | Sky Ward | Priest:Ward |
| **Swarming** | Disruption Formation | Soldier:Doctrine | Scatter Ward | Priest:Ward |
| **Charging** | Bracing Barricades | Engineer:Build | Sidestep Stance | Soldier:Doctrine |
| **Grappling** | Severing Strike | Soldier:Doctrine | Slick Coating Traps | Engineer:Build |
| **Camouflaged** | Detection Ward | Priest:Ward | Tripwire Perimeter | Engineer:Build |
| **Heat Aura** | Cooling Flood Traps | Engineer:Build | Frost Invocation | Priest:Invoke |
| **Electric** | Grounding Pylons | Engineer:Build | Insulated Stance | Soldier:Doctrine |
| **Frost Touch** | Warming Braziers | Engineer:Build | Inner Fire Rite | Priest:Invoke |
| **Corrosive** | Purification Rite | Priest:Invoke | Resistant Coatings | Engineer:Build |
| **Shadow Cloak** | Luminous Ward | Priest:Ward | Flare Launchers | Engineer:Deploy |
| **Spore Cloud** | Wind Channels | Engineer:Modify | Breath Discipline | Soldier:Doctrine |
| **Phasing** | Spiritual Anchor | Priest:Invoke | True-Sight Focus | Soldier:Doctrine |
| **Regenerating** | Cauterizing Strike | Soldier:Doctrine | Burning Pitch Traps | Engineer:Build |
| **Sonic** | Sound Dampening Walls | Engineer:Modify | Steadfast Formation | Soldier:Doctrine |
| **Fear Aura** | Courage Rite | Priest:Invoke | Iron Will | Soldier:Doctrine |
| **Life Drain** | Soul Ward | Priest:Ward | Vital Sealing Salve | Engineer:Build |
| **Mimic** | Feint Tactics | Soldier:Doctrine | Chaos Blessing | Priest:Invoke |
| **Hive Mind** | Severance Rite | Priest:Invoke | Simultaneous Strike | Soldier:Doctrine |

---

## Knowledge Discovery Loop

### The Player's Path:
1. **Raid announced** → Scout it (MW, 1 day) → learn descriptions, hints, exact count/timing
2. **Raid hits** → Learn total damage
3. **Librarian studies creature book** → Learn base damage → gap = trait total
4. **Read scout descriptions** → "shimmers with heat"... maybe fire?
5. **Scan personal shelf** → Spot *Water and Its Forms* → spend a day reading
6. **Next raid, soldier tries doctrine** → Select "Frost Invocation" for this fight
7. **After fight** → "Frost Invocation seemed effective!" → Confirmed in compendium
8. **Damage reduced permanently** for that trait. Move on to next trait.

### Alternate Paths:
- MW fights creature in the field → base stats + trait hint go directly to compendium
- MW finds signs/tracks → trait hint without stats
- Scholar analyzes creature remains → could confirm a trait
- Librarian studies lore fragments → historical trait references

---

## Artifact Retrieval Rules

| Scenario | What happens to items |
|----------|--------------------|
| **Monastery battle** | Auto-retrieved after combat |
| **Expedition — some survive** | Priest holds fallen member's artifact, party brings everything back |
| **Expedition — total wipe** | Items stay at location. MW survives (always, even if injured) but does NOT carry items. Future expedition to same location can retrieve them. |
| **MW expedition alone** | MW always survives. Items stay at location if he has to flee. |

---

## Counter Book Titles (5 per trait)

Mix of real counters (4) and duds (1) per trait. Player sees title only on shelf; clicks for hint.

### Trait 1: Burrowing
| Title | Hint | Real? | Counter |
|-------|------|-------|---------|
| *Foundations Upon Shifting Ground* | Techniques for stabilising structures when the earth beneath them cannot be trusted. | YES | Engineer:Build |
| *The Sanctity of Earth: Blessing What Lies Below* | Rituals for consecrating the ground so deeply that nothing unholy may pass through. | YES | Priest:Ward |
| *Creatures of the Underdark: Habits and Habitats* | Observations of subterranean fauna, including nesting patterns and tunnel construction. | YES | Scholar:Identify |
| *Deep Roots and Deeper Problems* | A farmer's lament about root vegetables and drainage. Surprisingly philosophical. | DUD | — |
| *Soil Compaction Techniques for Fortification* | Engineering methods for hardening earth to resist undermining and collapse. | YES | Engineer:Modify |

### Trait 2: Armored
| Title | Hint | Real? | Counter |
|-------|------|-------|---------|
| *The Point of Entry: Where Shells Are Thinnest* | Anatomical studies of hard-shelled creatures, noting stress fractures at joints. | YES | Soldier:Doctrine |
| *Metallurgy of Penetrating Implements* | How to forge tools and weapons designed to pierce dense material. | YES | Engineer:Build |
| *On Carapace: Structure and Failure Under Stress* | Analysis of natural armour and the forces required to breach it. | YES | Scholar:Identify |
| *The Unbreakable: Legends of Impervious Beasts* | Dramatic tales of creatures no weapon could harm. Exciting but useless. | DUD | — |
| *Leverage and Force Concentration in Small Tools* | Physics of applying maximum force through minimal contact area. | YES | Engineer:Build |

### Trait 3: Flying
| Title | Hint | Real? | Counter |
|-------|------|-------|---------|
| *Weighted Nets and Their Deployment from Height* | Practical guide to constructing and launching nets to bring down aerial threats. | YES | Engineer:Deploy |
| *Prayers Against What Descends From Above* | Spiritual protections for open spaces vulnerable to attack from the sky. | YES | Priest:Ward |
| *Winged Threats: Observation and Classification* | Naturalist's guide to identifying and categorising airborne creatures of the mist. | YES | Scholar:Identify |
| *On the Grace of Birds and the Envy of the Earthbound* | Poetic meditation on flight. Beautiful, but offers nothing tactical. | DUD | — |
| *Elevation Defence: Holding Rooftops and Parapets* | Soldier's manual for fighting from high ground against aerial foes. | YES | Soldier:Doctrine |

### Trait 4: Swarming
| Title | Hint | Real? | Counter |
|-------|------|-------|---------|
| *Breaking the Herd: Isolating Coordinated Threats* | Tactical doctrine for disrupting groups that fight as one. | YES | Soldier:Doctrine |
| *Wards of Dispersal and Scattering* | Spiritual barriers designed to break apart groups and prevent concentration. | YES | Priest:Ward |
| *Swarm Behaviour in Mist-Touched Fauna* | Scientific observations of collective movement in mist creatures. | YES | Scholar:Identify |
| *The Strength of Numbers: Why Groups Prevail* | Philosophical argument that cooperation always triumphs. Interesting but unhelpful. | DUD | — |
| *Choke Points and Funnelling: A Tactical Guide* | Engineering terrain to force groups into narrow, manageable channels. | YES | Engineer:Modify |

### Trait 5: Charging
| Title | Hint | Real? | Counter |
|-------|------|-------|---------|
| *Receiving the Charge: What Stands and What Falls* | Analysis of structures and formations that can absorb high-speed impact. | YES | Engineer:Build |
| *The Matador's Principle: Redirecting Momentum* | Techniques for sidestepping and turning an attacker's force against itself. | YES | Soldier:Doctrine |
| *Velocity and Mass: When Speed Becomes a Weapon* | Studies of impact physics applied to creature behaviour. | YES | Scholar:Identify |
| *The Unstoppable: Tales of Beasts That Never Slowed* | Fireside stories about stampeding monsters. Thrilling but impractical. | DUD | — |
| *Angled Barriers and Deflection Walls* | Engineering designs that redirect charging force harmlessly to the side. | YES | Engineer:Modify |

### Trait 6: Grappling
| Title | Hint | Real? | Counter |
|-------|------|-------|---------|
| *Escape the Hold: Breaking Free of Superior Grip* | Combat techniques for escaping when seized by a stronger opponent. | YES | Soldier:Doctrine |
| *Slick Surfaces and Their Military Applications* | How greased or coated surfaces prevent creatures from maintaining grip. | YES | Engineer:Build |
| *Tentacle and Tendril: Anatomy of the Grasping Limb* | Structural analysis of grappling appendages and their mechanical limits. | YES | Scholar:Identify |
| *The Embrace of the Deep: Maritime Horrors* | Sailor's tales of sea creatures. Wrong environment entirely. | DUD | — |
| *Severing Blades: Designed for Limb Removal* | Specialised weapon designs optimised for cutting through thick appendages. | YES | Engineer:Build |

### Trait 7: Camouflaged
| Title | Hint | Real? | Counter |
|-------|------|-------|---------|
| *Wards of Revelation: Making the Hidden Seen* | Spiritual techniques for exposing what conceals itself. | YES | Priest:Ward |
| *Tripwire Systems for Perimeter Detection* | Mechanical alarm networks that detect movement regardless of visibility. | YES | Engineer:Build |
| *Patterns of Concealment in Mist Fauna* | How certain creatures blend into mist and what betrays their presence. | YES | Scholar:Identify |
| *The Art of Hiding: Camouflage in the Natural World* | Charming study of animal camouflage. No mention of countering it. | DUD | — |
| *Dust and Powder: Marking What Cannot Be Seen* | Throwing agents that cling to invisible or camouflaged surfaces. | YES | Soldier:Doctrine |

### Trait 8: Heat Aura
| Title | Hint | Real? | Counter |
|-------|------|-------|---------|
| *Water and Its Forms: From Mist to Ice* | Exploration of water's properties and how cold can be channelled spiritually. | YES | Priest:Invoke |
| *Thermal Regulation in Enclosed Spaces* | Engineering solutions for managing extreme heat in confined areas. | YES | Engineer:Build |
| *The Nature of Elemental Heat and Its Boundaries* | Scientific study of heat radiation in mist creatures and its measurable limits. | YES | Scholar:Identify |
| *Ash and Ember: A Meditation on Impermanence* | Philosophical musings on fire and decay. Lovely, but no practical value. | DUD | — |
| *Quenching Techniques for Superheated Materials* | Methods for rapidly cooling extremely hot surfaces and objects. | YES | Engineer:Deploy |

### Trait 9: Electric
| Title | Hint | Real? | Counter |
|-------|------|-------|---------|
| *Conducting Away the Storm: Principles of Grounding* | How to build structures that safely channel electrical energy into the earth. | YES | Engineer:Build |
| *The Insulated Warrior: Fighting in Charged Conditions* | Combat doctrine for soldiers facing electrically-charged opponents. | YES | Soldier:Doctrine |
| *Cataloguing Creatures of Spark and Arc* | Field observations of creatures that generate or store electrical energy. | YES | Scholar:Identify |
| *Ball Lightning and Other Atmospheric Curiosities* | Weather phenomena. Fascinating reading, zero combat relevance. | DUD | — |
| *Materials That Refuse the Current* | Survey of substances that block or absorb electrical discharge. | YES | Engineer:Modify |

### Trait 10: Frost Touch
| Title | Hint | Real? | Counter |
|-------|------|-------|---------|
| *Braziers of Endurance: Sustained Heat in Hostile Conditions* | Designs for portable heating that maintains function in extreme cold. | YES | Engineer:Build |
| *The Inner Fire: Spiritual Warmth Against Unnatural Cold* | Meditative techniques for maintaining body heat through spiritual focus. | YES | Priest:Invoke |
| *Cold-Blooded: Creatures That Weaponise Low Temperatures* | Study of organisms that radiate cold and the mechanisms behind it. | YES | Scholar:Identify |
| *Winter Recipes for the Homesick Traveller* | Comfort food. Genuinely heartwarming, but not what you need. | DUD | — |
| *Layered Garments and Thermal Retention Theory* | Practical textile engineering for cold-weather protection. | YES | Soldier:Doctrine |

### Trait 11: Corrosive
| Title | Hint | Real? | Counter |
|-------|------|-------|---------|
| *Cleansing the Tainted: Rites of Purification* | Rituals for neutralising corruption, venom, and acid through spiritual means. | YES | Priest:Invoke |
| *Resistant Coatings for Tools and Armour* | Chemistry of protective layers that withstand corrosive substances. | YES | Engineer:Build |
| *A Study of Noxious Substances and Their Effects* | Catalogue of corrosive, venomous, and toxic agents found in mist creatures. | YES | Scholar:Identify |
| *The Poison Garden: Beauty in Lethality* | A botanist's tour of dangerous plants. Wrong kingdom entirely. | DUD | — |
| *What the Body Rejects: On Natural Immunity* | Training the body to resist toxins through graduated exposure. | YES | Soldier:Doctrine |

### Trait 12: Shadow Cloak
| Title | Hint | Real? | Counter |
|-------|------|-------|---------|
| *Luminous Wards: Spiritual Light That Banishes Darkness* | How to create persistent areas of consecrated light that shadows cannot enter. | YES | Priest:Ward |
| *Flare Mechanisms: Sudden Light in Desperate Moments* | Engineering designs for devices that produce intense, brief illumination. | YES | Engineer:Deploy |
| *The Taxonomy of Darkness: Cataloguing Shadow Creatures* | Classification of creatures that use darkness as weapon or shield. | YES | Scholar:Identify |
| *Shadows on the Wall: A Children's Guide to Not Being Afraid* | Well-meaning but entirely useless for actual shadow creatures. | DUD | — |
| *Reflective Surfaces as Force Multipliers for Light* | Using mirrors and polished metal to amplify light sources across a defence. | YES | Engineer:Modify |

### Trait 13: Spore Cloud
| Title | Hint | Real? | Counter |
|-------|------|-------|---------|
| *Wind Channels and Directed Airflow in Settlements* | Engineering air movement to clear contaminants from inhabited areas. | YES | Engineer:Modify |
| *Breath Discipline: Fighting in Foul Conditions* | Military training for maintaining combat effectiveness in toxic air. | YES | Soldier:Doctrine |
| *Spore Biology: Dispersal, Toxicity, and Countermeasures* | Scientific analysis of fungal and creature-based spore systems. | YES | Scholar:Identify |
| *My Season Among the Drifters: A Personal Account* | Memoir of dubious credibility about living near spore creatures. | DUD | — |
| *Masks and Filters: Practical Respiratory Protection* | Designs for face coverings that block airborne particles. | YES | Engineer:Build |

### Trait 14: Phasing
| Title | Hint | Real? | Counter |
|-------|------|-------|---------|
| *Anchoring the Immaterial: Binding What Shifts* | Spiritual techniques for pinning partially-incorporeal entities into physical form. | YES | Priest:Invoke |
| *Seeing What Is Not Fully There* | Training the eye and mind to track things that phase between states. | YES | Soldier:Doctrine |
| *Between Here and Elsewhere: The Nature of Phasing* | Theoretical study of creatures that exist partially outside normal space. | YES | Scholar:Identify |
| *Ghost Stories of the Old Settlements* | Entertaining fireside tales. The ghosts in question were probably just mist. | DUD | — |
| *Consecrated Ground and Its Effect on the Intangible* | How blessed earth prevents phasing creatures from passing through. | YES | Priest:Ward |

### Trait 15: Regenerating
| Title | Hint | Real? | Counter |
|-------|------|-------|---------|
| *The Wound That Will Not Close: On Cauterisation* | Techniques for inflicting wounds that resist magical and biological healing. | YES | Soldier:Doctrine |
| *Burning Pitch: Preparation and Tactical Application* | How to prepare and deploy pitch-based weapons that prevent tissue regrowth. | YES | Engineer:Build |
| *Flesh That Remembers: Studies in Rapid Healing* | Analysis of regeneration mechanisms and what disrupts them. | YES | Scholar:Identify |
| *The Hydra Problem: Cutting Heads That Grow Back* | Mythological accounts of unkillable beasts. Great stories, bad advice. | DUD | — |
| *Sustained Assault Doctrines for Persistent Threats* | Tactics for maintaining continuous pressure so a foe cannot recover between blows. | YES | Soldier:Doctrine |

### Trait 16: Sonic
| Title | Hint | Real? | Counter |
|-------|------|-------|---------|
| *Silence as a Weapon: Dampening Hostile Sound* | Engineering sound-absorbing structures that neutralise acoustic attacks. | YES | Engineer:Modify |
| *The Unshaken Mind: Resisting What Assaults the Spirit* | Mental fortification against attacks that target morale and focus. | YES | Soldier:Doctrine |
| *Frequencies of the Mist: Acoustic Phenomena* | Catalogue of sound-based abilities observed in mist creatures. | YES | Scholar:Identify |
| *Music of the Spheres: Harmonic Theory* | Abstract musical theory. Intellectually stimulating, tactically empty. | DUD | — |
| *Wards of Inner Calm and Outer Silence* | Spiritual barriers that create zones of absolute quiet. | YES | Priest:Ward |

### Trait 17: Fear Aura
| Title | Hint | Real? | Counter |
|-------|------|-------|---------|
| *The Rite of Courage: Prayers That Steel the Heart* | Spiritual ceremonies that immunise the faithful against supernatural dread. | YES | Priest:Invoke |
| *Iron Will: Mental Conditioning for Extreme Conditions* | Military psychology for maintaining composure against fear effects. | YES | Soldier:Doctrine |
| *The Anatomy of Dread: How Fear Enters the Mind* | Study of fear-inducing mechanisms in mist creatures. | YES | Scholar:Identify |
| *Bedtime Stories for Nervous Children* | Calming tales. Charming, but your soldiers need more than a lullaby. | DUD | — |
| *Incense of Clarity: Aromatics That Calm the Mind* | Herbal preparations that create zones of mental resistance. | YES | Engineer:Build |

### Trait 18: Life Drain
| Title | Hint | Real? | Counter |
|-------|------|-------|---------|
| *Soul Ward: Protecting the Vital Essence* | Spiritual barriers that prevent the draining of life force. | YES | Priest:Ward |
| *Vital Sealing Salves and Their Preparation* | Alchemical preparations applied to skin that resist energy draining. | YES | Engineer:Build |
| *Parasitism in the Mist: Creatures That Feed on the Living* | Biological study of life-draining organisms and their feeding mechanisms. | YES | Scholar:Identify |
| *The Fading: Accounts of Those Who Grew Thin and Pale* | Sad stories of the drained. No information on prevention. | DUD | — |
| *Rotation Tactics: Fresh Fighters Against Attrition* | Doctrine for cycling soldiers to prevent prolonged exposure to draining effects. | YES | Soldier:Doctrine |

### Trait 19: Mimic
| Title | Hint | Real? | Counter |
|-------|------|-------|---------|
| *The Art of the Feint: Deception in Combat* | Tactics for misleading opponents that learn and copy your movements. | YES | Soldier:Doctrine |
| *Chaos as Strategy: The Blessing of Unpredictability* | Spiritual doctrine for fighting in deliberately erratic patterns. | YES | Priest:Invoke |
| *Adaptive Behaviour in Mist Fauna* | Study of creatures that learn from and repeat observed actions. | YES | Scholar:Identify |
| *The Mirror and the Mask: A Theatrical History* | History of drama and impersonation. Wrong kind of mimicry. | DUD | — |
| *Randomised Patrol Patterns and Unpredictable Defences* | Engineering systems designed to never repeat the same pattern twice. | YES | Engineer:Modify |

### Trait 20: Hive Mind
| Title | Hint | Real? | Counter |
|-------|------|-------|---------|
| *The Severance Rite: Cutting Bonds That Bind* | Spiritual technique for breaking the psychic connection between linked beings. | YES | Priest:Invoke |
| *Simultaneous Strike Doctrine: Hitting Many at Once* | Formation tactics for attacking all members of a linked group in the same instant. | YES | Soldier:Doctrine |
| *Collective Intelligence in Mist Organisms* | Research into creatures that share consciousness and how to disrupt it. | YES | Scholar:Identify |
| *Ants, Bees, and Other Social Insects: A Survey* | Charming nature study. The mist creatures are nothing like bees. | DUD | — |
| *Signal Jamming: Disrupting Communication Between Threats* | Engineering devices that interfere with coordinated enemy behaviour. | YES | Engineer:Deploy |

---

## Filler Book Pool (~400 titles)

These books have no mechanical value. They pad the scavenge pool and create false positives.

### Categories and Examples:

**History & Biography (~80):** *A Complete History of Regional Cheeses*, *The Rise and Fall of the Merchant Houses*, *Letters Between Two Generals Who Never Met*

**Philosophy & Religion (~60):** *On the Nature of Suffering and Its Purposes*, *The Paradox of Choice in Constrained Worlds*, *What We Owe the Dead*

**Natural Science (~60 — DANGER ZONE, many sound useful):** *Principles of Flame and Ash* (sounds like heat counter — not), *Root Systems and Underground Water Flow* (sounds like burrowing — no), *The Properties of Copper in Humid Conditions* (sounds like electric — no)

**Arts & Literature (~50):** *Sonnets for the End of the World*, *The Painter Who Only Used Grey*, *A Collection of Riddles Without Answers*

**Domestic & Practical (~50):** *Seventy Uses for Hemp Rope*, *Preserving Meat in Cold Climates*, *The Efficient Kitchen: Feeding Many With Little*

**Travel & Geography (~50):** *Roads That No Longer Lead Anywhere*, *Three Months in the Eastern Wastes*, *Tidal Patterns and Their Prediction*

**Medicine & Health (~50 — some misleading):** *Herbal Remedies for Common Ailments* (sounds like antidote — not), *The Surgeon's Steady Hand* (sounds military — just medicine), *A Treatise on Fever*

~15% of filler should be "false positive" titles that sound trait-related but aren't.

---

## Summary Numbers

- **20 traits** (planning to double to 40)
- **100 counter books** (80 real + 20 duds, 5 per trait)
- **80 existing role books** (priest/soldier/engineer/scholar abilities)
- **~400 filler books** (scavenge pool padding)
- **~580 total catalog**
- **Creature sizes**: Small (base 4, 2 traits), Medium (base 8, 3 traits), Large (base 16, 4 traits)
- **Each trait**: adds 3-5 damage/defense
- **Unique finds**: 2-3 per game per ring
- **Librarian**: One per settlement, unique scholar promotion
- **Scavenge**: 5 random books/day, ~1 useful on average
- **Targeted browse**: 1 relevant book/day
