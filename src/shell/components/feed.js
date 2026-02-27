/**
 * Feed Sidebar Component
 * Displays game events in a filtered, scrollable list
 */

export class Feed {
  constructor() {
    this.entries = [];
    this.filter = 'all'; // 'all', 'routine', 'notable', 'mythic'
    this.element = null;
    this.entriesContainer = null;
  }

  render() {
    const container = document.createElement('div');
    container.className = 'feed-sidebar';

    // Header with filter
    const header = document.createElement('div');
    header.className = 'feed-header';
    header.innerHTML = `
      <div class="feed-title">Chronicle</div>
      <button class="feed-filter-btn" data-filter="all">All</button>
    `;

    const filterBtn = header.querySelector('.feed-filter-btn');
    filterBtn.addEventListener('click', () => this.toggleFilter());

    // Entries container
    const entries = document.createElement('div');
    entries.className = 'feed-entries';
    entries.id = 'feed-entries';

    container.appendChild(header);
    container.appendChild(entries);

    this.element = container;
    this.entriesContainer = entries;
    this.filterButton = filterBtn;

    return container;
  }

  addEntry(day, text, level = 'routine', category = 'general') {
    const entry = {
      day,
      text,
      level,
      category,
      timestamp: Date.now(),
    };

    this.entries.push(entry);
    this.renderEntry(entry);
    // Keep newest entries visible at top
    this.entriesContainer.scrollTop = 0;
  }

  renderEntry(entry) {
    if (this.filter !== 'all' && this.filter !== entry.level) {
      return;
    }

    const entryEl = document.createElement('div');
    entryEl.className = `feed-entry ${entry.level} cat-${entry.category || 'general'}`;
    entryEl.innerHTML = `
      <span class="feed-day-prefix">Day ${entry.day}:</span> ${entry.text}
    `;

    this.entriesContainer.prepend(entryEl);
  }

  toggleFilter() {
    const filters = ['all', 'routine', 'notable', 'mythic'];
    const currentIndex = filters.indexOf(this.filter);
    this.filter = filters[(currentIndex + 1) % filters.length];
    this.refreshDisplay();
  }

  refreshDisplay() {
    this.entriesContainer.innerHTML = '';
    this.entries.forEach(entry => this.renderEntry(entry));
    this.filterButton.textContent = this.filter === 'all' ? 'All' : this.filter.charAt(0).toUpperCase() + this.filter.slice(1);
  }

  clear() {
    this.entries = [];
    this.entriesContainer.innerHTML = '';
  }
}

export default Feed;
