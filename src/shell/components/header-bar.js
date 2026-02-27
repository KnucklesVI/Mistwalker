/**
 * Header Bar Component
 * Always-visible bar showing day, resources, and status
 */

import { LEX, role, stat, statAbbr, resource, statLine } from '../lexicon.js?v=5z';
import BuildingModule from '../../core/modules/building.js?v=5z';

const VERSION = 'AlphaB v0.05z';

export class HeaderBar {
  constructor(onAdvanceDay = null) {
    this.element = null;
    this.onAdvanceDay = onAdvanceDay;
  }

  render(state) {
    const container = document.createElement('div');
    container.className = 'header-bar';

    const { time, resources, mist, population, combat, config } = state;

    // --- Perimeter calculations ---
    const rawStability = mist.perimeterStability;
    const displayStability = Math.min(100, Math.round(rawStability));
    const target = config.perimeter.targetStability;
    const gap = Math.max(0, target - rawStability);
    const gapPct = Math.round((gap / target) * 100);

    const perimeterColor = displayStability >= 100 ? 'safe' : displayStability >= 60 ? 'warning' : 'critical';

    // Warden breakdown for tooltip
    const wardensOnWardline = population.characters.filter(
      c => c.role === 'priest' && c.assignment === 'perimeter' && c.health === 'active'
    );
    const mwOnWardline = population.characters.filter(
      c => c.role === 'mistwalker' && c.assignment === 'perimeter' && c.health === 'active'
    );
    let wardlineTooltipLines = ['Wardline Breakdown:'];
    for (const warden of wardensOnWardline) {
      let contrib = config.perimeter.basePerPriest;
      contrib += (warden.spirit - 1) * config.perimeter.spiritMultiplier;
      if (warden.tier === 'veteran') contrib *= 1.2;
      else if (warden.tier === 'elevated') contrib *= 1.5;
      wardlineTooltipLines.push(`  ${warden.name}: ${Math.round(contrib)}% (Spirit ${warden.spirit})`);
    }
    for (const mw of mwOnWardline) {
      let contrib = config.perimeter.basePerPriest;
      contrib += (mw.spirit - 1) * config.perimeter.spiritMultiplier;
      wardlineTooltipLines.push(`  ${mw.name}: ${Math.round(contrib)}% (Spirit ${mw.spirit})`);
    }
    if (wardensOnWardline.length === 0 && mwOnWardline.length === 0) {
      wardlineTooltipLines.push('  No one on wardline!');
    }
    wardlineTooltipLines.push('');
    if (gap > 0) {
      wardlineTooltipLines.push(`Gap Penalty: ${gapPct}%`);
      wardlineTooltipLines.push(`  Defenses reduced by ${gapPct}%`);
      wardlineTooltipLines.push(`  ${(gapPct * 0.1).toFixed(1)}% chance of incident per day`);
      wardlineTooltipLines.push(`  (injury, death, or lost in mist)`);
      wardlineTooltipLines.push(`  ${(gapPct * 0.1).toFixed(1)}% chance to lose rations`);
    } else {
      wardlineTooltipLines.push('No gap — wardline is fully sealed');
    }

    // Tower protection info — show assignments
    const towerAssignments = BuildingModule.getTowerAssignments(state, config);
    if (towerAssignments.length > 0) {
      const staffed = towerAssignments.filter(ta => ta.priestId);
      wardlineTooltipLines.push('');
      wardlineTooltipLines.push(`Towers: ${staffed.length}/${towerAssignments.length} staffed`);
      for (const ta of towerAssignments) {
        const tc = BuildingModule.getTypeConfig('tower', ta.towerType, config);
        const name = tc ? tc.name : `Tower (${ta.towerType})`;
        const priestLabel = ta.priestName || 'empty';
        const reduction = Math.round((ta.mistReduction || 0) * 100);
        wardlineTooltipLines.push(`  ${name}: ${priestLabel} (${reduction}% prot)`);
      }
    }

    // --- People calculations ---
    const alive = population.characters.filter(c => c.health !== 'dead' && c.health !== 'lost');
    const injured = population.characters.filter(c => c.health === 'injured' || c.health === 'gravely_injured');

    // Role breakdown for tooltip
    const roles = ['priest', 'soldier', 'engineer', 'worker', 'scholar', 'mistwalker', 'unassigned'];
    let peopleTooltipLines = ['Population Breakdown:'];
    for (const roleKey of roles) {
      const count = alive.filter(c => c.role === roleKey).length;
      if (count > 0) {
        const displayRole = role(roleKey);
        const label = displayRole + (count > 1 ? 's' : '');
        peopleTooltipLines.push(`  ${label}: ${count}`);
      }
    }
    if (injured.length > 0) {
      peopleTooltipLines.push('');
      peopleTooltipLines.push(`Injured (${injured.length}):`);
      for (const c of injured) {
        peopleTooltipLines.push(`  ${c.name} (${role(c.role)}) — ${c.health.replace('_', ' ')}, ${c.healingDaysRemaining}d remaining`);
      }
    }

    const injuredHtml = injured.length > 0
      ? ` <span class="header-injured">(${injured.length})</span>`
      : '';

    // --- Resource tooltips ---
    const tillers = population.characters.filter(c => c.assignment === 'farming' && c.health === 'active');
    const fellers = population.characters.filter(c => c.assignment === 'chopping' && c.health === 'active');
    const stonecutters = population.characters.filter(c => c.assignment === 'quarrying' && c.health === 'active');

    let foodProd = 0;
    tillers.forEach(c => {
      foodProd += config.resources.foodPerWorker + Math.max(0, c.body - config.resources.statBonusThreshold) * config.resources.statBonusPerPoint;
    });
    const foodConsume = alive.length;
    const foodNet = Math.round(foodProd) - foodConsume;
    const foodDays = foodConsume > 0 ? Math.floor(resources.food / foodConsume) : 0;

    let timberRate = 0;
    fellers.forEach(c => {
      timberRate += config.resources.woodPerWorker + Math.max(0, c.body - config.resources.statBonusThreshold) * config.resources.statBonusPerPoint;
    });
    timberRate = Math.round(timberRate);

    let oreRate = 0;
    stonecutters.forEach(c => {
      oreRate += config.resources.stonePerWorker + Math.max(0, c.body - config.resources.statBonusThreshold) * config.resources.statBonusPerPoint;
    });
    oreRate = Math.round(oreRate);

    const rateStr = (val) => val > 0 ? `+${val}/day` : val < 0 ? `${val}/day` : 'no change';

    const foodTooltip = `Rations: ${resources.food}\\n${rateStr(foodNet)} (${Math.round(foodProd)} produced, ${foodConsume} consumed)\\n${tillers.length} tiller${tillers.length !== 1 ? 's' : ''} assigned\\n~${foodDays} days of supply`;
    const timberTooltip = `Timber: ${resources.wood}\\n${rateStr(timberRate)} from ${fellers.length} feller${fellers.length !== 1 ? 's' : ''}`;
    const oreTooltip = `Ore: ${resources.stone}\\n${rateStr(oreRate)} from ${stonecutters.length} stonecutter${stonecutters.length !== 1 ? 's' : ''}`;
    const ironTooltip = `Iron: ${resources.metal}\\nNo production yet`;
    const salvesTooltip = `Salves: ${resources.herbs}\\nFound through exploration`;

    // --- Defense tooltip ---
    const garrisonSentinels = population.characters.filter(c => c.role === 'soldier' && c.health === 'active' && c.assignment === 'garrison');
    const trapCount = combat.traps?.length || 0;
    const defenseRating = combat.defenseRating || 0;
    const trapDef = config.combat?.trapDefense || 2;

    let defenseLines = [`Defense Rating: ${Math.round(defenseRating * 10) / 10}`];
    defenseLines.push(`  Body x${config.combat.soldierBodyMultiplier} per soldier`);
    defenseLines.push('');
    defenseLines.push('Soldiers on Garrison:');
    if (garrisonSentinels.length > 0) {
      for (const s of garrisonSentinels) {
        let contrib = s.body * config.combat.soldierBodyMultiplier;
        if (s.tier === 'veteran') contrib *= config.combat.veteranBonus;
        defenseLines.push(`  ${s.name}: ${Math.round(contrib * 10) / 10} (Body ${s.body})`);
      }
    } else {
      defenseLines.push('  None!');
    }

    if (trapCount > 0) {
      defenseLines.push('');
      defenseLines.push(`Traps: ${trapCount} x ${trapDef} = +${trapCount * trapDef}`);
    }

    const wallDef = BuildingModule.getWallDefense(state, config);
    if (wallDef > 0) {
      defenseLines.push('');
      defenseLines.push(`Walls: +${wallDef}`);
    }

    const defenseTooltip = defenseLines.join('\n');

    // --- Build HTML ---
    container.innerHTML = `
      <div class="header-title-group">
        <div class="header-title">Mistwalker</div>
        <div class="header-version">${VERSION}</div>
      </div>

      <div class="header-separator"></div>

      <div class="header-stat" title="Dawn ${time.day}">
        <span class="header-stat-label">Dawn</span>
        <span class="header-stat-value">${time.day}</span>
      </div>

      <div class="header-separator"></div>

      <div class="header-stat header-stat-hover" data-tooltip-id="food-tip">
        <span class="header-stat-label">Rations</span>
        <span class="header-stat-value">${resources.food}<span style="font-size:0.75em;color:${foodNet >= 0 ? 'var(--text-good, #8c8)' : 'var(--danger, #e55)'}">(${foodNet >= 0 ? '+' : ''}${foodNet})</span></span>
        <div class="header-tooltip" id="food-tip">${foodTooltip.replace(/\\n/g, '\n')}</div>
      </div>

      <div class="header-stat header-stat-hover" data-tooltip-id="wood-tip">
        <span class="header-stat-label">Timber</span>
        <span class="header-stat-value">${resources.wood}</span>
        <div class="header-tooltip" id="wood-tip">${timberTooltip.replace(/\\n/g, '\n')}</div>
      </div>

      <div class="header-stat header-stat-hover" data-tooltip-id="stone-tip">
        <span class="header-stat-label">Ore</span>
        <span class="header-stat-value">${resources.stone}</span>
        <div class="header-tooltip" id="stone-tip">${oreTooltip.replace(/\\n/g, '\n')}</div>
      </div>

      <div class="header-stat header-stat-hover" data-tooltip-id="metal-tip">
        <span class="header-stat-label">Iron</span>
        <span class="header-stat-value">${resources.metal}</span>
        <div class="header-tooltip" id="metal-tip">${ironTooltip.replace(/\\n/g, '\n')}</div>
      </div>

      <div class="header-stat header-stat-hover" data-tooltip-id="herbs-tip">
        <span class="header-stat-label">Salves</span>
        <span class="header-stat-value">${resources.herbs}</span>
        <div class="header-tooltip" id="herbs-tip">${salvesTooltip.replace(/\\n/g, '\n')}</div>
      </div>

      <div class="header-separator"></div>

      <div class="header-stat header-stat-hover ${perimeterColor}" data-tooltip-id="wardline-tip">
        <span class="header-stat-label">Wardline</span>
        <span class="header-stat-value">${displayStability}%</span>
        <div class="header-tooltip header-tooltip-wide" id="wardline-tip">${wardlineTooltipLines.join('\n')}</div>
      </div>

      <div class="header-stat header-stat-hover" data-tooltip-id="people-tip">
        <span class="header-stat-label">People</span>
        <span class="header-stat-value">${alive.length}${injuredHtml}</span>
        <div class="header-tooltip header-tooltip-wide" id="people-tip">${peopleTooltipLines.join('\n')}</div>
      </div>

      <div class="header-stat header-stat-hover" data-tooltip-id="defense-tip">
        <span class="header-stat-label">Defense</span>
        <span class="header-stat-value">${Math.round(defenseRating)}</span>
        <div class="header-tooltip header-tooltip-wide" id="defense-tip">${defenseTooltip}</div>
      </div>

      ${this.renderRaidWarning(state)}

      <div class="header-spacer"></div>

      <button class="advance-day-btn">Next Dawn</button>
    `;

    const advBtn = container.querySelector('.advance-day-btn');
    if (advBtn) {
      advBtn.addEventListener('click', () => {
        if (this.onAdvanceDay) this.onAdvanceDay();
      });
    }

    this.element = container;
    return container;
  }

  renderRaidWarning(state) {
    const incomingRaids = (state.mist.raidQueue || []).filter(r => r.status === 'incoming');
    if (incomingRaids.length === 0) return '';

    // Show the closest incoming raid
    const closest = incomingRaids.reduce((a, b) => a.arrivalDay < b.arrivalDay ? a : b);
    const daysUntil = closest.arrivalDay - state.time.day;

    if (daysUntil <= 0) return '';

    const urgency = daysUntil <= 1 ? 'critical' : daysUntil <= 2 ? 'warning' : '';

    // Show creature name if scouted
    const label = closest.scouted && closest.creatureName
      ? closest.creatureName
      : 'Attack';
    const daysDisplay = closest.scouted ? `${daysUntil}d` : `~${daysUntil}d`;

    return `
      <div class="header-separator"></div>
      <div class="header-stat ${urgency}" style="color: var(--danger, #e55); font-weight: bold;">
        <span class="header-stat-label">${label}</span>
        <span class="header-stat-value">${daysDisplay}</span>
      </div>
    `;
  }

  update(state) {
    if (this.element) {
      this.element.replaceWith(this.render(state));
    }
  }
}

export default HeaderBar;
