/**
 * Explore Tab - Mistwalker exploration and expeditions
 *
 * Trip model:
 *   Pick total days away (min = 1, max = range).
 *   Internally always uses ring 1 (travel = 1d).
 *   Explore rolls = totalDays - travelDays + 1.
 *   Return is free.
 */

import { LEX, role, stat, statLine } from '../lexicon.js?v=5z';

export class ExploreTab {
  constructor(onSendMW = null, onCancelMW = null, onCharacterClick = null, onSendExpedition = null, onCancelExpedition = null, onScoutRaid = null, onJoinWardline = null, onLeaveWardline = null) {
    this.onSendMW = onSendMW;
    this.onCancelMW = onCancelMW;
    this.onCharacterClick = onCharacterClick;
    this.onSendExpedition = onSendExpedition;
    this.onCancelExpedition = onCancelExpedition;
    this.onScoutRaid = onScoutRaid;
    this.onJoinWardline = onJoinWardline;
    this.onLeaveWardline = onLeaveWardline;
  }

  render(state) {
    const container = document.createElement('div');
    const mw = state.exploration.mwState;
    const config = state.config;

    // MW Status Section
    const statusSection = document.createElement('div');
    statusSection.className = 'collapsible-section';

    const statusHeader = document.createElement('div');
    statusHeader.className = 'collapsible-header';

    const mwChar = state.population.characters.find(c => c.role === 'mistwalker');
    const mwOnWardline = mwChar && mwChar.assignment === 'perimeter';

    let statusText = mwOnWardline ? 'Guarding the Wardline' : 'Monastery';
    let statusClass = 'status-good';
    if (mw.status === 'traveling_out') {
      statusText = `Venturing into the mist (${mw.daysRemaining}d transit)`;
      statusClass = 'status-warn';
    } else if (mw.status === 'exploring') {
      statusText = `Exploring the mist (${mw.exploreDaysLeft}d left)`;
      statusClass = 'status-warn';
    } else if (mw.status === 'rescuing') {
      statusText = `Searching for ${mw.rescueTargetName || 'someone'} (${mw.daysRemaining}d)`;
      statusClass = 'status-warn';
    } else if (mw.status === 'scouting') {
      statusText = `Scouting incoming raid (returns tomorrow)`;
      statusClass = 'status-warn';
    } else if (mw.status === 'expedition') {
      statusText = 'Leading expedition';
      statusClass = 'status-warn';
    } else if (mw.status !== 'home') {
      statusText = `Away (${mw.status})`;
      statusClass = 'status-warn';
    }

    statusHeader.innerHTML = `
      <span class="collapsible-caret">\u25BC</span>
      <span class="collapsible-title">Mistwalker Status</span>
      <span class="${statusClass}" style="margin-left: auto;">${statusText}</span>
    `;

    const statusBody = document.createElement('div');
    statusBody.className = 'collapsible-body';

    if (mw.status === 'home' && mwOnWardline) {
      // MW is guarding the wardline — show status and leave button
      let html = '';
      if (mwChar) {
        html += `
          <div class="item-row" data-char-id="${mwChar.id}" style="margin-bottom: 12px; cursor: pointer;">
            <span class="item-name" style="color: var(--accent-gold);">${mwChar.name}</span>
            <span class="item-detail">${stat('spirit')} ${mwChar.spirit} · Reinforcing the perimeter</span>
          </div>
        `;
      }
      html += '<div style="color: var(--text-secondary); margin-bottom: 8px;">The Mistwalker is strengthening the wardline. Recall to resume exploration.</div>';

      statusBody.innerHTML = html;

      // Wire MW name click
      const mwRow = statusBody.querySelector('[data-char-id]');
      if (mwRow) {
        mwRow.addEventListener('click', () => {
          if (this.onCharacterClick) this.onCharacterClick(mwRow.dataset.charId);
        });
      }

      // Leave Wardline button
      const leaveBtn = document.createElement('button');
      leaveBtn.className = 'ring-btn';
      leaveBtn.style.cssText = 'width: 100%; padding: 6px 12px; text-align: center;';
      leaveBtn.textContent = 'Leave the Wardline';
      leaveBtn.addEventListener('click', () => {
        if (this.onLeaveWardline && mwChar) {
          this.onLeaveWardline(mwChar.id);
        }
      });
      statusBody.appendChild(leaveBtn);
    } else if (mw.status === 'home') {
      const mwRange = config.exploration.baseMwRange;
      const ringTravelDays = config.exploration.ringTravelDays;

      let html = '';

      if (mwChar) {
        html += `
          <div class="item-row" data-char-id="${mwChar.id}" style="margin-bottom: 12px; cursor: pointer;">
            <span class="item-name" style="color: var(--accent-gold);">${mwChar.name}</span>
            <span class="item-detail header-stat-hover" style="position: relative;">Range: ${mwRange} days
              <span class="header-tooltip" style="white-space: pre; pointer-events: none;">Range is determined by
${stat('body')} ${mwChar.body} + ${stat('spirit')} ${mwChar.spirit}</span>
            </span>
          </div>
        `;
      }

      // Scout incoming raids section
      const unscoutedRaids = (state.mist?.raidQueue || []).filter(
        r => r.status === 'incoming' && !r.scouted
      );
      const scoutedRaids = (state.mist?.raidQueue || []).filter(
        r => r.status === 'incoming' && r.scouted
      );

      if (unscoutedRaids.length > 0 || scoutedRaids.length > 0) {
        html += '<div style="margin-bottom: 12px; padding: 8px; border: 1px solid var(--danger, #e55); border-radius: 4px;">';
        html += '<div style="margin-bottom: 6px; color: var(--danger, #e55); font-weight: bold;">Incoming Threats</div>';

        for (const raid of unscoutedRaids) {
          const daysLabel = typeof raid.daysUntil === 'number'
            ? `${raid.daysUntil}d`
            : `${raid.daysUntil || '?'}`;
          html += `
            <div class="item-row" style="margin-bottom: 4px;">
              <span class="item-name" style="color: var(--danger, #e55);">Unknown threat — ${daysLabel} away</span>
              <span class="item-detail">Strength ~${raid.strength}</span>
              <button class="scout-raid-btn ring-btn" data-raid-id="${raid.id}" style="margin-left: 8px; padding: 2px 10px; font-size: 0.85em;">
                Scout (1 day)
              </button>
            </div>
          `;
        }

        for (const raid of scoutedRaids) {
          const sizeLabel = { sm: 'Small', m: 'Medium', l: 'Large' }[raid.size] || raid.size;
          html += `
            <div class="item-row" style="margin-bottom: 4px;">
              <span class="item-name" style="color: var(--accent-gold);">${raid.count} ${sizeLabel} ${raid.creatureName}${raid.count > 1 ? 's' : ''}</span>
              <span class="item-detail">Arrives in ${raid.daysUntil}d \u00B7 Str ${raid.strength}</span>
              <span style="color: var(--text-good, #8c8); margin-left: 8px; font-size: 0.85em;">\u2713 Scouted</span>
            </div>
          `;
        }

        html += '</div>';
      }

      // Explore action row: button + dropdown
      html += '<div class="nav-group" style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">';
      html += '<button class="ring-btn explore-btn" style="padding: 5px 16px;">Explore</button>';
      html += '<select class="dur-select" style="background: var(--panel-bg); color: var(--text-primary); border: 1px solid var(--panel-border); padding: 5px 8px; border-radius: 4px; font-size: 0.9em;">';
      for (let d = mwRange; d >= 1; d--) {
        const maxTag = d === mwRange ? ' (max)' : '';
        html += `<option value="${d}">${d} day${d !== 1 ? 's' : ''}${maxTag}</option>`;
      }
      html += '</select>';
      html += '</div>';

      statusBody.innerHTML = html;

      // Wire MW name click → open character sheet
      const mwRow = statusBody.querySelector('[data-char-id]');
      if (mwRow) {
        mwRow.addEventListener('click', () => {
          if (this.onCharacterClick) this.onCharacterClick(mwRow.dataset.charId);
        });
      }

      // Wire scout raid buttons
      statusBody.querySelectorAll('.scout-raid-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const raidId = btn.dataset.raidId;
          if (this.onScoutRaid) this.onScoutRaid(raidId);
        });
      });

      // Wire Explore button + dropdown — always ring 1 internally
      const durSelect = statusBody.querySelector('.dur-select');
      const exploreBtn = statusBody.querySelector('.explore-btn');
      if (exploreBtn && durSelect) {
        exploreBtn.addEventListener('click', () => {
          const totalDays = parseInt(durSelect.value);
          if (this.onSendMW) this.onSendMW(1, totalDays);
        });
      }

      // Join the Wardline button — only when perimeter < 100%
      const perimeterTarget = state.config?.perimeter?.targetStability || 100;
      const perimeterStability = state.mist?.perimeterStability || 0;
      if (perimeterStability < perimeterTarget) {
        const wardBtn = document.createElement('button');
        wardBtn.className = 'ring-btn wardline-btn';
        wardBtn.style.cssText = 'width: 100%; padding: 6px 12px; margin-top: 4px; text-align: center;';
        wardBtn.textContent = 'Join the Wardline';
        wardBtn.addEventListener('click', () => {
          if (this.onJoinWardline && mwChar) this.onJoinWardline(mwChar.id);
        });
        statusBody.appendChild(wardBtn);
      }
    } else {
      // MW is out — show trip info
      const canCancel = mw.departDay === state.time.day;

      let tripHtml = `
        <div class="item-row">
          <span class="item-name">Status</span>
          <span class="item-detail">${statusText}</span>
        </div>
        <div class="item-row">
          <span class="item-name">Days Out</span>
          <span class="item-detail">${mw.daysOut} / ${mw.totalDays || '?'}</span>
        </div>
      `;

      if (mwChar) {
        tripHtml += `
          <div class="item-row">
            <span class="item-name">${mwChar.name}</span>
            <span class="item-detail">${stat('body')} ${mwChar.body} \u00B7 ${stat('spirit')} ${mwChar.spirit}</span>
          </div>
        `;
      }

      if (canCancel) {
        tripHtml += '<button class="btn-secondary cancel-mw-btn" style="margin-top: 12px; width: 100%;">Abandon</button>';
      }

      statusBody.innerHTML = tripHtml;

      if (canCancel) {
        const cancelBtn = statusBody.querySelector('.cancel-mw-btn');
        if (cancelBtn) {
          cancelBtn.addEventListener('click', () => {
            if (this.onCancelMW) this.onCancelMW();
          });
        }
      }
    }

    statusHeader.addEventListener('click', () => {
      const isCollapsed = statusHeader.classList.toggle('collapsed');
      if (isCollapsed) statusBody.classList.add('hidden');
      else statusBody.classList.remove('hidden');
    });

    statusSection.appendChild(statusHeader);
    statusSection.appendChild(statusBody);
    container.appendChild(statusSection);

    // Active Expedition Status
    const activeExp = state.exploration.activeExpedition;
    if (activeExp) {
      container.appendChild(this._renderActiveExpedition(activeExp, state));
    }

    // Expedition Locations (minor locations available for troop expeditions)
    const minorLocs = state.exploration.locations?.minor || [];
    if (minorLocs.length > 0) {
      container.appendChild(this._renderExpeditionLocations(minorLocs, state, activeExp));
    }

    // Findings (contextual — shows while MW is out)
    const findings = mw.findings || [];
    if (findings.length > 0) {
      const findingsSection = document.createElement('div');
      findingsSection.className = 'collapsible-section';

      const findingsHeader = document.createElement('div');
      findingsHeader.className = 'collapsible-header';
      findingsHeader.innerHTML = `
        <span class="collapsible-caret">\u25BC</span>
        <span class="collapsible-title">Recent Discoveries (${findings.length})</span>
      `;

      const findingsBody = document.createElement('div');
      findingsBody.className = 'collapsible-body';
      findingsBody.innerHTML = findings.map(f => `
        <div class="item-row">
          <span class="item-name">${typeof f === 'string' ? f : f.name || 'Finding'}</span>
          <span class="item-detail">${typeof f === 'object' && f.type ? f.type : ''}</span>
        </div>
      `).join('');

      findingsHeader.addEventListener('click', () => {
        const isCollapsed = findingsHeader.classList.toggle('collapsed');
        if (isCollapsed) findingsBody.classList.add('hidden');
        else findingsBody.classList.remove('hidden');
      });

      findingsSection.appendChild(findingsHeader);
      findingsSection.appendChild(findingsBody);
      container.appendChild(findingsSection);
    }

    // Completed Expeditions (history)
    const completedExps = state.exploration.completedExpeditions || [];
    if (completedExps.length > 0) {
      const histSection = document.createElement('div');
      histSection.className = 'collapsible-section';

      const histHeader = document.createElement('div');
      histHeader.className = 'collapsible-header collapsed';
      histHeader.innerHTML = `
        <span class="collapsible-caret">\u25BC</span>
        <span class="collapsible-title">Expedition History (${completedExps.length})</span>
      `;

      const histBody = document.createElement('div');
      histBody.className = 'collapsible-body hidden';
      histBody.innerHTML = completedExps.map(exp => {
        const loot = Object.entries(exp.resourcesReturned || {}).filter(([,v]) => v > 0).map(([k,v]) => `${v} ${k}`).join(', ');
        return `
          <div class="item-row">
            <span class="item-name">${exp.locationName}</span>
            <span class="item-detail">Day ${exp.departDay}\u2013${exp.returnDay}${loot ? ' \u00B7 ' + loot : ''}</span>
          </div>
        `;
      }).join('');

      histHeader.addEventListener('click', () => {
        const isCollapsed = histHeader.classList.toggle('collapsed');
        if (isCollapsed) histBody.classList.add('hidden');
        else histBody.classList.remove('hidden');
      });

      histSection.appendChild(histHeader);
      histSection.appendChild(histBody);
      container.appendChild(histSection);
    }

    return container;
  }
  /**
   * Render active expedition status panel
   */
  _renderActiveExpedition(exp, state) {
    const section = document.createElement('div');
    section.className = 'collapsible-section';

    const header = document.createElement('div');
    header.className = 'collapsible-header';

    let statusText = 'Traveling';
    let statusClass = 'status-warn';
    if (exp.status === 'working') { statusText = 'Working'; statusClass = 'status-good'; }
    if (exp.status === 'returning') { statusText = 'Returning'; statusClass = 'status-good'; }

    header.innerHTML = `
      <span class="collapsible-caret">\u25BC</span>
      <span class="collapsible-title">Active Expedition</span>
      <span class="${statusClass}" style="margin-left: auto;">${statusText}</span>
    `;

    const body = document.createElement('div');
    body.className = 'collapsible-body';

    const chars = state.population.characters;
    const memberNames = exp.members.map(id => {
      const c = chars.find(ch => ch.id === id);
      return c ? c.name : id;
    }).join(', ');

    const lootSoFar = Object.entries(exp.harvestedResources || {})
      .filter(([, v]) => v > 0)
      .map(([k, v]) => `${v} ${k}`)
      .join(', ');

    const challengesDone = (exp.resolvedChallenges || []).length;
    const challengesTotal = (exp.challenges || []).length;

    let html = `
      <div class="item-row">
        <span class="item-name">Location</span>
        <span class="item-detail">${exp.locationName}</span>
      </div>
      <div class="item-row">
        <span class="item-name">Status</span>
        <span class="item-detail">${statusText}</span>
      </div>
    `;

    if (exp.status === 'traveling') {
      html += `
        <div class="item-row">
          <span class="item-name">Travel</span>
          <span class="item-detail">${exp.travelDaysRemaining}d remaining</span>
        </div>
      `;
    }

    if (exp.status === 'working') {
      html += `
        <div class="item-row">
          <span class="item-name">Work Days</span>
          <span class="item-detail">${exp.daysAtSite} / ${exp.daysAtSiteTotal}</span>
        </div>
        <div class="item-row">
          <span class="item-name">Challenges</span>
          <span class="item-detail">${challengesDone} / ${challengesTotal} resolved</span>
        </div>
      `;
    }

    html += `
      <div class="item-row">
        <span class="item-name">Party</span>
        <span class="item-detail">${memberNames}</span>
      </div>
    `;

    if (lootSoFar) {
      html += `
        <div class="item-row">
          <span class="item-name">Collected</span>
          <span class="item-detail">${lootSoFar}</span>
        </div>
      `;
    }

    // Cancel button (departure day only)
    if (exp.departDay === state.time.day) {
      html += '<button class="btn-secondary cancel-exp-btn" style="margin-top: 12px; width: 100%;">Abandon Expedition</button>';
    }

    body.innerHTML = html;

    if (exp.departDay === state.time.day) {
      const cancelBtn = body.querySelector('.cancel-exp-btn');
      if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
          if (this.onCancelExpedition) this.onCancelExpedition();
        });
      }
    }

    header.addEventListener('click', () => {
      const isCollapsed = header.classList.toggle('collapsed');
      if (isCollapsed) body.classList.add('hidden');
      else body.classList.remove('hidden');
    });

    section.appendChild(header);
    section.appendChild(body);
    return section;
  }

  /**
   * Render expedition locations with send-expedition flow
   */
  _renderExpeditionLocations(locations, state, activeExp) {
    const section = document.createElement('div');
    section.className = 'collapsible-section';

    const header = document.createElement('div');
    header.className = 'collapsible-header';
    header.innerHTML = `
      <span class="collapsible-caret">\u25BC</span>
      <span class="collapsible-title">Expedition Sites (${locations.length})</span>
    `;

    const body = document.createElement('div');
    body.className = 'collapsible-body';

    const config = state.config;
    const mw = state.population.characters.find(c => c.role === 'mistwalker');
    const mwHome = state.exploration.mwState.status === 'home';
    const canSend = mwHome && !activeExp && mw && mw.health === 'active';

    // Challenge type icons
    const typeIcons = { engineering: '\u2692', scholarly: '\u{1F4D6}', combat: '\u2694', spiritual: '\u2728' };

    let html = '';
    for (const loc of locations) {
      const challengeInfo = (loc.challenges || []).map(c => {
        const icon = typeIcons[c.type] || '\u2022';
        const reqTag = c.required ? ' (req)' : '';
        return `${icon} ${c.name}${reqTag}`;
      }).join(' \u00B7 ');

      const rewardInfo = Object.entries(loc.rewards || {}).map(([k, v]) => `${k} ${v.min}\u2013${v.max}`).join(', ');
      const visitedTag = loc.visited ? ' <span class="status-warn">[visited]</span>' : '';
      const dangerTag = loc.dangerLevel > 1 ? ` <span class="status-bad">Danger ${loc.dangerLevel}</span>` : '';

      html += `
        <div class="location-card" data-loc-id="${loc.id}" style="padding: 8px 0; border-bottom: 1px solid var(--panel-border);">
          <div class="item-row">
            <span class="item-name">${loc.name}${visitedTag}${dangerTag}</span>
          </div>
          <div style="color: var(--text-secondary); font-size: 0.85em; margin: 2px 0;">${loc.description || ''}</div>
          <div style="color: var(--text-secondary); font-size: 0.85em;">${challengeInfo}</div>
          <div style="color: var(--accent-gold); font-size: 0.85em;">Rewards: ${rewardInfo || 'none'}</div>
          ${canSend ? `<button class="ring-btn send-exp-btn" data-loc-id="${loc.id}" style="margin-top: 6px; width: 100%;">Send Expedition</button>` : ''}
        </div>
      `;
    }

    body.innerHTML = html;

    // Wire send buttons — opens party assembly inline
    if (canSend) {
      body.querySelectorAll('.send-exp-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const locId = btn.dataset.locId;
          const loc = locations.find(l => l.id === locId);
          if (loc) this._showPartyAssembly(btn.parentElement, loc, state);
        });
      });
    }

    header.addEventListener('click', () => {
      const isCollapsed = header.classList.toggle('collapsed');
      if (isCollapsed) body.classList.add('hidden');
      else body.classList.remove('hidden');
    });

    section.appendChild(header);
    section.appendChild(body);
    return section;
  }

  /**
   * Show inline party assembly below a location card
   */
  _showPartyAssembly(cardEl, location, state) {
    // Close ALL open assembly panels across all location cards
    const allPanels = document.querySelectorAll('.party-assembly');
    let wasOpen = false;
    allPanels.forEach(p => {
      if (p.parentElement === cardEl) wasOpen = true;
      p.remove();
    });
    // If this card's panel was already open, just close it (toggle)
    if (wasOpen) return;

    const config = state.config;
    const expConfig = config.expedition || {};
    const chars = state.population.characters;

    const mw = chars.find(c => c.role === 'mistwalker');
    const mwSpirit = mw.spirit + (mw.modifiers || []).reduce((s, m) => s + (m.statBonuses?.spirit || 0), 0);
    const mwRange = expConfig.mwRangeBySpirit?.[mwSpirit] || 5;
    const travelDays = (config.exploration?.ringTravelDays || [1, 4, 7, 10])[0] || 1; // always ring 1
    const maxDaysAtSite = mwRange - (travelDays * 2);

    if (maxDaysAtSite < 1) {
      cardEl.insertAdjacentHTML('beforeend', '<div class="party-assembly" style="color: var(--status-bad); padding: 8px;">MW range too short to reach this location and work.</div>');
      return;
    }

    // Find available characters (not dead, lost, injured, training, or on expedition)
    const available = chars.filter(c =>
      c.health === 'active' &&
      c.assignment !== 'expedition' &&
      !c.training &&
      c.role !== 'mistwalker' // MW auto-included
    );

    const priests = available.filter(c => c.role === 'priest');

    if (priests.length === 0) {
      cardEl.insertAdjacentHTML('beforeend', '<div class="party-assembly" style="color: var(--status-bad); padding: 8px;">No healthy priest available to shield the party.</div>');
      return;
    }

    const panel = document.createElement('div');
    panel.className = 'party-assembly';
    panel.style.cssText = 'border: 1px solid var(--accent-gold); padding: 10px; margin-top: 8px; border-radius: 4px;';

    // Priest selection (determines capacity)
    const defaultPriest = priests[0];
    const priestSpirit = defaultPriest.spirit + (defaultPriest.modifiers || []).reduce((s, m) => s + (m.statBonuses?.spirit || 0), 0);
    let capacity = priestSpirit * (expConfig.capacityPerSpirit || 1);

    // Header (non-collapsible, just for structure)
    const assemblyHeader = document.createElement('div');
    assemblyHeader.style.cssText = 'color: var(--accent-gold); font-weight: bold; margin-bottom: 6px;';
    assemblyHeader.textContent = `Assemble Party for ${location.name}`;
    panel.appendChild(assemblyHeader);

    const infoLine = document.createElement('div');
    infoLine.style.cssText = 'font-size: 0.85em; color: var(--text-secondary); margin-bottom: 6px;';
    infoLine.textContent = `Range: ${mwRange}d \u00B7 Travel: ${travelDays}d each way \u00B7 Max work days: ${maxDaysAtSite}`;
    panel.appendChild(infoLine);

    // Auto-members: MW + Priest
    const mwLine = document.createElement('div');
    mwLine.style.cssText = 'margin-bottom: 4px;';
    mwLine.innerHTML = `<span style="color: var(--accent-gold);">\u2713</span> ${mw.name} (Mistwalker) \u2014 leads`;
    panel.appendChild(mwLine);

    // Priest line / selector
    let selectedPriestId = defaultPriest.id;

    if (priests.length === 1) {
      const priestLine = document.createElement('div');
      priestLine.style.cssText = 'margin-bottom: 4px;';
      priestLine.innerHTML = `<span style="color: var(--accent-gold);">\u2713</span> ${defaultPriest.name} (${role('priest')}) \u2014 shields (capacity: ${capacity})`;
      panel.appendChild(priestLine);
    } else {
      const priestRow = document.createElement('div');
      priestRow.style.cssText = 'margin-bottom: 4px;';
      const priestSelect = document.createElement('select');
      priestSelect.className = 'priest-select';
      priestSelect.style.cssText = 'background: var(--panel-bg); color: var(--text-primary); border: 1px solid var(--panel-border); padding: 2px 4px;';
      for (const p of priests) {
        const pSpirit = p.spirit + (p.modifiers || []).reduce((s, m) => s + (m.statBonuses?.spirit || 0), 0);
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = `${p.name} (Spirit ${pSpirit}, cap ${pSpirit})`;
        priestSelect.appendChild(opt);
      }
      priestSelect.addEventListener('change', () => {
        selectedPriestId = priestSelect.value;
        updateMemberButtons();
      });
      priestRow.appendChild(document.createTextNode('Priest: '));
      priestRow.appendChild(priestSelect);
      panel.appendChild(priestRow);
    }

    // Free slots info
    const others = available.filter(c => c.role !== 'priest');
    const slotsInfo = document.createElement('div');
    slotsInfo.className = 'slots-info';
    slotsInfo.style.cssText = 'margin: 6px 0; font-size: 0.85em; color: var(--text-secondary);';
    panel.appendChild(slotsInfo);

    // Track selected members
    const selectedMembers = new Set();

    // Member toggle buttons — wrapped in nav-group so keyboard nav finds them
    const memberGroup = document.createElement('div');
    memberGroup.className = 'nav-group';
    memberGroup.style.cssText = 'display: flex; flex-direction: column; gap: 4px; margin-bottom: 8px;';
    panel.appendChild(memberGroup);

    // Build member buttons
    const memberButtons = [];
    for (const c of others) {
      const roleLabel = role(c.role);
      const btn = document.createElement('button');
      btn.className = 'ring-btn member-toggle';
      btn.dataset.charId = c.id;
      btn.style.cssText = 'width: 100%; padding: 5px 10px; text-align: left; display: flex; justify-content: space-between;';
      btn.innerHTML = `
        <span style="font-size: 0.85em;">${c.name} (${roleLabel})</span>
        <span style="font-size: 0.75em; opacity: 0.7;">${statLine(c)}</span>
      `;
      btn.addEventListener('click', () => {
        if (selectedMembers.has(c.id)) {
          selectedMembers.delete(c.id);
        } else {
          selectedMembers.add(c.id);
        }
        updateMemberButtons();
      });
      memberGroup.appendChild(btn);
      memberButtons.push({ btn, charId: c.id });
    }

    const updateMemberButtons = () => {
      // Recalculate capacity from selected priest
      const sp2 = (chars.find(c2 => c2.id === selectedPriestId) || defaultPriest);
      const sp = sp2.spirit + (sp2.modifiers || []).reduce((s, m) => s + (m.statBonuses?.spirit || 0), 0);
      const cap = sp * (expConfig.capacityPerSpirit || 1);
      const free = cap - 2;

      slotsInfo.textContent = `Party slots: ${cap} total (${free} free, ${selectedMembers.size} selected)`;

      for (const { btn, charId } of memberButtons) {
        const isSelected = selectedMembers.has(charId);
        if (isSelected) {
          btn.style.borderColor = 'var(--accent-gold)';
          btn.style.color = 'var(--accent-gold)';
        } else {
          btn.style.borderColor = '';
          btn.style.color = '';
        }
        // Disable unselected buttons when at capacity
        if (!isSelected && selectedMembers.size >= free) {
          btn.disabled = true;
          btn.style.opacity = '0.4';
        } else {
          btn.disabled = false;
          btn.style.opacity = '';
        }
      }
    };

    updateMemberButtons();

    // Duration picker — also in nav-group
    const durationRow = document.createElement('div');
    durationRow.style.cssText = 'margin-bottom: 8px;';
    const daysLabel = document.createTextNode('Days at site: ');
    const daysSelect = document.createElement('select');
    daysSelect.className = 'days-select';
    daysSelect.style.cssText = 'background: var(--panel-bg); color: var(--text-primary); border: 1px solid var(--panel-border); padding: 2px 4px;';
    for (let d = 1; d <= maxDaysAtSite; d++) {
      const opt = document.createElement('option');
      opt.value = d;
      opt.textContent = `${d} day${d !== 1 ? 's' : ''}`;
      if (d === maxDaysAtSite) opt.selected = true;
      daysSelect.appendChild(opt);
    }
    durationRow.appendChild(daysLabel);
    durationRow.appendChild(daysSelect);
    panel.appendChild(durationRow);

    // Confirm button — ring-btn so keyboard Enter triggers it
    const confirmRow = document.createElement('div');
    confirmRow.className = 'nav-group';
    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'ring-btn confirm-exp-btn';
    confirmBtn.style.cssText = 'width: 100%; padding: 6px 12px; text-align: center; color: var(--accent-gold); border-color: var(--accent-gold);';
    confirmBtn.textContent = 'Confirm Expedition';
    confirmBtn.addEventListener('click', () => {
      const memberIds = [mw.id, selectedPriestId];
      for (const id of selectedMembers) memberIds.push(id);
      const daysAtSite = parseInt(daysSelect.value);
      if (this.onSendExpedition) {
        this.onSendExpedition(location.id, memberIds, daysAtSite);
      }
    });
    confirmRow.appendChild(confirmBtn);
    panel.appendChild(confirmRow);

    cardEl.appendChild(panel);
  }
}

export default ExploreTab;
