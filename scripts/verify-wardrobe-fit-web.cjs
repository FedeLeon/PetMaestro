const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');
const { shopItems } = require('./load-game-data.cjs');
const { wardrobeBounds } = require('../src/data/wardrobeBounds.ts');
const { glassesLensAnchors } = require('../src/styles/components/catWardrobe.layout.ts');
const output = process.env.REVIEW_OUTPUT || '/tmp/petmaestro-wardrobe-fit';
const button = (page, name) => page.getByRole('button', { name, exact: true });
async function run() {
  const categories = ['hats', 'glasses', 'shirts', 'bottoms', 'shoes'];
  for (const category of categories) assert.equal(shopItems.filter(i => i.category === category).length, 12, category);
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  try {
    for (const viewport of [{ width: 1280, height: 720 }, { width: 844, height: 390 }]) {
      const page = await browser.newPage({ viewport });
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      page.setDefaultTimeout(15000);
      await page.addInitScript(items => localStorage.setItem('petmaestro.progress.v1', JSON.stringify({ coins: 7, ownedItems: items.map(i => i.id), equippedCatItems: { head: 'blue-cap', body: 'blue-shirt', bottom: 'denim-skirt', feet: 'tiny-shoes', toy: 'fish-plush' }, needsUpdatedAt: Date.now() })), shopItems.filter(i => i.target === 'cat'));
      await page.goto(process.env.GAME_URL || 'http://localhost:8087');
      await button(page, 'Mascota').waitFor({ timeout: 90000 });
      await button(page, 'Mascota').click();
      const rig = page.getByTestId('cat-rig');
      await rig.screenshot({ path: `${output}/reference-outfit-${viewport.width}.png` });
      let current = 'tiny-shoes';
      for (const item of shopItems.filter(i => i.category === 'shoes')) {
        if (current !== item.id) await button(page, `Usar ${item.name}`).click();
        current = item.id;
        const root = await rig.boundingBox();
        const scale = root.width / 214;
        for (const [side, center] of [['left', 60], ['right', 114]]) {
          // Nested SVG getBoundingClientRect includes its oversized source
          // image outside the clip. Measure the actual SVG viewport instead.
          const local = await page.getByTestId(`cat-outfit-${item.id}-${side}`).evaluate(el => ({ x: el.x.baseVal.value, y: el.y.baseVal.value, width: el.width.baseVal.value, height: el.height.baseVal.value }));
          const r = { x: root.x + (local.x + 20) * scale, y: root.y + (local.y + 48) * scale, width: local.width * scale, height: local.height * scale };
          assert.ok(Math.abs(r.x + r.width / 2 - (root.x + (center + 20) * scale)) < 1.5, `${item.id} ${side}: aligned with foot center`);
          assert.ok(Math.abs(r.y + r.height - (root.y + (254 + 48) * scale)) < 1.5, `${item.id} ${side}: same floor baseline`);
          assert.ok(local.width >= 34, `${item.id} ${side}: shoe covers the complete 30px bare paw`);
          const ankle = await page.getByTestId(`cat-outfit-${item.id}-${side}`).evaluate((el, uv) => {
            const root = el.ownerSVGElement;
            const at = new DOMPoint(uv[0] + uv[2] / 2, uv[1]).matrixTransform(el.getScreenCTM()).matrixTransform(root.getScreenCTM().inverse());
            return { x: at.x, y: at.y };
          }, wardrobeBounds[`${item.id}-${side}`]);
          assert.ok(Math.abs(ankle.x - (side === 'left' ? 65 : 109)) < .1, `${item.id} ${side}: opening follows the inward ankle`);
        }
        await rig.screenshot({ path: `${output}/${item.id}-${viewport.width}.png` });
      }
      for (const item of shopItems.filter(i => i.category === 'glasses')) {
        await button(page, `Usar ${item.name}`).click();
        const [bx, by, bw, bh] = wardrobeBounds[item.id];
        const [left, right, y] = glassesLensAnchors[item.id];
        const centers = await page.getByTestId(`cat-outfit-${item.id}`).evaluate((el, uv) => uv.map(([x, y]) => {
          const point = new DOMPoint(x, y).matrixTransform(el.getScreenCTM()).matrixTransform(el.ownerSVGElement.getScreenCTM().inverse());
          return { x: point.x, y: point.y };
        }), [[bx + left * bw, by + y * bh], [bx + right * bw, by + y * bh]]);
        assert.ok(Math.abs(centers[0].x - 66) < .1 && Math.abs(centers[1].x - 107) < .1 && centers.every(p => Math.abs(p.y - 69.5) < .1), `${item.id}: both lenses follow the eyes, independent of decorative ears`);
      }
      for (const item of shopItems.filter(i => i.category === 'shirts' || i.category === 'bottoms')) {
        await button(page, `Usar ${item.name}`).click();
        const part = item.category === 'shirts' ? 'body' : item.id.endsWith('skirt') ? 'skirt' : 'waist';
        await page.getByTestId(`tailored-${part}-${item.id}`).waitFor();
        if (item.category === 'shirts') for (const side of ['left', 'right']) assert.equal(await page.getByTestId(`tailored-${side}Sleeve-${item.id}`).evaluate(el => el.parentElement.dataset.testid), `cat-arm-${side}`);
      }
      for (const id of ['moon-glasses', 'teal-leaf-shirt', 'denim-shorts', 'yellow-sneakers']) {
        const item = shopItems.find(i => i.id === id);
        if (current === id) continue;
        await button(page, `Usar ${item.name}`).click();
      }
      await rig.screenshot({ path: `${output}/new-outfit-${viewport.width}.png` });
      assert.deepEqual(errors, []);
      await page.close();
      console.log(`Wardrobe fit passed ${viewport.width}×${viewport.height}: 12 lens pairs on the eyes, 12 shoes on ankles/soles, 24 tailored garments, sleeve joints, reference outfit and new combination.`);
    }
  } finally { await browser.close(); }
}
run().catch(e => { console.error(e); process.exitCode = 1; });
