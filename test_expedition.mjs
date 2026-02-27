/**
 * Comprehensive Troop Expedition System Test
 * Tests all phases of the expedition lifecycle and validation
 */

import MistwalkEngine from './src/core/engine.js';

const COLORS = {
  PASS: '\x1b[32m',  // Green
  FAIL: '\x1b[31m',  // Red
  INFO: '\x1b[36m',  // Cyan
  RESET: '\x1b[0m',
};

function logTest(name, passed, details = '') {
  const status = passed ? `${COLORS.PASS}PASS${COLORS.RESET}` : `${COLORS.FAIL}FAIL${COLORS.RESET}`;
  console.log(`[${status}] ${name}`);
  if (details) console.log(`      ${details}`);
}

function logSection(title) {
  console.log(`\n${COLORS.INFO}=== ${title} ===${COLORS.RESET}`);
}

// ========== TEST 1: Basic Engine Test ==========
logSection('TEST 1: Basic Engine Test');

let testsPassed = 0;
let testsFailed = 0;

const engine = new MistwalkEngine();
engine.initialize();

logTest('Engine initialized', engine.state !== null);
if (engine.state) testsPassed++; else testsFailed++;

logTest('State has exploration config', engine.state.exploration !== null);
if (engine.state.exploration) testsPassed++; else testsFailed++;

// Advance 100 days with MW exploration to discover locations (higher chance of finding one)
let mwSendSuccess = false;
let mwExplorationsCount = 0;
for (let i = 0; i < 100; i++) {
  // Try to send MW on specific days for exploration
  if ((i === 4 || i === 25 || i === 50 || i === 75) && engine.state.exploration.mwState.status === 'home') {
    const result = engine.executeCommand(engine.state, {
      type: 'SEND_MW',
      ring: 1,
      totalDays: 15,
    });
    if (result.success) {
      engine.state = result.newState;
      mwSendSuccess = true;
      mwExplorationsCount++;
    }
  }

  // Advance day through the normal advanceDay
  engine.advanceDay();
}

logTest('MW sent for exploration', mwSendSuccess, `${mwExplorationsCount} expeditions sent`);
if (mwSendSuccess) testsPassed++; else testsFailed++;

const minorLocations = engine.state.exploration.locations.minor || [];
const locationDiscovered = minorLocations.length > 0;
logTest('Minor locations discovered naturally', locationDiscovered, `Found ${minorLocations.length} locations after ${mwExplorationsCount} MW explorations`);
if (locationDiscovered) testsPassed++; else testsFailed++;

if (minorLocations.length > 0) {
  console.log(`      Sample location: "${minorLocations[0].name}" (Ring ${minorLocations[0].ring})`);
}

// ========== TEST 2: Expedition Validation ==========
logSection('TEST 2: Expedition Validation');

// Reset to fresh state for cleaner tests
const engine2 = new MistwalkEngine();
engine2.initialize();

// Find key characters
const mw = engine2.state.population.characters.find(c => c.role === 'mistwalker');
const priest = engine2.state.population.characters.find(c => c.role === 'priest');
const worker = engine2.state.population.characters.find(c => c.role === 'worker');
const soldier = engine2.state.population.characters.find(c => c.role === 'soldier');

logTest('Found mistwalker', mw !== undefined);
if (mw) testsPassed++; else testsFailed++;

logTest('Found priest', priest !== undefined);
if (priest) testsPassed++; else testsFailed++;

// Manually inject a test location to avoid RNG dependency
const testLocation = {
  id: 'test_loc_1',
  name: 'Test Ruins',
  ring: 1,
  discoveredDay: 1,
  type: 'metal_deposit',
  description: 'Test location',
  challenges: [
    { id: 'access', type: 'engineering', name: 'Sealed Passage', difficulty: 2, required: true },
  ],
  rewards: { metal: { min: 4, max: 12 } },
  dangerLevel: 1,
  haulingRequired: true,
  visited: false,
};
engine2.state.exploration.locations.minor.push(testLocation);

logTest('Test location injected', engine2.state.exploration.locations.minor.length > 0);
if (engine2.state.exploration.locations.minor.length > 0) testsPassed++; else testsFailed++;

