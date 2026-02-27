/**
 * Dashboard Tab - Strategic overview
 */

import { LEX, role, assignment, health, resource, statLine, rolePlural } from '../lexicon.js?v=5z';
import CreaturesModule from '../../core/modules/creatures.js?v=5z';
import DoctrinesModule from '../../core/modules/doctrines.js?v=5z';

export class DashboardTab {
  constructor(onAdvanceDay = null, callbacks = {}) {
    this.onAdvanceDay = onAdvanceDay;
    this.callbacks = callbacks; // { onSendMW, onTrain, onToggleTraps, onSwitchTab }
  }

  render(state) {
    const container = document.createElement('div');
    const { time, resources, mist, population, combat, exploration, knowledge, events } = state;
    const config = state.config;

    // ── 1. Day heading + comment of the day ──
    {
      const feed = (events && events.feed) || [];
      const todayEvents = feed.filter(e => e.day === time.day);
      // Pick the most important event: mythic > critical > notable, skip routine
      const priority = ['mythic', 'critical', 'notable'];
      let comment = 'The settlement rests undisturbed.';
      for (const p of priority) {
        const match = todayEvents.find(e => e.classification === p);
        if (match) { comment = match.text; break; }
      }

      const dayHeading = document.createElement('div');
      dayHeading.style.cssText = 'padding: 4px 0 8px 0;';
      dayHeading.innerHTML = `
        <span style="font-size: 1.1em; color: var(--text-secondary);">Day ${time.day}</span>
        <span style="font-size: 0.85em; color: var(--text-muted); margin-left: 12px;">${comment}</span>
      `;
      container.appendChild(dayHeading);
    }

    // ── 2. Quick Actions (context-sensitive) ──
    const actions = this._getAvailableActions(state);
    if (actions.length > 0) {
      const qaSection = document.createElement('div');
      qaSection.className = 'collapsible-section';

      const qaHeader = document.createElement('div');
      qaHeader.className = 'collapsible-header';
      qaHeader.innerHTML = `
        <span class="collapsible-caret">\u25BC</span>
        <span class="collapsible-title">Orders</span>
        <span class="item-detail" style="margin-left: auto;">${actions.length}</span>
      `;

      const qaBody = document.createElement('div');
      qaBody.className = 'collapsible-body';

      const actionList = document.createElement('div');
      actionList.className = 'nav-group';
      actionList.style.cssText = 'display: flex; flex-direction: column; gap: 6px;';

      actions.forEach(action => {
        const row = document.createElement('div');
        row.style.cssText = 'display: flex; align-items: center; gap: 8px;';

        if (action.type === 'train') {
          const name = document.createElement('span');
          name.style.cssText = 'color: var(--text-secondary); font-size: 0.85em; width: 120px; flex-shrink: 0;';
          name.textContent = action.label;
          row.appendChild(name);

          const stats = document.createElement('span');
          stats.style.cssText = 'color: var(--text-muted); font-size: 0.8em; width: 90px; flex-shrink: 0; font-family: monospace;';
          stats.textContent = action.detail;
          row.appendChild(stats);

          action.roles.forEach(r => {
            const roleBtn = document.createElement('button');
            roleBtn.className = 'ring-btn';
            roleBtn.style.cssText = 'padding: 4px 10px; font-size: 0.8em; flex: 0 0 auto;';
            roleBtn.textContent = r.label;
            if (!r.eligible) {
              roleBtn.disabled = true;
              roleBtn.title = r.req;
            }
            roleBtn.addEventListener('click', () => r.handler());
            row.appendChild(roleBtn);
          });
        } else if (action.type === 'assign') {
          const name = document.createElement('span');
          name.style.cssText = 'color: var(--text-secondary); font-size: 0.85em; width: 120px; flex-shrink: 0;';
          name.textContent = action.label;
          row.appendChild(name);

          const detail = document.createElement('span');
          detail.style.cssText = 'color: var(--text-muted); font-size: 0.8em; width: 90px; flex-shrink: 0; font-family: monospace;';
          detail.textContent = action.detail;
          row.appendChild(detail);

          action.assignments.forEach(a => {
            const assignBtn = document.createElement('button');
            assignBtn.className = 'ring-btn';
            assignBtn.style.cssText = 'padding: 4px 10px; font-size: 0.8em; flex: 0 0 auto;';
            assignBtn.textContent = a.label;
            assignBtn.addEventListener('click', () => a.handler());
            row.appendChild(assignBtn);
          });
        } else if (action.type === 'equip') {
          row.style.cssText = 'display: flex; align-items: center; gap: 8px;';

          // Left side: name on top, stats underneath
          const info = document.createElement('div');
          info.style.cssText = 'display: flex; flex-direction: column; flex: 0 0 auto; min-width: 120px;';
          const name = document.createElement('span');
          name.style.cssText = 'color: var(--accent-gold); font-size: 0.85em;';
          name.textContent = action.label;
          info.appendChild(name);
          const detail = document.createElement('span');
          detail.style.cssText = 'color: var(--text-muted); font-size: 0.75em; font-family: monospace;';
          detail.textContent = action.detail;
          info.appendChild(detail);
          row.appendChild(info);

          // Right side: compact dropdown
          const select = document.createElement('select');
          select.className = 'ring-btn';
          select.style.cssText = 'padding: 3px 6px; font-size: 0.78em; background: var(--surface); color: var(--text); border: 1px solid var(--accent-gold); border-radius: 4px; max-width: 140px; cursor: pointer; margin-left: auto;';
          const placeholder = document.createElement('option');
          placeholder.value = '';
          placeholder.textContent = 'Give to...';
          placeholder.disabled = true;
          placeholder.selected = true;
          select.appendChild(placeholder);
          action.characters.forEach((c, i) => {
            const opt = document.createElement('option');
            opt.value = i;
            opt.textContent = c.label;
            select.appendChild(opt);
          });
          select.addEventListener('change', () => {
            const idx = parseInt(select.value);
            if (!isNaN(idx)) action.characters[idx].handler();
          });
          row.appendChild(select);
        } else if (action.type === 'mw_actions') {
          row.style.cssText = 'display: flex; align-items: center; gap: 8px; margin-bottom: 6px;';

          const dispatchBtn = document.createElement('button');
          dispatchBtn.className = 'ring-btn';
          dispatchBtn.style.cssText = 'flex: 1; padding: 6px 12px; text-align: left; display: flex; justify-content: space-between;';
          dispatchBtn.innerHTML = `
            <span style="font-size: 0.85em;">${action.dispatch.label}</span>
            <span style="font-size: 0.75em; opacity: 0.7;">${action.dispatch.detail}</span>
          `;
          dispatchBtn.addEventListener('click', action.dispatch.handler);
          row.appendChild(dispatchBtn);

          if (action.wardline) {
            const wardBtn = document.createElement('button');
            wardBtn.className = 'ring-btn';
            wardBtn.style.cssText = 'flex: 0 0 auto; padding: 6px 12px; font-size: 0.8em; white-space: nowrap;';
            wardBtn.innerHTML = `
              <span>${action.wardline.label}</span>
              <span style="font-size: 0.85em; opacity: 0.7; margin-left: 4px;">${action.wardline.detail}</span>
            `;
            wardBtn.addEventListener('click', action.wardline.handler);
            row.appendChild(wardBtn);
          }
        } else {
          const btn = document.createElement('button');
          btn.className = 'ring-btn';
          btn.style.cssText = 'width: 100%; padding: 6px 12px; text-align: left; display: flex; justify-content: space-between;';
          btn.innerHTML = `
            <span style="font-size: 0.85em;">${action.label}</span>
            <span style="font-size: 0.75em; opacity: 0.7;">${action.detail}</span>
          `;
          btn.addEventListener('click', action.handler);
          row.appendChild(btn);
        }

        actionList.appendChild(row);
      });

      qaBody.appendChild(actionList);

      qaHeader.addEventListener('click', () => {
        const isCollapsed = qaHeader.classList.toggle('collapsed');
        if (isCollapsed) qaBody.classList.add('hidden');
        else qaBody.classList.remove('hidden');
      });

      qaSection.appendChild(qaHeader);
      qaSection.appendChild(qaBody);
      container.appendChild(qaSection);
    }

    // ── 2b. Infirmary (shown when anyone is injured) ──
    {
      const injured = population.characters.filter(
        c => c.health === 'injured' || c.health === 'gravely_injured'
      );
      if (injured.length > 0) {
        const infirmary = population.infirmary || [];

        const infSection = document.createElement('div');
        infSection.className = 'collapsible-section';

        const infHeader = document.createElement('div');
        infHeader.className = 'collapsible-header';
        infHeader.innerHTML = `
          <span class="collapsible-caret">\u25BC</span>
          <span class="collapsible-title">Sick Ward</span>
          <span class="status-bad" style="margin-left: auto;">${injured.length} injured</span>
        `;

        const infBody = document.createElement('div');
        infBody.className = 'collapsible-body';

        let infHtml = '';
        for (const patient of injured) {
          const healthLabel = health(patient.health);
          const healthColor = patient.health === 'gravely_injured' ? 'var(--danger, #e55)' : 'var(--warning, #f39c12)';
          const daysLeft = patient.healingDaysRemaining != null ? `${patient.healingDaysRemaining}d remaining` : '';
          const roleLabel = role(patient.role);

          // Find if a priest is tending this patient
          const pairing = infirmary.find(p => p.patientId === patient.id);
          const healer = pairing ? population.characters.find(c => c.id === pairing.priestId) : null;
          const healerText = healer ? `Mender: ${healer.name}` : 'No mender assigned';
          const healerColor = healer ? 'var(--success)' : 'var(--text-muted)';

          infHtml += `
            <div class="item-row" style="flex-direction: column; align-items: stretch; gap: 2px; border-left: 3px solid ${healthColor}; padding-left: 8px;">
              <div style="display: flex; justify-content: space-between;">
                <span style="color: ${healthColor}; font-weight: bold;">${patient.name}</span>
                <span style="color: var(--text-muted); font-size: 0.85em;">${roleLabel}</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.8em;">
                <span style="color: ${healthColor};">${healthLabel} \u00B7 ${daysLeft}</span>
                <span style="color: ${healerColor};">${healerText}</span>
              </div>
            </div>
          `;
        }

        infBody.innerHTML = infHtml;

        infHeader.addEventListener('click', () => {
          const isCollapsed = infHeader.classList.toggle('collapsed');
          if (isCollapsed) infBody.classList.add('hidden');
          else infBody.classList.remove('hidden');
        });

        infSection.appendChild(infHeader);
        infSection.appendChild(infBody);
        container.appendChild(infSection);
      }
    }

    // ── 3. Mistwalker ──
    {
      const mwState = exploration.mwState;
      const expeditions = exploration.expeditions || [];
      const lastExp = expeditions.length > 0 ? expeditions[expeditions.length - 1] : null;
      // Day-offset: returnDay is stamped during EXPLORATION phase before day increments
      const justReturned = lastExp && lastExp.items.length > 0 &&
        (lastExp.returnDay === time.day || lastExp.returnDay === time.day - 1);

      const mwSection = document.createElement('div');
      mwSection.className = 'collapsible-section';

      const mwHeader = document.createElement('div');
      mwHeader.className = 'collapsible-header';

      // Status text lives in the header bar — show days as elapsed/total
      const activeExp = exploration.activeExpedition;

      let statusText = 'Awaiting orders';
      if (activeExp) {
        if (activeExp.status === 'traveling') statusText = `Expedition en route to ${activeExp.locationName}`;
        else if (activeExp.status === 'working') statusText = `Expedition laboring at ${activeExp.locationName} (${activeExp.daysAtSite}/${activeExp.daysAtSiteTotal}d)`;
        else if (activeExp.status === 'returning') statusText = `Expedition returning from ${activeExp.locationName}`;
      } else if (justReturned) {
        statusText = 'Just returned from the mist';
      } else if (mwState.status !== 'home') {
        const total = mwState.totalDays || '?';
        const elapsed = mwState.daysOut || 0;
        if (mwState.status === 'traveling_out') statusText = `Venturing into the mist \u00B7 ${elapsed}/${total}`;
        else if (mwState.status === 'exploring') statusText = `Exploring the mist \u00B7 ${elapsed}/${total}`;
        else if (mwState.status === 'returning') statusText = `Returning home \u00B7 ${elapsed}/${total}`;
        else if (mwState.status === 'rescuing') statusText = `Searching for ${mwState.rescueTargetName || 'someone'}`;
        else if (mwState.status === 'scouting') statusText = `Scouting incoming raid`;
      }

      const statusClass = justReturned ? 'status-good' : 'item-detail';

      mwHeader.innerHTML = `
        <span class="collapsible-caret">\u25BC</span>
        <span class="collapsible-title">The Mistwalker</span>
        <span class="${statusClass}" style="margin-left: auto;">${statusText}</span>
      `;

      const mwBody = document.createElement('div');
      mwBody.className = 'collapsible-body';
      let mwHtml = '';

      // Body = haul on return day, otherwise "No new items"
      if (justReturned) {
        const typeLabels = {
          clue: 'Research Clue', lore: 'Lore Fragment', nature_hint: 'Nature Insight',
          source_clue: 'Source Clue', artifact: 'Artifact', map_fragment: 'Map Fragment',
          herbs_or_cache: 'Herbs / Cache', essence: 'Essence', minor_location: 'Location',
          lost_person: 'Survivor', encounter: 'Encounter',
        };

        // Priority sort: artifacts & weapons first, then essences, then everything else
        const typePriority = {
          artifact: 0, essence: 1, lost_person: 2, minor_location: 3,
          map_fragment: 4, nature_hint: 5, source_clue: 6, lore: 7,
          clue: 8, herbs_or_cache: 9, encounter: 10,
        };
        const sorted = [...lastExp.items].sort((a, b) =>
          (typePriority[a.type] ?? 99) - (typePriority[b.type] ?? 99)
        );

        mwHtml += `<div style="color: var(--text-muted); font-size: 0.8em; padding: 4px 8px;">Haul from expedition:</div>`;
        for (const item of sorted) {
          const label = typeLabels[item.type] || item.type;
          const isHighPriority = item.type === 'artifact' || item.type === 'essence';
          const borderColor = isHighPriority ? 'var(--accent-gold)' : 'var(--text-muted)';
          const nameColor = isHighPriority ? 'color: var(--accent-gold);' : '';
          mwHtml += `
            <div class="item-row" style="border-left: 3px solid ${borderColor};">
              <span class="item-name" style="${nameColor}">${item.name}</span>
              <span class="item-detail">${label}</span>
            </div>
          `;
        }
      } else {
        const awayMsg = mwState.status !== 'home'
          ? 'Discoveries await the Mistwalker\'s return'
          : 'No discoveries to report';
        mwHtml = `
          <div class="item-row">
            <span class="item-name" style="color: var(--text-muted);">${awayMsg}</span>
          </div>
        `;
      }

      mwBody.innerHTML = mwHtml;

      mwHeader.addEventListener('click', () => {
        const isCollapsed = mwHeader.classList.toggle('collapsed');
        if (isCollapsed) mwBody.classList.add('hidden');
        else mwBody.classList.remove('hidden');
      });

      mwSection.appendChild(mwHeader);
      mwSection.appendChild(mwBody);
      container.appendChild(mwSection);
    }

    // ── 3a. Expedition Sites (informational) ──
    {
      const minorLocs = exploration.locations?.minor || [];
      if (minorLocs.length > 0) {
        const expConfig = config.expedition || {};
        const typeIcons = { engineering: '\u2692', scholarly: '\u{1F4D6}', combat: '\u2694', spiritual: '\u2728' };
        const challengeRoles = expConfig.challengeRoles || {};

        const sitesSection = document.createElement('div');
        sitesSection.className = 'collapsible-section';

        const sitesHeader = document.createElement('div');
        sitesHeader.className = 'collapsible-header';

        const activeExp = exploration.activeExpedition;
        const mwChar = population.characters.find(c => c.role === 'mistwalker');
        const canSend = !activeExp && mwChar && mwChar.health === 'active' && exploration.mwState.status === 'home';
        const headerDetail = activeExp
          ? `<span class="status-warn" style="margin-left: auto;">Expedition active</span>`
          : canSend
            ? `<span class="status-good" style="margin-left: auto;">${minorLocs.length} available</span>`
            : `<span class="item-detail" style="margin-left: auto;">${minorLocs.length} discovered</span>`;

        sitesHeader.innerHTML = `
          <span class="collapsible-caret">\u25BC</span>
          <span class="collapsible-title">Expedition Sites</span>
          ${headerDetail}
        `;

        const sitesBody = document.createElement('div');
        sitesBody.className = 'collapsible-body';

        let sitesHtml = '';
        for (const loc of minorLocs) {
          const rolesNeeded = (loc.challenges || [])
            .filter(c => c.required)
            .map(c => {
              const icon = typeIcons[c.type] || '\u2022';
              const role = challengeRoles[c.type] || c.type;
              return `${icon} ${role}`;
            })
            .join(', ');

          const rewardKeys = Object.keys(loc.rewards || {}).join(', ');
          const visitedMark = loc.visited ? ' \u00B7 visited' : '';

          sitesHtml += `
            <div class="item-row" data-nav-skip>
              <span class="item-name">${loc.name}</span>
              <span class="item-detail">${visitedMark ? 'visited' : ''}${rolesNeeded ? (visitedMark ? ' \u00B7 ' : '') + 'needs ' + rolesNeeded : ''}${rewardKeys ? ' \u2192 ' + rewardKeys : ''}</span>
            </div>
          `;
        }

        sitesBody.innerHTML = sitesHtml;

        sitesHeader.addEventListener('click', () => {
          const isCollapsed = sitesHeader.classList.toggle('collapsed');
          if (isCollapsed) sitesBody.classList.add('hidden');
          else sitesBody.classList.remove('hidden');
        });

        sitesSection.appendChild(sitesHeader);
        sitesSection.appendChild(sitesBody);
        container.appendChild(sitesSection);
      }
    }

    // ── 3b. Perils — REMOVED (info available in header bar) ──
    // Combat Preparation panel still appears when raids are active
    {
      const activeRaids = (combat.activeRaids || []).filter(r => r.status !== 'resolved');
      if (activeRaids.length > 0) {
        const combatSection = document.createElement('div');
        combatSection.className = 'collapsible-section';

        const combatHeader = document.createElement('div');
        combatHeader.className = 'collapsible-header';
        combatHeader.innerHTML = `
          <span class="collapsible-caret">\u25BC</span>
          <span class="collapsible-title">Active Raid</span>
          <span class="status-bad" style="margin-left: auto;">${activeRaids.length} threat${activeRaids.length > 1 ? 's' : ''}</span>
        `;

        const combatBody = document.createElement('div');
        combatBody.className = 'collapsible-body';

        for (const raid of activeRaids) {
          const prepPanel = this._renderCombatPrepPanel(raid, state);
          if (prepPanel) combatBody.appendChild(prepPanel);
        }

        combatHeader.addEventListener('click', () => {
          const isCollapsed = combatHeader.classList.toggle('collapsed');
          if (isCollapsed) combatBody.classList.add('hidden');
          else combatBody.classList.remove('hidden');
        });

        combatSection.appendChild(combatHeader);
        combatSection.appendChild(combatBody);
        container.appendChild(combatSection);
      }
    }

    // ── 4. Research & Discovery ──
    {
      const activeResearch = knowledge.activeResearch || [];
      const allCompleted = knowledge.completed || [];
      const recentCompleted = allCompleted.filter(c => c.completedDay >= time.day - 3);
      const pendingClues = (knowledge.clues || []).filter(c => c.status === 'perceived');
      const artifacts = knowledge.artifacts || [];
      const unidentified = artifacts.filter(a => !a.identified);
      const identified = artifacts.filter(a => a.identified && !a.equippedTo);

      const resSection = document.createElement('div');
      resSection.className = 'collapsible-section';

      const resHeader = document.createElement('div');
      resHeader.className = 'collapsible-header';

      let headerDetail = '';
      if (recentCompleted.length > 0) {
        headerDetail = `<span class="status-good" style="margin-left: auto;">${recentCompleted.length} recently completed</span>`;
      } else if (activeResearch.length > 0) {
        headerDetail = `<span class="item-detail" style="margin-left: auto;">${activeResearch.length} in progress</span>`;
      } else if (pendingClues.length > 0) {
        headerDetail = `<span class="item-detail" style="margin-left: auto;">${pendingClues.length} queued</span>`;
      }

      resHeader.innerHTML = `
        <span class="collapsible-caret">\u25BC</span>
        <span class="collapsible-title">Lore & Discovery</span>
        ${headerDetail}
      `;

      const resBody = document.createElement('div');
      resBody.className = 'collapsible-body';
      let resHtml = '';

      for (const done of recentCompleted) {
        const daysAgo = time.day - done.completedDay;
        const timeLabel = daysAgo === 0 ? 'today' : daysAgo === 1 ? 'yesterday' : `${daysAgo}d ago`;
        resHtml += `
          <div class="item-row" style="border-left: 3px solid var(--success);">
            <span class="item-name" style="color: var(--success);">\u2713 ${done.name || done.id}</span>
            <span class="item-detail">${timeLabel}</span>
          </div>
        `;
      }

      for (const art of identified) {
        resHtml += `
          <div class="item-row" style="border-left: 3px solid var(--accent-gold);">
            <span class="item-name" style="color: var(--accent-gold);">${art.name}</span>
            <span class="item-detail">Ready to equip</span>
          </div>
        `;
      }

      for (const active of activeResearch) {
        const daysLeft = active.daysRemaining != null ? Math.ceil(active.daysRemaining) : '?';
        resHtml += `
          <div class="item-row">
            <span class="item-name">${active.name || active.id}</span>
            <span class="item-detail">${daysLeft}d remaining</span>
          </div>
        `;
      }

      for (const art of unidentified) {
        resHtml += `
          <div class="item-row" style="opacity: 0.7;">
            <span class="item-name">${art.name}</span>
            <span class="item-detail">Unidentified</span>
          </div>
        `;
      }

      if (pendingClues.length > 0) {
        const preview = pendingClues.slice(0, 3);
        const moreCount = pendingClues.length - preview.length;
        resHtml += `<div style="color: var(--text-muted); font-size: 0.8em; margin-top: 8px; padding: 0 8px;">Queued: ${preview.map(c => c.name || c.id).join(', ')}${moreCount > 0 ? ` +${moreCount} more` : ''}</div>`;
      }

      if (resHtml === '') {
        resHtml = `
          <div class="item-row">
            <span class="item-name" style="color: var(--text-muted);">No lore under study</span>
            <span class="item-detail">The unknown beckons</span>
          </div>
        `;
      }

      resBody.innerHTML = resHtml;

      resHeader.addEventListener('click', () => {
        const isCollapsed = resHeader.classList.toggle('collapsed');
        if (isCollapsed) resBody.classList.add('hidden');
        else resBody.classList.remove('hidden');
      });

      resSection.appendChild(resHeader);
      resSection.appendChild(resBody);
      container.appendChild(resSection);
    }

    // ── 5. Excavation — DISABLED (digging temporarily removed) ──

    // ── 6. Mist Currents — DISABLED (rings temporarily removed) ──

    // ── 7. Source of the Mist — DISABLED (concept on hold) ──

    return container;
  }

