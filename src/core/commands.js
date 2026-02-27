/**
 * Command definitions and validation system
 */

export const COMMAND_TYPES = {
  ASSIGN: 'ASSIGN',
  TRAIN: 'TRAIN',
  CANCEL_TRAINING: 'CANCEL_TRAINING',
  ADVANCE_DAY: 'ADVANCE_DAY',
  SEND_MW: 'SEND_MW',
  CANCEL_MW: 'CANCEL_MW',
  SEND_EXPEDITION: 'SEND_EXPEDITION',
  CANCEL_EXPEDITION: 'CANCEL_EXPEDITION',
  BUILD: 'BUILD',
  CRAFT: 'CRAFT',
  EQUIP: 'EQUIP',
  UNEQUIP: 'UNEQUIP',
  CANCEL_RESEARCH: 'CANCEL_RESEARCH',
  REORDER_RESEARCH: 'REORDER_RESEARCH',
  RESCUE_LOST: 'RESCUE_LOST',
  PROMOTE_LIBRARIAN: 'PROMOTE_LIBRARIAN',
  LIBRARY_BROWSE: 'LIBRARY_BROWSE',
  LIBRARY_SCAVENGE: 'LIBRARY_SCAVENGE',
  LIBRARY_STUDY: 'LIBRARY_STUDY',
  LIBRARY_SEARCH_LANGUAGE: 'LIBRARY_SEARCH_LANGUAGE',
  LIBRARY_SHELVE: 'LIBRARY_SHELVE',
  LIBRARY_CANCEL: 'LIBRARY_CANCEL',
  SCOUT_RAID: 'SCOUT_RAID',
  SET_STUDY_PREFERENCES: 'SET_STUDY_PREFERENCES',
  PIN_TOWER: 'PIN_TOWER',
};

/**
 * Validates a command against current state
 */
export function validateCommand(state, command) {
  if (!command || !command.type) {
    return { valid: false, reason: 'Command must have a type' };
  }

  switch (command.type) {
    case COMMAND_TYPES.ASSIGN:
      return validateAssign(state, command);
    case COMMAND_TYPES.TRAIN:
      return validateTrain(state, command);
    case COMMAND_TYPES.CANCEL_TRAINING:
      return validateCancelTraining(state, command);
    case COMMAND_TYPES.ADVANCE_DAY:
      return validateAdvanceDay(state, command);
    case COMMAND_TYPES.SEND_MW:
      return validateSendMW(state, command);
    case COMMAND_TYPES.CANCEL_MW:
      return validateCancelMW(state, command);
    case COMMAND_TYPES.SEND_EXPEDITION:
      return validateSendExpedition(state, command);
    case COMMAND_TYPES.CANCEL_EXPEDITION:
      return validateCancelExpedition(state, command);
    case COMMAND_TYPES.BUILD:
      return validateBuild(state, command);
    case COMMAND_TYPES.CRAFT:
      return validateCraft(state, command);
    case COMMAND_TYPES.EQUIP:
      return validateEquip(state, command);
    case COMMAND_TYPES.UNEQUIP:
      return validateUnequip(state, command);
    case COMMAND_TYPES.CANCEL_RESEARCH:
      return validateCancelResearch(state, command);
    case COMMAND_TYPES.REORDER_RESEARCH:
      return validateReorderResearch(state, command);
    case COMMAND_TYPES.RESCUE_LOST:
      return validateRescueLost(state, command);
    case COMMAND_TYPES.PROMOTE_LIBRARIAN:
      return validatePromoteLibrarian(state, command);
    case COMMAND_TYPES.LIBRARY_BROWSE:
      return validateLibraryBrowse(state, command);
    case COMMAND_TYPES.LIBRARY_SCAVENGE:
      return validateLibraryScavenge(state, command);
    case COMMAND_TYPES.LIBRARY_STUDY:
      return validateLibraryStudy(state, command);
    case COMMAND_TYPES.LIBRARY_SEARCH_LANGUAGE:
      return validateLibrarySearchLanguage(state, command);
    case COMMAND_TYPES.LIBRARY_SHELVE:
      return validateLibraryShelve(state, command);
    case COMMAND_TYPES.LIBRARY_CANCEL:
      return validateLibraryCancel(state, command);
    case COMMAND_TYPES.SCOUT_RAID:
      return validateScoutRaid(state, command);
    case COMMAND_TYPES.SET_STUDY_PREFERENCES: {
      if (!command.characterId) return { valid: false, reason: 'characterId required' };
      if (!command.preferences) return { valid: false, reason: 'preferences required' };
      const scholar = state.population.characters.find(c => c.id === command.characterId);
      if (!scholar) return { valid: false, reason: 'Character not found' };
      if (scholar.role !== 'scholar') return { valid: false, reason: 'Character is not a scholar' };
      return { valid: true };
    }
    case COMMAND_TYPES.PIN_TOWER:
      if (!command.towerId) return { valid: false, reason: 'towerId required' };
      // priestId can be null (to unpin)
      return { valid: true };
    default:
      return { valid: false, reason: `Unknown command type: ${command.type}` };
  }
}

