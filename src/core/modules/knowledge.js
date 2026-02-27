/**
 * KnowledgeModule - scholar research pipeline
 *
 * Flow:
 *   MW finds clue → clue added to knowledge.clues (status: 'perceived')
 *   KNOWLEDGE phase each day:
 *     1. Auto-assign pending clues to activeResearch if scholars are idle
 *     2. Tick progress on all activeResearch
 *     3. Complete research that hits 0 days remaining
 *
 * Scholar bonuses:
 *   - Mind bonus: each point above 3 adds config.research.mindBonusPerPoint daily progress
 *   - Collaboration: 2 scholars +35%, 3+ scholars +50% (config-tunable)
 *   - Pass/fail, never misinterpret
 *
 * Intel types:
 *   - creature_field_notes: MW observations, 1-2 days, feeds compendium via recordSighting()
 *   - lore_fragment: MW finds, 1-3 days, trait hint or dead end
 *   - creature_remains: battle findings, 2-3 days, confirms trait or reveals base stats
 *   - sealed_knowledge: unique find, 5+ days, reveals all traits of one creature type
 *   - ancient_technique: unique find, 5 days, grants unique combat ability
 *   - structure_blueprint: unique find, 3 days, unlocks new buildable structure
 */

import CreaturesModule from './creatures.js?v=5z';

// Artifact stat pool — when an artifact is identified, it gets random stats from here
const ARTIFACT_TEMPLATES = [
  { statBonuses: { body: 0, mind: 2, spirit: 0 }, special: '+1 research speed' },
  { statBonuses: { body: 2, mind: 0, spirit: 0 }, special: '+20% garrison defense' },
  { statBonuses: { body: 0, mind: 0, spirit: 2 }, special: 'Reveals hidden natures' },
  { statBonuses: { body: 1, mind: 1, spirit: 0 }, special: '25% faster injury recovery' },
  { statBonuses: { body: 0, mind: 3, spirit: 0 }, special: 'Research insight bonus' },
  { statBonuses: { body: 0, mind: 1, spirit: 2 }, special: 'MW discovers 30% more' },
  { statBonuses: { body: 1, mind: 0, spirit: 1 }, special: '+10% perimeter stability' },
  { statBonuses: { body: 2, mind: 1, spirit: 0 }, special: '+1 trap damage' },
  { statBonuses: { body: 0, mind: 0, spirit: 3 }, special: 'Priest prayer strength +15%' },
  { statBonuses: { body: 3, mind: 0, spirit: 0 }, special: 'Soldier combat power +20%' },
];

