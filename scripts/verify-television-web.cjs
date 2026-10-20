const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');
const output = '/tmp/petmaestro-television';
const button = (page, name) => page.getByRole('button', { name, exact: true });
async function run() {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  try {
    for (const viewport of [{ width: 1280, height: 720 }, { width: 844, height: 390 }]) {
      const page = await browser.newPage({ viewport });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.addInitScript(() => {
        if (!localStorage.getItem('petmaestro.progress.v1')) localStorage.setItem('petmaestro.progress.v1', JSON.stringify({ coins: 37, ownedItems: ['tv-cabinet', 'blue-cap'], equippedCatItems: { head: 'blue-cap' }, needsUpdatedAt: Date.now() }));
      });
      await page.goto(process.env.GAME_URL || 'http://localhost:8087');
      await button(page, 'Casa').waitFor({ timeout: 90000 });
      await button(page, 'Casa').click();
      assert.equal(await page.getByTestId('interior-tv').count(), 0);
      await button(page, 'Colocar Mueble TV').click();
      const tv = page.getByTestId('interior-tv');
      const rect = await tv.boundingBox();
      assert.ok(rect.width >= 44 && rect.height >= 44, 'Large TV touch target');
      await tv.click();
      await page.getByTestId('tv-seated-cat').waitFor();
      await page.getByTestId('tv-channel-0').waitFor();
      await tv.click();
      await page.getByTestId('tv-channel-1').waitFor();
      await tv.click();
      await page.getByTestId('tv-channel-2').waitFor();
      await page.getByTestId('tv-channel-0').waitFor(); // Automatic change after 2.6 seconds.
      await page.screenshot({ path: `${output}/watching-${viewport.width}.png` });
      await page.getByTestId('tv-status').waitFor({ state: 'detached', timeout: 10000 });
      await tv.click();
      await page.getByTestId('tv-seated-cat').waitFor();
      await button(page, 'Colocar Mueble TV').click();
      await page.getByTestId('tv-status').waitFor({ state: 'detached' });
      assert.equal(await tv.count(), 0);
      await button(page, 'Colocar Mueble TV').click();
      await tv.click();
      await page.getByTestId('tv-seated-cat').waitFor();
      await page.getByTestId('interior-door-kitchen').click();
      await page.getByTestId('tv-status').waitFor({ state: 'detached' });
      await button(page, 'Casa').click();
      assert.equal(await page.getByTestId('tv-seated-cat').count(), 0);
      await tv.click();
      await page.getByTestId('tv-seated-cat').waitFor();
      await page.getByLabel('Caminar por el salón', { exact: true }).click({ position: { x: 25, y: 25 } });
      await page.getByTestId('tv-status').waitFor({ state: 'detached' });
      await tv.click();
      await button(page, 'Mascota').click();
      await button(page, 'Casa').click();
      assert.equal(await page.getByTestId('tv-seated-cat').count(), 0, 'Leaving screen cancels the activity');
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await tv.click();
      const seated = page.getByTestId('tv-seated-cat');
      await seated.waitFor();
      await page.waitForTimeout(150);
      const still = await seated.getAttribute('style');
      await page.waitForTimeout(200);
      assert.equal(await seated.getAttribute('style'), still, 'Reduced motion disables swaying');
      await button(page, 'Colocar Mueble TV').click();
      await page.getByTestId('tv-status').waitFor({ state: 'detached' });
      await button(page, 'Colocar Mueble TV').click();
      const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('petmaestro.progress.v1')));
      assert.equal(saved.coins, 39, 'Only the completed television session earns two coins');
      assert.equal(saved.equippedCatItems.head, 'blue-cap');
      assert.ok(saved.placedFurnitureIds.includes('tv-cabinet'));
      assert.deepEqual(errors, []);
      console.log(`TV flow passed at ${viewport.width}x${viewport.height}`);
      await page.close();
    }
  } finally { await browser.close(); }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
