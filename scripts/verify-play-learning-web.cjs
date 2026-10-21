const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');
const catchYarn = require('./catch-yarn.cjs');
const solveFishMemory = require('./solve-fish-memory.cjs');
const { shopItems, getWord, cityActivities, reviewWordIds } = require('./load-game-data.cjs');
const output = process.env.REVIEW_OUTPUT || '/tmp/petmaestro-play-learning';
const button = (page, name) => page.getByRole('button', { name, exact: typeof name === 'string' });
const visible = (page, value) => page.getByText(value, { exact: true }).filter({ visible: true });
const saved = page => page.evaluate(() => JSON.parse(localStorage.getItem('petmaestro.progress.v1')));
async function run() {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  try {
    const page = await browser.newPage({ viewport: { width: 844, height: 390 } });
    page.setDefaultTimeout(15000);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const seed = { coins: 500, unlockedLevel: 11, completedLevels: [11], ownedItems: shopItems.filter(item => item.category === 'cat-toys').map(item => item.id), needs: { hunger: 40, hygiene: 40, bathroom: 40, energy: 40, play: 40 }, needsUpdatedAt: Date.now(), learning: { words: { cat: { correct: 2, errors: 9, lastPracticed: Date.now() }, dog: { correct: 0, errors: 7, lastPracticed: Date.now() } }, counts: {}, claimedMissions: [], cityCompleted: [], toyBest: {} } };
    await page.addInitScript(seed => { if (!localStorage.getItem('petmaestro.progress.v1')) localStorage.setItem('petmaestro.progress.v1', JSON.stringify(seed)); }, seed);
    await page.goto(process.env.GAME_URL || 'http://localhost:8087');
    await button(page, 'Mapa').waitFor({ timeout: 90000 });
    assert.equal(await button(page, 'Aventuras').count(), 0);
    await button(page, 'Álbum de figuritas').click();
    await button(page, 'Practicar palabras').click();
    const ids = reviewWordIds(seed);
    assert.equal(ids[0], 'dog', 'The word with more difficulty must come first');
    for (const [index, id] of ids.entries()) {
      await visible(page, `Ronda ${index + 1} de ${ids.length}`).waitFor();
      if (index === 0) {
        const wrong = await page.getByRole('button', { name: /^Elegir / }).all();
        for (const option of wrong) if ((await option.getAttribute('aria-label')) !== `Elegir ${getWord(id).spanish.toUpperCase()}`) { await option.click(); break; }
        await visible(page, 'Probá otra tarjeta. ¡Vos podés!').waitFor();
        assert.equal((await saved(page)).learning.words.dog.errors, 8);
      }
      await button(page, `Elegir ${getWord(id).spanish.toUpperCase()}`).click();
    }
    await visible(page, 'Repaso completo').waitFor();
    assert.equal((await saved(page)).coins, 510);
    assert.equal((await saved(page)).learning.counts.review, 1);
    assert.equal((await saved(page)).learning.words.cat.correct, 3);
    await button(page, 'Ver mis pegatinas ★').click();
    await page.getByTestId('album-cat').getByText('Pegatina ganada ★', { exact: true }).waitFor();
    await page.screenshot({ path: `${output}/album-phone.png` });
    await button(page, 'Juguetes').click();
    const toys = shopItems.filter(item => item.category === 'cat-toys');
    for (const toy of toys) {
      await button(page, `Jugar ${toy.name}`).click();
      if (toy.id === 'feather-wand') {
        await button(page, 'Luz 1').click();
        await visible(page, 'Buscá la luz amarilla.').waitFor();
        await page.screenshot({ path: `${output}/sequence-phone.png` });
        for (const index of [2, 4, 1, 3, 2, 1]) await button(page, `Luz ${index}`).click();
      } else if (toy.id === 'fish-plush') {
        await solveFishMemory(page);
      } else if (toy.id === 'star-plush') {
        await page.screenshot({ path: `${output}/memory-${toy.id}-phone.png` });
        // Reveal cards and remember their actual pictures; no hidden card values.
        const known = new Map();
        const done = new Set();
        while (done.size < 3) {
          const hidden = await page.getByRole('button', { name: /^Carta \d+$/ }).all();
          assert.ok(hidden.length);
          const numbers = await Promise.all(hidden.map(async card => Number((await card.getAttribute('aria-label')).split(' ')[1])));
          const firstNumber = numbers.find(number => !known.has(number)) || numbers[0];
          await button(page, `Carta ${firstNumber}`).click();
          const firstLabel = await page.getByRole('button', { name: new RegExp(`^Carta ${firstNumber}:`) }).getAttribute('aria-label');
          const word = firstLabel.split(': ')[1];
          const partner = [...known.entries()].find(([index, value]) => index !== firstNumber && value === word && !done.has(word));
          const secondNumber = partner?.[0] || numbers.find(number => number !== firstNumber && !known.has(number)) || numbers.find(number => number !== firstNumber);
          known.set(firstNumber, word);
          await button(page, `Carta ${secondNumber}`).click();
          if (done.size === 2) { done.add(word); break; }
          const secondLabel = await page.getByRole('button', { name: new RegExp(`^Carta ${secondNumber}:`) }).getAttribute('aria-label');
          known.set(secondNumber, secondLabel.split(': ')[1]);
          if (secondLabel.split(': ')[1] === word) done.add(word);
          else await page.waitForTimeout(850);
          const pair = [...known.entries()].find(([i, value]) => !done.has(value) && [...known.entries()].some(([j, other]) => i !== j && value === other));
          if (pair) {
            const other = [...known.entries()].find(([i, value]) => i !== pair[0] && value === pair[1]);
            await button(page, `Carta ${pair[0]}`).click();
            await button(page, `Carta ${other[0]}`).click();
            done.add(pair[1]);
          }
        }
      } else if (toy.id === 'mouse-toy') {
        for (let i = 0; i < 6; i++) {
          await button(page, 'Encontrar al ratoncito').click();
          if (i < 5) await page.waitForFunction(() => document.querySelector('[data-testid="hidden-mouse"]')?.getAttribute('aria-disabled') !== 'true');
        }
      } else if (toy.id === 'yarn-ball') {
        await catchYarn(page);
      } else if (toy.id === 'bell-ball') {
        await button(page, 'Empezar carrera').click();
        await visible(page, '¡Alcanzaste el cascabel!').waitFor({ timeout: 25000 });
      } else {
        await page.screenshot({ path: `${output}/chase-${toy.id}-phone.png` });
        for (let i = 0; i < 6; i++) await button(page, 'Atrapar juguete').click();
      }
      await visible(page, toy.id === 'bell-ball' ? '¡Alcanzaste el cascabel!' : '¡Qué bien jugaron juntos!').waitFor();
      assert.ok((await saved(page)).learning.toyBest[toy.id]);
      await button(page, 'Mis juguetes').click();
    }
    assert.equal((await saved(page)).coins, 540, 'Each of six completed toy rounds awards five coins');
    await button(page, 'Jugar Ovillo').click();
    await catchYarn(page);
    await visible(page, '¡Qué bien jugaron juntos!').waitFor();
    assert.equal((await saved(page)).coins, 545, 'A completed toy replay awards another five coins');
    await button(page, 'Mis juguetes').click();
    await button(page, 'Mapa').click();
    await button(page, 'Entrar a Ciudad Gatuna').click();
    await page.screenshot({ path: `${output}/city-phone.png` });
    for (const activity of [...cityActivities, cityActivities[0]]) {
      const before = (await saved(page)).coins;
      const repeated = (await saved(page)).learning.cityCompleted.includes(activity.id);
      await button(page, `Visitar ${activity.name}`).click();
      await page.screenshot({ path: `${output}/city-${activity.id}-phone.png` });
      for (const [index, task] of activity.tasks.entries()) {
        if (index === 0) await button(page, `Entregar ${getWord(task.options.find(id => id !== task.answer)).spanish}`).click();
        await button(page, `Entregar ${getWord(task.answer).spanish}`).click();
      }
      await visible(page, '¡Ayudaste a tus amigos de la ciudad!').waitFor();
      assert.equal((await saved(page)).coins, before + (repeated ? 5 : 15));
      await button(page, 'Volver a Ciudad Gatuna').click();
    }
    const result = await saved(page);
    await page.reload();
    await button(page, 'Mapa').waitFor({ timeout: 90000 });
    await button(page, 'Álbum de figuritas').click();
    assert.deepEqual((await saved(page)).learning, result.learning, 'Learning and game progress must persist');
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.screenshot({ path: `${output}/album-desktop.png` });
    assert.deepEqual(errors, []);
    fs.writeFileSync(`${output}/report.json`, JSON.stringify({ errors, learning: result.learning, coins: result.coins }, null, 2));
    const fresh = await browser.newPage({ viewport: { width: 844, height: 390 } });
    fresh.on('pageerror', error => errors.push(error.message));
    await fresh.addInitScript(() => localStorage.setItem('petmaestro.progress.v1', JSON.stringify({ coins: 30, unlockedLevel: 1, needsUpdatedAt: Date.now() })));
    await fresh.goto(process.env.GAME_URL || 'http://localhost:8087');
    await button(fresh, 'Mapa').waitFor({ timeout: 90000 });
    const lockedCity = button(fresh, 'Completá la evaluación final para entrar a Ciudad Gatuna');
    assert.equal(await lockedCity.isDisabled(), true, 'City stays locked until level 11 is complete');
    await button(fresh, 'Juguetes').click();
    await button(fresh, 'Comprar Ovillo').click();
    await button(fresh, 'Comprar Ovillo').click();
    assert.equal((await saved(fresh)).coins, process.env.INFINITE_COINS === '1' ? 30 : 0);
    assert.deepEqual((await saved(fresh)).learning.words, {}, 'Legacy save must gain learning defaults without losing purchases');
    await button(fresh, 'Juguetes').click();
    await button(fresh, 'Jugar Ovillo').waitFor();
    await fresh.close();
    assert.deepEqual(errors, []);
    console.log('Adaptive review, mistakes, stickers, six toys, three city scenes, repeat rewards and persistence passed.');
  } finally { await browser.close(); }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
