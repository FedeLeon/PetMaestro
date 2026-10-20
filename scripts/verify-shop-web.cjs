const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');
const { shopCategories, shopItems } = require('./load-game-data.cjs');
const output = process.env.REVIEW_OUTPUT || '/tmp/petmaestro-shop';
const button = (page, name) => page.getByRole('button', { name, exact: true });
const saved = page => page.evaluate(() => JSON.parse(localStorage.getItem('petmaestro.progress.v1')));
async function run() {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  const errors = [];
  try {
    const page = await browser.newPage();
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(() => {
      if (!localStorage.getItem('petmaestro.progress.v1')) localStorage.setItem('petmaestro.progress.v1', JSON.stringify({ coins: 7, needsUpdatedAt: Date.now() }));
    });
    await page.goto(process.env.GAME_URL || 'http://localhost:8087');
    await button(page, 'Aventuras').waitFor({ timeout: 90000 });
    await button(page, 'Tienda').click();
    for (const viewport of [{ width: 844, height: 390 }, { width: 1280, height: 720 }]) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(200);
      await page.screenshot({ path: `${output}/explore-${viewport.width}.png` });
      const portals = [];
      for (const category of shopCategories) {
        const rect = await button(page, `Abrir ${category.label}`).boundingBox();
        assert.ok(rect.width >= 44 && rect.height >= 44, category.id);
        assert.ok(rect.y >= 0 && rect.y + rect.height <= viewport.height - 94, `${category.id} overlaps footer`);
        for (const other of portals) assert.ok(Math.min(rect.x + rect.width, other.x + other.width) - Math.max(rect.x, other.x) <= 1 || Math.min(rect.y + rect.height, other.y + other.height) - Math.max(rect.y, other.y) <= 1, 'Category touch zones must not overlap');
        portals.push(rect);
      }
      for (const category of shopCategories) {
        await button(page, `Abrir ${category.label}`).click();
        const items = shopItems.filter(item => item.category === category.id);
        const pages = Math.ceil(items.length / 3);
        assert.equal(await button(page, 'Ver productos anteriores').isDisabled(), true);
        for (const label of ['Ver productos anteriores', 'Ver productos siguientes']) {
          const arrow = await button(page, label).boundingBox();
          assert.ok(arrow.width >= 72 && arrow.height >= 72, 'Large paging touch targets');
          assert.ok(arrow.x >= 0 && arrow.x + arrow.width <= viewport.width && arrow.y >= 58 && arrow.y + arrow.height <= viewport.height - 94, 'Paging arrows fit between header and footer');
        }
        if (category.id === 'hats') {
          const nextMotion = page.getByTestId('shop-page-arrow-next-motion');
          const previousMotion = page.getByTestId('shop-page-arrow-previous-motion');
          const transforms = new Set();
          const disabledTransforms = new Set();
          for (let sample = 0; sample < 5; sample++) {
            transforms.add(await nextMotion.evaluate(el => getComputedStyle(el).transform));
            disabledTransforms.add(await previousMotion.evaluate(el => getComputedStyle(el).transform));
            await page.waitForTimeout(190);
          }
          assert.ok(transforms.size > 2, 'Available paging arrow breathes');
          assert.equal(disabledTransforms.size, 1, 'Disabled paging arrow stays still');
          await page.screenshot({ path: `${output}/arrows-${viewport.width}.png` });
          await page.emulateMedia({ reducedMotion: 'reduce' });
          await page.waitForTimeout(150);
          const stopped = await nextMotion.evaluate(el => getComputedStyle(el).transform);
          await page.waitForTimeout(350);
          assert.equal(await nextMotion.evaluate(el => getComputedStyle(el).transform), stopped, 'Reduced motion stops breathing');
          await page.emulateMedia({ reducedMotion: 'no-preference' });
        }
        for (let index = 0; index < pages; index++) {
          await page.getByText(`${index + 1} de ${pages}`, { exact: true }).waitFor();
          const visible = items.slice(index * 3, index * 3 + 3);
          await page.getByTestId(`shop-product-${visible[0].id}`).waitFor();
          assert.equal(await page.locator('[data-testid^="shop-product-"]:not([data-testid^="shop-product-art-"])').count(), visible.length);
          for (const item of visible) {
            const product = page.getByTestId(`shop-product-${item.id}`);
            await product.waitFor();
            const control = product.getByRole('button');
            const rect = await control.boundingBox();
            assert.ok(rect.width >= 44 && rect.height >= 44 && rect.y + rect.height <= viewport.height - 94, `${item.id} purchase control must fit`);
            assert.equal(await page.getByTestId(`shop-product-art-${item.id}`).locator('image').count(), 1);
            const art = await page.getByTestId(`shop-product-art-${item.id}`).boundingBox();
            for (const label of ['Ver productos anteriores', 'Ver productos siguientes']) {
              const arrow = await button(page, label).boundingBox();
              assert.ok(Math.min(art.x + art.width, arrow.x + arrow.width) - Math.max(art.x, arrow.x) <= 1 || Math.min(art.y + art.height, arrow.y + arrow.height) - Math.max(art.y, arrow.y) <= 1, `${item.id} must not overlap paging arrows`);
            }
          }
          await page.screenshot({ path: `${output}/${viewport.width}-${category.id}-${index + 1}.png` });
          if (viewport.width === 844) for (const item of visible) {
            await button(page, `Comprar ${item.name}`).click();
            await page.getByText('¡Comprado!', { exact: true }).waitFor();
            assert.ok((await saved(page)).ownedItems.includes(item.id));
            const ownedButton = page.getByTestId(`shop-product-${item.id}`).getByRole('button');
            await ownedButton.getByText('¡Tuyo!', { exact: true }).waitFor();
            assert.equal(await ownedButton.isDisabled(), true, 'Purchase confirmation blocks accidental double-tap use');
            await page.waitForFunction(id => document.querySelector(`[data-testid="shop-product-${id}"] [role="button"]`)?.getAttribute('aria-disabled') !== 'true', item.id);
          }
          assert.equal(await button(page, 'Ver productos siguientes').isDisabled(), index === pages - 1);
          if (index < pages - 1) await button(page, 'Ver productos siguientes').click();
        }
        if (pages > 1) {
          await button(page, 'Ver productos anteriores').click();
          await page.getByText(`${pages - 1} de ${pages}`, { exact: true }).waitFor();
        }
        await button(page, 'Volver a la tienda').click();
        await button(page, 'Abrir Sombreros').waitFor();
      }
    }
    assert.equal((await saved(page)).coins, 7, 'Test currency must preserve the saved balance');
    assert.equal((await saved(page)).ownedItems.length, shopItems.length);
    assert.equal(new Set((await saved(page)).ownedItems).size, shopItems.length);
    // Owned items lead directly to the activity that uses them.
    for (const [categoryId, action] of [['hats', 'Vestir'], ['cat-toys', 'Jugar'], ['furniture', 'Colocar'], ['pets', 'Al corral'], ['flowers', 'Cuidar']]) {
      const category = shopCategories.find(c => c.id === categoryId);
      const item = shopItems.find(i => i.category === categoryId);
      await button(page, `Abrir ${category.label}`).click();
      await button(page, `${action} ${item.name}`).click();
      await button(page, 'Volver a la tienda').waitFor({ state: 'hidden' });
      const progress = await saved(page);
      if (categoryId === 'hats') assert.equal(progress.equippedCatItems[item.slot], item.id);
      if (categoryId === 'furniture') assert.ok(progress.placedFurnitureIds.includes(item.id));
      if (categoryId === 'pets') assert.ok(progress.placedAnimalIds.includes(item.id));
      if (categoryId === 'cat-toys') {
        await button(page, 'Atrapar ovillo').waitFor();
        await button(page, 'Volver').click();
        await button(page, 'Volver a la tienda').click();
      } else await button(page, 'Tienda').click();
      await button(page, 'Abrir Sombreros').waitFor();
    }
    await page.reload();
    await button(page, 'Aventuras').waitFor({ timeout: 90000 });
    assert.equal((await saved(page)).ownedItems.length, shopItems.length);
    assert.equal((await saved(page)).coins, 7);
    assert.deepEqual(errors, []);
    fs.writeFileSync(`${output}/report.json`, JSON.stringify({ items: shopItems.length, categories: shopCategories.length, errors }, null, 2));
    console.log(`Shop passed: ${shopItems.length} products, ${shopCategories.length} object categories, two landscape sizes, all purchases, pagination, return arrows, owned actions and persistence.`);
  } finally { await browser.close(); }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
