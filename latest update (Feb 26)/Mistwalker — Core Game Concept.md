

## Core Fantasy

You lead a monastery at the edge of a spreading Mist.

Six corrupted Monasteries radiate mystical Pressure into the world.  
Each represents a distinct Vector — fire, fracture, rot, silence, corruption, etc.

Your goal is not merely survival.

Your goal is to:
- Contain rising Pressure.
- Defeat and seal each corrupted Monastery.
- Discover the origin Portal.
- Perform the Final Seal.
- Survive the threshold long enough to close it forever.

If the ritual fails, everyone dies.  
If the Mistwalker falls, everyone dies.

There is no partial victory.

---

## Core System — Pressure, Containment, and The Gap

Every active Ring produces Pressure along its Vector.

Priests and infrastructure generate Containment.

Derived value:

Gap = max(0, 1 − (Containment / Pressure))

If Gap > 0:
- All units suffer combat reduction.
- Daily breach probability increases.
- Instability compounds.

### Scaling Shape

Gap penalties scale **non-linearly**.

- Early Gap levels produce mild penalties.
- High Gap levels escalate sharply.
- System instability accelerates beyond a tipping threshold.

Exact constants are tuning parameters.  
The structural invariant is convex escalation.

The player always sees:
- Current Containment %
- Current Gap %
- Effects derived from Gap

The player must never be unaware of systemic stress.

---

## Vectors — Unified Interaction Model

A **Vector** is a shared attribute type.

Vectors are used by:

- Rings (as Pressure output)
- Creatures (as damage source)
- Units (as Resistance input)
- Equipment (as modifiers)
- Unlocks (as enhancement tags)

All vector interactions operate through shared resolution rules.

There are no per-element custom logic branches.

---

## Ring Lifecycle

Each Ring transitions through:

- Inactive
- Active (Pressure escalating toward 100)
- Sealed (if sealed before 100)
- Volatile (if reached 100 before sealing)

Transition triggers:

Active → Sealed:
- Boss defeated
- Seal completed
- Pressure < 100

Active → Volatile:
- Pressure reached 100 before sealing

Volatility does not activate until Final Stage.

Sealing before 100 always:
- Stops escalation
- Prevents volatility
- Reduces final ritual burden
- Contributes ritual mastery to the Monastery

---

## Discovery vs Research — Acceleration vs Insurance

All advancement has two acquisition paths:

1. Discovery (field-based)
2. Research (internal deterministic)

Both feed into a shared Unlock registry.

### Discovery

- Faster
- Higher ceiling
- Run-shaping
- Opportunity-based

### Research

- Slower
- Guaranteed
- Baseline stabilizing
- Always available

Discovery is acceleration.  
Research is insurance.

The game must never be unwinnable due to RNG.

But optimal play exploits asymmetry when available.

---

## Ritual Knowledge & Mastery

Ritual has two components:

1. Ritual Knowledge (theoretical)
2. Ritual Mastery (practical)

Ritual Knowledge:
- Required to attempt final seal.
- Can be researched or discovered.

Ritual Mastery:
- Accumulates at Monastery level.
- Earned through early successful seals.
- Reduces final ritual complexity.

Mastery is not tied to a specific Priest.
It is institutional knowledge.

Priests may die.
The Monastery remembers.

---

## The Mistwalker

The Mistwalker is the primary build surface.

He:
- Explores
- Fights bosses
- Stacks layered resistances
- Carries artifacts
- Holds the final threshold

His growth is the culmination of:
- Unlock choices
- Equipment
- Vector resistances
- Strategic direction

In the final stage:
He stands alone while the ritual completes.

He must survive a defined number of turns under cumulative Vector load.

---

## Volatility & Final Stage

After Ring 6:

- Portal must be located.
- Volatile Rings receive eruption timers.
- Player decides when to attempt Final Seal.

If a volatile Ring erupts:
- Its Vector multiplier increases.
- Final threshold load increases.

Each Ring erupts at most once.

---

## Final Seal Structure

Final Seal has two concurrent systems:

1. Ritual Resolution (Binary)
2. Threshold Defense (Turn-based survival)

Threshold Defense is resolved over a fixed number of rounds.

Each round:
- Cumulative Vector load is applied.
- Mistwalker’s resistances mitigate damage.
- Survival is endurance-based, not kill-based.

If Mistwalker survives duration:
Victory.

If he falls:
Total failure.

---

## Player Mastery

Layered mastery emerges:

- Stabilize Gap.
- Specialize internally.
- Adapt to opportunity topology.
- Balance exposure vs safety.

The system rewards literacy.

It does not explicitly reveal optimal play.