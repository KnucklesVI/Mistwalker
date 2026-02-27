/**
 * Mistwalker Core Engine
 * Main orchestrator for game loop and state management
 */

import SeededRNG from './rng.js?v=5z';
import defaultConfig from './config.js?v=5z';
import createInitialState from './state.js?v=5z';
import { validateCommand, COMMAND_TYPES } from './commands.js?v=5z';

// Import modules
import TimeModule from './modules/time.js?v=5z';
import PopulationModule from './modules/population.js?v=5z';
import MistModule from './modules/mist.js?v=5z';
import ResourcesModule from './modules/resources.js?v=5z';
import ExplorationModule from './modules/exploration.js?v=5z';
import CombatModule from './modules/combat.js?v=5z';
import KnowledgeModule from './modules/knowledge.js?v=5z';
import EventsModule from './modules/events.js?v=5z';
import LibraryModule from './modules/library.js?v=5z';
import CreaturesModule from './modules/creatures.js?v=5z';
import BuildingModule from './modules/building.js?v=5z';
import PressureModule from './modules/pressure.js?v=5z';
import BreachModule from './modules/breach.js?v=5z';

class MistwalkEngine {
  constructor(config = defaultConfig, seed = 12345) {
    this.config = config;
    this.rng = new SeededRNG(seed);
    this.state = createInitialState(config, seed);
    this.commandQueue = [];
    this.lastNotifications = [];

    // Generate world creatures at construction
    CreaturesModule.initialize(this.state, this.rng, config);
  }

  /**
   * Initialize the engine with a config
   */
  initialize(config = defaultConfig) {
    this.config = config;
    this.state = createInitialState(config);
    this.commandQueue = [];
    this.lastNotifications = [];

    // Generate world creatures
    CreaturesModule.initialize(this.state, this.rng, this.config);

    return this.getState();
  }

  /**
   * Get read-only copy of current state (includes RNG state for save/load)
   */
  getState() {
    const snapshot = JSON.parse(JSON.stringify(this.state));
    snapshot._rngState = this.rng.seed;
    return snapshot;
  }

  /**
   * Restore engine from a saved state snapshot
   */
  loadState(savedState) {
    const { _rngState, ...gameState } = savedState;
    this.state = JSON.parse(JSON.stringify(gameState));
    if (_rngState !== undefined) {
      this.rng.seed = _rngState;
    }
    this.commandQueue = [];
    this.lastNotifications = [];
  }

  /**
   * Queue a command for execution
   */
  queueCommand(command) {
    const validation = validateCommand(this.state, command);
    if (!validation.valid) {
      return { success: false, reason: validation.reason };
    }

    this.commandQueue.push(command);
    return { success: true };
  }

  /**
   * Get valid commands for current state
   */
  getValidCommands(state) {
    const commands = [];

    // ASSIGN is always valid for any active character
    for (const char of state.population.characters) {
      if (char.health !== 'dead' && char.health !== 'lost') {
        commands.push({
          type: COMMAND_TYPES.ASSIGN,
          characterId: char.id,
          description: `Assign ${char.name}`,
        });
      }
    }

    // TRAIN is valid for active characters not already training
    for (const char of state.population.characters) {
      if (!char.training && char.health !== 'dead' && char.health !== 'lost') {
        commands.push({
          type: COMMAND_TYPES.TRAIN,
          characterId: char.id,
          description: `Train ${char.name}`,
        });
      }
    }

    // CANCEL_TRAINING is valid for characters in training
    for (const char of state.population.characters) {
      if (char.training) {
        commands.push({
          type: COMMAND_TYPES.CANCEL_TRAINING,
          characterId: char.id,
          description: `Cancel ${char.name}'s training`,
        });
      }
    }

    // ADVANCE_DAY is valid during WAITING_FOR_INPUT
    if (state.time.phase === 'WAITING_FOR_INPUT') {
      commands.push({
        type: COMMAND_TYPES.ADVANCE_DAY,
        description: 'Advance to next day',
      });
    }

    // MW commands
    const mw = state.population.characters.find(c => c.role === 'mistwalker');
    if (mw && mw.health !== 'dead' && mw.health !== 'lost') {
      if (state.exploration.mwState.status === 'home') {
        commands.push({
          type: COMMAND_TYPES.SEND_MW,
          description: 'Send Mistwalker to explore',
        });

        // Scout available if there are incoming unscouted raids
        const unscoutedRaids = (state.mist.raidQueue || []).filter(
          r => r.status === 'incoming' && !r.scouted
        );
        for (const raid of unscoutedRaids) {
          commands.push({
            type: COMMAND_TYPES.SCOUT_RAID,
            raidId: raid.id,
            description: `Scout incoming raid`,
          });
        }

        // Expedition available if MW is home and locations exist
        const discoveredLocations = state.exploration.locations.minor || [];
        if (discoveredLocations.length > 0 && !state.exploration.activeExpedition) {
          commands.push({
            type: COMMAND_TYPES.SEND_EXPEDITION,
            description: 'Send troop expedition',
          });
        }
      } else if (state.exploration.mwState.departDay === state.time.day) {
        commands.push({
          type: COMMAND_TYPES.CANCEL_MW,
          description: 'Cancel Mistwalker expedition',
        });
      }
    }

    // Cancel expedition (on departure day only)
    if (state.exploration.activeExpedition &&
        state.exploration.activeExpedition.departDay === state.time.day) {
      commands.push({
        type: COMMAND_TYPES.CANCEL_EXPEDITION,
        description: 'Cancel troop expedition',
      });
    }

    return commands;
  }

