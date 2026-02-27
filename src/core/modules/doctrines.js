/**
 * DoctrinesModule - soldier doctrines, priest actions, and combat ability management
 *
 * Doctrines/abilities are unlocked by studying books in the library.
 * Each maps to a trait counter (primary = full negation, secondary = ~50%).
 * Soldiers select which doctrine to TRY each fight. Priests choose ward/invoke/pray/cancel.
 * Engineers prep builds/modifications days before.
 *
 * The COUNTER_MAP is the authoritative source for what counters what.
 */

// ── Counter map: trait → primary + secondary counters ───────────────
// Each counter has: name, role, form, effectiveness (1.0 = full, 0.5 = half)

const COUNTER_MAP = {
  burrowing: {
    primary:   { id: 'tunnel_collapse',       name: 'Tunnel Collapse Traps',   role: 'engineer', form: 'build',   effectiveness: 1.0 },
    secondary: { id: 'ground_consecration',   name: 'Ground Consecration',     role: 'priest',   form: 'ward',    effectiveness: 0.5 },
  },
  armored: {
    primary:   { id: 'weak_point_targeting',  name: 'Weak Point Targeting',    role: 'soldier',  form: 'doctrine', effectiveness: 1.0 },
    secondary: { id: 'armor_piercing_bolts',  name: 'Armor-Piercing Bolts',    role: 'engineer', form: 'build',   effectiveness: 0.5 },
  },
  flying: {
    primary:   { id: 'net_launchers',         name: 'Net Launchers',           role: 'engineer', form: 'deploy',  effectiveness: 1.0 },
    secondary: { id: 'sky_ward',              name: 'Sky Ward',                role: 'priest',   form: 'ward',    effectiveness: 0.5 },
  },
  swarming: {
    primary:   { id: 'disruption_formation',  name: 'Disruption Formation',    role: 'soldier',  form: 'doctrine', effectiveness: 1.0 },
    secondary: { id: 'scatter_ward',          name: 'Scatter Ward',            role: 'priest',   form: 'ward',    effectiveness: 0.5 },
  },
  charging: {
    primary:   { id: 'bracing_barricades',    name: 'Bracing Barricades',      role: 'engineer', form: 'build',   effectiveness: 1.0 },
    secondary: { id: 'sidestep_stance',       name: 'Sidestep Stance',         role: 'soldier',  form: 'doctrine', effectiveness: 0.5 },
  },
  grappling: {
    primary:   { id: 'severing_strike',       name: 'Severing Strike',         role: 'soldier',  form: 'doctrine', effectiveness: 1.0 },
    secondary: { id: 'slick_coating_traps',   name: 'Slick Coating Traps',     role: 'engineer', form: 'build',   effectiveness: 0.5 },
  },
  camouflaged: {
    primary:   { id: 'detection_ward',        name: 'Detection Ward',          role: 'priest',   form: 'ward',    effectiveness: 1.0 },
    secondary: { id: 'tripwire_perimeter',    name: 'Tripwire Perimeter',      role: 'engineer', form: 'build',   effectiveness: 0.5 },
  },
  heat_aura: {
    primary:   { id: 'cooling_flood',         name: 'Cooling Flood Traps',     role: 'engineer', form: 'build',   effectiveness: 1.0 },
    secondary: { id: 'frost_invocation',      name: 'Frost Invocation',        role: 'priest',   form: 'invoke',  effectiveness: 0.5 },
  },
  electric: {
    primary:   { id: 'grounding_pylons',      name: 'Grounding Pylons',        role: 'engineer', form: 'build',   effectiveness: 1.0 },
    secondary: { id: 'insulated_stance',      name: 'Insulated Stance',        role: 'soldier',  form: 'doctrine', effectiveness: 0.5 },
  },
  frost_touch: {
    primary:   { id: 'warming_braziers',      name: 'Warming Braziers',        role: 'engineer', form: 'build',   effectiveness: 1.0 },
    secondary: { id: 'inner_fire_rite',       name: 'Inner Fire Rite',         role: 'priest',   form: 'invoke',  effectiveness: 0.5 },
  },
  corrosive: {
    primary:   { id: 'purification_rite',     name: 'Purification Rite',       role: 'priest',   form: 'invoke',  effectiveness: 1.0 },
    secondary: { id: 'resistant_coatings',    name: 'Resistant Coatings',      role: 'engineer', form: 'build',   effectiveness: 0.5 },
  },
  shadow_cloak: {
    primary:   { id: 'luminous_ward',         name: 'Luminous Ward',           role: 'priest',   form: 'ward',    effectiveness: 1.0 },
    secondary: { id: 'flare_launchers',       name: 'Flare Launchers',         role: 'engineer', form: 'deploy',  effectiveness: 0.5 },
  },
  spore_cloud: {
    primary:   { id: 'wind_channels',         name: 'Wind Channels',           role: 'engineer', form: 'modify',  effectiveness: 1.0 },
    secondary: { id: 'breath_discipline',     name: 'Breath Discipline',       role: 'soldier',  form: 'doctrine', effectiveness: 0.5 },
  },
  phasing: {
    primary:   { id: 'spiritual_anchor',      name: 'Spiritual Anchor',        role: 'priest',   form: 'invoke',  effectiveness: 1.0 },
    secondary: { id: 'true_sight_focus',      name: 'True-Sight Focus',        role: 'soldier',  form: 'doctrine', effectiveness: 0.5 },
  },
  regenerating: {
    primary:   { id: 'cauterizing_strike',    name: 'Cauterizing Strike',      role: 'soldier',  form: 'doctrine', effectiveness: 1.0 },
    secondary: { id: 'burning_pitch_traps',   name: 'Burning Pitch Traps',     role: 'engineer', form: 'build',   effectiveness: 0.5 },
  },
  sonic: {
    primary:   { id: 'sound_dampening_walls', name: 'Sound Dampening Walls',   role: 'engineer', form: 'modify',  effectiveness: 1.0 },
    secondary: { id: 'steadfast_formation',   name: 'Steadfast Formation',     role: 'soldier',  form: 'doctrine', effectiveness: 0.5 },
  },
  fear_aura: {
    primary:   { id: 'courage_rite',          name: 'Courage Rite',            role: 'priest',   form: 'invoke',  effectiveness: 1.0 },
    secondary: { id: 'iron_will',             name: 'Iron Will',               role: 'soldier',  form: 'doctrine', effectiveness: 0.5 },
  },
  life_drain: {
    primary:   { id: 'soul_ward',             name: 'Soul Ward',               role: 'priest',   form: 'ward',    effectiveness: 1.0 },
    secondary: { id: 'vital_sealing_salve',   name: 'Vital Sealing Salve',     role: 'engineer', form: 'build',   effectiveness: 0.5 },
  },
  mimic: {
    primary:   { id: 'feint_tactics',         name: 'Feint Tactics',           role: 'soldier',  form: 'doctrine', effectiveness: 1.0 },
    secondary: { id: 'chaos_blessing',        name: 'Chaos Blessing',          role: 'priest',   form: 'invoke',  effectiveness: 0.5 },
  },
  hive_mind: {
    primary:   { id: 'severance_rite',        name: 'Severance Rite',          role: 'priest',   form: 'invoke',  effectiveness: 1.0 },
    secondary: { id: 'simultaneous_strike',   name: 'Simultaneous Strike',     role: 'soldier',  form: 'doctrine', effectiveness: 0.5 },
  },
};

