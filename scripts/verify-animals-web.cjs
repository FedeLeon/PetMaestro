const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');
const { shopItems, gardenFlowers } = require('./load-game-data.cjs');
const output = process.env.REVIEW_OUTPUT || '/tmp/petmaestro-animal-motion';
const button = (page, name) => page.getByRole('button', { name, exact: true });
const overlap = (a, b) => Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x) > 1 && Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y) > 1;
async function run() {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, reducedMotion: 'no-preference' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(items => {
      if (!localStorage.getItem('petmaestro.progress.v1')) localStorage.setItem('petmaestro.progress.v1', JSON.stringify({ coins: 7, ownedItems: items.map(i => i.id), placedAnimalIds: items.filter(i => i.target === 'yard').map(i => i.id), needsUpdatedAt: Date.now() }));
    }, shopItems);
    await page.goto(process.env.GAME_URL || 'http://localhost:8087');
    await button(page, 'Casa').waitFor({ timeout: 90000 });
    // Enter through the garden shortcut so the route explicitly targets the
    // exterior; returning to a generic Casa route deliberately opens indoors.
    await button(page, 'Tienda').click();
    await button(page, 'Abrir Flores').click();
    await button(page, 'Cuidar Margaritas').click();
    await page.getByTestId('farm-motion-farm-cow').waitFor({ state: 'attached' });
    const samples = await page.evaluate(async () => {
      const motion = [...document.querySelectorAll('[data-testid^="farm-motion-"]')];
      const parts = [...document.querySelectorAll('[data-testid^="farm-part-"]')];
      const eyes = [...document.querySelectorAll('[data-testid^="farm-blink-"]')];
      const all = [...motion, ...parts, ...eyes];
      const values = new Map(all.map(el => [el, new Set()]));
      const counts = new Map(all.map(el => [el, 0]));
      const observer = new MutationObserver(records => {
        for (const { target } of records) if (values.has(target)) {
          values.get(target).add(target.getAttribute('transform') || target.getAttribute('opacity'));
          counts.set(target, counts.get(target) + 1);
        }
      });
      observer.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['transform', 'opacity'] });
      await new Promise(resolve => setTimeout(resolve, 14000));
      observer.disconnect();
      return all.map(el => ({ id: el.getAttribute('data-testid'), unique: values.get(el).size, updates: counts.get(el) }));
    });
    for (const sample of samples) assert.ok(sample.unique >= 3, `Part must animate continuously: ${JSON.stringify(sample)}`);
    for (const sample of samples.filter(s => s.id.startsWith('farm-motion-'))) assert.ok(sample.updates > 150, 'Continuous rendering must replace the old 260 ms pose switches');
    const animalIds = shopItems.filter(i => i.target === 'yard').map(i => i.id);
    for (const viewport of [{ width: 1280, height: 720 }, { width: 844, height: 390 }]) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(200);
      const boxes = [];
      for (const id of animalIds) {
        const rect = await page.getByTestId(`exterior-animal-${id}`).boundingBox();
        for (const previous of boxes) assert.equal(overlap(rect, previous), false, 'Animals keep separate slots');
        for (const flower of gardenFlowers) assert.equal(overlap(rect, await page.getByTestId(flower.id).boundingBox()), false, 'Flowers must not hide animated animals');
        boxes.push(rect);
      }
      await page.screenshot({ path: `${output}/yard-${viewport.width}.png` });
      await page.getByTestId('exterior-animal-farm-cow').scrollIntoViewIfNeeded();
      await page.screenshot({ path: `${output}/left-${viewport.width}.png` });
    }
    const cow = page.getByTestId('farm-motion-farm-cow');
    const read = () => cow.getAttribute('transform');
    await button(page, 'Aventuras').click();
    await page.waitForTimeout(150);
    const retained = await cow.count();
    const paused = retained ? await read() : null;
    await page.waitForTimeout(500);
    if (retained) assert.equal(await read(), paused, 'Hidden exterior must stop animating');
    else assert.equal(await cow.count(), 0, 'An unmounted exterior has no animated rigs');
    await button(page, 'Volver').click();
    await page.getByTestId('exterior-scene').waitFor();
    const resumed = await read();
    await page.waitForTimeout(350);
    assert.notEqual(await read(), resumed, 'Animation resumes after returning');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForTimeout(150);
    const reduced = await read();
    await page.waitForTimeout(450);
    assert.equal(await read(), reduced, 'System reduced motion must be respected');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.waitForTimeout(200);
    assert.notEqual(await read(), reduced);
    await button(page, 'Colocar Vaquita').click();
    await cow.waitFor({ state: 'detached' });
    await button(page, 'Colocar Vaquita').click();
    await cow.waitFor({ state: 'attached' });
    await button(page, 'Entrar a la casa').click();
    await page.getByTestId('interior-door-outside').waitFor();
    assert.deepEqual(errors, []);
    fs.writeFileSync(`${output}/report.json`, JSON.stringify({ samples, errors }, null, 2));
    console.log('Animal rigs passed: six independent continuous animations, all joints and blinks, two landscape sizes, no flower/animal overlap, focus pause/resume, reduced motion, removal and house entry.');
  } finally { await browser.close(); }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
