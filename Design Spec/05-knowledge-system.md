# The Knowledge System

Information is the rarest resource. This system is the nervous system of the monastery — perception feeds into interpretation, which feeds into capability.

## The Pipeline

**Perceive → Interpret → Unlock → Transform**

1. The Mist Walker perceives something in the world (clue, threat, artifact, location, lost person)
2. A Scholar interprets it (decodes, analyzes, forecasts, converts)
3. Interpretation unlocks a capability (new recipe, new transformation path, new location, threat counter)
4. The capability transforms the monastery (new verb, new strategy, new identity)

This pipeline is the spine of the game. Everything else serves it.

## Perception — The Mist Walker

The Mist Walker embodies attention scarcity. Each day, the MW can do ONE thing:

- **Explore** a ring for clues and discoveries
- **Scout** for incoming threats (provides advance warning and tactical advantage)
- **Rescue** someone lost in the mist
- **Investigate** a known location

The player is constantly choosing: "What do we spend our eyes on today?" That choice is never obvious because every option has value and every delay has cost.

A second (or third) Mist Walker multiplies perception bandwidth. This is a civilization-level leap — the monastery can now explore while scouting, or rescue while investigating. But every MW is a person who can never be anything else.

## Interpretation — The Scholars

Scholars convert raw perception into usable knowledge. Their work includes:

### Mist Nature Identification (Primary Function)
When the MW brings back samples or clues from a new ring, scholars decode what mist nature it carries. This is the **most survival-critical function** scholars perform. Without identification, priests cannot research the counter, soldiers don't know what they're fighting, and the monastery is pushing blind into unknown territory.

The identification process: MW brings back raw clues about the next ring → scholar analyzes them → the nature is identified → scholar researches the specific counter → counter knowledge is made available to priests for training.

This must happen BEFORE (ideally) or SHORTLY AFTER pushing into a new ring. Every day of delay is a day the perimeter faces a threat it doesn't understand.

### Map Fragment Assembly
The MW brings back map fragments — physical cartographic data about a ring. Enough assembled fragments reveal a vital location on the map. This is NOT scholar work — map fragments are assembled directly, like puzzle pieces. The MW finds them; the player sees the map fill in.

Map fragments tell you WHERE a vital location is. Source clues (found inside the location's Heart) tell you WHAT you need to know about the enemy. Two different knowledge types, two different discovery methods.

### Source Clue Interpretation
Source clues found in the Heart of vital locations are puzzles that require scholar interpretation. A single clue is cryptic. Multiple clues from different locations cross-reference and start making sense. Scholars decode them into actionable intelligence: Source weaknesses, phase transitions, counter-mechanics. This is the knowledge that determines whether the final assault succeeds or fails.

### Lore Research
Lore books and texts found in the field or underground are studied by scholars. They reveal:
- Information about the mist (what natures are in upcoming rings)
- Information about the source (phases, weaknesses, Ring 4's unique nature)
- Recipes and crafting knowledge
- Transformation requirements

### Threat Forecasting
Scholars can analyze patterns to predict what the mist will do next. Better scholars = earlier warnings = more preparation time. This makes scholar investment a form of strategic insurance. With the randomized nature pool, forecasting is even more critical — the player cannot assume what's coming.

### Material Conversion
Scholars convert raw materials into functional compounds:
- Corpses + herbs → nature-specific compounds
- Metals + texts → equipment upgrades
- Artifacts + research → transformation catalysts

### Dependency Unlocking
Some discoveries can't be understood yet. They go into the **Dependency Drawer** — sealed, with a hint about what's needed ("Requires Alchemical Facility" or "Requires Tome of Deep Sight"). When the dependency is met later, the drawer opens and the discovery becomes usable.

This is "fail forward." Nothing is permanently lost. Everything is deferred until the monastery is ready. This creates forward pull — unfinished mysteries drive future action.

## Knowledge States

Information in the game exists in one of four states:

1. **Unknown** — The monastery doesn't know this exists. The mist hides it.
2. **Perceived** — The MW found something, but it hasn't been interpreted yet. It's raw data.
3. **Interpreted** — A scholar has decoded it. The monastery understands what it is.
4. **Sealed** — A scholar attempted to decode it but lacks a dependency. It waits in the drawer.

This four-state model should be visible to the player. They should always be able to see: what do we know, what are we working on, and what are we waiting for?

## The Scholar's Growing Importance

Early game: Scholars feel marginal. They decipher clues, give minor buffs. The player might underinvest.

Mid game: Scholars become critical. Threat forecasting, compound creation, and transformation unlocking all depend on them. The player who invested early is rewarded. The player who didn't is scrambling.

Late game: Scholars are the difference between victory and defeat. Understanding the source's weaknesses, having the right counters, knowing what's coming — all scholar-dependent.

This escalating importance is a design feature. It rewards long-term thinking over short-term optimization.

## Scholar Work Rules

**Pass or fail, never misinterpret.** When a scholar attempts to decode something, the outcome is binary: they either succeed or they don't. A failed attempt means the scholar needs more time, more data, or a better facility — NOT that they decoded it wrong. The player never has to second-guess whether their scholars gave them bad intel. If a scholar says "this ring carries crystalline mist," it IS crystalline mist.

**Scholars can collaborate.** Multiple scholars assigned to the same research task work faster. Collaboration compresses the timeline — two scholars on a mist nature identification finish sooner than one. This makes additional scholars genuinely valuable even if one could eventually do everything alone.

**Pacing numbers are playtest-tunable.** Scholar speed, decode duration, collaboration bonuses, and research task lengths will be exposed as config values. Initial numbers will be set to keep the playtest fast (matching the clock philosophy), then adjusted based on feedback.

## Open Questions

- How many actions can a MW take per day? Always one, or can it increase?
- [x] What determines scholar speed? **Pass/fail system, collaboration allowed. Pacing numbers are config values, playtest-tunable.** *(Resolved 2026-02-12)*
- [x] How many scholars can work on the same thing simultaneously? **Multiple scholars can collaborate on the same task, compressing the timeline.** *(Resolved 2026-02-12)*
- [ ] What triggers threat forecasting? Is it automatic or must the player assign a scholar to it?
- [ ] How transparent should the dependency drawer be? Full hints or vague clues?
- [x] Can scholars fail in ways that create interesting consequences (misinterpretation)? **No. Scholars pass or fail, never misinterpret. Failed attempts mean more time/data needed, not wrong intel. Player never second-guesses scholar output.** *(Resolved 2026-02-12)*
