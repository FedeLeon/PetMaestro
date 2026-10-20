const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');
const output = '/tmp/petmaestro-house-furniture';
const button = (page, name) => page.getByRole('button', { name, exact: true });
async function reveal(page, id) {
  const target = page.getByTestId(id);
  for (let attempt = 0; attempt < 8; attempt++) {
    const viewport = await page.getByTestId('interior-scroll').boundingBox();
    const box = await target.boundingBox();
    const center = box.x + box.width / 2;
    if (center > viewport.x + 28 && center < viewport.x + viewport.width - 28) return target;
    const right = center > viewport.x + viewport.width;
    const start = viewport.x + viewport.width * (right ? .85 : .15);
    const end = viewport.x + viewport.width * (right ? .15 : .85);
    const y = viewport.y + viewport.height * .4;
    await page.mouse.move(start, y); await page.mouse.down();
    await page.mouse.move(end, y, { steps: 18 }); await page.mouse.up();
    await page.waitForTimeout(180);
  }
  throw new Error(`Could not pan to ${id}`);
}
async function run() {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  try {
    for (const viewport of [{ width: 1280, height: 720 }, { width: 844, height: 390 }]) {
      const page = await browser.newPage({ viewport });
      page.setDefaultTimeout(12000);
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.addInitScript(() => {
        if (!localStorage.getItem('petmaestro.progress.v1')) localStorage.setItem('petmaestro.progress.v1', JSON.stringify({ coins: 37, ownedItems: ['soft-bed', 'fish-lamp', 'floor-lamp', 'small-table', 'tv-cabinet', 'blue-cap'], placedFurnitureIds: ['soft-bed', 'fish-lamp', 'floor-lamp', 'small-table', 'tv-cabinet'], equippedCatItems: { head: 'blue-cap' }, needsUpdatedAt: Date.now() }));
      });
      await page.goto(process.env.GAME_URL || 'http://localhost:8087');
      await button(page, 'Casa').waitFor({ timeout: 90000 }); await button(page, 'Casa').click();
      for (const id of ['fish-lamp', 'floor-lamp', 'soft-bed']) {
        const target = await reveal(page, `interior-${id}`);
        const r = await target.boundingBox(); assert.ok(r.width >= 44 && r.height >= 44);
      }
      const floor = await reveal(page, 'interior-floor-lamp');
      await floor.click();
      await page.getByTestId('lamp-glow-floor-lamp').waitFor();
      assert.equal(await floor.getAttribute('aria-pressed'), 'true');
      const bed = page.getByTestId('interior-soft-bed');
      await bed.click(); await page.getByTestId('soft-bed-resting-cat').waitFor();
      assert.equal(await page.getByTestId('tv-seated-cat').count(), 0);
      const cat = page.getByTestId('soft-bed-resting-cat');
      const c = await cat.boundingBox(); const b = await page.getByTestId('placed-soft-bed').boundingBox();
      assert.ok(c.x >= b.x && c.x + c.width <= b.x + b.width && c.y >= b.y && c.y + c.height <= b.y + b.height, 'Cat lies inside bed');
      await page.waitForTimeout(400);
      const before = await cat.getAttribute('style'); await page.waitForTimeout(200);
      assert.notEqual(await cat.getAttribute('style'), before, 'Cat breathes gently');
      await page.screenshot({ path: `${output}/resting-${viewport.width}.png` });
      await floor.click();
      assert.equal(await floor.getAttribute('aria-pressed'), 'false');
      assert.equal(await cat.count(), 1, 'Lights do not interrupt rest');
      await page.getByTestId('soft-bed-status').waitFor({ state: 'detached', timeout: 10000 });
      await bed.click(); await cat.waitFor(); await bed.click();
      await cat.waitFor({ state: 'detached' }); // Explicit wake-up.
      await bed.click(); await button(page, 'Colocar Camita suave').click();
      await page.getByTestId('soft-bed-status').waitFor({ state: 'detached' });
      await page.waitForTimeout(3000);
      assert.equal(await cat.count(), 0, 'No late sleep after bed removal');
      await button(page, 'Colocar Camita suave').click();
      await bed.click(); await cat.waitFor();
      const tv = await reveal(page, 'interior-tv'); await tv.click();
      await cat.waitFor({ state: 'detached' }); await page.getByTestId('tv-seated-cat').waitFor();
      await (await reveal(page, 'interior-soft-bed')).click();
      await page.getByTestId('tv-status').waitFor({ state: 'detached' }); await cat.waitFor();
      const fish = await reveal(page, 'interior-fish-lamp'); await fish.click();
      await page.getByTestId('lamp-glow-fish-lamp').waitFor();
      assert.equal(await floor.getAttribute('aria-pressed'), 'false', 'Independent lamps');
      await fish.click(); assert.equal(await fish.getAttribute('aria-pressed'), 'false');
      await fish.click(); await button(page, 'Colocar Lampara pez').click();
      assert.equal(await page.getByTestId('lamp-glow-fish-lamp').count(), 0);
      await button(page, 'Colocar Lampara pez').click(); assert.equal(await fish.getAttribute('aria-pressed'), 'false');
      const withTable = await fish.boundingBox();
      await button(page, 'Colocar Mesita').click();
      const withoutTable = await fish.boundingBox(); assert.ok(withoutTable.y > withTable.y, 'Touch area follows lamp off the table');
      await fish.click(); await page.waitForTimeout(300);
      await page.screenshot({ path: `${output}/fish-light-${viewport.width}.png` });
      if (await cat.count()) await (await reveal(page, 'interior-soft-bed')).click();
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await (await reveal(page, 'interior-soft-bed')).click(); await cat.waitFor();
      await page.waitForTimeout(150); const still = await cat.getAttribute('style');
      await page.waitForTimeout(200); assert.equal(await cat.getAttribute('style'), still);
      await button(page, 'Mascota').click(); await button(page, 'Casa').click();
      assert.equal(await cat.count(), 0, 'Navigation cancels rest');
      const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('petmaestro.progress.v1')));
      assert.equal(saved.coins, 40, 'Only the completed soft-bed rest earns three coins'); assert.equal(saved.equippedCatItems.head, 'blue-cap');
      assert.deepEqual(errors, []);
      console.log(`Furniture interactions passed at ${viewport.width}x${viewport.height}`);
      await page.close();
    }
  } finally { await browser.close(); }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
