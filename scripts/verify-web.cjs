// Run with a separately installed Playwright: PLAYWRIGHT_MODULE=/path/to/playwright
// CHROMIUM_PATH can select an already installed browser. Expo must be running.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { levels, getWord, shopItems } = require('./load-game-data.cjs');
const output = process.env.REVIEW_OUTPUT || '/tmp/petmaestro-review';
fs.mkdirSync(output, { recursive: true });
const storageKey = 'petmaestro.progress.v1';
const visible = (page, text) => page.getByText(text, { exact: true }).filter({ visible: true });
const button = (page, name) => page.getByRole('button', { name, exact: true });
const readProgress = page => page.evaluate(key => JSON.parse(localStorage.getItem(key)), storageKey);
const snap = (page, name) => page.screenshot({ path: path.join(output, `${name}.png`) });

async function run() {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  try {
    const page = await browser.newPage({ viewport: { width: 960, height: 540 } });
    page.setDefaultTimeout(15000);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(({ storageKey }) => {
      if (!localStorage.getItem('petmaestro.test.seeded')) {
        localStorage.setItem(storageKey, JSON.stringify({ coins: 5000, unlockedLevel: 11, needs: { hunger: 35, hygiene: 35, bathroom: 35, play: 35, energy: 35 }, needsUpdatedAt: Date.now() }));
        localStorage.setItem('petmaestro.test.seeded', '1');
      }
      window.__petAudio = [];
      const original = HTMLMediaElement.prototype.play;
      const watched = new WeakSet();
      HTMLMediaElement.prototype.play = function (...args) {
        const media = this;
        if (!watched.has(media)) {
          watched.add(media);
          media.addEventListener('playing', () => window.__petAudio.push({ src: media.currentSrc || media.src, volume: media.volume, duration: media.duration }));
        }
        return original.apply(media, args);
      };
    }, { storageKey });
    await page.goto(process.env.GAME_URL || 'http://localhost:8087');
    await button(page, 'Nivel 1: Primeros amigos').waitFor({ timeout: 90000 });
    await snap(page, 'map');
    let expectedCoins = 5000;
    for (const level of levels) {
      const point = await button(page, `Nivel ${level.id}: ${level.title}`).boundingBox();
      assert.ok(point.x >= 0 && point.x + point.width <= 960 && point.y >= 0 && point.y + point.height <= 446, `Level ${level.id} must fit above the footer`);
      await button(page, `Nivel ${level.id}: ${level.title}`).click();
      await button(page, 'Jugar').click();
      for (const [index, round] of level.rounds.entries()) {
        await visible(page, `Ronda ${index + 1} de ${level.rounds.length}`).waitFor();
        if (round.type === 'match-pair') {
          for (const id of round.pairIds) {
            const word = getWord(id);
            await button(page, `Elegir palabra ${word.english}`).click();
            await button(page, `Elegir dibujo ${word.spanish}`).click();
          }
        } else {
          const word = getWord(round.answerId);
          const label = round.type === 'audio-choice' || round.type === 'translation-choice' && round.promptLanguage === 'spanish' ? word.english : word.spanish;
          await button(page, `Elegir ${label.toUpperCase()}`).click();
        }
      }
      await visible(page, 'Nivel completo').waitFor();
      expectedCoins += level.reward + 8;
      const state = await readProgress(page);
      assert.equal(state.coins, expectedCoins, `Reward counted incorrectly for level ${level.id}`);
      assert.ok(state.completedLevels.includes(level.id));
      await snap(page, `level-${level.id}-complete`);
      await button(page, 'Volver al mapa').click();
      console.log(`Level ${level.id}: ${level.rounds.length} rounds passed; ${state.coins} coins.`);
    }

    // Incorrect answers must stay on the same round and remove the perfect bonus.
    await button(page, 'Nivel 1: Primeros amigos').click();
    await button(page, 'Jugar').click();
    await button(page, 'Elegir PERRO').click();
    await visible(page, 'Probá otra tarjeta. ¡Vos podés!').waitFor();
    await visible(page, 'Ronda 1 de 9').waitFor();
    await button(page, 'Elegir GATO').click();
    await visible(page, 'Ronda 2 de 9').waitFor();
    await button(page, 'Elegir DOG').click();
    // Leaving during the celebration must cancel progression and rewards.
    await button(page, 'Volver').click();
    await page.waitForTimeout(1100);
    assert.equal((await readProgress(page)).coins, expectedCoins);

    // Real purchase, duplicate tap protection, equipment, and persistence.
    await button(page, 'Tienda').click();
    await button(page, 'Abrir Sombreros').click();
    const item = shopItems.find(item => item.category === 'hats');
    await button(page, `Comprar ${item.name}`).dblclick();
    await visible(page, '¡Comprado!').waitFor();
    if (process.env.INFINITE_COINS !== '1') expectedCoins -= item.price;
    assert.equal((await readProgress(page)).coins, expectedCoins);
    await button(page, 'Mascota').click();
    await button(page, `Usar ${item.name}`).click();
    assert.equal((await readProgress(page)).equippedCatItems[item.slot], item.id);
    await snap(page, 'wardrobe');

    // Audio switches persist independently and voice buttons actually play media.
    await button(page, 'Ajustes de sonido').click();
    await page.getByRole('switch', { name: 'Música', exact: true }).click();
    await button(page, '¡Listo!').click();
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('petmaestro.audio.v1')).music), false);

    await page.setViewportSize({ width: 844, height: 390 });
    await button(page, 'Casa').click();
    await button(page, 'Abrir lienzo de dibujo').click();
    const canvas = page.getByTestId('drawing-canvas');
    const bounds = await canvas.boundingBox();
    assert.ok(bounds.width >= 180 && bounds.y + bounds.height <= 296, 'Drawing canvas must fit above the navigation');
    await page.mouse.click(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
    assert.equal(await canvas.locator('circle').count(), 1);
    const audioBeforeReload = await page.evaluate(() => window.__petAudio);
    await page.reload();
    await button(page, 'Casa').waitFor({ timeout: 90000 });
    await button(page, 'Casa').click();
    await button(page, 'Abrir lienzo de dibujo').click();
    assert.equal(await page.getByTestId('drawing-canvas').locator('circle').count(), 1, 'Saved dots must survive remounts');
    await snap(page, 'drawing-phone');

    const audio = await page.evaluate(() => window.__petAudio);
    fs.writeFileSync(path.join(output, 'runtime.json'), JSON.stringify({ errors, expectedCoins, audioBeforeReload, audioAfterReload: audio }, null, 2));
    assert.deepEqual(errors, []);
    console.log('Purchase, equipment, drawing persistence, audio preferences, and navigation passed.');
  } finally { await browser.close(); }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