  /**
   * Execute a command immediately
   */
  executeCommand(state, command) {
    const validation = validateCommand(state, command);
    if (!validation.valid) {
      return {
        success: false,
        reason: validation.reason,
        newState: state,
        notifications: [],
      };
    }

    const notifications = [];
    const newState = JSON.parse(JSON.stringify(state));

    switch (command.type) {
      case COMMAND_TYPES.ASSIGN: {
        PopulationModule.handleAssign(newState, command, notifications);
        break;
      }
      case COMMAND_TYPES.TRAIN: {
        PopulationModule.handleTrain(newState, command, this.config, notifications);
        break;
      }
      case COMMAND_TYPES.CANCEL_TRAINING: {
        PopulationModule.handleCancelTraining(newState, command, notifications);
        break;
      }
      case COMMAND_TYPES.SEND_MW: {
        ExplorationModule.handleSendMW(newState, command, this.config, notifications);
        break;
      }
      case COMMAND_TYPES.CANCEL_MW: {
        ExplorationModule.handleCancelMW(newState, command, notifications);
        break;
      }
      case COMMAND_TYPES.SCOUT_RAID: {
        ExplorationModule.handleScoutRaid(newState, command, this.config, notifications);
        break;
      }
      case COMMAND_TYPES.RESCUE_LOST: {
        ExplorationModule.handleRescue(newState, command, this.config, notifications);
        break;
      }
      case COMMAND_TYPES.SEND_EXPEDITION: {
        ExplorationModule.handleSendExpedition(newState, command, this.config, this.rng, notifications);
        break;
      }
      case COMMAND_TYPES.CANCEL_EXPEDITION: {
        ExplorationModule.handleCancelExpedition(newState, command, notifications);
        break;
      }
      case COMMAND_TYPES.CANCEL_RESEARCH: {
        KnowledgeModule.handleCancelResearch(newState, command, notifications);
        break;
      }
      case COMMAND_TYPES.REORDER_RESEARCH: {
        KnowledgeModule.handleReorderResearch(newState, command, this.config, notifications);
        break;
      }
      case COMMAND_TYPES.EQUIP: {
        KnowledgeModule.handleEquip(newState, command, notifications);
        break;
      }
      case COMMAND_TYPES.UNEQUIP: {
        KnowledgeModule.handleUnequip(newState, command, notifications);
        break;
      }
      case COMMAND_TYPES.PROMOTE_LIBRARIAN: {
        LibraryModule.handlePromoteLibrarian(newState, command, this.config, notifications);
        break;
      }
      case COMMAND_TYPES.LIBRARY_BROWSE: {
        LibraryModule.handleBrowse(newState, command, this.config, this.rng, notifications);
        break;
      }
      case COMMAND_TYPES.LIBRARY_SCAVENGE: {
        LibraryModule.handleScavenge(newState, command, this.config, this.rng, notifications);
        break;
      }
      case COMMAND_TYPES.LIBRARY_STUDY: {
        LibraryModule.handleStudy(newState, command, this.config, notifications);
        break;
      }
      case COMMAND_TYPES.LIBRARY_SEARCH_LANGUAGE: {
        LibraryModule.handleSearchLanguage(newState, command, this.config, notifications);
        break;
      }
      case COMMAND_TYPES.LIBRARY_SHELVE: {
        LibraryModule.handleShelve(newState, command, notifications);
        break;
      }
      case COMMAND_TYPES.LIBRARY_CANCEL: {
        LibraryModule.handleCancel(newState, command, notifications);
        break;
      }
      case COMMAND_TYPES.SET_STUDY_PREFERENCES: {
        LibraryModule.handleSetStudyPreferences(newState, command, notifications);
        break;
      }
      case COMMAND_TYPES.BUILD: {
        BuildingModule.startBuild(newState, command, this.config, notifications);
        break;
      }
      case COMMAND_TYPES.PIN_TOWER: {
        BuildingModule.handlePinTower(newState, command, this.config, notifications);
        break;
      }
    }

    return {
      success: true,
      newState,
      notifications,
    };
  }

