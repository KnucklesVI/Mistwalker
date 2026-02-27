/**
 * LibraryModule - Scholar book research system
 *
 * Scholars can:
 *   1. Browse the library (1 day) → finds 1 book, player decides to Study or Shelve
 *   2. Study a book (1-7 days) → outcome determined AFTER studying:
 *      - Success: ability unlocked (tier > 0, scholar knows the language)
 *      - Dud: book was useless (tier === 0)
 *      - Blocked: key content in a language the scholar doesn't know (revealed after study)
 *   3. Shelve a book → moves to unread pile for later
 *   4. Learn a language → prerequisite chain, greyed out if not qualified
 *
 * Books have two language fields:
 *   - discoverable: language needed to FIND the book while browsing
 *   - language: language needed to EXTRACT useful content
 *
 * Activities are tracked per-scholar in state.library.scholarStates.
 * While a scholar has an active library task, they don't contribute to clue research.
 *
 * Abilities are "unlocked" but don't apply mechanical effects yet — placeholder for future.
 */

import LIBRARY_CATALOG from '../library-catalog.js?v=5z';
import COUNTER_CATALOG from '../counter-catalog.js?v=5z';
import FILLER_CATALOG from '../filler-catalog.js?v=5z';

// Combined catalog — all books in the game
const FULL_CATALOG = [...LIBRARY_CATALOG, ...COUNTER_CATALOG, ...FILLER_CATALOG];

/**
 * Find a title across all catalogs
 */
function findTitle(titleId) {
  return FULL_CATALOG.find(t => t.id === titleId);
}

/**
 * Ensure a scholar has a state entry
 */
function ensureScholarState(state, scholarId) {
  if (!state.library) {
    state.library = { scholarStates: {}, unlockedAbilities: [] };
  }
  if (!state.library.scholarStates) {
    state.library.scholarStates = {};
  }
  if (!state.library.scholarStates[scholarId]) {
    state.library.scholarStates[scholarId] = {
      knownLanguages: ['common'],
      currentActivity: null,
      currentBook: null,       // single titleId just found — awaiting Study/Shelve
      unreadBooks: [],         // titleIds shelved by player choice
      needsLanguage: [],       // [{ titleId, language }] — blocked, language revealed after study
      deadEnds: [],            // titleIds — duds
      studiedBooks: [],        // titleIds — successfully unlocked abilities
      studyPreferences: { lore: true, maps: true, artifacts: true, herbs: true, essences: true },
      categoryXp: { lore: 0, maps: 0, artifacts: 0, herbs: 0, essences: 0 },
    };
  }
  // Migration: if old state shape exists, convert it
  const ss = state.library.scholarStates[scholarId];
  if (ss.revealedBooks) {
    if (!ss.unreadBooks) ss.unreadBooks = [];
    ss.unreadBooks = [...ss.unreadBooks, ...ss.revealedBooks];
    delete ss.revealedBooks;
  }
  if (ss.currentBook === undefined) ss.currentBook = null;
  if (!ss.unreadBooks) ss.unreadBooks = [];
  if (!ss.needsLanguage) ss.needsLanguage = [];
  if (!ss.deadEnds) ss.deadEnds = [];
  if (!ss.studiedBooks) ss.studiedBooks = [];
  if (!ss.studyPreferences) ss.studyPreferences = { lore: true, maps: true, artifacts: true, herbs: true, essences: true };
  if (!ss.categoryXp) ss.categoryXp = { lore: 0, maps: 0, artifacts: 0, herbs: 0, essences: 0 };
  return ss;
}

/**
 * Extract titleId from an unreadBooks entry (handles old string format and new object format)
 */
function unreadId(entry) {
  return typeof entry === 'string' ? entry : entry.titleId;
}

