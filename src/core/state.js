/**
 * Central state store
 */

import SeededRNG from './rng.js?v=5z';
import defaultConfig from './config.js?v=5z';

const ROLES = ['priest', 'soldier', 'engineer', 'worker', 'scholar', 'mistwalker', 'unassigned'];

const STAT_DISTRIBUTION = {
  1: 0.25,
  2: 0.50,
  3: 0.25,
};

// Role requirements now live in config.roles — use getRoleReq() helper
function getRoleReq(config, role) {
  return config.roles?.[role]?.req || {};
}

const DEFAULT_ASSIGNMENTS = {
  priest: 'perimeter',
  soldier: 'garrison',
  engineer: 'available',
  worker: 'farming',
  scholar: 'researching',
  mistwalker: 'available',
  unassigned: 'available',
};

/**
 * Generate a stat value (1-3) based on weighted distribution
 */
function generateStat(rng, roleRequirements) {
  // If there's a requirement, bias toward meeting it
  let attempts = 0;
  while (attempts < 3) {
    const roll = rng.random();
    let cumulative = 0;
    for (const [stat, chance] of Object.entries(STAT_DISTRIBUTION)) {
      cumulative += chance;
      if (roll <= cumulative) {
        const value = parseInt(stat);
        if (roleRequirements && value >= roleRequirements) {
          return value;
        }
        break;
      }
    }
    attempts++;
  }
  // Fallback: just return weighted pick
  return rng.weightedPick([
    { value: 1, weight: 25 },
    { value: 2, weight: 50 },
    { value: 3, weight: 25 },
  ]);
}

/**
 * Generate character with role bias
 */
function generateCharacter(id, name, role, rng, config) {
  const requirements = getRoleReq(config, role);
  
  let body = generateStat(rng, requirements?.body);
  let mind = generateStat(rng, requirements?.mind);
  let spirit = generateStat(rng, requirements?.spirit);

  // Ensure role requirements are met
  if (requirements) {
    if (requirements.body && body < requirements.body) body = requirements.body;
    if (requirements.mind && mind < requirements.mind) mind = requirements.mind;
    if (requirements.spirit && spirit < requirements.spirit) spirit = requirements.spirit;
  }

  return {
    id,
    name,
    role,
    assignment: DEFAULT_ASSIGNMENTS[role],
    tier: 'novice',
    specialization: null,
    body,
    mind,
    spirit,
    health: 'active',
    healingDaysRemaining: 0,
    level: 1,
    xp: 0,
    training: null,
    arrivalDay: 1,
    history: [],
    modifiers: [],
  };
}

/**
 * Create initial game state
 */
