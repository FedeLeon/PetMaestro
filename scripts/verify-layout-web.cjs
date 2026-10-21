const { BOTTOM_MENU_HEIGHT } = require('../src/styles/layout.ts');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { shopItems } = require('./load-game-data.cjs');
const button = (page, name) => page.getByRole('button', { name, exact: true });
const output = process.env.REVIEW_OUTPUT || '/tmp/petmaestro-review';
async function run() {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  try {
    const page = await browser.newPage({ viewport: { width: 844, height: 390 } });
    page.setDefaultTimeout(15000);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(items => {
      const equipped = {};
      for (const item of items.filter(item => item.target === 'cat')) if (!equipped[item.slot]) equipped[item.slot] = item.id;
      localStorage.setItem('petmaestro.progress.v1', JSON.stringify({ coins: 500, unlockedLevel: 11, completedLevels: [11], ownedItems: items.map(item => item.id), equippedCatItems: equipped, drawingStrokes: [{ color: '#f04f5f', width: 10, points: [{ x: .1, y: .5 }, { x: .9, y: .5 }] }], needsUpdatedAt: Date.now() }));
    }, shopItems);
    await page.goto(process.env.GAME_URL || 'http://localhost:8087');
    await button(page, 'Nivel 1: Primeros amigos').waitFor({ timeout: 90000 });
    await page.screenshot({ path: `${output}/map-phone-final.png` });
    for (const viewport of [{ width: 844, height: 390 }, { width: 1280, height: 720 }]) {
      await page.setViewportSize(viewport);
      const controls = [];
      for (const name of ['Mapa', 'Mascota', 'Casa', 'Tienda', 'Juguetes', 'Álbum de figuritas', 'Biblioteca']) {
        const rect = await button(page, name).boundingBox();
        assert.ok(rect.width >= 44 && rect.height >= 44);
        assert.ok(rect.x >= 0 && rect.x + rect.width <= viewport.width && rect.y >= viewport.height - BOTTOM_MENU_HEIGHT && rect.y + rect.height <= viewport.height);
        for (const other of controls) assert.ok(rect.x >= other.x + other.width, 'Seven footer buttons must remain separate');
        controls.push(rect);
      }
      assert.equal(await button(page, 'Aventuras').count(), 0);
      await button(page, 'Juguetes').click();
      await button(page, 'Jugar Ratoncito').waitFor();
      assert.equal(await button(page, 'Juguetes').getAttribute('aria-selected'), 'true');
      await button(page, 'Juguetes').getByTestId('toys-menu-art').waitFor();
      await page.screenshot({ path: `${output}/toys-navigation-${viewport.width}.png` });
      await button(page, 'Jugar Ratoncito').click();
      await button(page, 'Encontrar al ratoncito').waitFor();
      await button(page, 'Volver').click();
      await button(page, 'Jugar Ratoncito').waitFor();
      assert.equal(await button(page, 'Juguetes').getAttribute('aria-selected'), 'true');
      await button(page, 'Mapa').click();
    }
    await page.setViewportSize({ width: 844, height: 390 });
    for (const name of ['Nivel 5: Hora de jugar', 'Nivel 8: Ropita', 'Nivel 11: Gran evaluacion']) {
      await button(page, name).click();
      const play = await button(page, 'Jugar').boundingBox();
      assert.ok(play.y >= 0 && play.y + play.height <= 390, 'Modal play button must fit the viewport');
      await button(page, 'Cerrar nivel').click();
    }
    await button(page, 'Entrar a Ciudad Gatuna').click();
    await button(page, 'Visitar La panadería').waitFor();
    await page.screenshot({ path: `${output}/city-phone-final.png` });
    await button(page, 'Tienda').click();
    await page.screenshot({ path: `${output}/shop-phone-final.png` });
    for (const name of ['Abrir Sombreros', 'Abrir Ropa', 'Abrir Flores']) {
      const rect = await button(page, name).boundingBox();
      assert.ok(rect.y + rect.height <= 296, `Shop button overlaps footer: ${name}`);
    }
    await button(page, 'Mascota').click();
    await page.screenshot({ path: `${output}/wardrobe-phone-final.png` });
    await button(page, 'Casa').click();
    await button(page, 'Abrir lienzo de dibujo').click();
    await button(page, 'Goma de borrar').click();
    const rect = await page.getByTestId('drawing-canvas').boundingBox();
    await page.mouse.click(rect.x + rect.width*.5, rect.y + rect.height*.5);
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('petmaestro.progress.v1')));
    assert.equal(saved.drawingStrokes.length, 2, 'Eraser must split old, sparsely sampled lines');
    assert.ok(saved.drawingStrokes[0].points.at(-1).x < .5 && saved.drawingStrokes[1].points[0].x > .5, 'The erased gap must follow the actual touch location');
    await button(page, 'Deshacer último trazo').click();
    const restored = await page.evaluate(() => JSON.parse(localStorage.getItem('petmaestro.progress.v1')));
    assert.equal(restored.drawingStrokes.length, 1);
    assert.equal(restored.drawingStrokes[0].points.length, 2);
    await page.screenshot({ path: `${output}/drawing-phone-final.png` });
    // The same need must reopen its room after using the House tab to return.
    for (let attempt = 0; attempt < 2; attempt++) {
      await button(page, 'Casa').click();
      await page.getByRole('button', { name: /^Higiene:/ }).click();
      await button(page, 'Bañarse').waitFor();
    }
    assert.deepEqual(errors, []);
    console.log('Seven footer buttons, independent Toys entry, active states and game return passed at two landscape sizes. Phone: map, modals, city, shop, wardrobe, eraser and undo passed.');
  } finally { await browser.close(); }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
