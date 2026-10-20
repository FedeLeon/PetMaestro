const assert = require('node:assert/strict');
require('./load-game-data.cjs');
const { audiobooks, storyAudio } = require('../src/data/audiobooks.ts');
const { storyOrder, STORY_GROUP_COUNT, isStoryUnlocked, libraryGroupCompleted, libraryGroupUnlocked, unlockedLibraryGroups } = require('../src/data/libraryProgression.ts');
assert.deepEqual(audiobooks.map(s => s.id), [...storyOrder], 'The catalog and saved progression share one stable order');
assert.equal(STORY_GROUP_COUNT, 3);
const results = {};
for (let index = 0; index < storyOrder.length; index++) {
  assert.equal(unlockedLibraryGroups(results), Math.min(3, 1 + Math.floor(index / 4)));
  assert.equal(isStoryUnlocked(storyOrder[index], results), true, 'The next book in the current group is available');
  if (index < 8) assert.equal(libraryGroupUnlocked(Math.floor(index / 4) + 1, results), false);
  results[storyOrder[index]] = { best: 0, completed: 1, lastAttemptId: 'attempt-1' };
}
assert.equal(unlockedLibraryGroups(results), 3, 'Zero correct answers in every quiz unlocks the entire library');
assert.equal(libraryGroupCompleted(2, results), 4);
const repeated = { [storyOrder[0]]: { best: 5, completed: 100 } };
assert.equal(libraryGroupCompleted(0, repeated), 1);
assert.equal(libraryGroupUnlocked(1, repeated), false, 'Repeating one story cannot replace four different stories');
const outOfOrder = Object.fromEntries(storyOrder.slice(4, 8).map(id => [id, { completed: 1 }]));
assert.equal(libraryGroupUnlocked(2, outOfOrder), false, 'Later saved results cannot bypass the first group');
assert.equal(unlockedLibraryGroups({ 'burro-flautista': { completed: 50 } }), 1, 'Retired stories do not unlock the current library');
for (const invalid of [NaN, Infinity, 0, -1]) assert.equal(libraryGroupUnlocked(1, Object.fromEntries(storyOrder.slice(0, 4).map(id => [id, { completed: invalid }]))), false);
for (const invalid of [-1, 3, NaN, .5]) assert.equal(libraryGroupUnlocked(invalid, results), false);
assert.equal(isStoryUnlocked('unknown-story', results), false);
for (const id of storyOrder.slice(4)) assert.equal(storyAudio[id], null, 'New stories have no unverified regional audio');
console.log('Library progression: 12 books, groups of four, zero-score completion, distinct stories, corrupt and retired results, stable order and audio policy passed.');
