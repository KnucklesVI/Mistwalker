/**
 * Research Tab - Scholar workspace
 * Includes both clue research (existing) and library system (reworked)
 *
 * Library UI sections:
 *   - Actions (scavenge, browse, learn language)
 *   - Unread shelf (current find + unread + needs-language merged, with filters & language badges)
 *   - Mastered shelf (successfully studied books with role benefit + ability)
 */

import LIBRARY_CATALOG from '../../core/library-catalog.js?v=5z';
import COUNTER_CATALOG from '../../core/counter-catalog.js?v=5z';
import FILLER_CATALOG from '../../core/filler-catalog.js?v=5z';
import { LEX, role, stat, statLine } from '../lexicon.js?v=5z';

// Combined catalog for title lookups
const FULL_CATALOG = [...LIBRARY_CATALOG, ...COUNTER_CATALOG, ...FILLER_CATALOG];
function findTitle(titleId) {
  return FULL_CATALOG.find(t => t.id === titleId);
}

export class ResearchTab {
  constructor(onReorderQueue, libraryCallbacks = {}) {
    this.onReorderQueue = onReorderQueue;
    this.onLibraryBrowse = libraryCallbacks.onBrowse || null;
    this.onLibraryStudy = libraryCallbacks.onStudy || null;
    this.onLibraryShelve = libraryCallbacks.onShelve || null;
    this.onLibrarySearchLanguage = libraryCallbacks.onSearchLanguage || null;
    this.onLibraryCancel = libraryCallbacks.onCancel || null;
    this.onLibraryScavenge = libraryCallbacks.onScavenge || null;
    this.onPromoteArchivist = libraryCallbacks.onPromoteArchivist || null;
    this.onSetStudyPreferences = libraryCallbacks.onSetStudyPreferences || null;
    this.activeSubTab = 'scriptorium';
    this._expandedScholars = new Set();
  }

  cycleSubTab(reverse = false) {
    const subTabIds = ['scriptorium', 'library', 'cartography', 'herbalism', 'artificer', 'essence_lab'];
    const currentIndex = subTabIds.indexOf(this.activeSubTab);
    const nextIndex = reverse
      ? (currentIndex - 1 + subTabIds.length) % subTabIds.length
      : (currentIndex + 1) % subTabIds.length;
    this.activeSubTab = subTabIds[nextIndex];
  }

  render(state) {
    const container = document.createElement('div');

    // Sub-tab bar
    container.appendChild(this._renderSubTabBar(state));

    // Render active sub-tab content
    if (this.activeSubTab === 'scriptorium') {
      container.appendChild(this._renderScriptoriumSubTab(state));
    } else {
      container.appendChild(this._renderLockedSubTab(this.activeSubTab));
    }

    return container;
  }

  // ==========================================
  //  Sub-tab bar
  // ==========================================
  _renderSubTabBar(state) {
    const bar = document.createElement('div');
    bar.className = 'nav-group';
    bar.style.cssText = 'display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 1px solid var(--bg-tertiary, #333);';

    const subTabs = [
      { id: 'scriptorium', label: 'Scriptorium', locked: false },
      { id: 'library', label: 'Library', locked: true, desc: "The Librarian's domain \u2014 domain research, blueprint discovery, and general study" },
      { id: 'cartography', label: 'Maps', locked: true, desc: 'Map analysis and route planning' },
      { id: 'herbalism', label: 'Herbs', locked: true, desc: 'Herb identification and remedy crafting' },
      { id: 'artificer', label: 'Artifacts', locked: true, desc: 'Artifact study and enhancement' },
      { id: 'essence_lab', label: 'Essence', locked: true, desc: 'Essence extraction and creature study' },
    ];

    for (const tab of subTabs) {
      const btn = document.createElement('button');
      btn.className = 'ring-btn';
      btn.textContent = tab.locked ? `${tab.label} \u{1F512}` : tab.label;
      btn.title = tab.locked ? `Locked \u2014 ${tab.desc}` : tab.label;
      btn.style.cssText = `font-size: 0.85em; padding: 4px 12px;`;

      if (this.activeSubTab === tab.id) {
        btn.style.background = 'var(--accent-gold)';
        btn.style.color = 'var(--bg-primary, #111)';
      }

      if (tab.locked) {
        btn.style.opacity = '0.4';
      }

      const tabId = tab.id;
      btn.addEventListener('click', () => {
        this.activeSubTab = tabId;
        // Force re-render by dispatching a custom event
        document.dispatchEvent(new CustomEvent('research-subtab-changed'));
      });
      bar.appendChild(btn);
    }

    return bar;
  }

  // ==========================================
  //  Scriptorium sub-tab (general research workspace)
  // ==========================================
  _renderScriptoriumSubTab(state) {
    const wrapper = document.createElement('div');

    // Scholar Overview — merged: current work + next items + caret for preferences/specialization
    wrapper.appendChild(this._renderScholarOverview(state));

    // Lore Queue — reorderable queue of clues awaiting research
    wrapper.appendChild(this._renderResearchQueue(state));

    // Decoded Knowledge
    wrapper.appendChild(this._renderDecodedKnowledge(state));

    // Inventory by Category — at bottom, collapsed by default
    wrapper.appendChild(this._renderInventoryByCategory(state));

    return wrapper;
  }

  // ==========================================
  //  Locked sub-tab placeholder
  // ==========================================
  _renderLockedSubTab(tabId) {
    const descriptions = {
      library: "The Library is the Librarian's sanctum. Once a scholar is promoted to Librarian, they conduct domain research here \u2014 uncovering blueprints for specialist rooms, studying advanced topics, and guiding the monastery's intellectual direction.",
      cartography: "The Wayfinder's Cell will house a dedicated cartographer, enabling map analysis, route planning, and discovery of hidden locations. Requires a Librarian to research the blueprint, then an engineer to build it.",
      herbalism: 'The Herbarium will house a dedicated herbalist, enabling identification of gathered herbs and crafting of remedies. Requires a Librarian to research the blueprint, then an engineer to build it.',
      artificer: 'The Relic Vault will house a dedicated artificer, enabling study and enhancement of discovered artifacts. Requires a Librarian to research the blueprint, then an engineer to build it.',
      essence_lab: 'The Alembic Chamber will house a dedicated scholar of essences, enabling extraction and infusion of creature essences for powerful effects. Requires a Librarian to research the blueprint, then an engineer to build it.',
    };

    const div = document.createElement('div');
    div.style.cssText = 'padding: 20px; text-align: center;';
    div.innerHTML = `
      <div style="font-size: 1.2em; color: var(--text-muted); margin-bottom: 12px;">\u{1F512} Locked</div>
      <div style="color: var(--text-muted); font-size: 0.9em; max-width: 400px; margin: 0 auto; line-height: 1.5;">
        ${descriptions[tabId] || 'This room has not yet been built.'}
      </div>
    `;
    return div;
  }

