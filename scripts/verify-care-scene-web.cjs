const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');
const output = process.env.REVIEW_OUTPUT || '/tmp/petmaestro-care-scene';
const button = (page, name) => page.getByRole('button', { name, exact: true });
const saved = page => page.evaluate(() => JSON.parse(localStorage.getItem('petmaestro.progress.v1')));
async function tapPoint(page, id, x, y, times = 1) {
  const rect = await page.getByTestId(id).boundingBox();
  for (let i = 0; i < times; i++) { await page.mouse.click(rect.x + rect.width * x, rect.y + rect.height * y); await page.waitForTimeout(40); }
}
async function toolsFit(page, names, viewport) {
  await button(page, names[0]).waitFor();
  const rect = await page.getByTestId('care-scene-canvas').boundingBox();
  for (const name of names) {
    const tool = await button(page, name).boundingBox();
    assert.ok(tool.width >= 44 && tool.height >= 44, `${name}: large touch target`);
    assert.ok(tool.x >= rect.x - 1 && tool.x + tool.width <= rect.x + rect.width + 1 && tool.y >= rect.y - 1 && tool.y + tool.height <= rect.y + rect.height + 1, `${name}: directly on the illustrated scene`);
    assert.ok(tool.y + tool.height <= viewport.height - 94, `${name}: clear of footer`);
  }
}
async function run() {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  const report = [];
  try {
    for (const viewport of [{ width: 844, height: 390 }, { width: 1280, height: 720 }]) {
      const page = await browser.newPage({ viewport });
      page.setDefaultTimeout(15000);
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      await page.addInitScript(() => {
        if (!localStorage.getItem('petmaestro.progress.v1')) localStorage.setItem('petmaestro.progress.v1', JSON.stringify({ coins: 7, needs: { hunger: 10, hygiene: 10, bathroom: 10, energy: 50, play: 50 }, needsUpdatedAt: Date.now() }));
      });
      await page.goto(process.env.GAME_URL || 'http://localhost:8087');
      await page.getByRole('button', { name: /^Higiene:/ }).waitFor({ timeout: 90000 });
      await page.getByRole('button', { name: /^Higiene:/ }).click();
      await button(page, 'Lavarse los dientes').click();
      await toolsFit(page, ['Poner pasta dental en el cepillo', 'Activar cepillo de dientes'], viewport);
      await page.screenshot({ path: `${output}/teeth-tools-${viewport.width}.png` });
      // Toothpaste prepares and activates the brush in one step; no second menu action.
      await button(page, 'Poner pasta dental en el cepillo').click();
      for (const [x, y] of [[.250,.686],[.272,.698],[.297,.707],[.327,.707],[.363,.707],[.395,.700],[.418,.690],[.438,.678]]) await tapPoint(page, 'tooth-stage', x, y, 4);
      await page.getByText('¡Dientes brillantes!', { exact: true }).waitFor();
      assert.equal((await saved(page)).learning.counts.wash, 1);
      await page.screenshot({ path: `${output}/teeth-done-${viewport.width}.png` });
      await button(page, '¡Listo!').click();
      await button(page, 'Bañarse').click();
      await toolsFit(page, ['Jabón', 'Ducha', 'Toalla'], viewport);
      await page.screenshot({ path: `${output}/shower-tools-${viewport.width}.png` });
      // Soap, rinse and towel become ready automatically. Only touch the cat.
      for (let phase = 0; phase < 3; phase++) {
        for (const [x, y] of [[.28,.49],[.44,.49],[.32,.64],[.4,.68],[.31,.84],[.42,.85]]) await tapPoint(page, 'shower-stage', x, y);
      }
      await page.getByText('¡Limpito y seco!', { exact: true }).waitFor();
      assert.equal((await saved(page)).learning.counts.wash, 2);
      await button(page, '¡Listo!').click();
      await button(page, 'Usar inodoro').click();
      await toolsFit(page, ['Levantar la tapa del inodoro'], viewport);
      await button(page, 'Levantar la tapa del inodoro').click();
      await page.getByText('Arrastrá al gatito hasta el asiento', { exact: true }).waitFor();
      const toilet = await page.getByTestId('toilet-stage').boundingBox();
      await page.mouse.move(toilet.x + toilet.width * .72, toilet.y + toilet.height * .66);
      await page.mouse.down();
      await page.mouse.move(toilet.x + toilet.width * .35, toilet.y + toilet.height * .62, { steps: 16 });
      await page.mouse.up();
      await button(page, 'Tirar de la cadena').waitFor();
      await toolsFit(page, ['Tirar de la cadena'], viewport);
      await page.screenshot({ path: `${output}/toilet-chain-${viewport.width}.png` });
      await button(page, 'Tirar de la cadena').click();
      await page.getByTestId('washing-paw-0').waitFor();
      // Washing is already enabled after flushing; no tool selection required.
      for (const x of [.31, .48]) await tapPoint(page, 'toilet-stage', x, .595, 6);
      await page.getByText('¡Muy bien! Todo limpio', { exact: true }).waitFor();
      const afterBathroom = await saved(page);
      assert.equal(afterBathroom.learning.counts.wash, 3);
      assert.ok(afterBathroom.needs.hygiene >= 94 && afterBathroom.needs.bathroom >= 79);
      await page.screenshot({ path: `${output}/toilet-done-${viewport.width}.png` });
      await button(page, '¡Listo!').click();
      await button(page, 'Casa').click();
      await page.getByRole('button', { name: /^Hambre:/ }).click();
      await button(page, 'Dar de comer').click();
      await toolsFit(page, ['Comprar Zanahoria por 8 monedas', 'Cocinar'], viewport);
      await button(page, 'Comprar Zanahoria por 8 monedas').click();
      await page.screenshot({ path: `${output}/fridge-${viewport.width}.png` });
      await button(page, 'Cocinar').click();
      const food = await page.getByTestId('drag-food-carrot').boundingBox();
      const scene = await page.getByTestId('cooking-stage').boundingBox();
      assert.ok(food.x >= scene.x && food.x + food.width <= scene.x + scene.width && food.y >= scene.y && food.y + food.height <= scene.y + scene.height + 1, 'Ingredient sits directly on the counter');
      await page.getByTestId('drag-food-carrot').click();
      await toolsFit(page, ['Soplar (0/3)'], viewport);
      assert.equal(await page.getByTestId('cooking-soup').count(), 1);
      await page.screenshot({ path: `${output}/cooking-${viewport.width}.png` });
      for (let i = 0; i < 3; i++) await button(page, `Soplar (${i}/3)`).click();
      await button(page, 'Servir al gato').click();
      await toolsFit(page, ['Dar cucharada desde el plato', 'Dar una cucharada'], viewport);
      await page.screenshot({ path: `${output}/feeding-${viewport.width}.png` });
      await button(page, 'Dar cucharada desde el plato').click();
      await button(page, 'Terminar comida').waitFor();
      assert.equal((await saved(page)).learning.counts.meal, 1);
      assert.equal((await saved(page)).needs.hunger, 20);
      assert.equal((await saved(page)).coins, 30);
      await page.screenshot({ path: `${output}/feeding-done-${viewport.width}.png` });
      await button(page, 'Terminar comida').click();
      assert.deepEqual(errors, []);
      report.push({ viewport, errors, progress: await saved(page) });
      await page.close();
      console.log(`Direct scene care passed at ${viewport.width}×${viewport.height}: tap-only teeth/shower/paws, chain, ingredients, spoon, feeding, target sizes, needs and single mission counts.`);
    }
    fs.writeFileSync(`${output}/report.json`, JSON.stringify(report, null, 2));
  } finally { await browser.close(); }
}
run().catch(e => { console.error(e); process.exitCode = 1; });