function validateAssign(state, cmd) {
  if (!cmd.characterId) return { valid: false, reason: 'characterId required' };
  if (!cmd.assignment) return { valid: false, reason: 'assignment required' };

  const char = state.population.characters.find(c => c.id === cmd.characterId);
  if (!char) return { valid: false, reason: 'Character not found' };
  if (char.health === 'dead' || char.health === 'lost') {
    return { valid: false, reason: 'Cannot assign dead or lost character' };
  }

  // Cannot manually assign to 'librarian' — reserved internal assignment
  if (cmd.assignment === 'librarian') {
    return { valid: false, reason: 'Invalid assignment' };
  }

  return { valid: true };
}

function validateTrain(state, cmd) {
  if (!cmd.characterId) return { valid: false, reason: 'characterId required' };
  if (!cmd.targetRole) return { valid: false, reason: 'targetRole required' };

  const char = state.population.characters.find(c => c.id === cmd.characterId);
  if (!char) return { valid: false, reason: 'Character not found' };
  if (char.health === 'dead' || char.health === 'lost') {
    return { valid: false, reason: 'Cannot train dead or lost character' };
  }
  if (char.training) {
    return { valid: false, reason: 'Character already in training' };
  }
  if (char.role === cmd.targetRole) {
    return { valid: false, reason: 'Character already has that role' };
  }

  // Stat requirements — read from config (single source of truth)
  const roleConfig = state.config?.roles?.[cmd.targetRole];
  const req = roleConfig?.req || {};
  for (const [stat, min] of Object.entries(req)) {
    if (char[stat] < min) {
      return { valid: false, reason: 'Character does not meet stat requirements' };
    }
  }

  return { valid: true };
}

function validateCancelTraining(state, cmd) {
  if (!cmd.characterId) return { valid: false, reason: 'characterId required' };

  const char = state.population.characters.find(c => c.id === cmd.characterId);
  if (!char) return { valid: false, reason: 'Character not found' };
  if (!char.training) return { valid: false, reason: 'Character is not training' };

  return { valid: true };
}

function validateAdvanceDay(state, cmd) {
  if (state.time.phase !== 'WAITING_FOR_INPUT') {
    return { valid: false, reason: 'Can only advance day during WAITING_FOR_INPUT phase' };
  }
  return { valid: true };
}

function validateSendMW(state, cmd) {
  if (!cmd.ring) return { valid: false, reason: 'ring required' };
  if (!cmd.totalDays || cmd.totalDays < 1) return { valid: false, reason: 'totalDays required (min 1)' };

  const mw = state.population.characters.find(c => c.role === 'mistwalker');
  if (!mw) return { valid: false, reason: 'No mistwalker available' };
  if (mw.health === 'dead' || mw.health === 'lost') {
    return { valid: false, reason: 'Mistwalker is not available' };
  }
  if (state.exploration.mwState.status !== 'home') {
    return { valid: false, reason: 'Mistwalker is not home' };
  }

  return { valid: true };
}

