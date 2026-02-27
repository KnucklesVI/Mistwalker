/**
 * Build Tab - Engineer workspace
 */

import { LEX, role, stat, assignment, statLine } from '../lexicon.js?v=5z';
import BuildingModule from '../../core/modules/building.js?v=5z';

export class BuildTab {
  constructor(onToggleTrapProduction = null, onAssign = null, onBuild = null, onPinTower = null, onPlaceTraps = null) {
    this.onToggleTrapProduction = onToggleTrapProduction;
    this.onAssign = onAssign;
    this.onBuild = onBuild;
    this.onPinTower = onPinTower;
    this.onPlaceTraps = onPlaceTraps;
  }

  render(state) {
    const container = document.createElement('div');
    const config = state.config;

    // ── Engineer Corps ──
    const engineers = state.population.characters.filter(c => c.role === 'engineer');
    const activeEngineers = engineers.filter(c => c.health === 'active');
    const busyEngineers = activeEngineers.filter(c => c.assignment === 'building' || c.assignment === 'digging');

    const overviewSection = document.createElement('div');
    overviewSection.className = 'collapsible-section';

    const overviewHeader = document.createElement('div');
    overviewHeader.className = 'collapsible-header';
    overviewHeader.innerHTML = `
      <span class="collapsible-caret">\u25BC</span>
      <span class="collapsible-title">Engineer Corps</span>
      <span class="item-detail" style="margin-left: auto;">${activeEngineers.length - busyEngineers.length} available / ${engineers.length} total</span>
    `;

    const overviewBody = document.createElement('div');
    overviewBody.className = 'collapsible-body';

    if (engineers.length > 0) {
      overviewBody.innerHTML = engineers.map(eng => {
        let activity = assignment(eng.assignment);
        // Show what the engineer is actually doing
        if (eng.assignment === 'building') {
          const bq = state.buildings?.buildQueue || [];
          const rq = state.buildings?.repairQueue || [];
          if (rq.length > 0) {
            activity = 'Repairing...';
          } else if (state.combat?.trapProductionEnabled) {
            const total = state.combat.trapTargetTotal;
            const remaining = state.combat.trapTargetCount;
            if (total === null) {
              activity = 'Building Trap (\u221E)';
            } else if (typeof remaining === 'number' && typeof total === 'number') {
              const built = total - remaining;
              activity = `Building Trap (${built}/${total})`;
            } else {
              activity = 'Building Trap';
            }
          } else if (bq.length > 0) {
            const proj = bq[0];
            const tc = BuildingModule.getTypeConfig(proj.category, proj.type, config);
            const name = tc ? tc.name : 'Structure';
            const daysLeft = Math.ceil(proj.totalDays - proj.progress);
            activity = `${name} (${daysLeft}d)`;
          } else {
            activity = 'Building (idle)';
          }
        }
        return `
        <div class="item-row">
          <span class="item-name">${eng.name}</span>
          <span class="item-detail">${activity} \u00B7 ${stat('mind')} ${eng.mind} ${stat('body')} ${eng.body}</span>
          <span class="${eng.health === 'active' ? 'status-good' : 'status-bad'}">${eng.health}</span>
        </div>
      `;
      }).join('');
    } else {
      overviewBody.innerHTML = '<div style="color: var(--text-muted);">No engineers in settlement</div>';
    }

    overviewHeader.addEventListener('click', () => {
      const isCollapsed = overviewHeader.classList.toggle('collapsed');
      if (isCollapsed) overviewBody.classList.add('hidden');
      else overviewBody.classList.remove('hidden');
    });

    overviewSection.appendChild(overviewHeader);
    overviewSection.appendChild(overviewBody);
    container.appendChild(overviewSection);

    // ── Structures (towers + walls) ──
    container.appendChild(this._renderStructuresSection(state, config));

    // ── Build New ──
    container.appendChild(this._renderBuildSection(state, config));

    return container;
  }