  /**
   * Render combat preparation panel for an active raid.
   * Fully transparent: shows creature traits, available counters, soldier/priest assignments.
   */
  _renderCombatPrepPanel(raid, state) {
    const cb = this.callbacks;
    const { population, combat } = state;
    const selections = combat.pendingSelections?.[raid.id];
    const isConfirmed = selections?.ready;

    // Look up creature type for trait info
    const creatureType = (state.creatures?.types || []).find(c => c.id === raid.creatureTypeId);
    const activeTraits = creatureType
      ? CreaturesModule.getActiveTraits(creatureType, raid.size)
      : [];
    const sizeLabel = { sm: 'Small', m: 'Medium', l: 'Large' }[raid.size] || raid.size;

    // Get relevant counters for these traits
    const allCounters = DoctrinesModule.getCountersForTraits(activeTraits);
    const soldierDoctrines = allCounters.filter(c => c.role === 'soldier');
    const priestActions = allCounters.filter(c => c.role === 'priest');

    // Available soldiers and priests
    const soldiers = population.characters.filter(
      c => c.role === 'soldier' && c.assignment === 'garrison' && c.health === 'active'
    );
    const priests = population.characters.filter(
      c => c.role === 'priest' && c.health === 'active'
    );

    const panel = document.createElement('div');
    panel.style.cssText = 'border: 2px solid var(--danger, #e74c3c); border-radius: 6px; padding: 10px; margin-top: 8px; background: var(--bg-secondary, #16213e);';

    // ── Raid header ──
    let html = `
      <div style="font-weight: bold; color: var(--danger, #e74c3c); margin-bottom: 8px; font-size: 0.95em;">
        ⚔ ACTIVE RAID: ${raid.count} ${raid.creatureName || 'Unknown'}${raid.count > 1 ? 's' : ''} (${sizeLabel})
        <span style="float: right; color: var(--text-muted); font-weight: normal;">Str: ${raid.strength}</span>
      </div>
    `;

    // ── Trait list (fully transparent) ──
    if (activeTraits.length > 0) {
      html += `<div style="margin-bottom: 10px;">`;
      html += `<div style="font-size: 0.8em; color: var(--accent-gold, #f0c060); margin-bottom: 4px;">Traits:</div>`;
      for (const trait of activeTraits) {
        const def = CreaturesModule.getTraitById(trait.id);
        const traitName = trait.id.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        html += `
          <div style="font-size: 0.8em; padding: 2px 0; color: var(--text-primary);">
            <span style="color: var(--warning, #f39c12);">●</span> <strong>${traitName}</strong>
            ${def ? `<span style="color: var(--text-muted);"> — ${def.scoutDesc}</span>` : ''}
          </div>
        `;
      }
      html += `</div>`;
    }

    if (isConfirmed) {
      // ── Locked in ──
      html += `<div style="text-align: center; color: var(--success); font-size: 0.85em; padding: 6px 0;">Selections locked — combat resolves next dawn.</div>`;
      panel.innerHTML = html;
      return panel;
    }

    // ── Soldier doctrine selection ──
    if (soldiers.length > 0) {
      html += `<div style="font-size: 0.8em; color: var(--accent-gold, #f0c060); margin-bottom: 4px;">Soldier Orders:</div>`;
    }
    panel.innerHTML = html;

    for (const soldier of soldiers) {
      const currentDoctrineId = selections?.soldiers?.[soldier.id]?.doctrineId || null;
      const row = document.createElement('div');
      row.style.cssText = 'display: flex; align-items: center; gap: 6px; margin-bottom: 6px; font-size: 0.8em;';

      const nameSpan = document.createElement('span');
      nameSpan.style.cssText = 'min-width: 80px; color: var(--text-primary);';
      nameSpan.textContent = soldier.name;
      row.appendChild(nameSpan);

      const select = document.createElement('select');
      select.style.cssText = 'flex: 1; background: var(--bg-tertiary, #1a1a2e); color: var(--text-primary); border: 1px solid var(--border-color, #333); border-radius: 3px; padding: 3px 4px; font-size: 0.9em;';

      // No doctrine option
      const noneOpt = document.createElement('option');
      noneOpt.value = '';
      noneOpt.textContent = '— No doctrine —';
      if (!currentDoctrineId) noneOpt.selected = true;
      select.appendChild(noneOpt);

      for (const doc of soldierDoctrines) {
        const opt = document.createElement('option');
        opt.value = doc.abilityId;
        opt.textContent = `${doc.abilityName} → counters ${doc.countersTraitId.replace(/_/g, ' ')} (${doc.isPrimary ? 'primary' : 'secondary'})`;
        if (currentDoctrineId === doc.abilityId) opt.selected = true;
        select.appendChild(opt);
      }

      select.addEventListener('change', () => {
        cb.onSetDoctrine?.(raid.id, soldier.id, select.value || null);
      });
      row.appendChild(select);
      panel.appendChild(row);
    }

    // ── Priest action selection ──
    if (priests.length > 0) {
      const priestLabel = document.createElement('div');
      priestLabel.style.cssText = 'font-size: 0.8em; color: var(--accent-gold, #f0c060); margin: 8px 0 4px;';
      priestLabel.textContent = 'Priest Orders:';
      panel.appendChild(priestLabel);
    }

    for (const priest of priests) {
      const currentAction = selections?.priests?.[priest.id]?.action || null;
      const currentAbilityId = selections?.priests?.[priest.id]?.abilityId || null;
      const row = document.createElement('div');
      row.style.cssText = 'display: flex; align-items: center; gap: 6px; margin-bottom: 6px; font-size: 0.8em;';

      const nameSpan = document.createElement('span');
      nameSpan.style.cssText = 'min-width: 80px; color: var(--text-primary);';
      nameSpan.textContent = priest.name;
      row.appendChild(nameSpan);

      const select = document.createElement('select');
      select.style.cssText = 'flex: 1; background: var(--bg-tertiary, #1a1a2e); color: var(--text-primary); border: 1px solid var(--border-color, #333); border-radius: 3px; padding: 3px 4px; font-size: 0.9em;';

      // No action
      const noneOpt = document.createElement('option');
      noneOpt.value = 'none';
      noneOpt.textContent = '— No action —';
      if (!currentAction) noneOpt.selected = true;
      select.appendChild(noneOpt);

      // Pray (always available)
      const prayOpt = document.createElement('option');
      prayOpt.value = 'pray:';
      prayOpt.textContent = 'Pray — bolster defenders\' resolve';
      if (currentAction === 'pray') prayOpt.selected = true;
      select.appendChild(prayOpt);

      // Ward and Invoke actions from counter map
      for (const pa of priestActions) {
        const opt = document.createElement('option');
        const actionType = pa.form === 'ward' ? 'ward' : 'invoke';
        opt.value = `${actionType}:${pa.abilityId}`;
        opt.textContent = `${pa.abilityName} → counters ${pa.countersTraitId.replace(/_/g, ' ')} (${pa.isPrimary ? 'primary' : 'secondary'})`;
        if (currentAction === actionType && currentAbilityId === pa.abilityId) opt.selected = true;
        select.appendChild(opt);
      }

      select.addEventListener('change', () => {
        const val = select.value;
        if (val === 'none') {
          cb.onSetPriestAction?.(raid.id, priest.id, 'cancel', null);
        } else {
          const [action, abilityId] = val.split(':');
          cb.onSetPriestAction?.(raid.id, priest.id, action, abilityId || null);
        }
      });
      row.appendChild(select);
      panel.appendChild(row);
    }

    // ── Confirm button ──
    const btnRow = document.createElement('div');
    btnRow.style.cssText = 'text-align: center; margin-top: 10px;';
    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'ring-btn';
    confirmBtn.textContent = 'Engage';
    confirmBtn.style.cssText = 'padding: 6px 24px; font-weight: bold;';
    confirmBtn.addEventListener('click', () => {
      cb.onConfirmSelections?.(raid.id);
    });
    btnRow.appendChild(confirmBtn);
    panel.appendChild(btnRow);

    return panel;
  }

