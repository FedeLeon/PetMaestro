const assert = require('node:assert/strict');

// Solve using only pictures revealed by real clicks, remembering their positions.
module.exports = async function solveFishMemory(page, { firstOpen, remembered = new Map(), onMismatch } = {}) {
  const known = new Map(remembered);
  const matched = new Set();
  const card = index => page.getByTestId(`fish-memory-card-${index}`);
  const settled = () => page.getByTestId(/^fish-memory-(ready|comparing|complete)$/).waitFor();
  const read = async index => (await card(index).getAttribute('aria-label')).split(': ')[1];
  let mismatches = 0;
  while (matched.size < 4) {
    const remaining = Array.from({ length: 8 }, (_, i) => i + 1).filter(i => !matched.has(known.get(i)));
    const pair = remaining.find(i => known.has(i) && remaining.some(j => j !== i && known.get(j) === known.get(i)));
    const first = firstOpen || pair || remaining.find(i => !known.has(i)) || remaining[0];
    if (!firstOpen) { await card(first).click(); await settled(); }
    firstOpen = undefined;
    const word = await read(first);
    known.set(first, word);
    const second = remaining.find(i => i !== first && known.get(i) === word)
      || remaining.find(i => i !== first && !known.has(i)) || remaining.find(i => i !== first);
    await card(second).click();
    await settled();
    const otherWord = await read(second);
    assert.ok(word && otherWord, 'Only read fully revealed card labels');
    known.set(second, otherWord);
    if (word === otherWord) matched.add(word);
    else {
      mismatches += 1;
      if (onMismatch) await onMismatch({ first, second, matched: matched.size });
      await page.getByTestId('fish-memory-ready').waitFor();
      assert.equal(await card(first).getAttribute('aria-label'), `Carta ${first}`);
      assert.equal(await card(second).getAttribute('aria-label'), `Carta ${second}`);
    }
  }
  return { words: [...matched], mismatches };
};