// ── Exported helpers ─────────────────────────────────────────────────

const DoctrinesModule = {

  /**
   * Get the full counter map
   */
  getCounterMap() {
    return COUNTER_MAP;
  },

  /**
   * Get all soldier doctrines from the counter map
   * Returns array of { id, name, traitId, effectiveness }
   */
  getAllSoldierDoctrines() {
    const doctrines = [];
    for (const [traitId, counters] of Object.entries(COUNTER_MAP)) {
      if (counters.primary.role === 'soldier' && counters.primary.form === 'doctrine') {
        doctrines.push({
          id: counters.primary.id,
          name: counters.primary.name,
          traitId,
          effectiveness: counters.primary.effectiveness,
          isPrimary: true,
        });
      }
      if (counters.secondary.role === 'soldier' && counters.secondary.form === 'doctrine') {
        doctrines.push({
          id: counters.secondary.id,
          name: counters.secondary.name,
          traitId,
          effectiveness: counters.secondary.effectiveness,
          isPrimary: false,
        });
      }
    }
    return doctrines;
  },

  /**
   * Get all priest actions (wards + invocations) from the counter map
   */
  getAllPriestActions() {
    const actions = [];
    for (const [traitId, counters] of Object.entries(COUNTER_MAP)) {
      if (counters.primary.role === 'priest') {
        actions.push({
          id: counters.primary.id,
          name: counters.primary.name,
          form: counters.primary.form,
          traitId,
          effectiveness: counters.primary.effectiveness,
          isPrimary: true,
        });
      }
      if (counters.secondary.role === 'priest') {
        actions.push({
          id: counters.secondary.id,
          name: counters.secondary.name,
          form: counters.secondary.form,
          traitId,
          effectiveness: counters.secondary.effectiveness,
          isPrimary: false,
        });
      }
    }
    return actions;
  },

  /**
   * Get all engineer preparations from the counter map
   */
  getAllEngineerPreps() {
    const preps = [];
    for (const [traitId, counters] of Object.entries(COUNTER_MAP)) {
      if (counters.primary.role === 'engineer') {
        preps.push({
          id: counters.primary.id,
          name: counters.primary.name,
          form: counters.primary.form,
          traitId,
          effectiveness: counters.primary.effectiveness,
          isPrimary: true,
        });
      }
      if (counters.secondary.role === 'engineer') {
        preps.push({
          id: counters.secondary.id,
          name: counters.secondary.name,
          form: counters.secondary.form,
          traitId,
          effectiveness: counters.secondary.effectiveness,
          isPrimary: false,
        });
      }
    }
    return preps;
  },

  /**
   * Get all counters relevant to a specific set of active traits.
   * Returns array of { abilityId, abilityName, role, form, countersTraitId,
   *   effectiveness, isPrimary, label } — ready for UI display.
   */
  getCountersForTraits(activeTraits) {
    const results = [];
    for (const trait of activeTraits) {
      const counters = COUNTER_MAP[trait.id];
      if (!counters) continue;
      results.push({
        abilityId: counters.primary.id,
        abilityName: counters.primary.name,
        role: counters.primary.role,
        form: counters.primary.form,
        countersTraitId: trait.id,
        effectiveness: counters.primary.effectiveness,
        isPrimary: true,
        label: `${counters.primary.name} — counters ${trait.id} (primary)`,
      });
      results.push({
        abilityId: counters.secondary.id,
        abilityName: counters.secondary.name,
        role: counters.secondary.role,
        form: counters.secondary.form,
        countersTraitId: trait.id,
        effectiveness: counters.secondary.effectiveness,
        isPrimary: false,
        label: `${counters.secondary.name} — counters ${trait.id} (secondary)`,
      });
    }
    return results;
  },

  /**
   * Find what counter (if any) a given ability ID targets
   * Returns { traitId, effectiveness, isPrimary } or null
   */
  findCounterTarget(abilityId) {
    for (const [traitId, counters] of Object.entries(COUNTER_MAP)) {
      if (counters.primary.id === abilityId) {
        return { traitId, effectiveness: counters.primary.effectiveness, isPrimary: true };
      }
      if (counters.secondary.id === abilityId) {
        return { traitId, effectiveness: counters.secondary.effectiveness, isPrimary: false };
      }
    }
    return null;
  },

  /**
   * Given a set of active traits and a set of applied counters,
   * calculate the damage reduction.
   *
   * @param {Array} activeTraits - trait objects from the creature
   * @param {Array} appliedCounters - array of { abilityId } currently active
   * @param {Object} config - creature config (unused in new model, kept for signature compat)
   * @returns {{ mitigationMap: Object, results: Array }}
   *   mitigationMap: { traitId: mitigation [0.0-1.0] } per active trait
   *   results: detailed per-trait breakdown for logging
   *
   * SYSTEM_SPEC §2.3: Per-trait mitigation. Primary counter = 1.0, secondary = 0.5.
   */
  calculateCounterEffects(activeTraits, appliedCounters, config) {
    const mitigationMap = {};
    const results = [];

    for (const trait of activeTraits) {
      const counters = COUNTER_MAP[trait.id];
      if (!counters) {
        mitigationMap[trait.id] = 0.0;
        results.push({
          traitId: trait.id,
          abilityId: null,
          mitigation: 0.0,
          effective: false,
        });
        continue;
      }

      // Check if any applied counter matches this trait
      let matched = false;
      for (const counter of appliedCounters) {
        if (counters.primary.id === counter.abilityId) {
          // Primary: 100% mitigation of this trait's damage
          mitigationMap[trait.id] = 1.0;
          results.push({
            traitId: trait.id,
            abilityId: counter.abilityId,
            abilityName: counters.primary.name,
            mitigation: 1.0,
            effective: true,
          });
          matched = true;
          break;
        }
        if (counters.secondary.id === counter.abilityId) {
          // Secondary: 50% mitigation of this trait's damage
          mitigationMap[trait.id] = 0.5;
          results.push({
            traitId: trait.id,
            abilityId: counter.abilityId,
            abilityName: counters.secondary.name,
            mitigation: 0.5,
            effective: true,
          });
          matched = true;
          break;
        }
      }

      if (!matched) {
        mitigationMap[trait.id] = 0.0;
        results.push({
          traitId: trait.id,
          abilityId: null,
          mitigation: 0.0,
          effective: false,
        });
      }
    }

    return { mitigationMap, results };
  },

  /**
   * Initialize combat selections for an incoming raid.
   * Creates a pending combat decisions object in state.
   *
   * @param {Object} state - game state
   * @param {string} raidId - the raid to prepare for
   */
  initCombatSelections(state, raidId) {
    if (!state.combat.pendingSelections) {
      state.combat.pendingSelections = {};
    }

    state.combat.pendingSelections[raidId] = {
      soldiers: {},   // characterId → { doctrineId }
      priests: {},    // characterId → { action: 'ward'|'invoke'|'pray'|'cancel', abilityId? }
      ready: false,
    };
  },

  /**
   * Set a soldier's doctrine selection for a specific raid
   */
  setSoldierDoctrine(state, raidId, soldierId, doctrineId) {
    const selections = state.combat.pendingSelections?.[raidId];
    if (!selections) return false;

    selections.soldiers[soldierId] = { doctrineId };
    return true;
  },

  /**
   * Set a priest's combat action for a specific raid
   */
  setPriestAction(state, raidId, priestId, action, abilityId) {
    const selections = state.combat.pendingSelections?.[raidId];
    if (!selections) return false;

    // Valid actions: 'ward', 'invoke', 'pray', 'cancel'
    selections.priests[priestId] = { action, abilityId: abilityId || null };
    return true;
  },

  /**
   * Mark combat selections as ready (player confirmed)
   */
  confirmSelections(state, raidId) {
    const selections = state.combat.pendingSelections?.[raidId];
    if (!selections) return false;

    selections.ready = true;
    return true;
  },

  /**
   * Gather all applied counters from selections for a raid.
   * Combines soldier doctrines + priest invocations/wards + engineer preps.
   *
   * @returns {Array<{ abilityId, sourceId, sourceRole }>}
   */
  gatherAppliedCounters(state, raidId) {
    const selections = state.combat.pendingSelections?.[raidId];
    const counters = [];

    if (selections) {
      // Soldier doctrines
      for (const [soldierId, sel] of Object.entries(selections.soldiers)) {
        if (sel.doctrineId) {
          counters.push({
            abilityId: sel.doctrineId,
            sourceId: soldierId,
            sourceRole: 'soldier',
          });
        }
      }

      // Priest actions (only invoke and ward apply counters)
      for (const [priestId, sel] of Object.entries(selections.priests)) {
        if ((sel.action === 'invoke' || sel.action === 'ward') && sel.abilityId) {
          counters.push({
            abilityId: sel.abilityId,
            sourceId: priestId,
            sourceRole: 'priest',
          });
        }
      }
    }

    // Engineer preps (from active build slots — future expansion)
    // For now, engineer counters come from state.combat.activePreps
    const activePreps = state.combat.activePreps || [];
    for (const prep of activePreps) {
      counters.push({
        abilityId: prep.abilityId,
        sourceId: prep.engineerId || 'engineer',
        sourceRole: 'engineer',
      });
    }

    return counters;
  },

  /**
   * Get abilities a character has learned
   * Checks state.library.unlockedAbilities for matching role
   */
  getLearnedAbilities(state, characterId) {
    const char = state.population.characters.find(c => c.id === characterId);
    if (!char) return [];

    const unlocked = state.library?.unlockedAbilities || [];
    const role = char.role;

    // Filter by role match
    return unlocked.filter(a => {
      const counter = this.findCounterTarget(a.abilityId);
      if (!counter) return false;

      // Check if this ability belongs to this role
      const traitCounters = COUNTER_MAP[counter.traitId];
      if (!traitCounters) return false;

      if (traitCounters.primary.id === a.abilityId && traitCounters.primary.role === role) return true;
      if (traitCounters.secondary.id === a.abilityId && traitCounters.secondary.role === role) return true;

      return false;
    });
  },

  /**
   * Get confirmed doctrines for a soldier (ones that have been field-tested and proven effective)
   */
  getConfirmedDoctrines(state, soldierId) {
    return (state.combat.confirmedDoctrines || []).filter(d => d.soldierId === soldierId);
  },

  /**
   * Record that a doctrine was tested in combat
   */
  recordDoctrineTest(state, soldierId, doctrineId, traitId, effective, day) {
    if (!state.combat.doctrineTests) state.combat.doctrineTests = [];

    state.combat.doctrineTests.push({
      soldierId,
      doctrineId,
      traitId,
      effective,
      day,
    });

    // If effective, add to confirmed doctrines
    if (effective) {
      if (!state.combat.confirmedDoctrines) state.combat.confirmedDoctrines = [];

      const alreadyConfirmed = state.combat.confirmedDoctrines.some(
        d => d.doctrineId === doctrineId && d.traitId === traitId
      );

      if (!alreadyConfirmed) {
        state.combat.confirmedDoctrines.push({
          soldierId,
          doctrineId,
          traitId,
          confirmedDay: day,
        });
      }
    }
  },
};

export default DoctrinesModule;
