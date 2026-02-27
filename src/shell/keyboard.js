/**
 * Keyboard Navigation System
 * Keyboard-first interface for game control
 *
 * Navigation model:
 *   Down/Up — move between headers, nav-group entry points, and rows
 *   Left/Right on header — toggle expand/collapse (either key toggles)
 *   Left/Right in nav-group — move between items horizontally
 *   Left/Right on character row — enter/exit action buttons
 *   Enter on button/select/checkbox — activate it
 *   Enter on character row — open character sheet
 *   Enter on header — NO-OP (only left/right toggles carets)
 *   Escape — close modal, or exit sub-tab mode, or clear focus
 *   Tab/Shift+Tab — cycle main tabs (or sub-tabs when in Scholar tab)
 */

export class KeyboardManager {
  constructor(renderer) {
    this.renderer = renderer;
    this.focusedTab = 0;
    this.inSubTabMode = false; // True when user has pressed Down into Scholar sub-tabs

    document.addEventListener('keydown', (e) => this.handleKeydown(e));
  }

  handleKeydown(e) {
    // Ignore if typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    // Select elements: allow Escape and Up/Down to leave back to nav mode
    if (e.target.tagName === 'SELECT') {
      if (e.key === 'Escape' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        e.target.blur();
        // Restore nav-focused on the select so keyboard nav continues from here
        document.querySelectorAll('.nav-focused').forEach(el => el.classList.remove('nav-focused'));
        e.target.classList.add('nav-focused');
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
          this.handleVerticalNav(e.key === 'ArrowDown');
        }
        return;
      }
      return; // Let browser handle other keys (Enter to open, etc.)
    }

    // Tab navigation (Tab / Shift+Tab / Home / Shift+Home)
    if (e.key === 'Tab' || e.key === 'Home') {
      e.preventDefault();
      this.clearNavFocus();

      // Modal open: cycle modal tabs (character sheet tabs)
      if (this.renderer.modal && this.renderer.modal.isOpen) {
        this.renderer.modal.cycleTab(e.shiftKey);
        return;
      }

      // Sub-tab mode: only cycle sub-tabs if user explicitly entered sub-tab mode (via Down arrow)
      if (this.inSubTabMode) {
        this.renderer.cycleSubTabs(e.shiftKey);
      } else {
        this.cycleTabs(e.shiftKey);
      }
      return;
    }

    // Direct tab access (1-7)
    if (e.key >= '1' && e.key <= '7') {
      const tabIndex = parseInt(e.key) - 1;
      const tabNames = ['dashboard', 'people', 'explore', 'research', 'build', 'items', 'compendium'];
      if (tabIndex < tabNames.length) {
        this.clearNavFocus();
        this.inSubTabMode = false;
        this.renderer.switchTab(tabNames[tabIndex]);
      }
      return;
    }

