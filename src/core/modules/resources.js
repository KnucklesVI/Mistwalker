/**
 * ResourceModule - production and consumption
 */

const ResourceModule = {
  initialize(config, state) {
    // Resources already initialized
  },

  /**
   * PRODUCTION phase: calculate production and consumption
   */
  update(state, rng, config, notifications) {
    // Count active workers by assignment
    const activeCharacters = state.population.characters.filter(c => c.health === 'active');
    
    const farmersCount = state.population.characters.filter(
      c => c.role === 'worker' && c.assignment === 'farming' && c.health === 'active'
    ).length;

    const choppersCount = state.population.characters.filter(
      c => c.role === 'worker' && c.assignment === 'chopping' && c.health === 'active'
    ).length;

    const quarryCount = state.population.characters.filter(
      c => c.role === 'worker' && c.assignment === 'quarrying' && c.health === 'active'
    ).length;

    // Calculate production
    let foodProduced = 0;
    for (const char of state.population.characters.filter(c => c.assignment === 'farming' && c.health === 'active')) {
      let production = config.resources.foodPerWorker;
      const bodyBonus = Math.max(0, char.body - config.resources.statBonusThreshold) * config.resources.statBonusPerPoint;
      production += bodyBonus;
      foodProduced += production;
    }

    let woodProduced = 0;
    for (const char of state.population.characters.filter(c => c.assignment === 'chopping' && c.health === 'active')) {
      let production = config.resources.woodPerWorker;
      const bodyBonus = Math.max(0, char.body - config.resources.statBonusThreshold) * config.resources.statBonusPerPoint;
      production += bodyBonus;
      woodProduced += production;
    }

    let stoneProduced = 0;
    for (const char of state.population.characters.filter(c => c.assignment === 'quarrying' && c.health === 'active')) {
      let production = config.resources.stonePerWorker;
      const bodyBonus = Math.max(0, char.body - config.resources.statBonusThreshold) * config.resources.statBonusPerPoint;
      production += bodyBonus;
      stoneProduced += production;
    }

    // Add production
    state.resources.food += Math.round(foodProduced);
    state.resources.wood += Math.round(woodProduced);
    state.resources.stone += Math.round(stoneProduced);

    notifications.push({
      type: 'PRODUCTION',
      food: Math.round(foodProduced),
      wood: Math.round(woodProduced),
      stone: Math.round(stoneProduced),
    });

    // Consumption: 1 food per living person per day
    const foodConsumption = activeCharacters.length;
    state.resources.food = Math.max(0, state.resources.food - foodConsumption);

    notifications.push({
      type: 'CONSUMPTION',
      food: foodConsumption,
    });

    // Check starvation
    if (state.resources.food === 0) {
      notifications.push({
        type: 'STARVATION',
        message: 'Food supplies depleted!',
      });
    }

    // Log current resources
    notifications.push({
      type: 'RESOURCES_UPDATE',
      food: state.resources.food,
      wood: state.resources.wood,
      stone: state.resources.stone,
      metal: state.resources.metal,
      herbs: state.resources.herbs,
    });
  },

  getState(state) {
    return {
      food: state.resources.food,
      wood: state.resources.wood,
      stone: state.resources.stone,
      metal: state.resources.metal,
      herbs: state.resources.herbs,
      essences: { ...state.resources.essences },
      compounds: { ...state.resources.compounds },
    };
  },
};

export default ResourceModule;
