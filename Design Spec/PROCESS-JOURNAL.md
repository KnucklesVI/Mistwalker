# Process Journal — Mistwalker

A living document tracking how this project is being designed, what methods are working, and what's worth replicating in future projects. Written to be useful as a template for collaborative design work (software, games, or otherwise).

---

## Project Identity

**Project:** Mistwalker — a single-player browser roguelike about a fragile monastery resisting supernatural mist.

**Team:** One human designer (non-engineer, strong creative instincts) + one AI collaborator (Claude). External AI consultants (Gemini, ChatGPT) brought in for specific review tasks.

**Tools:** Markdown documents in a local folder (Obsidian vault). Git for version control. All design work happens in conversation before any code is written.

**Timeline:** Design spec started before this journal. This journal picks up at the point where the spec was being evaluated against best practices and moving into decision-making.

---

## The Method We Arrived At

### 1. Spec First, Code Never (Until It's Time)

The foundational rule: **no code until the design spec is complete and agreed upon.** This was established early and has been strictly followed. Every conversation is about design, not implementation. The temptation to "just build something and see" has been deliberately resisted.

**Why it works:** Decisions made in conversation cost nothing to change. Decisions made in code cost time, emotional investment, and refactoring pain. By the time we write code, we'll know what we're building and why. The spec IS the prototype — just in words instead of pixels.

**Risk to watch:** At some point, we need to actually build. The spec can become a comfort zone. We've set explicit build layers (MVP → Depth → Identity) to force the transition.

### 2. Structured Phases With a Decision Log

We organized the work into three phases:

- **Phase A — Foundational Decisions.** Load-bearing choices that everything else depends on. Roster size, mist mechanics, population cap, role switching, progression model.
- **Phase B — System Specifics.** How each system actually works with names, numbers, and mechanics. Specializations, milestones, crafting, underground, locations, boss.
- **Phase C — Polish & Feel.** Important but doesn't block code. Character names, mythic events, visual design, save system.

Every resolved question gets logged in a **decision log** with: the decision, the date, and the rationale. This is critical. Three weeks from now, neither of us will remember WHY we decided priests come off the wall to train. The log remembers.

**Why it works:** Phases create a natural order that prevents jumping to fun stuff before the foundation is solid. The decision log prevents relitigating settled questions and makes the reasoning auditable.

**Risk to watch:** Phases can feel rigid. Some Phase B answers naturally surfaced during Phase A discussions. We let that happen and logged them where they belonged rather than forcing strict ordering.

### 3. Conversation-Driven Design (Not Proposal-Driven)

The pattern that emerged for each decision:

1. I (Claude) frame the question and lay out 2-4 options with tradeoffs
2. The designer reacts — often by rejecting all options and proposing something better
3. We iterate in conversation until the idea clicks
4. I play it back to confirm understanding
5. The designer confirms or corrects
6. I record the decision and update all affected documents

**The critical rule:** "When I comment, I don't want you to do anything — always check with me." This prevents the AI from running ahead with assumptions. Every comment from the designer is a potential pivot, not a green light.

**Why it works:** The designer's best ideas come from reacting to proposals, not from being asked abstract questions. Showing concrete options (even wrong ones) sparks better thinking than asking "what do you want?" The AI provides structure and options; the human provides vision and instinct.

**What surprised us:** The designer's corrections were almost always improvements. Every time a proposal was rejected, the replacement was more interesting. The Priest specialization redesign is the clearest example — the initial proposal (specializations based on mist elements) was structurally wrong. The designer's pushback ("those are tiered issues, not specializations") led to the insight that mist elements are progression, and specializations are about what priests do BEYOND that. This was a better design than anyone proposed initially.

### 4. External Consultation With Independent Comparison

When specialization design was underway, we did something deliberate:

1. Created a **self-contained briefing document** capturing all design decisions so far
2. Sent it to two external AIs (Gemini, ChatGPT) asking for independent proposals
3. **Developed our own answers BEFORE seeing theirs** — this was the designer's idea and it was crucial
4. Compared all three sets of proposals

**Why it works:** Developing our own ideas first prevents anchoring bias. If we'd read the external proposals first, we'd have been pulled toward their framing. By solving it ourselves, we had a baseline to compare against. The comparison then becomes "what did they see that we missed?" instead of "which one do we pick?"

**What we found:** Strong convergence on structural decisions (multiple AIs independently arrived at similar specialization philosophies), plus novel ideas we hadn't considered (Legacy/Memory system, Source Attention mechanic, mist nature as a randomized pool). The convergence validated our work; the novel ideas expanded it.

### 5. Documents as Living Systems, Not Static Specs

Every time a decision is made, ALL affected documents get updated immediately. Not just the primary document — every doc that references the changed concept. We run consistency checks after major changes.

The document set:

- **North Star** (00) — never changes, everything is measured against it
- **System docs** (01-09) — describe how each system works
- **Integration docs** (10-11) — how systems connect, all open questions
- **Concrete docs** (12-16) — day-in-the-life scenarios, build priority, roadmap, architecture, crafting

**Why it works:** When a decision changes (like mist elements moving from fixed progression to randomized pool), the ripple effects are caught immediately. Without this discipline, documents drift out of sync and stop being trustworthy.

**Risk to watch:** Document updates take time and can feel like overhead. But the alternative — stale docs that contradict each other — is worse. The consistency check after the mist nature overhaul caught exactly one stale reference in Doc 13.

### 6. The "Six Words" as a Design Filter

Early in the project, the designer established six words that every mechanic must serve: **Comprehension, Wonder, Efficiency, Agency, Attachment, Tension.** Every specialization, every system, every decision gets tested against these words.

**Why it works:** It prevents feature creep and "cool but pointless" additions. When evaluating a proposal, the first question is always: which words does this serve? If the answer is "none" or "I'm not sure," the idea needs work or removal.

