/**
 * Central configuration for all game mechanics
 */

export function applyCurve(baseValue, input, curveType = 'LINEAR', intensity = 1.0) {
  switch (curveType) {
    case 'LINEAR':
      return baseValue * input;
    
    case 'DIMINISHING':
      return baseValue * (Math.log(input * intensity + 1) / Math.log(intensity + 1));
    
    case 'EXPONENTIAL':
      return baseValue * Math.pow(input, intensity);
    
    case 'SIGMOID':
      return baseValue * (1 / (1 + Math.exp(-intensity * (input - 3))));
    
    default:
      return baseValue * input;
  }
}

const defaultConfig = {
  // Role requirements and display info — single source of truth
  roles: {
    priest:     { label: 'Warden',      req: { spirit: 3 },          reqLabel: 'Essence 3' },
    soldier:    { label: 'Sentinel',    req: { body: 3 },            reqLabel: 'Vigor 3' },
    engineer:   { label: 'Artificer',   req: { body: 2, mind: 2 },   reqLabel: 'Vigor 2+ Acuity 2+' },
    worker:     { label: 'Laborer',     req: {},                     reqLabel: 'No minimum' },
    scholar:    { label: 'Sage',        req: { mind: 3 },            reqLabel: 'Acuity 3' },
    mistwalker: { label: 'Mistwalker',  req: { spirit: 3, body: 3 }, reqLabel: 'Essence 3 Vigor 3' },
    unassigned: { label: 'Untrained',   req: {},                     reqLabel: '' },
  },

  // Training durations (in days)
  training: {
    worker: 3,
    soldier: 5,
    engineer: 7,
    scholar: 8,
    priest: 10,
    mistwalker: 14,
  },

  // Leveling — placeholder (SYSTEM_SPEC §17.4)
  // XP needed per level = base + (level × perLevel). Level 2 = 30 days, level 3 = 50, etc.
  leveling: {
    xpBase: 20,           // base XP needed for first level-up
    xpPerLevel: 10,       // additional XP per subsequent level
    statGain: 1,          // +1 to all stats per level (placeholder)
  },

  // Scholar specialization (SYSTEM_SPEC §17.5)
  scholar: {
    xpPerStudy: 1,            // category XP per successful book study
    xpPerDud: 1,              // category XP even from duds (still effort)
    xpPerLanguage: 2,         // category XP for learning a language (lore)
    librarianThreshold: 5,    // lore XP needed to become Librarian-eligible
    nicheThreshold: 5,        // max XP per category before specialization unlocks
    categories: ['lore', 'maps', 'artifacts', 'herbs', 'essences'],
    // Maps book topics to material categories
    topicToCategory: {
      priest: 'lore', soldier: 'lore', engineer: 'lore', scholar: 'lore',
      creatures: 'essences',
    },
  },

  // Resource generation and consumption
  resources: {
    foodPerWorker: 3,
    woodPerWorker: 2,
    stonePerWorker: 2,
    foodPerPerson: 1,
    statBonusPerPoint: 0.5,        // bonus per stat point above 2
    statBonusThreshold: 2,          // stats above this get bonus
  },

  // Vector definitions — unified attribute type shared across rings, creatures, units, equipment
  vectors: {
    fire:     { id: 'fire',     name: 'Fire',     description: 'Searing heat and consuming flame' },
    fracture: { id: 'fracture', name: 'Fracture',  description: 'Splintering force and structural collapse' },
    rot:      { id: 'rot',      name: 'Rot',       description: 'Slow decay and creeping corruption' },
    silence:  { id: 'silence',  name: 'Silence',   description: 'Suppression of will and sacred energy' },
    corruption: { id: 'corruption', name: 'Corruption', description: 'Twisting of form and purpose' },
    hunger:   { id: 'hunger',   name: 'Hunger',    description: 'Draining of vitality and resources' },
  },

  // Domain definitions — single source of truth for domain identity
  domains: {
    fire: {
      id: 'fire',
      name: 'Fire Mist',
      maxPressure: 100,
      rampIntervalDays: 5,
      rampAmount: 10,
      containmentModifier: 1.0,
    },
    decay: {
      id: 'decay',
      name: 'Rot Mist',
      maxPressure: 100,
      rampIntervalDays: 5,
      rampAmount: 10,
      containmentModifier: 1.0,
    },
  },

  // Maps exploration ring number to domain ID activated on first discovery
  ringDomains: {
    1: 'fire',
    2: 'decay',
  },

  pressure: {
    basePressure: 60,            // flat mist pressure (ring logic later)
    priestContainment: 15,       // containment per healthy perimeter priest
    mwContainment: 10,           // containment when MW is active on perimeter
    baseBreachChance: 0.0,       // breach chance floor when gap = 0
    maxBreachChance: 0.6,        // breach chance ceiling
    breachExponent: 2,           // curvature — higher = more forgiving at low instability
    rampIntervalDays: 5,         // days between pressure increments per band
    rampAmount: 5,               // pressure added per ramp tick
    breachResolution: {
      mwEngageChance: 0.50,
      soldierEngageChancePer: 0.10,
      // severity thresholds by instability
      minorMax: 0.15,
      moderateMax: 0.35,
      majorMax: 0.60,
      // base win chances (modified by stats)
      winBase: { minor: 0.85, moderate: 0.65, major: 0.45, catastrophic: 0.25 },
      // stat influence
      mwPowerWeight: 0.06,
      soldierPowerWeight: 0.05,
      // defender loss outcomes
      soldierLoseDeathChance: 0.50,
      // civilian targeting weights
      targetWeights: { priest: 1.0, worker: 3.0, engineer: 1.5, soldier: 0.5 },
      // tower-pinned priest mitigation
      towerPinnedMitigation: 0.50,
    },
  },

  // Combat calculations — 1v1 encounter model
  combat: {
    soldierBodyMultiplier: 2,
    veteranBonus: 1.5,
    mwBodyMultiplier: 1,
    mwHomeDefenseBonus: 3,
    civilianBodyMultiplier: 0.3,
    mwEngageChance: 0.50,           // MW chance to intercept creature
    soldierEngageChance: 0.10,      // per-soldier chance to intercept
    towerPriestProtection: 0.50,    // per tower level, reduces chance priest is targeted
    scoutBonus: 0.1,
  },

  // Raid generation & escalation
  raids: {
    firstRaidDayMin: 8,
    firstRaidDayMax: 12,
    unannouncedChance: 0.1,
    warningDays: 3,
    // Escalation
    baseStrengthMin: 12,
    baseStrengthMax: 25,
    strengthPerRaid: 5,
    intervalMin: 5,
    intervalMax: 10,
    intervalShrinkPerRaid: 0.5,
    minInterval: 3,
  },

  // MW exploration
  exploration: {
    ringTravelDays: [1, 4, 7, 10], // days to reach rings 1, 2, 3, 4
    baseMwRange: 5,                 // starting MW range (max total days away)
    nothingChance: 0.5,
  },

  // Troop expeditions to discovered locations
  expedition: {
    // MW range = total days budget (travel + work). Driven by MW spirit.
    mwRangeBySpirit: { 1: 3, 2: 5, 3: 7 },

    // Party capacity = priest spirit + bonuses. Includes MW and priest in the count.
    capacityPerSpirit: 1,  // spirit 3 → 3 slots (MW + priest + 1)

    // Resource hauling
    haulPerWorkerPerDay: 2,    // workers haul 2 resources/day
    haulPerOtherPerDay: 1,     // soldiers/engineers haul 1/day
    haulScholarPerDay: 0,      // scholars can't haul

    // Challenge success rates by difficulty (1-3)
    challengeBaseRates: [0.80, 0.65, 0.45],
    challengeStatBonus: 0.15,  // +15% per relevant stat point above 2

    // Ring 1 location templates
    locationTypes: {
      metal_deposit: {
        name: 'Metal Deposit',
        description: 'Veins of ore exposed by mist erosion',
        challenges: [
          { id: 'access', type: 'engineering', name: 'Sealed Passage', difficulty: 2, required: true },
        ],
        rewards: { metal: { min: 4, max: 12 } },
        dangerLevel: 1,
        haulingRequired: true,
      },
      ancient_library: {
        name: 'Ancient Library',
        description: 'Shelves of texts preserved by the dry air',
        challenges: [
          { id: 'reading', type: 'scholarly', name: 'Encoded Texts', difficulty: 1, required: true },
        ],
        rewards: { clues: { min: 1, max: 3 } },
        dangerLevel: 1,
        haulingRequired: false,
      },
      cursed_shrine: {
        name: 'Cursed Shrine',
        description: 'A place of power corrupted by the mist',
        challenges: [
          { id: 'cleanse', type: 'spiritual', name: 'Mist Corruption', difficulty: 2, required: true },
          { id: 'guardians', type: 'combat', name: 'Shrine Guardians', difficulty: 2, required: false },
        ],
        rewards: { essences: { min: 1, max: 3 } },
        dangerLevel: 2,
        haulingRequired: false,
      },
      abandoned_cache: {
        name: 'Abandoned Cache',
        description: 'Supplies left behind by a previous settlement',
        challenges: [
          { id: 'locks', type: 'engineering', name: 'Rusted Locks', difficulty: 1, required: false },
        ],
        rewards: { food: { min: 5, max: 15 }, wood: { min: 3, max: 8 }, metal: { min: 1, max: 4 } },
        dangerLevel: 1,
        haulingRequired: true,
      },
    },

    // Which stat each challenge type checks
    challengeStats: {
      engineering: 'mind',
      scholarly: 'mind',
      combat: 'body',
      spiritual: 'spirit',
    },

    // Which role is best suited for each challenge type
    challengeRoles: {
      engineering: 'engineer',
      scholarly: 'scholar',
      combat: 'soldier',
      spiritual: 'priest',
    },

    // Injury risk per day at dangerous sites (per dangerLevel)
    injuryRiskPerDay: [0.0, 0.03, 0.06, 0.10],
  },

  // MW rescue missions
  rescue: {
    baseDays: 2,              // how long a rescue mission takes
    baseSuccessChance: 0.85,  // base chance of finding the lost person
    decayPerDay: 0.05,        // success drops 5% per day they've been lost
    minSuccessChance: 0.20,   // floor — never below 20%
  },

  // Health and recovery
  health: {
    injuredRecoveryMin: 3,
    injuredRecoveryMax: 5,
    gravelyInjuredRecoveryMin: 6,
    gravelyInjuredRecoveryMax: 10,
  },

  // Research / knowledge
  research: {
    baseDecodeDays: 3,           // base days to decode a clue
    collaborationBonus2: 0.35,   // 35% faster with 2 scholars
    collaborationBonus3: 0.50,   // 50% faster with 3+ scholars
    mindBonusPerPoint: 0.5,      // each mind point above 3 adds 0.5 daily progress
  },

  // Scholar library
  library: {
    browseCount: 1,           // titles found per targeted browse session
    browseDays: 1,            // days to targeted browse
    scavengeCount: 5,         // titles found per scavenge session
    scavengeDays: 1,          // days to scavenge
    studyDays: { 0: 1, 1: 3, 2: 5, 3: 7 },  // days to study by tier (0 = dud)
    blockedDays: 1,           // days wasted when language blocks study
    languageSearchDays: 1,    // days to search for language book
    languageSearchChance: 0.5, // 50% chance of finding a language book
    languages: [
      { id: 'common', name: 'Common', tier: 0, learnDays: 0, requires: null },
      { id: 'ancient_script', name: 'Ancient Script', tier: 1, learnDays: 3, requires: null },
      { id: 'forgotten_tongue', name: 'Forgotten Tongue', tier: 2, learnDays: 5, requires: 'ancient_script' },
      { id: 'primordial_glyphs', name: 'Primordial Glyphs', tier: 3, learnDays: 8, requires: 'forgotten_tongue' },
    ],
  },

  // Creature system
  creatures: {
    ringOneCount: 5,                // creature types generated for Ring 1
    traitBonusMin: 3,               // min bonus per trait
    traitBonusMax: 5,               // max bonus per trait
    scoutDefenseBonus: 0.1,         // 10% defense bonus from scouting
    // Size stats (base damage/defense doubles per size, same number for both)
    sizes: {
      sm: { baseDamage: 4,  traitCount: 2 },
      m:  { baseDamage: 8,  traitCount: 3 },
      l:  { baseDamage: 16, traitCount: 4 },
    },
  },

  // Structures (towers only — walls and traps removed)
  structures: {
    towers: {
      wood:      { name: 'Wood Tower',      level: 1, cost: { wood: 8 },               buildDays: 2, maxHp: 1, destroyedOnRaid: true },
      stone:     { name: 'Stone Tower',      level: 2, cost: { stone: 8 },              buildDays: 4, maxHp: 2, repairDays: 1, repairCost: { stone: 1 }, requiresUnlock: true },
      fortified: { name: 'Fortified Tower',  level: 3, cost: { stone: 8, metal: 3 },    buildDays: 6, maxHp: 3, repairDays: 1, repairCost: { stone: 1 }, allowsWards: true, requiresUnlock: true },
    },
  },

  // Scaling curves for relationships
  scaling: {
    priestPerimeterContribution: { curveType: 'LINEAR', intensity: 1 },
    workerProductivity: { curveType: 'DIMINISHING', intensity: 2 },
    combatDefense: { curveType: 'LINEAR', intensity: 1 },
    scholarResearchSpeed: { curveType: 'DIMINISHING', intensity: 1.5 },
  },
};

export default defaultConfig;
