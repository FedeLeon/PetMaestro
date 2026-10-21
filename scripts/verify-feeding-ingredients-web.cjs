const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');
const { kitchenFoods } = require('./load-game-data.cjs');
const button = (page, name) => page.getByRole('button', { name, exact: true });
const output = '/tmp/petmaestro-feeding-ingredients';
async function run() {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  try {
    for (const viewport of [{ width: 1280, height: 720 }, { width: 844, height: 390 }]) {
      const page = await browser.newPage({ viewport });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.addInitScript(foods => {
        if (!localStorage.getItem('petmaestro.progress.v1')) localStorage.setItem('petmaestro.progress.v1', JSON.stringify({ coins: 7, unlockedFoodIds: foods.map(f => f.id), needsUpdatedAt: Date.now() }));
      }, kitchenFoods);
      await page.goto(process.env.GAME_URL || 'http://localhost:8087');
      await page.getByRole('button', { name: /^Hambre:/ }).waitFor({ timeout: 90000 });
      await page.getByRole('button', { name: /^Hambre:/ }).click();
      const allIds = ['carrot', 'potato', 'peas'];
      for (const total of [1, 2, 3]) {
        const ids = allIds.slice(0, total);
        await button(page, 'Preparar comida').click();
        for (const id of ids) await button(page, `Elegir ${kitchenFoods.find(f => f.id === id).name}`).click();
        await button(page, 'Cocinar').click();
        for (const id of ids) await page.getByTestId(`drag-food-${id}`).click();
        await button(page, 'Soplar (0/3)').waitFor();
        assert.equal(await page.getByTestId('cooking-soup').count(), 1);
        for (let i = 0; i < 3; i++) await button(page, `Soplar (${i}/3)`).click();
        await button(page, 'Servir al gato').click();
        const bowl = page.getByTestId('feeding-bowl-ingredients');
        await bowl.waitFor();
        const contents = () => bowl.locator('[aria-label^="Ingrediente "]').evaluateAll(elements => elements.map(el => el.getAttribute('aria-label').replace('Ingrediente ', '')));
        assert.deepEqual(await contents(), ids);
        const stage = await page.getByTestId('feeding-stage').boundingBox();
        // Loading the spoon temporarily removes only that food. Dropping it
        // away from the mouth restores it without consuming a bite.
        await page.mouse.move(stage.x + stage.width * .445, stage.y + stage.height * .83);
        await page.mouse.down();
        await page.mouse.move(stage.x + stage.width * .7, stage.y + stage.height * .65, { steps: 12 });
        await page.getByTestId('feeding-spoon-food').waitFor();
        assert.deepEqual(await contents(), ids.slice(1));
        assert.equal(await page.getByTestId('feeding-spoon-food').getAttribute('aria-label'), 'Cucharada de Zanahoria');
        await page.mouse.up();
        assert.deepEqual(await contents(), ids);
        await page.getByLabel(`Cucharadas: 0 de ${total}`, { exact: true }).waitFor();
        for (let bite = 0; bite < total; bite++) {
          const remainingPositions = {};
          for (const id of ids.slice(bite + 1)) remainingPositions[id] = await bowl.getByLabel(`Ingrediente ${id}`, { exact: true }).boundingBox();
          if (bite === 2) {
            await page.mouse.move(stage.x + stage.width * .445, stage.y + stage.height * .83);
            await page.mouse.down();
            await page.mouse.move(stage.x + stage.width * .445, stage.y + stage.height * .455, { steps: 15 });
            await page.mouse.up();
          } else {
            await button(page, bite === 0 ? 'Dar cucharada desde el plato' : 'Dar una cucharada').click();
            await page.getByTestId('feeding-spoon-food').waitFor();
            assert.equal(await page.getByTestId('feeding-spoon-food').getAttribute('aria-label'), `Cucharada de ${kitchenFoods.find(f => f.id === ids[bite]).name}`);
          }
          assert.deepEqual(await contents(), ids.slice(bite + 1), 'Only the food on the spoon disappears');
          for (const [id, before] of Object.entries(remainingPositions)) {
            const after = await bowl.getByLabel(`Ingrediente ${id}`, { exact: true }).boundingBox();
            assert.ok(Math.abs(after.x - before.x) < 1 && Math.abs(after.y - before.y) < 1 && Math.abs(after.width - before.width) < 1, 'Remaining foods keep their position and size');
          }
          await page.getByLabel(`Cucharadas: ${bite + 1} de ${total}`, { exact: true }).waitFor();
          await page.screenshot({ path: `${output}/${total}-foods-${bite + 1}-eaten-${viewport.width}.png` });
        }
        await button(page, 'Terminar comida').waitFor();
        assert.deepEqual(await contents(), []);
        const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('petmaestro.progress.v1')));
        assert.equal(saved.learning.counts.meal, total, 'Exactly one reward per finished meal');
        assert.equal(saved.coins, 7 + total * 8);
        await button(page, 'Terminar comida').click();
      }
      assert.deepEqual(errors, []);
      console.log(`Individual foods consumed correctly for 1, 2 and 3 foods at ${viewport.width}x${viewport.height}; spoon, plate, drag, cancellation and one meal reward passed.`);
      await page.close();
    }
  } finally { await browser.close(); }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
