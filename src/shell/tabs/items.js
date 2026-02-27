/**
 * Items Tab - Inventory with artifact equip/unequip
 */

import { LEX, role, stat, statAbbr, statLine } from '../lexicon.js?v=5z';

export class ItemsTab {
  constructor(onEquip = null, onUnequip = null, onUseTome = null) {
    this.onEquip = onEquip;
    this.onUnequip = onUnequip;
    this.onUseTome = onUseTome;
  }

  render(state) {
    const container = document.createElement('div');
    const artifacts = state.knowledge.artifacts || [];
    const characters = state.population.characters.filter(
      c => c.health !== 'dead' && c.health !== 'lost'
    );

    // ── Artifacts Section ──
    const artifactsSection = document.createElement('div');
    artifactsSection.className = 'collapsible-section';

    const artifactsHeader = document.createElement('div');
    artifactsHeader.className = 'collapsible-header';

    const identifiedCount = artifacts.filter(a => a.identified).length;
    const unidentifiedCount = artifacts.filter(a => !a.identified).length;
    let countDetail = `${artifacts.length}`;
    if (unidentifiedCount > 0) countDetail += ` (${unidentifiedCount} unidentified)`;

    artifactsHeader.innerHTML = `
      <span class="collapsible-caret">\u25BC</span>
      <span class="collapsible-title">Relics</span>
      <span class="item-detail" style="margin-left: auto;">${countDetail}</span>
    `;

    const artifactsBody = document.createElement('div');
    artifactsBody.className = 'collapsible-body';

    if (artifacts.length === 0) {
      artifactsBody.innerHTML = '<div style="color: var(--text-muted);">No relics discovered yet</div>';
    } else {
      artifacts.forEach(artifact => {
        const card = document.createElement('div');
        card.style.cssText = 'background: var(--bg-tertiary); border-radius: 4px; padding: 10px; margin-bottom: 8px; border-left: 3px solid ' +
          (artifact.identified ? 'var(--accent-gold)' : 'var(--text-muted)') + ';';

        // Name row
        const nameRow = document.createElement('div');
        nameRow.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;';

        const nameEl = document.createElement('span');
        nameEl.style.cssText = 'font-weight: bold; color: var(--text-primary);';
        nameEl.textContent = artifact.name;
        nameRow.appendChild(nameEl);

        if (!artifact.identified) {
          const badge = document.createElement('span');
          badge.style.cssText = 'font-size: 0.75em; color: var(--warning); background: rgba(255,180,0,0.15); padding: 2px 6px; border-radius: 3px;';
          badge.textContent = 'Unidentified \u2014 Under Study';
          nameRow.appendChild(badge);
        }

        card.appendChild(nameRow);

        if (artifact.identified) {
          // Stats row
          const statsRow = document.createElement('div');
          statsRow.style.cssText = 'font-size: 0.85em; color: var(--text-secondary); margin-bottom: 6px;';

          const bonuses = Object.entries(artifact.statBonuses || {})
            .filter(([, v]) => v > 0)
            .map(([k, v]) => `+${v} ${k.charAt(0).toUpperCase() + k.slice(1)}`)
            .join(', ');

          statsRow.textContent = bonuses + (artifact.special ? ` \u00B7 ${artifact.special}` : '');
          card.appendChild(statsRow);

          // Equipped / action row
          const actionRow = document.createElement('div');
          actionRow.style.cssText = 'display: flex; align-items: center; gap: 8px;';

          if (artifact.equippedTo) {
            const owner = characters.find(c => c.id === artifact.equippedTo);
            const ownerName = owner ? owner.name : 'Unknown';

            const equippedLabel = document.createElement('span');
            equippedLabel.style.cssText = 'font-size: 0.8em; color: var(--success);';
            equippedLabel.textContent = `Equipped to ${ownerName}`;
            actionRow.appendChild(equippedLabel);

            const unequipBtn = document.createElement('button');
            unequipBtn.className = 'ring-btn';
            unequipBtn.style.cssText = 'padding: 3px 8px; font-size: 0.75em;';
            unequipBtn.textContent = 'Unequip';
            unequipBtn.addEventListener('click', () => {
              if (this.onUnequip) this.onUnequip(artifact.id);
            });
            actionRow.appendChild(unequipBtn);
          } else {
            // Equip selector — dropdown of eligible characters
            const equipLabel = document.createElement('span');
            equipLabel.style.cssText = 'font-size: 0.8em; color: var(--text-muted);';
            equipLabel.textContent = 'Equip to:';
            actionRow.appendChild(equipLabel);

            const select = document.createElement('select');
            select.style.cssText = 'background: var(--bg-secondary); color: var(--text-primary); border: 1px solid var(--border); border-radius: 3px; padding: 3px 6px; font-size: 0.8em;';

            const defaultOpt = document.createElement('option');
            defaultOpt.value = '';
            defaultOpt.textContent = '-- Select --';
            select.appendChild(defaultOpt);

            // Sort by role, then name
            const sortedChars = [...characters].sort((a, b) => {
              const roleOrder = ['mistwalker', 'soldier', 'priest', 'scholar', 'engineer', 'worker'];
              const ra = roleOrder.indexOf(a.role);
              const rb = roleOrder.indexOf(b.role);
              if (ra !== rb) return ra - rb;
              return a.name.localeCompare(b.name);
            });

            sortedChars.forEach(char => {
              const opt = document.createElement('option');
              opt.value = char.id;
              opt.textContent = `${char.name} (${role(char.role)}) ${statLine(char)}`;
              select.appendChild(opt);
            });

            select.addEventListener('change', () => {
              if (select.value && this.onEquip) {
                this.onEquip(artifact.id, select.value);
              }
            });

            actionRow.appendChild(select);
          }

          card.appendChild(actionRow);
        } else {
          // Unidentified — show ring info
          const infoRow = document.createElement('div');
          infoRow.style.cssText = 'font-size: 0.8em; color: var(--text-muted);';
          infoRow.textContent = `Day ${artifact.discoveredDay} \u00B7 Awaiting scholar study`;
          card.appendChild(infoRow);
        }

        artifactsBody.appendChild(card);
      });
    }

    artifactsHeader.addEventListener('click', () => {
      const isCollapsed = artifactsHeader.classList.toggle('collapsed');
      if (isCollapsed) artifactsBody.classList.add('hidden');
      else artifactsBody.classList.remove('hidden');
    });

    artifactsSection.appendChild(artifactsHeader);
    artifactsSection.appendChild(artifactsBody);
    container.appendChild(artifactsSection);

    // ── Grimoires Section — DISABLED (digging temporarily removed, tomes come from digging) ──

    // ── Essences Section ──
    const essencesSection = document.createElement('div');
    essencesSection.className = 'collapsible-section';

    const essencesHeader = document.createElement('div');
    essencesHeader.className = 'collapsible-header';
    essencesHeader.innerHTML = `
      <span class="collapsible-caret">\u25BC</span>
      <span class="collapsible-title">Essences</span>
    `;

    const essencesBody = document.createElement('div');
    essencesBody.className = 'collapsible-body';

    const essences = state.resources.essences || {};
    const essenceCount = Object.keys(essences).length;
    if (essenceCount > 0) {
      essencesBody.innerHTML = Object.entries(essences)
        .map(([name, count]) => `
          <div style="padding: 8px; background-color: var(--bg-tertiary); border-radius: 3px; margin-bottom: 4px;">
            <span style="color: var(--text-primary);">${name}</span>
            <span style="color: var(--accent-gold); font-weight: bold; float: right;">x${count}</span>
          </div>
        `).join('');
    } else {
      essencesBody.innerHTML = '<div style="color: var(--text-muted);">No essences collected</div>';
    }

    essencesHeader.addEventListener('click', () => {
      const isCollapsed = essencesHeader.classList.toggle('collapsed');
      if (isCollapsed) essencesBody.classList.add('hidden');
      else essencesBody.classList.remove('hidden');
    });

    essencesSection.appendChild(essencesHeader);
    essencesSection.appendChild(essencesBody);
    container.appendChild(essencesSection);

    // ── Herbs Section ──
    const herbsSection = document.createElement('div');
    herbsSection.className = 'collapsible-section';

    const herbsHeader = document.createElement('div');
    herbsHeader.className = 'collapsible-header';
    herbsHeader.innerHTML = `
      <span class="collapsible-caret">\u25BC</span>
      <span class="collapsible-title">Salves</span>
    `;

    const herbsBody = document.createElement('div');
    herbsBody.className = 'collapsible-body';
    herbsBody.innerHTML = `<div style="color: var(--text-muted);">Salves: ${state.resources.herbs || 0}</div>`;

    herbsHeader.addEventListener('click', () => {
      const isCollapsed = herbsHeader.classList.toggle('collapsed');
      if (isCollapsed) herbsBody.classList.add('hidden');
      else herbsBody.classList.remove('hidden');
    });

    herbsSection.appendChild(herbsHeader);
    herbsSection.appendChild(herbsBody);
    container.appendChild(herbsSection);

    return container;
  }
}

export default ItemsTab;