const KnowledgeModule = {
  initialize(config, state) {
    // Knowledge already initialized
  },

  processCommands(commands, state, config, rng, notifications) {
    return [];
  },

  /**
   * KNOWLEDGE phase: auto-assign clues, advance research, complete research
   */
  update(state, rng, config, notifications) {
    const researchConfig = config.research || {
      baseDecodeDays: 3,
      collaborationBonus2: 0.35,
      collaborationBonus3: 0.50,
      mindBonusPerPoint: 0.5,
    };

    // Scholars in the library don't contribute to clue research
    const libraryStates = state.library?.scholarStates || {};
    const activeScholars = state.population.characters.filter(
      c => c.role === 'scholar' && c.assignment === 'researching' && c.health === 'active'
        && !libraryStates[c.id]?.currentActivity
    );

    // --- Step 1: Assign scholars to clues from the queue (1 scholar per clue, priority order) ---
    if (activeScholars.length > 0 && state.knowledge.clues.length > 0) {
      const pendingClues = state.knowledge.clues.filter(c => c.status === 'perceived');

      // Each scholar gets their own clue based on priority (1st scholar → 1st clue, etc.)
      // Only assign if that clue isn't already being researched
      const activeIds = new Set(state.knowledge.activeResearch.map(r => r.id));

      for (let i = 0; i < activeScholars.length; i++) {
        const scholar = activeScholars[i];
        // Skip if this scholar already has an active research item
        const alreadyAssigned = state.knowledge.activeResearch.find(r => r.assignedScholarId === scholar.id);
        if (alreadyAssigned) continue;

        // Find next unassigned clue
        const availableClue = pendingClues.find(c => !activeIds.has(c.id));
        if (!availableClue) break;

        // Move from clues to activeResearch
        state.knowledge.clues = state.knowledge.clues.filter(c => c.id !== availableClue.id);
        activeIds.add(availableClue.id);

        const duration = this.getResearchDuration(availableClue.id, availableClue.ring, state, researchConfig, rng);

        state.knowledge.activeResearch.push({
          id: availableClue.id,
          name: availableClue.name || 'Unknown Clue',
          source: availableClue.source || 'Unknown',
          ring: availableClue.ring || 0,
          duration,
          daysRemaining: duration,
          progress: 0,
          startDay: state.time.day,
          creatureTypeId: availableClue.creatureTypeId || null,
          assignedScholarId: scholar.id,
        });

        notifications.push({
          type: 'RESEARCH_STARTED',
          clueName: availableClue.name,
          classification: 'routine',
          message: `${scholar.name} began decoding "${availableClue.name}"`,
        });
      }
    }

    // --- Step 2: Tick progress on active research (each scholar works independently) ---
    if (state.knowledge.activeResearch.length === 0) return;

    const completedIds = [];

    for (const research of state.knowledge.activeResearch) {
      // Find the assigned scholar
      const scholar = activeScholars.find(s => s.id === research.assignedScholarId);
      if (!scholar) continue; // Scholar unavailable — no progress

      // Individual scholar progress: base 1 + mind bonus
      const mindBonus = Math.max(0, scholar.mind - 2) * researchConfig.mindBonusPerPoint;
      const dailyProgress = 1 + mindBonus;

      research.daysRemaining = Math.max(0, research.daysRemaining - dailyProgress);
      research.progress = research.duration - research.daysRemaining;

      if (research.daysRemaining <= 0) {
        completedIds.push(research.id);
      }
    }

    // --- Step 3: Complete finished research ---
    for (const id of completedIds) {
      const research = state.knowledge.activeResearch.find(r => r.id === id);
      if (!research) continue;

      // Determine what the decoded knowledge yields based on type
      const result = this.resolveResearch(research, state, rng);

      state.knowledge.completed.push({
        id: research.id,
        name: research.name,
        source: research.source,
        ring: research.ring,
        completedDay: state.time.day,
        description: result.description,
        effect: result.effect,
      });

      // Apply mechanical effect if any
      if (result.apply) {
        result.apply(state);
      }

      state.knowledge.activeResearch = state.knowledge.activeResearch.filter(
        r => r.id !== id
      );

      // Determine notification classification based on result effect
      let classification = 'notable';
      if (result.effect && (result.effect.startsWith('sealed_') || result.effect.includes('unlocked'))) {
        classification = 'critical';
      }

      notifications.push({
        type: 'RESEARCH_COMPLETE',
        researchId: research.id,
        researchName: research.name,
        classification,
        message: `${research.assignedScholarId ? (activeScholars.find(s => s.id === research.assignedScholarId)?.name || 'Scholar') : 'Scholars'} decoded "${research.name}" \u2014 ${result.description}`,
      });

      // Award category XP to the assigned scholar only
      // Map research type to specialization category
      const researchId = research.id || '';
      let xpCategory = 'lore'; // default
      if (researchId.startsWith('nature_') || researchId.startsWith('creature_')) xpCategory = 'essences';
      else if (researchId.startsWith('map_') || researchId.startsWith('trail_')) xpCategory = 'maps';
      else if (researchId.startsWith('herb_') || researchId.startsWith('plant_')) xpCategory = 'herbs';
      else if (researchId.startsWith('artifact_') || researchId.startsWith('relic_')) xpCategory = 'artifacts';
      // lore_, source_, clue_, sealed_, unique_ all default to 'lore'

      // Ensure library state structure exists
      if (!state.library) state.library = { scholarStates: {}, unlockedAbilities: [] };
      if (!state.library.scholarStates) state.library.scholarStates = {};

      // Find the single assigned scholar for this research
      const assignedScholar = activeScholars.find(s => s.id === research.assignedScholarId);
      if (assignedScholar) {
        if (!state.library.scholarStates[assignedScholar.id]) {
          state.library.scholarStates[assignedScholar.id] = {
            knownLanguages: ['common'],
            currentActivity: null,
            currentBook: null,
            unreadBooks: [],
            needsLanguage: [],
            deadEnds: [],
            studiedBooks: [],
            studyPreferences: { lore: true, maps: true, artifacts: true, herbs: true, essences: true },
            categoryXp: { lore: 0, maps: 0, artifacts: 0, herbs: 0, essences: 0 },
          };
        }
        const ss = state.library.scholarStates[assignedScholar.id];
        if (!ss.categoryXp) ss.categoryXp = { lore: 0, maps: 0, artifacts: 0, herbs: 0, essences: 0 };
        ss.categoryXp[xpCategory] = (ss.categoryXp[xpCategory] || 0) + 1;
      }
    }
  },

  /**
   * Determine research duration based on finding type
   * Per design spec: clue 2-3d, lore 3-6d, source_clue 5-7d (accelerates), nature 2-3d
   * New types: creature_field_notes 1-2d, lore_fragment 1-3d, creature_remains 2-3d
   * Unique finds: sealed_knowledge 5+d, ancient_technique 5d, structure_blueprint 3d
   */
  getResearchDuration(clueId, ring, state, config, rng) {
    const id = clueId || '';
    const base = config.baseDecodeDays || 3;

    if (id.startsWith('source_')) {
      // Source clues: 5-7 days, accelerates with each decoded source clue
      const decoded = (state.knowledge.completed || []).filter(c => c.id && c.id.startsWith('source_')).length;
      return Math.max(3, 7 - decoded); // 7 → 6 → 5 → 4 → 3 min
    }
    if (id.startsWith('lore_')) {
      // Lore: 3-6 days, longer for deeper rings
      return 3 + Math.min(ring, 3);
    }
    if (id.startsWith('lore_fragment_')) {
      // MW lore finds: 1-3 days
      return 1 + Math.min(ring, 2);
    }
    if (id.startsWith('creature_field_notes_')) {
      // MW field observations: 1-2 days
      return 1 + (ring > 1 ? 1 : 0);
    }
    if (id.startsWith('creature_remains_')) {
      // Battle remains: 2-3 days
      return 2 + (ring > 1 ? 1 : 0);
    }
    if (id.startsWith('nature_')) {
      // Nature hints: 2-3 days
      return 2 + (ring > 1 ? 1 : 0);
    }
    if (id.startsWith('clue_')) {
      // General clues: 2-3 days
      return 2 + (ring > 2 ? 1 : 0);
    }
    if (id.startsWith('artifact_')) {
      // Artifacts: 3-5 days to identify
      return 3 + Math.min(ring, 2);
    }
    if (id.startsWith('unique_sealed_knowledge_')) {
      // Sealed knowledge tome: 5+ days (7 base)
      return 7;
    }
    if (id.startsWith('unique_ancient_technique_')) {
      // Ancient technique: 5 days
      return 5;
    }
    if (id.startsWith('unique_structure_blueprint_')) {
      // Structure blueprint: 3 days
      return 3;
    }
    if (id.startsWith('archive_')) {
      return base;
    }
    return base;
  },

  /**
   * Determine what a completed research yields
   */
  resolveResearch(research, state, rng) {
    const id = research.id || '';
    const source = research.source || '';

    // Creature field notes — MW observations feed compendium
    if (id.startsWith('creature_field_notes_')) {
      const creatureTypeId = research.creatureTypeId;
      if (creatureTypeId) {
        CreaturesModule.recordSighting(state, creatureTypeId, state.time.day, 'field_notes');
      }
      return {
        description: 'Scholar recorded MW field observations in the creature compendium',
        effect: 'creature_knowledge',
        apply: (s) => { /* compendium updated via recordSighting */ },
      };
    }

    // Lore fragment — MW finds, trait hint or dead end
    if (id.startsWith('lore_fragment_')) {
      const creatureTypeId = research.creatureTypeId;
      const outcomes = [
        {
          description: 'Text reveals the creature\'s elemental nature',
          effect: 'vector_hint',
          apply: (s) => {
            if (creatureTypeId) {
              const creatureType = (s.creatures?.types || []).find(c => c.id === creatureTypeId);
              if (creatureType) {
                const entry = CreaturesModule.getCompendiumEntry(s, creatureTypeId);
                entry.discovered = true;
                entry.name = creatureType.name;
                entry.vectorKnown = true;
                entry.vectorId = creatureType.vectorId;
                if (s.vectors && !s.vectors.known.includes(creatureType.vectorId)) {
                  s.vectors.known.push(creatureType.vectorId);
                }
              }
            }
          },
        },
        {
          description: 'Fragment proved to be ancient folklore — no actionable intel',
          effect: 'dead_end',
          apply: (s) => { /* no effect, just knowledge gained */ },
        },
      ];
      return outcomes[rng.randInt(0, outcomes.length - 1)];
    }

    // Creature remains — battle findings, confirms trait or reveals base stats
    if (id.startsWith('creature_remains_')) {
      const creatureTypeId = research.creatureTypeId;
      const outcomes = [
        {
          description: 'Analysis reveals the creature\'s Vector alignment',
          effect: 'vector_revealed',
          apply: (s) => {
            if (creatureTypeId) {
              const creatureType = (s.creatures?.types || []).find(c => c.id === creatureTypeId);
              if (creatureType) {
                const entry = CreaturesModule.getCompendiumEntry(s, creatureTypeId);
                entry.discovered = true;
                entry.name = creatureType.name;
                entry.vectorKnown = true;
                entry.vectorId = creatureType.vectorId;
                if (s.vectors && !s.vectors.known.includes(creatureType.vectorId)) {
                  s.vectors.known.push(creatureType.vectorId);
                }
              }
            }
          },
        },
        {
          description: 'Specimen reveals the creature\'s offensive capability',
          effect: 'offense_learned',
          apply: (s) => {
            if (creatureTypeId) {
              const creatureType = (s.creatures?.types || []).find(c => c.id === creatureTypeId);
              if (creatureType) {
                const entry = CreaturesModule.getCompendiumEntry(s, creatureTypeId);
                entry.discovered = true;
                entry.name = creatureType.name;
                entry.offenseKnown = true;
                entry.offense = creatureType.offense;
              }
            }
          },
        },
      ];
      return outcomes[rng.randInt(0, outcomes.length - 1)];
    }

    // Unique finds — sealed knowledge, ancient technique, structure blueprint
    if (id.startsWith('unique_sealed_knowledge_')) {
      const creatureTypeId = research.creatureTypeId;
      return {
        description: 'The tome unlocks — full creature profile revealed!',
        effect: 'sealed_knowledge_unlocked',
        apply: (s) => {
          if (creatureTypeId) {
            CreaturesModule.recordCombatEncounter(s, creatureTypeId, s.time.day, 'research');
          }
          // Mark unique find as analyzed
          const uniqueFind = (s.knowledge.uniqueFinds || []).find(u => u.id === id);
          if (uniqueFind) {
            uniqueFind.analyzedDay = s.time.day;
          }
        },
      };
    }

    if (id.startsWith('unique_ancient_technique_')) {
      return {
        description: 'The tablet revealed a lost combat technique — gains new ability!',
        effect: 'technique_unlocked',
        apply: (s) => {
          // Mark unique find as analyzed
          const uniqueFind = (s.knowledge.uniqueFinds || []).find(u => u.id === id);
          if (uniqueFind) {
            uniqueFind.analyzedDay = s.time.day;
          }
          // TODO: grant actual combat ability in a future expansion
        },
      };
    }

    if (id.startsWith('unique_structure_blueprint_')) {
      return {
        description: 'Blueprints decoded — a new structure type is now buildable!',
        effect: 'structure_unlocked',
        apply: (s) => {
          // Mark unique find as analyzed
          const uniqueFind = (s.knowledge.uniqueFinds || []).find(u => u.id === id);
          if (uniqueFind) {
            uniqueFind.analyzedDay = s.time.day;
          }
          // TODO: unlock actual structure in a future expansion
        },
      };
    }

    // Source clues — the big ones, decode Source weaknesses
    if (id.startsWith('source_')) {
      const decodedCount = (state.knowledge.completed || []).filter(c => c.id && c.id.startsWith('source_')).length;
      const descriptions = [
        'Decoded a fragment of the Source\'s outer defenses',
        'Cross-referenced with prior clues \u2014 a weakness identified',
        'Pattern analysis reveals a phase transition mechanic',
        'Deep analysis exposes a vulnerability in the Source\'s shell',
        'Multiple clues converge \u2014 critical intelligence unlocked',
      ];
      return {
        description: descriptions[Math.min(decodedCount, descriptions.length - 1)],
        effect: 'source_intelligence',
        apply: (s) => {
          s.knowledge.sourceClues = (s.knowledge.sourceClues || 0) + 1;
        },
      };
    }

    // Nature hints reveal information about deeper rings
    if (id.startsWith('nature_')) {
      return {
        description: 'Scholars decoded mist patterns — deeper ring nature catalogued',
        effect: 'mist_insight',
        apply: (s) => {
          // Track how many nature insights have been decoded
          if (!s.knowledge.mistInsights) s.knowledge.mistInsights = 0;
          s.knowledge.mistInsights += 1;
        },
      };
    }

    // Lore produces various useful knowledge
    if (id.startsWith('lore_')) {
      const outcomes = [
        {
          description: 'Ancient records hint at defensive techniques',
          effect: 'defense_knowledge',
          apply: (s) => { /* future: unlock recipe or buff */ },
        },
        {
          description: 'Text describes mist behavior patterns',
          effect: 'mist_knowledge',
          apply: (s) => { /* future: unlock nature info */ },
        },
        {
          description: 'Writings reference lost monastery methods',
          effect: 'general_knowledge',
          apply: (s) => { /* future: unlock facility or upgrade */ },
        },
        {
          description: 'Recovered a crafting recipe from the old texts',
          effect: 'recipe_knowledge',
          apply: (s) => { /* future: unlock recipe */ },
        },
      ];
      return outcomes[rng.randInt(0, outcomes.length - 1)];
    }

    // Exploration clues yield map progress
    if (id.startsWith('clue_')) {
      return {
        description: 'Cartographic data assembled \u2014 map fragment gained',
        effect: 'map_fragment',
        apply: (s) => { s.knowledge.mapFragments = (s.knowledge.mapFragments || 0) + 1; },
      };
    }

    // Artifacts — identify and reveal stats/special
    if (id.startsWith('artifact_')) {
      const template = ARTIFACT_TEMPLATES[rng.randInt(0, ARTIFACT_TEMPLATES.length - 1)];
      const bonusStr = Object.entries(template.statBonuses)
        .filter(([, v]) => v > 0)
        .map(([k, v]) => `+${v} ${k.charAt(0).toUpperCase() + k.slice(1)}`)
        .join(', ');

      return {
        description: `Identified: ${bonusStr}. ${template.special}`,
        effect: 'artifact_identified',
        apply: (s) => {
          // Find the artifact in knowledge.artifacts and mark it identified
          const artifact = (s.knowledge.artifacts || []).find(a => a.id === id);
          if (artifact) {
            artifact.status = 'interpreted';
            artifact.identified = true;
            artifact.identifiedDay = s.time.day;
            artifact.statBonuses = { ...template.statBonuses };
            artifact.special = template.special;
            artifact.description = `${bonusStr}. ${template.special}`;
          }
        },
      };
    }

    // Archive (starting clue) — general foundational knowledge
    if (id.startsWith('archive_')) {
      return {
        description: 'Foundational monastery records catalogued',
        effect: 'archive_knowledge',
        apply: (s) => { /* establishes baseline knowledge */ },
      };
    }

    // Fallback
    return {
      description: 'Knowledge gained',
      effect: 'general',
      apply: () => {},
    };
  },

  // ─── Command Handlers (extracted from engine.executeCommand) ───

  /**
   * CANCEL_RESEARCH — return active research to the pending clue queue
   * Extracted from engine.js lines 255-275
   */
  handleCancelResearch(state, command, notifications) {
    const researchIdx = state.knowledge.activeResearch.findIndex(r => r.id === command.researchId);
    if (researchIdx !== -1) {
      const research = state.knowledge.activeResearch[researchIdx];
      // Return the clue to the pending queue
      state.knowledge.clues.push({
        id: research.id,
        name: research.name,
        source: research.source,
        ring: research.ring,
        day: research.startDay,
        status: 'perceived',
      });
      state.knowledge.activeResearch.splice(researchIdx, 1);
      notifications.push({
        type: 'RESEARCH_CANCELLED',
        classification: 'routine',
        message: `Research on "${research.name}" cancelled — returned to queue`,
      });
    }
  },

  /**
   * REORDER_RESEARCH — move clue up/down in queue, including swap-with-active path
   * Extracted from engine.js lines 277-328
   *
   * Edge cases preserved:
   *   - "up" at position 0 with active research → swap: demote active, promote clue
   *   - "down" at last position → no-op
   *   - config.research.baseDecodeDays used for new active research duration
   */
  handleReorderResearch(state, command, config, notifications) {
    const pendingClues = state.knowledge.clues.filter(c => c.status === 'perceived');
    const otherClues = state.knowledge.clues.filter(c => c.status !== 'perceived');
    const idx = pendingClues.findIndex(c => c.id === command.clueId);

    if (idx !== -1) {
      if (command.direction === 'up') {
        if (idx === 0 && state.knowledge.activeResearch.length > 0) {
          // Already at top of queue — swap with active research
          const active = state.knowledge.activeResearch[0];
          const clue = pendingClues[idx];

          // Return active research to queue at position 0 (where promoted clue was)
          pendingClues[idx] = {
            id: active.id,
            name: active.name,
            source: active.source,
            ring: active.ring,
            day: active.startDay,
            status: 'perceived',
          };

          // Start the promoted clue as active research
          state.knowledge.activeResearch = [{
            id: clue.id,
            name: clue.name,
            source: clue.source,
            ring: clue.ring,
            duration: config.research.baseDecodeDays,
            daysRemaining: config.research.baseDecodeDays,
            progress: 0,
            startDay: state.time.day,
          }];

          notifications.push({
            type: 'RESEARCH_PRIORITIZED',
            classification: 'routine',
            message: `Scholars switched to "${clue.name}" — "${active.name}" returned to queue`,
          });
        } else if (idx > 0) {
          // Swap with item above
          [pendingClues[idx - 1], pendingClues[idx]] = [pendingClues[idx], pendingClues[idx - 1]];
        }
      } else if (command.direction === 'down' && idx < pendingClues.length - 1) {
        // Swap with item below
        [pendingClues[idx + 1], pendingClues[idx]] = [pendingClues[idx], pendingClues[idx + 1]];
      }

      state.knowledge.clues = [...otherClues, ...pendingClues];
    }
  },

  /**
   * EQUIP — attach identified artifact to character, add stat modifiers
   * Extracted from engine.js lines 330-350
   */
  handleEquip(state, command, notifications) {
    const artifact = (state.knowledge.artifacts || []).find(a => a.id === command.itemId);
    const char = state.population.characters.find(c => c.id === command.characterId);
    if (artifact && char && artifact.identified && !artifact.equippedTo) {
      artifact.equippedTo = char.id;
      // Add to character's modifiers
      if (!char.modifiers) char.modifiers = [];
      char.modifiers.push({
        type: 'artifact',
        artifactId: artifact.id,
        name: artifact.name,
        statBonuses: { ...artifact.statBonuses },
        special: artifact.special,
      });
      notifications.push({
        type: 'ARTIFACT_EQUIPPED',
        classification: 'routine',
        message: `${char.name} equipped "${artifact.name}"`,
      });
    }
  },

  /**
   * UNEQUIP — remove artifact from character, strip stat modifiers
   * Extracted from engine.js lines 352-367
   */
  handleUnequip(state, command, notifications) {
    const artifact = (state.knowledge.artifacts || []).find(a => a.id === command.itemId);
    if (artifact && artifact.equippedTo) {
      const char = state.population.characters.find(c => c.id === artifact.equippedTo);
      if (char && char.modifiers) {
        char.modifiers = char.modifiers.filter(m => m.artifactId !== artifact.id);
      }
      const oldOwner = char ? char.name : 'someone';
      artifact.equippedTo = null;
      notifications.push({
        type: 'ARTIFACT_UNEQUIPPED',
        classification: 'routine',
        message: `"${artifact.name}" unequipped from ${oldOwner}`,
      });
    }
  },

  getState(state) {
    return {
      researchQueue: state.knowledge.researchQueue.map(r => ({ ...r })),
      activeResearch: state.knowledge.activeResearch.map(r => ({ ...r })),
      completed: state.knowledge.completed.map(r => ({ ...r })),
      clues: [...state.knowledge.clues],
      mapFragments: state.knowledge.mapFragments,
      sourceClues: state.knowledge.sourceClues,
      uniqueFinds: (state.knowledge.uniqueFinds || []).map(u => ({ ...u })),
    };
  },
};

export default KnowledgeModule;