function validateCancelMW(state, cmd) {
  const mwState = state.exploration.mwState;
  if (mwState.status === 'home') {
    return { valid: false, reason: 'Mistwalker is already home' };
  }
  if (mwState.departDay !== state.time.day) {
    return { valid: false, reason: 'Can only cancel on the day of departure' };
  }
  return { valid: true };
}

function validateRescueLost(state, cmd) {
  if (!cmd.characterId) return { valid: false, reason: 'characterId required' };

  const mw = state.population.characters.find(c => c.role === 'mistwalker');
  if (!mw) return { valid: false, reason: 'No mistwalker available' };
  if (mw.health === 'dead' || mw.health === 'lost') {
    return { valid: false, reason: 'Mistwalker is not available' };
  }
  if (mw.health === 'injured' || mw.health === 'gravely_injured') {
    return { valid: false, reason: 'Mistwalker is injured and cannot go out' };
  }
  if (state.exploration.mwState.status !== 'home') {
    return { valid: false, reason: 'Mistwalker is not home' };
  }

  const target = state.population.characters.find(c => c.id === cmd.characterId);
  if (!target) return { valid: false, reason: 'Character not found' };
  if (target.health !== 'lost') return { valid: false, reason: 'Character is not lost' };

  return { valid: true };
}

function validateSendExpedition(state, cmd) {
  if (!cmd.members || !Array.isArray(cmd.members) || cmd.members.length === 0) {
    return { valid: false, reason: 'members array required' };
  }
  if (!cmd.locationId) return { valid: false, reason: 'locationId required' };
  if (!cmd.daysAtSite || cmd.daysAtSite < 1) return { valid: false, reason: 'daysAtSite required (min 1)' };

  // MW must be home and healthy
  const mw = state.population.characters.find(c => c.role === 'mistwalker');
  if (!mw) return { valid: false, reason: 'No mistwalker available' };
  if (mw.health === 'dead' || mw.health === 'lost') return { valid: false, reason: 'Mistwalker is not available' };
  if (mw.health === 'injured' || mw.health === 'gravely_injured') return { valid: false, reason: 'Mistwalker is injured' };
  if (state.exploration.mwState.status !== 'home') return { valid: false, reason: 'Mistwalker is not home' };

  // No expedition already active
  if (state.exploration.activeExpedition) return { valid: false, reason: 'An expedition is already active' };

  // Location must exist and be discovered
  const location = (state.exploration.locations.minor || []).find(l => l.id === cmd.locationId);
  if (!location) return { valid: false, reason: 'Location not found' };

  // All members must be valid, alive, healthy, and available
  const members = [];
  for (const memberId of cmd.members) {
    const char = state.population.characters.find(c => c.id === memberId);
    if (!char) return { valid: false, reason: `Character ${memberId} not found` };
    if (char.health === 'dead' || char.health === 'lost') return { valid: false, reason: `${char.name} cannot participate (dead/lost)` };
    if (char.health === 'injured' || char.health === 'gravely_injured') return { valid: false, reason: `${char.name} is injured` };
    if (char.assignment === 'expedition') return { valid: false, reason: `${char.name} is already on an expedition` };
    if (char.training) return { valid: false, reason: `${char.name} is in training` };
    members.push(char);
  }

  // MW must be in the party
  if (!members.find(c => c.role === 'mistwalker')) return { valid: false, reason: 'Mistwalker must lead the expedition' };

  // Priest must be in the party
  const priest = members.find(c => c.role === 'priest');
  if (!priest) return { valid: false, reason: 'A priest is required to shield the party' };

  // Party size <= priest spirit (capacity)
  const expConfig = state.config?.expedition || {};
  const priestSpirit = priest.spirit + (priest.modifiers || []).reduce((sum, m) => sum + (m.statBonuses?.spirit || 0), 0);
  const capacity = priestSpirit * (expConfig.capacityPerSpirit || 1);
  if (members.length > capacity) return { valid: false, reason: `Party too large (${members.length}/${capacity} — priest spirit limits capacity)` };

  // Total days (travel + work + travel) must fit within MW range
  const mwSpirit = mw.spirit + (mw.modifiers || []).reduce((sum, m) => sum + (m.statBonuses?.spirit || 0), 0);
  const mwRange = expConfig.mwRangeBySpirit?.[mwSpirit] || 5;
  const travelDays = (state.config?.exploration?.ringTravelDays || [1, 4, 7, 10])[location.ring - 1] || 1;
  const totalDaysNeeded = (travelDays * 2) + cmd.daysAtSite;
  if (totalDaysNeeded > mwRange) return { valid: false, reason: `Trip too long (${totalDaysNeeded} days needed, MW range is ${mwRange})` };

  return { valid: true };
}