  // ── Structures overview ──
  _renderStructuresSection(state, config) {
    const section = document.createElement('div');
    section.className = 'collapsible-section';

    const structures = state.buildings?.structures || [];
    const towers = structures.filter(s => s.category === 'tower');
    const walls = structures.filter(s => s.category === 'wall');
    const repairQueue = state.buildings?.repairQueue || [];

    const intactTowers = towers.filter(s => s.hp > 0).length;
    const intactWalls = walls.filter(s => s.hp > 0).length;
    const wallDefense = BuildingModule.getWallDefense(state, config);
    const trapCount = state.combat?.traps?.length || 0;
    const trapDefense = trapCount * (config?.combat?.trapDefense || 2);

    const summaryParts = [];
    if (intactTowers > 0) summaryParts.push(`${intactTowers} tower${intactTowers !== 1 ? 's' : ''}`);
    if (intactWalls > 0) summaryParts.push(`${intactWalls} wall${intactWalls !== 1 ? 's' : ''}`);
    if (trapCount > 0) summaryParts.push(`${trapCount} trap${trapCount !== 1 ? 's' : ''}`);
    const totalDef = wallDefense + trapDefense;

    const header = document.createElement('div');
    header.className = 'collapsible-header';
    header.innerHTML = `
      <span class="collapsible-caret">\u25BC</span>
      <span class="collapsible-title">Structures</span>
      <span class="item-detail" style="margin-left: auto;">${summaryParts.length > 0 ? summaryParts.join(', ') : 'none'}${totalDef > 0 ? ` (+${totalDef} def)` : ''}</span>
    `;

    const body = document.createElement('div');
    body.className = 'collapsible-body';

    // Get tower-priest assignments
    const towerAssignments = BuildingModule.getTowerAssignments(state, config);

    // Available priests for dropdown (on perimeter + active)
    const perimeterPriests = state.population.characters.filter(
      c => c.role === 'priest' && c.assignment === 'perimeter' && c.health === 'active'
    );

    let hasContent = false;

    // Towers — show each individually with priest assignment
    if (towers.length > 0) {
      hasContent = true;
      const towerLabel = document.createElement('div');
      towerLabel.style.cssText = 'font-size: 0.8em; color: var(--accent-gold); margin-bottom: 4px;';
      towerLabel.textContent = 'Towers:';
      body.appendChild(towerLabel);

      // Damaged towers (hp <= 0) — show as summary
      const damagedTowers = towers.filter(t => t.hp <= 0);
      if (damagedTowers.length > 0) {
        const dmgRow = document.createElement('div');
        dmgRow.className = 'item-row';
        dmgRow.innerHTML = `<span class="item-name" style="color: var(--status-bad);">${damagedTowers.length} damaged</span><span class="item-detail">needs repair</span>`;
        body.appendChild(dmgRow);
      }

      // Intact towers — each gets a row with priest dropdown
      for (const ta of towerAssignments) {
        const tc = BuildingModule.getTypeConfig('tower', ta.towerType, config);
        const towerName = tc ? tc.name : `Tower (${ta.towerType})`;
        const reduction = Math.round((ta.mistReduction || 0) * 100);

        const row = document.createElement('div');
        row.className = 'item-row';
        row.style.cssText = 'display: flex; align-items: center; gap: 8px;';

        const nameSpan = document.createElement('span');
        nameSpan.className = 'item-name';
        nameSpan.textContent = towerName;
        row.appendChild(nameSpan);

        const detailSpan = document.createElement('span');
        detailSpan.className = 'item-detail';
        detailSpan.style.cssText = 'flex: 1;';
        detailSpan.textContent = `${reduction}% mist protection`;
        row.appendChild(detailSpan);

        // Priest dropdown
        const select = document.createElement('select');
        select.style.cssText = 'padding: 2px 4px; font-size: 0.8em; min-width: 90px; background: var(--bg-dark, #1a1a2e); color: var(--text-primary, #c8c8d4); border: 1px solid var(--border-dim, #3a3a5c); border-radius: 3px;';

        // "Auto" option — shows current auto-assigned priest or empty
        const autoOpt = document.createElement('option');
        autoOpt.value = '';
        autoOpt.textContent = ta.priestName && !ta.pinned
          ? `\u2022 ${ta.priestName}`
          : '\u2014 auto \u2014';
        if (!ta.pinned) autoOpt.selected = true;
        select.appendChild(autoOpt);

        // Each available priest as a pin option
        for (const priest of perimeterPriests) {
          const opt = document.createElement('option');
          opt.value = priest.id;
          opt.textContent = `${priest.name} (S${priest.spirit})`;
          if (ta.pinned && ta.priestId === priest.id) opt.selected = true;
          select.appendChild(opt);
        }

        select.addEventListener('change', (e) => {
          e.stopPropagation();
          if (this.onPinTower) {
            const priestId = e.target.value || null;
            this.onPinTower(ta.towerId, priestId);
          }
        });
        row.appendChild(select);

        body.appendChild(row);
      }
    }

    // Walls — grouped summary
    if (walls.length > 0) {
      hasContent = true;
      const wallLabel = document.createElement('div');
      wallLabel.style.cssText = 'font-size: 0.8em; color: var(--accent-gold); margin-top: 8px; margin-bottom: 4px;';
      wallLabel.textContent = 'Walls:';
      body.appendChild(wallLabel);

      const grouped = {};
      for (const w of walls) {
        const key = w.type;
        if (!grouped[key]) grouped[key] = { intact: 0, damaged: 0 };
        if (w.hp > 0) grouped[key].intact++;
        else grouped[key].damaged++;
      }
      for (const [type, counts] of Object.entries(grouped)) {
        const tc = BuildingModule.getTypeConfig('wall', type, config);
        const name = tc ? tc.name : type;
        let detail = `${counts.intact} intact`;
        if (counts.damaged > 0) detail += `, <span style="color: var(--status-bad);">${counts.damaged} damaged</span>`;
        const defPer = tc?.defense || 0;
        const wallRow = document.createElement('div');
        wallRow.className = 'item-row';
        wallRow.innerHTML = `<span class="item-name">${name}</span><span class="item-detail">${detail} \u00B7 +${defPer} defense each</span>`;
        body.appendChild(wallRow);
      }
    }

    // Traps — show placed, inventory, and placement controls
    const trapInventory = state.combat?.trapInventory || [];
    const trapPlacementQueue = state.combat?.trapPlacementQueue || null;
    if (trapCount > 0 || trapInventory.length > 0 || trapPlacementQueue) {
      hasContent = true;
      const trapLabel = document.createElement('div');
      trapLabel.style.cssText = 'font-size: 0.8em; color: var(--accent-gold); margin-top: 8px; margin-bottom: 4px;';
      trapLabel.textContent = 'Traps:';
      body.appendChild(trapLabel);

      // Placed traps
      const trapRow = document.createElement('div');
      trapRow.className = 'item-row';
      let trapText = `${trapCount} placed`;
      if (trapDefense > 0) trapText += ` (+${trapDefense} def)`;
      if (trapInventory.length > 0) trapText += ` \u00B7 ${trapInventory.length} in inventory`;
      trapRow.innerHTML = `<span class="item-name">Wood Traps</span><span class="item-detail">${trapText}</span>`;
      body.appendChild(trapRow);

      // Placement in progress
      if (trapPlacementQueue) {
        const placingRow = document.createElement('div');
        placingRow.className = 'item-row';
        placingRow.innerHTML = `<span class="item-detail" style="color: var(--accent-gold);">Placing ${trapPlacementQueue.count} trap${trapPlacementQueue.count !== 1 ? 's' : ''}... (${trapPlacementQueue.daysLeft} day remaining)</span>`;
        body.appendChild(placingRow);
      }
      // Place button — show when inventory > 0 and no placement in progress
      else if (trapInventory.length > 0) {
        const placeRow = document.createElement('div');
        placeRow.className = 'item-row';
        placeRow.style.cssText = 'display: flex; align-items: center; gap: 8px; margin-top: 4px;';

        const placeLabel = document.createElement('span');
        placeLabel.className = 'item-detail';
        placeLabel.textContent = 'Place traps:';
        placeRow.appendChild(placeLabel);

        // Qty dropdown for placement
        const placeSelect = document.createElement('select');
        placeSelect.className = 'ring-btn';
        placeSelect.style.cssText = 'padding: 2px 4px; font-size: 0.8em; min-width: 42px; text-align: center; background: var(--bg-dark, #1a1a2e); color: var(--text-primary, #c8c8d4); border: 1px solid var(--border-dim, #3a3a5c);';
        const placeOptions = [];
        for (let i = 1; i <= Math.min(5, trapInventory.length); i++) placeOptions.push(String(i));
        if (trapInventory.length > 1) placeOptions.push('All');
        for (const val of placeOptions) {
          const opt = document.createElement('option');
          opt.value = val === 'All' ? 'all' : val;
          opt.textContent = val;
          placeSelect.appendChild(opt);
        }
        // Default to "All"
        if (trapInventory.length > 1) placeSelect.value = 'all';
        placeRow.appendChild(placeSelect);

        const placeBtn = document.createElement('button');
        placeBtn.className = 'ring-btn';
        placeBtn.style.cssText = 'padding: 3px 10px; font-size: 0.8em;';
        placeBtn.textContent = 'Place';
        placeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (this.onPlaceTraps) {
            this.onPlaceTraps(placeSelect.value);
          }
        });
        placeRow.appendChild(placeBtn);
        body.appendChild(placeRow);
      }
    }

    if (!hasContent) {
      body.innerHTML = '<div style="color: var(--text-muted);">No structures built</div>';
    }

    // Repair queue
    if (repairQueue.length > 0) {
      const repairLabel = document.createElement('div');
      repairLabel.style.cssText = 'font-size: 0.8em; color: var(--status-bad); margin-top: 8px; margin-bottom: 4px;';
      repairLabel.textContent = 'Repairs Needed:';
      body.appendChild(repairLabel);

      for (const r of repairQueue) {
        const struct = structures.find(s => s.id === r.structureId);
        const tc = struct ? BuildingModule.getTypeConfig(struct.category, struct.type, config) : null;
        const name = tc ? tc.name : 'Structure';
        const costStr = Object.entries(r.cost || {}).map(([res, amt]) => `${amt} ${res}`).join(', ') || 'no materials';
        const repairRow = document.createElement('div');
        repairRow.className = 'item-row';
        repairRow.innerHTML = `<span class="item-name">${name}</span><span class="item-detail">${r.daysLeft}d remaining \u00B7 ${costStr}</span>`;
        body.appendChild(repairRow);
      }

      const buildingEngineers = state.population.characters.filter(
        c => c.role === 'engineer' && c.assignment === 'building' && c.health === 'active'
      );
      if (buildingEngineers.length === 0) {
        const hint = document.createElement('div');
        hint.style.cssText = 'color: var(--text-muted); font-size: 0.85em; margin-top: 4px;';
        hint.textContent = 'Assign an engineer to Building to begin repairs';
        body.appendChild(hint);
      }
    }

    // Build queue
    const buildQueue = state.buildings?.buildQueue || [];
    if (buildQueue.length > 0) {
      const buildLabel = document.createElement('div');
      buildLabel.style.cssText = 'font-size: 0.8em; color: var(--accent-gold); margin-top: 8px; margin-bottom: 4px;';
      buildLabel.textContent = 'Under Construction:';
      body.appendChild(buildLabel);

      for (const proj of buildQueue) {
        const tc = BuildingModule.getTypeConfig(proj.category, proj.type, config);
        const name = tc ? tc.name : 'Structure';
        const pct = proj.totalDays > 0 ? Math.round((proj.progress / proj.totalDays) * 100) : 0;
        const projRow = document.createElement('div');
        projRow.className = 'item-row';
        projRow.innerHTML = `<span class="item-name">${name}</span><span class="item-detail">${Math.ceil(proj.totalDays - proj.progress)}d remaining</span>`;
        body.appendChild(projRow);

        const bar = document.createElement('div');
        bar.className = 'perimeter-bar-container';
        bar.style.cssText = 'margin: 2px 0 6px 0;';
        bar.innerHTML = `<div class="perimeter-bar" style="width: ${pct}%; background-color: var(--accent-gold);"></div>`;
        body.appendChild(bar);
      }

      // Engineer warning if no engineers on 'building'
      const buildingEngineers = state.population.characters.filter(
        c => c.role === 'engineer' && c.assignment === 'building' && c.health === 'active'
      );
      if (buildingEngineers.length === 0) {
        const hint = document.createElement('div');
        hint.style.cssText = 'color: var(--status-bad); font-size: 0.85em; margin-top: 4px;';
        hint.textContent = '\u26A0 Assign an engineer to Building to advance construction';
        body.appendChild(hint);
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

  // ── Build New section ──
  _renderBuildSection(state, config) {
    const section = document.createElement('div');
    section.className = 'collapsible-section';

    const recipes = BuildingModule.getAvailableRecipes(state, config);

    // Trap production status
    const trapCount = state.combat?.traps?.length || 0;
    const trapTarget = state.combat?.trapTargetCount;
    const trapTotal = state.combat?.trapTargetTotal;
    const trapActive = state.combat?.trapProductionEnabled || false;

    const header = document.createElement('div');
    header.className = 'collapsible-header';
    header.innerHTML = `
      <span class="collapsible-caret">\u25BC</span>
      <span class="collapsible-title">Build</span>
      <span class="item-detail" style="margin-left: auto;">${recipes.length} available</span>
    `;

    const body = document.createElement('div');
    body.className = 'collapsible-body';

    if (recipes.length > 0) {
      for (const recipe of recipes) {
        const costStr = Object.entries(recipe.cost).map(([r, a]) => `${a} ${r}`).join(', ');
        const row = document.createElement('div');
        row.className = 'item-row';
        row.style.cssText = 'display: flex; align-items: center; gap: 8px;';

        const nameSpan = document.createElement('span');
        nameSpan.className = 'item-name';

        if (recipe.category === 'trap') {
          // Trap label: show placed count + progress when active
          const inventoryCount = state.combat?.trapInventory?.length || 0;
          let label = `${recipe.name}`;
          let detailParts = [];
          if (trapCount > 0) detailParts.push(`${trapCount} placed`);
          if (inventoryCount > 0) detailParts.push(`${inventoryCount} in stock`);
          if (trapActive) {
            if (trapTotal === null) {
              detailParts.push('building \u221E');
            } else if (typeof trapTotal === 'number' && typeof trapTarget === 'number') {
              const built = trapTotal - trapTarget;
              detailParts.push(`building ${built}/${trapTotal}`);
            }
          }
          if (detailParts.length > 0) {
            label += ` <span class="item-detail">(${detailParts.join(' \u00B7 ')})</span>`;
          }
          nameSpan.innerHTML = label;
        } else {
          nameSpan.textContent = recipe.name;
        }
        row.appendChild(nameSpan);

        const detailSpan = document.createElement('span');
        detailSpan.className = 'item-detail';
        detailSpan.style.cssText = 'flex: 1;';
        detailSpan.textContent = `${costStr} \u00B7 ${recipe.buildDays}d`;
        row.appendChild(detailSpan);

        if (recipe.category === 'trap' && trapActive) {
          // Show progress text + Cancel button when production is active
          const progressSpan = document.createElement('span');
          progressSpan.className = 'item-detail';
          progressSpan.style.cssText = 'color: var(--accent-gold);';
          if (trapTotal === null) {
            progressSpan.textContent = '\u221E';
          } else if (typeof trapTotal === 'number' && typeof trapTarget === 'number') {
            const built = trapTotal - trapTarget;
            progressSpan.textContent = `${built}/${trapTotal}`;
          }
          row.appendChild(progressSpan);

          const cancelBtn = document.createElement('button');
          cancelBtn.className = 'ring-btn';
          cancelBtn.style.cssText = 'padding: 3px 10px; font-size: 0.8em; color: var(--status-bad); border-color: var(--status-bad);';
          cancelBtn.textContent = 'Cancel';
          cancelBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.onToggleTrapProduction) {
              this.onToggleTrapProduction();
            }
          });
          row.appendChild(cancelBtn);
        } else {
          // Normal: qty dropdown + Build button
          const select = document.createElement('select');
          select.className = 'ring-btn';
          select.style.cssText = 'padding: 2px 4px; font-size: 0.8em; min-width: 42px; text-align: center; background: var(--bg-dark, #1a1a2e); color: var(--text-primary, #c8c8d4); border: 1px solid var(--border-dim, #3a3a5c);';
          const qtyOptions = ['1', '2', '3', '4', '5', '\u221E'];
          for (const val of qtyOptions) {
            const opt = document.createElement('option');
            opt.value = val === '\u221E' ? 'infinite' : val;
            opt.textContent = val;
            select.appendChild(opt);
          }
          row.appendChild(select);

          const btn = document.createElement('button');
          btn.className = 'ring-btn';
          btn.style.cssText = 'padding: 3px 10px; font-size: 0.8em;';
          btn.textContent = 'Build';
          btn.disabled = !recipe.canAfford;
          if (!recipe.canAfford) {
            btn.style.opacity = '0.4';
            btn.title = 'Not enough resources';
          }
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.onBuild) {
              const qty = select.value;
              this.onBuild(recipe.category, recipe.type, qty);
            }
          });
          row.appendChild(btn);
        }

        body.appendChild(row);
      }
    } else {
      body.innerHTML = '<div style="color: var(--text-muted);">Nothing available to build</div>';
    }

    // Warning: trap production queued but no engineers on building
    if (trapActive) {
      const buildingEngineers = state.population.characters.filter(
        c => c.role === 'engineer' && c.assignment === 'building' && c.health === 'active'
      );
      if (buildingEngineers.length === 0) {
        const hint = document.createElement('div');
        hint.style.cssText = 'color: var(--status-bad); font-size: 0.85em; margin-top: 4px;';
        hint.textContent = '\u26A0 Assign an engineer to Building to begin trap production';
        body.appendChild(hint);
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

}

export default BuildTab;