  /**
   * Advance to the next day (process all phases)
   */
  advanceDay(state = this.state) {
    const newState = JSON.parse(JSON.stringify(state));
    const notifications = [];
    const events = [];

    // WAITING_FOR_INPUT -> process queued commands
    if (this.commandQueue.length > 0) {
      // Handle all commands during RESOLVE_COMMANDS phase
      for (const cmd of this.commandQueue) {
        const result = this.executeCommand(newState, cmd);
        if (result.success) {
          notifications.push(...result.notifications);
        }
      }
      this.commandQueue = [];
    }

    // ── LOCKED DAILY ORDER ──
    // 1. Increment day
    newState.time.day++;
    if (newState.time.day >= 150) newState.time.gamePhase = 'commitment';
    else if (newState.time.day >= 100) newState.time.gamePhase = 'epistemic';
    else if (newState.time.day >= 50) newState.time.gamePhase = 'adaptation';
    else newState.time.gamePhase = 'survival';

    TimeModule.nextPhase(newState); // -> RESOLVE_COMMANDS
    TimeModule.nextPhase(newState); // -> MIST_TICK

    // 2. Mist
    MistModule.update(newState, this.rng, this.config, notifications);

    // 3. Pressure ramp
    PressureModule.update(newState, this.config);

    // 4. Pressure snapshot
    const snapshot = PressureModule.calculate(newState, this.config);

    // 5. Breach check
    const instability = snapshot.instability;
    const minBreachChance = 0.001;
    const maxBreachChance = this.config.pressure.maxBreachChance;
    const exponent = this.config.pressure.breachExponent;
    const breachChance =
      minBreachChance +
      Math.pow(instability, exponent) *
      (maxBreachChance - minBreachChance);
    if (this.rng.chance(breachChance)) {
      BreachModule.resolveDailyBreach(
        newState,
        this.config,
        this.rng,
        notifications,
        snapshot
      );
    }

    // MIST_TICK -> COMBAT
    TimeModule.nextPhase(newState);

    // 6. Combat
    CombatModule.update(newState, this.rng, this.config, notifications);

    // COMBAT -> EXPLORATION
    TimeModule.nextPhase(newState);
    ExplorationModule.update(newState, this.rng, this.config, notifications);

    // EXPLORATION -> KNOWLEDGE
    TimeModule.nextPhase(newState);
    KnowledgeModule.update(newState, this.rng, this.config, notifications);
    LibraryModule.update(newState, this.rng, this.config, notifications);

    // KNOWLEDGE -> PRODUCTION
    TimeModule.nextPhase(newState);
    BuildingModule.update(newState, this.rng, this.config, notifications);
    ResourcesModule.update(newState, this.rng, this.config, notifications);

    // PRODUCTION -> GROWTH
    TimeModule.nextPhase(newState);

    // 7. Population
    PopulationModule.update(newState, this.rng, this.config, notifications);

    // GROWTH -> EVENTS
    TimeModule.nextPhase(newState);
    EventsModule.update(newState, this.rng, notifications);

    // EVENTS -> RENDER
    TimeModule.nextPhase(newState);
    notifications.push({
      type: 'RENDER',
      message: 'UI should update',
    });

    // RENDER -> WAITING_FOR_INPUT (day already incremented above)
    TimeModule.setPhase(newState, 'WAITING_FOR_INPUT');

    this.lastNotifications = notifications;
    this.state = newState;

    return {
      newState,
      notifications,
      events,
    };
  }

  /**
   * Full day cycle - with commands
   */
  processDayWithCommands(commands) {
    for (const cmd of commands) {
      this.queueCommand(cmd);
    }
    return this.advanceDay();
  }

  /**
   * Get last notifications
   */
  getNotifications() {
    return this.lastNotifications;
  }

  /**
   * Get game status summary
   */
  getSummary() {
    return {
      day: this.state.time.day,
      phase: this.state.time.phase,
      gamePhase: this.state.time.gamePhase,
      population: this.state.population.rosterCounts,
      resources: {
        food: this.state.resources.food,
        wood: this.state.resources.wood,
        stone: this.state.resources.stone,
        metal: this.state.resources.metal,
        herbs: this.state.resources.herbs,
      },
      pressure: PressureModule.calculate(this.state, this.config),
    };
  }
}

export default MistwalkEngine;
