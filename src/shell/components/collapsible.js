/**
 * Collapsible Section - Reusable component
 */

export class Collapsible {
  constructor(title, initiallyOpen = true) {
    this.title = title;
    this.isOpen = initiallyOpen;
    this.element = null;
    this.contentElement = null;
  }

  render(content) {
    const section = document.createElement('div');
    section.className = 'collapsible-section';

    const header = document.createElement('div');
    header.className = `collapsible-header ${!this.isOpen ? 'collapsed' : ''}`;
    header.innerHTML = `
      <span class="collapsible-caret">▼</span>
      <span class="collapsible-title">${this.title}</span>
    `;

    const body = document.createElement('div');
    body.className = `collapsible-body ${!this.isOpen ? 'hidden' : ''}`;
    body.innerHTML = content;

    header.addEventListener('click', () => this.toggle(body, header));

    section.appendChild(header);
    section.appendChild(body);

    this.element = section;
    this.contentElement = body;
    this.headerElement = header;

    return section;
  }

  toggle(body, header) {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      header.classList.remove('collapsed');
      body.classList.remove('hidden');
    } else {
      header.classList.add('collapsed');
      body.classList.add('hidden');
    }
  }

  updateContent(content) {
    if (this.contentElement) {
      this.contentElement.innerHTML = content;
    }
  }
}

export default Collapsible;
