const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');
const { shopItems } = require('./load-game-data.cjs');
const items = shopItems.filter(item => item.target === 'cat');
const output = process.env.REVIEW_OUTPUT || '/tmp/petmaestro-wardrobe/after';
const button = (page, name) => page.getByRole('button', { name, exact: true });
async function run() {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(items => {
      if (!localStorage.getItem('petmaestro.progress.v1')) localStorage.setItem('petmaestro.progress.v1', JSON.stringify({ coins: 5000, ownedItems: items.map(item => item.id), needsUpdatedAt: Date.now() }));
    }, items);
    await page.goto(process.env.GAME_URL || 'http://localhost:8087');
    await button(page, 'Mascota').waitFor({ timeout: 90000 });
    await button(page, 'Mascota').click();
    let selected = {};
    const saved = () => page.evaluate(() => {
      const progress = JSON.parse(localStorage.getItem('petmaestro.progress.v1'));
      progress.equippedCatItems = Object.fromEntries(Object.entries(progress.equippedCatItems || {}).filter(([, id]) => id));
      return progress;
    });
    async function equip(item) {
      await button(page, `Usar ${item.name}`).click();
      if (selected[item.slot] === item.id) delete selected[item.slot];
      else selected[item.slot] = item.id;
      assert.deepEqual((await saved()).equippedCatItems, selected);
    }
    for (const item of items) {
      for (const id of Object.values(selected)) await equip(items.find(entry => entry.id === id));
      await equip(item);
      await page.getByTestId('cat-rig').screenshot({ path: `${output}/${item.id}.png` });
    }
    const groups = ['head', 'eyes', 'body', 'bottom', 'feet', 'toy'].map(slot => items.filter(item => item.slot === slot));
    for (let index = 0; index < 8; index++) {
      for (const group of groups) {
        const item = group[index % group.length];
        if (selected[item.slot] !== item.id) await equip(item);
      }
      await page.getByTestId('cat-rig').screenshot({ path: `${output}/outfit-${index}.png` });
    }
    assert.equal((await saved()).coins, 5000, 'Changing owned outfits must not spend coins');
    await page.reload();
    await button(page, 'Mascota').waitFor({ timeout: 90000 });
    await button(page, 'Mascota').click();
    assert.deepEqual((await saved()).equippedCatItems, selected, 'Outfit must survive reload');
    await page.setViewportSize({ width: 844, height: 390 });
    await page.screenshot({ path: `${output}/wardrobe-phone.png` });
    const rig = await page.getByTestId('cat-rig').boundingBox();
    assert.ok(rig.y >= 0 && rig.y + rig.height <= 390 && rig.x >= 0 && rig.x + rig.width <= 844, 'Entire rig must fit landscape phone');
    await page.setViewportSize({ width: 1280, height: 720 });
    await button(page, 'Casa').click();
    const world = page.getByTestId('interior-world');
    const cat = world.getByTestId('pet-cat');
    const leg = world.getByTestId('cat-leg-left');
    await cat.waitFor();
    const idle = await leg.getAttribute('transform');
    await page.mouse.click(850, 550);
    await page.waitForFunction(idle => document.querySelector('[data-testid="interior-world"] [data-testid="cat-leg-left"]')?.getAttribute('transform') !== idle, idle);
    const motion = new Set();
    for (let index = 0; index < 5; index++) {
      await page.waitForTimeout(90);
      motion.add(await leg.getAttribute('transform'));
      const rect = await cat.boundingBox();
      await page.screenshot({ path: `${output}/walking-right-${index}.png`, clip: { x: rect.x - 15, y: rect.y - 40, width: rect.width + 30, height: rect.height + 65 } });
    }
    assert.ok(motion.size >= 3, 'Continuous gait must change while travelling');
    for (const side of ['left', 'right']) {
      const shoe = world.getByTestId(`cat-outfit-${selected.feet}-${side}`);
      assert.equal(await shoe.evaluate(element => element.parentElement.dataset.testid), `cat-leg-${side}`, 'Shoe must share its leg joint');
    }
    await page.mouse.click(450, 550);
    await page.waitForTimeout(300);
    assert.ok(await cat.evaluate(element => getComputedStyle(element.parentElement).transform.includes('-1')), 'Changing direction must mirror the entire clothed cat');
    const rect = await cat.boundingBox();
    await page.screenshot({ path: `${output}/walking-left.png`, clip: { x: rect.x - 15, y: rect.y - 40, width: rect.width + 30, height: rect.height + 65 } });
    await button(page, 'Mascota').click();
    await page.waitForTimeout(250);
    await button(page, 'Casa').click();
    await page.waitForTimeout(200);
    const stopped = await cat.boundingBox();
    assert.equal(await leg.getAttribute('transform'), idle, 'Leaving a scene must stop the gait');
    await page.waitForTimeout(400);
    const still = await cat.boundingBox();
    assert.ok(Math.abs(still.x - stopped.x) < 1 && Math.abs(still.y - stopped.y) < 1, 'Hidden scene must not keep walking');
    assert.deepEqual(errors, []);
    fs.writeFileSync(`${output}/report.json`, JSON.stringify({ individualItems: items.length, combinedOutfits: 8, motionSamples: motion.size, viewports: ['1280x720', '844x390'], persistedOutfit: selected, errors }, null, 2));
    console.log(`Wardrobe: ${items.length} pieces, 8 outfits, persistence, phone landscape, walking in both directions and navigation cancellation passed.`);
  } finally { await browser.close(); }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
