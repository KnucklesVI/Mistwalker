/**
 * Engine test and demo
 */

import MistwalkEngine from './engine.js';
import { COMMAND_TYPES } from './commands.js';

// Create engine
const engine = new MistwalkEngine();
console.log('Engine initialized');

// Get initial summary
console.log('\n=== DAY 1 SUMMARY ===');
console.log(engine.getSummary());

// Queue some commands
console.log('\n=== QUEUEING COMMANDS ===');
const priestChar = engine.state.population.characters.find(c => c.role === 'priest');
const workerChar = engine.state.population.characters.find(c => c.role === 'worker');

console.log(`Assigning ${priestChar.name} to perimeter guard`);
engine.queueCommand({
  type: COMMAND_TYPES.ASSIGN,
  characterId: priestChar.id,
  assignment: 'perimeter',
});

console.log(`Starting training for ${workerChar.name} to become soldier`);
engine.queueCommand({
  type: COMMAND_TYPES.TRAIN,
  characterId: workerChar.id,
  targetRole: 'soldier',
});

// Advance day
console.log('\n=== ADVANCING DAY ===');
const result = engine.advanceDay();

console.log(`\nDay advanced. Current day: ${engine.state.time.day}, Phase: ${engine.state.time.phase}`);

// Show notifications
console.log('\n=== NOTIFICATIONS ===');
for (const notif of result.notifications) {
  if (notif.type !== 'RESOURCES_UPDATE') {
    console.log(`[${notif.type}] ${notif.message || notif.text || JSON.stringify(notif)}`);
  }
}

// Get new summary
console.log('\n=== DAY 2 SUMMARY ===');
console.log(engine.getSummary());

// Try to send MW
console.log('\n=== SENDING MISTWALKER ===');
const mwChar = engine.state.population.characters.find(c => c.role === 'mistwalker');
const sendResult = engine.executeCommand(engine.state, {
  type: COMMAND_TYPES.SEND_MW,
  ring: 1,
});

if (sendResult.success) {
  console.log(`${mwChar.name} was sent to explore Ring 1`);
  for (const notif of sendResult.notifications) {
    console.log(`  [${notif.type}] ${notif.message}`);
  }
}

// Advance multiple days to test MW exploration
console.log('\n=== ADVANCING 7 DAYS (MW EXPLORATION) ===');
for (let i = 0; i < 7; i++) {
  const dayResult = engine.advanceDay();
  const explorationNotifs = dayResult.notifications.filter(n => n.type.includes('MW_') || n.type.includes('EXPLORATION'));
  
  if (explorationNotifs.length > 0) {
    console.log(`Day ${engine.state.time.day}:`);
    for (const notif of explorationNotifs) {
      console.log(`  [${notif.type}] ${notif.message || notif.text}`);
    }
  }
}

console.log('\n=== FINAL SUMMARY ===');
console.log(engine.getSummary());

console.log('\n=== EVENT FEED (Last 10) ===');
const feed = engine.state.events.feed.slice(-10);
for (const entry of feed) {
  console.log(`Day ${entry.day} [${entry.classification}]: ${entry.text}`);
}

console.log('\n✓ Engine test completed successfully');
