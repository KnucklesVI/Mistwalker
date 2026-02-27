/**
 * EventModule - classifies events and builds the event feed
 */

const EventModule = {
  initialize(config, state) {
    // Events already initialized
  },

  /**
   * EVENTS phase: classify notifications and build feed
   */
  update(state, rng, notifications) {
    for (const notification of notifications) {
      let classification = 'routine';
      let category = 'general';
      let feedText = '';

      switch (notification.type) {
        case 'CHARACTER_ASSIGNED':
          classification = 'routine';
          category = 'people';
          feedText = `${notification.characterName} was tasked with ${notification.newAssignment}`;
          break;

        case 'TRAINING_STARTED':
          classification = 'routine';
          category = 'people';
          feedText = `${notification.characterName} has begun induction as ${notification.targetRole}`;
          break;

        case 'TRAINING_CANCELLED':
          classification = 'routine';
          category = 'people';
          feedText = `${notification.characterName} abandoned their induction`;
          break;

        case 'TRAINING_COMPLETE':
          classification = notification.classification || 'notable';
          category = 'people';
          feedText = `${notification.characterName} has been inducted as ${notification.newRole}`;
          break;

        case 'CHARACTER_RECOVERED':
          classification = 'routine';
          category = 'people';
          feedText = `${notification.characterName} has recovered from their wounds`;
          break;

        case 'RAID_WARNING':
          classification = 'critical';
          category = 'combat';
          feedText = notification.message;
          break;

        case 'RAID_GENERATED':
        case 'RAID_ARRIVED':
          classification = 'critical';
          category = 'combat';
          feedText = notification.message;
          break;

        case 'COMBAT_RESULT':
          classification = notification.classification || 'notable';
          category = 'combat';
          feedText = `Combat: ${notification.message}`;
          break;

        case 'DOCTRINE_TEST_RESULT':
          classification = notification.classification || 'routine';
          category = 'combat';
          feedText = notification.message;
          break;

        case 'PRIEST_ACTION_RESULT':
          classification = notification.classification || 'routine';
          category = 'combat';
          feedText = notification.message;
          break;

        case 'CHARACTER_EXPOSED':
          classification = 'notable';
          category = 'combat';
          feedText = `${notification.characterName} was touched by the mist and ${notification.injury}`;
          break;

        case 'CHARACTER_LOST':
          classification = 'mythic';
          category = 'combat';
          feedText = `${notification.characterName} has been claimed by the mist`;
          break;

        case 'MW_CANCELLED':
          classification = 'routine';
          category = 'exploration';
          feedText = notification.message || "The Mistwalker's sortie was called off";
          break;

        case 'MW_SENT':
          classification = 'notable';
          category = 'exploration';
          feedText = `The Mistwalker ventured into the mist (${notification.totalDays}d journey, ${notification.exploreDays} venture${notification.exploreDays !== 1 ? 's' : ''})`;
          break;

        case 'MW_ARRIVED':
          classification = 'routine';
          category = 'exploration';
          feedText = `${notification.message}`;
          break;

        case 'MW_FINDING':
          classification = notification.classification || 'notable';
          category = 'exploration';
          feedText = `${notification.text}`;
          break;

        case 'MW_RETURNING':
          classification = notification.classification || 'notable';
          category = 'exploration';
          feedText = notification.message || `The Mistwalker is returning (${notification.returnDays}d)`;
          break;

        case 'MW_RETURNED':
          classification = 'notable';
          category = 'exploration';
          feedText = `The Mistwalker has returned bearing ${notification.findingsCount} discoveries`;
          break;

        case 'MW_DELIVERED':
          classification = notification.classification || 'notable';
          category = 'exploration';
          feedText = notification.message;
          break;

        // === Scouting events ===
        case 'MW_SCOUT_SENT':
          classification = 'notable';
          category = 'exploration';
          feedText = notification.message;
          break;

        case 'MW_SCOUT_RETURNED':
          classification = notification.classification || 'notable';
          category = 'combat';
          feedText = notification.message;
          break;

        case 'MW_SCOUT_TRAITS':
          classification = notification.classification || 'notable';
          category = 'combat';
          feedText = notification.message;
          break;

        // === Expedition (party) events ===
        case 'EXPEDITION_SENT':
          classification = 'notable';
          category = 'exploration';
          feedText = notification.message;
          break;

        case 'EXPEDITION_CANCELLED':
          classification = 'routine';
          category = 'exploration';
          feedText = notification.message || 'Expedition recalled';
          break;

        case 'EXPEDITION_ARRIVED':
          classification = 'notable';
          category = 'exploration';
          feedText = notification.message;
          break;

        case 'EXPEDITION_CHALLENGE_RESOLVED':
          classification = 'routine';
          category = 'exploration';
          feedText = notification.message;
          break;

        case 'EXPEDITION_INJURY':
          classification = 'notable';
          category = 'exploration';
          feedText = notification.message;
          break;

        case 'EXPEDITION_RETURNED':
          classification = 'notable';
          category = 'exploration';
          feedText = notification.message;
          break;

        // === Library events ===
        case 'LIBRARY_BROWSE_STARTED':
          classification = 'routine';
          category = 'research';
          feedText = notification.message;
          break;

        case 'LIBRARY_BROWSE_COMPLETE':
          classification = 'routine';
          category = 'research';
          feedText = notification.message;
          break;

        case 'LIBRARY_SCAVENGE_STARTED':
          classification = 'routine';
          category = 'research';
          feedText = notification.message;
          break;

        case 'LIBRARY_SCAVENGE_COMPLETE':
          classification = 'routine';
          category = 'research';
          feedText = notification.message;
          break;

        case 'LIBRARY_STUDY_STARTED':
          classification = 'routine';
          category = 'research';
          feedText = notification.message;
          break;

        case 'LIBRARY_STUDY_BLOCKED':
          classification = 'notable';
          category = 'research';
          feedText = notification.message;
          break;

        case 'LIBRARY_STUDY_DUD':
          classification = 'routine';
          category = 'research';
          feedText = notification.message;
          break;

        case 'LIBRARY_ABILITY_UNLOCKED':
          classification = 'notable';
          category = 'research';
          feedText = notification.message;
          break;

        case 'LIBRARY_SHELVED':
          classification = 'routine';
          category = 'research';
          feedText = notification.message;
          break;

        case 'LIBRARY_LANGUAGE_STARTED':
          classification = 'routine';
          category = 'research';
          feedText = notification.message;
          break;

        case 'LIBRARY_LANGUAGE_LEARNED':
          classification = 'notable';
          category = 'research';
          feedText = notification.message;
          break;

        case 'LIBRARY_CANCELLED':
          classification = 'routine';
          category = 'research';
          feedText = notification.message;
          break;

        case 'LIBRARIAN_PROMOTED':
          classification = 'notable';
          category = 'people';
          feedText = notification.message;
          break;

        case 'TRAP_BUILT':
          classification = notification.classification || 'routine';
          category = 'build';
          feedText = notification.message;
          break;

        case 'RESEARCH_STARTED':
          classification = notification.classification || 'routine';
          category = 'research';
          feedText = notification.message;
          break;

        case 'TRAP_PRODUCTION_TOGGLED':
          classification = 'routine';
          category = 'build';
          feedText = notification.message;
          break;

        case 'RESEARCH_COMPLETE':
          classification = notification.classification || 'notable';
          category = 'research';
          feedText = notification.message;
          break;

        case 'PRODUCTION':
        case 'CONSUMPTION':
        case 'RESOURCES_UPDATE':
          // Suppressed — resource totals visible in header bar
          continue;

        case 'LEVEL_UP':
          classification = 'notable';
          category = 'people';
          feedText = `${notification.characterName} has attained level ${notification.newLevel}`;
          break;

        case 'PERIMETER_WEAKENED':
          classification = 'notable';
          category = 'perimeter';
          feedText = `Wardline weakened — stability at ${notification.newStability.toFixed(0)}`;
          break;

        case 'PERIMETER_STRENGTHENED':
          classification = 'routine';
          category = 'perimeter';
          feedText = `Wardline reinforced — stability at ${notification.newStability.toFixed(0)}`;
          break;

        case 'FOOD_SPOILAGE':
          // Suppressed — resource totals visible in header bar
          continue;

        case 'STARVATION':
          classification = 'mythic';
          category = 'resources';
          feedText = 'Rations exhausted — the settlement starves!';
          break;

        default:
          classification = 'routine';
          category = 'general';
          feedText = `Event: ${notification.type}`;
      }

      // Add to event feed
      const feedEntry = {
        day: state.time.day,
        type: notification.type,
        classification,
        category,
        text: feedText,
        timestamp: state.time.day * 10000 + state.events.feed.length,
      };

      state.events.feed.push(feedEntry);

      // Keep feed from growing too large
      if (state.events.feed.length > 500) {
        state.events.feed = state.events.feed.slice(-500);
      }
    }
  },

  getState(state) {
    return {
      feed: state.events.feed.map(e => ({ ...e })),
      history: state.events.history.map(e => ({ ...e })),
      notifications: state.events.notifications.map(n => ({ ...n })),
    };
  },
};

export default EventModule;
