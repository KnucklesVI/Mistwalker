/**
 * ExplorationModule - MW scouting, exploration, and expeditions
 *
 * Trip model:
 *   Player picks ring + total days away (min = ring travel days, max = MW range).
 *   Transit days = travelDays - 1 (arrival day counts as first explore day).
 *   Explore rolls = totalDays - travelDays + 1.
 *   Return is free — MW comes home instantly when explore days run out.
 *
 * Scouting model:
 *   MW goes out for 1 day to scout an incoming raid.
 *   Reveals: creature name, size, exact count, exact days away, trait descriptions.
 *   Grants 10% defense bonus for that raid (intel advantage).
 */

import CreaturesModule from './creatures.js?v=5z';
import PressureModule from './pressure.js?v=5z';

// NOTE: 100% find rate for alpha testing — all types represented.
// Design spec values: nothing 50, map 15, clue 10, location 8, herbs 7, lore 5, nature 3, artifact 2
const FINDINGS_TABLE_RING1 = [
  { value: 'clue', weight: 15 },
  { value: 'lore', weight: 10 },
  { value: 'lore_fragment', weight: 5 },  // MW field finds — trait hints
  { value: 'source_clue', weight: 5 },
  { value: 'nature_hint', weight: 10 },
  { value: 'map_fragment', weight: 12 },
  { value: 'artifact', weight: 10 },
  { value: 'herbs_or_cache', weight: 8 },
  { value: 'essence', weight: 8 },
  { value: 'minor_location', weight: 5 },
  { value: 'lost_person', weight: 5 },
  { value: 'encounter', weight: 7 },
  { value: 'creature_sighting', weight: 6 },      // saw creatures at distance
  { value: 'creature_combat', weight: 3 },        // fought a creature
  { value: 'creature_signs', weight: 4 },         // found tracks/nests
];

