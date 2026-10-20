const assert = require('node:assert/strict');
const { shopItems } = require('./load-game-data.cjs');
const { farmAnimalMotion } = require('../src/data/farmAnimalMotion.ts');
const { farmAnimalRigs } = require('../src/styles/components/farmAnimalRig.layout.ts');
const { pettingCatTarget, pettingStroke } = require('../src/data/animalPetting.ts');
const animals = shopItems.filter(item => item.target === 'yard');
for (const animal of animals) {
  assert.ok(farmAnimalRigs[animal.id], `Missing rig: ${animal.id}`);
  let previous;
  let walked = false;
  let blinked = false;
  for (let frame = 0; frame < 120 * 60; frame++) {
    const pose = farmAnimalMotion(animal.id, frame / 120);
    for (const [key, value] of Object.entries(pose)) if (key !== 'walking') assert.ok(Number.isFinite(value), key);
    assert.ok(pose.x >= 0 && pose.x <= 44, 'Local steps stay in their slot');
    assert.ok(pose.lift >= 0 && pose.lift <= 19);
    assert.ok(pose.breath >= .995 && pose.breath <= 1.005);
    assert.ok(pose.blink >= 0 && pose.blink <= 1);
    if (previous) {
      assert.ok(Math.abs(pose.x - previous.x) < .3, 'No teleport at rest/walk/cycle boundaries');
      assert.ok(Math.abs(pose.lift - previous.lift) < .7, 'No jump in hop height');
      assert.ok(Math.abs(pose.stride - previous.stride) < .1, 'Smooth alternating foot placement');
    }
    walked ||= pose.walking;
    blinked ||= pose.blink > .95;
    previous = pose;
  }
  assert.ok(walked && blinked);
  assert.deepEqual(farmAnimalMotion(animal.id, 1, true), farmAnimalMotion(animal.id, 40, true), 'Reduced motion is static');
}
console.log('Six animal motion profiles: finite poses, bounded steps/hops, smooth start/stop/cycle transitions, blinking and reduced motion passed over 60 simulated seconds.');
assert.equal(pettingCatTarget('farm-cow', 70, 230, 1200).facing, 'left', 'Approach the left-edge cow from the right');
assert.equal(pettingCatTarget('farm-pig', 1150, 280, 1200).facing, 'right', 'At the right edge choose the reachable paw, not the opposite side');
for (const animal of animals) {
  assert.equal(pettingStroke(animal.id, 0).affection, 0);
  assert.equal(pettingStroke(animal.id, 3.6).affection, 0);
  assert.deepEqual(pettingStroke(animal.id, .5, true), pettingStroke(animal.id, 2, true));
}
console.log('Petting: edge approaches, gentle arm entrance/exit, six profiles and reduced motion passed.');
