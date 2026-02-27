/**
 * Main Application Entry Point
 * Wires engine, renderer, and keyboard together
 */

import MistwalkEngine from '../core/engine.js?v=5z';
import defaultConfig from '../core/config.js?v=5z';
import { Renderer } from './renderer.js?v=5z';
import { KeyboardManager } from './keyboard.js?v=5z';
import { playClick } from './audio.js?v=5z';

class App {
  constructor() {
    this.engine = new MistwalkEngine(defaultConfig, 12345);
    this.renderer = null;
    this.keyboard = null;
  }

  start() {
    // Initialize engine
    const initialState = this.engine.initialize();

    // Get container
    const container = document.getElementById('game-container');
    if (!container) {
      console.error('No #game-container element found');
      return;
    }

    // Create renderer
    this.renderer = new Renderer(this.engine, container);
    this.renderer.initialize();

    // Initial render
    this.renderer.render(initialState, []);

    // Set up keyboard manager
    this.keyboard = new KeyboardManager(this.renderer);

    // Add global advance day handler
    window.advanceDayShortcut = () => this.advanceDay();

    console.log('Game initialized. Commands:');
    console.log('- Shift+Enter to advance day');
    console.log('- Tab/Shift+Tab to cycle tabs');
    console.log('- 1-6 for direct tab access');
    console.log('- Q to toggle feed filter');

    // Global click sound — plays on any button, .ring-btn, .tab-button, or .dropdown-option click
    document.addEventListener('click', (e) => {
      const el = e.target.closest('button, .ring-btn, .tab-button, .dropdown-option, .btn-primary, .btn-secondary');
      if (el) playClick();
    });
  }

  advanceDay() {
    if (this.engine.state.time.phase === 'WAITING_FOR_INPUT') {
      const cmd = {
        type: 'ADVANCE_DAY',
      };
      this.engine.queueCommand(cmd);
      const result = this.engine.advanceDay();
      this.renderer.render(result.newState, result.notifications);
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.start();
  window.app = app; // For debugging

  // ── Deterministic replay test (debug tool) ──
  window.runDeterministicTest = function(days = 100) {
    const seed = 12345;
    const engine1 = new MistwalkEngine(defaultConfig, seed);
    const engine2 = new MistwalkEngine(defaultConfig, seed);
    for (let i = 0; i < days; i++) {
      engine1.advanceDay();
      engine2.advanceDay();
    }
    return JSON.stringify(engine1.getState()) === JSON.stringify(engine2.getState());
  };
});

export default App;
