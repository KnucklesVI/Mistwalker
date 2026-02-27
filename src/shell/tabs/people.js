/**
 * People Tab - Character roster and management
 */

import { LEX, role, assignment, health, statLine } from '../lexicon.js?v=5z';

export class PeopleTab {
  constructor(onCharacterClick = null, onActionClick = null) {
    this.onCharacterClick = onCharacterClick;
    this.onActionClick = onActionClick;
  }

  /**
   * Build a character row with name, assignment, health, stats, and action buttons
   */
  buildCharacterRow(char, state = null) {
    const row = document.createElement('div');
    row.className = 'character-row';

    const healthClass = char.health === 'active' ? 'active'
      : char.health === 'injured' ? 'injured'
      : char.health === 'gravely_injured' ? 'gravely'
      : '';

    let assignmentText = (char.role === 'mistwalker' && char.assignment === 'available') ? 'Monastery' : assignment(char.assignment);

    // Engineer activity detail
    if (char.role === 'engineer' && state && char.assignment === 'building') {
      const bq = state.buildings?.buildQueue || [];
      const rq = state.buildings?.repairQueue || [];
      if (rq.length > 0) {
        assignmentText = 'Repairing...';
      } else if (state.combat?.trapProductionEnabled) {
        const total = state.combat.trapTargetTotal;
        const remaining = state.combat.trapTargetCount;
        if (total === null) {
          assignmentText = 'Building Trap (\u221E)';
        } else if (typeof remaining === 'number' && typeof total === 'number') {
          assignmentText = `Building Trap (${total - remaining}/${total})`;
        } else {
          assignmentText = 'Building Trap';
        }
      } else if (bq.length > 0) {
        assignmentText = 'Building';
      } else {
        assignmentText = 'Building (idle)';
      }
    }
    if (char.training) {
      const targetRole = typeof char.training === 'object' ? char.training.targetRole : char.training;
      const daysLeft = typeof char.training === 'object' ? char.training.daysRemaining : '?';
      assignmentText = `Induction \u2192 ${role(targetRole)} (${daysLeft}d)`;
    }

    row.innerHTML = `
      <div class="character-name" data-char-id="${char.id}">${char.name}</div>
      <div class="character-assignment">${assignmentText}</div>
      <div class="character-health ${healthClass}">${char.health === 'injured' || char.health === 'gravely_injured' ? health(char.health === 'gravely_injured' ? 'gravely_injured' : 'injured') + ' · ' + (char.healingDaysRemaining != null ? char.healingDaysRemaining + 'd' : '?d') : health(char.health)}</div>
      <div class="character-stat">${statLine(char)}</div>
      <div class="character-actions">
        <button class="action-btn btn-reassign" data-char-id="${char.id}" data-action="reassign">Reassign</button>
        ${char.training
          ? `<button class="action-btn btn-cancel" data-char-id="${char.id}" data-action="cancel-training">Abandon</button>`
          : `<button class="action-btn btn-train" data-char-id="${char.id}" data-action="train">Induct</button>`
        }
      </div>
    `;

    row.addEventListener('click', () => {
      if (this.onCharacterClick) this.onCharacterClick(char.id);
    });

    row.querySelectorAll('.action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = e.target.dataset.action;
        const charId = e.target.dataset.charId;
        if (this.onActionClick) this.onActionClick(action, charId, e.target);
      });
    });

    return row;
  }

  /**
   * Build a collapsible section with header and character rows
   */
  buildSection(title, characters, opts = {}, state = null) {
    const section = document.createElement('div');
    section.className = 'collapsible-section';

    const header = document.createElement('div');
    header.className = 'collapsible-header';
    const titleStyle = opts.titleStyle ? ` style="${opts.titleStyle}"` : '';
    header.innerHTML = `
      <span class="collapsible-caret">\u25BC</span>
      <span class="collapsible-title"${titleStyle}>${title} (${characters.length})</span>
    `;

    const body = document.createElement('div');
    body.className = 'collapsible-body';

    characters.forEach(char => body.appendChild(this.buildCharacterRow(char, state)));

    header.addEventListener('click', () => {
      const isCollapsed = header.classList.toggle('collapsed');
      if (isCollapsed) body.classList.add('hidden');
      else body.classList.remove('hidden');
    });

    section.appendChild(header);
    section.appendChild(body);
    return section;
  }

  _formatAssignment(assignmentKey) {
    return assignment(assignmentKey);
  }

  render(state) {
    const container = document.createElement('div');

    const injured = state.population.characters.filter(c => c.health === 'injured' || c.health === 'gravely_injured');
    const infirmaryPairs = state.population.infirmary || [];

    // --- Infirmary at the very top (highest priority) ---
    if (injured.length > 0) {
      const infirmarySection = document.createElement('div');
      infirmarySection.className = 'collapsible-section';

      const infirmaryHeader = document.createElement('div');
      infirmaryHeader.className = 'collapsible-header';
      infirmaryHeader.innerHTML = `
        <span class="collapsible-caret">\u25BC</span>
        <span class="collapsible-title" style="color: var(--danger, #e55);">Sick Ward (${injured.length})</span>
      `;

      const infirmaryBody = document.createElement('div');
      infirmaryBody.className = 'collapsible-body';

      for (const char of injured) {
        const roleLabel = role(char.role);
        const assignLabel = this._formatAssignment(char.assignment);
        const healthLabel = health(char.health === 'gravely_injured' ? 'gravely_injured' : 'injured');
        const pair = infirmaryPairs.find(p => p.patientId === char.id);
        const menderName = pair
          ? state.population.characters.find(c => c.id === pair.priestId)?.name || 'Mender'
          : null;

        const row = document.createElement('div');
        row.style.cssText = 'padding: 6px 0; border-bottom: 1px solid var(--bg-tertiary, #222);';
        row.innerHTML = `
          <div class="item-row">
            <span class="item-name">${char.name}</span>
            <span class="item-detail">${roleLabel} \u00B7 ${assignLabel}</span>
            <span class="status-bad">${healthLabel}</span>
          </div>
          <div class="item-row" data-nav-skip style="font-size: 0.85em;">
            <span class="item-detail" style="color: var(--text-muted);">${char.healingDaysRemaining}d recovery remaining</span>
            <span class="item-detail" style="color: ${menderName ? 'var(--accent-gold)' : 'var(--danger, #e55)'};">${menderName ? '\u2695 ' + menderName + ' tending' : 'No mender assigned'}</span>
          </div>
        `;
        infirmaryBody.appendChild(row);
      }

      infirmaryHeader.addEventListener('click', () => {
        const isCollapsed = infirmaryHeader.classList.toggle('collapsed');
        if (isCollapsed) infirmaryBody.classList.add('hidden');
        else infirmaryBody.classList.remove('hidden');
      });

      infirmarySection.appendChild(infirmaryHeader);
      infirmarySection.appendChild(infirmaryBody);
      container.appendChild(infirmarySection);
    }

    // Unassigned (only if any exist, exclude those already in training)
    const unassigned = state.population.characters.filter(
      c => c.role === 'unassigned' && !c.training && c.health !== 'dead' && c.health !== 'lost'
    );
    if (unassigned.length > 0) {
      container.appendChild(this.buildSection('Untrained', unassigned, {
        titleStyle: 'color: var(--warning);',
      }, state));
    }

    // Training (only if anyone is training)
    const training = state.population.characters.filter(
      c => c.training && c.health !== 'dead' && c.health !== 'lost'
    );
    if (training.length > 0) {
      container.appendChild(this.buildSection('Training', training, {
        titleStyle: 'color: var(--cat-people);',
      }, state));
    }

    // --- Role groups (skip unassigned here since they're shown above) ---
    const roleOrder = ['worker', 'mistwalker', 'soldier', 'priest', 'scholar', 'engineer'];

    roleOrder.forEach(roleKey => {
      const characters = state.population.characters.filter(
        c => c.role === roleKey && c.health !== 'dead' && c.health !== 'lost'
      );
      if (characters.length === 0) return;

      const label = characters.length > 1 ? { worker: 'Workers', mistwalker: 'Mistwalkers', soldier: 'Soldiers', priest: 'Priests', scholar: 'Scholars', engineer: 'Engineers' }[roleKey] : role(roleKey);
      container.appendChild(this.buildSection(label, characters, {}, state));
    });

    // Fallen (contextual)
    const fallen = state.population.characters.filter(c => c.health === 'dead' || c.health === 'lost');
    if (fallen.length > 0) {
      const fallenSection = document.createElement('div');
      fallenSection.className = 'collapsible-section';

      const fallenHeader = document.createElement('div');
      fallenHeader.className = 'collapsible-header';
      fallenHeader.innerHTML = `
        <span class="collapsible-caret">\u25BC</span>
        <span class="collapsible-title" style="color: var(--text-muted);">Fallen (${fallen.length})</span>
      `;

      const fallenBody = document.createElement('div');
      fallenBody.className = 'collapsible-body';
      fallenBody.innerHTML = fallen.map(char => `
        <div class="item-row" style="opacity: 0.6;">
          <span class="item-name">${char.name}</span>
          <span class="item-detail">${role(char.role)}</span>
          <span class="status-bad">${char.health === 'lost' ? 'Claimed by the mist' : 'Fallen'}</span>
        </div>
      `).join('');

      fallenHeader.addEventListener('click', () => {
        const isCollapsed = fallenHeader.classList.toggle('collapsed');
        if (isCollapsed) fallenBody.classList.add('hidden');
        else fallenBody.classList.remove('hidden');
      });

      fallenSection.appendChild(fallenHeader);
      fallenSection.appendChild(fallenBody);
      container.appendChild(fallenSection);
    }

    return container;
  }
}

export default PeopleTab;