// Test 1: No priest in members
const noPriestResult = engine2.executeCommand(engine2.state, {
  type: 'SEND_EXPEDITION',
  locationId: testLocation.id,
  members: [mw.id, worker.id],
  daysAtSite: 1,
});
logTest('Validation: No priest fails', !noPriestResult.success, noPriestResult.reason);
if (!noPriestResult.success) testsPassed++; else testsFailed++;

// Test 2: Invalid location
const badLocationResult = engine2.executeCommand(engine2.state, {
  type: 'SEND_EXPEDITION',
  locationId: 'invalid_location_999',
  members: [mw.id, priest.id, worker.id],
  daysAtSite: 1,
});
logTest('Validation: Invalid location fails', !badLocationResult.success, badLocationResult.reason);
if (!badLocationResult.success) testsPassed++; else testsFailed++;

// Test 3: Too many members (priest.spirit determines capacity)
const priestCapacity = priest.spirit + (priest.modifiers || []).reduce((sum, m) => sum + (m.statBonuses?.spirit || 0), 0);
const tooManyMembers = [mw.id, priest.id];
for (let i = 0; i < priestCapacity + 2; i++) {
  const char = engine2.state.population.characters[i];
  if (char && char.id !== mw.id && char.id !== priest.id && tooManyMembers.length <= priestCapacity + 2) {
    tooManyMembers.push(char.id);
  }
}

if (tooManyMembers.length > priestCapacity + 1) {
  const tooManyResult = engine2.executeCommand(engine2.state, {
    type: 'SEND_EXPEDITION',
    locationId: testLocation.id,
    members: tooManyMembers,
    daysAtSite: 1,
  });
  logTest('Validation: Too many members fails', !tooManyResult.success, tooManyResult.reason);
  if (!tooManyResult.success) testsPassed++; else testsFailed++;
}

// Test 4: Valid expedition
const validExpeditionResult = engine2.executeCommand(engine2.state, {
  type: 'SEND_EXPEDITION',
  locationId: testLocation.id,
  members: [mw.id, priest.id, worker.id],
  daysAtSite: 1,
});
logTest('Validation: Valid expedition succeeds', validExpeditionResult.success);
if (validExpeditionResult.success) {
  testsPassed++;
  engine2.state = validExpeditionResult.newState;
} else {
  testsFailed++;
  console.log(`      Error: ${validExpeditionResult.reason}`);
}

// ========== TEST 3: Expedition Lifecycle ==========
logSection('TEST 3: Expedition Lifecycle');

// We'll continue from the previous state where we just sent a valid expedition
const locationName = testLocation.name;

logTest('Expedition active after send', engine2.state.exploration.activeExpedition !== undefined);
if (engine2.state.exploration.activeExpedition) {
  testsPassed++;
  const exp = engine2.state.exploration.activeExpedition;
  console.log(`      Status: ${exp.status}, Location: ${exp.locationName}`);
} else {
  testsFailed++;
}

// Verify members are marked as on expedition
const memberOnExpedition = engine2.state.population.characters.find(
  c => c.id === worker.id && c.assignment === 'expedition'
);
logTest('Member marked as on expedition', memberOnExpedition !== undefined);
if (memberOnExpedition) testsPassed++; else testsFailed++;

// Verify MW is marked as on expedition
logTest('MW marked as on expedition', engine2.state.exploration.mwState.status === 'expedition');
if (engine2.state.exploration.mwState.status === 'expedition') testsPassed++; else testsFailed++;

// Advance days and track phase transitions
let sawTravelingPhase = false;
let sawWorkingPhase = false;
let sawReturningPhase = false;
let memberFreed = false;
let mwReturned = false;
let expeditionRecorded = false;

const initialResources = JSON.parse(JSON.stringify(engine2.state.resources));

