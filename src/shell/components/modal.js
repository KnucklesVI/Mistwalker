/**
 * Modal Dialog Component
 * Keyboard navigable modal for character sheets
 */

import { LEX, role, assignment, health, stat, statLine } from '../lexicon.js?v=5z';

export class Modal {
  constructor() {
    this.element = null;
    this.isOpen = false;
    this.character = null;
    this.activeTab = 'identity';
  }

  create(title, content) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'modal-overlay';

    const modal = document.createElement('div');
    modal.className = 'modal-content';

    const header = document.createElement('div');
    header.className = 'modal-header';
    header.innerHTML = `
      <h2 class="modal-title">${title}</h2>
      <button class="modal-close" aria-label="Close">&times;</button>
    `;

    const closeBtn = header.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => this.close());

    modal.appendChild(header);
    modal.insertAdjacentHTML('beforeend', content);

    overlay.appendChild(modal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this.close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.close();
    });

    this.element = overlay;
    return overlay;
  }

  open() {
    if (this.element) {
      this.element.classList.add('active');
      this.isOpen = true;
    }
  }

  close() {
    if (this.element) {
      this.element.classList.remove('active');
      this.isOpen = false;
    }
  }

  cycleTab(reverse = false) {
    const tabNames = ['identity', 'stats', 'derived', 'modifiers', 'history', 'actions'];
    const currentIndex = tabNames.indexOf(this.activeTab);
    const nextIndex = reverse
      ? (currentIndex - 1 + tabNames.length) % tabNames.length
      : (currentIndex + 1) % tabNames.length;
    this.switchTab(tabNames[nextIndex]);
  }

  switchTab(tabName) {
    document.querySelectorAll('.modal-tab').forEach(tab => {
      tab.classList.remove('active');
    });
    document.querySelectorAll('.modal-tab-content').forEach(content => {
      content.classList.remove('active');
    });

    const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
    const activeContent = document.querySelector(`[data-tab-content="${tabName}"]`);

    if (activeTab) activeTab.classList.add('active');
    if (activeContent) activeContent.classList.add('active');
    this.activeTab = tabName;
  }

  renderCharacterSheet(character, roleAssignments = null) {
    const statFormula = (base, mod) => `${base}${mod > 0 ? '+' : ''}${mod}`;

    const content = `
      <div class="modal-tabs">
        <button class="modal-tab active" data-tab="identity">Identity</button>
        <button class="modal-tab" data-tab="stats">Attributes</button>
        <button class="modal-tab" data-tab="derived">Derived</button>
        <button class="modal-tab" data-tab="modifiers">Modifiers</button>
        <button class="modal-tab" data-tab="history">History</button>
        <button class="modal-tab" data-tab="actions">Actions</button>
      </div>

      <div class="modal-tab-content active" data-tab-content="identity">
        <div class="modal-section">
          <h3 class="modal-section-title">Identity</h3>
          <div style="display: grid; gap: 12px;">
            <div>
              <label style="color: var(--text-secondary); display: block; margin-bottom: 4px;">Name</label>
              <div style="color: var(--text-primary); font-weight: bold;">${character.name}</div>
            </div>
            <div>
              <label style="color: var(--text-secondary); display: block; margin-bottom: 4px;">Role</label>
              <div style="color: var(--accent-gold); font-weight: bold; text-transform: capitalize;">${role(character.role)}</div>
            </div>
            <div>
              <label style="color: var(--text-secondary); display: block; margin-bottom: 4px;">Assignment</label>
              <div style="color: var(--text-primary);">${assignment(character.assignment)}</div>
            </div>
            <div>
              <label style="color: var(--text-secondary); display: block; margin-bottom: 4px;">Tier</label>
              <div style="color: var(--text-primary); text-transform: capitalize;">${character.tier}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-tab-content" data-tab-content="stats">
        <div class="modal-section">
          <h3 class="modal-section-title">Attributes</h3>
          ${(() => {
            // Calculate artifact bonuses
            const artMods = (character.modifiers || []).filter(m => m.type === 'artifact');
            const bonus = { body: 0, mind: 0, spirit: 0 };
            artMods.forEach(m => {
              if (m.statBonuses) {
                bonus.body += m.statBonuses.body || 0;
                bonus.mind += m.statBonuses.mind || 0;
                bonus.spirit += m.statBonuses.spirit || 0;
              }
            });
            const fmt = (base, bon) => bon > 0 ? `${base} <span style="color: var(--success);">(+${bon})</span>` : `${base}`;
            return `
              <div class="stat-grid">
                <div class="stat-box">
                  <div class="stat-label">${stat('body')}</div>
                  <div class="stat-value">${fmt(character.body, bonus.body)}</div>
                </div>
                <div class="stat-box">
                  <div class="stat-label">${stat('mind')}</div>
                  <div class="stat-value">${fmt(character.mind, bonus.mind)}</div>
                </div>
                <div class="stat-box">
                  <div class="stat-label">${stat('spirit')}</div>
                  <div class="stat-value">${fmt(character.spirit, bonus.spirit)}</div>
                </div>
              </div>
            `;
          })()}
        </div>
      </div>

      <div class="modal-tab-content" data-tab-content="derived">
        <div class="modal-section">
          <h3 class="modal-section-title">Condition</h3>
          <div style="display: grid; gap: 12px;">
            <div style="background-color: var(--bg-tertiary); padding: 12px; border-radius: 4px;">
              <div style="color: var(--text-secondary); font-size: 12px; margin-bottom: 4px;">Health</div>
              <div style="color: var(--accent-gold); font-weight: bold; text-transform: capitalize;">${health(character.health)}</div>
            </div>
            <div style="background-color: var(--bg-tertiary); padding: 12px; border-radius: 4px;">
              <div style="color: var(--text-secondary); font-size: 12px; margin-bottom: 4px;">XP</div>
              <div style="color: var(--accent-gold); font-weight: bold;">${character.xp}</div>
            </div>
            ${character.training ? `
            <div style="background-color: var(--bg-tertiary); padding: 12px; border-radius: 4px;">
              <div style="color: var(--text-secondary); font-size: 12px; margin-bottom: 4px;">Training</div>
              <div style="color: var(--warning); font-weight: bold; text-transform: capitalize;">${character.training}</div>
            </div>
            ` : ''}
          </div>
        </div>
      </div>

      <div class="modal-tab-content" data-tab-content="modifiers">
        <div class="modal-section">
          <h3 class="modal-section-title">Modifiers & Items</h3>
          ${character.modifiers && character.modifiers.length > 0
            ? `<div style="display: grid; gap: 8px;">${character.modifiers.map(m => {
                if (m.type === 'artifact') {
                  const bonuses = Object.entries(m.statBonuses || {})
                    .filter(([, v]) => v > 0)
                    .map(([k, v]) => `<span style="color: var(--success);">+${v} ${stat(k)}</span>`)
                    .join(' ');
                  return `
                    <div style="background: var(--bg-tertiary); padding: 10px; border-radius: 4px; border-left: 3px solid var(--accent-gold);">
                      <div style="font-weight: bold; color: var(--accent-gold); margin-bottom: 4px;">${m.name}</div>
                      <div style="font-size: 0.85em;">${bonuses}</div>
                      <div style="font-size: 0.8em; color: var(--text-muted); margin-top: 2px;">${m.special || ''}</div>
                    </div>
                  `;
                }
                return `<div style="padding: 8px; background: var(--bg-tertiary); border-radius: 4px;">${typeof m === 'string' ? m : m.name || 'Unknown modifier'}</div>`;
              }).join('')}</div>`
            : '<div style="color: var(--text-muted);">None equipped</div>'}
        </div>
      </div>

      <div class="modal-tab-content" data-tab-content="history">
        <div class="modal-section">
          <h3 class="modal-section-title">Event History</h3>
          ${character.history && character.history.length > 0
            ? `<div style="display: grid; gap: 8px;">${character.history.map(h => `<div style="padding: 8px; background-color: var(--bg-tertiary); border-radius: 3px;">${h}</div>`).join('')}</div>`
            : '<div style="color: var(--text-muted);">No events recorded</div>'}
        </div>
      </div>

      <div class="modal-tab-content" data-tab-content="actions">
        <div class="modal-section">
          <h3 class="modal-section-title">Assignment</h3>
          ${(() => {
            const assignments = roleAssignments || [];
            if (assignments.length === 0) return '<div style="color: var(--text-muted);">No assignments available</div>';
            return `<div style="display: flex; flex-wrap: wrap; gap: 6px;">${assignments.map(a => {
              const isCurrent = a === character.assignment;
              const cls = isCurrent ? 'btn-primary btn-small' : 'btn-secondary btn-small';
              const label = (character.role === 'mistwalker' && a === 'available') ? 'Monastery' : assignment(a);
              return `<button class="${cls} btn-assign" data-assignment="${a}" data-char-id="${character.id}" ${isCurrent ? 'disabled' : ''} style="text-transform: capitalize;">${label}${isCurrent ? ' \u2713' : ''}</button>`;
            }).join('')}</div>`;
          })()}
        </div>
        <div class="modal-section" style="margin-top: 12px;">
          <h3 class="modal-section-title">Training</h3>
          <div style="display: grid; gap: 8px;">
            ${!character.training ? `
            <button class="btn-secondary btn-action" data-action="reassign" data-char-id="${character.id}">Reassign</button>
            ` : `
            <button class="btn-secondary btn-action" data-action="cancel-training" data-char-id="${character.id}">Abandon Induction</button>
            `}
          </div>
        </div>
      </div>
    `;

    return content;
  }
}

export default Modal;
