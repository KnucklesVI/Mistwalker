
This document defines structural invariants and object relationships.
Exact tuning constants are intentionally abstracted.

---

# 1. Core Data Types

## 1.1 Vector

Vector {
    id
    name
    description
}

Vectors are shared across:
- Rings
- Creatures
- Units
- Equipment
- Unlock effects

All vector interactions resolve through unified resistance calculation.

---

## 1.2 Unlock

Unlock {
    id
    vector_tags[]
    effects[]
    research_cost
    discovery_conditions[]
}

All unlocks exist in a single registry.

Acquisition path:
- Discovery
- Research

Unlocks are not duplicated per system.

---

# 2. Pressure & Containment Engine

Each Active Ring produces Pressure.

Containment produced by Priests + structures.

Derived:

Gap = max(0, 1 − (Containment / Pressure))

Effects:

EffectiveCombat = Base × f(Gap)

Where f(Gap) is a non-linear decreasing function.

BreachChance = g(Gap)

Where g(Gap) is a non-linear increasing function.

Shape constraint:
- Low Gap = mild penalty
- High Gap = sharp escalation

Exact curve constants defined in tuning layer.

---

# 3. Ring State Machine

States:
- Inactive
- Active
- Sealed
- Volatile

Transition triggers explicitly defined.

Volatile flag persists until Final Stage.

---

# 4. Ritual System

Monastery {
    ritual_knowledge_level
    ritual_mastery_level
}

Ritual Knowledge:
- Binary threshold required to attempt final seal.

Ritual Mastery:
- Accumulates through early seals.
- Reduces final ritual complexity.
- Stored at Monastery level.

Priest death does not reset Mastery.

---

# 5. Mistwalker Model

Mistwalker {
    base_attributes
    vector_resistances[]
    equipment[]
    artifacts[]
}

Vector resistance resolution:
Damage = Incoming × (1 − Resistance%)

Resolution model intentionally abstract.
Flat or multiplicative stacking determined in tuning phase.

---

# 6. Volatility Model

After Ring 6:

For each Ring flagged Volatile:
- Generate eruption timer (range defined in tuning layer)
- If timer expires:
    apply multiplier to that Ring's Vector

Each Ring erupts at most once.

Volatility Knowledge reveals:
- Relative risk tier
- Possibly time window at higher knowledge levels

Knowledge never alters timer.
Only reveals information.

---

# 7. Final Seal Resolution

## 7.1 Ritual Check

If ritual_knowledge < required_threshold:
    Fail

Else:
    Proceed

Ritual complexity modified by:
- ritual_mastery_level
- number_of_volatile_rings

---

## 7.2 Threshold Defense

ThresholdDuration = base_duration × complexity_modifier

For turn in 1..ThresholdDuration:
    Apply cumulative vector load
    Resolve resistance
    Check survival

If Mistwalker survives all turns:
    Victory
Else:
    Failure

---

# 8. Structural Invariants

- Gap drives systemic instability.
- Sealing before 100 is always superior.
- Ritual Knowledge is binary gate.
- Ritual Mastery reduces burden.
- Mistwalker is always relevant.
- Discovery and Research share Unlock registry.
- Discovery is more efficient than Research.
- Research guarantees eventual access.
- Volatility only activates in Final Stage.
- Feedback must reveal cause, not hidden math.