function validateCancelExpedition(state, cmd) {
  const exp = state.exploration.activeExpedition;
  if (!exp) return { valid: false, reason: 'No active expedition' };
  if (exp.departDay !== state.time.day) return { valid: false, reason: 'Can only cancel on the day of departure' };
  return { valid: true };
}

function validateBuild(state, cmd) {
  if (!cmd.category) return { valid: false, reason: 'category required' };
  if (!cmd.structureType) return { valid: false, reason: 'structureType required' };
  return { valid: true };
}

function validateCraft(state, cmd) {
  if (!cmd.itemId) return { valid: false, reason: 'itemId required' };
  return { valid: true };
}

function validateEquip(state, cmd) {
  if (!cmd.characterId) return { valid: false, reason: 'characterId required' };
  if (!cmd.itemId) return { valid: false, reason: 'itemId required' };
  const artifact = (state.knowledge.artifacts || []).find(a => a.id === cmd.itemId);
  if (!artifact) return { valid: false, reason: 'Artifact not found' };
  if (!artifact.identified) return { valid: false, reason: 'Artifact not yet identified' };
  if (artifact.equippedTo) return { valid: false, reason: 'Artifact already equipped' };
  const char = state.population.characters.find(c => c.id === cmd.characterId);
  if (!char) return { valid: false, reason: 'Character not found' };
  if (char.health === 'dead' || char.health === 'lost') return { valid: false, reason: 'Cannot equip to dead/lost character' };
  return { valid: true };
}

function validateUnequip(state, cmd) {
  if (!cmd.itemId) return { valid: false, reason: 'itemId required' };
  const artifact = (state.knowledge.artifacts || []).find(a => a.id === cmd.itemId);
  if (!artifact) return { valid: false, reason: 'Artifact not found' };
  if (!artifact.equippedTo) return { valid: false, reason: 'Artifact not equipped' };
  return { valid: true };
}

function validateCancelResearch(state, cmd) {
  if (!cmd.researchId) return { valid: false, reason: 'researchId required' };
  const research = (state.knowledge.activeResearch || []).find(r => r.id === cmd.researchId);
  if (!research) return { valid: false, reason: 'Research not found' };
  return { valid: true };
}

function validateReorderResearch(state, cmd) {
  if (!cmd.clueId) return { valid: false, reason: 'clueId required' };
  if (!cmd.direction || !['up', 'down'].includes(cmd.direction)) {
    return { valid: false, reason: 'direction must be "up" or "down"' };
  }
  const clues = (state.knowledge.clues || []).filter(c => c.status === 'perceived');
  const idx = clues.findIndex(c => c.id === cmd.clueId);
  if (idx === -1) return { valid: false, reason: 'Clue not found in queue' };
  return { valid: true };
}

