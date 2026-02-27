/**
 * Lexicon — Central vocabulary for all game display text
 *
 * Internal state keys (c.role === 'priest') NEVER change.
 * Only what the player SEES changes.
 */

export const LEX = {
  stats: {
    body:   { name: 'Body',  abbr: 'B' },
    mind:   { name: 'Mind',  abbr: 'M' },
    spirit: { name: 'Spirit',  abbr: 'S' },
  },

  resources: {
    food:  'Rations',
    wood:  'Timber',
    stone: 'Ore',
    metal: 'Iron',
    herbs: 'Salves',
  },

  roles: {
    priest:     'Priest',
    soldier:    'Soldier',
    engineer:   'Engineer',
    worker:     'Worker',
    scholar:    'Scholar',
    mistwalker: 'Mistwalker',
    unassigned: 'Untrained',
  },

  assignments: {
    farming:     'Tiller',
    chopping:    'Feller',
    quarrying:   'Stonecutter',
    digging:     'Excavator',
    garrison:    'Garrison',
    perimeter:   'Wardline',
    building:    'Building',
    researching: 'Lorekeeper',
    available:   'Unassigned',
    healing:     'Mender',
    expedition:  'Expedition',
  },

  health: {
    active:          'able',
    injured:         'wounded',
    gravely_injured: 'critical',
    dead:            'fallen',
    lost:            'claimed by the mist',
  },

  tabs: {
    dashboard:  'Dashboard',
    people:     'People',
    explore:    'Explore',
    research:   'Scholar',
    build:      'Engineer',
    items:      'Items',
    compendium: 'Compendium',
  },
};

// ── Helper look-ups ──

export function role(key) {
  return LEX.roles[key] || key;
}

export function rolePlural(key) {
  const label = LEX.roles[key] || key;
  if (label.endsWith('s')) return label + 'es';
  return label + 's';
}

export function stat(key) {
  return LEX.stats[key]?.name || key;
}

export function statAbbr(key) {
  return LEX.stats[key]?.abbr || key.charAt(0).toUpperCase();
}

export function assignment(key) {
  return LEX.assignments[key] || key;
}

export function health(key) {
  return LEX.health[key] || key;
}

export function resource(key) {
  return LEX.resources[key] || key;
}

export function tab(key) {
  return LEX.tabs[key] || key;
}

/** Compact stat string: V3 A2 E1 */
export function statLine(char) {
  return `${LEX.stats.body.abbr}${char.body} ${LEX.stats.mind.abbr}${char.mind} ${LEX.stats.spirit.abbr}${char.spirit}`;
}
