const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');
const { shopItems, shopCategories } = require('./load-game-data.cjs');
const { animalPettingProfiles } = require('../src/data/animalPetting.ts');
const output = process.env.REVIEW_OUTPUT || '/tmp/petmaestro-petting';
const button = (page, name) => page.getByRole('button', { name, exact: true });
const saved = page => page.evaluate(() => JSON.parse(localStorage.getItem('petmaestro.progress.v1')));
async function run() {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  const results = [];
  try {
    for (const viewport of [{ width: 1280, height: 720 }, { width: 844, height: 390 }]) {
      const page = await browser.newPage({ viewport, reducedMotion: 'no-preference' });
      page.setDefaultTimeout(12000);
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.addInitScript(items => {
        if (!localStorage.getItem('petmaestro.progress.v1')) localStorage.setItem('petmaestro.progress.v1', JSON.stringify({ coins: 7, ownedItems: items.map(i => i.id), placedAnimalIds: items.filter(i => i.target === 'yard').map(i => i.id), needsUpdatedAt: Date.now() }));
      }, shopItems);
      await page.goto(process.env.GAME_URL || 'http://localhost:8087');
      await button(page, 'Mascota').waitFor({ timeout: 90000 });
      await button(page, 'Mascota').click();
      const clothes = shopItems.filter(i => i.target === 'cat');
      for (const category of shopCategories) {
        const items = clothes.filter(i => i.category === category.id);
        const boxes = [];
        for (const item of items) {
          const card = button(page, `Usar ${item.name}`);
          const rect = await card.boundingBox();
          assert.ok(Math.abs(rect.width - rect.height) < 1, `Square wardrobe card: ${item.id}`);
          assert.ok(rect.width >= 44);
          boxes.push(rect);
        }
        for (let i = 0; i < boxes.length; i += 2) {
          if (boxes[i + 1]) assert.ok(Math.abs(boxes[i].y - boxes[i + 1].y) < 1 && boxes[i + 1].x >= boxes[i].x + boxes[i].width, 'Two wardrobe objects per row');
          if (boxes[i + 2]) assert.ok(boxes[i + 2].y >= boxes[i].y + boxes[i].height, 'Separate wardrobe rows');
        }
      }
      const hat = clothes.find(i => i.slot === 'head');
      const shirt = clothes.find(i => i.slot === 'body');
      for (const item of [hat, shirt]) {
        await button(page, `Usar ${item.name}`).click();
        assert.equal((await saved(page)).equippedCatItems[item.slot], item.id);
      }
      await button(page, `Usar ${hat.name}`).click();
      assert.ok(!(await saved(page)).equippedCatItems.head);
      await button(page, `Usar ${hat.name}`).click();
      await page.screenshot({ path: `${output}/wardrobe-${viewport.width}.png` });
      await button(page, `Usar ${clothes.at(-1).name}`).scrollIntoViewIfNeeded();
      await button(page, 'Casa').click();
      await page.getByTestId('interior-door-outside').click();
      const contacts = [];
      const animals = shopItems.filter(i => i.target === 'yard');
      for (const animal of animals) {
        const touch = button(page, `Acariciar ${animal.name}`);
        const rect = await touch.boundingBox();
        assert.ok(rect.width >= 44 && rect.height >= 44, 'Animal touch target');
        await touch.click();
        await page.getByTestId(`animal-affection-${animal.id}`).waitFor();
        await page.waitForTimeout(500);
        assert.equal(await page.locator('[data-testid^="animal-affection-"]').count(), 1, 'Only the selected animal receives affection');
        const profile = animalPettingProfiles[animal.id];
        const distance = await page.getByTestId('exterior-scene').evaluate((scene, data) => {
          const arm = scene.querySelector('[data-testid="cat-arm-right"]');
          const animal = scene.querySelector(`[data-testid="farm-rig-${data.id}"]`);
          const paw = new DOMPoint(154, 160).matrixTransform(arm.getScreenCTM());
          const target = new DOMPoint(data.x * 1000, data.y * 1000).matrixTransform(animal.getScreenCTM());
          return Math.hypot(paw.x - target.x, paw.y - target.y);
        }, { id: animal.id, ...profile.contact });
        assert.ok(distance < 12, `Paw must touch ${animal.id}, error=${distance.toFixed(2)}px`);
        contacts.push({ id: animal.id, distance });
        const arm = page.getByTestId('exterior-scene').getByTestId('cat-arm-right');
        const before = await arm.getAttribute('transform');
        await page.waitForTimeout(180);
        assert.notEqual(await arm.getAttribute('transform'), before, 'Stroking paw must move');
        await page.screenshot({ path: `${output}/${animal.id}-${viewport.width}.png` });
        await page.getByTestId(`animal-affection-${animal.id}`).waitFor({ state: 'detached' });
      }
      await page.locator('[data-testid^="animal-affection-"]').waitFor({ state: 'detached' });
      assert.equal((await saved(page)).coins, 7 + animals.length * 2, 'Every completed petting gives two coins');
      assert.equal((await saved(page)).ownedItems.length, shopItems.length);
      assert.equal((await saved(page)).equippedCatItems.head, hat.id, 'Keep clothes during affection');
      await button(page, 'Acariciar Vaquita').click();
      await button(page, 'Colocar Vaquita').click();
      await page.getByTestId('animal-petting-status').waitFor({ state: 'detached' });
      await page.waitForTimeout(2800);
      assert.equal(await page.locator('[data-testid^="animal-affection-"]').count(), 0, 'Removed animals cannot receive a late arrival');
      await button(page, 'Colocar Vaquita').click();
      await button(page, 'Acariciar Conejito').click();
      await page.getByTestId('animal-affection-farm-rabbit').waitFor();
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.waitForTimeout(150);
      const arm = page.getByTestId('exterior-scene').getByTestId('cat-arm-right');
      const still = await arm.getAttribute('transform');
      await page.waitForTimeout(250);
      assert.equal(await arm.getAttribute('transform'), still);
      await button(page, 'Regar Margaritas').click();
      await page.getByTestId('garden-watering').waitFor();
      assert.equal(await page.locator('[data-testid^="animal-affection-"]').count(), 0, 'Watering interrupts affection');
      await page.getByTestId('garden-watering').waitFor({ state: 'detached' });
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await button(page, 'Acariciar Cerdito').click();
      await page.getByTestId('animal-affection-farm-pig').waitFor();
      await button(page, 'Mascota').click();
      await page.waitForTimeout(3800);
      assert.equal(await page.locator('[data-testid^="animal-affection-"]').count(), 0, 'Leaving cancels affection');
      await button(page, 'Casa').click();
      await page.getByTestId('interior-door-outside').click();
      await button(page, 'Acariciar Ovejita').click();
      await page.getByTestId('animal-affection-farm-sheep').waitFor();
      const activeScene = button(page, 'Acariciar Ovejita').locator('xpath=ancestor::*[@data-testid="exterior-scene"]');
      const floor = activeScene.getByLabel('Caminar hasta este lugar', { exact: true });
      const box = await floor.boundingBox();
      await floor.click({ position: { x: box.width / 2, y: box.height * .79 } });
      await page.getByTestId('animal-petting-status').waitFor({ state: 'detached' });
      await button(page, 'Entrar a la casa').click();
      await page.getByTestId('interior-door-outside').waitFor();
      assert.deepEqual(errors, []);
      results.push({ viewport, contacts, errors });
      await page.close();
      console.log(`Wardrobe and six petting interactions passed at ${viewport.width}×${viewport.height}.`);
    }
    fs.writeFileSync(`${output}/report.json`, JSON.stringify(results, null, 2));
  } finally { await browser.close(); }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