function validatePromoteLibrarian(state, cmd) {
  if (!cmd.characterId) return { valid: false, reason: 'characterId required' };

  const char = state.population.characters.find(c => c.id === cmd.characterId);
  if (!char) return { valid: false, reason: 'Character not found' };
  if (char.role !== 'scholar') return { valid: false, reason: 'Only scholars can become librarians' };
  if (char.health === 'dead' || char.health === 'lost') return { valid: false, reason: `${char.name} is not available` };

  // Only one librarian per settlement
  if (state.library?.librarianId) {
    const existing = state.population.characters.find(c => c.id === state.library.librarianId);
    if (existing && existing.health !== 'dead' && existing.health !== 'lost') {
      return { valid: false, reason: `${existing.name} is already the librarian` };
    }
  }

  return { valid: true };
}

function validateLibraryBrowse(state, cmd) {
  if (!cmd.scholarId) return { valid: false, reason: 'scholarId required' };
  const char = state.population.characters.find(c => c.id === cmd.scholarId);
  if (!char) return { valid: false, reason: 'Character not found' };
  if (char.role !== 'scholar') return { valid: false, reason: 'Only scholars can use the library' };
  if (char.health !== 'active') return { valid: false, reason: `${char.name} is not available` };
  if (char.training) return { valid: false, reason: `${char.name} is in training` };



  // Check if scholar already has an active library activity
  const scholarState = state.library?.scholarStates?.[cmd.scholarId];
  if (scholarState?.currentActivity) return { valid: false, reason: `${char.name} is already busy in the library` };

  // Topic is optional — if provided, must be a valid topic
  if (cmd.topic) {
    const validTopics = ['priest', 'soldier', 'engineer', 'scholar', 'creatures'];
    if (!validTopics.includes(cmd.topic)) return { valid: false, reason: `Invalid topic: ${cmd.topic}` };
  }

  return { valid: true };
}

function validateLibraryScavenge(state, cmd) {
  if (!cmd.scholarId) return { valid: false, reason: 'scholarId required' };
  const char = state.population.characters.find(c => c.id === cmd.scholarId);
  if (!char) return { valid: false, reason: 'Character not found' };
  if (char.role !== 'scholar') return { valid: false, reason: 'Only scholars can use the library' };
  if (char.health !== 'active') return { valid: false, reason: `${char.name} is not available` };
  if (char.training) return { valid: false, reason: `${char.name} is in training` };



  const scholarState = state.library?.scholarStates?.[cmd.scholarId];
  if (scholarState?.currentActivity) return { valid: false, reason: `${char.name} is already busy in the library` };

  return { valid: true };
}

function validateLibraryStudy(state, cmd) {
  if (!cmd.scholarId) return { valid: false, reason: 'scholarId required' };
  if (!cmd.titleId) return { valid: false, reason: 'titleId required' };
  const char = state.population.characters.find(c => c.id === cmd.scholarId);
  if (!char) return { valid: false, reason: 'Character not found' };
  if (char.role !== 'scholar') return { valid: false, reason: 'Only scholars can use the library' };
  if (char.health !== 'active') return { valid: false, reason: `${char.name} is not available` };
  if (char.training) return { valid: false, reason: `${char.name} is in training` };



  const scholarState = state.library?.scholarStates?.[cmd.scholarId];
  if (scholarState?.currentActivity) return { valid: false, reason: `${char.name} is already busy in the library` };

  // Title must be in one of: currentBook, unreadBooks, or needsLanguage
  const isCurrent = scholarState?.currentBook === cmd.titleId;
  const isUnread = (scholarState?.unreadBooks || []).some(x => (typeof x === 'string' ? x : x.titleId) === cmd.titleId);
  const isNeedsLang = (scholarState?.needsLanguage || []).some(x => x.titleId === cmd.titleId);

  if (!isCurrent && !isUnread && !isNeedsLang) {
    return { valid: false, reason: 'This title is not available to study' };
  }

  // Title must not already be unlocked
  const alreadyUnlocked = (state.library?.unlockedAbilities || []).find(a => a.titleId === cmd.titleId);
  if (alreadyUnlocked) return { valid: false, reason: 'This title has already been studied' };

  return { valid: true };
}

