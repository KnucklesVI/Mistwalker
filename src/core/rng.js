/**
 * Seeded pseudo-random number generator for deterministic gameplay
 */

class SeededRNG {
  constructor(seed = 12345) {
    this.seed = seed;
  }

  // Linear congruential generator
  nextRaw() {
    this.seed = (this.seed * 1664525 + 1013904223) % 4294967296;
    return this.seed / 4294967296;
  }

  /**
   * Returns random float between 0 and 1
   */
  random() {
    return this.nextRaw();
  }

  /**
   * Returns random integer between min and max (inclusive)
   */
  randInt(min, max) {
    return Math.floor(this.random() * (max - min + 1)) + min;
  }

  /**
   * Returns random element from array
   */
  pick(array) {
    if (!array || array.length === 0) return undefined;
    return array[this.randInt(0, array.length - 1)];
  }

  /**
   * Weighted random pick
   * @param {Array} options - [{value: any, weight: number}, ...]
   * @returns selected value
   */
  weightedPick(options) {
    if (!options || options.length === 0) return undefined;

    const totalWeight = options.reduce((sum, opt) => sum + (opt.weight || 0), 0);
    let roll = this.random() * totalWeight;

    for (const option of options) {
      roll -= option.weight;
      if (roll <= 0) return option.value;
    }

    return options[options.length - 1].value;
  }

  /**
   * Returns true or false based on probability (0-1)
   */
  chance(probability) {
    return this.random() < probability;
  }
}

export default SeededRNG;
