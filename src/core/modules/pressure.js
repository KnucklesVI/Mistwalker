/**
 * PressureModule — pressure/containment system
 *
 * Band management methods mutate state.pressure.bands.
 * calculate() is a pure read-only snapshot — no mutations.
 * Not wired into the engine tick yet.
 */

import MistModule from './mist.js?v=5z';

const PressureModule = {

  // ── Band management (state-mutating) ──

  /**
   * Activate a new pressure domain. No-op if already exists.
   */
  activateDomain(state, config, domainId) {
    if (state.pressure.bands.some(b => b.domainId === domainId)) {
      return;
    }
    const domain = config.domains[domainId];
    state.pressure.bands.push({
      domainId,
      current: 0,
      max: domain ? domain.maxPressure : 100,
      ramping: true,
      activationDay: state.time.day,
      revealed: false,
    });
  },

  /**
   * Mark a domain as revealed to the player.
   */
  revealDomain(state, domainId) {
    const band = state.pressure.bands.find(b => b.domainId === domainId);
    if (band) band.revealed = true;
  },

  /**
   * Stop a domain from ramping further.
   */
  stopRamping(state, domainId) {
    const band = state.pressure.bands.find(b => b.domainId === domainId);
    if (band) band.ramping = false;
  },

  /**
   * Advance all ramping bands by one tick if the ramp interval has elapsed.
   * Called once per day (when wired into the engine).
   */
  update(state, config) {
    const day = state.time.day;
    const pc = config.pressure;

    for (const band of state.pressure.bands) {
      if (!band.ramping) continue;
      if (band.current >= band.max) continue;

      // Per-domain ramp values from config, fall back to global pressure config
      const domain = config.domains[band.domainId];
      const rampInterval = domain?.rampIntervalDays || pc.rampIntervalDays;
      const rampAmount = domain?.rampAmount || pc.rampAmount;

      const daysSinceActivation = day - band.activationDay;
      if (daysSinceActivation > 0 && daysSinceActivation % rampInterval === 0) {
        band.current = Math.min(band.current + rampAmount, band.max);
      }
    }

    // Scholar reveal progression
    this.updateReveals(state, config);
  },

  /**
   * Scholar reveal: active scholars contribute progress toward revealing unrevealed domains.
   * Called once per day inside update().
   */
  updateReveals(state, config) {
    const scholars = state.population.characters.filter(
      c => c.role === 'scholar' && c.health === 'active'
    );
    if (scholars.length === 0) return;

    for (const band of state.pressure.bands) {
      if (!band.revealed) {
        band.revealProgress = (band.revealProgress || 0) + scholars.length;
        if (band.revealProgress >= 20) {
          band.revealed = true;
        }
      }
    }
  },

  // ── Read-only queries ──

  /**
   * Sum current pressure across all bands.
   */
  calculateTotalPressure(state) {
    return state.pressure.bands.reduce((sum, band) => sum + band.current, 0);
  },

  /**
   * Compute pressure, containment, gap, instability, and breach chance.
   * Pure read-only — no state mutation.
   *
   * @param {object} state  — full game state (read-only)
   * @param {object} config — game config (must include config.pressure)
   * @returns {{ totalPressure: number, totalContainment: number, gap: number, instability: number, breachChance: number }}
   */
  calculate(state, config) {
    const pc = config.pressure;

    // ── Containment (domain-aware) ──
    const perimeterPriests = MistModule.getPerimeterPriests(state);
    const activeMW = MistModule.getActiveMistwalker(state);

    let totalContainment = 0;
    if (state.pressure.bands.length > 0) {
      for (const band of state.pressure.bands) {
        const domain = config.domains[band.domainId];
        const modifier = band.revealed ? (domain?.containmentModifier ?? 1.0) : 1.0;
        totalContainment +=
          (perimeterPriests.length * pc.priestContainment * modifier)
          + (activeMW ? pc.mwContainment * modifier : 0);
      }
    } else {
      // No active domains — base containment applies
      totalContainment =
        (perimeterPriests.length * pc.priestContainment)
        + (activeMW ? pc.mwContainment : 0);
    }

    // ── Pressure: base + sum of all band currents ──
    let totalPressure = pc.basePressure + this.calculateTotalPressure(state);

    // ── Gap & instability ──
    let gap = totalPressure - totalContainment;
    let instability = totalPressure > 0 ? gap / totalPressure : 0;

    // ── Breach chance ──
    const minBreachChance = 0.001;
    let breachChance =
      minBreachChance +
      Math.pow(instability, pc.breachExponent) *
      (pc.maxBreachChance - minBreachChance);

    // ── Hard clamps ──
    totalPressure = Math.max(totalPressure, 0);
    totalContainment = Math.max(totalContainment, 0);
    gap = Math.max(gap, 0);
    instability = Math.min(Math.max(instability, 0), 1);
    breachChance = Math.min(
      Math.max(breachChance, minBreachChance),
      pc.maxBreachChance
    );

    return {
      totalPressure,
      totalContainment,
      gap,
      instability,
      breachChance,
    };
  },
};

export default PressureModule;
