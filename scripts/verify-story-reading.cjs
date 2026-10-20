const assert = require('node:assert/strict');
require('./load-game-data.cjs');
const { audiobooks, storyAudio } = require('../src/data/audiobooks.ts');
const { storyReadingContent, restoreStoryQuizResults, storyQuizReward } = require('../src/data/storyReadingContent.ts');
assert.equal(Object.keys(storyReadingContent).length, 12);
assert.equal(audiobooks.filter(story => storyAudio[story.id] !== null).length, 2);
assert.equal(audiobooks.filter(story => storyAudio[story.id] === null).length, 10);
for (const story of audiobooks) {
  assert.ok(story.credits && story.author);
  if (storyAudio[story.id] !== null) assert.ok(story.duration >= 600 && story.narrator, 'Narrated stories exceed ten minutes');
}
for (const [id, reading] of Object.entries(storyReadingContent)) {
  assert.ok(reading.paragraphs.join(' ').split(/\s+/).length >= 600, `${id}: extended full story, not a short fable`);
  assert.equal(reading.questions.length, 5);
  assert.equal(new Set(reading.questions.map(q => q.id)).size, 5);
  for (const q of reading.questions) {
    assert.equal(q.options.length, 3);
    assert.equal(new Set(q.options.map(o => o.id)).size, 3);
    assert.equal(new Set(q.options.map(o => o.text)).size, 3);
    assert.ok(q.options.some(o => o.id === q.answerId));
    assert.ok(q.explanation.length > 20);
  }
}
assert.equal(storyQuizReward(0), 5);
assert.equal(storyQuizReward(3), 8);
assert.equal(storyQuizReward(5), 10);
assert.deepEqual(restoreStoryQuizResults(undefined), {});
assert.deepEqual(restoreStoryQuizResults([]), {});
assert.deepEqual(restoreStoryQuizResults({ fake: { best: 5, completed: 1, lastAttemptId: 'fake-1' }, 'burro-flautista': { best: 50, completed: 2.9, lastAttemptId: 'burro-1' }, 'pato-serpiente': { best: NaN, completed: 2, lastAttemptId: 'pato-1' } }), { 'burro-flautista': { best: 5, completed: 2, lastAttemptId: 'burro-1' } });
console.log('Story reading: twelve extended stories, two local narrations over ten minutes, ten reading-only stories, 60 questions, graded rewards and preserved legacy/corrupt result restoration passed.');