function validateLibrarySearchLanguage(state, cmd) {
  if (!cmd.scholarId) return { valid: false, reason: 'scholarId required' };
  if (!cmd.languageId) return { valid: false, reason: 'languageId required' };
  const char = state.population.characters.find(c => c.id === cmd.scholarId);
  if (!char) return { valid: false, reason: 'Character not found' };
  if (char.role !== 'scholar') return { valid: false, reason: 'Only scholars can use the library' };
  if (char.health !== 'active') return { valid: false, reason: `${char.name} is not available` };
  if (char.training) return { valid: false, reason: `${char.name} is in training` };



  const scholarState = state.library?.scholarStates?.[cmd.scholarId];
  if (scholarState?.currentActivity) return { valid: false, reason: `${char.name} is already busy in the library` };

  // Check scholar doesn't already know this language
  if (scholarState?.knownLanguages?.includes(cmd.languageId)) {
    return { valid: false, reason: `${char.name} already knows this language` };
  }

  // Check prerequisite language
  const languages = state.config?.library?.languages || [];
  const targetLang = languages.find(l => l.id === cmd.languageId);
  if (!targetLang) return { valid: false, reason: 'Unknown language' };
  if (targetLang.requires && !scholarState?.knownLanguages?.includes(targetLang.requires)) {
    const prereq = languages.find(l => l.id === targetLang.requires);
    return { valid: false, reason: `Must learn ${prereq?.name || targetLang.requires} first` };
  }

  return { valid: true };
}

function validateLibraryShelve(state, cmd) {
  if (!cmd.scholarId) return { valid: false, reason: 'scholarId required' };
  const char = state.population.characters.find(c => c.id === cmd.scholarId);
  if (!char) return { valid: false, reason: 'Character not found' };
  if (char.role !== 'scholar') return { valid: false, reason: 'Only scholars can shelve books' };
  if (char.health !== 'active') return { valid: false, reason: `${char.name} is not available` };



  const scholarState = state.library?.scholarStates?.[cmd.scholarId];
  if (!scholarState?.currentBook) return { valid: false, reason: 'No book currently found to shelve' };

  return { valid: true };
}

function validateLibraryCancel(state, cmd) {
  if (!cmd.scholarId) return { valid: false, reason: 'scholarId required' };
  const scholarState = state.library?.scholarStates?.[cmd.scholarId];
  if (!scholarState?.currentActivity) return { valid: false, reason: 'No active library task to cancel' };
  return { valid: true };
}

function validateScoutRaid(state, cmd) {
  if (!cmd.raidId) return { valid: false, reason: 'raidId required' };

  const mw = state.population.characters.find(c => c.role === 'mistwalker');
  if (!mw) return { valid: false, reason: 'No mistwalker available' };
  if (mw.health === 'dead' || mw.health === 'lost') {
    return { valid: false, reason: 'Mistwalker is not available' };
  }
  if (mw.health === 'injured' || mw.health === 'gravely_injured') {
    return { valid: false, reason: 'Mistwalker is injured and cannot scout' };
  }
  if (state.exploration.mwState.status !== 'home') {
    return { valid: false, reason: 'Mistwalker is not home' };
  }

  // Raid must exist and be incoming (not yet arrived)
  const raid = state.mist.raidQueue.find(r => r.id === cmd.raidId);
  if (!raid) return { valid: false, reason: 'Raid not found' };
  if (raid.status !== 'incoming') return { valid: false, reason: 'Can only scout incoming raids' };
  if (raid.scouted) return { valid: false, reason: 'This raid has already been scouted' };

  return { valid: true };
}

export function createCommand(type, data = {}) {
  return {
    type,
    ...data,
  };
}
