/**
 * CreaturesModule - Vector-typed creature generation and compendium
 *
 * Creatures are generated at world-gen with:
 *   - A procedural name
 *   - A Vector type (from the ring they belong to)
 *   - A single offense stat
 *   - Flavor descriptions for atmosphere
 *
 * The compendium tracks what the player knows about each creature type.
 * Vector is revealed after any combat encounter.
 */

// ── Creature name parts for procedural generation ──────────────────

const NAME_PREFIXES = [
  'Mist', 'Shadow', 'Grey', 'Ashen', 'Hollow', 'Pale', 'Dusk',
  'Iron', 'Stone', 'Rust', 'Frost', 'Ember', 'Thorn', 'Bone',
  'Bile', 'Void', 'Blight', 'Gloom', 'Wither', 'Murk',
];

const NAME_SUFFIXES = [
  'Stalker', 'Crawler', 'Wraith', 'Lurker', 'Howler', 'Brute',
  'Shade', 'Biter', 'Ripper', 'Drifter', 'Hunter', 'Maw',
  'Sentinel', 'Creeper', 'Render', 'Gnasher', 'Weaver', 'Husk',
  'Warden', 'Prowler',
];

// ── Flavor descriptions (atmospheric scouting text) ────────────────

const FLAVOR_POOL = [
  'The air shimmers with heat around it',
  'A low rumble precedes its approach',
  'Its hide looks thick as stone',
  'It moves with unsettling purpose',
  'A faint luminescence clings to its form',
  'Darkness seems to bend around it',
  'The ground trembles as it draws near',
  'A bitter cold radiates from its presence',
  'It watches with intelligence beyond instinct',
  'Sparks crackle across its body',
  'Its movements are fluid and unpredictable',
  'The mist parts before it like a curtain',
  'A terrible keening precedes its approach',
  'A paralysing dread washes over those nearby',
  'The living feel weaker in its presence',
  'A haze of particles drifts in its wake',
];

// ── Module ─────────────────────────────────────────────────────────

const CreaturesModule = {

  /**
   * Generate a creature type for this world.
   *
   * @param {object} rng - seeded RNG
   * @param {object} config - game config
   * @param {string} vectorId - the Vector this creature is aligned to
   * @param {array} existingCreatures - already generated creatures (avoid duplicate names)
   * @returns {object} creature type definition
   */
  generateCreatureType(rng, config, vectorId, existingCreatures = []) {
    // Generate unique name
    const existingNames = existingCreatures.map(c => c.name);
    let name = '';
    let attempts = 0;
    while (attempts < 50) {
      const prefix = rng.pick(NAME_PREFIXES);
      const suffix = rng.pick(NAME_SUFFIXES);
      name = `${prefix} ${suffix}`;
      if (!existingNames.includes(name)) break;
      attempts++;
    }

    // Offense: base from config + random variation
    const baseDamage = config.creatures.sizes.sm.baseDamage;
    const offense = baseDamage + rng.randInt(0, baseDamage);

    // Pick 1-2 flavor descriptions for atmosphere
    const availableFlavor = [...FLAVOR_POOL];
    const flavorCount = rng.randInt(1, 2);
    const flavor = [];
    for (let i = 0; i < flavorCount && availableFlavor.length > 0; i++) {
      const idx = rng.randInt(0, availableFlavor.length - 1);
      flavor.push(availableFlavor.splice(idx, 1)[0]);
    }

    return {
      id: `creature_${rng.randInt(10000, 99999)}`,
      name,
      vectorId,
      offense,
      flavor,
    };
  },

  /**
   * Generate the world's creature roster at game start.
   *
   * @param {object} rng - seeded RNG
   * @param {object} config - game config
   * @param {string} vectorId - Vector for this ring's creatures
   * @param {number} count - how many creature types to generate
   * @returns {array} creature type definitions
   */
  generateWorldCreatures(rng, config, vectorId, count = 5) {
    const creatures = [];
    for (let i = 0; i < count; i++) {
      creatures.push(this.generateCreatureType(rng, config, vectorId, creatures));
    }
    return creatures;
  },

  /**
   * Initialize creatures state on game start.
   * Generates the world's creature types and empty compendium.
   */
  initialize(state, rng, config) {
    if (!state.creatures) {
      state.creatures = { types: [], compendium: {} };
    }
    if (state.creatures.types.length === 0) {
      // Get vector for current ring from config
      const ringDomain = config.ringDomains[state.vectors?.activeRing || 1];
      const vectorId = ringDomain || 'fire';
      state.creatures.types = this.generateWorldCreatures(
        rng, config, vectorId, config.creatures.ringOneCount
      );
    }
  },

  /**
   * Create a new compendium entry for a creature type.
   */
  createCompendiumEntry(creatureTypeId) {
    return {
      creatureTypeId,
      discovered: false,
      name: null,
      vectorKnown: false,
      vectorId: null,
      offenseKnown: false,
      offense: null,
      encounters: [],
      sightings: [],
      scoutReports: [],
    };
  },

  /**
   * Get or create a compendium entry for a creature type.
   */
  getCompendiumEntry(state, creatureTypeId) {
    if (!state.creatures.compendium[creatureTypeId]) {
      state.creatures.compendium[creatureTypeId] = this.createCompendiumEntry(creatureTypeId);
    }
    return state.creatures.compendium[creatureTypeId];
  },

  /**
   * Record a combat encounter — reveals Vector and offense in compendium.
   */
  recordCombatEncounter(state, creatureTypeId, day, outcome) {
    const entry = this.getCompendiumEntry(state, creatureTypeId);
    const creatureType = state.creatures.types.find(c => c.id === creatureTypeId);
    if (!creatureType) return;

    entry.discovered = true;
    entry.name = creatureType.name;

    // Combat always reveals the Vector
    entry.vectorKnown = true;
    entry.vectorId = creatureType.vectorId;

    // Also reveals offense
    entry.offenseKnown = true;
    entry.offense = creatureType.offense;

    // Add vector to player's known vectors if not already known
    if (state.vectors && !state.vectors.known.includes(creatureType.vectorId)) {
      state.vectors.known.push(creatureType.vectorId);
    }

    entry.encounters.push({ day, outcome });
  },

  /**
   * Record a scouting report for a creature in an incoming raid.
   * Reveals name and approximate strength but not Vector.
   */
  recordScoutReport(state, creatureTypeId, report) {
    const entry = this.getCompendiumEntry(state, creatureTypeId);
    entry.discovered = true;

    const creatureType = state.creatures.types.find(c => c.id === creatureTypeId);
    if (creatureType && !entry.name) {
      entry.name = creatureType.name;
    }

    entry.scoutReports.push(report);
  },

  /**
   * Record MW sighting (no combat) — creature discovered but no stats.
   */
  recordSighting(state, creatureTypeId, day, source) {
    const entry = this.getCompendiumEntry(state, creatureTypeId);
    const creatureType = state.creatures.types.find(c => c.id === creatureTypeId);
    if (!creatureType) return;

    entry.discovered = true;
    entry.name = creatureType.name;
    entry.sightings.push({ day, source });
  },

  /**
   * No per-day update needed — creatures are static.
   */
  update(state, rng, config, notifications) {
    // Nothing to do per tick — creature state is event-driven
  },

  getState(state) {
    if (!state.creatures) return { types: [], compendium: {} };
    return {
      compendium: JSON.parse(JSON.stringify(state.creatures.compendium)),
      knownCreatureCount: Object.values(state.creatures.compendium)
        .filter(e => e.discovered).length,
      totalCreatureCount: state.creatures.types.length,
    };
  },
};

export default CreaturesModule;
