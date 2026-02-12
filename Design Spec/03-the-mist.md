# The Mist

## What the Mist Is

The mist is not weather. It is the emanation of a living intelligence — the final boss — and it is waking up. The mist gets stronger not because the player pushed too far, but because **time is passing and the source is becoming more aware**. This is a clock. It ticks whether you act or not.

The mist is the game's primary antagonist, its difficulty scaling mechanism, and its thematic core. It represents ignorance, entropy, and the unknown. Everything the player does — exploring, studying, preparing — is resistance against the mist.

## The Clock

The mist escalates on its own timeline. Each day, the source grows slightly more aware, slightly more aggressive. This creates constant forward pressure: you can never just turtle and wait forever.

The escalation is not random. It follows a knowable (if not fully known) pattern. Scholars can forecast what's coming if the player invests in perception and interpretation. This is how the clock connects to the knowledge system — the better your scholars, the more warning you get about what's next.

## Mist Natures

The mist is not one thing. It has **natures** — qualitative types that define how it attacks, what lives inside it, and what it takes to hold it back. There is a large pool of possible natures: crystalline, darkness, glorious, decay, silence, hunger, and more. Each run draws from this pool differently. No two runs face the same sequence.

### The Stacking Model

Mist natures are **additive, not replacing**. Each ring adds a new layer on top of everything before it.

**Ring 1 — Standard Mist.** The baseline. Every run starts here. Any novice priest can hold this. This never goes away — it's the foundation that everything stacks on top of.

**Ring 2 — Standard + [Nature A].** When the player pushes into Ring 2, they discover it carries a secondary nature drawn from the pool. This nature starts bleeding back toward the monastery. Now the perimeter must hold against standard mist AND this new nature simultaneously. Priests need to learn the counter.

**Ring 3 — Standard + [Nature A] + [Nature B].** Ring 3 always has a DIFFERENT nature than Ring 2. The perimeter now faces three layers. Priests who mastered Nature A still need to learn Nature B. The defensive burden is significantly heavier.

**Ring 4 — Standard + [Nature A] + [Nature B] + [Source Nature].** The Source's ring has its own unique nature, different from Rings 2 and 3. The Source must still be found through exploration of Ring 4 — it doesn't just appear. The perimeter is now holding back four layers while the player searches for and prepares the final assault.

### The Adaptation Cycle

When a new nature appears, the monastery faces a crisis:

1. **MW brings back clues** about the new mist nature from the ring
2. **Scholars decode** what the nature actually is and research the counter
3. **Priests must come off the wall** to study the counter — they can't learn it while maintaining the perimeter
4. **While priests are training**, the perimeter is undermanned and vulnerable
5. **Trained priests return** to the wall with the new capability

This cycle creates a **temporary vulnerability window** every time the player pushes forward. The monastery needs enough priest coverage to absorb the gap while some are studying, or it accepts higher risk. More priests, more scholars, and better MW intelligence all compress this window — but it never disappears entirely.

### Priest Capability Stacking

A priest who learns to counter a nature **retains that ability permanently**. By late game, an experienced priest might handle standard mist plus two or three secondary natures. This makes veteran and elevated priests enormously valuable — not because of bigger numbers, but because of broader coverage. Losing a priest who can handle three natures is catastrophic in a way that losing a novice on Day 3 isn't.

### Mist Nature Discovery

The player does NOT automatically know what nature a ring contains. This must be **discovered through the knowledge pipeline** before or shortly after pushing into a new ring. Pushing blind means your priests can't prepare, your scholars can't research counters, and your soldiers don't know what they're fighting.

Smart play: scout the next ring's nature BEFORE pushing in. Send the MW to gather clues, let scholars decode them, begin priest training in advance. Then push when you're ready.

Reckless play: push first, discover the nature the hard way, scramble to adapt while the perimeter is under a new kind of pressure you don't understand yet.

### The Nature Pool

The full pool of possible mist natures is a design-phase deliverable (Phase C). Each nature needs:

- A **visual signature** — how it looks in the feed and on the interface
- A **defensive counter** — what priests need to learn to hold it back
- **Creature modifiers** — how it changes the stats and behavior of creatures in its ring
- **Signature creatures** — 1-3 unique creatures that only appear in this nature (see Mist Raids below)
- A **thematic feel** — what makes exploring this ring different from any other

Example natures (illustrative, not final): Crystalline (brittle but shattering), Darkness (ambush and blindness), Glorious (overwhelming radiance), Decay (slow rot and attrition), Silence (suppression of sacred bandwidth), Hunger (resource drain).

## Mist Raids

The mist doesn't just erode. It sends things. Creatures emerge to attack the monastery. These raids escalate with the mist and **reflect the nature of the ring they come from**.

### Creature Nature

Creatures in each ring are flavored by that ring's mist nature. This works on two levels:

**Adjective + stat change.** Most creatures are base types modified by the nature. A standard raider in a Crystalline ring becomes a Crystalline Raider — maybe more brittle (lower HP) but hits harder (higher damage), or shatters into fragments on death that damage nearby defenders. The nature is an adjective that modifies stats and behavior. This keeps creature variety high without requiring hundreds of unique designs.

