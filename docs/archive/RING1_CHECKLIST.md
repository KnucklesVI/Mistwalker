# Ring 1 Checklist — The Balancing Act

Focus: make every role matter, every assignment hurt to lose, every day feel like a decision.

---

## 1. Starvation Has Teeth
Right now food hits zero and nothing happens. A warning appears. That's it.

**What it should do:**
- Day 1 at zero food: morale-style notification, production slows
- Day 2+: random character becomes "weakened" (reduced effectiveness)
- Day 3+: weakened characters risk death
- Recovery when food returns — but not instant

**Why it matters:** Without this, workers feel optional. With it, farming is the heartbeat and pulling someone off food duty is a real sacrifice.

---

## 2. Tomes Actually Work
Digging finds tomes. Players can see them. But there's no USE button — the stat increment code doesn't exist in engine.js.

**What's needed:**
- The USE_TOME command type already exists in engine.js
- Verify it actually increments the stat and marks the tome used
- Dashboard/items tab should show "Use on [character]" flow
- Tome of Potential (generic) lets player pick which stat

**Why it matters:** Tomes are the reward for digging. Without them working, digging is a resource drain with no payoff. With them, digging becomes "invest now for stronger characters later."

---

## 3. Artifacts Apply Their Bonuses
Equipping artifacts works in the UI. The data structure stores stat bonuses. But the bonuses are never read by any system.

**What's needed:**
- Combat should check equipped artifacts for defense bonuses
- Resource production should check for production bonuses
- Research should check for research speed bonuses
- Perimeter should check for spirit/perimeter bonuses
- Simple: when calculating a character's effective stat, add artifact modifiers

**Why it matters:** Artifacts come from MW exploration → scholar research → equip. That's a three-system pipeline. If the end result does nothing, the whole chain feels hollow.

---

## 4. Room Discovery Unlocks Something
Four rooms are discovered at 25/50/75/100% digging progress. Currently: a notification, nothing else.

**Ideas (pick what feels right):**
- Training Hall → reduces training time for soldiers
- Archive Chamber → reduces research time for scholars
- Sanctum Alcove → boosts priest perimeter contribution
- Workshop Vault → engineers build traps faster or cheaper

**Why it matters:** Room discovery is the milestone system for digging. Without mechanical benefit, it's just flavor text at arbitrary percentages.

---

## 5. Food Pressure Scales With Population
Right now: 1 food/person/day, 3 food/worker/day. So 1 worker feeds 3 people. With 20 characters, you need ~7 workers farming. That's a lot, but it's static — no escalation.

**What could change:**
- Rescued people (from MW exploration) increase food pressure
- Injured people still eat but don't produce
- Dead people reduce pressure (grim but true)
- Verify the math actually creates tension at current config values

**Why it matters:** If food pressure doesn't scale, the early game bottleneck vanishes once you assign enough farmers and never comes back.

---

## 6. Worker Assignment Feels Like a Decision
Workers can farm, chop, quarry, or dig. But the player rarely agonizes over this because the consequences of wrong allocation are slow and invisible.

**What's needed:**
- Make resource shortfalls more visible and immediate
- "No wood" should mean traps stop AND digging stops (already true — verify)
- "No stone" should mean digging stops (already true — verify)
- Dashboard should show burn rate vs production rate so player can see the squeeze

**Why it matters:** The whole balancing act is "who do I assign where." If the player can't see the trade-off, they can't feel it.

---

## 7. Priest Perimeter Feels Consequential
Priests maintain the perimeter. Gap consequences exist but are very low probability (2% injury per gap point, 0.2% loss per gap point).

**What to check:**
- Are current numbers creating any real pressure?
- Does pulling a priest off perimeter to train someone create visible decay?
- Should perimeter decay be faster so the player feels the cost of reassignment?

**Why it matters:** Priests should feel like they're holding back the darkness. If perimeter is "set and forget," priests are boring.

---

## 8. Engineer Tension Between Traps and Digging
Engineers can build traps OR supervise digging. Both cost resources. Both take time.

**What to verify:**
- Is the trade-off real? Does choosing traps over digging (or vice versa) feel costly?
- Are trap costs (5 wood each) creating wood scarcity that competes with digging (1 wood/day)?
- Does the player ever think "I can't afford both"?

**Why it matters:** Engineers are the dual-purpose role. Their split should be the hardest assignment decision in the game.

---

## 9. Soldier Garrison vs Other Needs
Soldiers sit on garrison duty waiting for raids. Between raids, they're just... waiting.

**What could help:**
- Soldiers on garrison should maybe consume extra food (training/readiness)
- OR soldiers could have a secondary assignment (patrol = small perimeter boost?)
- The point: soldiers should feel like a cost even when raids aren't happening

**Why it matters:** If soldiers are free to garrison, there's no reason NOT to have maximum soldiers. They need a downside to create tension.

---

## 10. MW Risk/Reward in Ring 1
Currently: 85% encounter survival, every expedition returns something. Too safe, too generous.

**What to tune:**
- Add "nothing found" to the findings table (some days are dry)
- Make longer expeditions riskier (cumulative danger)
- MW injury recovery should feel costly — 3-5 days of no exploration
- Findings should feel like a gamble, not a guarantee

**Why it matters:** The MW is the hope engine — they bring back the materials that feed research and artifacts. If it's guaranteed loot, there's no tension. If it's risky, every expedition is a prayer.

---

## Priority Order

**Must-do (game is broken without these):**
1. Starvation has teeth
2. Tomes actually work
3. Artifacts apply their bonuses

**Should-do (game is shallow without these):**
4. Room discovery unlocks something
5. Resource burn rate visible on dashboard
6. MW risk/reward tuning

**Nice-to-do (game is better with these):**
7. Perimeter decay tuning
8. Engineer trap vs dig tension verification
9. Soldier garrison cost
10. Food pressure scaling
