/**
 * Main Render Orchestrator
 * Bridge between core engine and UI
 */

import { HeaderBar } from './components/header-bar.js?v=5z';
import { Feed } from './components/feed.js?v=5z';
import { Modal } from './components/modal.js?v=5z';
import { Overlay } from './components/overlay.js?v=5z';
import { NotificationHandler } from './notifications.js?v=5z';
import { LEX, role, assignment, tab, statLine } from './lexicon.js?v=5z';

import { DashboardTab } from './tabs/dashboard.js?v=5z';
import { PeopleTab } from './tabs/people.js?v=5z';
import { ExploreTab } from './tabs/explore.js?v=5z';
import { ResearchTab } from './tabs/research.js?v=5z';
import { BuildTab } from './tabs/build.js?v=5z';
import { ItemsTab } from './tabs/items.js?v=5z';
import { CompendiumTab } from './tabs/compendium.js?v=5z';

// Role-specific assignments
const ROLE_ASSIGNMENTS = {
  priest: ['perimeter', 'available'],
  soldier: ['garrison', 'farming', 'available'],
  engineer: ['building', 'available'],
  worker: ['farming', 'chopping', 'quarrying', 'garrison', 'available'],
  scholar: ['researching', 'available'],
  mistwalker: ['available', 'perimeter'],
  unassigned: ['available'],
};

// Trainable roles — built from config at render time
const TRAINABLE_ROLE_ORDER = ['priest', 'soldier', 'engineer', 'worker', 'scholar', 'mistwalker'];