for (let day = 0; day < 20; day++) {
  const expBefore = engine2.state.exploration.activeExpedition;
  
  engine2.advanceDay();

  const expAfter = engine2.state.exploration.activeExpedition;
  
  // Track phases (they transition, so we need to check both before and after)
  if (expBefore && expBefore.status === 'traveling') sawTravelingPhase = true;
  if (expAfter && expAfter.status === 'working') sawWorkingPhase = true;
  if (expAfter && expAfter.status === 'returning') sawReturningPhase = true;

  // Check if expedition is complete
  if (!engine2.state.exploration.activeExpedition && engine2.state.exploration.completedExpeditions.length > 0) {
    const completed = engine2.state.exploration.completedExpeditions[engine2.state.exploration.completedExpeditions.length - 1];
    if (completed.locationName === locationName) {
      expeditionRecorded = true;
    }
  }

  // Check if member is freed
  const freed = engine2.state.population.characters.find(
    c => c.id === worker.id && c.assignment === 'available'
  );
  if (freed) memberFreed = true;

  // Check if MW returned home
  if (engine2.state.exploration.mwState.status === 'home') mwReturned = true;
}

logTest('Saw traveling phase', sawTravelingPhase, 'Expedition starts in traveling status');
if (sawTravelingPhase) testsPassed++; else testsFailed++;

logTest('Saw working phase', sawWorkingPhase, 'Expedition transitions to working');
if (sawWorkingPhase) testsPassed++; else testsFailed++;

logTest('Saw returning phase', sawReturningPhase, 'Expedition transitions to returning');
if (sawReturningPhase) testsPassed++; else testsFailed++;

logTest('Members freed after return', memberFreed);
if (memberFreed) testsPassed++; else testsFailed++;

logTest('MW returned home', mwReturned);
if (mwReturned) testsPassed++; else testsFailed++;

logTest('Expedition recorded in history', expeditionRecorded);
if (expeditionRecorded) testsPassed++; else testsFailed++;

// ========== TEST 4: Determinism Test ==========
logSection('TEST 4: Determinism Test');

const seed = 42;

// Run engine 1
const engine3a = new MistwalkEngine(undefined, seed);
engine3a.initialize();

for (let i = 0; i < 50; i++) {
  // Send MW on specific days for exploration
  if (i === 5 && engine3a.state.exploration.mwState.status === 'home') {
    const result = engine3a.executeCommand(engine3a.state, {
      type: 'SEND_MW',
      ring: 1,
      totalDays: 5,
    });
    if (result.success) {
      engine3a.state = result.newState;
    }
  }
  if (i === 20 && engine3a.state.exploration.mwState.status === 'home') {
    const result = engine3a.executeCommand(engine3a.state, {
      type: 'SEND_MW',
      ring: 1,
      totalDays: 5,
    });
    if (result.success) {
      engine3a.state = result.newState;
    }
  }

  engine3a.advanceDay();
}

const state3a = JSON.stringify(engine3a.state);

// Run engine 2 with same seed
const engine3b = new MistwalkEngine(undefined, seed);
engine3b.initialize();

for (let i = 0; i < 50; i++) {
  // Send MW on specific days for exploration (same as engine3a)
  if (i === 5 && engine3b.state.exploration.mwState.status === 'home') {
    const result = engine3b.executeCommand(engine3b.state, {
      type: 'SEND_MW',
      ring: 1,
      totalDays: 5,
    });
    if (result.success) {
      engine3b.state = result.newState;
    }
  }
  if (i === 20 && engine3b.state.exploration.mwState.status === 'home') {
    const result = engine3b.executeCommand(engine3b.state, {
      type: 'SEND_MW',
      ring: 1,
      totalDays: 5,
    });
    if (result.success) {
      engine3b.state = result.newState;
    }
  }

  engine3b.advanceDay();
}

const state3b = JSON.stringify(engine3b.state);

const deterministic = state3a === state3b;
logTest('Determinism: Same seed produces identical state', deterministic);
if (deterministic) testsPassed++; else testsFailed++;

if (!deterministic) {
  // Find first difference for debugging
  for (let i = 0; i < Math.min(state3a.length, state3b.length); i++) {
    if (state3a[i] !== state3b[i]) {
      const context = state3a.substring(Math.max(0, i - 50), i + 50);
      console.log(`      First difference at position ${i}`);
      console.log(`      Context: ...${context}...`);
      break;
    }
  }
}

// ========== Summary ==========
logSection('Test Summary');
console.log(`${COLORS.PASS}Passed: ${testsPassed}${COLORS.RESET}`);
console.log(`${COLORS.FAIL}Failed: ${testsFailed}${COLORS.RESET}`);
console.log(`Total: ${testsPassed + testsFailed}`);

process.exit(testsFailed > 0 ? 1 : 0);
