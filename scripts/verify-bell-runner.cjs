const assert = require('node:assert/strict');
require('./load-game-data.cjs');
const { initialBellRun, stepBellRun, startBellJump, bellRunFrame, BELL_OBSTACLES, BELL_OBSTACLE_KINDS } = require('../src/data/bellRunner.ts');
assert.equal(new Set(BELL_OBSTACLE_KINDS).size, 3);
assert.equal(new Set(Array.from({ length: 8 }, (_, i) => bellRunFrame((i + .1) / 14))).size, 8, 'All eight running poses play');
for (const fps of [20, 30, 60]) {
  let state = initialBellRun();
  while (!state.done) state = stepBellRun(state, 1 / fps);
  assert.deepEqual(state.hits, [0, 1, 2, 3]);
  assert.equal(state.coins, 0);
  assert.ok(state.time < 18.1);
  state = initialBellRun();
  const jumped = new Set();
  while (!state.done) {
    for (const at of BELL_OBSTACLES) if (!jumped.has(at) && state.time >= at - .45) { state = startBellJump(state); jumped.add(at); }
    state = stepBellRun(state, 1 / fps);
  }
  assert.equal(state.coins, 4, 'Well-timed jumps collect all four approaching coins');
  assert.deepEqual(state.collected, [0, 1, 2, 3], 'Each course coin is collected once');
  assert.deepEqual(state.hits, [], 'A well-timed jump clears each obstacle');
}
let state = startBellJump(initialBellRun());
for (let i = 0; i < 100; i++) state = startBellJump(state);
assert.equal(state.jumps, 1, 'Rapid tapping cannot add jumps in mid-air');
for (let i = 0; i < 30; i++) state = stepBellRun(state, 1 / 30);
assert.equal(state.coins, 0, 'Jumping before an approaching coin never creates a reward');
state = { ...initialBellRun(), time: 3.05 };
state = startBellJump(state);
for (let i = 0; i < 30; i++) state = stepBellRun(state, 1 / 30);
assert.equal(state.coins, 1, 'A jump into the first approaching coin collects it');
assert.deepEqual(state.collected, [0]);
for (let i = 0; i < 30; i++) state = stepBellRun(state, 1 / 30);
assert.equal(state.coins, 1, 'Passing a collected coin cannot pay it twice');
state = { ...initialBellRun(), time: 17.95 };
state = startBellJump(state);
for (let i = 0; i < 40; i++) state = stepBellRun(state, 1 / 30);
assert.equal(state.done, true, 'The final jump lands after the finish without freezing');
assert.equal(state.coins, 0, 'A late jump with no remaining coin gives no invented reward');
for (const dt of [NaN, Infinity, -1, 0]) assert.equal(stepBellRun(state, dt), state);
console.log('Bell runner: eight poses, three obstacle kinds, course-coin collisions at three frame rates, missed coins, no duplicates, rapid taps and last-jump completion passed.');
