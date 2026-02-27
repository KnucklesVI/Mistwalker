import MistwalkEngine from './src/core/engine.js';

const engine = new MistwalkEngine();
const state = engine.getState();

console.log('Testing JSON serialization...');
try {
  const json = JSON.stringify(state);
  console.log('✓ State serializable to JSON');
  console.log(`  JSON size: ${json.length} bytes`);
  
  const restored = JSON.parse(json);
  console.log('✓ State deserializable from JSON');
  console.log('State top-level keys:', Object.keys(restored).sort().join(', '));
} catch (err) {
  console.error('✗ Serialization failed:', err.message);
  console.error(err.stack);
}
