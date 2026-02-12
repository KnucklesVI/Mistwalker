# Mistwalker — Game Design Briefing

You are being consulted on the design of **Mistwalker**, a single-player browser roguelike. This document gives you full context. Read it, then offer your ideas on the open questions at the end.

---

## What the Game Is

A fragile monastery of ~20 people resists a supernatural mist. The player manages labor, perception, and knowledge to outpace an escalating threat. Runs last 2-4 hours. Death is expected, instructive, and fun.

This is not a growth simulator where you outscale the threat. It's a stewardship game where you manage a fixed community under pressure, making hard choices about who becomes what, what to investigate, and when to commit.

## The Six Words (Design DNA)

Every mechanic must serve at least one of these. If it doesn't, it doesn't belong.

- **Comprehension** — You are a mind trying to understand a world that is actively trying to erase you. The mist is ignorance. The game's central question: do you know enough yet?
- **Wonder** — What pulls you deeper. The moment a discovery changes what's possible. Without wonder, comprehension is just homework.
- **Efficiency** — What makes you feel clever. Holding the perimeter with three priests instead of five, freeing two souls for something that matters. The game rewards your intelligence.
- **Agency** — What makes it yours. The moment you look at two imperfect options and commit. Not because the game told you to, but because you read the situation and made a bet.
- **Attachment** — What gives everything weight. Twenty named people, not two hundred disposable units. Loss is a story, not a number going down.
- **Tension** — What makes the whole thing breathe. The oscillation between tight and release. The base is exposed while the expedition is out. They come home. You exhale. You push again.

## The Monastery as Organism

The monastery is a living thing with organs. The player is the mind — deciding where to direct attention, what to prioritize, what to sacrifice.

- **Senses** — Mist Walkers (the only way information enters the system)
- **Brain** — Scholars (interpret raw perception into usable knowledge)
- **Immune System** — Priests (hold back the mist, enable operations)
- **Muscles** — Soldiers & Engineers (fight, build, dig)
- **Metabolism** — Workers (food, materials, raw production)

All organs draw from the same pool of people. Every system competes with every other system for the same scarce resource: human labor.

## The Six Roles

Exactly six roles. Depth comes from progression, not adding more types.

**Priest** — Generates sacred bandwidth that maintains the perimeter barrier against the mist. Creates protective bubbles for expeditions. Performs rites (resurrection, sanctification). The most critical early-game role.

**Engineer** — Builds traps, fortifications, infrastructure. Digs underground to excavate ancient facilities. Crafts items. Competes with himself: building traps vs. digging vs. constructing.

**Soldier** — Fights raids, escorts expeditions, defends the base. The monastery's capacity for violence.

**Worker** — Farms food, harvests wood, mines stone and metal. Assists engineers on digs. The backbone — if workers stop, everything stops.

**Scholar** — Deciphers clues to reveal locations. Decodes lore. Forecasts threats. Converts materials into compounds. Unlocks transformations. Marginal early, absolutely critical mid-to-late.

**Mist Walker** — The ONLY way information enters the monastery. Explores the mist, finds clues, scouts threats, rescues lost people. One action per day. Permanent commitment — once someone becomes a MW, they can never change back.

## Progression Model

Three tiers for every role:

**Novice** → **Veteran** → **Elevated**

- **Novice:** Starting state. Competent but unremarkable.
- **Veteran:** Earned through sustained work (XP from active duty) plus a defining moment (milestone gate). Purely quantitative — same things, done better.
- **Elevated:** The qualitative leap. Specialization happens here. An elevated scholar becomes an Alchemist OR a Herbalist OR a Cartographer. This choice is permanent and defines what that character can do for the rest of the run.

**Non-standard transformations** can also occur from lived experience: surviving the mist, being resurrected, binding to an artifact, witnessing a mythic event. These grant unique traits that can't be planned for.

**Role switching** is allowed at any tier but always resets to novice. A veteran soldier who becomes a priest starts as a novice priest. An elevated Alchemist who switches loses everything. Almost never worth it — exists only for desperate moments. MW commitment is the one thing that can never be undone.

## The Mist

The mist is the emanation of a living intelligence (the final boss) that is waking up. It's the game's primary antagonist, difficulty scaling mechanism, and thematic core.

**Escalation model:** The mist has three tiers matching the three exploration rings. Within each tier, threats intensify daily (bigger raids, tougher enemies, more perimeter pressure). But the qualitative shift — from physical to corrupt to ethereal — only happens when the PLAYER pushes into the next ring. The player controls the tempo. They can turtle in Ring 1, but every day the physical raids get harder. Pushing into Ring 2 resets difficulty to a standard Tier 2 baseline but introduces corruption, which requires new tools (alchemy, transformed priests).

**The perimeter** is the monastery's boundary against the mist. Requires constant sacred bandwidth from priests. If stability drops below thresholds, people can be taken by the mist. Critical design rule: perimeter loss must connect to player decisions, not pure randomness.

**The source (final boss)** is a knowledge fight, not a stat check. Throughout the run, clues reveal its phases, immunities, and weaknesses. The player decides when they have "enough" knowledge to commit. Going early = gamble. Going late = harder mist. Neither is safe.

## The Knowledge Pipeline

