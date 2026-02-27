/**
 * Underground Module - Digging system, room discovery, tome drops
 * Level 1: The Foundation
 */

let tomeCounter = 0;

const LEVEL1_ROOMS = [
  { id: 'training_hall',    name: 'Training Hall',    role: 'soldier',  threshold: 0.25 },
  { id: 'archive_chamber',  name: 'Archive Chamber',  role: 'scholar',  threshold: 0.50 },
  { id: 'sanctum_alcove',   name: 'Sanctum Alcove',   role: 'priest',   threshold: 0.75 },
  { id: 'workshop_vault',   name: 'Workshop Vault',   role: 'engineer', threshold: 1.00 },
];

function generateTome(rng, config, day) {
  tomeCounter++;
  const isGeneric = rng.random() < config.digging.genericTomeChance;
  if (isGeneric) {
    return {
      id: `tome_d${day}_${rng.randInt(0, 99999)}_${tomeCounter}`,
      name: 'Tome of Potential',
      stat: null,
      amount: 1,
      generic: true,
      used: false,
    };
  }
  const stats = ['body', 'mind', 'spirit'];
  const stat = rng.pick(stats);
  const names = { body: 'Tome of Strength', mind: 'Tome of Wisdom', spirit: 'Tome of Spirit' };
  return {
    id: `tome_d${day}_${rng.randInt(0, 99999)}_${tomeCounter}`,
    name: names[stat],
    stat,
    amount: 1,
    generic: false,
    used: false,
  };
}

const UndergroundModule = {
  update(state, rng, config, notifications) {
    const ug = state.underground;
    if (!ug || ug.levelComplete) return;

    const digConfig = config.digging;
    const chars = state.population.characters;

    // Check for engineer supervising
    const diggingEngineers = chars.filter(
      c => c.role === 'engineer' && c.assignment === 'digging' && c.health === 'active'
    );
    if (digConfig.engineerRequired && diggingEngineers.length === 0) return;

    // Check for workers digging
    const diggingWorkers = chars.filter(
      c => c.role === 'worker' && c.assignment === 'digging' && c.health === 'active'
    );
    if (diggingWorkers.length === 0) return;

    // Check resources
    if (state.resources.wood < digConfig.woodCostPerDay || state.resources.stone < digConfig.stoneCostPerDay) {
      notifications.push({
        type: 'DIG_HALTED',
        classification: 'notable',
        message: 'Excavation halted \u2014 insufficient wood or stone for supports',
      });
      return;
    }

    // Deduct resource costs
    state.resources.wood -= digConfig.woodCostPerDay;
    state.resources.stone -= digConfig.stoneCostPerDay;

    // Calculate daily dig progress
    let dailyProgress = 0;
    for (const w of diggingWorkers) {
      dailyProgress += digConfig.workerDigRate + Math.max(0, w.body - 2) * digConfig.bodyBonusPerPoint;
    }
    for (const e of diggingEngineers) {
      dailyProgress += digConfig.engineerSpeedBonus;
    }

    const prevProgress = ug.progress;
    ug.progress = Math.min(ug.progress + dailyProgress, digConfig.level1TotalWork);

    // Routine progress notification
    notifications.push({
      type: 'DIG_PROGRESS',
      classification: 'routine',
      message: `Excavation: ${Math.round(ug.progress)}/${digConfig.level1TotalWork} (+${dailyProgress.toFixed(1)})`,
    });

    // Tome roll
    if (rng.random() < digConfig.tomeChancePerDay) {
      const tome = generateTome(rng, config, state.time.day);
      ug.tomes.push(tome);
      notifications.push({
        type: 'TOME_FOUND',
        classification: 'notable',
        message: `Workers unearthed a ${tome.name}!`,
      });
    }

    // Room discovery check
    for (const roomDef of LEVEL1_ROOMS) {
      const threshold = roomDef.threshold * digConfig.level1TotalWork;
      if (prevProgress < threshold && ug.progress >= threshold) {
        // Discovered a new room
        const alreadyFound = ug.rooms.some(r => r.id === roomDef.id);
        if (!alreadyFound) {
          ug.rooms.push({
            id: roomDef.id,
            name: roomDef.name,
            role: roomDef.role,
            discoveredDay: state.time.day,
          });
          ug.roomsDiscovered++;
          notifications.push({
            type: 'ROOM_DISCOVERED',
            classification: 'notable',
            message: `Workers uncovered the ${roomDef.name}!`,
          });

          if (ug.roomsDiscovered >= 4) {
            ug.levelComplete = true;
            notifications.push({
              type: 'LEVEL_COMPLETE',
              classification: 'critical',
              message: 'Level 1 excavation complete \u2014 The Foundation is fully cleared!',
            });
          }
        }
      }
    }
  },

  /**
   * USE_TOME — apply stat boost from a tome to a character
   * Extracted from engine.js lines 271-290
   *
   * Handles both generic tomes (player chooses stat via command.stat)
   * and fixed tomes (stat from tome.stat). Caps at 3.
   * Underground is DISABLED but tomes from prior games still work.
   */
  handleUseTome(state, command, notifications) {
    const ug = state.underground || {};
    const tome = (ug.tomes || []).find(t => t.id === command.tomeId);
    const char = state.population.characters.find(c => c.id === command.characterId);
    if (tome && char && !tome.used) {
      const targetStat = tome.generic ? command.stat : tome.stat;
      if (targetStat && char[targetStat] < 3) {
        tome.used = true;
        char[targetStat] += tome.amount;
        if (char[targetStat] > 3) char[targetStat] = 3;
        const statLabel = targetStat.charAt(0).toUpperCase() + targetStat.slice(1);
        notifications.push({
          type: 'TOME_USED',
          classification: 'notable',
          message: `${char.name} read ${tome.name} \u2014 ${statLabel} increased to ${char[targetStat]}`,
        });
      }
    }
  },

  getState(state) {
    const ug = state.underground || {
      level: 1, progress: 0, roomsDiscovered: 0,
      rooms: [], tomes: [], levelComplete: false,
    };
    return {
      level: ug.level,
      progress: ug.progress,
      roomsDiscovered: ug.roomsDiscovered,
      rooms: ug.rooms.map(r => ({ ...r })),
      tomes: ug.tomes.map(t => ({ ...t })),
      levelComplete: ug.levelComplete,
    };
  },
};

export default UndergroundModule;
