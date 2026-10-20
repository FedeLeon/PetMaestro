const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const data = require('./load-game-data.cjs');
const { shopDisplayBounds } = require('../src/data/shopDisplayBounds.ts');
const { words, levels, shopItems, shopCategories, wordImages, wordAudio, catItemImages, furnitureImages, farmAnimalImages, gardenImages, mealNutrition, flowerWait, FLOWER_WATER_INTERVAL_MS } = data;
const unique = values => assert.equal(new Set(values).size, values.length, `Duplicate ids: ${values}`);
unique(words.map(word => word.id));
unique(levels.map(level => level.id));
unique(shopItems.map(item => item.id));
let rounds = 0;
const silentWords = words.filter(word => !wordAudio[word.id]).map(word => word.id);
for (const word of words) assert.ok(wordImages[word.id], `Missing illustration: ${word.id}`);
for (const level of levels) {
  assert.ok(level.rounds.length > 0);
  unique(level.rounds.map(round => round.id));
  for (const round of level.rounds) {
    rounds++;
    const options = round.type === 'match-pair' ? round.pairIds : round.optionIds;
    unique(options);
    assert.equal(options.length, 4, `Four options required in ${round.id}`);
    for (const id of options) assert.ok(words.some(word => word.id === id), `Unknown word ${id}`);
    if (round.type !== 'match-pair') assert.ok(options.includes(round.answerId), `Answer missing in ${round.id}`);
  }
}
for (const item of shopItems) {
  assert.ok(shopCategories.some(category => category.id === item.category), `Missing shop category ${item.id}`);
  const registry = item.target === 'cat' ? catItemImages : item.target === 'house' ? furnitureImages : item.target === 'yard' ? farmAnimalImages : gardenImages;
  assert.ok(registry[item.id], `Missing shop art ${item.id}`);
  const bounds = shopDisplayBounds[item.id];
  assert.ok(bounds && bounds.every(Number.isFinite), `Missing display bounds ${item.id}`);
  const [x, y, width, height, aspect] = bounds;
  assert.ok(x >= 0 && y >= 0 && width > 0 && height > 0 && x + width <= 1.001 && y + height <= 1.001 && aspect > 0, `Invalid display bounds ${item.id}`);
  assert.ok(Number.isFinite(item.price) && item.price >= 0);
}
assert.equal(mealNutrition(['fish', 'fish']), mealNutrition(['fish']), 'Duplicate ingredients must not multiply nutrition');
assert.equal(mealNutrition(['missing']), 0);
assert.equal(flowerWait(undefined, 100), 0);
assert.equal(flowerWait(100, 100), FLOWER_WATER_INTERVAL_MS);
assert.equal(flowerWait(100, 100 + FLOWER_WATER_INTERVAL_MS), 0);
let files = 0;
function inspect(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) inspect(file);
    else if (/\.tsx?$/.test(file)) {
      for (const [, relative] of fs.readFileSync(file, 'utf8').matchAll(/require\(['"]([^'"]+)['"]\)/g)) {
        const target = path.resolve(path.dirname(file), relative);
        assert.ok(fs.existsSync(target), `Missing file: ${target}`);
        assert.ok(fs.statSync(target).size > 0, `Empty asset: ${target}`);
        files++;
      }
    }
  }
}
inspect(path.resolve(__dirname, '../src'));
console.log(JSON.stringify({ levels: levels.length, rounds, words: words.length, shopItems: shopItems.length, assetReferences: files, silentWords }, null, 2));
