const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');
const catchYarn = require('./catch-yarn.cjs');
require('./load-game-data.cjs');
const { mouseHidingSpots, shuffledMouseSpots } = require('../src/data/mouseHideAndSeek.ts');
const output = process.env.REVIEW_OUTPUT || '/tmp/petmaestro-mouse';
const button = (page, name) => page.getByRole('button', { name, exact: true });
const saved = page => page.evaluate(() => JSON.parse(localStorage.getItem('petmaestro.progress.v1')));
async function run() {
  for (let i = 0; i < 100; i++) {
    const bag = shuffledMouseSpots(mouseHidingSpots[0].id);
    assert.equal(new Set(bag).size, mouseHidingSpots.length);
    assert.notEqual(bag[0], 0);
  }
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  const report = [];
  try {
    for (const viewport of [{ width: 1280, height: 720 }, { width: 844, height: 390 }]) {
      const page = await browser.newPage({ viewport });
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      page.setDefaultTimeout(15000);
      await page.addInitScript(() => {
        if (!localStorage.getItem('petmaestro.progress.v1')) localStorage.setItem('petmaestro.progress.v1', JSON.stringify({ coins: 7, ownedItems: ['mouse-toy', 'yarn-ball', 'feather-wand'], needs: { play: 20 }, needsUpdatedAt: Date.now() }));
      });
      await page.goto(process.env.GAME_URL || 'http://localhost:8087');
      await button(page, 'Mapa').waitFor({ timeout: 90000 });
      await button(page, 'Juguetes').click();
      await button(page, 'Jugar Ratoncito').click();
      const target = button(page, 'Encontrar al ratoncito');
      await target.waitFor();
      const spots = [];
      for (let i = 0; i < 6; i++) {
        await target.waitFor({ state: 'visible' });
        await page.waitForFunction(() => document.querySelector('[data-testid="hidden-mouse"]')?.getAttribute('aria-disabled') !== 'true');
        const room = page.locator('[data-testid^="mouse-room-"]');
        const id = await room.getAttribute('data-testid');
        assert.ok(!spots.includes(id), 'Do not repeat hiding places within a round');
        spots.push(id);
        const rect = await target.boundingBox();
        const bounds = await room.boundingBox();
        const backdrop = await room.locator('img').first().boundingBox();
        assert.ok(Math.abs(backdrop.width - bounds.width) < 1 && Math.abs(backdrop.height - bounds.height) < 1, 'Background must fit the complete room, without intrinsic-size cropping');
        assert.ok(Math.abs(bounds.width / bounds.height - 1983 / 793) < .01);
        await page.screenshot({ path: `${output}/hide-${viewport.width}-${i}-${id}.png` });
        assert.ok(rect.width >= 44 && rect.height >= 44);
        assert.ok(rect.x >= bounds.x && rect.y >= bounds.y && rect.x + rect.width <= bounds.x + bounds.width + 1 && rect.y + rect.height <= bounds.y + bounds.height + 1, 'Mouse touch area stays inside room');
        if (i === 0) {
          await page.screenshot({ path: `${output}/room-${viewport.width}.png` });
          await page.mouse.click(bounds.x + bounds.width * .51, bounds.y + bounds.height * .94);
          assert.equal(await page.getByLabel('0 de 6', { exact: true }).count(), 1, 'Background taps do not score');
          await button(page, 'Dame una pista').click();
          await page.getByText('¡Por acá! Buscá dentro del brillito.', { exact: true }).waitFor();
          await page.screenshot({ path: `${output}/hint-${viewport.width}.png` });
        }
        if (i < 5) {
          await target.click();
          // A second physical tap during celebration must not score or move again.
          await page.mouse.click(rect.x + rect.width / 2, rect.y + rect.height / 2);
          await page.getByLabel(`${i + 1} de 6`, { exact: true }).waitFor();
          if (i === 0) {
            await page.getByTestId('mouse-curtain-closing').waitFor();
            assert.equal(await room.getAttribute('data-testid'), id, 'The mouse stays in place while the curtain closes');
            await page.waitForTimeout(110);
            await page.screenshot({ path: `${output}/curtain-closing-${viewport.width}.png` });
            await page.getByTestId('mouse-curtain-closed').waitFor();
            const left = await page.getByTestId('mouse-curtain-left').boundingBox();
            const right = await page.getByTestId('mouse-curtain-right').boundingBox();
            assert.ok(left.x <= bounds.x + 1 && right.x + right.width >= bounds.x + bounds.width - 1 && left.x + left.width >= right.x, 'Opaque curtains fully cover the room, including the center seam');
            assert.ok(left.y <= bounds.y + 1 && left.y + left.height >= bounds.y + bounds.height - 1);
            assert.notEqual(await room.getAttribute('data-testid'), id, 'Relocate while the curtain is fully closed');
            assert.equal(await target.isDisabled(), true, 'Mouse input stays locked behind the curtain');
            assert.equal(await button(page, 'Dame una pista').isDisabled(), true);
            await page.screenshot({ path: `${output}/curtain-closed-${viewport.width}.png` });
            await page.getByTestId('mouse-curtain-opening').waitFor();
          }
          await page.waitForFunction(() => document.querySelector('[data-testid="hidden-mouse"]')?.getAttribute('aria-disabled') !== 'true');
        } else await target.click();
      }
      await page.getByText('¡Qué bien jugaron juntos!', { exact: true }).waitFor();
      assert.equal((await saved(page)).learning.toyBest['mouse-toy'], 6);
      assert.equal((await saved(page)).learning.counts.toy, 1);
      assert.equal((await saved(page)).coins, 12);
      assert.ok((await saved(page)).needs.play >= 44);
      await button(page, 'Volver a jugar').click();
      for (let i = 0; i < 6; i++) {
        await target.click();
        if (i < 5) await page.waitForFunction(() => document.querySelector('[data-testid="hidden-mouse"]')?.getAttribute('aria-disabled') !== 'true');
      }
      await page.getByText('¡Qué bien jugaron juntos!', { exact: true }).waitFor();
      assert.equal((await saved(page)).coins, 17, 'Each completed replay earns five coins');
      assert.equal((await saved(page)).learning.counts.toy, 2);
      await button(page, 'Volver a jugar').click();
      // Leave on the last find: a cancelled animation must not award completion later.
      await page.emulateMedia({ reducedMotion: 'reduce' });
      for (let i = 0; i < 6; i++) {
        await target.click();
        if (i < 5) await page.waitForFunction(() => document.querySelector('[data-testid="hidden-mouse"]')?.getAttribute('aria-disabled') !== 'true');
      }
      await page.getByTestId('mouse-curtain-closing').waitFor();
      await button(page, 'Volver').click();
      await page.waitForTimeout(1500);
      assert.equal((await saved(page)).learning.counts.toy, 2, 'Leaving during relocation cannot finish a round');
      await button(page, 'Jugar Ovillo').click();
      await catchYarn(page);
      await page.getByText('¡Qué bien jugaron juntos!', { exact: true }).waitFor();
      assert.equal((await saved(page)).learning.toyBest['yarn-ball'], 6);
      await button(page, 'Mis juguetes').click();
      await button(page, 'Tienda').click();
      await button(page, 'Abrir Sombreros').click();
      for (let i = 0; i < 3; i++) await button(page, 'Ver productos siguientes').click();
      await button(page, 'Comprar Sombrero marrón con flor').waitFor();
      await page.screenshot({ path: `${output}/brown-hat-shop-${viewport.width}.png` });
      const coinsBefore = (await saved(page)).coins;
      await button(page, 'Comprar Sombrero marrón con flor').click();
      await button(page, 'Vestir Sombrero marrón con flor').waitFor();
      assert.equal((await saved(page)).coins, coinsBefore, 'Test currency preserves the saved balance');
      assert.ok((await saved(page)).ownedItems.includes('brown-flower-hat'));
      await button(page, 'Vestir Sombrero marrón con flor').click();
      await page.getByTestId('cat-outfit-brown-flower-hat').waitFor();
      assert.equal((await saved(page)).equippedCatItems.head, 'brown-flower-hat');
      await page.getByTestId('cat-rig').screenshot({ path: `${output}/brown-hat-cat-${viewport.width}.png` });
      await button(page, 'Usar Sombrero marrón con flor').click();
      assert.ok(!(await saved(page)).equippedCatItems.head);
      await button(page, 'Usar Sombrero marrón con flor').click();
      assert.equal((await saved(page)).equippedCatItems.head, 'brown-flower-hat');
      const hatCard = await button(page, 'Usar Sombrero marrón con flor').boundingBox();
      assert.ok(Math.abs(hatCard.width - hatCard.height) < 1, 'The new hat keeps square wardrobe cards');
      assert.deepEqual(errors, []);
      report.push({ viewport, spots, errors });
      await page.close();
      console.log(`Curtain coverage, hidden relocation, double taps, rewards, cancelled final find, reduced motion, chase, hat purchase and outfit passed at ${viewport.width}×${viewport.height}.`);
    }
    fs.writeFileSync(`${output}/report.json`, JSON.stringify(report, null, 2));
  } finally { await browser.close(); }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