  // ==========================================
  //  Scholar Overview
  // ==========================================
  _renderScholarOverview(state) {
    const { knowledge, population } = state;
    const scholars = population.characters.filter(c => c.role === 'scholar');
    const libraryStates = state.library?.scholarStates || {};
    const activeResearch = knowledge.activeResearch || [];
    const clues = (knowledge.clues || []).filter(c => c.status === 'perceived');

    const section = document.createElement('div');
    section.className = 'collapsible-section';

    const header = document.createElement('div');
    header.className = 'collapsible-header';
    header.innerHTML = `
      <span class="collapsible-caret">\u25BC</span>
      <span class="collapsible-title">Scholar Overview</span>
      <span class="item-detail" style="margin-left: auto;">${scholars.filter(s => s.health === 'active').length} active / ${scholars.length} total</span>
    `;

    const body = document.createElement('div');
    body.className = 'collapsible-body';

    const categories = state.config?.scholar?.categories || ['lore', 'maps', 'artifacts', 'herbs', 'essences'];

    if (scholars.length > 0) {
      // Build list of scholars doing clue research (not in library) in priority order
      const researchingScholars = scholars.filter(
        s => s.role === 'scholar' && s.assignment === 'researching' && s.health === 'active'
          && !libraryStates[s.id]?.currentActivity
      );

      // Determine which clue each scholar will get next (based on queue priority)
      // 1st available scholar → 1st queued clue, 2nd → 2nd, etc.
      const assignedClueIds = new Set(activeResearch.map(r => r.id));
      const scholarNextClue = {};
      let clueIdx = 0;
      for (const rs of researchingScholars) {
        // Skip scholars who already have an active research item
        const hasActive = activeResearch.find(r => r.assignedScholarId === rs.id);
        if (hasActive) continue;
        // Find next unassigned clue
        while (clueIdx < clues.length && assignedClueIds.has(clues[clueIdx].id)) clueIdx++;
        if (clueIdx < clues.length) {
          scholarNextClue[rs.id] = clues[clueIdx];
          assignedClueIds.add(clues[clueIdx].id);
          clueIdx++;
        }
      }

      for (const s of scholars) {
        const libState = libraryStates[s.id];
        const isResearching = s.assignment === 'researching' && !libState?.currentActivity;

        // Find this scholar's individually assigned research item
        const myResearch = activeResearch.find(r => r.assignedScholarId === s.id);

        // Determine current work text + progress
        let taskInfo = s.assignment || 'Unassigned';
        let showProgress = false;
        let progressPct = 0;
        let researchName = '';
        let statusLabel = '';

        if (libState?.currentActivity) {
          const act = libState.currentActivity;
          if (act.type === 'browsing') taskInfo = `Browsing archives (${act.daysRemaining}d)`;
          else if (act.type === 'studying') taskInfo = `Deciphering "${act.titleName}" (${act.daysRemaining}d)`;
          else if (act.type === 'scavenging') taskInfo = `Scavenging (${act.daysRemaining}d)`;
          else if (act.type === 'learning_language') taskInfo = `Learning ${act.languageName} (${act.daysRemaining}d)`;
        } else if (isResearching && myResearch) {
          // Scholar has their own active research item
          const duration = myResearch.duration || 1;
          const remaining = myResearch.daysRemaining || 0;
          progressPct = Math.round(((duration - remaining) / duration) * 100);
          researchName = myResearch.name;
          taskInfo = `Decoding "${researchName}" \u00B7 ${Math.ceil(remaining)}d`;
          showProgress = true;
          statusLabel = 'working';
        } else if (isResearching && scholarNextClue[s.id]) {
          // Scholar will pick up the next clue from queue tomorrow
          researchName = scholarNextClue[s.id].name;
          taskInfo = '';  // Name shown under progress bar instead
          showProgress = true;  // Show empty progress bar
          progressPct = 0;
          statusLabel = 'researching';
        } else if (isResearching) {
          taskInfo = 'Idle \u2014 awaiting clues';
        }

        // Scholar row with collapsible detail
        const isExpanded = this._expandedScholars.has(s.id);

        const scholarRow = document.createElement('div');
        scholarRow.style.cssText = 'margin-bottom: 4px; padding-bottom: 4px; border-bottom: 1px solid var(--bg-tertiary, #222);';

        // Clickable header: caret + name + current work + health/status
        const mainRow = document.createElement('div');
        mainRow.className = 'scholar-row';
        mainRow.dataset.scholarId = s.id;
        mainRow.style.cssText = 'display: flex; align-items: center; gap: 6px; cursor: pointer; padding: 2px 0;';

        const caret = document.createElement('span');
        caret.textContent = isExpanded ? '\u25BC' : '\u25B6';
        caret.style.cssText = 'font-size: 0.7em; color: var(--text-muted); transition: transform 0.15s; flex-shrink: 0;';
        mainRow.appendChild(caret);

        const infoSpan = document.createElement('span');
        infoSpan.className = 'item-row';
        infoSpan.style.cssText = 'flex: 1; margin: 0;';
        const statusClass = statusLabel === 'working' ? 'status-good' : statusLabel === 'researching' ? 'status-good' : (s.health === 'active' ? 'status-good' : 'status-bad');
        const statusText = statusLabel || s.health;
        infoSpan.innerHTML = `
          <span class="item-name">${s.name}</span>
          <span class="item-detail">${taskInfo}</span>
          <span class="${statusClass}">${statusText}</span>
        `;
        mainRow.appendChild(infoSpan);
        scholarRow.appendChild(mainRow);

        // Progress bar — always shown for researching scholars (even at 0%)
        if (showProgress) {
          const barDiv = document.createElement('div');
          barDiv.className = 'perimeter-bar-container';
          barDiv.style.cssText = 'margin: 2px 0 2px 18px;';
          barDiv.innerHTML = `<div class="perimeter-bar" style="width: ${progressPct}%; background-color: var(--accent-gold);"></div>`;
          scholarRow.appendChild(barDiv);

          // Research name label under progress bar
          if (researchName) {
            const nameLabel = document.createElement('div');
            nameLabel.setAttribute('data-nav-skip', '');
            nameLabel.style.cssText = 'font-size: 0.75em; color: var(--text-muted); padding: 0 0 2px 18px;';
            nameLabel.textContent = statusLabel === 'researching' ? `${researchName} (Queued)` : researchName;
            scholarRow.appendChild(nameLabel);
          }
        }

        // Collapsible detail panel (preserve expanded state across re-renders)
        const detailPanel = document.createElement('div');
        detailPanel.style.cssText = `display: ${isExpanded ? 'block' : 'none'}; padding: 6px 0 4px 18px;`;

        // Study preference checkboxes
        const prefs = libState?.studyPreferences || {};
        const prefLabel = document.createElement('div');
        prefLabel.setAttribute('data-nav-skip', 'true');
        prefLabel.style.cssText = 'font-size: 0.75em; color: var(--text-muted); margin-bottom: 4px;';
        prefLabel.textContent = 'Study focus:';
        detailPanel.appendChild(prefLabel);

        const checkboxRow = document.createElement('div');
        checkboxRow.style.cssText = 'display: flex; gap: 10px; flex-wrap: wrap;';

        for (const cat of categories) {
          const isOn = prefs[cat] !== false;
          const label = document.createElement('label');
          label.style.cssText = 'display: flex; align-items: center; gap: 3px; font-size: 0.75em; color: var(--text-secondary); cursor: pointer;';

          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.className = 'scholar-checkbox';
          checkbox.checked = isOn;
          checkbox.style.cssText = 'accent-color: var(--accent-gold); cursor: pointer;';

          const charId = s.id;
          const catId = cat;
          const currentPrefs = { ...prefs };
          checkbox.addEventListener('change', () => {
            const newPrefs = { ...currentPrefs, [catId]: checkbox.checked };
            if (this.onSetStudyPreferences) this.onSetStudyPreferences(charId, newPrefs);
          });

          label.appendChild(checkbox);
          label.appendChild(document.createTextNode(cat));
          checkboxRow.appendChild(label);
        }
        detailPanel.appendChild(checkboxRow);

        // Specialization progress
        const categoryXp = libState?.categoryXp || {};
        const nicheThreshold = state.config?.scholar?.nicheThreshold || 5;
        const specSection = document.createElement('div');
        specSection.setAttribute('data-nav-skip', '');
        specSection.style.cssText = 'margin-top: 8px; padding-top: 6px; border-top: 1px solid var(--bg-secondary, #222);';

        const specLabel = document.createElement('div');
        specLabel.style.cssText = 'font-size: 0.75em; color: var(--text-muted); margin-bottom: 4px;';
        specLabel.textContent = 'Specialization progress:';
        specSection.appendChild(specLabel);

        for (const cat of categories) {
          const xp = categoryXp[cat] || 0;
          const capped = Math.min(xp, nicheThreshold);
          const isMaxed = capped >= nicheThreshold;
          const pct = Math.round((capped / nicheThreshold) * 100);

          const xpRow = document.createElement('div');
          xpRow.style.cssText = 'display: flex; align-items: center; gap: 6px; margin-bottom: 4px;';

          const catLabel = document.createElement('span');
          catLabel.style.cssText = 'font-size: 0.75em; color: var(--text-muted); min-width: 55px;';
          catLabel.textContent = cat;
          xpRow.appendChild(catLabel);

          const barOuter = document.createElement('div');
          barOuter.style.cssText = 'flex: 1; max-width: 80px; height: 6px; background: var(--bg-secondary, #222); border-radius: 3px; overflow: hidden;';
          const barInner = document.createElement('div');
          barInner.style.cssText = `height: 100%; width: ${pct}%; background: ${isMaxed ? 'var(--accent-gold)' : 'var(--text-muted)'}; border-radius: 3px;`;
          barOuter.appendChild(barInner);
          xpRow.appendChild(barOuter);

          if (isMaxed) {
            const specBtn = document.createElement('button');
            specBtn.className = 'ring-btn';
            specBtn.textContent = 'Specialize';
            specBtn.style.cssText = 'font-size: 0.65em; padding: 1px 6px; opacity: 0.4;';
            specBtn.disabled = true;
            specBtn.title = 'Requires Librarian research + Engineer to build room';
            xpRow.appendChild(specBtn);
          }

          specSection.appendChild(xpRow);
        }
        detailPanel.appendChild(specSection);

        scholarRow.appendChild(detailPanel);

        // Stop clicks inside the detail panel from collapsing it
        detailPanel.addEventListener('click', (e) => e.stopPropagation());

        // Toggle expand/collapse on header click
        const scholarId = s.id;
        mainRow.addEventListener('click', () => {
          const isOpen = detailPanel.style.display !== 'none';
          detailPanel.style.display = isOpen ? 'none' : 'block';
          caret.textContent = isOpen ? '\u25B6' : '\u25BC';
          if (isOpen) this._expandedScholars.delete(scholarId);
          else this._expandedScholars.add(scholarId);
        });

        body.appendChild(scholarRow);
      }
    } else {
      body.innerHTML = '<div style="color: var(--text-muted);">No scholars in settlement</div>';
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

  // ==========================================
  //  Archives Section — any scholar can use
  // ==========================================
  _renderLibrary(state) {
    const scholars = state.population.characters.filter(c => c.role === 'scholar' && c.health === 'active');
    const libraryStates = state.library?.scholarStates || {};
    const unlockedAbilities = state.library?.unlockedAbilities || [];

    const section = document.createElement('div');
    section.className = 'collapsible-section';

    const header = document.createElement('div');
    header.className = 'collapsible-header';
    header.innerHTML = `
      <span class="collapsible-caret">\u25BC</span>
      <span class="collapsible-title">Archives</span>
      <span class="item-detail" style="margin-left: auto;">${unlockedAbilities.length} abilities unlocked</span>
    `;

    const body = document.createElement('div');
    body.className = 'collapsible-body';

    if (scholars.length === 0) {
      const noScholars = document.createElement('div');
      noScholars.style.cssText = 'color: var(--text-muted); font-size: 0.85em;';
      noScholars.textContent = 'No active scholars to work the archives';
      body.appendChild(noScholars);
    } else {
      // Show busy scholars (who's doing what)
      const busy = scholars.filter(s => libraryStates[s.id]?.currentActivity);
      const idle = scholars.filter(s => !libraryStates[s.id]?.currentActivity);

      if (busy.length > 0) {
        for (const scholar of busy) {
          body.appendChild(this._renderLibraryActivity(scholar, libraryStates[scholar.id].currentActivity, state));
        }
      }

      // Shared actions — first idle scholar handles it
      if (idle.length > 0) {
        const worker = idle[0];
        const libState = libraryStates[worker.id];
        body.appendChild(this._renderLibraryActions(worker, libState, state));
      } else {
        const busyMsg = document.createElement('div');
        busyMsg.setAttribute('data-nav-skip', '');
        busyMsg.style.cssText = 'color: var(--text-muted); font-size: 0.85em; margin: 4px 0;';
        busyMsg.textContent = 'All scholars occupied \u2014 wait for one to finish';
        body.appendChild(busyMsg);
      }

      // Bookshelf — Unread and Mastered
      body.appendChild(this._renderUnreadShelf(scholars, libraryStates, state));
      body.appendChild(this._renderMasteredShelf(state));
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

  _renderLibraryActivity(scholar, activity, state) {
    const div = document.createElement('div');

    let statusText = '';
    let progressPct = 0;

    if (activity.type === 'browsing') {
      statusText = 'Browsing the library for a specific topic...';
      progressPct = activity.daysRemaining <= 0 ? 100 : 0;
    } else if (activity.type === 'scavenging') {
      statusText = 'Scavenging the library for anything useful...';
      progressPct = activity.daysRemaining <= 0 ? 100 : 0;
    } else if (activity.type === 'studying') {
      const total = activity.totalDays || 1;
      const done = total - activity.daysRemaining;
      progressPct = Math.round((done / total) * 100);
      statusText = `Studying "${activity.titleName}" (${activity.daysRemaining}d remaining)`;
    } else if (activity.type === 'learning_language') {
      const total = activity.totalDays || 1;
      const done = total - activity.daysRemaining;
      progressPct = Math.round((done / total) * 100);
      statusText = `Learning ${activity.languageName} (${activity.daysRemaining}d remaining)`;
    }

    div.innerHTML = `
      <div class="item-row" data-nav-skip>
        <span class="item-name">${scholar.name}</span>
        <span class="item-detail">${statusText}</span>
      </div>
      <div class="perimeter-bar-container" style="margin: 4px 0;">
        <div class="perimeter-bar" style="width: ${progressPct}%; background-color: var(--accent-gold);"></div>
      </div>
    `;

    // Cancel button
    const navGroup = document.createElement('div');
    navGroup.className = 'nav-group';
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'ring-btn';
    cancelBtn.textContent = 'Abandon';
    cancelBtn.style.cssText = 'font-size: 0.8em; padding: 2px 10px;';
    const sId = scholar.id;
    cancelBtn.addEventListener('click', () => {
      if (this.onLibraryCancel) this.onLibraryCancel(sId);
    });
    navGroup.appendChild(cancelBtn);
    div.appendChild(navGroup);

    return div;
  }

  _renderLibraryActions(scholar, libState, state) {
    const div = document.createElement('div');
    const sId = scholar.id;
    const hasCurrentBook = !!libState?.currentBook;

    // Directed browse — pick a domain to search
    const browseLabel = document.createElement('div');
    browseLabel.setAttribute('data-nav-skip', '');
    browseLabel.style.cssText = 'color: var(--text-muted); font-size: 0.8em; margin-bottom: 4px;';
    browseLabel.textContent = 'Directed search (1 book, pick domain):';
    div.appendChild(browseLabel);

    const browseGroup = document.createElement('div');
    browseGroup.className = 'nav-group';
    browseGroup.style.cssText = 'display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 6px;';

    const topics = [
      { id: 'soldier', label: 'Soldier', title: 'Browse soldier titles' },
      { id: 'priest', label: 'Priest', title: 'Browse priest titles' },
      { id: 'engineer', label: 'Engineer', title: 'Browse engineer titles' },
      { id: 'scholar', label: 'Scholar', title: 'Browse scholar titles' },
    ];

    for (const topic of topics) {
      const btn = document.createElement('button');
      btn.className = 'ring-btn';
      btn.textContent = topic.label;
      btn.title = hasCurrentBook ? 'Study or shelve current book first' : topic.title;
      btn.style.cssText = 'font-size: 0.8em; padding: 2px 8px;';

      if (hasCurrentBook) {
        btn.disabled = true;
        btn.style.opacity = '0.4';
      } else {
        const topicId = topic.id;
        btn.addEventListener('click', () => {
          if (this.onLibraryBrowse) this.onLibraryBrowse(sId, topicId);
        });
      }
      browseGroup.appendChild(btn);
    }
    div.appendChild(browseGroup);

    return div;
  }

  // ==========================================
  //  Unread Shelf — current find + unread + needs-language merged
  // ==========================================
  _renderUnreadShelf(scholars, libraryStates, state) {
    const div = document.createElement('div');
    div.style.cssText = 'margin-top: 8px; border-top: 1px solid var(--bg-tertiary, #333); padding-top: 8px;';

    // Gather all unread books from all scholars into one list
    const allBooks = [];

    // 1. Current finds (just discovered, not yet studied/shelved)
    for (const scholar of scholars) {
      const libState = libraryStates[scholar.id];
      if (!libState?.currentBook || libState?.currentActivity) continue;
      const title = findTitle(libState.currentBook);
      if (!title) continue;
      allBooks.push({
        title,
        scholarId: scholar.id,
        scholarBusy: false,
        isCurrent: true,   // fresh find — has Study + Set Aside
        language: null,
        languageKnown: true,
        addedDay: null,
        source: 'found',
      });
    }

    // 2. Regular unread books (shelved or scavenged)
    for (const scholar of scholars) {
      const libState = libraryStates[scholar.id];
      if (!libState?.unreadBooks?.length) continue;
      for (const entry of libState.unreadBooks) {
        // Handle old format (bare string) and new format (object)
        const titleId = typeof entry === 'string' ? entry : entry.titleId;
        const title = findTitle(titleId);
        if (!title) continue;
        allBooks.push({
          title,
          scholarId: scholar.id,
          scholarBusy: !!libState.currentActivity,
          isCurrent: false,
          language: null,
          languageKnown: true,
          addedDay: typeof entry === 'object' ? entry.addedDay : null,
          source: typeof entry === 'object' ? entry.source : null,
        });
      }
    }

    // 3. Needs-language books (blocked — shown with red badge)
    for (const scholar of scholars) {
      const libState = libraryStates[scholar.id];
      if (!libState?.needsLanguage?.length) continue;
      const knownLangs = libState.knownLanguages || ['common'];
      for (const entry of libState.needsLanguage) {
        const title = findTitle(entry.titleId);
        if (!title) continue;
        allBooks.push({
          title,
          scholarId: scholar.id,
          scholarBusy: !!libState.currentActivity,
          isCurrent: false,
          language: entry.language,
          languageKnown: knownLangs.includes(entry.language),
          addedDay: null,
          source: 'blocked',
        });
      }
    }

    if (allBooks.length === 0) return div;

    // Header with count + filter buttons
    const header = document.createElement('div');
    header.style.cssText = 'display: flex; align-items: center; gap: 8px; margin-bottom: 6px;';
    header.innerHTML = `<span class="item-name" style="font-size: 0.9em;">Unread (${allBooks.length})</span>`;

    const filterGroup = document.createElement('div');
    filterGroup.className = 'nav-group';
    filterGroup.style.cssText = 'margin-left: auto; display: inline-flex; gap: 3px;';

    let currentSort = 'date';
    const sortBooks = (mode) => {
      currentSort = mode;
      renderList();
      // Update active filter button styling
      filterGroup.querySelectorAll('button').forEach(b => {
        b.style.opacity = b.dataset.sort === mode ? '1' : '0.5';
      });
    };

    for (const filter of [
      { id: 'date', label: 'Recent' },
      { id: 'alpha', label: 'A-Z' },
      { id: 'source', label: 'Source' },
    ]) {
      const btn = document.createElement('button');
      btn.className = 'ring-btn';
      btn.dataset.sort = filter.id;
      btn.textContent = filter.label;
      btn.style.cssText = `font-size: 0.7em; padding: 1px 6px; opacity: ${filter.id === 'date' ? '1' : '0.5'};`;
      btn.addEventListener('click', () => sortBooks(filter.id));
      filterGroup.appendChild(btn);
    }
    header.appendChild(filterGroup);
    div.appendChild(header);

    const listContainer = document.createElement('div');
    div.appendChild(listContainer);

    const renderList = () => {
      listContainer.innerHTML = '';
      let sorted = [...allBooks];

      // Current finds always first
      const currentFinds = sorted.filter(b => b.isCurrent);
      const rest = sorted.filter(b => !b.isCurrent);

      if (currentSort === 'alpha') {
        rest.sort((a, b) => a.title.name.localeCompare(b.title.name));
      } else if (currentSort === 'source') {
        const sourceOrder = { found: 0, scavenged: 1, shelved: 2, blocked: 3 };
        rest.sort((a, b) => (sourceOrder[a.source] || 9) - (sourceOrder[b.source] || 9));
      }
      // 'date' = default order (most recent additions last in array, so reverse)
      if (currentSort === 'date') {
        rest.reverse();
      }

      sorted = [...currentFinds, ...rest];

      for (const book of sorted) {
        listContainer.appendChild(this._renderUnreadBookRow(book, state));
      }
    };

    renderList();
    return div;
  }

  _renderUnreadBookRow(book, state) {
    const { title, scholarId, scholarBusy, isCurrent, language, languageKnown, addedDay, source } = book;
    const row = document.createElement('div');
    row.style.cssText = 'padding: 4px 0; border-bottom: 1px solid var(--bg-tertiary, #222);';

    const titleRow = document.createElement('div');
    titleRow.className = 'item-row';
    titleRow.style.alignItems = 'center';

    const nameSpan = document.createElement('span');
    nameSpan.className = 'item-name';
    nameSpan.style.fontSize = '0.9em';
    nameSpan.textContent = title.name;
    titleRow.appendChild(nameSpan);

    // Language badge (red if unknown, only for language-blocked books)
    if (language) {
      const langTag = document.createElement('span');
      const langName = languageKnown ? this._langName(language, state) : (language === 'common' ? 'Unknown' : this._langName(language, state));
      langTag.style.cssText = `font-size: 0.7em; padding: 1px 5px; border-radius: 3px; margin-left: 6px; background: ${languageKnown ? 'var(--bg-tertiary, #333)' : 'var(--danger, #e55)'}; color: ${languageKnown ? 'var(--text-muted)' : '#fff'};`;
      langTag.textContent = langName;
      titleRow.appendChild(langTag);
    }

    // Action buttons
    const navGroup = document.createElement('div');
    navGroup.className = 'nav-group';
    navGroup.style.cssText = 'margin-left: auto; display: inline-flex; gap: 4px;';

    if (isCurrent) {
      // Fresh find — Decipher + Set Aside
      const studyBtn = document.createElement('button');
      studyBtn.className = 'ring-btn';
      studyBtn.style.cssText = 'font-size: 0.75em; padding: 2px 8px;';
      studyBtn.textContent = 'Decipher';
      const sId = scholarId;
      const tId = title.id;
      studyBtn.addEventListener('click', () => {
        if (this.onLibraryStudy) this.onLibraryStudy(sId, tId);
      });
      navGroup.appendChild(studyBtn);

      const shelveBtn = document.createElement('button');
      shelveBtn.className = 'ring-btn';
      shelveBtn.style.cssText = 'font-size: 0.75em; padding: 2px 8px;';
      shelveBtn.textContent = 'Set Aside';
      shelveBtn.addEventListener('click', () => {
        if (this.onLibraryShelve) this.onLibraryShelve(sId);
      });
      navGroup.appendChild(shelveBtn);
    } else {
      // Existing unread or language-blocked
      const studyBtn = document.createElement('button');
      studyBtn.className = 'ring-btn';
      studyBtn.style.cssText = 'font-size: 0.75em; padding: 2px 8px;';

      if (scholarBusy) {
        studyBtn.textContent = 'Study';
        studyBtn.disabled = true;
        studyBtn.style.opacity = '0.4';
      } else if (language && !languageKnown) {
        studyBtn.textContent = 'Study';
        studyBtn.disabled = true;
        studyBtn.style.opacity = '0.4';
        studyBtn.title = `Learn ${this._langName(language, state)} first`;
      } else {
        studyBtn.textContent = language ? 'Re-study' : 'Study';
        const sId = scholarId;
        const tId = title.id;
        studyBtn.addEventListener('click', () => {
          if (this.onLibraryStudy) this.onLibraryStudy(sId, tId);
        });
      }
      navGroup.appendChild(studyBtn);
    }
    titleRow.appendChild(navGroup);
    row.appendChild(titleRow);

    // Detail line: hint + metadata
    const detailDiv = document.createElement('div');
    detailDiv.setAttribute('data-nav-skip', '');
    detailDiv.style.cssText = 'color: var(--text-muted); font-size: 0.8em; font-style: italic; padding: 2px 0;';
    detailDiv.textContent = title.hint;
    row.appendChild(detailDiv);

    // Metadata line: day added + source
    const meta = [];
    if (addedDay) meta.push(`Day ${addedDay}`);
    if (source && source !== 'found' && source !== 'blocked') {
      meta.push(source === 'scavenged' ? 'Scavenged' : source === 'shelved' ? 'Set aside' : source);
    }
    if (isCurrent) meta.push('Just found');
    if (meta.length > 0) {
      const metaDiv = document.createElement('div');
      metaDiv.setAttribute('data-nav-skip', '');
      metaDiv.style.cssText = 'font-size: 0.7em; color: var(--text-muted); padding: 1px 0;';
      metaDiv.textContent = meta.join(' · ');
      row.appendChild(metaDiv);
    }

    return row;
  }

  // ==========================================
  //  Mastered Shelf — successfully studied books
  // ==========================================
  _renderMasteredShelf(state) {
    const abilities = state.library?.unlockedAbilities || [];
    const div = document.createElement('div');
    div.style.cssText = 'margin-top: 8px; border-top: 1px solid var(--bg-tertiary, #333); padding-top: 8px;';

    if (abilities.length === 0) return div;

    const label = document.createElement('div');
    label.className = 'item-row';
    label.setAttribute('data-nav-skip', '');
    label.innerHTML = `<span class="item-name" style="font-size: 0.9em;">Mastered (${abilities.length})</span>`;
    div.appendChild(label);

    const topics = ['priest', 'soldier', 'engineer', 'scholar', 'creatures', 'counter'];
    for (const topic of topics) {
      const topicAbilities = abilities.filter(a => a.topic === topic);
      if (topicAbilities.length === 0) continue;

      const topicLabel = document.createElement('div');
      topicLabel.setAttribute('data-nav-skip', '');
      topicLabel.style.cssText = 'color: var(--accent-gold); font-size: 0.8em; margin-top: 6px; text-transform: uppercase; letter-spacing: 1px;';
      topicLabel.textContent = this._topicLabel(topic);
      div.appendChild(topicLabel);

      for (const ability of topicAbilities) {
        const row = document.createElement('div');
        row.style.cssText = 'padding: 4px 0; border-bottom: 1px solid var(--bg-tertiary, #222);';

        const titleRow = document.createElement('div');
        titleRow.className = 'item-row';
        titleRow.innerHTML = `
          <span class="item-name">${ability.titleName}</span>
          <span class="item-detail">Day ${ability.unlockedDay}</span>
        `;
        row.appendChild(titleRow);

        // What it unlocked
        const benefitDiv = document.createElement('div');
        benefitDiv.setAttribute('data-nav-skip', '');
        benefitDiv.style.cssText = 'font-size: 0.85em; color: var(--accent-gold); padding: 2px 0;';
        benefitDiv.textContent = `Unlocked: ${ability.abilityName}`;
        row.appendChild(benefitDiv);

        // Description
        const descDiv = document.createElement('div');
        descDiv.setAttribute('data-nav-skip', '');
        descDiv.style.cssText = 'color: var(--text-muted); font-size: 0.8em; font-style: italic; padding: 1px 0;';
        descDiv.textContent = ability.abilityDescription;
        row.appendChild(descDiv);

        div.appendChild(row);
      }
    }

    return div;
  }

  _topicLabel(topic) {
    if (topic === 'filler') return 'miscellaneous';
    if (topic === 'counter') return 'creature lore';
    if (topic === 'priest' || topic === 'soldier' || topic === 'engineer' || topic === 'scholar') {
      return role(topic).toLowerCase();
    }
    return topic;
  }

  _langName(langId, state) {
    const languages = state.config?.library?.languages || [];
    const found = languages.find(l => l.id === langId);
    return found?.name || langId;
  }

  // ==========================================
  //  Study Queue — current research + what each scholar studies next
  // ==========================================
  _renderStudyQueue(state) {
    const { knowledge, population } = state;
    const scholars = population.characters.filter(c => c.role === 'scholar' && c.health === 'active');
    const libraryStates = state.library?.scholarStates || {};
    const activeResearch = knowledge.activeResearch || [];
    const currentTask = activeResearch.length > 0 ? activeResearch[0] : null;
    const clues = (knowledge.clues || []).filter(c => c.status === 'perceived');

    // Scholars actively doing clue research (not in library activity)
    const researchingScholars = scholars.filter(
      s => s.assignment === 'researching' && !libraryStates[s.id]?.currentActivity
    );

    const section = document.createElement('div');
    section.className = 'collapsible-section';

    const header = document.createElement('div');
    header.className = 'collapsible-header';
    header.innerHTML = `
      <span class="collapsible-caret">\u25BC</span>
      <span class="collapsible-title">Study Queue</span>
      ${currentTask ? `<span class="item-detail" style="margin-left: auto;">Researching</span>` : ''}
    `;

    const body = document.createElement('div');
    body.className = 'collapsible-body';

    if (scholars.length === 0) {
      body.innerHTML = '<div style="color: var(--text-muted);">No scholars available</div>';
    } else {
      // Show per-scholar: what they're currently working on + what's next
      for (const scholar of scholars) {
        const libState = libraryStates[scholar.id];
        const prefs = libState?.studyPreferences || {};
        const isResearching = scholar.assignment === 'researching' && !libState?.currentActivity;

        const row = document.createElement('div');
        row.style.cssText = 'padding: 4px 0; border-bottom: 1px solid var(--bg-tertiary, #222);';

        // Current work
        let currentText = '';
        let showProgress = false;
        let progressPct = 0;

        if (libState?.currentActivity) {
          const act = libState.currentActivity;
          if (act.type === 'studying') currentText = `Deciphering "${act.titleName}" (${act.daysRemaining}d)`;
          else if (act.type === 'browsing') currentText = `Browsing archives (${act.daysRemaining}d)`;
          else if (act.type === 'scavenging') currentText = `Scavenging (${act.daysRemaining}d)`;
          else if (act.type === 'learning_language') currentText = `Learning ${act.languageName} (${act.daysRemaining}d)`;
        } else if (isResearching && currentTask) {
          const duration = currentTask.duration || 1;
          const remaining = currentTask.daysRemaining || 0;
          progressPct = Math.round(((duration - remaining) / duration) * 100);
          const daysLeft = Math.ceil(remaining);
          currentText = `Decoding "${currentTask.name}" \u00B7 ${daysLeft}d \u00B7 ${progressPct}%`;
          showProgress = true;
        } else if (isResearching && clues.length > 0) {
          currentText = `Will begin "${clues[0].name}" tomorrow`;
        } else if (isResearching) {
          currentText = 'Idle \u2014 awaiting clues';
        } else {
          currentText = scholar.assignment || 'Unassigned';
        }

        const mainLine = document.createElement('div');
        mainLine.className = 'item-row';
        mainLine.innerHTML = `
          <span class="item-name">${scholar.name}</span>
          <span class="item-detail">${currentText}</span>
        `;
        row.appendChild(mainLine);

        // Progress bar for active clue research
        if (showProgress) {
          const barDiv = document.createElement('div');
          barDiv.className = 'perimeter-bar-container';
          barDiv.style.cssText = 'margin: 3px 0;';
          barDiv.innerHTML = `<div class="perimeter-bar" style="width: ${progressPct}%; background-color: var(--accent-gold);"></div>`;
          row.appendChild(barDiv);
        }

        // Next up: based on their preferences and the clue queue
        const nextItems = this._getNextForScholar(scholar, state);
        if (nextItems.length > 0) {
          const nextLine = document.createElement('div');
          nextLine.setAttribute('data-nav-skip', '');
          nextLine.style.cssText = 'font-size: 0.75em; color: var(--text-muted); padding: 1px 0;';
          const labels = nextItems.map(n => `"${n.name}" (${n.category})`);
          nextLine.textContent = `Next: ${labels.join(', ')}`;
          row.appendChild(nextLine);
        }

        body.appendChild(row);
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
   * Get next 1-2 clues a scholar will work on, based on their study preferences.
   * Looks at the clue queue order and filters by the scholar's allowed categories.
   */
  _getNextForScholar(scholar, state) {
    const { knowledge } = state;
    const libraryStates = state.library?.scholarStates || {};
    const libState = libraryStates[scholar.id];
    const prefs = libState?.studyPreferences || {};
    const clues = (knowledge.clues || []).filter(c => c.status === 'perceived');
    const results = [];

    for (const clue of clues) {
      // Map clue ID prefix to category
      let category = 'lore';
      const rid = clue.id || '';
      if (rid.startsWith('nature_') || rid.startsWith('creature_')) category = 'essences';
      else if (rid.startsWith('map_') || rid.startsWith('trail_')) category = 'maps';
      else if (rid.startsWith('herb_') || rid.startsWith('plant_')) category = 'herbs';
      else if (rid.startsWith('artifact_') || rid.startsWith('relic_')) category = 'artifacts';

      // Check if scholar's preferences allow this category
      if (prefs[category] !== false) {
        results.push({ name: clue.name || clue.id, category });
        if (results.length >= 2) break;
      }
    }
    return results;
  }

  // ==========================================
  //  Inventory by Category — collected materials
  // ==========================================
  _renderInventoryByCategory(state) {
    const libraryStates = state.library?.scholarStates || {};
    const topicToCategory = state.config?.scholar?.topicToCategory || {};
    const categories = state.config?.scholar?.categories || ['lore', 'maps', 'artifacts', 'herbs', 'essences'];

    // Build inventory from all scholars' studied + unread + dead-end books
    const inventory = {};
    for (const cat of categories) inventory[cat] = [];

    for (const [scholarId, libState] of Object.entries(libraryStates)) {
      const scholar = state.population.characters.find(c => c.id === scholarId);
      const scholarName = scholar?.name || 'Unknown';

      // Studied books (successfully unlocked)
      for (const titleId of (libState.studiedBooks || [])) {
        const title = findTitle(titleId);
        if (!title) continue;
        const cat = topicToCategory[title.topic] || 'lore';
        if (inventory[cat]) inventory[cat].push({ title, scholarName, status: 'mastered' });
      }

      // Unread books (waiting to be studied)
      for (const entry of (libState.unreadBooks || [])) {
        const titleId = typeof entry === 'string' ? entry : entry.titleId;
        const title = findTitle(titleId);
        if (!title) continue;
        const cat = topicToCategory[title.topic] || 'lore';
        if (inventory[cat]) inventory[cat].push({ title, scholarName, status: 'unread' });
      }

      // Dead ends (duds — still collected)
      for (const titleId of (libState.deadEnds || [])) {
        const title = findTitle(titleId);
        if (!title) continue;
        const cat = topicToCategory[title.topic] || 'lore';
        if (inventory[cat]) inventory[cat].push({ title, scholarName, status: 'dud' });
      }
    }

    const totalItems = Object.values(inventory).reduce((sum, arr) => sum + arr.length, 0);

    const section = document.createElement('div');
    section.className = 'collapsible-section';

    const header = document.createElement('div');
    header.className = 'collapsible-header collapsed';
    header.innerHTML = `
      <span class="collapsible-caret">\u25BC</span>
      <span class="collapsible-title">Inventory by Category</span>
      <span class="item-detail" style="margin-left: auto;">${totalItems} items</span>
    `;

    const body = document.createElement('div');
    body.className = 'collapsible-body hidden';

    for (const cat of categories) {
      const items = inventory[cat];
      const catHeader = document.createElement('div');
      catHeader.setAttribute('data-nav-skip', '');
      catHeader.style.cssText = 'color: var(--accent-gold); font-size: 0.85em; margin-top: 6px; text-transform: uppercase; letter-spacing: 0.5px;';
      catHeader.textContent = `${cat} (${items.length})`;
      body.appendChild(catHeader);

      if (items.length === 0) {
        const empty = document.createElement('div');
        empty.setAttribute('data-nav-skip', '');
        empty.style.cssText = 'color: var(--text-muted); font-size: 0.8em; font-style: italic; padding: 2px 0 4px 0;';
        empty.textContent = 'None collected';
        body.appendChild(empty);
      } else {
        for (const item of items) {
          const row = document.createElement('div');
          row.style.cssText = 'padding: 2px 0; font-size: 0.8em; border-bottom: 1px solid var(--bg-tertiary, #222);';
          const statusTag = item.status === 'mastered' ? 'mastered' : item.status === 'dud' ? 'dud' : 'unread';
          const statusColor = item.status === 'mastered' ? 'var(--accent-gold)' : 'var(--text-muted)';
          row.innerHTML = `
            <span class="item-name" style="font-size: 0.85em;">${item.title.name}</span>
            <span style="color: var(--text-muted); font-size: 0.75em; margin-left: 6px;">${item.scholarName}</span>
            <span style="color: ${statusColor}; font-size: 0.7em; margin-left: 6px;">${statusTag}</span>
          `;
          body.appendChild(row);
        }
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

  // ==========================================
  //  Active Clue Research (existing)
  // ==========================================
  _renderActiveResearch(state) {
    const { knowledge, population } = state;
    const libraryStates = state.library?.scholarStates || {};
    const busyScholars = population.characters.filter(
      c => c.role === 'scholar' && c.assignment === 'researching' && c.health === 'active'
        && !libraryStates[c.id]?.currentActivity
    );
    const activeResearch = knowledge.activeResearch || [];
    const currentTask = activeResearch.length > 0 ? activeResearch[0] : null;
    const pendingClues = (knowledge.clues || []).filter(c => c.status === 'perceived');
    const nextUp = pendingClues.length > 0 ? pendingClues[0] : null;
    const reorderCallback = this.onReorderQueue;

    const section = document.createElement('div');
    section.className = 'collapsible-section';

    const header = document.createElement('div');
    header.className = 'collapsible-header';
    header.innerHTML = `
      <span class="collapsible-caret">\u25BC</span>
      <span class="collapsible-title">Lore Research${currentTask ? '' : ' \u2014 None'}</span>
    `;

    const body = document.createElement('div');
    body.className = 'collapsible-body';

    if (currentTask) {
      const duration = currentTask.duration || 1;
      const remaining = currentTask.daysRemaining || 0;
      const pct = Math.round(((duration - remaining) / duration) * 100);
      const daysLeft = Math.ceil(remaining);
      const scholarNames = busyScholars.map(s => s.name).join(', ') || 'None assigned';

      const taskDiv = document.createElement('div');
      taskDiv.innerHTML = `
        <div class="item-row">
          <span class="item-name">${currentTask.name}</span>
          <span class="item-detail">${daysLeft}d remaining \u00B7 ${currentTask.source || ''}</span>
        </div>
        <div class="perimeter-bar-container" style="margin: 4px 0 4px 0;">
          <div class="perimeter-bar" style="width: ${pct}%; background-color: var(--accent-gold);"></div>
        </div>
        <div class="item-row" data-nav-skip style="margin-bottom: 8px;">
          <span class="item-detail" style="font-size: 0.8em;">Scholars: ${scholarNames}</span>
        </div>
      `;
      body.appendChild(taskDiv);

      if (nextUp) {
        const nextDiv = document.createElement('div');
        nextDiv.style.cssText = 'border-top: 1px solid var(--bg-tertiary, #333); padding-top: 6px; margin-top: 4px;';
        const nextRow = document.createElement('div');
        nextRow.className = 'item-row';
        nextRow.style.alignItems = 'center';

        const nlabel = document.createElement('span');
        nlabel.style.cssText = 'color: var(--text-muted); font-size: 0.8em; margin-right: 8px;';
        nlabel.textContent = 'Up next:';
        nextRow.appendChild(nlabel);

        const name = document.createElement('span');
        name.className = 'item-name';
        name.style.fontSize = '0.9em';
        name.textContent = nextUp.name;
        nextRow.appendChild(name);

        const detail = document.createElement('span');
        detail.className = 'item-detail';
        detail.textContent = nextUp.source || '';
        nextRow.appendChild(detail);

        const promoteBtn = document.createElement('button');
        promoteBtn.className = 'btn-secondary btn-small';
        promoteBtn.textContent = 'Prioritize';
        promoteBtn.title = 'Swap with active research';
        promoteBtn.style.cssText = 'margin-left: auto; font-size: 0.75em; padding: 2px 8px;';
        const nextId = nextUp.id;
        promoteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (reorderCallback) reorderCallback(nextId, 'up');
        });
        nextRow.appendChild(promoteBtn);
        nextDiv.appendChild(nextRow);
        body.appendChild(nextDiv);
      }
    } else {
      if (pendingClues.length > 0 && busyScholars.length > 0) {
        const upcoming = pendingClues[0];
        body.innerHTML = `
          <div class="item-row">
            <span class="item-name">${upcoming.name}</span>
            <span class="item-detail">Begins tomorrow \u00B7 ${upcoming.source || ''}</span>
          </div>
          <div class="perimeter-bar-container" style="margin: 4px 0;"><div class="perimeter-bar" style="width: 0%; background-color: var(--accent-gold);"></div></div>
          <div class="item-row" data-nav-skip><span class="item-detail" style="font-size: 0.8em;">Scholars: ${busyScholars.map(s => s.name).join(', ')}</span></div>
        `;
      } else if (pendingClues.length > 0) {
        body.innerHTML = '<div style="color: var(--text-muted);">Assign scholars to "researching" to begin decoding</div>';
      } else if (busyScholars.length > 0) {
        body.innerHTML = '<div style="color: var(--text-muted);">Awaiting clues \u2014 send the Mist Walker to explore</div>';
      } else {
        body.innerHTML = '<div style="color: var(--text-muted);">No scholars assigned to research</div>';
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

  // ==========================================
  //  Research Queue (existing)
  // ==========================================
  _renderResearchQueue(state) {
    const { knowledge, population } = state;
    const libraryStates = state.library?.scholarStates || {};
    const activeResearch = knowledge.activeResearch || [];
    const clues = (knowledge.clues || []).filter(c => c.status === 'perceived');
    const reorderCallback = this.onReorderQueue;

    // Build a map of scholar names for active research display
    const scholarMap = {};
    for (const c of population.characters) scholarMap[c.id] = c.name;

    const section = document.createElement('div');
    section.className = 'collapsible-section';

    const totalCount = activeResearch.length + clues.length;

    const header = document.createElement('div');
    header.className = 'collapsible-header';
    header.innerHTML = `
      <span class="collapsible-caret">\u25BC</span>
      <span class="collapsible-title">Lore Queue (${totalCount})</span>
    `;

    const body = document.createElement('div');
    body.className = 'collapsible-body';

    // Combined queue: active research items first (each assigned to one scholar), then pending clues
    const combinedQueue = [];
    for (const r of activeResearch) {
      combinedQueue.push({
        id: r.id, name: r.name, source: r.source || '',
        isActive: true, scholarName: scholarMap[r.assignedScholarId] || null,
      });
    }
    clues.forEach(c => {
      combinedQueue.push({ id: c.id, name: c.name || 'Unknown Clue', source: c.source || 'Unknown origin', isActive: false, scholarName: null });
    });

    if (combinedQueue.length > 0) {
      combinedQueue.forEach((c, i) => {
        const row = document.createElement('div');
        row.className = 'item-row';
        row.style.alignItems = 'center';

        const arrows = document.createElement('span');
        arrows.style.cssText = 'display: inline-flex; flex-direction: column; margin-right: 6px; line-height: 1; gap: 0;';

        if (c.isActive) {
          // Active items can't be reordered
          arrows.innerHTML = '<span style="font-size:10px;padding:0 2px;visibility:hidden;">\u25B2</span><span style="font-size:10px;padding:0 2px;visibility:hidden;">\u25BC</span>';
        } else {
          const activeCount = activeResearch.length;
          const queueIdx = i - activeCount;
          const totalPending = clues.length;

          if (queueIdx > 0 || (queueIdx === 0 && activeCount > 0)) {
            const up = document.createElement('button');
            up.className = 'btn-icon';
            up.innerHTML = '\u25B2';
            up.style.cssText = 'background:none;border:none;color:var(--accent-gold);cursor:pointer;font-size:10px;padding:0 2px;line-height:1;';
            const clueId = c.id;
            up.addEventListener('click', (e) => { e.stopPropagation(); if (reorderCallback) reorderCallback(clueId, 'up'); });
            arrows.appendChild(up);
          } else {
            arrows.innerHTML += '<span style="font-size:10px;padding:0 2px;visibility:hidden;">\u25B2</span>';
          }

          if (queueIdx < totalPending - 1) {
            const down = document.createElement('button');
            down.className = 'btn-icon';
            down.innerHTML = '\u25BC';
            down.style.cssText = 'background:none;border:none;color:var(--accent-gold);cursor:pointer;font-size:10px;padding:0 2px;line-height:1;';
            const clueId = c.id;
            down.addEventListener('click', (e) => { e.stopPropagation(); if (reorderCallback) reorderCallback(clueId, 'down'); });
            arrows.appendChild(down);
          } else {
            const spacer = document.createElement('span');
            spacer.style.cssText = 'font-size:10px;padding:0 2px;visibility:hidden;';
            spacer.textContent = '\u25BC';
            arrows.appendChild(spacer);
          }
        }
        row.appendChild(arrows);

        const pos = document.createElement('span');
        pos.style.cssText = 'color: var(--text-muted); font-size: 0.8em; margin-right: 6px; min-width: 16px;';
        pos.textContent = `${i + 1}.`;
        row.appendChild(pos);

        const name = document.createElement('span');
        name.className = 'item-name';
        name.textContent = c.name;
        row.appendChild(name);

        const detail = document.createElement('span');
        detail.className = 'item-detail';
        detail.textContent = c.scholarName ? `${c.scholarName} \u00B7 ${c.source}` : c.source;
        row.appendChild(detail);

        const status = document.createElement('span');
        if (c.isActive) { status.className = 'status-good'; status.textContent = 'working'; }
        else { status.className = 'status-warn'; status.textContent = 'queued'; }
        row.appendChild(status);

        body.appendChild(row);
      });
    } else {
      body.innerHTML = '<div style="color: var(--text-muted);">No clues awaiting research</div>';
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

  // ==========================================
  //  Unlocked Abilities
  // ==========================================
  _renderUnlockedAbilities(state) {
    const abilities = state.library?.unlockedAbilities || [];

    const section = document.createElement('div');
    section.className = 'collapsible-section';

    const header = document.createElement('div');
    header.className = 'collapsible-header';
    header.innerHTML = `
      <span class="collapsible-caret">\u25BC</span>
      <span class="collapsible-title">Learned Arts (${abilities.length})</span>
    `;

    const body = document.createElement('div');
    body.className = 'collapsible-body';

    if (abilities.length > 0) {
      const topics = ['priest', 'soldier', 'engineer', 'scholar', 'creatures', 'counter', 'filler'];
      for (const topic of topics) {
        const topicAbilities = abilities.filter(a => a.topic === topic);
        if (topicAbilities.length === 0) continue;

        const topicLabel = document.createElement('div');
        topicLabel.setAttribute('data-nav-skip', '');
        topicLabel.style.cssText = 'color: var(--accent-gold); font-size: 0.8em; margin-top: 6px; text-transform: uppercase; letter-spacing: 1px;';
        topicLabel.textContent = this._topicLabel(topic);
        body.appendChild(topicLabel);

        for (const ability of topicAbilities) {
          const row = document.createElement('div');
          row.style.cssText = 'padding: 3px 0;';
          row.innerHTML = `
            <div class="item-row">
              <span class="item-name">${ability.abilityName}</span>
              <span class="item-detail">Tier ${ability.tier}</span>
              <span class="status-good">Day ${ability.unlockedDay}</span>
            </div>
            <div style="color: var(--text-muted); font-size: 0.8em; font-style: italic;">${ability.abilityDescription}</div>
          `;
          body.appendChild(row);
        }
      }
    } else {
      body.innerHTML = '<div style="color: var(--text-muted);">No abilities unlocked yet \u2014 decipher books in the archives</div>';
    }

    // Start collapsed if empty
    if (abilities.length === 0) {
      header.classList.add('collapsed');
      body.classList.add('hidden');
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

  // ==========================================
  //  Decoded Knowledge (existing)
  // ==========================================
  _renderDecodedKnowledge(state) {
    const completed = state.knowledge.completed || [];

    const section = document.createElement('div');
    section.className = 'collapsible-section';

    const header = document.createElement('div');
    header.className = 'collapsible-header';
    header.innerHTML = `
      <span class="collapsible-caret">\u25BC</span>
      <span class="collapsible-title">Completed (${completed.length})</span>
    `;

    const body = document.createElement('div');
    body.className = 'collapsible-body';

    if (completed.length > 0) {
      // Sort toggle buttons
      const filterBar = document.createElement('div');
      filterBar.style.cssText = 'display: flex; align-items: center; gap: 4px; margin-bottom: 6px;';

      const filterGroup = document.createElement('div');
      filterGroup.className = 'nav-group';
      filterGroup.style.cssText = 'display: inline-flex; gap: 3px;';

      let currentSort = 'newest';
      const listContainer = document.createElement('div');

      const sortModes = [
        { id: 'newest', label: 'Newest' },
        { id: 'oldest', label: 'Oldest' },
        { id: 'category', label: 'Category' },
      ];

      const renderList = () => {
        listContainer.innerHTML = '';
        let sorted = [...completed];

        if (currentSort === 'newest') {
          sorted.sort((a, b) => (b.completedDay || 0) - (a.completedDay || 0));
          for (const k of sorted) {
            listContainer.appendChild(this._renderCompletedRow(k));
          }
        } else if (currentSort === 'oldest') {
          sorted.sort((a, b) => (a.completedDay || 0) - (b.completedDay || 0));
          for (const k of sorted) {
            listContainer.appendChild(this._renderCompletedRow(k));
          }
        } else {
          // Group by category
          const categories = { lore: [], maps: [], artifacts: [], herbs: [], essences: [] };
          for (const k of sorted) {
            const cat = this._researchCategory(k.id);
            if (!categories[cat]) categories[cat] = [];
            categories[cat].push(k);
          }
          for (const [cat, items] of Object.entries(categories)) {
            if (items.length === 0) continue;
            const catHeader = document.createElement('div');
            catHeader.setAttribute('data-nav-skip', '');
            catHeader.style.cssText = 'color: var(--accent-gold); font-size: 0.85em; margin-top: 6px; text-transform: uppercase; letter-spacing: 0.5px;';
            catHeader.textContent = `${cat} (${items.length})`;
            listContainer.appendChild(catHeader);
            // Sort within category by recency
            items.sort((a, b) => (b.completedDay || 0) - (a.completedDay || 0));
            for (const k of items) {
              listContainer.appendChild(this._renderCompletedRow(k));
            }
          }
        }

        // Update active button styling
        filterGroup.querySelectorAll('button').forEach(b => {
          b.style.opacity = b.dataset.sort === currentSort ? '1' : '0.5';
        });
      };

      for (const mode of sortModes) {
        const btn = document.createElement('button');
        btn.className = 'ring-btn';
        btn.dataset.sort = mode.id;
        btn.textContent = mode.label;
        btn.style.cssText = `font-size: 0.7em; padding: 1px 6px; opacity: ${mode.id === 'newest' ? '1' : '0.5'};`;
        const modeId = mode.id;
        btn.addEventListener('click', () => {
          currentSort = modeId;
          renderList();
        });
        filterGroup.appendChild(btn);
      }

      filterBar.appendChild(filterGroup);
      body.appendChild(filterBar);
      body.appendChild(listContainer);
      renderList();
    } else {
      body.innerHTML = '<div style="color: var(--text-muted);">No research completed</div>';
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

  _renderCompletedRow(k) {
    const row = document.createElement('div');
    row.style.cssText = 'padding: 2px 0; border-bottom: 1px solid var(--bg-tertiary, #222);';
    row.innerHTML = `
      <div class="item-row">
        <span class="item-name">${k.name || k}</span>
        <span class="item-detail">${k.source || ''}</span>
        <span class="status-good">Day ${k.completedDay || '?'}</span>
      </div>
      ${k.description ? `<div style="color: var(--text-muted); font-size: 0.85em; margin: 0 0 2px 0; font-style: italic;">${k.description}</div>` : ''}
    `;
    return row;
  }

  /**
   * Map a research ID to a category for grouping in the Completed section.
   */
  _researchCategory(id) {
    const rid = id || '';
    if (rid.startsWith('nature_') || rid.startsWith('creature_')) return 'essences';
    if (rid.startsWith('map_') || rid.startsWith('trail_') || rid.startsWith('clue_')) return 'maps';
    if (rid.startsWith('herb_') || rid.startsWith('plant_')) return 'herbs';
    if (rid.startsWith('artifact_') || rid.startsWith('relic_')) return 'artifacts';
    return 'lore';
  }
}

export default ResearchTab;