**What surprised us:** The six words also function as a communication shorthand. Instead of explaining why a mechanic matters, we can say "this serves Tension and Agency" and both parties immediately understand the design intent.

---

## What's Working Well

### Designer corrections improve the design, not just adjust it
Every time the designer pushes back, the result is structurally better. The pushback isn't "I don't like this" — it's "this is solving the wrong problem." Examples: priests and mist elements, soldier breaching moved to engineers, worker Steward replaced by Tinker, mist elements as a randomized pool instead of fixed progression.

### The playback loop catches misunderstandings early
After every discussion, I play back what I understood. The designer confirms or corrects. This catches misalignment within minutes instead of after hours of documentation work. The mist nature discussion was a clear example — the designer's first description was ambiguous, and it took two rounds of playback to arrive at the actual vision (unlimited pool of natures, not three fixed elements).

### The decision log is the most valuable document
More valuable than any individual system doc. It's the authoritative record of what was decided and why. It prevents circular discussions and makes onboarding (even for the same participants after a break) fast.

### Phase structure prevents premature optimization
We didn't try to design the crafting system before we knew how mist natures worked. We didn't design milestones before we knew what specializations existed. The phase ordering ensured that dependent decisions had their dependencies resolved first.

### Playtest-tunable flagging
Some decisions are marked as "first-draft, designed to be tuned through playtesting." This acknowledges that we can't know everything from theory. It gives permission to move forward without perfect answers while making clear that these specific items WILL change. Veteran milestone gates are the primary example.

---

## What to Watch / Potential Issues

### Spec completionism as delay tactic
We have 16 documents, a decision log with 20+ entries, and we haven't written a line of code. The spec is genuinely necessary — but at some point, the next insight comes from building, not discussing. The build priority layers (MVP → Depth → Identity) are designed to force this transition. We need to honor that.

### AI tendency to over-structure
The AI (me) has a bias toward clean taxonomies and complete systems. The designer has repeatedly simplified or loosened proposals — "don't cap specializations at three," "milestones need to be playtest-tunable," "the workers are just peons really." The best design moments come from the designer's willingness to resist premature tidiness.

### Decision log can become overwhelming
20+ entries and growing. At some point, this needs a summary layer — a "key decisions" document that captures the 10 most important choices without the full history. The decision log itself should remain complete for reference, but a lighter summary helps with day-to-day work.

### External consultation timing matters
We got the most value from external AIs AFTER developing our own ideas. If we'd consulted them first, we might have adopted their framing instead of finding our own. The sequencing was: do our own work → brief externals → compare. This should be the standard pattern.

### The designer is not an engineer
The designer has strong systems intuition but doesn't write code. The transition from spec to implementation will require a new communication pattern — the designer will need to evaluate whether the built system matches the spec without being able to read the code. Playtesting, visual verification, and scenario walkthroughs will become the primary feedback mechanism.

---

## Process Rules (Explicit)

These emerged during the collaboration and are now standing rules:

1. **"When I comment, don't do anything — always check with me."** Every designer comment is a signal, not an instruction. Verify intent before acting.
2. **No code until the spec is agreed upon.** Design is free to change. Code is expensive to change.
3. **Every decision gets logged with rationale.** Future-you will thank present-you.
4. **Update ALL affected documents when a decision changes.** Run consistency checks after major changes.
5. **Develop your own ideas before reading external input.** Prevents anchoring bias.
6. **Test every mechanic against the Six Words.** If it doesn't serve at least one, question whether it belongs.
7. **Mark uncertain decisions as playtest-tunable.** Give permission to move forward without perfect answers.
8. **The designer's pushback is the most valuable design tool.** Don't defend proposals — listen to what the correction reveals.

---

## Milestones Reached

| Date | Milestone |
|------|-----------|
| Pre-journal | Design spec documents 00-11 created |
| Session 2 | Best practices review of GDD |
| Session 2 | Docs 12-16 created (Day in Life, Build Priority, Roadmap, Architecture, Crafting) |
| Session 2 | Architecture revised: Event Bus → State Machine + Command Queue + Notification Bus |
| Session 2 | Phase A complete: all foundational decisions resolved |
| Session 2 | Phase B1 complete: all specialization paths defined |
| Session 2 | External AI consultation: briefing sent, responses compared |
| Session 2 | Mist nature system overhauled: fixed progression → randomized pool |
| Session 2 | Phase B2 complete: milestones and elevation triggers defined |
| Session 2 | Phase B3 complete: crafting system framework defined |
| — | **Next:** B4 (Underground), B5 (Locations), B6 (Source/Boss) |

---

## Generalizable Takeaways (For Other Projects)

1. **Write the spec before the code, even when it feels slow.** The spec IS the cheapest prototype.
2. **Use a decision log religiously.** Date, decision, rationale. Every time. No exceptions.
3. **Structure work in dependency order.** Don't design downstream systems before upstream decisions are made.
4. **The human's corrections are the design.** AI proposals are scaffolding for human insight, not the final product.
5. **Consult externally AFTER developing internal ideas.** Use external input to challenge and expand, not to originate.
6. **Establish a values filter early.** (Six Words, design pillars, whatever fits the project.) Test everything against it.
7. **Flag what you don't know yet.** Marking something as "playtest-tunable" is better than pretending you have the answer.
8. **Keep documents in sync.** One stale reference erodes trust in the entire spec.
9. **Conversation is the design tool.** The best ideas emerge from reaction, not from blank-page generation. Propose something concrete (even if wrong) and iterate from the response.
10. **The non-expert often has the best instincts.** "I'm not an engineer" doesn't mean "I don't know what's right." Domain expertise provides options; taste provides direction.
