/**
 * BuildingModule - tower construction, priest assignments, and repairs
 *
 * Towers protect priests from breach consequences and reduce targeting chance.
 * Engineers on 'building' assignment advance repairs (priority) then construction.
 *
 * Walls and traps have been removed from the spec.
 */

const BuildingModule = {

  // ── Queries ──

  /**
   * Get the config entry for a tower type.
   * @param {string} type - 'wood', 'stone', 'fortified'
   * @param {object} config
   * @returns {object|null}
   */
  getTowerConfig(type, config) {
    return config.structures?.towers?.[type] || null;
  },

  /**
   * List recipes the player can currently build.
   * Returns array of { category, type, name, cost, buildDays, canAfford }.
   */
  getAvailableRecipes(state, config) {
    const recipes = [];
    const unlocked = state.buildings?.unlockedTypes || [];

    // Towers only
    for (const [type, tc] of Object.entries(config.structures?.towers || {})) {
      if (tc.requiresUnlock && !unlocked.includes(`${type}_tower`)) continue;
      const canAfford = Object.entries(tc.cost).every(
        ([res, amt]) => (state.resources[res] || 0) >= amt
      );
      recipes.push({
        id: `tower_${type}`,
        category: 'tower',
        type,
        name: tc.name,
        cost: { ...tc.cost },
        buildDays: tc.buildDays,
        canAfford,
      });
    }

    return recipes;
  },

  /**
   * Tower protection info.
   * Returns an array of { id, type, level } sorted best-first, one per intact tower.
   */
  getTowerProtection(state, config) {
    const towers = [];
    for (const s of (state.buildings?.structures || [])) {
      if (s.category === 'tower' && s.hp > 0) {
        const tc = this.getTowerConfig(s.type, config);
        if (tc) towers.push({ id: s.id, type: s.type, level: tc.level || 1 });
      }
    }
    // Best towers first (fortified > stone > wood)
    towers.sort((a, b) => b.level - a.level);
    return towers;
  },

  /**
   * Compute priest-to-tower assignments.
   * Respects manual pins (towerPins), then auto-assigns remaining priests
   * sorted by Spirit (highest first) to remaining towers (best first).
   *
   * Returns array of { towerId, towerType, level, priestId, priestName, pinned }
   */
  getTowerAssignments(state, config) {
    const intactTowers = this.getTowerProtection(state, config);
    if (intactTowers.length === 0) return [];

    const priests = state.population.characters.filter(
      c => c.role === 'priest' && c.assignment === 'perimeter' && c.health === 'active'
    );

    const pins = state.buildings?.towerPins || {};
    const assignments = [];
    const assignedPriestIds = new Set();
    const assignedTowerIds = new Set();

    // Pass 1: honor manual pins
    for (const tower of intactTowers) {
      const pinnedPriestId = pins[tower.id];
      if (pinnedPriestId) {
        const priest = priests.find(p => p.id === pinnedPriestId);
        if (priest && !assignedPriestIds.has(priest.id)) {
          assignments.push({
            towerId: tower.id,
            towerType: tower.type,
            level: tower.level,
            priestId: priest.id,
            priestName: priest.name,
            pinned: true,
          });
          assignedPriestIds.add(priest.id);
          assignedTowerIds.add(tower.id);
        }
      }
    }

    // Pass 2: auto-assign remaining priests by Spirit (descending)
    const remainingPriests = priests
      .filter(p => !assignedPriestIds.has(p.id))
      .sort((a, b) => b.spirit - a.spirit);
    const remainingTowers = intactTowers.filter(t => !assignedTowerIds.has(t.id));

    for (let i = 0; i < remainingTowers.length; i++) {
      const tower = remainingTowers[i];
      const priest = i < remainingPriests.length ? remainingPriests[i] : null;
      assignments.push({
        towerId: tower.id,
        towerType: tower.type,
        level: tower.level,
        priestId: priest ? priest.id : null,
        priestName: priest ? priest.name : null,
        pinned: false,
      });
      if (priest) assignedPriestIds.add(priest.id);
    }

    return assignments;
  },

  /**
   * Structure summary for UI.
   */
  getSummary(state, config) {
    const structures = state.buildings?.structures || [];
    const towerCount = structures.filter(s => s.category === 'tower' && s.hp > 0).length;
    const damagedCount = structures.filter(s => s.hp === 0 && !this.getTowerConfig(s.type, config)?.destroyedOnRaid).length;
    return { towerCount, damagedCount };
  },

  // ── Commands ──

  /**
   * Start building a structure. Deducts resources, adds to buildQueue.
   */
  startBuild(state, command, config, notifications) {
    const { category, structureType: type, quantity } = command;
    const qty = quantity || 1;
    const isInfinite = qty === 'infinite';

    // Only towers now
    const tc = this.getTowerConfig(type, config);
    if (!tc) {
      notifications.push({ type: 'BUILD_FAILED', classification: 'routine', message: 'Unknown structure type' });
      return;
    }

    // Check unlock
    const unlocked = state.buildings?.unlockedTypes || [];
    if (tc.requiresUnlock && !unlocked.includes(`${type}_tower`)) {
      notifications.push({ type: 'BUILD_FAILED', classification: 'routine', message: `${tc.name} has not been researched yet` });
      return;
    }

    if (isInfinite) {
      if (!state.buildings.repeatBuild) state.buildings.repeatBuild = [];
      state.buildings.repeatBuild = state.buildings.repeatBuild.filter(
        r => !(r.category === category && r.type === type)
      );
      state.buildings.repeatBuild.push({ category, type });

      const canAfford = Object.entries(tc.cost).every(([res, amt]) => (state.resources[res] || 0) >= amt);
      if (canAfford) {
        this._queueOneBuild(state, category, type, tc, config, notifications);
      }
      notifications.push({
        type: 'BUILD_REPEAT_SET',
        classification: 'routine',
        message: `${tc.name} set to continuous production`,
      });
      return;
    }

    // Finite quantity
    const numQty = Number(qty);
    let queued = 0;
    for (let i = 0; i < numQty; i++) {
      const canAfford = Object.entries(tc.cost).every(([res, amt]) => (state.resources[res] || 0) >= amt);
      if (!canAfford) break;
      this._queueOneBuild(state, category, type, tc, config, notifications);
      queued++;
    }

    if (queued === 0) {
      const costStr = Object.entries(tc.cost).map(([r, a]) => `${a} ${r}`).join(', ');
      notifications.push({ type: 'BUILD_FAILED', classification: 'routine', message: `Not enough resources for ${tc.name} (${costStr})` });
    } else {
      notifications.push({
        type: 'BUILD_STARTED',
        classification: 'routine',
        message: `Construction queued: ${queued} ${tc.name}${queued > 1 ? 's' : ''}`,
      });
    }

    // Clear continuous repeat when setting finite qty
    if (state.buildings.repeatBuild) {
      state.buildings.repeatBuild = state.buildings.repeatBuild.filter(
        r => !(r.category === category && r.type === type)
      );
    }
  },

  /** @private Queue a single structure build, deducting resources. */
  _queueOneBuild(state, category, type, tc, config, notifications) {
    for (const [res, amt] of Object.entries(tc.cost)) {
      state.resources[res] -= amt;
    }
    if (!state.buildings.buildQueue) state.buildings.buildQueue = [];
    const seq = (state.buildings._buildSeq = (state.buildings._buildSeq || 0) + 1);
    const id = `${category}_${state.time.day}_${state.buildings.buildQueue.length}_${seq}`;
    state.buildings.buildQueue.push({
      id,
      category,
      type,
      progress: 0,
      totalDays: tc.buildDays,
    });
  },

  // ── Daily update (PRODUCTION phase) ──

  /**
   * Engineers on 'building' advance repair queue (priority) then build queue.
   */
  update(state, rng, config, notifications) {
    if (!state.buildings) state.buildings = { structures: [], buildQueue: [], repairQueue: [], unlockedTypes: [] };
    if (!state.buildings.buildQueue) state.buildings.buildQueue = [];
    if (!state.buildings.repairQueue) state.buildings.repairQueue = [];

    const engineers = state.population.characters.filter(
      c => c.role === 'engineer' && c.assignment === 'building' && c.health === 'active'
    );
    if (engineers.length === 0) return;

    let workPool = 0;
    for (const eng of engineers) {
      const mindBonus = Math.max(0, eng.mind - 2) * 0.25;
      workPool += 1 + mindBonus;
    }

    // Priority 1: Repairs
    const repairs = state.buildings.repairQueue;
    for (let i = repairs.length - 1; i >= 0; i--) {
      if (workPool <= 0) break;
      const repair = repairs[i];

      const cost = repair.cost || {};
      let canAfford = true;
      for (const [res, amt] of Object.entries(cost)) {
        if ((state.resources[res] || 0) < amt) { canAfford = false; break; }
      }
      if (!canAfford) continue;

      const work = Math.min(workPool, repair.daysLeft);
      repair.daysLeft -= work;
      workPool -= work;

      if (repair.daysLeft <= 0) {
        for (const [res, amt] of Object.entries(cost)) {
          state.resources[res] -= amt;
        }
        const struct = state.buildings.structures.find(s => s.id === repair.structureId);
        if (struct) {
          const tc = this.getTowerConfig(struct.type, config);
          struct.hp = tc ? tc.maxHp : 1;
          notifications.push({
            type: 'STRUCTURE_REPAIRED',
            classification: 'routine',
            message: `${tc ? tc.name : 'Structure'} repaired`,
          });
        }
        repairs.splice(i, 1);
      }
    }

    // Priority 2: Construction
    while (workPool > 0 && state.buildings.buildQueue.length > 0) {
      const project = state.buildings.buildQueue[0];
      const remaining = project.totalDays - project.progress;
      const work = Math.min(workPool, remaining);
      project.progress += work;
      workPool -= work;

      if (project.progress >= project.totalDays) {
        const tc = this.getTowerConfig(project.type, config);
        state.buildings.structures.push({
          id: project.id,
          category: project.category,
          type: project.type,
          hp: tc ? tc.maxHp : 1,
          builtDay: state.time.day,
        });
        state.buildings.buildQueue.shift();

        notifications.push({
          type: 'STRUCTURE_COMPLETED',
          classification: 'notable',
          message: `${tc ? tc.name : 'Structure'} construction complete!`,
        });

        // Continuous build
        const repeats = state.buildings.repeatBuild || [];
        const repeatEntry = repeats.find(r => r.category === project.category && r.type === project.type);
        if (repeatEntry && tc) {
          const canAfford = Object.entries(tc.cost).every(([res, amt]) => (state.resources[res] || 0) >= amt);
          if (canAfford) {
            this._queueOneBuild(state, project.category, project.type, tc, config, notifications);
          }
        }
      }
    }
  },

  /**
   * PIN_TOWER — assign/unassign a priest to a specific tower
   */
  handlePinTower(state, command, config, notifications) {
    if (!state.buildings.towerPins) state.buildings.towerPins = {};
    const { towerId, priestId } = command;
    if (priestId) {
      for (const [tid, pid] of Object.entries(state.buildings.towerPins)) {
        if (pid === priestId && tid !== towerId) {
          delete state.buildings.towerPins[tid];
        }
      }
      state.buildings.towerPins[towerId] = priestId;
      const priest = state.population.characters.find(c => c.id === priestId);
      const struct = (state.buildings.structures || []).find(s => s.id === towerId);
      const tc = struct ? BuildingModule.getTowerConfig(struct.type, config) : null;
      notifications.push({
        type: 'TOWER_PINNED',
        classification: 'routine',
        message: `${priest?.name || 'Priest'} assigned to ${tc?.name || 'tower'}`,
      });
    } else {
      delete state.buildings.towerPins[towerId];
      notifications.push({
        type: 'TOWER_UNPINNED',
        classification: 'routine',
        message: 'Tower assignment set to auto',
      });
    }
  },
};

export default BuildingModule;
