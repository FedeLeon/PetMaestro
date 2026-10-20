const assert = require('node:assert/strict');
const { emptyLearning, restoreLearning, reviewWordIds, reviewLevelFor, missionReady, stickerUnlocked, countActivity, cityActivities, getWord } = require('./load-game-data.cjs');
assert.deepEqual(restoreLearning(undefined), emptyLearning());
assert.deepEqual(restoreLearning([]), emptyLearning());
const restored = restoreLearning({ words: { cat: { correct: -5, errors: Infinity, lastPracticed: 1e20 }, fake: { correct: 99 } }, counts: { meal: -7, review: 'bad', city: 3.8 }, claimedMissions: ['rest', 'rest', 'fake'], cityCompleted: ['bakery', 'bakery', 'fake'], toyBest: { 'yarn-ball': 6, bad: 500 } });
assert.equal(restored.words.cat.correct, 0);
assert.equal(restored.words.cat.errors, 0);
assert.ok(restored.words.cat.lastPracticed <= Date.now());
assert.equal(restored.words.fake, undefined);
assert.equal(restored.counts.meal, 0);
assert.equal(restored.counts.review, 0);
assert.equal(restored.counts.city, 3);
assert.deepEqual(restored.claimedMissions, ['rest']);
assert.deepEqual(restored.cityCompleted, ['bakery']);
assert.deepEqual(restored.toyBest, { 'yarn-ball': 6 });
const learning = emptyLearning();
learning.words.cat = { correct: 10, errors: 0, lastPracticed: Date.now() };
learning.words.dog = { correct: 0, errors: 3, lastPracticed: Date.now() };
learning.words.lion = { correct: 0, errors: 100, lastPracticed: 0 };
const ids = reviewWordIds({ learning, unlockedLevel: 1 });
assert.equal(ids[0], 'dog', 'Difficulty must outrank confident and new words');
assert.equal(ids.includes('lion'), false, 'Locked vocabulary must not enter adaptive review');
assert.equal(new Set(ids).size, ids.length, 'Review must not repeat a word within a session');
for (const round of reviewLevelFor({ learning, unlockedLevel: 1 }).rounds) {
  assert.ok(round.optionIds.every(id => ['cat', 'dog', 'fish', 'bird'].includes(id)), 'Distractors must also belong to unlocked vocabulary');
  assert.ok(round.optionIds.includes(round.answerId));
}
assert.equal(stickerUnlocked(learning, 'cat'), true);
assert.equal(stickerUnlocked(learning, 'dog'), false);
assert.equal(missionReady(learning, 'rest'), false);
assert.equal(missionReady(countActivity(countActivity(learning, 'review'), 'sleep'), 'rest'), true);
for (const activity of cityActivities) for (const task of activity.tasks) {
  assert.ok(task.options.includes(task.answer));
  assert.equal(new Set(task.options).size, task.options.length);
  for (const id of task.options) assert.equal(getWord(id).id, id);
}
console.log('Learning: legacy saves, corrupt fields, adaptive ordering, vocabulary gate, stickers, mission requirements and city content passed.');