export class Renderer {
  constructor(engine, containerEl) {
    this.engine = engine;
    this.container = containerEl;
    this.activeTab = 'dashboard';
    this.state = engine.getState();

    this.headerBar = new HeaderBar(() => this.advanceDay());
    this.feed = new Feed();
    this.modal = new Modal();
    this.overlay = new Overlay();

    this.notificationHandler = new NotificationHandler(this.feed, this.overlay, this);

    this.tabInstances = {
      dashboard: new DashboardTab(
        () => this.advanceDay(),
        {
          onSendMW: (ring, totalDays) => { this.dismissedTabs.add('explore'); this.sendMW(ring, totalDays); },
          onTrain: (charId, role) => {
            // Pre-check: will this be the last unassigned after training?
            const currentUnassigned = this.state.population.characters.filter(
              c => c.role === 'unassigned' && !c.training && c.health !== 'dead' && c.health !== 'lost'
            );
            // If only 1 left (the one we're about to train), dismiss people indicator
            if (currentUnassigned.length <= 1) this.dismissedTabs.add('people');
            this.executeCommand({ type: 'TRAIN', characterId: charId, targetRole: role });
          },
          onToggleTraps: () => { this.dismissedTabs.add('build'); this.toggleTrapProduction(); },
          onAssign: (charId, assignment) => this.executeCommand({ type: 'ASSIGN', characterId: charId, assignment }),
          onEquip: (artifactId, charId) => this.executeCommand({ type: 'EQUIP', itemId: artifactId, characterId: charId }),
          onUseTome: (tomeId, charId, stat) => this.executeCommand({ type: 'USE_TOME', tomeId, characterId: charId, stat }),
          onRescue: (charId) => this.executeCommand({ type: 'RESCUE_LOST', characterId: charId }),
          onScoutRaid: (raidId) => this.executeCommand({ type: 'SCOUT_RAID', raidId }),
          onJoinWardline: (charId) => this.executeCommand({ type: 'ASSIGN', characterId: charId, assignment: 'perimeter' }),
          onSetDoctrine: (raidId, soldierId, doctrineId) => this.executeCommand({ type: 'SET_COMBAT_DOCTRINE', raidId, soldierId, doctrineId }),
          onSetPriestAction: (raidId, priestId, action, abilityId) => this.executeCommand({ type: 'SET_COMBAT_PRIEST_ACTION', raidId, priestId, action, abilityId }),
          onConfirmSelections: (raidId) => this.executeCommand({ type: 'CONFIRM_COMBAT_SELECTIONS', raidId }),
          onSwitchTab: (tab) => this.switchTab(tab),
        }
      ),
      people: new PeopleTab(
        (charId) => this.openCharacterModal(charId),
        (action, charId, buttonEl) => this.handleCharacterAction(action, charId, buttonEl)
      ),
      explore: new ExploreTab(
        (ring, totalDays) => this.sendMW(ring, totalDays),
        () => this.cancelMW(),
        (charId) => this.openCharacterModal(charId),
        (locationId, members, daysAtSite) => this.sendExpedition(locationId, members, daysAtSite),
        () => this.cancelExpedition(),
        (raidId) => this.executeCommand({ type: 'SCOUT_RAID', raidId }),
        (charId) => this.executeCommand({ type: 'ASSIGN', characterId: charId, assignment: 'perimeter' }),
        (charId) => this.executeCommand({ type: 'ASSIGN', characterId: charId, assignment: 'available' })
      ),
      research: new ResearchTab(
        (clueId, direction) => this.reorderResearch(clueId, direction),
        {
          onBrowse: (scholarId, topic) => this.libraryBrowse(scholarId, topic),
          onStudy: (scholarId, titleId) => this.libraryStudy(scholarId, titleId),
          onSearchLanguage: (scholarId, languageId) => this.librarySearchLanguage(scholarId, languageId),
          onCancel: (scholarId) => this.libraryCancel(scholarId),
          onShelve: (scholarId) => this.libraryShelve(scholarId),
          onScavenge: (scholarId) => this.libraryScavenge(scholarId),
          onPromoteLibrarian: (charId) => this.promoteLibrarian(charId),
          onSetStudyPreferences: (charId, prefs) => this.executeCommand({ type: 'SET_STUDY_PREFERENCES', characterId: charId, preferences: prefs }),
        }
      ),
      build: new BuildTab(
        () => this.toggleTrapProduction(),
        (charId, assignment) => this.executeCommand({ type: 'ASSIGN', characterId: charId, assignment }),
        (category, subtype, quantity) => this.executeCommand({ type: 'BUILD', category, structureType: subtype, quantity }),
        (towerId, priestId) => this.executeCommand({ type: 'PIN_TOWER', towerId, priestId }),
        (quantity) => this.executeCommand({ type: 'PLACE_TRAPS', quantity }),
      ),
      items: new ItemsTab(
        (artifactId, charId) => this.executeCommand({ type: 'EQUIP', itemId: artifactId, characterId: charId }),
        (artifactId) => this.executeCommand({ type: 'UNEQUIP', itemId: artifactId }),
        (tomeId, charId, stat) => this.executeCommand({ type: 'USE_TOME', tomeId, characterId: charId, stat }),
      ),
      compendium: new CompendiumTab(),
    };

    this.domElements = {
      headerBar: null,
      mainLayout: null,
      contentArea: null,
      tabBar: null,
      feedSidebar: null,
      tabContents: {},
    };

    // Active dropdown tracking
    this.activeDropdown = null;

    // Track which tabs have been dismissed (left or acted upon) — indicators won't show for these
    this.dismissedTabs = new Set();

    // Listen for sub-tab changes within research tab
    document.addEventListener('research-subtab-changed', () => {
      if (this.activeTab === 'research') this.updateActiveTab();
    });
  }

