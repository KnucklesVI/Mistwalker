/**
 * BreachModule — resolves daily pressure breaches
 *
 * Single entry point: resolveDailyBreach(state, config, rng, notifications, snapshot)
 * Mutates state (health changes). Pushes notifications. No Math.random.
 */

import { getEligibleVictims } from '../utils/targeting.js';

const BreachModule = {

  // ── Helpers ──

  /**
   * Determine severity tier from instability.
   */
  getSeverity(instability, br) {
    if (instability < br.minorMax) return 'minor';
    if (instability < br.moderateMax) return 'moderate';
    if (instability < br.majorMax) return 'major';
    return 'catastrophic';
  },

  /**
   * Set a character to injured or gravely_injured with appropriate healing duration.
   */
  applyInjury(char, isGravely, config, rng) {
    const h = config.health;
    if (isGravely) {
      char.health = 'gravely_injured';
      char.healingDaysRemaining = rng.randInt(h.gravelyInjuredRecoveryMin, h.gravelyInjuredRecoveryMax);
    } else {
      char.health = 'injured';
      char.healingDaysRemaining = rng.randInt(h.injuredRecoveryMin, h.injuredRecoveryMax);
    }
  },

  /**
   * Weighted pick from eligible targets using targetWeights.
   */
  pickTarget(eligible, targetWeights, rng) {
    if (eligible.length === 0) return null;
    const options = eligible.map(c => ({
      value: c,
      weight: targetWeights[c.role] || 1.0,
    }));
    return rng.weightedPick(options);
  },

  /**
   * Check whether a priest is pinned to any tower.
   */
  isPriestPinned(char, state) {
    if (char.role !== 'priest') return false;
    const pins = state.buildings?.towerPins;
    if (!pins) return false;
    return Object.values(pins).includes(char.id);
  },

  // ── Main entry point ──

  /**
   * Resolve a single daily breach event.
   *
   * @param {object} state         — mutable game state
   * @param {object} config        — game config
   * @param {object} rng           — SeededRNG instance (has .random(), .randInt(), .chance(), .pick(), .weightedPick())
   * @param {Array}  notifications — push notifications here
   * @param {object} snapshot      — output of PressureModule.calculate() { totalPressure, totalContainment, gap, instability, breachChance }
   */
  resolveDailyBreach(state, config, rng, notifications, snapshot) {
    const br = config.pressure.breachResolution;
    const severity = this.getSeverity(snapshot.instability, br);
    const chars = state.population.characters;

    // ── A) Determine defenders ──

    // MW engagement
    const mw = chars.find(c => c.role === 'mistwalker');
    const mwState = state.exploration?.mwState;
    const mwAvailable = mw
      && mw.health === 'active'
      && mwState?.status === 'home';
    const mwEngaged = mwAvailable && rng.chance(br.mwEngageChance);

    // Soldier engagement
    const activeSoldiers = chars.filter(
      c => c.role === 'soldier' && c.assignment === 'garrison' && c.health === 'active'
    );
    const engagedSoldiers = activeSoldiers.filter(() => rng.chance(br.soldierEngageChancePer));

    const defenders = [];
    if (mwEngaged) defenders.push(mw);
    defenders.push(...engagedSoldiers);

    const hasDefenders = defenders.length > 0;

    // ── B) Resolve fight if defenders engaged ──

    let defendersWon = false;

    if (hasDefenders) {
      // Compute defender power
      const mwPower = mwEngaged ? (mw.body + mw.spirit) : 0;
      const soldierPower = engagedSoldiers.reduce((sum, s) => sum + s.body, 0);
      const defenderPower = mwPower + soldierPower;

      // Compute win chance
      const baseWin = br.winBase[severity] || 0.5;
      const baselineMW = 6;
      const baselineSoldierBody = 3;
      const statBonus =
        (mwEngaged ? (mwPower - baselineMW) * br.mwPowerWeight : 0)
        + engagedSoldiers.reduce((sum, s) => sum + (s.body - baselineSoldierBody) * br.soldierPowerWeight, 0);
      const winChance = Math.max(0.05, Math.min(0.95, baseWin + statBonus));

      if (rng.chance(winChance)) {
        // ── WIN: breach repelled ──
        defendersWon = true;
        const defenderNames = defenders.map(d => d.name).join(', ');
        notifications.push({
          type: 'BREACH_REPELLED',
          classification: 'notable',
          severity,
          defenders: defenderNames,
          instability: snapshot.instability,
          message: `${defenderNames} intercepted the breach and drove it back (${severity})`,
        });
        return; // no casualties
      }

      // ── LOSE: defenders take damage ──

      // MW never dies, but gets injured
      if (mwEngaged) {
        const mwGravely = severity !== 'minor';
        this.applyInjury(mw, mwGravely, config, rng);
        notifications.push({
          type: 'MW_WOUNDED_SAVES_OTHER',
          classification: 'warning',
          characterId: mw.id,
          characterName: mw.name,
          severity,
          injury: mw.health,
          message: `${mw.name} was ${mw.health === 'gravely_injured' ? 'gravely wounded' : 'wounded'} holding the breach`,
        });
      }

      // Each engaged soldier: death or injury
      for (const soldier of engagedSoldiers) {
        if (soldier.health !== 'active') continue; // might have been hit by something else this tick
        if (rng.chance(br.soldierLoseDeathChance)) {
          soldier.health = 'dead';
          notifications.push({
            type: 'SOLDIER_FELL',
            classification: 'critical',
            characterId: soldier.id,
            characterName: soldier.name,
            severity,
            message: `${soldier.name} fell defending against the breach`,
          });
        } else {
          const isGravely = severity === 'major' || severity === 'catastrophic';
          this.applyInjury(soldier, isGravely, config, rng);
          notifications.push({
            type: 'SOLDIER_WOUNDED',
            classification: 'warning',
            characterId: soldier.id,
            characterName: soldier.name,
            severity,
            injury: soldier.health,
            message: `${soldier.name} was ${soldier.health === 'gravely_injured' ? 'gravely wounded' : 'wounded'} in the breach`,
          });
        }
      }
    }

    // ── C) Civilian targeting ──
    // Happens when: no defenders, OR defenders lost (creature got through)

    const engagedDefenderIds = defenders.map(d => d.id);
    const eligible = getEligibleVictims(state, engagedDefenderIds);

    if (eligible.length === 0) {
      notifications.push({
        type: 'BREACH_NO_TARGET',
        classification: 'warning',
        severity,
        message: `The mist surged inward but found no one exposed (${severity} breach)`,
      });
      return;
    }

    const target = this.pickTarget(eligible, br.targetWeights, rng);
    if (!target) return;

    // Determine outcome by severity
    const outcome = this.rollCivilianOutcome(target, severity, state, br, rng);

    // Apply outcome
    switch (outcome) {
      case 'injured':
        this.applyInjury(target, false, config, rng);
        notifications.push({
          type: 'BREACH_INJURY',
          classification: 'warning',
          characterId: target.id,
          characterName: target.name,
          role: target.role,
          severity,
          injury: 'injured',
          message: `${target.name} (${target.role}) was injured by mist exposure during a ${severity} breach`,
        });
        break;

      case 'mist_madness':
        this.applyInjury(target, false, config, rng);
        notifications.push({
          type: 'BREACH_MIST_MADNESS',
          classification: 'warning',
          characterId: target.id,
          characterName: target.name,
          role: target.role,
          severity,
          message: `${target.name} (${target.role}) was gripped by mist madness — disoriented and unresponsive`,
        });
        break;

      case 'gravely_injured':
        this.applyInjury(target, true, config, rng);
        notifications.push({
          type: 'BREACH_GRAVE_INJURY',
          classification: 'critical',
          characterId: target.id,
          characterName: target.name,
          role: target.role,
          severity,
          injury: 'gravely_injured',
          message: `${target.name} (${target.role}) was gravely wounded during a ${severity} breach`,
        });
        break;

      case 'dead':
        target.health = 'dead';
        notifications.push({
          type: 'BREACH_DEATH',
          classification: 'critical',
          characterId: target.id,
          characterName: target.name,
          role: target.role,
          severity,
          message: `${target.name} (${target.role}) was killed during a ${severity} breach`,
        });
        break;

      case 'lost':
        target.health = 'lost';
        target.lostDay = state.time.day;
        notifications.push({
          type: 'BREACH_LOST',
          classification: 'critical',
          characterId: target.id,
          characterName: target.name,
          role: target.role,
          severity,
          message: `${target.name} (${target.role}) was swept away in the mist during a ${severity} breach`,
        });
        break;
    }
  },

  /**
   * Roll civilian outcome by severity with optional tower mitigation for priests.
   * Returns one of: 'injured', 'mist_madness', 'gravely_injured', 'dead', 'lost'
   */
  rollCivilianOutcome(target, severity, state, br, rng) {
    // Base outcome probabilities by severity
    const tables = {
      minor:        { injured: 0.80, mist_madness: 0.20 },
      moderate:     { injured: 0.60, gravely_injured: 0.20, lost: 0.20 },
      major:        { gravely_injured: 0.40, dead: 0.30, lost: 0.30 },
      catastrophic: { gravely_injured: 0.30, dead: 0.40, lost: 0.30 },
    };

    const probs = { ...(tables[severity] || tables.minor) };

    // Tower-pinned priest mitigation: reduce dead + lost probabilities
    if (this.isPriestPinned(target, state)) {
      const mitigation = br.towerPinnedMitigation;
      if (probs.dead) probs.dead *= mitigation;
      if (probs.lost) probs.lost *= mitigation;
      // Redistribute reduced probability to gravely_injured (or injured if no gravely)
      const total = Object.values(probs).reduce((s, v) => s + v, 0);
      const deficit = 1.0 - total;
      if (deficit > 0.001) {
        if (probs.gravely_injured !== undefined) {
          probs.gravely_injured += deficit;
        } else if (probs.injured !== undefined) {
          probs.injured += deficit;
        }
      }
    }

    // Convert to weighted pick
    const options = Object.entries(probs).map(([outcome, weight]) => ({ value: outcome, weight }));
    return rng.weightedPick(options);
  },
};

export default BreachModule;