const ExplorationModule = {
  initialize(config, state) {
    // Exploration already initialized
  },

  processCommands(commands, state, config, rng, notifications) {
    const processed = [];

    for (const cmd of commands) {
      switch (cmd.type) {
        case 'SEND_MW':
          processed.push(this.handleSendMW(state, cmd, config, notifications));
          break;
        case 'CANCEL_MW':
          processed.push(this.handleCancelMW(state, cmd, notifications));
          break;
        case 'SCOUT_RAID':
          processed.push(this.handleScoutRaid(state, cmd, config, notifications));
          break;
      }
    }

    return processed;
  },

  handleSendMW(state, cmd, config, notifications) {
    const mw = state.population.characters.find(c => c.role === 'mistwalker');
    if (!mw) return { type: 'SEND_MW', success: false };

    const ring = cmd.ring;
    const totalDays = cmd.totalDays || 1;
    const travelDays = config.exploration.ringTravelDays[ring - 1];
    const transitDays = travelDays - 1; // days before arrival (arrival day = first explore day)
    const exploreDays = totalDays - travelDays + 1;

    // If transit is 0 (Ring 1), start exploring immediately
    const startStatus = transitDays > 0 ? 'traveling_out' : 'exploring';

    state.exploration.mwState = {
      status: startStatus,
      ring,
      daysOut: 0,
      daysRemaining: transitDays, // only used during traveling_out
      exploreDaysLeft: exploreDays,
      totalDays,
      departDay: state.time.day,
      findings: [],
    };

    if (startStatus === 'exploring') {
      notifications.push({
        type: 'MW_ARRIVED',
        ring,
        message: 'The Mistwalker ventured into the mist',
      });
    }

    notifications.push({
      type: 'MW_SENT',
      ring,
      totalDays,
      exploreDays,
      mwName: mw.name,
    });

    return { type: 'SEND_MW', success: true, ring };
  },

  handleCancelMW(state, cmd, notifications) {
    const mwState = state.exploration.mwState;

    // Can only cancel on the same day they departed
    if (mwState.status === 'home' || mwState.departDay !== state.time.day) {
      return { type: 'CANCEL_MW', success: false };
    }

    // Silent undo — just reset to home, no notification
    state.exploration.mwState = {
      status: 'home',
      ring: null,
      daysOut: 0,
      daysRemaining: 0,
      findings: [],
    };

    return { type: 'CANCEL_MW', success: true };
  },

  handleScoutRaid(state, cmd, config, notifications) {
    const mw = state.population.characters.find(c => c.role === 'mistwalker');
    if (!mw) return { type: 'SCOUT_RAID', success: false };

    const raid = state.mist.raidQueue.find(r => r.id === cmd.raidId);
    if (!raid || raid.status !== 'incoming' || raid.scouted) {
      return { type: 'SCOUT_RAID', success: false };
    }

    // MW goes scouting for 1 day
    state.exploration.mwState = {
      status: 'scouting',
      ring: null,
      daysOut: 0,
      daysRemaining: 1,       // scouting takes exactly 1 day
      scoutTargetRaidId: raid.id,
      departDay: state.time.day,
      findings: [],
    };

    notifications.push({
      type: 'MW_SCOUT_SENT',
      raidId: raid.id,
      mwName: mw.name,
      message: `${mw.name} headed out to scout the approaching threat`,
      classification: 'notable',
    });

    return { type: 'SCOUT_RAID', success: true };
  },

  handleRescue(state, cmd, config, notifications) {
    const mw = state.population.characters.find(c => c.role === 'mistwalker');
    if (!mw) return { type: 'RESCUE_LOST', success: false };

    const target = state.population.characters.find(c => c.id === cmd.characterId);
    if (!target || target.health !== 'lost') return { type: 'RESCUE_LOST', success: false };

    const rescueConfig = config.rescue || { baseDays: 2 };

    state.exploration.mwState = {
      status: 'rescuing',
      ring: null,
      daysOut: 0,
      daysRemaining: rescueConfig.baseDays,
      rescueTargetId: target.id,
      rescueTargetName: target.name,
      departDay: state.time.day,
      findings: [],
    };

    notifications.push({
      type: 'MW_RESCUE_SENT',
      targetName: target.name,
      message: `Mistwalker went into the mist to search for ${target.name}`,
      classification: 'notable',
    });

    return { type: 'RESCUE_LOST', success: true };
  },

  handleSendExpedition(state, cmd, config, rng, notifications) {
    const mw = state.population.characters.find(c => c.role === 'mistwalker');
    if (!mw) return { type: 'SEND_EXPEDITION', success: false };

    const expConfig = config.expedition || {};
    const location = state.exploration.locations.minor.find(l => l.id === cmd.locationId);
    if (!location) return { type: 'SEND_EXPEDITION', success: false };

    // Find priest in members for capacity calc
    const members = cmd.members.map(id => state.population.characters.find(c => c.id === id)).filter(Boolean);
    const priest = members.find(c => c.role === 'priest');
    if (!priest) return { type: 'SEND_EXPEDITION', success: false };

    // Calculate party capacity and MW range
    const capacity = priest.spirit + (priest.modifiers || []).reduce((sum, m) => sum + (m.statBonuses?.spirit || 0), 0);
    const mwSpirit = mw.spirit + (mw.modifiers || []).reduce((sum, m) => sum + (m.statBonuses?.spirit || 0), 0);
    const mwRange = expConfig.mwRangeBySpirit?.[mwSpirit] || 5;
    const travelDays = config.exploration.ringTravelDays[location.ring - 1] || 1;
    const maxDaysAtSite = mwRange - (travelDays * 2);
    const daysAtSite = Math.min(cmd.daysAtSite || 1, maxDaysAtSite);

    if (members.length > capacity) return { type: 'SEND_EXPEDITION', success: false };
    if (daysAtSite < 1) return { type: 'SEND_EXPEDITION', success: false };

    // Mark all members as on expedition
    for (const member of members) {
      member.assignment = 'expedition';
    }

    // Set MW as on expedition too (blocks solo exploration)
    state.exploration.mwState = {
      status: 'expedition',
      ring: location.ring,
      daysOut: 0,
      daysRemaining: 0,
      findings: [],
    };

    // Create expedition state
    state.exploration.activeExpedition = {
      id: `exp_${state.time.day}_${rng.randInt(0, 99999)}`,
      locationId: location.id,
      locationName: location.name,
      locationType: location.type,
      locationRing: location.ring,
      members: cmd.members,
      priestId: priest.id,
      capacity,
      mwRange,
      travelDays,
      travelDaysRemaining: travelDays,
      daysAtSite: 0,
      daysAtSiteTotal: daysAtSite,
      status: 'traveling',
      departDay: state.time.day,
      challenges: JSON.parse(JSON.stringify(location.challenges || [])),
      rewards: JSON.parse(JSON.stringify(location.rewards || {})),
      dangerLevel: location.dangerLevel || 1,
      haulingRequired: location.haulingRequired || false,
      harvestedResources: {},
      resolvedChallenges: [],
      log: [],
    };

    const memberNames = members.map(m => m.name).join(', ');
    notifications.push({
      type: 'EXPEDITION_SENT',
      locationName: location.name,
      message: `Expedition departed for ${location.name} (${memberNames})`,
      classification: 'notable',
    });

    return { type: 'SEND_EXPEDITION', success: true };
  },

  handleCancelExpedition(state, cmd, notifications) {
    const exp = state.exploration.activeExpedition;
    if (!exp || exp.departDay !== state.time.day) {
      return { type: 'CANCEL_EXPEDITION', success: false };
    }

    // Free all members
    for (const memberId of exp.members) {
      const char = state.population.characters.find(c => c.id === memberId);
      if (char) char.assignment = 'available';
    }

    // Reset MW
    state.exploration.mwState = {
      status: 'home', ring: null, daysOut: 0, daysRemaining: 0, findings: [],
    };

    state.exploration.activeExpedition = null;

    notifications.push({
      type: 'EXPEDITION_CANCELLED',
      message: 'Expedition recalled before departure',
      classification: 'routine',
    });

    return { type: 'CANCEL_EXPEDITION', success: true };
  },

  /**
   * Update active expedition (travel → work → return)
   */
  updateExpedition(state, rng, config, notifications) {
    const exp = state.exploration.activeExpedition;
    if (!exp) return;

    const expConfig = config.expedition || {};

    // Phase: Traveling to site
    if (exp.status === 'traveling') {
      exp.travelDaysRemaining -= 1;
      if (exp.travelDaysRemaining <= 0) {
        exp.status = 'working';
        notifications.push({
          type: 'EXPEDITION_ARRIVED',
          locationName: exp.locationName,
          message: `Expedition arrived at ${exp.locationName}`,
          classification: 'notable',
        });
      }
      return;
    }

    // Phase: Working at site
    if (exp.status === 'working') {
      exp.daysAtSite += 1;

      // Resolve challenges that haven't been completed yet
      const chars = state.population.characters;
      for (const challenge of exp.challenges) {
        if (exp.resolvedChallenges.includes(challenge.id)) continue;

        const roleNeeded = expConfig.challengeRoles?.[challenge.type];
        const statNeeded = expConfig.challengeStats?.[challenge.type] || 'mind';
        const solver = exp.members
          .map(id => chars.find(c => c.id === id))
          .filter(Boolean)
          .find(c => c.role === roleNeeded && c.health === 'active');

        if (!solver) {
          // No one with the right role — skip this challenge
          if (challenge.required) {
            exp.log.push(`Day ${state.time.day}: No ${roleNeeded} to attempt "${challenge.name}"`);
          }
          continue;
        }

        // Roll for success
        const difficulty = challenge.difficulty || 2;
        const baseRate = expConfig.challengeBaseRates?.[difficulty - 1] || 0.5;
        const statValue = solver[statNeeded] || 2;
        const statBonus = Math.max(0, (statValue - 2) * (expConfig.challengeStatBonus || 0.15));
        const successChance = Math.min(0.95, baseRate + statBonus);

        if (rng.chance(successChance)) {
          exp.resolvedChallenges.push(challenge.id);
          exp.log.push(`Day ${state.time.day}: ${solver.name} resolved "${challenge.name}"`);
          notifications.push({
            type: 'EXPEDITION_CHALLENGE_RESOLVED',
            challengeName: challenge.name,
            solverName: solver.name,
            message: `${solver.name} overcame "${challenge.name}" at ${exp.locationName}`,
            classification: 'routine',
          });
        } else {
          exp.log.push(`Day ${state.time.day}: ${solver.name} failed "${challenge.name}" — will retry`);
        }
      }

      // Check if all required challenges are resolved — if so, haul resources
      const allRequiredDone = exp.challenges
        .filter(c => c.required)
        .every(c => exp.resolvedChallenges.includes(c.id));

      if (allRequiredDone) {
        // Hauling: workers (and others) collect resources
        const workers = exp.members
          .map(id => chars.find(c => c.id === id))
          .filter(c => c && c.health === 'active' && c.role !== 'mistwalker' && c.role !== 'priest');

        let dailyHaul = 0;
        for (const w of workers) {
          if (w.role === 'worker') dailyHaul += (expConfig.haulPerWorkerPerDay || 2);
          else if (w.role === 'scholar') dailyHaul += (expConfig.haulScholarPerDay || 0);
          else dailyHaul += (expConfig.haulPerOtherPerDay || 1);
        }

        // Distribute haul across reward types
        for (const [resource, range] of Object.entries(exp.rewards)) {
          if (resource === 'clues' || resource === 'essences') continue; // handled differently
          const maxAvailable = range.max || 0;
          const current = exp.harvestedResources[resource] || 0;
          const toHaul = Math.min(dailyHaul, maxAvailable - current);
          if (toHaul > 0) {
            exp.harvestedResources[resource] = current + toHaul;
          }
        }

        // Clues: scholar generates them (not hauled)
        if (exp.rewards.clues) {
          const scholar = exp.members
            .map(id => chars.find(c => c.id === id))
            .filter(Boolean)
            .find(c => c.role === 'scholar' && c.health === 'active');
          if (scholar) {
            const cluesCurrent = exp.harvestedResources.clues || 0;
            if (cluesCurrent < (exp.rewards.clues.max || 0)) {
              exp.harvestedResources.clues = cluesCurrent + 1;
            }
          }
        }

        // Essences: priest collects them
        if (exp.rewards.essences) {
          const essenceCurrent = exp.harvestedResources.essences || 0;
          if (essenceCurrent < (exp.rewards.essences.max || 0)) {
            exp.harvestedResources.essences = essenceCurrent + 1;
          }
        }
      }

      // Injury risk at dangerous sites
      const injuryRisk = expConfig.injuryRiskPerDay?.[exp.dangerLevel] || 0;
      if (injuryRisk > 0) {
        for (const memberId of exp.members) {
          const char = chars.find(c => c.id === memberId);
          if (char && char.health === 'active' && rng.chance(injuryRisk)) {
            char.health = 'injured';
            char.healingDaysRemaining = rng.randInt(3, 5);
            exp.log.push(`Day ${state.time.day}: ${char.name} was injured at ${exp.locationName}`);
            notifications.push({
              type: 'EXPEDITION_INJURY',
              characterName: char.name,
              message: `${char.name} was injured during the expedition`,
              classification: 'notable',
            });
          }
        }
      }

      // Check if time is up
      if (exp.daysAtSite >= exp.daysAtSiteTotal) {
        exp.status = 'returning';
      }
      return;
    }

    // Phase: Returning home (instant for now — deliver and complete)
    if (exp.status === 'returning') {
      // Deliver harvested resources
      for (const [resource, amount] of Object.entries(exp.harvestedResources)) {
        if (resource === 'clues') {
          // Generate clue findings
          for (let i = 0; i < amount; i++) {
            state.knowledge.clues.push({
              id: `expclue_${state.time.day}_${rng.randInt(0, 99999)}`,
              name: `Text from ${exp.locationName}`,
              source: `Expedition to ${exp.locationName}`,
              ring: exp.locationRing,
              day: state.time.day,
              status: 'perceived',
            });
          }
        } else if (resource === 'essences') {
          if (!state.resources.essences) state.resources.essences = {};
          const eTypes = ['physical', 'crystalline', 'shadow', 'corrosive'];
          for (let i = 0; i < amount; i++) {
            const eType = rng.pick(eTypes);
            state.resources.essences[eType] = (state.resources.essences[eType] || 0) + 1;
          }
        } else if (state.resources[resource] !== undefined) {
          state.resources[resource] += amount;
        }
      }

      // Free all members
      const chars = state.population.characters;
      for (const memberId of exp.members) {
        const char = chars.find(c => c.id === memberId);
        if (char && char.assignment === 'expedition') {
          char.assignment = 'available';
        }
      }

      // Reset MW
      state.exploration.mwState = {
        status: 'home', ring: null, daysOut: 0, daysRemaining: 0, findings: [],
      };

      // Mark location as visited
      const loc = state.exploration.locations.minor.find(l => l.id === exp.locationId);
      if (loc) loc.visited = true;

      // Record in history
      state.exploration.completedExpeditions.push({
        id: exp.id,
        locationId: exp.locationId,
        locationName: exp.locationName,
        departDay: exp.departDay,
        returnDay: state.time.day,
        members: exp.members,
        resourcesReturned: { ...exp.harvestedResources },
        resolvedChallenges: [...exp.resolvedChallenges],
        log: exp.log,
      });

      // Build return message
      const loot = Object.entries(exp.harvestedResources)
        .filter(([, v]) => v > 0)
        .map(([k, v]) => `${v} ${k}`)
        .join(', ');

      notifications.push({
        type: 'EXPEDITION_RETURNED',
        locationName: exp.locationName,
        message: `Expedition returned from ${exp.locationName}${loot ? ` with ${loot}` : ''}`,
        classification: 'notable',
      });

      state.exploration.activeExpedition = null;
    }
  },

  /**
   * EXPLORATION phase: advance MW travel/exploration, generate findings
   */
  update(state, rng, config, notifications) {
    // Update active expedition first
    if (state.exploration.activeExpedition) {
      this.updateExpedition(state, rng, config, notifications);
    }

    const mwState = state.exploration.mwState;

    if (mwState.status === 'home') {
      return;
    }

    // Traveling to the ring (transit phase — only for rings with travel > 1)
    if (mwState.status === 'traveling_out') {
      mwState.daysRemaining -= 1;
      mwState.daysOut += 1;

      if (mwState.daysRemaining <= 0) {
        mwState.status = 'exploring';
        notifications.push({
          type: 'MW_ARRIVED',
          ring: mwState.ring,
          message: 'The Mistwalker arrived at the mist frontier',
        });
      }
      return;
    }

    // Exploring — check return first, then roll
    if (mwState.status === 'exploring') {
      mwState.daysOut += 1;

      // If explore time is up, MW returns home — deliver all findings
      if (mwState.exploreDaysLeft <= 0) {
        const findings = mwState.findings;
        const returnRing = mwState.ring;
        mwState.status = 'home';
        mwState.findings = [];
        mwState.ring = null;
        mwState.daysOut = 0;

        // Deliver findings to state now that MW is home
        this.deliverFindings(findings, returnRing, state, rng, config, notifications);

        notifications.push({
          type: 'MW_RETURNED',
          findingsCount: findings.length,
          message: `Mistwalker returned home with ${findings.length} finding${findings.length !== 1 ? 's' : ''}`,
          classification: 'notable',
        });
        return;
      }

      // Check for unique find (3% per exploration day in ring 1+, up to 3 total)
      const uniqueFindsCount = (state.knowledge?.uniqueFinds || []).length;
      if (mwState.ring >= 1 && uniqueFindsCount < 3 && rng.chance(0.03)) {
        this.generateUniqueFind(state, rng, mwState.ring, notifications);
      }

      // Roll for findings
      const roll = rng.weightedPick(FINDINGS_TABLE_RING1);

      if (roll === 'nothing') {
        notifications.push({
          type: 'EXPLORATION_ROLL',
          result: 'nothing',
          classification: 'routine',
        });
      } else {
        // Store finding details — will be delivered when MW returns
        const finding = {
          type: roll,
          ring: mwState.ring,
          day: state.time.day,
        };

        // Generate names now (while we have rng context)
        switch (roll) {
          case 'clue': {
            const clueNames = [
              'Faded Inscription', 'Cracked Tablet', 'Mist-Stained Journal',
              'Carved Bone Fragment', 'Woven Thread Pattern', 'Etched Stone Shard',
              'Sealed Vellum Scroll', 'Charred Logbook Page', 'Crystal Resonance Sample',
              'Rusted Compass Fragment', 'Ink-Blurred Map Note', 'Strange Glyph Rubbing',
            ];
            finding.name = clueNames[rng.randInt(0, clueNames.length - 1)];
            finding.id = `clue_${state.time.day}_${rng.randInt(0, 999)}`;
            break;
          }
          case 'lore': {
            const loreNames = [
              'Crumbling Codex', 'Mist-Touched Manuscript', 'Carved Prayer Stone',
              'Faded Tapestry Fragment', 'Charcoal Wall Rubbing', 'Sealed Clay Tablet',
              'Bound Leaf Journal', 'Engraved Metal Plate', 'Wax-Sealed Letter',
              'Stained Vellum Map', 'Bone-Inked Scroll', 'Petrified Wood Tablet',
            ];
            finding.name = loreNames[rng.randInt(0, loreNames.length - 1)];
            finding.id = `lore_${state.time.day}_${rng.randInt(0, 999)}`;
            break;
          }
          case 'lore_fragment': {
            const fragmentNames = [
              'Weathered Page Fragment', 'Torn Scroll Piece', 'Broken Stone Tablet',
              'Stained Parchment Scrap', 'Cracked Clay Shard', 'Faded Text Remnant',
            ];
            finding.name = fragmentNames[rng.randInt(0, fragmentNames.length - 1)];
            finding.id = `lore_fragment_${state.time.day}_${rng.randInt(0, 999)}`;
            // Pick a random creature type to associate with this fragment
            const creatureTypes = state.creatures?.types || [];
            if (creatureTypes.length > 0) {
              finding.creatureTypeId = creatureTypes[rng.randInt(0, creatureTypes.length - 1)].id;
            }
            break;
          }
          case 'nature_hint': {
            const hintNames = [
              'Residue Sample', 'Crystallized Mist Shard', 'Distorted Echo Recording',
              'Nature-Marked Stone', 'Mist Behavior Journal', 'Corroded Instrument',
            ];
            finding.name = hintNames[rng.randInt(0, hintNames.length - 1)];
            finding.id = `nature_${state.time.day}_${rng.randInt(0, 999)}`;
            break;
          }
          case 'source_clue': {
            const sourceNames = [
              'Sealed Mural Fragment', 'Resonating Crystal Shard', 'Ancient Ward Diagram',
              'Corrupted Prayer Scroll', 'Source-Touched Relic', 'Pulsing Glyph Stone',
              'Mist Origin Manuscript', 'Fractured Binding Seal', 'Deep Pattern Etching',
            ];
            finding.name = sourceNames[rng.randInt(0, sourceNames.length - 1)];
            finding.id = `source_${state.time.day}_${rng.randInt(0, 999)}`;
            break;
          }
          case 'artifact': {
            const artifactNames = [
              'Mist-Forged Blade', 'Warding Amulet', 'Tome of Buried Flame',
              'Ironwood Shield', 'Crystal-Lensed Goggles', 'Whispering Staff',
              'Bone-Carved Talisman', 'Rusted Ceremonial Dagger', 'Glowing Vial',
              'Petrified Heart Stone', 'Emberwoven Cloak', 'Shattered Crown Fragment',
            ];
            finding.name = artifactNames[rng.randInt(0, artifactNames.length - 1)];
            finding.id = `artifact_${state.time.day}_${rng.randInt(0, 999)}`;
            break;
          }
          case 'essence': {
            const essenceTypes = ['Physical', 'Crystalline', 'Shadow', 'Corrosive'];
            const essenceType = essenceTypes[rng.randInt(0, essenceTypes.length - 1)];
            finding.name = `${essenceType} Essence`;
            finding.id = `essence_${state.time.day}_${rng.randInt(0, 999)}`;
            finding.essenceType = essenceType.toLowerCase();
            break;
          }
          case 'lost_person': {
            const survivorNames = [
              'Hazel', 'Orin', 'Sera', 'Flint', 'Wynn', 'Briar',
              'Callum', 'Dione', 'Fern', 'Locke', 'Mira', 'Tarn',
            ];
            finding.name = survivorNames[rng.randInt(0, survivorNames.length - 1)];
            finding.id = `person_${state.time.day}_${rng.randInt(0, 999)}`;
            break;
          }
          case 'encounter': {
            const encounterNames = [
              'Mist Stalker', 'Hollow Shade', 'Crystalline Lurker', 'Spore Drifter',
              'Wailing Wisp', 'Stone Sentinel', 'Fog Crawler', 'Echo Wraith',
            ];
            finding.name = encounterNames[rng.randInt(0, encounterNames.length - 1)];
            finding.id = `encounter_${state.time.day}_${rng.randInt(0, 999)}`;
            // Encounters resolve immediately — MW fights or evades
            finding.survived = rng.random() > 0.15; // 85% survival for ring 1
            break;
          }
          case 'map_fragment': {
            finding.name = 'Map Fragment';
            finding.id = `map_${state.time.day}_${rng.randInt(0, 999)}`;
            break;
          }
          case 'herbs_or_cache': {
            const herbNames = [
              'Mistbloom Cluster', 'Pale Root Bundle', 'Thornveil Leaves',
              'Duskwort Sprigs', 'Stone Lily Petals', 'Fogmoss Clump',
            ];
            finding.name = herbNames[rng.randInt(0, herbNames.length - 1)];
            finding.id = `herbs_${state.time.day}_${rng.randInt(0, 999)}`;
            break;
          }
          case 'minor_location': {
            const locationNames = [
              'Shallow Pool', 'Crumbling Wall', 'Mist Den', 'Forgotten Shrine',
              'Overgrown Grove', 'Collapsed Outpost', 'Crystal Formation', 'Bone Cairn',
            ];
            finding.name = locationNames[rng.randInt(0, locationNames.length - 1)];
            finding.id = `loc_${state.time.day}_${rng.randInt(0, 999)}`;
            break;
          }
          case 'creature_sighting': {
            const creatureTypes = state.creatures?.types || [];
            if (creatureTypes.length > 0) {
              finding.creatureTypeId = creatureTypes[rng.randInt(0, creatureTypes.length - 1)].id;
              const creature = state.creatures.types.find(c => c.id === finding.creatureTypeId);
              finding.name = creature ? `${creature.name} (at distance)` : 'Creature Sighting';
            } else {
              finding.name = 'Creature Sighting';
            }
            finding.id = `creature_sighting_${state.time.day}_${rng.randInt(0, 999)}`;
            break;
          }
          case 'creature_combat': {
            const creatureTypes = state.creatures?.types || [];
            if (creatureTypes.length > 0) {
              finding.creatureTypeId = creatureTypes[rng.randInt(0, creatureTypes.length - 1)].id;
              const creature = state.creatures.types.find(c => c.id === finding.creatureTypeId);
              finding.name = creature ? `Combat with ${creature.name}` : 'Creature Combat';
            } else {
              finding.name = 'Creature Combat';
            }
            finding.id = `creature_combat_${state.time.day}_${rng.randInt(0, 999)}`;
            finding.survived = rng.random() > 0.10; // 90% survival for field combat
            break;
          }
          case 'creature_signs': {
            const creatureTypes = state.creatures?.types || [];
            if (creatureTypes.length > 0) {
              finding.creatureTypeId = creatureTypes[rng.randInt(0, creatureTypes.length - 1)].id;
              const creature = state.creatures.types.find(c => c.id === finding.creatureTypeId);
              const signTypes = ['tracks', 'nests', 'residue', 'bones', 'scat'];
              const signType = signTypes[rng.randInt(0, signTypes.length - 1)];
              finding.name = creature ? `${creature.name} ${signType}` : `Creature ${signType}`;
            } else {
              finding.name = 'Creature Signs';
            }
            finding.id = `creature_signs_${state.time.day}_${rng.randInt(0, 999)}`;
            break;
          }
        }

        mwState.findings.push(finding);

        // Notify that MW found something (vague — details on return)
        notifications.push({
          type: 'MW_FINDING',
          finding: roll,
          text: finding.name
            ? `Mistwalker discovered something: ${finding.name}`
            : `Mistwalker found something in the mist`,
          classification: 'routine',
        });
      }

      // Count down explore days after rolling
      mwState.exploreDaysLeft -= 1;

      return;
    }

    // Scouting an incoming raid (1-day trip)
    if (mwState.status === 'scouting') {
      mwState.daysOut += 1;
      mwState.daysRemaining -= 1;

      if (mwState.daysRemaining <= 0) {
        const raidId = mwState.scoutTargetRaidId;
        const raid = state.mist.raidQueue.find(r => r.id === raidId);

        // Reset MW to home
        state.exploration.mwState = {
          status: 'home',
          ring: null,
          daysOut: 0,
          daysRemaining: 0,
          findings: [],
        };

        if (!raid || raid.status !== 'incoming') {
          // Raid already resolved or doesn't exist
          notifications.push({
            type: 'MW_SCOUT_RETURNED',
            raidId,
            success: false,
            message: 'Mistwalker returned — the threat could not be located',
            classification: 'routine',
          });
          return;
        }

        // Mark raid as scouted
        raid.scouted = true;

        // Build scout report with creature details
        const creatureType = (state.creatures?.types || []).find(c => c.id === raid.creatureTypeId);
        const daysUntil = raid.arrivalDay - state.time.day;

        // Gather flavor descriptions visible to the scout
        let flavorLines = [];
        if (creatureType) {
          flavorLines = (creatureType.flavor || []).map(f => `  • ${f}`);

          // Record this in the compendium
          CreaturesModule.recordScoutReport(state, raid.creatureTypeId, {
            day: state.time.day,
            size: raid.size,
            count: raid.count,
            exactDays: daysUntil,
          });
        }

        // Build the scout report message
        const sizeLabel = { sm: 'Small', m: 'Medium', l: 'Large' }[raid.size] || raid.size;
        const creatureName = raid.creatureName || 'Unknown Creature';
        const traitLines = flavorLines.join('\n');

        notifications.push({
          type: 'MW_SCOUT_RETURNED',
          raidId,
          success: true,
          creatureName,
          creatureTypeId: raid.creatureTypeId,
          size: raid.size,
          sizeLabel,
          count: raid.count,
          exactDays: daysUntil,
          strength: raid.strength,
          traitDescriptions,
          message: `Scout report: ${raid.count} ${sizeLabel} ${creatureName}${raid.count > 1 ? 's' : ''} — arriving in exactly ${daysUntil} day${daysUntil !== 1 ? 's' : ''} (strength ${raid.strength})`,
          classification: 'critical',
        });

        // Log trait observations separately so they appear in the feed
        if (traitDescriptions.length > 0) {
          notifications.push({
            type: 'MW_SCOUT_TRAITS',
            raidId,
            creatureName,
            traits: traitDescriptions,
            message: `Observations of ${creatureName}: ${traitDescriptions.map(t => t.scoutDesc).join('; ')}`,
            classification: 'notable',
          });
        }
      }
      return;
    }

    // Rescuing a lost character
    if (mwState.status === 'rescuing') {
      mwState.daysOut += 1;
      mwState.daysRemaining -= 1;

      if (mwState.daysRemaining <= 0) {
        // Resolve rescue attempt
        const rescueConfig = config.rescue || { baseSuccessChance: 0.85, decayPerDay: 0.05, minSuccessChance: 0.2 };
        const target = state.population.characters.find(c => c.id === mwState.rescueTargetId);
        const targetName = mwState.rescueTargetName;

        // Reset MW to home
        const rescueTargetId = mwState.rescueTargetId;
        state.exploration.mwState = {
          status: 'home',
          ring: null,
          daysOut: 0,
          daysRemaining: 0,
          findings: [],
        };

        if (!target || target.health !== 'lost') {
          // Target no longer lost (died? already rescued?)
          notifications.push({
            type: 'MW_RESCUE_FAILED',
            targetName,
            message: `Mistwalker returned — ${targetName} could not be found`,
            classification: 'notable',
          });
          return;
        }

        // Calculate success chance — decays the longer they've been lost
        const daysLost = state.time.day - (target.lostDay || 0);
        const successChance = Math.max(
          rescueConfig.minSuccessChance,
          rescueConfig.baseSuccessChance - (daysLost * rescueConfig.decayPerDay)
        );

        if (rng.chance(successChance)) {
          // Success — character returns injured but alive
          target.health = 'injured';
          target.healingDaysRemaining = rng.randInt(3, 5);
          target.history = target.history || [];
          target.history.push(`Rescued from the mist on day ${state.time.day}`);

          notifications.push({
            type: 'MW_RESCUE_SUCCESS',
            targetId: rescueTargetId,
            targetName,
            message: `Mistwalker found ${targetName} in the mist! They're injured but alive.`,
            classification: 'critical',
          });
        } else {
          // Failure — MW comes home empty-handed
          notifications.push({
            type: 'MW_RESCUE_FAILED',
            targetId: rescueTargetId,
            targetName,
            message: `Mistwalker searched but couldn't find ${targetName} in the mist`,
            classification: 'notable',
          });
        }
      }
      return;
    }
  },

  /**
   * Generate a unique find (rare game-changing discovery)
   */
  generateUniqueFind(state, rng, ring, notifications) {
    const types = ['sealed_knowledge', 'ancient_technique', 'structure_blueprint'];
    const type = types[rng.randInt(0, types.length - 1)];

    let name, description;

    if (type === 'sealed_knowledge') {
      const adjectives = ['Ornate', 'Ancient', 'Faded', 'Glowing', 'Sealed'];
      adjectives.push('Sealed');
      name = `${adjectives[rng.randInt(0, adjectives.length - 1)]} Tome`;
      description = 'A sealed tome radiating faint power';
    } else if (type === 'ancient_technique') {
      name = 'Carved Tablet';
      description = 'A carved tablet with unfamiliar movements';
    } else {
      name = 'Architectural Plans';
      description = 'Detailed architectural plans on treated leather';
    }

    const uniqueFind = {
      id: `unique_${type}_${state.time.day}_${rng.randInt(0, 99999)}`,
      type,
      name,
      description,
      discovered: true,
      analyzedDay: null,
    };

    state.knowledge.uniqueFinds.push(uniqueFind);

    notifications.push({
      type: 'UNIQUE_FIND_DISCOVERED',
      findType: type,
      name,
      description,
      message: `Mistwalker discovered something extraordinary: "${name}" \u2014 ${description}`,
      classification: 'critical',
    });
  },

  /**
   * Deliver all accumulated findings when MW returns home
   */
  deliverFindings(findings, ring, state, rng, config, notifications) {
    for (const finding of findings) {
      switch (finding.type) {
        case 'clue':
        case 'lore':
        case 'nature_hint':
        case 'source_clue':
        case 'lore_fragment':
          // All knowledge-type findings go to the scholar research queue
          state.knowledge.clues.push({
            id: finding.id || `finding_${state.time.day}_${rng.randInt(0, 99999)}`,
            name: finding.name || 'Unknown Finding',
            source: 'Mist exploration',
            ring: finding.ring,
            day: state.time.day,
            status: 'perceived',
            creatureTypeId: finding.creatureTypeId || null,  // for lore fragments
          });
          notifications.push({
            type: 'MW_DELIVERED',
            finding: finding.type,
            name: finding.name,
            message: `Mistwalker delivered "${finding.name}" to the scholars`,
            classification: 'notable',
          });
          break;

        case 'creature_sighting':
          // Record creature sighting in compendium
          if (finding.creatureTypeId) {
            CreaturesModule.recordSighting(state, finding.creatureTypeId, state.time.day, 'field_sighting');
            // Also create a clue for scholars to research
            state.knowledge.clues.push({
              id: finding.id,
              name: finding.name,
              source: 'Mist exploration',
              ring: finding.ring,
              day: state.time.day,
              status: 'perceived',
              type: 'creature_field_notes',
              creatureTypeId: finding.creatureTypeId,
            });
          }
          notifications.push({
            type: 'MW_DELIVERED',
            finding: 'creature_sighting',
            name: finding.name,
            message: `Mistwalker spotted: ${finding.name}`,
            classification: 'notable',
          });
          break;

        case 'creature_combat':
          // Record field combat and create clues
          if (finding.creatureTypeId) {
            if (finding.survived) {
              CreaturesModule.recordCombatEncounter(state, finding.creatureTypeId, state.time.day, 'field_combat');
              // Create both a field notes clue and a trait hint clue
              state.knowledge.clues.push({
                id: finding.id,
                name: finding.name,
                source: 'Mist exploration',
                ring: finding.ring,
                day: state.time.day,
                status: 'perceived',
                type: 'creature_field_notes',
                creatureTypeId: finding.creatureTypeId,
              });
              // Add a separate trait hint clue
              state.knowledge.clues.push({
                id: `trait_hint_${finding.id}`,
                name: `Trait observations from ${finding.name}`,
                source: 'Mist exploration',
                ring: finding.ring,
                day: state.time.day,
                status: 'perceived',
                type: 'lore_fragment',
                creatureTypeId: finding.creatureTypeId,
              });
              notifications.push({
                type: 'MW_DELIVERED',
                finding: 'creature_combat',
                name: finding.name,
                message: `Mistwalker fought and defeated: ${finding.name}`,
                classification: 'critical',
              });
            } else {
              // MW was injured but returned
              const mw = state.population.characters.find(c => c.role === 'mistwalker');
              if (mw) {
                mw.health = 'injured';
                mw.healingDaysRemaining = rng.randInt(3, 5);
              }
              notifications.push({
                type: 'MW_DELIVERED',
                finding: 'creature_combat',
                name: finding.name,
                message: `Mistwalker was injured fighting: ${finding.name}`,
                classification: 'critical',
              });
            }
          }
          break;

        case 'creature_signs':
          // Create a lore fragment clue for scholars to analyze
          if (finding.creatureTypeId) {
            state.knowledge.clues.push({
              id: finding.id,
              name: finding.name,
              source: 'Mist exploration',
              ring: finding.ring,
              day: state.time.day,
              status: 'perceived',
              type: 'lore_fragment',
              creatureTypeId: finding.creatureTypeId,
            });
          }
          notifications.push({
            type: 'MW_DELIVERED',
            finding: 'creature_signs',
            name: finding.name,
            message: `Mistwalker found: ${finding.name}`,
            classification: 'notable',
          });
          break;

        case 'map_fragment':
          state.knowledge.mapFragments = (state.knowledge.mapFragments || 0) + 1;
          notifications.push({
            type: 'MW_DELIVERED',
            finding: 'map_fragment',
            message: `Mistwalker delivered a map fragment (${state.knowledge.mapFragments} total)`,
            classification: 'notable',
          });
          break;

        case 'herbs_or_cache':
          state.resources.herbs = (state.resources.herbs || 0) + 1;
          notifications.push({
            type: 'MW_DELIVERED',
            finding: 'herbs_or_cache',
            name: finding.name,
            message: `Mistwalker brought back ${finding.name || 'herbs'} from the mist`,
            classification: 'routine',
          });
          break;

        case 'essence': {
          if (!state.resources.essences) state.resources.essences = {};
          const eType = finding.essenceType || 'unknown';
          state.resources.essences[eType] = (state.resources.essences[eType] || 0) + 1;
          notifications.push({
            type: 'MW_DELIVERED',
            finding: 'essence',
            name: finding.name,
            message: `Mistwalker collected ${finding.name}`,
            classification: 'notable',
          });
          break;
        }

        case 'artifact': {
          if (!state.knowledge.artifacts) state.knowledge.artifacts = [];

          // Add as unidentified artifact
          state.knowledge.artifacts.push({
            id: finding.id,
            name: finding.name,
            ring: finding.ring,
            discoveredDay: state.time.day,
            status: 'perceived',       // unidentified until researched
            identified: false,
            equippedTo: null,
            // Stats/special unknown until researched
            statBonuses: null,
            special: null,
            description: null,
          });

          // Also add to research queue as a clue so scholars can study it
          state.knowledge.clues.push({
            id: finding.id,
            name: finding.name,
            source: 'Mist exploration',
            ring: finding.ring,
            day: state.time.day,
            status: 'perceived',
          });

          notifications.push({
            type: 'MW_DELIVERED',
            finding: 'artifact',
            name: finding.name,
            message: `Mistwalker recovered an unidentified artifact: "${finding.name}"`,
            classification: 'notable',
          });
          break;
        }

        case 'minor_location': {
          // Pick a random location type from config templates
          const locTypes = config.expedition?.locationTypes || {};
          const typeKeys = Object.keys(locTypes);
          const typeKey = typeKeys.length > 0 ? rng.pick(typeKeys) : null;
          const template = typeKey ? locTypes[typeKey] : null;

          const location = {
            id: finding.id || `loc_${ring}_${state.time.day}_${rng.randInt(0, 999)}`,
            name: template ? template.name : finding.name,
            ring,
            discoveredDay: state.time.day,
            type: typeKey,
            description: template?.description || '',
            challenges: template?.challenges ? JSON.parse(JSON.stringify(template.challenges)) : [],
            rewards: template?.rewards ? JSON.parse(JSON.stringify(template.rewards)) : {},
            dangerLevel: template?.dangerLevel || 1,
            haulingRequired: template?.haulingRequired || false,
            visited: false,
          };

          state.exploration.locations.minor.push(location);
          notifications.push({
            type: 'MW_DELIVERED',
            finding: 'minor_location',
            name: location.name,
            message: `Mistwalker discovered "${location.name}" in the mist`,
            classification: 'notable',
          });

          // Domain activation: first discovery in a ring activates its domain
          const discoveredDomainId = config.ringDomains?.[ring];
          if (discoveredDomainId && config.domains[discoveredDomainId]) {
            PressureModule.activateDomain(state, config, discoveredDomainId);
            notifications.push({
              type: 'DOMAIN_ACTIVATED',
              domainId: discoveredDomainId,
              ring,
              classification: 'critical',
              message: `A new mist domain stirs — something awakens in ring ${ring}`,
            });
          }
          break;
        }

        case 'lost_person': {
          // Generate a new unassigned character
          const newCharId = `char_${state.population.characters.length}`;
          state.population.characters.push({
            id: newCharId,
            name: finding.name,
            role: 'unassigned',
            assignment: 'available',
            tier: 'novice',
            specialization: null,
            body: rng.randInt(1, 3),
            mind: rng.randInt(1, 3),
            spirit: rng.randInt(1, 3),
            health: 'active',
            healingDaysRemaining: 0,
            xp: 0,
            training: null,
            arrivalDay: state.time.day,
            history: ['Found wandering in the mist'],
            modifiers: [],

          });
          notifications.push({
            type: 'MW_DELIVERED',
            finding: 'lost_person',
            name: finding.name,
            message: `Mistwalker rescued "${finding.name}" from the mist!`,
            classification: 'notable',
          });
          break;
        }

        case 'encounter': {
          if (finding.survived) {
            // MW survived — may have gained essence from the creature
            if (!state.resources.essences) state.resources.essences = {};
            const eTypes = ['physical', 'crystalline', 'shadow', 'corrosive'];
            const dropType = rng.pick(eTypes);
            state.resources.essences[dropType] = (state.resources.essences[dropType] || 0) + 1;
            notifications.push({
              type: 'MW_DELIVERED',
              finding: 'encounter',
              name: finding.name,
              message: `Mistwalker defeated a ${finding.name} and collected its essence`,
              classification: 'notable',
            });
          } else {
            // MW was injured — still delivers but is hurt
            const mw = state.population.characters.find(c => c.role === 'mistwalker');
            if (mw) {
              mw.health = 'injured';
              mw.healingDaysRemaining = rng.randInt(3, 5);
            }
            notifications.push({
              type: 'MW_DELIVERED',
              finding: 'encounter',
              name: finding.name,
              message: `Mistwalker was injured fighting a ${finding.name}`,
              classification: 'critical',
            });
          }
          break;
        }
      }
    }

    // Log this expedition's haul
    state.exploration.expeditions.push({
      ring,
      returnDay: state.time.day,
      items: findings.map(f => ({
        type: f.type,
        name: f.name || f.type,
      })),
    });
  },

  getState(state) {
    return {
      mwState: { ...state.exploration.mwState },
      rings: state.exploration.rings.map(r => ({ ...r })),
      expeditions: state.exploration.expeditions.map(e => ({ ...e, items: [...e.items] })),
      locations: {
        discovered: [...state.exploration.locations.discovered],
        vital: [...state.exploration.locations.vital],
        minor: [...state.exploration.locations.minor],
      },
    };
  },
};

export default ExplorationModule;
