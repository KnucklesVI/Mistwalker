/**
 * CombatModule - 1v1 encounter-based combat
 *
 * Combat model:
 *   1. Raid arrives with 1 creature (Vector-typed, single offense stat)
 *   2. Encounter roll chain: MW (50%) → soldiers (10% each) → random civilian
 *   3. 1v1 resolution: defender.defense × roleMultiplier × (1 - instability) vs creature.offense
 *   4. Win: creature leaves, Vector revealed in compendium
 *   5. Lose: defender injured/killed, creature leaves, Vector revealed
 *   6. Tower-pinned priests have reduced targeting chance in civilian pool
 */

import CreaturesModule from './creatures.js?v=5z';
import PressureModule from './pressure.js?v=5z';

const CombatModule = {
  initialize(config, state) {
    // Combat initialized
  },

  /**
   * Calculate a defender's effective defense value.
   * Formula: (body × roleMultiplier + bonuses) × (1 - instability)
   */
  calculateDefense(defender, instability, config) {
    let multiplier;
    switch (defender.role) {
      case 'mistwalker':
        multiplier = config.combat.mwBodyMultiplier;
        break;
      case 'soldier':
        multiplier = config.combat.soldierBodyMultiplier;
        break;
      default:
        multiplier = config.combat.civilianBodyMultiplier;
    }

    let defense = defender.body * multiplier;

    // MW home defense bonus
    if (defender.role === 'mistwalker') {
      defense += config.combat.mwHomeDefenseBonus;
    }

    // Veteran bonus for soldiers
    if (defender.role === 'soldier' && defender.tier === 'veteran') {
      defense *= config.combat.veteranBonus;
    }

    // Gap reduces defense
    defense *= (1 - instability);

    return defense;
  },

  /**
   * Pick a civilian target from the non-combatant pool.
   * Tower-pinned priests have reduced targeting weight.
   */
  pickCivilianTarget(state, config, rng) {
    // Eligible: alive, not MW, not soldier, not scholar
    const eligible = state.population.characters.filter(c =>
      c.health === 'active' &&
      c.role !== 'mistwalker' &&
      c.role !== 'soldier' &&
      c.role !== 'scholar'
    );

    if (eligible.length === 0) return null;

    const targetWeights = config.pressure.breachResolution.targetWeights;
    const options = eligible.map(c => {
      let weight = targetWeights[c.role] || 1.0;

      // Tower protection for pinned priests
      if (c.role === 'priest') {
        const pins = state.buildings?.towerPins;
        if (pins) {
          const towerEntry = Object.entries(pins).find(([_, priestId]) => priestId === c.id);
          if (towerEntry) {
            const towerId = towerEntry[0];
            const tower = state.buildings.structures.find(s => s.id === towerId);
            if (tower) {
              const towerConfig = config.structures.towers[tower.type];
              const level = towerConfig?.level || 1;
              const protection = config.combat.towerPriestProtection * level;
              weight *= Math.max(0, 1 - protection);
            }
          }
        }
      }

      return { value: c, weight };
    });

    // Filter out zero-weight targets
    const validOptions = options.filter(o => o.weight > 0);
    if (validOptions.length === 0) {
      return eligible.length > 0 ? rng.pick(eligible) : null;
    }

    return rng.weightedPick(validOptions);
  },

  /**
   * Apply injury or death to a combat loser.
   * MW never dies in combat. Others may die based on how badly they lost.
   */
  applyDefenderLoss(defender, creatureOffense, effectiveDefense, config, rng) {
    const h = config.health;

    // MW never dies in combat
    if (defender.role === 'mistwalker') {
      const isGravely = creatureOffense >= effectiveDefense * 2;
      if (isGravely) {
        defender.health = 'gravely_injured';
        defender.healingDaysRemaining = rng.randInt(h.gravelyInjuredRecoveryMin, h.gravelyInjuredRecoveryMax);
      } else {
        defender.health = 'injured';
        defender.healingDaysRemaining = rng.randInt(h.injuredRecoveryMin, h.injuredRecoveryMax);
      }
      return defender.health;
    }

    // For soldiers and civilians: death chance based on how badly outmatched
    const margin = creatureOffense - effectiveDefense;
    const deathChance = margin >= creatureOffense * 0.5 ? 0.50 : 0.15;

    if (rng.chance(deathChance)) {
      defender.health = 'dead';
      return 'dead';
    }

    const isGravely = margin >= creatureOffense * 0.3;
    if (isGravely) {
      defender.health = 'gravely_injured';
      defender.healingDaysRemaining = rng.randInt(h.gravelyInjuredRecoveryMin, h.gravelyInjuredRecoveryMax);
    } else {
      defender.health = 'injured';
      defender.healingDaysRemaining = rng.randInt(h.injuredRecoveryMin, h.injuredRecoveryMax);
    }
    return defender.health;
  },

  /**
   * COMBAT phase — resolve active raids via 1v1 encounters.
   */
  update(state, rng, config, notifications) {
    const snapshot = PressureModule.calculate(state, config);
    const instability = snapshot.instability;

    for (const raid of state.combat.activeRaids) {
      // Don't resolve on arrival day — gives player one day to react
      if (raid.activatedDay === state.time.day) continue;

      const creatureType = state.creatures?.types?.find(c => c.id === raid.creatureTypeId);
      const creatureOffense = creatureType?.offense || raid.strength;

      // ── Encounter chain ──
      let defender = null;
      let engagementSource = null;

      // 1. MW check
      const mw = state.population.characters.find(c => c.role === 'mistwalker');
      const mwState = state.exploration?.mwState;
      const mwAvailable = mw
        && mw.health === 'active'
        && mwState?.status === 'home';

      if (mwAvailable && rng.chance(config.combat.mwEngageChance)) {
        defender = mw;
        engagementSource = 'mw';
      }

      // 2. Soldier check (stop at first engagement)
      if (!defender) {
        const soldiers = state.population.characters.filter(
          c => c.role === 'soldier' && c.assignment === 'garrison' && c.health === 'active'
        );
        for (const soldier of soldiers) {
          if (rng.chance(config.combat.soldierEngageChance)) {
            defender = soldier;
            engagementSource = 'soldier';
            break;
          }
        }
      }

      // 3. Civilian target (weighted, tower-protected priests)
      if (!defender) {
        defender = this.pickCivilianTarget(state, config, rng);
        engagementSource = 'civilian';
      }

      // No target found — creature passes harmlessly
      if (!defender) {
        raid.status = 'resolved';
        notifications.push({
          type: 'COMBAT_RESULT',
          raidId: raid.id,
          outcome: 'no_target',
          classification: 'notable',
          message: `A creature emerged from the mist but found no one to engage`,
        });
        state.combat.combatLog.push({
          raidId: raid.id,
          day: state.time.day,
          outcome: 'no_target',
          creatureTypeId: raid.creatureTypeId,
          creatureName: raid.creatureName,
        });
        continue;
      }

      // ── 1v1 Resolution ──
      let effectiveDefense = this.calculateDefense(defender, instability, config);

      // Scout bonus: +10% defense if raid was scouted
      if (raid.scouted && config.combat.scoutBonus) {
        effectiveDefense *= (1 + config.combat.scoutBonus);
      }

      raid.status = 'resolved';

      if (effectiveDefense >= creatureOffense) {
        // ── DEFENDER WINS ──
        notifications.push({
          type: 'COMBAT_RESULT',
          raidId: raid.id,
          outcome: 'victory',
          classification: 'notable',
          defenderId: defender.id,
          defenderName: defender.name,
          defenderRole: defender.role,
          engagementSource,
          creatureName: raid.creatureName,
          message: `${defender.name} repelled a ${raid.creatureName} (defense ${effectiveDefense.toFixed(1)} vs offense ${creatureOffense})`,
        });

        state.combat.combatLog.push({
          raidId: raid.id,
          day: state.time.day,
          outcome: 'victory',
          defenderId: defender.id,
          defenderName: defender.name,
          defenderRole: defender.role,
          engagementSource,
          creatureTypeId: raid.creatureTypeId,
          creatureName: raid.creatureName,
          defense: effectiveDefense,
          offense: creatureOffense,
        });
      } else {
        // ── DEFENDER LOSES ──
        const injury = this.applyDefenderLoss(defender, creatureOffense, effectiveDefense, config, rng);

        const injuryLabel = injury === 'dead' ? 'killed'
          : injury === 'gravely_injured' ? 'gravely wounded'
          : 'wounded';

        notifications.push({
          type: 'COMBAT_RESULT',
          raidId: raid.id,
          outcome: 'defeat',
          classification: injury === 'dead' ? 'critical' : 'warning',
          defenderId: defender.id,
          defenderName: defender.name,
          defenderRole: defender.role,
          engagementSource,
          injury,
          creatureName: raid.creatureName,
          message: `${defender.name} was ${injuryLabel} by a ${raid.creatureName} (defense ${effectiveDefense.toFixed(1)} vs offense ${creatureOffense})`,
        });

        state.combat.combatLog.push({
          raidId: raid.id,
          day: state.time.day,
          outcome: 'defeat',
          defenderId: defender.id,
          defenderName: defender.name,
          defenderRole: defender.role,
          engagementSource,
          injury,
          creatureTypeId: raid.creatureTypeId,
          creatureName: raid.creatureName,
          defense: effectiveDefense,
          offense: creatureOffense,
        });
      }

      // ── Always reveal Vector in compendium ──
      if (raid.creatureTypeId) {
        CreaturesModule.recordCombatEncounter(
          state,
          raid.creatureTypeId,
          state.time.day,
          effectiveDefense >= creatureOffense ? 'victory' : 'defeat'
        );
      }
    }

    // Remove resolved raids
    state.combat.activeRaids = state.combat.activeRaids.filter(r => r.status !== 'resolved');
  },

  getState(state) {
    return {
      activeRaids: state.combat.activeRaids.map(r => ({ ...r })),
      combatLog: [...state.combat.combatLog],
    };
  },
};

export default CombatModule;