  initialize() {
    this.container.innerHTML = '';

    // Create header
    const header = this.headerBar.render(this.state);
    this.container.appendChild(header);
    this.domElements.headerBar = header;

    // Create main layout
    const mainLayout = document.createElement('div');
    mainLayout.className = 'main-layout';

    // Create content area
    const contentArea = document.createElement('div');
    contentArea.className = 'content-area';

    // Create tab bar
    const tabBar = document.createElement('div');
    tabBar.className = 'tab-bar';
    const tabNames = ['dashboard', 'people', 'explore', 'research', 'build', 'items', 'compendium'];
    tabNames.forEach(name => {
      const btn = document.createElement('button');
      btn.className = `tab-button ${name === this.activeTab ? 'active' : ''}`;
      btn.textContent = tab(name);
      btn.addEventListener('click', () => this.switchTab(name));
      btn.setAttribute('data-tab', name);
      tabBar.appendChild(btn);
    });

    contentArea.appendChild(tabBar);

    // Create tab content areas
    const tabContainer = document.createElement('div');
    tabContainer.style.flex = '1';
    tabContainer.style.overflow = 'hidden';
    tabContainer.style.display = 'flex';
    tabContainer.style.flexDirection = 'column';

    tabNames.forEach(name => {
      const content = document.createElement('div');
      content.className = `tab-content ${name === this.activeTab ? 'active' : ''}`;
      content.id = `tab-${name}`;
      content.appendChild(this.tabInstances[name].render(this.state));
      tabContainer.appendChild(content);
      this.domElements.tabContents[name] = content;
    });

    contentArea.appendChild(tabContainer);

    // Create feed sidebar (left side)
    const feedSidebar = this.feed.render();
    mainLayout.appendChild(feedSidebar);

    // Content area (right side)
    mainLayout.appendChild(contentArea);

    this.container.appendChild(mainLayout);

    // Add modal and overlay to DOM
    this.container.appendChild(this.modal.create('Character Sheet', ''));
    this.container.appendChild(this.overlay.render());

    // Add initial feed entry
    this.feed.addEntry(this.state.time.day, 'A refuge rises from the mist. The first dawn.', 'routine');

    this.domElements.mainLayout = mainLayout;
    this.domElements.contentArea = contentArea;
    this.domElements.tabBar = tabBar;
    this.domElements.feedSidebar = feedSidebar;

    // Close dropdowns on click outside
    document.addEventListener('click', (e) => {
      if (this.activeDropdown && !e.target.closest('.inline-dropdown')) {
        this.closeDropdown();
      }
    });

    // Initial tab indicators
    this.updateTabIndicators();
  }

  render(state, notifications = []) {
    this.state = state;

    // Update header
    this.updateHeader();

    // Update active tab content
    this.updateActiveTab();

    // Update tab indicators
    this.updateTabIndicators();

    // Handle notifications — pass state so it can read feed entries
    this.notificationHandler.handle(state, notifications);

    // Auto-focus first quick action on dashboard
    if (this.activeTab === 'dashboard') {
      this.focusDashboardAction();
    }
  }

  updateHeader() {
    if (this.domElements.headerBar && this.domElements.headerBar.parentNode) {
      const newHeader = this.headerBar.render(this.state);
      this.domElements.headerBar.replaceWith(newHeader);
      this.domElements.headerBar = newHeader;
    }
  }

  updateActiveTab() {
    const tabContent = this.domElements.tabContents[this.activeTab];
    if (tabContent) {
      tabContent.innerHTML = '';
      tabContent.appendChild(this.tabInstances[this.activeTab].render(this.state));
    }
  }

  /**
   * Determine which tabs should show an action indicator
   */
  getTabIndicators(state) {
    const indicators = {};

    // Explore: MW is home and alive
    const mw = state.population.characters.find(c => c.role === 'mistwalker' && c.health === 'active');
    if (mw && state.exploration.mwState.status === 'home') {
      indicators.explore = true;
    }

    // Research: no indicator — updates shown on dashboard instead

    // People: new arrivals this day that still need training
    const newArrivals = state.population.characters.filter(
      c => c.role === 'unassigned' && c.health !== 'dead' && c.health !== 'lost' && c.arrivalDay === state.time.day
    );
    if (newArrivals.length > 0) {
      indicators.people = true;
    }

    // Build: trap inventory ready to place (action needed)
    const trapInventory = state.combat?.trapInventory || [];
    if (trapInventory.length > 0 && !state.combat?.trapPlacementQueue) {
      indicators.build = true;
    }

    // Items: only light when an identified artifact is unequipped (ready to equip)
    const unequippedIdentified = (state.knowledge.artifacts || []).filter(
      a => a.identified && !a.equippedTo
    );
    if (unequippedIdentified.length > 0) {
      indicators.items = true;
    }

    return indicators;
  }