**Signature creatures.** Each mist nature also has 1-3 creatures that are unique to it. These ONLY appear in rings with that nature. A Crystalline Golem. A Darkness Stalker. A Silence Drifter. These are the memorable encounters that make each ring feel like its own ecosystem, not the same enemies with a filter.

### Raid Escalation

Within each ring, raids intensify over time. The longer you stay at a tier, the harder the raids get. But difficulty resets to a standard baseline when you advance to the next ring — the new nature is the challenge, not inflated numbers from the previous tier.

Scouting (via Mist Walker) provides advance warning of raids. A scouted raid gives the player time to prepare and a tactical advantage. An unscouted raid hits blind.

## The Perimeter

The perimeter is the monastery's boundary against the mist. It requires constant sacred bandwidth (priest energy) to maintain. If perimeter stability drops below 100%, people are at risk of being taken by the mist.

### The Gap Mechanic (Carries Forward from Prototype)

The perimeter uses a **gap-based risk system** proven in the prototype. Each priest on the perimeter contributes to stability based on their stats. If stability is below 100%, the gap creates proportional risk: food spoilage, personnel injuries, people going lost in the mist.

The core formula: each priest contributes a base amount plus stat bonuses. The gap (100 minus stability) determines risk percentage per day. Larger gap = more frequent, more severe consequences. Watchtowers protect priests on the wall from mist exposure.

With stacking mist natures, the perimeter calculation expands — priests must counter each active nature to contribute fully. A priest trained against standard mist but NOT against crystalline mist only partially covers a Ring 2+ perimeter. The gap grows if priests can't handle all active layers. This makes the adaptation cycle (see Mist Natures above) directly tied to perimeter survival.

Exact numbers are playtest-tunable and will be exposed as config values.

**Critical design rule:** Perimeter loss must connect to player decisions, not pure randomness. If a priest is lost to the mist, the player should be able to trace it back to a choice they made — they sent a priest on a mission, they underinvested in the perimeter, they ignored a warning about escalation. This is what makes loss legible.

## Source Attention

The Source is a living intelligence. It can notice what the monastery does — but only when the monastery does something **powerful**.

Normal operations are invisible. Farming, patrolling, basic construction, clue decoding — the Source doesn't care. The monastery's daily survival is beneath its notice.

But certain high-value actions draw the Source's attention: activating an ancient facility, performing a major rite, synthesizing a rare compound, breaching a sealed location. These are the moments where the monastery reaches beyond survival into real capability, and that reach has a cost.

**Source Attention is not a meter.** There is no "noise bar" that fills up. Instead, each action that draws attention has a **specific, transparent penalty stated before the player commits**. The game tells you exactly what will happen:

- "Activating the Deep Forge will increase raid frequency by 1 for the next 5 days."
- "Performing the Rite of Binding will increase mist pressure by 15%, requiring additional perimeter coverage."
- "Breaching the Sealed Archive will trigger a targeted raid within 2 days."

The player always knows the price before they pay it. Some players will absorb every cost and push hard. Others will be conservative and only trigger the essentials. The same action carries different weight depending on the current state of the monastery — if your perimeter is already strained from a new ring's nature, triggering extra raids could be catastrophic. If you have coverage to spare, the cost is manageable.

This serves **Agency** (informed choice), **Tension** (risk calculation), and **Comprehension** (the player understands the tradeoff).

## The Source (Final Boss)

The source of the mist is the endpoint of the game. It is a **knowledge fight, not a stat check**. The player who invested in the knowledge pipeline — MW scouting, scholar research, Source clue interpretation — faces a hard but legible challenge. The player who rushed faces the same fight with blindfolds on.

### Ring 4 — The Source's Domain

Ring 4 has its own unique mist nature — always different from Rings 2 and 3. The Source must be found through exploration of Ring 4, just like locations in other rings. It doesn't reveal itself — you have to hunt it.

Before the final assault, the knowledge pipeline must deliver one more time: identify Ring 4's nature, research the counter, train priests against it — all while the perimeter is now holding back four stacking layers of mist. This is the ultimate test of everything the player has built.

### Source Clues — The Intelligence Gathering

Understanding the Source requires **Source clues**, found throughout the game in two ways:

**Guaranteed clues (9 total).** Each vital location in Rings 1-3 has a Source clue in its Heart (Tier 3). Clearing all 9 vital locations means 9 clues. These are puzzles, not instructions — they require scholar interpretation and cross-referencing. Two clues from different locations start making sense together. Three clues and a skilled scholar can decode something actionable.

**Bonus clues (3 possible, not guaranteed).** Ring 4 contains 3 additional Source clues scattered through MW exploration — found in minor locations, hidden in the landscape, tucked inside encounters. These are NOT tied to the Source's lair. They're out there in Ring 4's mist, waiting to be stumbled upon or hunted for.