  _getAvailableActions(state) {
    const actions = [];
    const { population, exploration, combat, knowledge } = state;
    const config = state.config;
    const cb = this.callbacks;

    // MW actions — rescue takes priority over exploration
    if (exploration.mwState.status === 'home') {
      const mw = population.characters.find(c => c.role === 'mistwalker');
      const mwHealthy = mw && mw.health === 'active';

      // Rescue lost characters — shown first (urgent)
      if (mwHealthy) {
        const lostChars = population.characters.filter(c => c.health === 'lost');
        for (const lost of lostChars) {
          const daysLost = state.time.day - (lost.lostDay || 0);
          const rescueConfig = config.rescue || {};
          const chance = Math.max(
            rescueConfig.minSuccessChance || 0.2,
            (rescueConfig.baseSuccessChance || 0.85) - (daysLost * (rescueConfig.decayPerDay || 0.05))
          );
          const pct = Math.round(chance * 100);
          actions.push({
            type: 'action',
            label: `Rescue ${lost.name}`,
            detail: `${pct}% chance \u00B7 ${daysLost}d lost`,
            handler: () => cb.onRescue?.(lost.id),
          });
        }
      }

      // Scout incoming raids — shown before exploration (tactical priority)
      if (mwHealthy) {
        const unscoutedRaids = (state.mist?.raidQueue || []).filter(
          r => r.status === 'incoming' && !r.scouted
        );
        for (const raid of unscoutedRaids) {
          const daysUntil = typeof raid.daysUntil === 'number'
            ? `${raid.daysUntil}d away`
            : `${raid.daysUntil || '?'}d away`;
          actions.push({
            type: 'action',
            label: 'Scout Incoming Raid',
            detail: `1d trip · ${daysUntil}`,
            handler: () => cb.onScoutRaid?.(raid.id),
          });
        }
      }

      // Send MW to explore + optional wardline join (side by side)
      if (mwHealthy && mw.assignment !== 'perimeter') {
        const mwRange = config.exploration.baseMwRange;
        const perimeterTarget = config.perimeter?.targetStability || 100;
        const perimeterStability = state.mist?.perimeterStability || 0;
        const showWardline = perimeterStability < perimeterTarget;
        const pct = Math.round((perimeterStability / perimeterTarget) * 100);

        actions.push({
          type: 'mw_actions',
          dispatch: { label: 'Dispatch Mistwalker', detail: `${mwRange}d max`, handler: () => cb.onSendMW?.(1, mwRange) },
          wardline: showWardline ? { label: 'Join Wardline', detail: `${pct}%`, handler: () => cb.onJoinWardline?.(mw.id) } : null,
        });
      }
    }

    // Toggle trap production — direct execute
    const trapEngineers = population.characters.filter(
      c => c.role === 'engineer' && c.assignment === 'building' && c.health === 'active'
    );
    if (trapEngineers.length > 0) {
      const producing = combat.trapProductionEnabled;
      const hasWood = state.resources.wood >= (config.combat?.trapWoodCost || 5);
      if (!producing && hasWood) {
        actions.push({
          type: 'action',
          label: 'Begin Snare Crafting',
          detail: `${trapEngineers.length} ${rolePlural('engineer')}${trapEngineers.length > 1 ? '' : ''} ready`,
          handler: () => cb.onToggleTraps?.(),
        });
      }
    }

    // Research idle — scholars with nothing to do but queue has items
    const scholars = population.characters.filter(
      c => c.role === 'scholar' && c.health === 'active'
    );
    const pendingClues = (knowledge.clues || []).filter(c => c.status === 'perceived');
    if (scholars.length > 0 && !knowledge.activeResearch && pendingClues.length > 0) {
      actions.push({
        type: 'action',
        label: 'Review Lore Queue',
        detail: `${pendingClues.length} clue${pendingClues.length > 1 ? 's' : ''} waiting`,
        handler: () => cb.onSwitchTab?.('research'),
      });
    }

    // Equip ready artifacts — identified and not equipped
    const artifacts = knowledge.artifacts || [];
    const activeChars = population.characters.filter(
      c => c.health !== 'dead' && c.health !== 'lost'
    );
    const readyArtifacts = artifacts.filter(a => a.identified && !a.equippedTo);
    readyArtifacts.forEach(art => {
      const bonuses = Object.entries(art.statBonuses || {})
        .filter(([, v]) => v > 0)
        .map(([k, v]) => `+${v} ${k.charAt(0).toUpperCase() + k.slice(1)}`)
        .join(', ');

      // Sort characters by relevance (MW, soldiers, priests first)
      const sortedChars = [...activeChars].sort((a, b) => {
        const order = ['mistwalker', 'soldier', 'priest', 'scholar', 'engineer', 'worker'];
        return order.indexOf(a.role) - order.indexOf(b.role);
      });

      actions.push({
        type: 'equip',
        label: `Equip ${art.name}`,
        detail: bonuses || art.special || 'artifact',
        characters: sortedChars.map(c => ({
          label: `${c.name} (${role(c.role)})`,
          handler: () => cb.onEquip?.(art.id, c.id),
        })),
      });
    });

    // Tomes — DISABLED (digging temporarily removed, tomes come from digging)

    // Reassign idle workers/engineers — show assignment options
    const WORKER_ASSIGNMENTS = [
      { key: 'farming', label: 'Tilling' },
      { key: 'chopping', label: 'Felling' },
      { key: 'quarrying', label: 'Stonecutting' },
    ];
    const idleWorkers = population.characters.filter(
      c => c.role === 'worker' && c.assignment === 'available' && c.health === 'active' && !c.training
    );

    idleWorkers.forEach(char => {
      actions.push({
        type: 'assign',
        label: `Assign ${char.name}`,
        detail: `${role('worker')} \u00B7 V${char.body}`,
        assignments: WORKER_ASSIGNMENTS.map(a => ({
          label: a.label,
          handler: () => cb.onAssign?.(char.id, a.key),
        })),
      });
    });

    // Train new arrivals — roles read from config (single source of truth)
    const trainableRoles = ['priest', 'soldier', 'engineer', 'worker', 'scholar'];
    const rolesConfig = config?.roles || {};

    const unassigned = population.characters.filter(
      c => c.role === 'unassigned' && !c.training && c.health !== 'dead' && c.health !== 'lost'
    );
    unassigned.forEach(char => {
      const roles = trainableRoles.map(roleKey => {
        const rc = rolesConfig[roleKey] || {};
        const reqs = rc.req || {};
        let eligible = true;
        for (const [stat, min] of Object.entries(reqs)) {
          if (char[stat] < min) { eligible = false; break; }
        }
        return {
          label: role(roleKey),
          eligible,
          req: rc.reqLabel || '',
          handler: () => cb.onTrain?.(char.id, roleKey),
        };
      });

      actions.push({
        type: 'train',
        label: `Induct ${char.name}`,
        detail: statLine(char),
        roles,
      });
    });

    // DEFERRED ACTIONS (need systems built):
    // - Repair tower (needs tower repair mechanic)
    // - Garrison worker as untrained soldier (needs location system)

    return actions;
  }
}

export default DashboardTab;