  updateTabIndicators() {
    try {
      const indicators = this.getTabIndicators(this.state);

      const tabBar = this.domElements.tabBar;
      if (!tabBar) return;

      const buttons = tabBar.querySelectorAll('.tab-button');

      for (const btn of buttons) {
        const name = btn.getAttribute('data-tab');
        if (!name) continue;

        // Show indicator if: action available AND tab not yet dismissed this turn
        if (indicators[name] && !this.dismissedTabs.has(name)) {
          btn.classList.add('has-indicator');
        } else {
          btn.classList.remove('has-indicator');
        }
      }
    } catch (err) {
      console.error('[TAB-INDICATORS] Error:', err);
    }
  }

  switchTab(tabName) {
    if (this.activeTab === tabName) return;

    // Hide current tab
    document.querySelectorAll('.tab-content').forEach(tc => {
      tc.classList.remove('active');
    });

    // Update button states
    document.querySelectorAll('.tab-button').forEach(btn => {
      btn.classList.remove('active');
    });

    const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeBtn) {
      activeBtn.classList.add('active');
    }

    // Show new tab
    const newTabContent = document.getElementById(`tab-${tabName}`);
    if (newTabContent) {
      newTabContent.classList.add('active');
      newTabContent.innerHTML = '';
      newTabContent.appendChild(this.tabInstances[tabName].render(this.state));
    }

    // Dismiss the tab we're leaving
    this.dismissedTabs.add(this.activeTab);
    this.activeTab = tabName;
    this.updateTabIndicators();

