/**
 * Centralized target eligibility — single source of truth.
 * MW and scholars are never valid random victims.
 */
export function getEligibleVictims(state, excludeIds = []) {
  return state.population.characters.filter(c =>
    c.health === 'active' &&
    c.role !== 'mistwalker' &&
    c.role !== 'scholar' &&
    !excludeIds.includes(c.id)
  );
}