const LibraryModule = {
  /**
   * Handle PROMOTE_LIBRARIAN command — promote a scholar to librarian
   * Only one librarian per settlement. They do ALL library work full-time.
   */
  handlePromoteLibrarian(state, command, config, notifications) {
    const char = state.population.characters.find(c => c.id === command.characterId);
    if (!char) return;

    if (!state.library) {
      state.library = { librarianId: null, scholarStates: {}, unlockedAbilities: [] };
    }

    state.library.librarianId = command.characterId;
    char.assignment = 'librarian';

    // Ensure the librarian has a scholar state
    ensureScholarState(state, command.characterId);

    notifications.push({
      type: 'LIBRARIAN_PROMOTED',
      classification: 'notable',
      message: `${char.name} has been appointed Librarian — they will manage all library work full-time`,
      characterId: command.characterId,
      characterName: char.name,
    });
  },

  /**
   * Handle LIBRARY_BROWSE command — librarian starts browsing
   */
  handleBrowse(state, command, config, rng, notifications) {
    const scholarState = ensureScholarState(state, command.scholarId);
    const char = state.population.characters.find(c => c.id === command.scholarId);

    scholarState.currentActivity = {
      type: 'browsing',
      topic: command.topic || null,  // null = all topics
      daysRemaining: config.library?.browseDays || 1,
      startDay: state.time.day,
    };

    const topicLabel = command.topic ? ` for ${command.topic} titles` : '';
    notifications.push({
      type: 'LIBRARY_BROWSE_STARTED',
      classification: 'routine',
      message: `${char.name} is browsing the library${topicLabel}`,
    });
  },

  /**
   * Handle LIBRARY_SCAVENGE command — librarian grabs 5 random books from the full catalog
   * All 5 go straight to the unread pile. ~80% filler, ~20% useful on average.
   */
  handleScavenge(state, command, config, rng, notifications) {
    const scholarState = ensureScholarState(state, command.scholarId);
    const char = state.population.characters.find(c => c.id === command.scholarId);

    scholarState.currentActivity = {
      type: 'scavenging',
      daysRemaining: config.library?.scavengeDays || 1,
      startDay: state.time.day,
    };

    notifications.push({
      type: 'LIBRARY_SCAVENGE_STARTED',
      classification: 'routine',
      message: `${char.name} is scavenging the library for anything useful`,
    });
  },

  /**
   * Handle LIBRARY_STUDY command — scholar starts studying a specific book
   * No upfront language check — outcome determined on completion.
   */
  handleStudy(state, command, config, notifications) {
    const scholarState = ensureScholarState(state, command.scholarId);
    const char = state.population.characters.find(c => c.id === command.scholarId);
    const title = findTitle(command.titleId);
    if (!title) return;

    // Always start studying — duration based on tier
    const studyDays = config.library?.studyDays || { 0: 1, 1: 3, 2: 5, 3: 7 };
    const days = studyDays[title.tier] || 3;

    scholarState.currentActivity = {
      type: 'studying',
      titleId: command.titleId,
      titleName: title.name,
      daysRemaining: days,
      totalDays: days,
      startDay: state.time.day,
      // outcome determined on completion, not here
    };

    notifications.push({
      type: 'LIBRARY_STUDY_STARTED',
      classification: 'routine',
      message: `${char.name} begins studying "${title.name}"`,
    });
  },

  /**
   * Handle LIBRARY_SHELVE command — player shelves the current find
   */
  handleShelve(state, command, notifications) {
    const scholarState = ensureScholarState(state, command.scholarId);
    const char = state.population.characters.find(c => c.id === command.scholarId);

    if (!scholarState.currentBook) return;

    const title = findTitle(scholarState.currentBook);
    scholarState.unreadBooks.push({
      titleId: scholarState.currentBook,
      addedDay: state.time.day,
      source: 'shelved',
    });
    scholarState.currentBook = null;

    notifications.push({
      type: 'LIBRARY_SHELVED',
      classification: 'routine',
      message: `${char.name} shelved "${title?.name || 'a book'}" for later`,
    });
  },

  /**
   * Handle LIBRARY_SEARCH_LANGUAGE command
   */
  handleSearchLanguage(state, command, config, notifications) {
    const scholarState = ensureScholarState(state, command.scholarId);
    const char = state.population.characters.find(c => c.id === command.scholarId);
    const languages = config.library?.languages || [];
    const targetLang = languages.find(l => l.id === command.languageId);

    scholarState.currentActivity = {
      type: 'learning_language',
      languageId: command.languageId,
      languageName: targetLang?.name || command.languageId,
      daysRemaining: targetLang?.learnDays || 3,
      totalDays: targetLang?.learnDays || 3,
      startDay: state.time.day,
    };

    notifications.push({
      type: 'LIBRARY_LANGUAGE_STARTED',
      classification: 'routine',
      message: `${char.name} begins studying ${targetLang?.name || command.languageId}`,
    });
  },

  /**
   * Handle LIBRARY_CANCEL command
   */
  handleCancel(state, command, notifications) {
    const scholarState = ensureScholarState(state, command.scholarId);
    const char = state.population.characters.find(c => c.id === command.scholarId);
    const activity = scholarState.currentActivity;

    scholarState.currentActivity = null;

    notifications.push({
      type: 'LIBRARY_CANCELLED',
      classification: 'routine',
      message: `${char.name} stopped their library work${activity ? ` (${activity.type})` : ''}`,
    });
  },

  /**
   * SET_STUDY_PREFERENCES — update a scholar's category toggles
   * Extracted from engine.js lines 319-347
   *
   * Uses ensureScholarState() for lazy-init (engine had inline duplication).
   * studyPreferences is overwritten entirely by command.preferences.
   */
  handleSetStudyPreferences(state, command, notifications) {
    const scholar = state.population.characters.find(c => c.id === command.characterId);
    if (scholar) {
      const ss = ensureScholarState(state, scholar.id);
      ss.studyPreferences = { ...command.preferences };
      notifications.push({
        type: 'STUDY_PREFERENCES_UPDATED',
        characterId: scholar.id,
        classification: 'routine',
        message: `${scholar.name}'s study focus updated`,
      });
    }
  },

  /**
   * Daily update — tick all active library activities
   * Called during KNOWLEDGE phase
   */
  update(state, rng, config, notifications) {
    if (!state.library?.scholarStates) return;

    for (const [scholarId, scholarState] of Object.entries(state.library.scholarStates)) {
      if (!scholarState.currentActivity) continue;

      const char = state.population.characters.find(c => c.id === scholarId);
      if (!char || char.health !== 'active') {
        // Scholar died or got injured — cancel activity
        scholarState.currentActivity = null;
        continue;
      }

      const activity = scholarState.currentActivity;
      activity.daysRemaining -= 1;

      if (activity.daysRemaining <= 0) {
        // Activity complete — resolve
        this._resolveActivity(state, scholarId, scholarState, activity, rng, config, notifications);
        scholarState.currentActivity = null;
      }
    }
  },

  /**
   * Resolve a completed library activity
   */
  _resolveActivity(state, scholarId, scholarState, activity, rng, config, notifications) {
    const char = state.population.characters.find(c => c.id === scholarId);
    const charName = char?.name || 'Scholar';

    switch (activity.type) {
      case 'browsing': {
        // Find 1 book from the discoverable pool
        const knownLangs = scholarState.knownLanguages || ['common'];
        const topicFilter = activity.topic || null;

        // Collect all IDs already in any pile
        const allKnownIds = new Set([
          ...(scholarState.currentBook ? [scholarState.currentBook] : []),
          ...(scholarState.unreadBooks || []).map(unreadId),
          ...(scholarState.needsLanguage || []).map(x => x.titleId),
          ...(scholarState.deadEnds || []),
          ...(scholarState.studiedBooks || []),
        ]);

        // Targeted browse uses role-ability catalog only (not filler/counter)
        const pool = LIBRARY_CATALOG.filter(t =>
          knownLangs.includes(t.discoverable) &&
          !allKnownIds.has(t.id) &&
          (!topicFilter || t.topic === topicFilter)
        );

        if (pool.length === 0) {
          const topicSuffix = topicFilter ? ` on ${topicFilter}` : '';
          notifications.push({
            type: 'LIBRARY_BROWSE_COMPLETE',
            classification: 'routine',
            message: `${charName} searched but found no new titles${topicSuffix}`,
            category: 'library',
          });
          break;
        }

        // Pick 1 random title
        const shuffled = this._shuffle([...pool], rng);
        const picked = shuffled[0];
        scholarState.currentBook = picked.id;

        const topicSuffix = topicFilter ? ` on ${topicFilter}` : '';
        notifications.push({
          type: 'LIBRARY_BROWSE_COMPLETE',
          classification: 'routine',
          message: `${charName} found "${picked.name}"${topicSuffix} in the library`,
          category: 'library',
        });
        break;
      }

      case 'scavenging': {
        // Grab 5 random books from the FULL catalog
        const scavLangs = scholarState.knownLanguages || ['common'];

        const scavKnownIds = new Set([
          ...(scholarState.currentBook ? [scholarState.currentBook] : []),
          ...(scholarState.unreadBooks || []).map(unreadId),
          ...(scholarState.needsLanguage || []).map(x => x.titleId),
          ...(scholarState.deadEnds || []),
          ...(scholarState.studiedBooks || []),
        ]);

        const scavPool = FULL_CATALOG.filter(t =>
          scavLangs.includes(t.discoverable) &&
          !scavKnownIds.has(t.id)
        );

        const scavCount = Math.min(config.library?.scavengeCount || 5, scavPool.length);
        const scavShuffled = this._shuffle([...scavPool], rng);
        const scavPicked = scavShuffled.slice(0, scavCount);

        // All go straight to unread pile
        for (const book of scavPicked) {
          scholarState.unreadBooks.push({
            titleId: book.id,
            addedDay: state.time.day,
            source: 'scavenged',
          });
        }

        const usefulCount = scavPicked.filter(b => b.tier > 0).length;
        notifications.push({
          type: 'LIBRARY_SCAVENGE_COMPLETE',
          classification: 'routine',
          message: `${charName} scavenged ${scavPicked.length} books from the library` +
            (usefulCount > 0 ? ` — ${usefulCount} look${usefulCount === 1 ? 's' : ''} promising` : ' — mostly filler'),
          bookNames: scavPicked.map(b => b.name),
        });
        break;
      }

      case 'studying': {
        const title = findTitle(activity.titleId);
        if (!title) break;

        // Remove book from whichever source pile it came from
        if (scholarState.currentBook === activity.titleId) {
          scholarState.currentBook = null;
        }
        scholarState.unreadBooks = (scholarState.unreadBooks || []).filter(e => unreadId(e) !== activity.titleId);
        scholarState.needsLanguage = (scholarState.needsLanguage || []).filter(x => x.titleId !== activity.titleId);

        // Determine outcome NOW (after studying, not before)
        const canRead = title.language === 'common' || scholarState.knownLanguages.includes(title.language);

        if (!canRead) {
          // Language blocked — scholar got partway through, hit a wall
          // The required language is NOW revealed
          scholarState.needsLanguage.push({
            titleId: activity.titleId,
            language: title.language,
          });

          const languages = config.library?.languages || [];
          const langInfo = languages.find(l => l.id === title.language);
          notifications.push({
            type: 'LIBRARY_STUDY_BLOCKED',
            classification: 'routine',
            message: `${charName} couldn't finish "${activity.titleName}" — key sections written in ${langInfo?.name || title.language}`,
            category: 'library',
          });
        } else if (title.tier === 0) {
          // Dud — book was a dead end
          scholarState.deadEnds.push(activity.titleId);

          // Award category XP even for duds — studying is studying
          const dudCategory = (config.scholar?.topicToCategory || {})[title.topic] || 'lore';
          const dudXp = config.scholar?.xpPerDud || 1;
          scholarState.categoryXp[dudCategory] = (scholarState.categoryXp[dudCategory] || 0) + dudXp;

          notifications.push({
            type: 'LIBRARY_STUDY_DUD',
            classification: 'routine',
            message: `${charName} finished "${activity.titleName}" — interesting but not practically useful`,
            category: 'library',
          });
        } else {
          // Success — ability unlocked!
          scholarState.studiedBooks.push(activity.titleId);

          // Award category XP for successful study
          const studyCategory = (config.scholar?.topicToCategory || {})[title.topic] || 'lore';
          const studyXp = config.scholar?.xpPerStudy || 1;
          scholarState.categoryXp[studyCategory] = (scholarState.categoryXp[studyCategory] || 0) + studyXp;

          if (!state.library.unlockedAbilities) state.library.unlockedAbilities = [];
          state.library.unlockedAbilities.push({
            abilityId: title.abilityId,
            abilityName: title.abilityName,
            abilityDescription: title.abilityDescription,
            topic: title.topic,
            tier: title.tier,
            titleId: title.id,
            titleName: title.name,
            unlockedDay: state.time.day,
            unlockedBy: scholarId,
            unlockedByName: charName,
          });

          notifications.push({
            type: 'LIBRARY_ABILITY_UNLOCKED',
            classification: 'notable',
            message: `${charName} decoded "${activity.titleName}" — unlocked ${title.abilityName} for ${title.topic}s!`,
            category: 'library',
          });
        }
        break;
      }

      case 'learning_language': {
        // Language learned!
        if (!scholarState.knownLanguages) scholarState.knownLanguages = ['common'];
        if (!scholarState.knownLanguages.includes(activity.languageId)) {
          scholarState.knownLanguages.push(activity.languageId);
        }

        // Award lore XP for learning a language
        const langXp = config.scholar?.xpPerLanguage || 2;
        scholarState.categoryXp.lore = (scholarState.categoryXp.lore || 0) + langXp;

        notifications.push({
          type: 'LIBRARY_LANGUAGE_LEARNED',
          classification: 'notable',
          message: `${charName} learned ${activity.languageName} — new books are now accessible`,
          category: 'library',
        });
        break;
      }
    }
  },

  /**
   * Fisher-Yates shuffle using seeded RNG
   */
  _shuffle(arr, rng) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = rng.randInt(0, i);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  },
};

export default LibraryModule;