**Perceive → Interpret → Unlock → Transform**

This is the game's spine. Everything else serves it.

1. MW perceives something (clue, threat, artifact, location, lost person)
2. Scholar interprets it (decodes, analyzes, forecasts, converts)
3. Interpretation unlocks a capability (recipe, transformation path, location, threat counter)
4. Capability transforms the monastery (new verb, new strategy, new identity)

MW gets one action per day: explore, scout, rescue, or investigate. This is the most agonizing daily decision — "what do we spend our eyes on today?"

**The Dependency Drawer:** Some discoveries can't be understood yet. They're sealed with a hint ("Requires Alchemical Facility"). When the dependency is met later, the drawer opens. Nothing is permanently lost. Failed decoding is deferred, not destroyed.

## Exploration (Two Axes)

**Outward — The Rings:**
- Ring 1 (Shallows): Physical threats. Tutorial ring.
- Ring 2 (Corrupt): Corruption mechanics. Tests adaptation.
- Ring 3 (Ethereal): Metaphysical threats. Path to the source.
- Rings are permission checks, not hard gates. You CAN push early — it just costs more.

**Downward — Archaeology:**
- The monastery is built on buried ancient infrastructure.
- Engineers + workers dig. Reveals facilities, tomes, artifacts, lore, sealed mysteries.
- Slower and safer than mist exploration, but competes for the same labor.

## Decisions Made So Far

| Decision | Detail |
|----------|--------|
| Starting roster | 4 Priests, 4 Soldiers, 1 Engineer, 5 Workers, 1 Scholar, 1 Mist Walker, 4 Unassigned = 20 |
| Population cap | 30 (start at 20, grow through rescues/events) |
| Mist escalation | Player-triggered tier shifts + within-tier daily pressure. Resets on ring advancement. |
| Role switching | Anyone can switch at any tier, always resets to novice. MW is permanent. |
| Veteran progression | Hybrid: XP from active duty + milestone gate for promotion |
| Architecture | State machine (turn phases) + command queue (all actions) + notification bus (UI only). Portable core / browser shell split. |

## Key Design Rules

1. Both options in any fork must have real value AND real cost.
2. Death spirals must originate from player decisions, NEVER from pure RNG on a stable base.
3. Every death must be traceable to a choice. The player should always be able to point to the moment they gambled and lost.
4. Discoveries should change how the player THINKS, not just what numbers they have.
5. Characters are people with histories, not stat blocks. Names grow Gandalf-style as they experience major events.
6. The game targets keyboard-first navigation.

## Event Hierarchy

- **Routine:** Daily feed noise. Worker farmed. Soldier trained.
- **Notable:** Worth pausing for. Raid incoming. Someone injured. Dig breakthrough.
- **Mythic:** Full-screen interrupt. 5-8 per run. First resurrection. First new mist element. A character undergoing a rare transformation. Chapter breaks.

---

## What We Need Your Ideas On

### 1. Specialization Paths (Most Important)

Each role needs 2-3 specialization paths available at Elevated tier. These are the strategic identity forks — "what kind of monastery are we building?"

For each specialization, we need:
- **A name** that feels monastic/medieval/atmospheric
- **A signature capability** that changes what's possible (not just +10% to something)
- **A tradeoff** — gaining this means losing something or closing a door
- **How it connects to the six words** — which of Comprehension, Wonder, Efficiency, Agency, Attachment, Tension does it serve?

We need specializations for: **Priest, Engineer, Soldier, Worker, Scholar, Mist Walker.**

Guidelines:
- Alchemist and Herbalist are Scholar specializations, NOT separate roles
- Specializations within a role should present genuinely agonizing choices — not one obvious best pick
- Think about how specializations across different roles might synergize or create tension (e.g., a certain priest specialization might work especially well with a certain scholar specialization)
- Non-standard transformations (from lived experience) are separate from these — they're emergent, not chosen

### 2. Milestone Gates for Veteran Promotion

Characters need a defining moment to promote from Novice to Veteran (in addition to accumulated XP). What should the milestone be for each role? It should feel earned and narratively meaningful, not arbitrary.

### 3. The Source / Final Boss

The final boss is a knowledge fight. We need ideas for:
- How many phases?
- What kinds of weaknesses the player must discover?
- What makes the assault feel like a culmination of everything learned, not just a stat check?
- How does the "do I have enough knowledge to go?" decision feel agonizing?

### 4. Cross-Role Synergies and Tensions

What combinations of specializations across roles should create interesting emergent strategies? What should feel like "these two specialists are amazing together" versus "I can't have both, which do I choose?"

### 5. Anything We're Missing

Based on the full picture above, what gaps do you see? What systems or mechanics are we not thinking about that would serve the six words? What feels underdeveloped?

---

## Tone Notes

The game's aesthetic is monastic, muted, atmospheric. Dark background, warm amber accents, typography-driven. The voice is spare but not cold — it should feel like reading a chronicle, not a spreadsheet. Think Darkest Dungeon's narrator meets a medieval scriptorium.

When suggesting names and flavor, aim for that register. Not high fantasy ("Archmage Pyrotechnicus") and not modern ("DPS Specialist"). Something grounded and evocative: "Keeper of the Veil," "The Ashwright," "Brother of the Deep Root."
