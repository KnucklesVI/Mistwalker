/**
 * PopulationModule - manages characters and their states
 */

const PopulationModule = {
  initialize(config, state) {
    // Population is already initialized in state
  },

  processCommands(commands, state, rng, notifications) {
    const processed = [];

    for (const cmd of commands) {
      switch (cmd.type) {
        case 'ASSIGN':
          processed.push(this.handleAssign(state, cmd, notifications));
          break;
        case 'TRAIN':
          processed.push(this.handleTrain(state, cmd, config, notifications));
          break;
        case 'CANCEL_TRAINING':
          processed.push(this.handleCancelTraining(state, cmd, notifications));
          break;
      }
    }

    return processed;
  },

  handleAssign(state, cmd, notifications) {
    const char = state.population.characters.find(c => c.id === cmd.characterId);
    if (!char) return { type: 'ASSIGN', success: false };

    const oldAssignment = char.assignment;
    char.assignment = cmd.assignment;

    notifications.push({
      type: 'CHARACTER_ASSIGNED',
      characterId: char.id,
      characterName: char.name,
      oldAssignment,
      newAssignment: cmd.assignment,
    });

    return { type: 'ASSIGN', success: true, characterId: cmd.characterId };
  },

  handleTrain(state, cmd, config, notifications) {
    const char = state.population.characters.find(c => c.id === cmd.characterId);
    if (!char) return { type: 'TRAIN', success: false };

    const trainingDuration = config.training[cmd.targetRole];
    if (!trainingDuration) return { type: 'TRAIN', success: false };

    char.training = {
      targetRole: cmd.targetRole,
      daysRemaining: trainingDuration,
      daysTotal: trainingDuration,
    };

    notifications.push({
      type: 'TRAINING_STARTED',
      characterId: char.id,
      characterName: char.name,
      targetRole: cmd.targetRole,
      duration: trainingDuration,
      classification: 'notable',
      category: 'people',
      message: `${char.name} began training as ${cmd.targetRole} (${trainingDuration} days)`,
    });

    return { type: 'TRAIN', success: true, characterId: cmd.characterId };
  },

  handleCancelTraining(state, cmd, notifications) {
    const char = state.population.characters.find(c => c.id === cmd.characterId);
    if (!char || !char.training) return { type: 'CANCEL_TRAINING', success: false };

    const targetRole = char.training.targetRole;
    char.training = null;

    notifications.push({
      type: 'TRAINING_CANCELLED',
      characterId: char.id,
      characterName: char.name,
      targetRole,
    });

    return { type: 'CANCEL_TRAINING', success: true, characterId: cmd.characterId };
  },

  /**
   * During GROWTH phase: advance training, healing, XP, auto-assign priest healers
   */
  update(state, rng, config, notifications) {
    const infirmary = state.population.infirmary || [];

    for (const char of state.population.characters) {
      // Advance training
      if (char.training) {
        char.training.daysRemaining -= 1;
        if (char.training.daysRemaining <= 0) {
          const newRole = char.training.targetRole;
          char.role = newRole;
          char.tier = 'novice';

          // Auto-assign to default task for the new role
          const defaultAssignments = {
            priest: 'perimeter', soldier: 'garrison', engineer: 'building',
            worker: 'farming', scholar: 'researching', mistwalker: 'available',
          };
          char.assignment = defaultAssignments[newRole] || 'available';

          notifications.push({
            type: 'TRAINING_COMPLETE',
            characterId: char.id,
            characterName: char.name,
            newRole,
            classification: 'notable',
            category: 'people',
            message: `${char.name} completed training — now a ${newRole}`,
          });

          char.training = null;
        }
      }

      // Advance healing
      if (char.health !== 'active' && char.health !== 'dead' && char.health !== 'lost') {
        char.healingDaysRemaining -= 1;
        if (char.healingDaysRemaining <= 0) {
          const oldHealth = char.health;
          char.health = 'active';
          char.healingDaysRemaining = 0;

          // Release priest healer back to previous assignment
          const pairIdx = infirmary.findIndex(p => p.patientId === char.id);
          if (pairIdx !== -1) {
            const pair = infirmary[pairIdx];
            const priest = state.population.characters.find(c => c.id === pair.priestId);
            if (priest && priest.health === 'active') {
              priest.assignment = pair.priestPrevAssignment || 'perimeter';
              notifications.push({
                type: 'PRIEST_RELEASED',
                priestId: priest.id,
                priestName: priest.name,
                patientName: char.name,
                message: `${priest.name} finished tending to ${char.name} — returned to ${priest.assignment}`,
                classification: 'routine',
                category: 'people',
              });
            }
            infirmary.splice(pairIdx, 1);
          }

          notifications.push({
            type: 'CHARACTER_RECOVERED',
            characterId: char.id,
            characterName: char.name,
            fromHealth: oldHealth,
          });
        }
      }

      // Award XP (simple: 1 per day when active)
      if (char.health === 'active') {
        char.xp += 1;

        // Leveling check — placeholder: +1 all stats per level (SYSTEM_SPEC §17.4)
        const lev = config.leveling || { xpBase: 20, xpPerLevel: 10, statGain: 1 };
        const currentLevel = char.level || 1;
        const xpNeeded = lev.xpBase + (currentLevel * lev.xpPerLevel);
        if (char.xp >= xpNeeded) {
          char.level = currentLevel + 1;
          char.xp = 0; // reset XP for next level
          const gain = lev.statGain || 1;
          char.body += gain;
          char.mind += gain;
          char.spirit += gain;
          notifications.push({
            type: 'LEVEL_UP',
            characterId: char.id,
            characterName: char.name,
            newLevel: char.level,
            classification: 'notable',
            message: `${char.name} has grown stronger (level ${char.level}). All attributes increased.`,
          });
        }
      }
    }

    // Auto-assign weakest available priest to any unattended injured characters
    const injuredChars = state.population.characters.filter(
      c => (c.health === 'injured' || c.health === 'gravely_injured')
        && !infirmary.some(p => p.patientId === c.id)
    );

    for (const patient of injuredChars) {
      // Find available priests not already healing someone, sorted by spirit (weakest first)
      const availablePriests = state.population.characters.filter(
        c => c.role === 'priest'
          && c.health === 'active'
          && c.assignment !== 'healing'
          && !c.training
      ).sort((a, b) => a.spirit - b.spirit);

      if (availablePriests.length === 0) break;

      const priest = availablePriests[0];
      const prevAssignment = priest.assignment;
      priest.assignment = 'healing';

      infirmary.push({
        patientId: patient.id,
        priestId: priest.id,
        priestPrevAssignment: prevAssignment,
      });

      notifications.push({
        type: 'PRIEST_HEALING',
        priestId: priest.id,
        priestName: priest.name,
        patientId: patient.id,
        patientName: patient.name,
        message: `${priest.name} moved to the infirmary to tend to ${patient.name}`,
        classification: 'notable',
        category: 'people',
      });
    }

    state.population.infirmary = infirmary;

    // ── HARD INVARIANT: Mistwalker immortality ──
    // Safety clamp — prevents any regression from killing or losing the MW.
    for (const c of state.population.characters) {
      if (c.role === 'mistwalker' && (c.health === 'dead' || c.health === 'lost')) {
        c.health = 'injured';
        c.healingDaysRemaining = config.health.gravelyInjuredRecoveryMin;
      }
    }
  },

  getState(state) {
    return {
      characters: state.population.characters.map(c => ({ ...c })),
      rosterCounts: { ...state.population.rosterCounts },
    };
  },
};

export default PopulationModule;