    // Auto-focus first quick action on dashboard
    if (tabName === 'dashboard') {
      this.focusDashboardAction();
    }
  }

  cycleSubTabs(reverse = false) {
    const researchTab = this.tabInstances.research;
    if (researchTab && typeof researchTab.cycleSubTab === 'function') {
      researchTab.cycleSubTab(reverse);
      document.dispatchEvent(new CustomEvent('research-subtab-changed'));
    }
  }

  advanceDay() {
    // Reset dismissed tabs so indicators reappear for the new day
    this.dismissedTabs = new Set();
    const result = this.engine.advanceDay();
    this.render(result.newState, result.notifications);
  }

  executeCommand(cmd) {
    const result = this.engine.executeCommand(this.engine.state, cmd);
    if (result.success) {
      // Update engine state
      this.engine.state = result.newState;

      // Dismiss indicator on the current tab — user took action
      this.dismissedTabs.add(this.activeTab);

      // Route immediate command notifications to the feed
      for (const notif of result.notifications) {
        if (notif.message) {
          this.feed.addEntry(
            result.newState.time.day,
            notif.message,
            notif.classification || 'routine',
            notif.category || 'general'
          );
        }
      }

      this.render(result.newState, result.notifications);
    } else {
      console.warn('[EXEC-CMD] Command failed:', cmd.type, result.reason);
      // Show failure to the player in the feed
      if (result.reason) {
        this.feed.addEntry(
          this.state.time.day,
          `Command failed: ${result.reason}`,
          'routine',
          'system'
        );
      }
    }
  }

  sendMW(ring, totalDays) {
    const cmd = {
      type: 'SEND_MW',
      ring,
      totalDays,
    };
    this.executeCommand(cmd);
  }

  cancelMW() {
    const cmd = {
      type: 'CANCEL_MW',
    };
    this.executeCommand(cmd);
  }

  sendExpedition(locationId, members, daysAtSite) {
    this.executeCommand({
      type: 'SEND_EXPEDITION',
      locationId,
      members,
      daysAtSite,
    });
  }

  cancelExpedition() {
    this.executeCommand({
      type: 'CANCEL_EXPEDITION',
    });
  }

  toggleTrapProduction() {
    this.executeCommand({
      type: 'TOGGLE_TRAP_PRODUCTION',
    });
  }

  cancelResearch(researchId) {
    this.executeCommand({
      type: 'CANCEL_RESEARCH',
      researchId,
    });
  }

  reorderResearch(clueId, direction) {
    this.executeCommand({
      type: 'REORDER_RESEARCH',
      clueId,
      direction,
    });
  }

  libraryBrowse(scholarId, topic) {
    const cmd = {
      type: 'LIBRARY_BROWSE',
      scholarId,
    };
    if (topic) cmd.topic = topic;
    this.executeCommand(cmd);
  }

  libraryStudy(scholarId, titleId) {
    this.executeCommand({
      type: 'LIBRARY_STUDY',
      scholarId,
      titleId,
    });
  }

  librarySearchLanguage(scholarId, languageId) {
    this.executeCommand({
      type: 'LIBRARY_SEARCH_LANGUAGE',
      scholarId,
      languageId,
    });
  }

  libraryCancel(scholarId) {
    this.executeCommand({
      type: 'LIBRARY_CANCEL',
      scholarId,
    });
  }

  libraryShelve(scholarId) {
    this.executeCommand({
      type: 'LIBRARY_SHELVE',
      scholarId,
    });
  }

  libraryScavenge(scholarId) {
    this.executeCommand({
      type: 'LIBRARY_SCAVENGE',
      scholarId,
    });
  }

  promoteLibrarian(characterId) {
    this.executeCommand({
      type: 'PROMOTE_LIBRARIAN',
      characterId,
    });
  }

  /**
   * Auto-focus the first actionable button in Quick Actions on the dashboard.
   * Runs after render via requestAnimationFrame so DOM is ready.
   */
  focusDashboardAction() {
    requestAnimationFrame(() => {
      const dashPane = document.getElementById('tab-dashboard');
      if (!dashPane) return;

      // Find first enabled button or select inside a nav-group (Quick Actions)
      const firstBtn = dashPane.querySelector('.nav-group .ring-btn:not([disabled]), .nav-group select');
      if (firstBtn) {
        // Clear any existing nav focus and set it
        document.querySelectorAll('.nav-focused').forEach(el => el.classList.remove('nav-focused'));
        firstBtn.classList.add('nav-focused');
        firstBtn.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    });
  }

  // --- Inline dropdown system ---

  closeDropdown() {
    if (this.activeDropdown) {
      this.activeDropdown.remove();
      this.activeDropdown = null;
    }
  }

  showAssignmentDropdown(charId, buttonEl) {
    this.closeDropdown();

    const char = this.state.population.characters.find(c => c.id === charId);
    if (!char) return;

    const assignments = ROLE_ASSIGNMENTS[char.role] || ['available'];

    const dropdown = document.createElement('div');
    dropdown.className = 'inline-dropdown';

    assignments.forEach(assignmentKey => {
      const option = document.createElement('div');
      option.className = `dropdown-option ${assignmentKey === char.assignment ? 'current' : ''}`;
      // MW's default state is "Monastery", not "Unassigned"
      const label = (char.role === 'mistwalker' && assignmentKey === 'available') ? 'Monastery' : assignment(assignmentKey);
      option.textContent = label;
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        if (assignmentKey !== char.assignment) {
          this.executeCommand({
            type: 'ASSIGN',
            characterId: charId,
            assignment: assignmentKey,
          });
        }
        this.closeDropdown();
      });
      dropdown.appendChild(option);
    });

    this._positionDropdown(dropdown, buttonEl);
    this.activeDropdown = dropdown;
  }

  showTrainingDropdown(charId, buttonEl) {
    this.closeDropdown();

    const char = this.state.population.characters.find(c => c.id === charId);
    if (!char || char.training) return;

    const dropdown = document.createElement('div');
    dropdown.className = 'inline-dropdown';

    const rolesConfig = this.state.config?.roles || {};
    TRAINABLE_ROLE_ORDER.forEach(roleKey => {
      const rc = rolesConfig[roleKey] || {};
      const label = role(roleKey);
      const req = rc.reqLabel || '';
      const reqs = rc.req || {};
      if (roleKey === char.role) return; // Can't train to current role

      // Check stat requirements from config
      let meetsReqs = true;
      for (const [stat, min] of Object.entries(reqs)) {
        if (char[stat] < min) { meetsReqs = false; break; }
      }

      const option = document.createElement('div');
      option.className = `dropdown-option ${!meetsReqs ? 'disabled' : ''}`;
      option.innerHTML = `<span style="white-space:nowrap">${label}</span><span class="dropdown-req">${req}</span>`;

      if (meetsReqs) {
        option.addEventListener('click', (e) => {
          e.stopPropagation();
          this.executeCommand({
            type: 'TRAIN',
            characterId: charId,
            targetRole: roleKey,
          });
          this.closeDropdown();
        });
      }

      dropdown.appendChild(option);
    });

    this._positionDropdown(dropdown, buttonEl);
    this.activeDropdown = dropdown;
  }

  /**
   * Position a dropdown near a button, clamped to viewport
   */
  _positionDropdown(dropdown, buttonEl) {
    const rect = buttonEl.getBoundingClientRect();
    dropdown.style.position = 'fixed';
    dropdown.style.zIndex = '200';

    // Add to DOM first so we can measure it
    document.body.appendChild(dropdown);
    const ddRect = dropdown.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const margin = 8;

    // Vertical: prefer below, flip above if no room
    let top = rect.bottom + 2;
    if (top + ddRect.height > vh - margin) {
      top = rect.top - ddRect.height - 2;
    }
    // Clamp to viewport
    top = Math.max(margin, Math.min(top, vh - ddRect.height - margin));

    // Horizontal: prefer aligned to button left, shift left if overflows
    let left = rect.left;
    if (left + ddRect.width > vw - margin) {
      left = vw - ddRect.width - margin;
    }
    left = Math.max(margin, left);

    dropdown.style.top = top + 'px';
    dropdown.style.left = left + 'px';
  }

  handleCharacterAction(action, charId, buttonEl) {
    if (action === 'reassign') {
      if (buttonEl) {
        this.showAssignmentDropdown(charId, buttonEl);
      }
    } else if (action === 'train') {
      if (buttonEl) {
        this.showTrainingDropdown(charId, buttonEl);
      }
    } else if (action === 'cancel-training') {
      this.executeCommand({
        type: 'CANCEL_TRAINING',
        characterId: charId,
      });
    }
  }

  openCharacterModal(charId) {
    const char = this.state.population.characters.find(c => c.id === charId);
    if (!char) return;

    const roleAssignments = ROLE_ASSIGNMENTS[char.role] || ['available'];
    const content = this.modal.renderCharacterSheet(char, roleAssignments);
    const newModal = this.modal.create(`${char.name} - ${role(char.role)}`, content);

    const oldModal = document.getElementById('modal-overlay');
    if (oldModal) oldModal.replaceWith(newModal);
    else this.container.appendChild(newModal);

    this.modal.element = newModal;
    this.modal.open();

    // Add event listeners for assignment buttons
    newModal.querySelectorAll('.btn-assign').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const assignment = e.target.dataset.assignment;
        const cId = e.target.dataset.charId;
        this.executeCommand({
          type: 'ASSIGN',
          characterId: cId,
          assignment,
        });
        // Refresh the modal with updated state
        this.openCharacterModal(cId);
      });
    });

    // Add event listeners for action buttons
    newModal.querySelectorAll('.btn-action').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.target.dataset.action;
        const cId = e.target.dataset.charId;
        this.handleCharacterAction(action, cId, e.target);
        if (action === 'cancel-training') {
          this.modal.close();
        }
      });
    });

    // Tab switching
    newModal.querySelectorAll('.modal-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const tabName = e.target.dataset.tab;
        this.modal.switchTab(tabName);
      });
    });
  }
}

export default Renderer;
