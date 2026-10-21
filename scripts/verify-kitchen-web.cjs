const assert = require('node:assert/strict');
const fs = require('node:fs');
const { createHash } = require('node:crypto');
const { chromium } = require('playwright');
const { mealNutrition, shopItems, houseImages } = require('./load-game-data.cjs');
const output = process.env.REVIEW_OUTPUT || '/tmp/petmaestro-kitchen';
const button = (page, name) => page.getByRole('button', { name, exact: true });
const saved = page => page.evaluate(() => JSON.parse(localStorage.getItem('petmaestro.progress.v1')));
async function run() {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  try {
    const page = await browser.newPage({ viewport: { width: 844, height: 390 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(() => {
      if (!localStorage.getItem('petmaestro.progress.v1')) localStorage.setItem('petmaestro.progress.v1', JSON.stringify({ coins: 7, needs: { hunger: 20, hygiene: 50, bathroom: 50, play: 50, energy: 50 }, needsUpdatedAt: Date.now() }));
    });
    const capture = async name => { await page.waitForTimeout(250); await page.screenshot({ path: `${output}/${name}.png` }); };
    const primaryFits = async name => {
      const rect = await button(page, name).boundingBox();
      assert.ok(rect.y >= 0 && rect.y + rect.height <= 296, `${name} must remain above the footer`);
    };
    const dragIngredient = async (id, nx, ny) => {
      const card = await page.getByTestId(`drag-food-${id}`).boundingBox();
      const stage = await page.getByTestId('cooking-stage').boundingBox();
      await page.mouse.move(card.x + card.width / 2, card.y + card.height / 2);
      await page.mouse.down();
      await page.mouse.move(stage.x + stage.width * nx, stage.y + stage.height * ny, { steps: 12 });
      await page.mouse.up();
    };
    const fillAndCool = async () => {
      await button(page, 'Soplar (0/3)').waitFor();
      assert.equal(await page.getByTestId('cooking-soup').count(), 1);
      await capture('cool');
      for (let index = 0; index < 3; index++) { await primaryFits(`Soplar (${index}/3)`); await button(page, `Soplar (${index}/3)`).click(); }
      await primaryFits('Servir al gato');
      await button(page, 'Servir al gato').click();
    };
    await page.goto(process.env.GAME_URL || 'http://localhost:8087');
    await button(page, 'Mapa').waitFor({ timeout: 90000 });
    await page.getByRole('button', { name: /^Hambre:/ }).click();
    await button(page, 'Preparar comida').click();
    await capture('fridge');
    assert.equal(await button(page, 'Cocinar').isDisabled(), true);
    for (const name of ['Zanahoria por 8', 'Papa por 12', 'Arvejas por 18']) await button(page, `Comprar ${name} monedas`).click();
    await button(page, 'Comprar Arroz por 15 monedas').click();
    assert.equal((await saved(page)).unlockedFoodIds.includes('rice'), false, 'Fourth food must not be purchased');
    await button(page, 'Elegir Papa').click();
    await button(page, 'Comprar Arroz por 15 monedas').click();
    assert.equal((await saved(page)).coins, 7, 'Infinite food purchases preserve the real balance');
    await primaryFits('Cocinar');
    await capture('selected');
    await button(page, 'Cocinar').click();
    await capture('add');
    await page.getByTestId('drag-food-carrot').click();
    await dragIngredient('peas', .05, .9);
    assert.equal(await page.getByTestId('drag-food-peas').getAttribute('aria-label'), 'Agregar Arvejas', 'Dropping outside must not consume an ingredient');
    await dragIngredient('peas', .445, .48);
    await page.getByTestId('drag-food-rice').click();
    await fillAndCool();
    await capture('feed');
    // Preserve the original gesture, alongside the two easier tap routes.
    const stage = await page.getByTestId('feeding-stage').boundingBox();
    await page.mouse.move(stage.x + stage.width * .445, stage.y + stage.height * .83);
    await page.mouse.down();
    await page.mouse.move(stage.x + stage.width * .445, stage.y + stage.height * .455, { steps: 15 });
    await page.mouse.up();
    await page.getByLabel('Cucharadas: 1 de 3', { exact: true }).waitFor();
    await button(page, 'Dar cucharada desde el plato').click();
    await page.getByLabel('Cucharadas: 2 de 3', { exact: true }).waitFor();
    await button(page, 'Dar una cucharada').click();
    await button(page, 'Terminar comida').waitFor();
    await capture('done');
    const nutrition = mealNutrition(['carrot', 'peas', 'rice']);
    assert.equal((await saved(page)).needs.hunger, 20 + nutrition);
    assert.equal((await saved(page)).learning.counts.meal, 1);
    await button(page, 'Terminar comida').click();
    // A cancelled last spoonful must not award a meal on a hidden screen.
    await button(page, 'Preparar comida').click();
    await button(page, 'Elegir Zanahoria').click();
    await button(page, 'Cocinar').click();
    await page.getByTestId('drag-food-carrot').click();
    await fillAndCool();
    await page.getByLabel('Cucharadas: 0 de 1', { exact: true }).waitFor();
    await button(page, 'Dar una cucharada').click();
    await button(page, 'Volver a la cocina').click();
    await button(page, 'Tienda').click();
    await page.waitForTimeout(1800);
    assert.equal((await saved(page)).learning.counts.meal, 1, 'Leaving must cancel pending feeding rewards');
    await button(page, 'Tienda').click();
    await button(page, 'Abrir Sombreros').click();
    const hat = shopItems.find(item => item.category === 'hats');
    await button(page, `Comprar ${hat.name}`).click();
    assert.equal((await saved(page)).coins, 18, 'Two cooked meals and one finished feeding award eleven coins; purchases preserve balance');
    await button(page, 'Casa').click();
    await page.getByTestId('interior-door-outside').click();
    for (const width of [844, 1280]) {
      await page.setViewportSize({ width, height: width === 844 ? 390 : 720 });
      await capture(`barn-${width}`);
      assert.equal(await page.getByTestId('exterior-barn').count(), 0, 'Decorative barn must be part of the background, without a separate layer');
      const background = page.getByTestId('exterior-background');
      assert.ok(houseImages.exteriorWide.includes('exterior-yard-barn-v2'));
      const actualHash = await background.locator('img').first().evaluate(async img => {
        const bytes = await (await fetch(img.src)).arrayBuffer();
        return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), byte => byte.toString(16).padStart(2, '0')).join('');
      });
      assert.equal(actualHash, createHash('sha256').update(fs.readFileSync(houseImages.exteriorWide)).digest('hex'), 'Rendered exterior must use the integrated barn panorama, including preloaded blob URLs');
      const panorama = await background.boundingBox();
      const yard = await page.getByTestId('exterior-scene').boundingBox();
      assert.ok(panorama.x + panorama.width * .965 <= yard.x + yard.width, 'Painted barn must fit the initial horizontal view');
    }
    await page.reload();
    await button(page, 'Mapa').waitFor({ timeout: 90000 });
    assert.equal((await saved(page)).coins, 18);
    assert.ok((await saved(page)).ownedItems.includes(hat.id));
    assert.deepEqual(errors, []);
    fs.writeFileSync(`${output}/report.json`, JSON.stringify({ errors, progress: await saved(page) }, null, 2));
    console.log('Kitchen: selection cap, taps and drags, soup filling, cooling, three feeding routes, cancellation, one reward, infinite food/shop purchases, barn and persistence passed.');
  } finally { await browser.close(); }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