export function createInitialState(config = defaultConfig, seed = 12345) {
  const rng = new SeededRNG(seed);

  // Generate character roster
  const firstNames = [
    'Aldric', 'Maren', 'Kael', 'Theron', 'Lyssa', 'Bram', 'Elowen', 'Gareth',
    'Isla', 'Corvin', 'Wren', 'Darius', 'Elara', 'Torsten', 'Nyx', 'Rowan',
    'Cassia', 'Brennan', 'Sylva', 'Damian', 'Fenn', 'Liora',
  ];

  const characters = [];
  
  // 4 Priests
  for (let i = 0; i < 4; i++) {
    characters.push(
      generateCharacter(`char_${characters.length}`, rng.pick(firstNames), 'priest', rng, config)
    );
  }

  // 4 Soldiers
  for (let i = 0; i < 4; i++) {
    characters.push(
      generateCharacter(`char_${characters.length}`, rng.pick(firstNames), 'soldier', rng, config)
    );
  }

  // 1 Engineer
  characters.push(
    generateCharacter(`char_${characters.length}`, rng.pick(firstNames), 'engineer', rng, config)
  );

  // 5 Workers
  for (let i = 0; i < 5; i++) {
    characters.push(
      generateCharacter(`char_${characters.length}`, rng.pick(firstNames), 'worker', rng, config)
    );
  }

  // 1 Scholar
  characters.push(
    generateCharacter(`char_${characters.length}`, rng.pick(firstNames), 'scholar', rng, config)
  );

  // 1 Mistwalker
  characters.push(
    generateCharacter(`char_${characters.length}`, rng.pick(firstNames), 'mistwalker', rng, config)
  );

  // 4 Unassigned — first is priest-eligible, second is soldier-eligible, rest random
  const priestCandidate = generateCharacter(`char_${characters.length}`, rng.pick(firstNames), 'unassigned', rng, config);
  priestCandidate.spirit = Math.max(priestCandidate.spirit, getRoleReq(config, 'priest').spirit || 3);
  characters.push(priestCandidate);

  const soldierCandidate = generateCharacter(`char_${characters.length}`, rng.pick(firstNames), 'unassigned', rng, config);
  soldierCandidate.body = Math.max(soldierCandidate.body, getRoleReq(config, 'soldier').body || 3);
  characters.push(soldierCandidate);

  for (let i = 0; i < 2; i++) {
    characters.push(
      generateCharacter(`char_${characters.length}`, rng.pick(firstNames), 'unassigned', rng, config)
    );
  }

  // Calculate roster counts
  const rosterCounts = {};
  for (const role of ROLES) {
    rosterCounts[role] = characters.filter(c => c.role === role).length;
  }

  return {
    // Time module
    time: {
      day: 1,
      phase: 'WAITING_FOR_INPUT',
      gamePhase: 'survival',
    },

    // Population module
    population: {
      characters,
      rosterCounts,
      infirmary: [],   // [{ patientId, priestId, priestPrevAssignment }]
    },

    // Mist module
    mist: {
      clock: 0,
      raidQueue: [],
      sourceAwareness: 0,
      nextRaidDay: null,
      raidCount: 0,
    },

    // Resources module
    resources: {
      food: 100,
      wood: 30,
      stone: 15,
      metal: 0,
      herbs: 0,
      essences: {},
      compounds: {},
    },

    // Exploration module
    exploration: {
      mwState: {
        status: 'home', // 'home' | 'traveling_out' | 'exploring' | 'returning'
        ring: null,
        daysOut: 0,
        daysRemaining: 0,
        findings: [],
      },
      rings: [
        { ring: 1, discovered: true },
        { ring: 2, discovered: false },
        { ring: 3, discovered: false },
        { ring: 4, discovered: false },
      ],
      expeditions: [],
      activeExpedition: null,       // current troop expedition in progress
      completedExpeditions: [],     // history of completed expeditions
      locations: {
        discovered: [],
        vital: [],
        minor: [],
      },
    },

    // Combat module — 1v1 encounter model
    combat: {
      activeRaids: [],
      combatLog: [],
    },

    // Pressure / containment system
    pressure: {
      bands: [],   // [{ id, domain, current, max, ramping, activationDay, revealed }]
    },

    // Knowledge module
    knowledge: {
      researchQueue: [],
      activeResearch: [],
      completed: [],
      clues: [
        { id: 'archive_clue_1', name: 'Archive Fragment', source: 'Monastery archives', ring: 0, day: 1, status: 'perceived' },
        { id: 'lore_clue_1', name: 'Crumbling Codex', source: 'Monastery library', ring: 0, day: 1, status: 'perceived' },
        { id: 'nature_clue_1', name: 'Residue Sample', source: 'Perimeter collection', ring: 1, day: 1, status: 'perceived' },
        { id: 'clue_clue_1', name: 'Faded Trail Map', source: 'Monastery storeroom', ring: 0, day: 1, status: 'perceived' },
      ],
      mapFragments: 0,
      sourceClues: 0,
      artifacts: [],
      uniqueFinds: [],  // { id, type, name, description, discovered: false, analyzedDay: null }
    },

    // Library module (scholar book research)
    library: {
      librarianId: null,       // character ID of the promoted librarian (only one per settlement)
      scholarStates: {},       // keyed by character ID — { knownLanguages[], currentActivity, currentBook, unreadBooks[], needsLanguage[], deadEnds[], studiedBooks[] }
      unlockedAbilities: [],   // { abilityId, abilityName, topic, unlockedDay, unlockedBy, titleId }
    },

    // Creatures module (generated at world-gen, compendium tracks player knowledge)
    creatures: {
      types: [],          // populated by CreaturesModule.initialize()
      compendium: {},     // keyed by creatureTypeId — player's accumulated knowledge
    },

    // Events module
    events: {
      feed: [
        { day: 1, type: 'routine', text: 'A refuge rises from the mist. The first dawn.' },
      ],
      history: [],
      notifications: [],
    },

    // Buildings and structures (towers only — player must build them)
    buildings: {
      workshop: { id: 'workshop_1', name: 'Workshop', tier: 1, completedDay: 0 },
      structures: [],
      buildQueue: [],       // [{ id, category, type, progress, totalDays }]
      repairQueue: [],      // [{ structureId, daysLeft, cost: { wood?, stone?, metal? } }]
      unlockedTypes: [],    // e.g. ['stone_tower']
      repeatBuild: [],      // [{ category, type }] — continuous build (∞ qty)
      towerPins: {},        // { towerId: priestId } — manual priest-to-tower overrides
    },

    // Vectors — unified attribute system
    vectors: {
      known: [],            // vectorIds the player has identified
      activeRing: 1,        // current highest ring with active vector
    },

    // Portal seal — win condition
    portalSeal: {
      bossDefeated: false,
      bossDefeatedDay: null,
      sealAttempts: 0,
      sealed: false,
      sealedDay: null,
    },

    // Game configuration
    config,
  };
}

export default createInitialState;
