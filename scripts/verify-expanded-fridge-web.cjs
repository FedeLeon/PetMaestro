const { BOTTOM_MENU_HEIGHT } = require('../src/styles/layout.ts');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');
const { kitchenFoods, mealNutrition } = require('./load-game-data.cjs');
const output = process.env.REVIEW_OUTPUT || '/tmp/petmaestro-expanded-fridge';
const button = (page, name) => page.getByRole('button', { name, exact: true });
const saved = page => page.evaluate(() => JSON.parse(localStorage.getItem('petmaestro.progress.v1')));
async function choose(page, id) {
  const food = kitchenFoods.find(f => f.id === id);
  const owned = (await saved(page)).unlockedFoodIds?.includes(id);
  await button(page, `${owned ? 'Elegir' : 'Comprar'} ${food.name}${owned ? '' : ` por ${food.price} monedas`}`).click();
}
async function finishMeal(page, ids) {
  await button(page, 'Cocinar').click();
  for (const id of ids) await page.getByTestId(`drag-food-${id}`).click();
  await button(page, 'Encender cocina').click();
  for (let i = 0; i < 5; i++) await button(page, 'Revolver').click();
  for (let i = 0; i < 3; i++) await button(page, `Soplar (${i}/3)`).click();
  await button(page, 'Servir al gato').click();
  for (let i = 0; i < ids.length; i++) await button(page, 'Dar cucharada desde el plato').click();
  await button(page, 'Terminar comida').click();
}
async function run() {
  assert.equal(kitchenFoods.length, 18);
  assert.equal(new Set(kitchenFoods.map(f => f.id)).size, 18);
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  try {
    for (const viewport of [{ width: 844, height: 390 }, { width: 1280, height: 720 }]) {
      const page = await browser.newPage({ viewport });
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      page.setDefaultTimeout(15000);
      await page.addInitScript(() => { if (!localStorage.getItem('petmaestro.progress.v1')) localStorage.setItem('petmaestro.progress.v1', JSON.stringify({ coins: 7, needs: { hunger: 10 }, needsUpdatedAt: Date.now() })); });
      await page.goto(process.env.GAME_URL || 'http://localhost:8087');
      await page.getByRole('button', { name: /^Hambre:/ }).waitFor({ timeout: 90000 });
      await page.getByRole('button', { name: /^Hambre:/ }).click();
      await button(page, 'Preparar comida').click();
      assert.equal(await button(page, 'Alimentos anteriores').isDisabled(), true);
      for (let i = 0; i < 3; i++) {
        await page.getByLabel(`Alimentos: página ${i + 1} de 3`, { exact: true }).waitFor();
        const foods = page.getByRole('button', { name: /^(Comprar .+ por \d+ monedas|Elegir .+)$/ });
        assert.equal(await foods.count(), 6, 'Exactly six ingredients per page');
        for (const food of await foods.all()) {
          const r = await food.boundingBox();
          assert.ok(r.width >= 44 && r.height >= 44 && r.y + r.height <= viewport.height - (viewport.width <= 1000 ? 0 : BOTTOM_MENU_HEIGHT));
        }
        await page.screenshot({ path: `${output}/fridge-page-${i + 1}-${viewport.width}.png` });
        if (i < 2) await button(page, 'Más alimentos').click();
      }
      assert.equal(await button(page, 'Más alimentos').isDisabled(), true);
      await button(page, 'Alimentos anteriores').click();
      await button(page, 'Alimentos anteriores').click();
      await choose(page, 'carrot');
      await button(page, 'Más alimentos').click();
      await choose(page, 'pumpkin'); await choose(page, 'broccoli');
      await choose(page, 'corn');
      assert.ok(!(await saved(page)).unlockedFoodIds.includes('corn'), 'Fourth food is not bought across pages');
      await button(page, 'Alimentos anteriores').click();
      assert.equal(await button(page, 'Elegir Zanahoria').getAttribute('aria-pressed'), 'true');
      await choose(page, 'carrot');
      await button(page, 'Más alimentos').click();
      await choose(page, 'corn');
      await finishMeal(page, ['pumpkin', 'broccoli', 'corn']);
      await button(page, 'Preparar comida').click();
      await button(page, 'Más alimentos').click();
      for (const id of ['sweet-potato', 'egg', 'cheese']) await choose(page, id);
      await finishMeal(page, ['sweet-potato', 'egg', 'cheese']);
      const newMeals = [['tomato', 'pasta', 'spinach'], ['zucchini', 'mushrooms', 'lentils']];
      for (const [index, ids] of newMeals.entries()) {
        await button(page, 'Preparar comida').click();
        await button(page, 'Más alimentos').click();
        await button(page, 'Más alimentos').click();
        for (const id of ids) await choose(page, id);
        if (!index) {
          await choose(page, 'zucchini');
          assert.ok(!(await saved(page)).unlockedFoodIds.includes('zucchini'), 'Fourth ingredient on page three is not purchased');
          await button(page, 'Alimentos anteriores').click();
          await choose(page, 'cheese');
          assert.notEqual(await button(page, 'Elegir Queso').getAttribute('aria-pressed'), 'true', 'Page-two ingredient cannot exceed the shared selection cap');
          await button(page, 'Más alimentos').click();
          for (const id of ids) assert.equal(await button(page, `Elegir ${kitchenFoods.find(f => f.id === id).name}`).getAttribute('aria-pressed'), 'true', 'Third-page choices survive changing pages');
        }
        await finishMeal(page, ids);
      }
      const result = await saved(page);
      for (const id of kitchenFoods.slice(6).map(f => f.id)) assert.ok(result.unlockedFoodIds.includes(id));
      assert.equal(result.learning.counts.meal, 4);
      assert.equal(result.coins, 7 + result.learning.counts.meal * 8);
      assert.ok(result.needs.hunger >= Math.min(100, 10 + mealNutrition(['pumpkin', 'broccoli', 'corn']) + mealNutrition(['sweet-potato', 'egg', 'cheese']) + newMeals.reduce((total, ids) => total + mealNutrition(ids), 0)) - 2);
      await page.reload();
      await button(page, 'Casa').waitFor({ timeout: 90000 });
      assert.ok((await saved(page)).unlockedFoodIds.includes('cheese'));
      for (const id of newMeals.flat()) assert.ok((await saved(page)).unlockedFoodIds.includes(id), 'New foods survive reload');
      assert.deepEqual(errors, []);
      await page.close();
      console.log(`Expanded fridge passed ${viewport.width}×${viewport.height}: eighteen foods, three pages, retained selection, cross-page cap, all twelve added ingredients cooked/fed, nutrition, rewards and persistence.`);
    }
  } finally { await browser.close(); }
}
run().catch(e => { console.error(e); process.exitCode = 1; });
