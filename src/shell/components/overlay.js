/**
 * Event Overlay Component
 * Shows dramatic Tier 2+ events with sequential text animation
 */

export class Overlay {
  constructor() {
    this.element = null;
    this.isOpen = false;
    this.currentLineIndex = 0;
    this.lines = [];
    this.animationTimer = null;
  }

  render() {
    const container = document.createElement('div');
    container.className = 'event-overlay';
    container.id = 'event-overlay';

    const content = document.createElement('div');
    content.className = 'event-content';
    content.id = 'event-content';

    container.appendChild(content);
    container.addEventListener('click', () => this.dismiss());
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.skipToEnd();
    });

    this.element = container;
    return container;
  }

  showEvent(lines) {
    this.lines = lines;
    this.currentLineIndex = 0;
    this.isOpen = true;

    if (this.element) {
      this.element.classList.add('active');
      this.animateLines();
    }
  }

  animateLines() {
    const content = document.getElementById('event-content');
    if (!content) return;

    content.innerHTML = '';

    const showLine = (index) => {
      if (index >= this.lines.length) {
        setTimeout(() => this.dismiss(), 2000);
        return;
      }

      const line = this.lines[index];
      const lineEl = document.createElement('div');

      if (typeof line === 'string') {
        lineEl.className = 'event-line';
        lineEl.textContent = line;
      } else {
        lineEl.className = `event-line ${line.class || ''}`;
        lineEl.textContent = line.text;
      }

      content.appendChild(lineEl);
      this.currentLineIndex = index + 1;

      if (index < this.lines.length - 1) {
        this.animationTimer = setTimeout(() => showLine(index + 1), 1500);
      } else {
        setTimeout(() => this.dismiss(), 2000);
      }
    };

    showLine(0);
  }

  skipToEnd() {
    if (this.animationTimer) clearTimeout(this.animationTimer);
    const content = document.getElementById('event-content');
    if (content) {
      content.innerHTML = '';
      this.lines.forEach((line, index) => {
        const lineEl = document.createElement('div');
        if (typeof line === 'string') {
          lineEl.className = 'event-line';
          lineEl.textContent = line;
        } else {
          lineEl.className = `event-line ${line.class || ''}`;
          lineEl.textContent = line.text;
        }
        content.appendChild(lineEl);
      });
    }
    setTimeout(() => this.dismiss(), 1000);
  }

  dismiss() {
    if (this.animationTimer) clearTimeout(this.animationTimer);
    this.isOpen = false;
    if (this.element) {
      this.element.classList.remove('active');
    }
  }
}

export default Overlay;