    // Advance day (Shift+Enter)
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      this.renderer.advanceDay();
      return;
    }

    // Enter on focused item
    if (e.key === 'Enter' && !e.shiftKey) {
      const focused = this.getFocusedItem();
      if (focused) {
        e.preventDefault();

        // Collapsible headers — Enter does NOTHING (only left/right toggles)
        if (focused.classList.contains('collapsible-header')) {
          return;
        }
        // Checkbox — toggle it
        if (focused.tagName === 'INPUT' && focused.type === 'checkbox') {
          focused.click();
        }
        // Select in nav-group — open the dropdown
        else if (focused.tagName === 'SELECT' && focused.closest('.nav-group')) {
          focused.focus();
          try { focused.showPicker(); } catch (_) {
            focused.size = focused.options.length;
            focused.addEventListener('change', () => { focused.size = 0; }, { once: true });
            focused.addEventListener('blur', () => { focused.size = 0; }, { once: true });
          }
        }
        // Click nav-group button on Enter
        else if (focused.closest('.nav-group')) {
          focused.click();
        }
        // Click action button or ring-btn on Enter (not selects)
        else if (focused.tagName !== 'SELECT' && (focused.classList.contains('action-btn') || focused.classList.contains('ring-btn'))) {
          focused.click();
        }
        // Focus select on Enter — open the dropdown
        else if (focused.tagName === 'SELECT') {
          focused.focus();
          try { focused.showPicker(); } catch (_) {
            focused.size = focused.options.length;
            focused.addEventListener('change', () => { focused.size = 0; }, { once: true });
            focused.addEventListener('blur', () => { focused.size = 0; }, { once: true });
          }
        }
        // Open character sheet on Enter (character-row, scholar-row, or item-row with char id)
        else if (focused.classList.contains('character-row') || focused.classList.contains('scholar-row') || focused.dataset.charId) {
          // Scholar rows: Enter opens character sheet (find the name and trigger modal)
          if (focused.classList.contains('scholar-row') && focused.dataset.scholarId) {
            const charId = focused.dataset.scholarId;
            if (this.renderer.openCharacterModal) {
              this.renderer.openCharacterModal(charId);
            }
          } else {
            focused.click();
          }
        }
        return;
      }
    }

    // Feed filter toggle (Q)
    if (e.key === 'q' || e.key === 'Q') {
      e.preventDefault();
      if (this.renderer.feed) {
        this.renderer.feed.toggleFilter();
      }
      return;
    }

    // Escape — close modal, exit sub-tab mode, or clear focus
    if (e.key === 'Escape') {
      const modal = document.getElementById('modal-overlay');
      if (modal && modal.classList.contains('active')) {
        modal.classList.remove('active');
        return;
      }
      // If in sub-tab mode, escape back to main tab cycling
      if (this.inSubTabMode) {
        this.inSubTabMode = false;
        this.clearNavFocus();
        return;
      }
      this.clearNavFocus();
      return;
    }

    // Left/Right arrows
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      const focused = this.getFocusedItem();
      if (!focused) return;

      // If focused inside a nav-group, move horizontally between siblings
      const navGroup = focused.closest('.nav-group');
      if (navGroup) {
        e.preventDefault();
        const buttons = Array.from(navGroup.querySelectorAll('button:not([disabled])'));
        const idx = buttons.indexOf(focused);
        if (idx < 0) return;

        let nextIdx;
        if (e.key === 'ArrowRight') {
          nextIdx = Math.min(idx + 1, buttons.length - 1);
        } else {
          nextIdx = Math.max(idx - 1, 0);
        }
        this.setNavFocus(buttons[nextIdx]);
        return;
      }

      // If focused on a collapsible header, toggle expand/collapse (either key)
      if (focused.classList.contains('collapsible-header')) {
        e.preventDefault();
        this.toggleSection(focused);
        return;
      }

      // If focused on a scholar row, Left/Right toggles the caret (expand/collapse)
      if (focused.classList.contains('scholar-row')) {
        e.preventDefault();
        focused.click(); // click toggles the detail panel
        return;
      }

      // If focused on a character row, Right enters the action buttons
      if (focused.classList.contains('character-row')) {
        e.preventDefault();
        if (e.key === 'ArrowRight') {
          const firstBtn = focused.querySelector('.action-btn');
          if (firstBtn) this.setNavFocus(firstBtn);
        }
        return;
      }

      // If focused on an action button, Left/Right moves between buttons or back to row
      if (focused.classList.contains('action-btn')) {
        e.preventDefault();
        const row = focused.closest('.character-row');
        const buttons = row ? Array.from(row.querySelectorAll('.action-btn')) : [];
        const idx = buttons.indexOf(focused);

        if (e.key === 'ArrowRight') {
          if (idx < buttons.length - 1) {
            this.setNavFocus(buttons[idx + 1]);
          }
        } else {
          if (idx > 0) {
            this.setNavFocus(buttons[idx - 1]);
          } else if (row) {
            // Left from first button → back to the row
            this.setNavFocus(row);
          }
        }
        return;
      }

      // If focused on a ring-btn, Left/Right moves between sibling ring-btns
      if (focused.classList.contains('ring-btn')) {
        e.preventDefault();
        const parent = focused.parentElement;
        const buttons = parent ? Array.from(parent.querySelectorAll('.ring-btn:not([disabled])')) : [];
        const idx = buttons.indexOf(focused);
        if (idx < 0) return;

        if (e.key === 'ArrowRight' && idx < buttons.length - 1) {
          this.setNavFocus(buttons[idx + 1]);
        } else if (e.key === 'ArrowLeft' && idx > 0) {
          this.setNavFocus(buttons[idx - 1]);
        }
        return;
      }

      return;
    }

    // Shift+Up/Down — reorder research queue item
    if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && e.shiftKey) {
      const focused = this.getFocusedItem();
      if (focused && focused.hasAttribute('data-queue-item')) {
        e.preventDefault();
        const clueId = focused.getAttribute('data-clue-id');
        const direction = e.key === 'ArrowUp' ? 'up' : 'down';
        this.renderer.reorderResearch(clueId, direction);
        // Re-focus the moved item after re-render
        requestAnimationFrame(() => {
          const movedRow = document.querySelector(`[data-clue-id="${clueId}"]`);
          if (movedRow) this.setNavFocus(movedRow);
        });
        return;
      }
    }

    // Up/Down arrows navigate within current tab content
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();

      // On Scholar tab, pressing Down with no focus enters sub-tab mode
      if (e.key === 'ArrowDown' && !this.inSubTabMode
          && this.renderer.activeTab === 'research' && !this.getFocusedItem()) {
        this.inSubTabMode = true;
        // Focus the active sub-tab button to show we're in sub-tab mode
        const activeSubBtn = document.querySelector('.tab-content.active .nav-group .ring-btn[style*="background: var(--accent-gold)"]');
        if (activeSubBtn) {
          this.setNavFocus(activeSubBtn);
          return;
        }
      }

      this.handleVerticalNav(e.key === 'ArrowDown');
    }
  }

  cycleTabs(reverse = false) {
    const tabNames = ['dashboard', 'people', 'explore', 'research', 'build', 'items', 'compendium'];
    const currentIndex = tabNames.indexOf(this.renderer.activeTab);
    const nextIndex = reverse
      ? (currentIndex - 1 + tabNames.length) % tabNames.length
      : (currentIndex + 1) % tabNames.length;

    this.inSubTabMode = false; // Reset when switching main tabs
    this.renderer.switchTab(tabNames[nextIndex]);
  }

  /**
   * Get all navigable items for vertical (Down/Up) navigation.
   *
   * - Collapsible headers
   * - Character rows and item-rows (unless data-nav-skip)
   * - First enabled button in each .nav-group (entry point)
   * - Skips rows inside collapsed sections
   */
  getNavigableItems() {
    const activePane = document.querySelector('.tab-content.active');
    if (!activePane) return [];

    const items = [];
    const sections = activePane.querySelectorAll('.collapsible-section');

    sections.forEach(section => {
      const header = section.querySelector('.collapsible-header');
      if (header) items.push(header);

      // Only include body items if section is expanded
      if (header && !header.classList.contains('collapsed')) {
        const body = section.querySelector('.collapsible-body');
        if (body) {
          // Walk through direct children in order
          for (const child of body.children) {
            // Skip elements marked with data-nav-skip
            if (child.hasAttribute('data-nav-skip')) continue;

            // Nav-groups: include first interactive element of each row
            if (child.classList.contains('nav-group')) {
              for (const row of child.children) {
                // Find first button or select in this row
                const firstInteractive = row.querySelector('button.ring-btn:not([disabled]), select');
                if (firstInteractive) items.push(firstInteractive);
              }
              continue;
            }

            // Character rows, item-rows, and scholar-rows
            if (child.classList.contains('character-row') || child.classList.contains('item-row') || child.classList.contains('scholar-row')) {
              items.push(child);
              continue;
            }

            // Scholar rows nested inside wrapper divs (e.g. Scriptorium scholar entries)
            const nestedScholarRows = child.querySelectorAll('.scholar-row');
            if (nestedScholarRows.length > 0) {
              nestedScholarRows.forEach(row => {
                items.push(row);
                // If scholar detail panel is expanded, include its checkboxes
                const detailPanel = row.nextElementSibling;
                if (detailPanel && detailPanel.style.display !== 'none') {
                  const checkboxes = detailPanel.querySelectorAll('.scholar-checkbox');
                  checkboxes.forEach(cb => items.push(cb));
                }
              });
              continue;
            }

            // Check nested nav-groups (e.g. inside a wrapper div)
            const nestedGroup = child.querySelector('.nav-group');
            if (nestedGroup) {
              const firstBtn = nestedGroup.querySelector('button:not([disabled])');
              if (firstBtn) items.push(firstBtn);
              continue;
            }

            // Dig-crew rows with remove buttons — navigate the row
            if (child.querySelector('.ring-btn') || child.querySelector('select')) {
              // If this is a row-like div with interactive elements, add them
              if (!child.classList.contains('item-row') && !child.classList.contains('nav-group')) {
                // Look for buttons and selects inside (avoid double-adding selects with ring-btn class)
                const btns = child.querySelectorAll('button.ring-btn:not([disabled])');
                const selects = child.querySelectorAll('select');
                btns.forEach(b => items.push(b));
                selects.forEach(s => items.push(s));
                continue;
              }
            }

            // Standalone selects
            if (child.tagName === 'SELECT') {
              items.push(child);
              continue;
            }

            // Divs containing selects or buttons (e.g. tome action rows)
            const childSelects = child.querySelectorAll('select');
            const childBtns = child.querySelectorAll('button.ring-btn:not([disabled])');
            if (childSelects.length > 0 || childBtns.length > 0) {
              childSelects.forEach(s => items.push(s));
              childBtns.forEach(b => items.push(b));
              continue;
            }
          }
        }
      }
    });

    return items;
  }

  handleVerticalNav(down) {
    const items = this.getNavigableItems();
    if (items.length === 0) return;

    const focused = this.getFocusedItem();

    // If currently focused inside a nav-group, find the group's entry in the items list
    let currentIdx = -1;
    if (focused) {
      currentIdx = items.indexOf(focused);

      // If not found directly (e.g. focused on Ring 2 but entry point is Ring 1),
      // find the entry point for this nav-group
      if (currentIdx < 0) {
        const navGroup = focused.closest('.nav-group');
        if (navGroup) {
          const firstBtn = navGroup.querySelector('button:not([disabled])');
          currentIdx = items.indexOf(firstBtn);
        }
      }
    }

    let nextIdx;
    if (down) {
      nextIdx = currentIdx < 0 ? 0 : Math.min(currentIdx + 1, items.length - 1);
    } else {
      nextIdx = currentIdx < 0 ? items.length - 1 : Math.max(currentIdx - 1, 0);
    }

    this.setNavFocus(items[nextIdx]);
  }

  toggleSection(header) {
    const isCollapsed = header.classList.toggle('collapsed');
    const body = header.nextElementSibling;
    if (body) {
      if (isCollapsed) body.classList.add('hidden');
      else body.classList.remove('hidden');
    }
  }

  getFocusedItem() {
    return document.querySelector('.nav-focused');
  }

  setNavFocus(element) {
    this.clearNavFocus();
    if (element) {
      element.classList.add('nav-focused');
      element.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  /**
   * Check if element or its ancestor has nav-focused
   */
  isInNavFocus(element) {
    return element && (element.classList.contains('nav-focused') || element.closest('.nav-focused'));
  }

  clearNavFocus() {
    document.querySelectorAll('.nav-focused').forEach(el => el.classList.remove('nav-focused'));
  }
}

export default KeyboardManager;
