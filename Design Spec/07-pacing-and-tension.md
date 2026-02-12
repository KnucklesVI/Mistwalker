# Pacing & Tension

## The Shape of a Run

A full run targets 2-4 hours. This is long for a roguelike. The pacing must prevent fatigue while maintaining forward momentum.

## Four Phases

### Phase 1 — Survival Funnel (0-45 minutes)
**Psychological state:** Overwhelmed. Focused. Reactive.

All hands on deck. The perimeter must be stabilized. Armies are coming and must be handled. There is no room for ambition — only survival.

The player is learning the monastery's current state: who they have, what roles are filled, what resources exist. Decisions are constrained and urgent.

**What the player feels:** "I just need to not die."

**Tension pattern:** High and constant. No release.

### Phase 2 — First Peel-off (45-120 minutes)
**Psychological state:** Cautious optimism. First real choices appear.

The base is stable enough to start pulling people away. The MW begins exploring seriously. The first forks appear: where to send the MW, whether to start digging, which scholar to invest in.

The first notable discoveries arrive. The first raid that's harder than expected. The first time someone is lost in the mist and the player must decide: rescue mission or accept the loss?

**What the player feels:** "I can finally breathe — but every choice costs something."

**Tension pattern:** Oscillating. Push out, pull back, restabilize, push again.

### Phase 3 — Epistemic War (120-180 minutes)
**Psychological state:** Committed. Strategic. The monastery has an identity now.

The player has made specialization choices. The monastery looks different from how it started. Scholars are revealing serious threats. The mist is escalating. New elements are appearing. The dependency drawer has items in it. Underground digs are revealing ancient infrastructure.

Mythic events start firing. Characters have history. Loss would be devastating.

**What the player feels:** "I know what I'm building. I hope it's enough."

**Tension pattern:** Rising. The stakes increase with every day. The clock is audible.

### Phase 4 — The Commitment (180-240 minutes)
**Psychological state:** Tense. Excited. Gambling.

The player must decide: is it time? Do I have enough knowledge about the source? Have I prepared my people sufficiently? The mist is getting very dangerous. Waiting longer means more preparation but also more risk.

The final assault is organized. Key personnel are assigned. The base is left vulnerable. Everything is on the line.

**What the player feels:** "This is it. Whatever happens, I chose this."

**Tension pattern:** Peak. The heartbeat is fastest here.

## The Heartbeat Rhythm

Throughout all phases, the game should pulse between **expansion** (risky, vulnerable, information-gathering) and **contraction** (safe, stabilizing, processing).

Missions create the heartbeat:
- **Expansion:** Send MW + team out. Base weakens. Tension rises.
- **Contraction:** Team returns. Process discoveries. Heal. Build. Tension releases.
- **Expansion:** Push again, deeper this time.

This rhythm should be FELT. The player should notice the difference between "people are home" and "people are out there."

## Failure and Death

Players will die. Often. This is expected and intended.

**Good death:** "I pushed into Ring 2 before my priests could handle corruption. I knew it was risky. The compound ran out on day 3 of the expedition and everything fell apart. Next time I'll stockpile more."

**Bad death:** "I was doing everything right and then RNG killed two priests on the same day for no reason. There was nothing I could do."

Every death must be traceable to a decision. The player should always be able to point to the moment they gambled and lost. THAT is what makes losing fun — it's a story, not a punishment.

## The Clock — Tuning Philosophy

The clock should be **fast for playtesting** — discoveries happen often, the player experiences every system in a single run. This is the starting point. We tune slower after testers have seen everything and we know what pacing feels right.

Clock speed, day-counts per phase, and escalation curves are all **playtest-tunable parameters**, not fixed design decisions. The initial build will expose them as config values that can be adjusted between test runs without code changes.

## Save System

**Save-and-quit, single save slot.** The game saves when the player exits. There is only one save file per run. Loading the save resumes the run. This preserves stakes without punishing the player for having a life.

**Testing mode** allows multiple save files for iteration and save-scumming. This is a developer/tester feature, not part of the normal player experience.

## Open Questions

- [x] How does the save system work? **Save-and-quit, single save slot. Testing mode allows multiple saves.** *(Resolved 2026-02-12)*
- [x] Clock speed? **Fast for playtesting — all systems experienced in a single run. Tuned slower after feedback. Exposed as config values.** *(Resolved 2026-02-12)*
- [ ] Exactly how many in-game days correspond to each phase? (Playtest-tunable — initial numbers TBD)
- [ ] How do we signal phase transitions to the player? Visual changes? Music? Feed messages?
- [ ] Should the game get "quieter" before a major escalation (calm before the storm)?
- [ ] Is there a point of no return in the final phase, or can the player retreat from the final assault?
- [ ] How do we handle runs that go longer than 4 hours? Soft pressure to end, or hard cutoff?