No player is guaranteed to find all 12 clues. Even a player who clears every vital location in Rings 1-3 still only has 9. The 3 bonus clues require additional time spent exploring Ring 4 — time during which the mist continues to escalate and the perimeter is holding four stacking layers. This creates the final great strategic question: **do I search Ring 4 for more intelligence, or do I commit to the assault with what I have?**

More clues mean more decoded weaknesses, more phase knowledge, more counter-mechanics for the fight. Fewer clues mean a harder fight with more unknowns — but also less time for the mist to grind down your defenses.

### The Three Phases

The assault on the Source is a **multi-day event, not a single check**. The Source has three phases, each requiring different knowledge to exploit.

**Phase 1 — The Shell.** The Source's outer defense. This phase tests whether the monastery understood Ring 4's unique mist nature and prepared accordingly. The Shell's weaknesses connect to the Source's nature — the clues that reveal these weaknesses are primarily found in Ring 4 itself (the bonus clues and Ring 4's own lair tiers). A player with Ring 4 intelligence handles this phase cleanly. A player without it faces a brutal fight against an enemy whose defenses they don't understand.

**Phase 2 — The Echo.** The Source fights back using echoes of the natures from earlier rings. This phase tests whether the monastery was thorough in Rings 1-3 — did the player actually study what they found, or just grab the loot and move on? The clues from Ring 1-3 vital locations decode the Echo's patterns. A well-researched monastery recognizes these attacks and counters them. A monastery that rushed through earlier rings faces old threats in a new, concentrated form.

**Phase 3 — The Core.** The Source itself, stripped of defenses. This phase tests whether the player truly comprehends what the Source IS — not just what it does, but why. The deepest clues, the ones that require the most cross-referencing and scholar investment, decode the Core's vulnerabilities. This is where full clue collection matters most. A player with 11-12 decoded clues can identify the Core's true weakness. A player with 6-7 is fighting something they only half-understand.

### Missing Clues Make It Harder, Not Impossible

A player can attempt the final assault with incomplete knowledge. Missing clues don't lock phases — they make them harder. Each decoded weakness is an advantage: reduced enemy stats, exposed vulnerabilities, phase transitions that can be exploited. Without them, the player fights at full difficulty with no shortcuts.

This means there is no hard gate on the final assault. The player always has agency to commit when they choose. But the game rewards patience and thoroughness — the monastery that invested in the knowledge pipeline from Day 1 faces a different fight than the one that didn't.

### The Commitment Decision

Launching the final assault is the game's **last great fork**. Once the expedition enters the Source's lair, the team is committed — this is a multi-day push through 4+ tiers (the lair's depth is randomized and unknown until inside). The monastery must hold the four-layer perimeter without the assault team's soldiers, priests, and the MW.

The player must decide: who goes and who stays? How many soldiers for the assault vs. the perimeter? Which priests — the ones trained against Ring 4's nature, or keep them on the wall? Is the monastery stable enough to survive without the assault team for potentially a week or more?

Going with a larger team is safer for the assault but risks the monastery collapsing behind you. Going lean keeps the monastery defended but makes each phase of the Source harder. There is no right answer — only the answer that fits this run, this monastery, this moment.

### Winning and Losing

**Winning** requires comprehension + preparation + a willingness to commit with imperfect information. The player who wins should feel like they earned it — not through grinding, but through understanding. They read the clues. They prepared the counters. They made the hard call on when to go.

**Losing** should feel like "I wasn't ready" or "I misread the situation" — never "I had no chance." Every loss should be traceable to decisions: I didn't invest in scholars early enough. I pushed into Ring 3 before my priests could handle it. I launched the assault without enough clues. I left the monastery undefended. The loss is legible because the systems are legible.

## Open Questions

- [x] Are mist elements always in the same order? **No. Natures are drawn from a pool. Each ring gets a unique, randomly assigned nature. Ring 4 (Source) also has its own unique nature. No repeats within a run.** *(Resolved 2026-02-12)*
- [x] What are creatures like in each ring? **Creatures reflect the ring's mist nature — base types get an adjective + stat change. Each nature also has 1-3 signature creatures unique to it.** *(Resolved 2026-02-12)*
- [x] How many phases does the source/boss have? **Three phases: Shell (tests Ring 4 preparation), Echo (tests Ring 1-3 thoroughness), Core (tests deep comprehension). Multi-day assault, not a single check.** *(Resolved 2026-02-12)*
- [ ] How fast does the clock tick? What's the relationship between days and mist escalation?
- [ ] What determines how much the perimeter degrades when new natures appear?
- [ ] Can the player slow the clock through specific actions (sealing rituals, etc.)?
- [ ] How does the mist respond to expedition activity? Is deeper exploration noticed by the source?
- [ ] How many mist natures are in the full pool?
- [ ] What are the specific natures? (Names, visual signatures, counters, signature creatures)
- [ ] Can the same nature appear in multiple runs but with different signature creatures?
- [ ] What specific Source weaknesses exist per phase?
- [ ] How do decoded clues mechanically reduce phase difficulty?
- [ ] What happens if the assault team is wiped — total loss, or can survivors retreat?
- [ ] Can the monastery fall while the assault is in progress? (Simultaneous loss condition?)
