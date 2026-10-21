const { BOTTOM_MENU_HEIGHT } = require('../src/styles/layout.ts');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');
const { shopItems, getWord, reviewWordIds, cityActivities } = require('./load-game-data.cjs');
const output = process.env.REVIEW_OUTPUT || '/tmp/petmaestro-ux-review';
const button = (page, name) => page.getByRole('button', { name, exact: true });
const saved = page => page.evaluate(() => JSON.parse(localStorage.getItem('petmaestro.progress.v1')));
async function visibleControl(locator, viewport, footer = true) {
  await locator.waitFor();
  const r = await locator.boundingBox();
  assert.ok(r.width >= 44 && r.height >= 44, `Touch target: ${JSON.stringify(r)}`);
  assert.ok(r.x >= 0 && r.y >= 0 && r.x + r.width <= viewport.width + 1 && r.y + r.height <= viewport.height - (footer ? BOTTOM_MENU_HEIGHT : 0) + 1, `Control in view: ${JSON.stringify(r)}`);
}
async function run() {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  try {
    for (const viewport of [{ width: 844, height: 390 }, { width: 1280, height: 720 }]) {
      const page = await browser.newPage({ viewport });
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      page.setDefaultTimeout(15000);
      const seed = { coins: 7, unlockedLevel: 11, completedLevels: [11], ownedItems: shopItems.filter(i => i.target === 'cat').map(i => i.id), needsUpdatedAt: Date.now(), learning: { words: { cat: { correct: 3, errors: 0, lastPracticed: Date.now() } }, counts: { review: 1, sleep: 1 }, claimedMissions: [], cityCompleted: [], toyBest: {} } };
      await page.addInitScript(seed => {
        if (!localStorage.getItem('petmaestro.progress.v1')) localStorage.setItem('petmaestro.progress.v1', JSON.stringify(seed));
        window.__voicePlays = [];
        // Preloading replaces asset URLs with local blob URLs. Keep provenance
        // so a real playing event can be tied to the selected recording.
        const blobs = new WeakMap();
        const sources = new Map();
        const fetchAsset = window.fetch.bind(window);
        window.fetch = async (...args) => {
          const response = await fetchAsset(...args);
          const readBlob = response.blob.bind(response);
          response.blob = async () => { const blob = await readBlob(); blobs.set(blob, String(args[0])); return blob; };
          return response;
        };
        const createUrl = URL.createObjectURL.bind(URL);
        URL.createObjectURL = blob => { const url = createUrl(blob); sources.set(url, blobs.get(blob)); return url; };
        const original = HTMLMediaElement.prototype.play;
        HTMLMediaElement.prototype.play = function(...args) { this.addEventListener('playing', () => { const src = this.currentSrc || this.src; window.__voicePlays.push(sources.get(src) || src); }, { once: true }); return original.apply(this, args); };
      }, seed);
      await page.goto(process.env.GAME_URL || 'http://localhost:8087');
      await button(page, 'Juguetes').waitFor({ timeout: 90000 });
      for (const name of ['Mapa', 'Mascota', 'Casa', 'Tienda', 'Juguetes', 'Álbum de figuritas', 'Biblioteca']) assert.ok(await button(page, name).isVisible(), `Accessible footer control ${name}`);
      await button(page, 'Juguetes').click();
      // First row can be opened without discovering a button below the fold.
      for (const name of ['Jugar Ovillo', 'Jugar Ratoncito', 'Jugar Pez de peluche']) await visibleControl(button(page, name), viewport);
      await page.screenshot({ path: `${output}/toys-${viewport.width}.png` });
      await button(page, 'Jugar Ratoncito').locator('img').click();
      await button(page, 'Encontrar al ratoncito').waitFor();
      await button(page, 'Volver').click();
      await button(page, 'Mapa').click();
      await button(page, 'Álbum de figuritas').click();
      await visibleControl(button(page, 'Escuchar cat'), viewport);
      const albumCard = await page.getByTestId('album-cat').boundingBox();
      assert.ok(albumCard.y + albumCard.height <= viewport.height - BOTTOM_MENU_HEIGHT, 'Sticker and its progress fit above the footer');
      await button(page, 'Ganadas (1)').click();
      await page.getByTestId('album-cat').waitFor();
      assert.equal(await page.locator('[data-testid^="album-"]').count(), 1);
      await button(page, 'Por conseguir').click();
      assert.equal(await page.getByTestId('album-cat').count(), 0);
      await button(page, 'Todas').click();
      await page.screenshot({ path: `${output}/album-${viewport.width}.png` });
      // Each newly bundled recording must actually play in the browser.
      for (const id of ['bread', 'wave', 'shirt', 'table', 'lamp', 'lion', 'elephant', 'monkey']) {
        await button(page, `Escuchar ${getWord(id).english}`).click();
        try { await page.waitForFunction(id => window.__voicePlays.some(src => decodeURIComponent(src).includes('/complete/' + id)), id); }
        catch (error) { throw new Error(`Voice ${id}: ${JSON.stringify(await page.evaluate(() => window.__voicePlays))}`, { cause: error }); }
      }
      await button(page, 'Practicar palabras').click();
      const ids = reviewWordIds(await saved(page));
      for (const [index, id] of ids.entries()) {
        await page.getByText(`Ronda ${index + 1} de ${ids.length}`, { exact: true }).filter({ visible: true }).waitFor();
        await button(page, `Elegir ${getWord(id).spanish.toUpperCase()}`).click();
      }
      await page.getByText('Repaso completo', { exact: true }).waitFor();
      await visibleControl(button(page, 'Volver al mapa'), viewport);
      await visibleControl(button(page, 'Ver mis pegatinas ★'), viewport);
      await page.screenshot({ path: `${output}/learning-result-${viewport.width}.png` });
      await button(page, 'Ver mis pegatinas ★').click();
      await button(page, 'Mascota').click();
      await button(page, 'Usar Gorrito fiesta').click();
      assert.equal(await button(page, 'Usar Gorrito fiesta').getAttribute('aria-pressed'), 'true');
      await page.screenshot({ path: `${output}/wardrobe-${viewport.width}.png` });
      await button(page, 'Usar Gorrito fiesta').click();
      assert.equal(await button(page, 'Usar Gorrito fiesta').getAttribute('aria-pressed'), 'false');
      await button(page, 'Casa').click();
      await button(page, 'Abrir lienzo de dibujo').click();
      await visibleControl(button(page, 'Goma de borrar'), viewport);
      await visibleControl(button(page, 'Deshacer último trazo'), viewport);
      await visibleControl(button(page, 'Elegir color #f04f5f'), viewport);
      await visibleControl(button(page, 'Elegir color #111827'), viewport);
      await button(page, 'Elegir color #f04f5f').click();
      assert.equal(await button(page, 'Elegir color #f04f5f').getAttribute('aria-pressed'), 'true');
      const slider = page.getByLabel('Tamaño del pincel', { exact: true });
      const sliderRect = await slider.boundingBox();
      await page.mouse.click(sliderRect.x + sliderRect.width * .97, sliderRect.y + sliderRect.height / 2);
      assert.ok(Number(await slider.getAttribute('aria-valuenow')) >= 29, 'Brush size responds over the track and thumb');
      await page.screenshot({ path: `${output}/drawing-${viewport.width}.png` });
      await button(page, 'Volver').click();
      await button(page, 'Mapa').click();
      await button(page, 'Entrar a Ciudad Gatuna').click();
      await button(page, 'Visitar La panadería').click();
      const bakery = cityActivities[0];
      // Cancel during feedback: no later city reward after leaving the task.
      await button(page, `Entregar ${getWord(bakery.tasks[0].answer).spanish}`).click();
      await button(page, 'Volver').click();
      await page.waitForTimeout(650);
      assert.equal((await saved(page)).learning.counts.city || 0, 0);
      await button(page, 'Visitar La panadería').click();
      for (const [index, task] of bakery.tasks.entries()) {
        await page.getByText(task.phrase, { exact: true }).filter({ visible: true }).waitFor();
        const choice = button(page, `Entregar ${getWord(task.answer).spanish}`);
        await choice.click();
        assert.equal(await choice.isDisabled(), true);
        assert.equal(await choice.getAttribute('aria-pressed'), 'true');
        if (!index) await page.screenshot({ path: `${output}/city-feedback-${viewport.width}.png` });
      }
      await page.getByText('¡Ayudaste a tus amigos de la ciudad!', { exact: true }).waitFor();
      assert.equal((await saved(page)).learning.counts.city, 1);
      assert.deepEqual(errors, []);
      console.log(`UX passed ${viewport.width}×${viewport.height}: visible toy actions, navigation icons, album filters, eight voices, learning results, clothing selection, drawing controls, city feedback and cancellation.`);
      await page.close();
    }
  } finally { await browser.close(); }
}
run().catch(e => { console.error(e); process.exitCode = 1; });
