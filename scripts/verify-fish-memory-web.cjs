const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');
const { shopItems, words } = require('./load-game-data.cjs');
const { fishMemoryDeck } = require('../src/data/fishMemory.ts');
const solve = require('./solve-fish-memory.cjs');
const output = process.env.REVIEW_OUTPUT || '/tmp/petmaestro-fish-memory';
const button = (page, name) => page.getByRole('button', { name, exact: true });
const saved = page => page.evaluate(() => JSON.parse(localStorage.getItem('petmaestro.progress.v1')));
async function run() {
  const deck = fishMemoryDeck(['cat', 'dog', 'fish', 'bird'], () => .4);
  assert.equal(deck.length, 8);
  for (const id of new Set(deck)) assert.equal(deck.filter(value => value === id).length, 2);
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  const report = [];
  try {
    for (const viewport of [{ width: 1280, height: 720 }, { width: 844, height: 390 }]) {
      const page = await browser.newPage({ viewport, reducedMotion: 'no-preference' });
      page.setDefaultTimeout(15000);
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.addInitScript(() => {
        if (!localStorage.getItem('petmaestro.progress.v1')) localStorage.setItem('petmaestro.progress.v1', JSON.stringify({ coins: 7, ownedItems: ['fish-plush', 'star-plush'], needsUpdatedAt: Date.now() }));
      });
      await page.goto(process.env.GAME_URL || 'http://localhost:8087');
      await button(page, 'Juguetes').waitFor({ timeout: 90000 });
      await button(page, 'Juguetes').click();
      const fishName = shopItems.find(i => i.id === 'fish-plush').name;
      await button(page, `Jugar ${fishName}`).click();
      await page.getByTestId('fish-memory-ready').waitFor();
      const card = i => page.getByTestId(`fish-memory-card-${i}`);
      assert.equal(await page.getByRole('button', { name: /^Carta \d+$/ }).count(), 8);
      const boxes = [];
      for (let i = 1; i <= 8; i++) {
        const rect = await card(i).boundingBox();
        assert.ok(Math.abs(rect.width - rect.height) < 1 && rect.width >= 44, 'Square cards with large touch areas');
        assert.ok(rect.x >= 0 && rect.x + rect.width <= viewport.width && rect.y >= 58 && rect.y + rect.height <= viewport.height - 38);
        assert.equal(await card(i).getAttribute('aria-label'), `Carta ${i}`, 'Hidden labels never reveal the word');
        boxes.push(rect);
      }
      assert.ok(boxes.slice(0, 4).every(b => Math.abs(b.y - boxes[0].y) < 1));
      assert.ok(boxes.slice(4).every(b => Math.abs(b.y - boxes[4].y) < 1) && boxes[4].y >= boxes[0].y + boxes[0].height, 'Two rows of four');
      await page.screenshot({ path: `${output}/backs-${viewport.width}.png` });
      const flip = page.getByTestId('memory-flip-1');
      const start = await flip.evaluate(el => getComputedStyle(el).transform);
      await card(1).click();
      await page.getByTestId('fish-memory-flipping').waitFor();
      await page.waitForTimeout(100);
      assert.notEqual(await flip.evaluate(el => getComputedStyle(el).transform), start, 'Real Y-axis card flip');
      const secondRect = boxes[1];
      await page.mouse.click(secondRect.x + secondRect.width / 2, secondRect.y + secondRect.height / 2);
      assert.equal(await card(2).getAttribute('aria-label'), 'Carta 2', 'Ignore clicks during a flip');
      await page.screenshot({ path: `${output}/flip-${viewport.width}.png` });
      await page.getByTestId('fish-memory-ready').waitFor();
      const firstWord = (await card(1).getAttribute('aria-label')).split(': ')[1];
      const result = await solve(page, { firstOpen: 1, remembered: new Map([[1, firstWord]]), onMismatch: async ({ first, second, matched }) => {
        assert.equal(await page.getByRole('button', { name: /^Carta \d+: / }).count(), matched * 2 + 2, 'Only the current pair and matched cards are exposed');
        const hidden = page.getByRole('button', { name: /^Carta \d+$/ }).first();
        if (await hidden.count()) {
          const before = await hidden.getAttribute('aria-label');
          const rect = await hidden.boundingBox();
          await page.mouse.click(rect.x + rect.width / 2, rect.y + rect.height / 2);
          assert.equal(await hidden.getAttribute('aria-label'), before, 'Third card stays hidden during comparison');
        }
        await page.getByTestId('fish-memory-hiding').waitFor();
        await page.screenshot({ path: `${output}/hide-${viewport.width}-${first}-${second}.png` });
      } });
      await page.getByText('¡Qué bien jugaron juntos!', { exact: true }).waitFor();
      const firstSaved = await saved(page);
      assert.equal(firstSaved.learning.toyBest['fish-plush'], 4);
      assert.equal(firstSaved.learning.counts.toy, 1);
      assert.equal(firstSaved.learning.counts.answers, 4);
      assert.equal(firstSaved.coins, 12);
      assert.equal(result.words.length, 4);
      for (const spanish of result.words) assert.equal(firstSaved.learning.words[words.find(w => w.spanish === spanish).id].correct, 1);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await button(page, 'Volver a jugar').click();
      await page.getByTestId('fish-memory-ready').waitFor();
      await solve(page);
      await page.getByText('¡Qué bien jugaron juntos!', { exact: true }).waitFor();
      assert.equal((await saved(page)).coins, 17, 'Each completed replay earns five coins');
      assert.equal((await saved(page)).learning.counts.toy, 2);
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await button(page, 'Volver a jugar').click();
      await card(1).click();
      await page.getByTestId('fish-memory-flipping').waitFor();
      await button(page, 'Volver').click();
      await page.waitForTimeout(1400);
      assert.equal((await saved(page)).learning.counts.toy, 2, 'Leaving mid-flip does not finish a round');
      await button(page, `Jugar ${shopItems.find(i => i.id === 'star-plush').name}`).click();
      assert.equal(await page.getByRole('button', { name: /^Carta \d+$/ }).count(), 6, 'Star game retains its six cards');
      assert.equal(await page.getByTestId('fish-memory-board').count(), 0);
      assert.deepEqual(errors, []);
      report.push({ viewport, ...result, errors });
      await page.close();
      console.log(`Fish memory passed: 8 square cards, flip, blocked rapid taps, mismatches, 4 vocabulary pairs, rewards, replay, reduced motion, exit and star regression at ${viewport.width}×${viewport.height}.`);
    }
    fs.writeFileSync(`${output}/report.json`, JSON.stringify(report, null, 2));
  } finally { await browser.close(); }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
