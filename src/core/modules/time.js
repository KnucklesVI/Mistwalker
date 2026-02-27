/**
 * TimeModule - manages turn structure and phase progression
 */

const PHASES = [
  'WAITING_FOR_INPUT',
  'RESOLVE_COMMANDS',
  'MIST_TICK',
  'COMBAT',
  'EXPLORATION',
  'KNOWLEDGE',
  'PRODUCTION',
  'GROWTH',
  'EVENTS',
  'RENDER',
];

const GAME_PHASES = {
  1: 'survival',
  50: 'adaptation',
  100: 'epistemic',
  150: 'commitment',
};

function getGamePhase(day) {
  if (day >= 150) return 'commitment';
  if (day >= 100) return 'epistemic';
  if (day >= 50) return 'adaptation';
  return 'survival';
}

const TimeModule = {
  initialize(config, state) {
    // Time is already initialized in state
  },

  processCommands(commands, state, rng, notifications) {
    const processed = [];
    
    for (const cmd of commands) {
      if (cmd.type === 'ADVANCE_DAY') {
        processed.push({
          type: 'ADVANCE_DAY',
          success: true,
        });
      }
    }

    return processed;
  },

  /**
   * Advance to next phase
   */
  nextPhase(state) {
    const currentIndex = PHASES.indexOf(state.time.phase);
    const nextIndex = (currentIndex + 1) % PHASES.length;
    state.time.phase = PHASES[nextIndex];

    // If we're wrapping back to WAITING_FOR_INPUT, increment day
    if (nextIndex === 0) {
      state.time.day += 1;
      state.time.gamePhase = getGamePhase(state.time.day);
    }
  },

  /**
   * Set phase directly
   */
  setPhase(state, phaseName) {
    if (PHASES.includes(phaseName)) {
      state.time.phase = phaseName;
    }
  },

  /**
   * Get current phase name
   */
  getCurrentPhase(state) {
    return state.time.phase;
  },

  /**
   * Get all phases
   */
  getPhases() {
    return [...PHASES];
  },

  getState(state) {
    return {
      day: state.time.day,
      phase: state.time.phase,
      gamePhase: state.time.gamePhase,
    };
  },
};

export default TimeModule;
