const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { shopItems } = require('./load-game-data.cjs');
const button = (page, name) => page.getByRole('button', { name, exact: true });
const retry = page => page.getByText('No se pudo guardar. Tocá para reintentar.', { exact: true }).filter({ visible: true });
async function run() {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  try {
    const context = await browser.newContext({ viewport: { width: 960, height: 540 } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(() => {
      localStorage.setItem('petmaestro.progress.v1', JSON.stringify({ coins: 87.9, unlockedLevel: 1, ownedItems: null, completedLevels: [1, 1, 999], needs: { hunger: -5, hygiene: 900, energy: 'bad' }, needsUpdatedAt: Date.now() + 100000 }));
      window.__readFails = true;
      window.__writeFails = false;
      const get = Storage.prototype.getItem;
      const set = Storage.prototype.setItem;
      Storage.prototype.getItem = function (key) {
        if (key === 'petmaestro.progress.v1' && window.__readFails) throw new Error('Synthetic read failure');
        return get.call(this, key);
      };
      Storage.prototype.setItem = function (key, value) {
        if (key === 'petmaestro.progress.v1' && window.__writeFails) throw new Error('Synthetic quota failure');
        return set.call(this, key, value);
      };
    });
    await page.goto(process.env.GAME_URL || 'http://localhost:8087');
    await retry(page).waitFor({ timeout: 90000 });
    await page.evaluate(() => { window.__readFails = false; });
    await retry(page).click();
    await button(page, 'Hambre: 0%').waitFor();
    await button(page, 'Higiene: 100%').waitFor();
    await button(page, 'Tienda').click();
    await button(page, 'Abrir Sombreros').click();
    await page.evaluate(() => { window.__writeFails = true; });
    const item = shopItems.find(item => item.category === 'hats');
    await button(page, `Comprar ${item.name}`).click();
    await retry(page).waitFor();
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('petmaestro.progress.v1')).coins), 87.9, 'A failed save must preserve the existing stored data');
    await page.evaluate(() => { window.__writeFails = false; });
    await retry(page).click();
    await retry(page).waitFor({ state: 'hidden' });
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('petmaestro.progress.v1')));
    assert.equal(saved.coins, process.env.INFINITE_COINS === '1' ? 87 : 87 - item.price);
    assert.deepEqual(saved.completedLevels, [1]);
    assert.deepEqual(saved.ownedItems, [item.id]);
    assert.equal(saved.needs.hunger, 0);
    assert.equal(saved.needs.hygiene, 100);
    assert.equal(saved.needs.energy, 100);
    assert.deepEqual(errors, []);
    await context.close();

    const brokenContext = await browser.newContext({ viewport: { width: 844, height: 390 } });
    const broken = await brokenContext.newPage();
    await broken.addInitScript(() => localStorage.setItem('petmaestro.progress.v1', '{invalid-json'));
    await broken.goto(process.env.GAME_URL || 'http://localhost:8087');
    await button(broken, 'Nivel 1: Primeros amigos').waitFor({ timeout: 90000 });
    assert.equal(await broken.evaluate(() => localStorage.getItem('petmaestro.progress.v1.recovery')), '{invalid-json');
    await brokenContext.close();
    console.log('Read failure, quota failure, retry, old-save normalization, and corrupt-save backup passed.');
  } finally { await browser.close(); }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
