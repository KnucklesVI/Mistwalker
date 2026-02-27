/**
 * MistModule - manages mist clock and raid generation
 *
 * Perimeter stability and gap consequences have been removed.
 * Those are now handled by PressureModule + BreachModule.
 *
 * This module:
 *   - Advances the mist clock each day
 *   - Generates raids (1 creature per raid for minimal experience)
 *   - Promotes incoming raids to active when their arrival day comes
 *   - Provides helper methods for reading perimeter priests/soldiers/MW
 */

const MistModule = {
  initialize(config, state) {
    // Mist already initialized in state
  },

  // ── Read-only containment contributor helpers (used by PressureModule) ──

  /**
   * Healthy priests currently assigned to perimeter duty.
   */
  getPerimeterPriests(state) {
    return state.population.characters.filter(
      c => c.role === 'priest' && c.assignment === 'perimeter' && c.health === 'active'
    );
  },

  /**
   * The mistwalker character if alive, healthy, and assigned to perimeter.
   */
  getActiveMistwalker(state) {
    const mw = state.population.characters.find(
      c => c.role === 'mistwalker' && c.assignment === 'perimeter' && c.health === 'active'
    );
    return mw || null;
  },

  /**
   * Soldiers on garrison duty with active health.
   */
  getActiveSoldiers(state) {
    return state.population.characters.filter(
      c => c.role === 'soldier' && c.assignment === 'garrison' && c.health === 'active'
    );
  },

  /**
   * MIST_TICK: advance clock, generate raids
   * Gap consequences are handled by PressureModule + BreachModule
   */
  update(state, rng, config, notifications) {
    // Advance clock
    state.mist.clock += 1;

    // ── Raid generation ──
    const raidConfig = config.raids;
    const warningDays = raidConfig.warningDays || 3;

    // Initialize nextRaidDay on first tick
    if (state.mist.nextRaidDay === null) {
      state.mist.nextRaidDay = rng.randInt(raidConfig.firstRaidDayMin, raidConfig.firstRaidDayMax);
    }

    // Check if it's time to generate a raid
    if (state.time.day >= state.mist.nextRaidDay) {
      const hasIncoming = state.mist.raidQueue.some(r => r.status === 'incoming');
      if (!hasIncoming) {
        // Pick a creature type from the world pool
        const creatureTypes = state.creatures?.types || [];
        const creatureType = creatureTypes.length > 0
          ? rng.pick(creatureTypes)
          : null;

        // Always 1 creature per raid (minimal experience)
        const size = 'sm';
        const creatureCount = 1;

        // Creature offense (used as raid strength)
        let raidStrength = 6; // fallback
        if (creatureType) {
          raidStrength = creatureType.offense || 6;
        }

        const isAnnounced = !rng.chance(raidConfig.unannouncedChance);
        const arrivalDay = state.time.day + (isAnnounced ? warningDays : 0);

        const raid = {
          id: `raid_${state.time.day}_${rng.randInt(0, 9999)}`,
          day: state.time.day,
          arrivalDay,
          strength: raidStrength,
          announced: isAnnounced,
          status: isAnnounced ? 'incoming' : 'active',
          creatureTypeId: creatureType ? creatureType.id : null,
          creatureName: creatureType ? creatureType.name : 'Unknown',
          vectorId: creatureType ? creatureType.vectorId : null,
          size,
          count: creatureCount,
          scouted: false,
        };

        state.mist.raidQueue.push(raid);
        state.mist.raidCount++;

        const ballpark = Math.round(raidStrength / 5) * 5;

        if (isAnnounced) {
          notifications.push({
            type: 'RAID_WARNING',
            strength: ballpark,
            arrivalDay,
            daysUntil: warningDays,
            raidId: raid.id,
            message: `The mist stirs — something approaches in ~${warningDays} days`,
            classification: 'critical',
          });
        } else {
          // Unannounced — hits immediately but gives one day to prepare
          raid.activatedDay = state.time.day;
          state.combat.activeRaids.push(raid);
          notifications.push({
            type: 'RAID_ARRIVED',
            strength: ballpark,
            announced: false,
            raidId: raid.id,
            message: `A creature emerges from the mist without warning!`,
            classification: 'critical',
          });
        }

        // Schedule next raid with shrinking interval
        const raidNum = state.mist.raidCount;
        const intMax = Math.max(raidConfig.minInterval,
          raidConfig.intervalMax - raidNum * raidConfig.intervalShrinkPerRaid);
        const intMin = Math.max(raidConfig.minInterval, raidConfig.intervalMin);
        state.mist.nextRaidDay = state.time.day + rng.randInt(intMin, Math.ceil(intMax));
      }
    }

    // Promote incoming raids when their arrival day comes
    for (const raid of state.mist.raidQueue) {
      if (raid.status === 'incoming' && state.time.day >= raid.arrivalDay) {
        raid.status = 'active';
        raid.activatedDay = state.time.day;
        state.combat.activeRaids.push(raid);

        const creatureInfo = raid.scouted && raid.creatureName
          ? ` — ${raid.creatureName}`
          : '';

        notifications.push({
          type: 'RAID_ARRIVED',
          strength: raid.strength,
          announced: true,
          raidId: raid.id,
          creatureInfo,
          message: `A creature has arrived!${creatureInfo}`,
          classification: 'critical',
        });
      }
    }
  },

  getState(state) {
    const raidQueue = state.mist.raidQueue.map(r => {
      const visible = {
        id: r.id,
        day: r.day,
        arrivalDay: r.arrivalDay,
        announced: r.announced,
        status: r.status,
        scouted: r.scouted || false,
      };

      if (r.scouted) {
        visible.strength = r.strength;
        visible.creatureName = r.creatureName;
        visible.creatureTypeId = r.creatureTypeId;
        visible.size = r.size;
        visible.count = r.count;
        visible.daysUntil = Math.max(0, r.arrivalDay - state.time.day);
      } else {
        visible.strength = Math.round(r.strength / 5) * 5;
        visible.daysUntil = r.announced
          ? `~${Math.max(0, r.arrivalDay - state.time.day)}`
          : null;
      }

      return visible;
    });

    return {
      clock: state.mist.clock,
      raidQueue,
      sourceAwareness: state.mist.sourceAwareness,
      nextRaidDay: state.mist.nextRaidDay,
      raidCount: state.mist.raidCount,
    };
  },
};

export default MistModule;
