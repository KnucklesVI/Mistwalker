# Mistwalker — Design Spec

A living design document for the Mistwalker roguelike. Every system, how they connect, and what we're building toward.

**Rule: No code is written until these documents are complete and agreed upon.**

## Documents

### Foundation
- **[00 — North Star](00-north-star.md)** — The six words. What the game is and isn't. The thesis.

### Systems
- **[01 — The Organism](01-the-organism.md)** — The monastery as a living system. How all organs relate.
- **[02 — Roles & Progression](02-roles-and-progression.md)** — The six roles. Novice → Veteran → Elevated. Specializations. Non-standard transformations.
- **[03 — The Mist](03-the-mist.md)** — The clock. Threat domains. Elements. The source/boss.
- **[04 — Exploration](04-exploration.md)** — Outward rings and downward archaeology. Two axes of discovery.
- **[05 — Knowledge System](05-knowledge-system.md)** — Mist Walker perception. Scholar interpretation. The dependency drawer.
- **[06 — Wonder & Identity](06-wonder-and-identity.md)** — Mythic events. Character naming. Attachment systems.
- **[07 — Pacing & Tension](07-pacing-and-tension.md)** — The 2-4 hour run. Four phases. The heartbeat rhythm.
- **[08 — Interface & Controls](08-interface.md)** — Keyboard-first design. Information architecture. Visual language.
- **[09 — Forks & Decisions](09-forks-and-decisions.md)** — Where agency lives. Daily, strategic, and existential decisions.

### Integration
- **[10 — System Connections](10-connections.md)** — How everything talks to everything else. The master flow. Feedback loops.
- **[11 — Open Questions](11-open-questions.md)** — Single source of truth for all unresolved questions. Resolution status tracked here.

### Concrete
- **[12 — A Day in the Life](12-a-day-in-the-life.md)** — Narrated gameplay scenarios showing how systems collide in practice.
- **[13 — Build Priority](13-build-priority.md)** — What we build first (MVP), second, and third. What gets ported from the prototype.
- **[14 — Collaboration Roadmap](14-collaboration-roadmap.md)** — What we decide together, in order. Decision log.
- **[15 — Technical Architecture](15-technical-architecture.md)** — Game systems → code modules. Event bus pattern. File structure. Data-driven design.
- **[16 — Crafting & Facilities](16-crafting-and-facilities.md)** — Material categories, recipe discovery, facility tiers, staffing rules.
- **[17 — The Underground](17-the-underground.md)** — 4 defined levels + the Abyss. Dig mechanics, chamber types, connection to other systems.

## Status

| Document | Status |
|----------|--------|
| North Star | ✅ Draft complete — needs review |
| The Organism | ✅ Draft complete — needs review |
| Roles & Progression | ⚠️ Draft complete — specializations undefined |
| The Mist | ⚠️ Draft complete — Source fight designed, still needs clock numbers and nature pool |
| Exploration | ⚠️ Draft complete — needs location specifics |
| Knowledge System | ⚠️ Draft complete — needs recipe list and pacing numbers |
| Wonder & Identity | ⚠️ Draft complete — needs naming system and mythic catalog |
| Pacing & Tension | ⚠️ Draft complete — needs day counts per phase |
| Interface & Controls | ⚠️ REVISED — new views (MW Exploration, Power Management, mid-screen events), carry-forward from prototype confirmed |
| Forks & Decisions | ✅ Draft complete — concrete examples in Day in the Life |
| System Connections | ✅ Draft complete — validated by technical architecture |
| Open Questions | 📋 Single source of truth — track resolution here |
| A Day in the Life | ✅ NEW — 4 scenarios across all phases |
| Build Priority | ✅ NEW — 3 layers defined, port list complete |
| Collaboration Roadmap | ✅ NEW — Phase A/B/C work items, decision log |
| Technical Architecture | ✅ REVISED — State machine + command queue + notification bus. Core/shell split for portability. |
| Crafting & Facilities | ✅ NEW — 5 material categories, 3 facility tiers, recipe discovery model, staffing rules. |
| The Underground | ✅ NEW — 4 defined levels + Abyss. Dig mechanics, chamber types, team composition. |

## Process

1. ~~Review each document together~~ → Documents drafted
2. ~~Resolve foundational questions (Roadmap Phase A)~~ → Phase A complete
3. ~~Resolve system specifics (Roadmap Phase B)~~ → Phase B complete (B1-B6 all resolved)
4. **Lock the spec** ← WE ARE HERE (review remaining open questions, then lock)
5. Begin architecture and code (Layer 1 first)
6. Iterate on Phase C items alongside development
