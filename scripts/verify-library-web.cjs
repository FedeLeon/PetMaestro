const { BOTTOM_MENU_HEIGHT } = require('../src/styles/layout.ts');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');
const stories = require('../docs/audiobook-sources.json');
const button = (page, name) => page.getByRole('button', { name, exact: true });
const output = '/tmp/petmaestro-library';
async function run() {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  try {
    for (const viewport of [{ width: 1280, height: 720 }, { width: 844, height: 390 }]) {
      const page = await browser.newPage({ viewport });
      const errors = [];
      const remoteAudio = [];
      page.on('pageerror', e => errors.push(e.message));
      page.on('request', request => { if (/librivox|archive\.org/.test(request.url())) remoteAudio.push(request.url()); });
      await page.addInitScript(() => {
        window.__media = [];
        const OriginalAudio = window.Audio;
        window.Audio = function (...args) { const media = new OriginalAudio(...args); window.__media.push(media); return media; };
        window.Audio.prototype = OriginalAudio.prototype;
        localStorage.setItem('petmaestro.progress.v1', JSON.stringify({ coins: 37, ownedItems: ['bookcase-open'], placedFurnitureIds: ['bookcase-open'], needsUpdatedAt: Date.now() }));
      });
      await page.goto(process.env.GAME_URL || 'http://localhost:8087');
      await button(page, 'Biblioteca').waitFor({ timeout: 90000 });
      for (const label of ['Mapa', 'Mascota', 'Casa', 'Tienda', 'Juguetes', 'Álbum de figuritas', 'Biblioteca']) {
        const item = button(page, label);
        assert.equal((await item.innerText()).trim(), '', 'Bottom buttons contain only art');
        const rect = await item.boundingBox();
        assert.ok(rect.width >= 44 && rect.x >= 0 && rect.x + rect.width <= viewport.width);
      }
      await button(page, 'Biblioteca').click();
      for (const story of stories) {
        const book = page.getByTestId(`story-book-${story.id}`);
        const rect = await book.boundingBox();
        assert.ok(rect && rect.y >= 58 && rect.y + rect.height <= viewport.height - BOTTOM_MENU_HEIGHT, `Book fits landscape: ${story.id}`);
      }
      await page.screenshot({ path: `${output}/books-${viewport.width}.png` });
      for (const story of stories) {
        await page.getByTestId(`story-book-${story.id}`).click();
        if (!story.hasAudio) {
          await page.getByTestId('story-reading-only').waitFor();
          assert.equal(await page.getByTestId('story-play').count(), 0, 'Reading-only books never show an empty audio player');
          assert.equal(await page.getByTestId('story-progress').count(), 0);
          await button(page, 'Siguiente ilustración').click();
          await page.getByText('2 / 3', { exact: true }).waitFor();
          await button(page, 'Siguiente ilustración').click();
          await page.getByText('3 / 3', { exact: true }).waitFor();
          await button(page, 'Siguiente ilustración').click();
          await page.getByText('1 / 3', { exact: true }).waitFor();
          await button(page, 'Créditos del cuento').click();
          await page.getByText(/Texto de esta adaptación ofrecido bajo CC0/).waitFor();
          await button(page, 'Cerrar créditos').click();
          await page.screenshot({ path: `${output}/${story.id}-${viewport.width}.png` });
          await button(page, 'Volver a los libros').click();
          continue;
        }
        await button(page, 'Escuchar').waitFor();
        const rect = await page.getByTestId('story-play').boundingBox();
        assert.ok(rect.height >= 44 && rect.y + rect.height <= viewport.height - BOTTOM_MENU_HEIGHT);
        await button(page, 'Escuchar').click();
        await page.waitForFunction(id => window.__media.some(m => m.src.includes(id) && !m.paused && m.currentTime > .25), story.id);
        assert.ok(await page.evaluate(() => window.__media.filter(m => m.loop).every(m => m.paused)), 'Background music pauses for stories');
        await button(page, 'Pausar').click();
        const time = await page.evaluate(id => window.__media.find(m => m.src.includes(id)).currentTime, story.id);
        await button(page, 'Avanzar 10 segundos').click();
        await page.waitForFunction(({ id, time }) => window.__media.find(m => m.src.includes(id)).currentTime >= time + 9.8, { id: story.id, time });
        await button(page, 'Retroceder 10 segundos').click();
        await page.waitForFunction(({ id, time }) => window.__media.find(m => m.src.includes(id)).currentTime <= time + .3, { id: story.id, time });
        await page.evaluate(id => { const m = window.__media.find(m => m.src.includes(id)); m.currentTime = m.duration * .9; }, story.id);
        await page.getByText('3 / 3', { exact: true }).waitFor();
        await button(page, 'Escuchar').click();
        await page.evaluate(id => { const m = window.__media.find(m => m.src.includes(id)); m.currentTime = m.duration - .15; }, story.id);
        await button(page, 'Repetir cuento').waitFor();
        await button(page, 'Repetir cuento').click();
        await page.waitForFunction(id => { const m = window.__media.find(m => m.src.includes(id)); return !m.paused && m.currentTime < 3; }, story.id);
        await page.getByText('1 / 3', { exact: true }).waitFor();
        await page.screenshot({ path: `${output}/${story.id}-${viewport.width}.png` });
        await button(page, 'Créditos del cuento').click();
        assert.ok(await page.evaluate(id => window.__media.find(m => m.src.includes(id)).paused, story.id));
        await button(page, 'Cerrar créditos').click();
        await button(page, 'Escuchar').click();
        await button(page, 'Volver a los libros').click();
        assert.ok(await page.evaluate(() => window.__media.filter(m => /stories|flautista|serpiente|cuclillo|caballo/.test(m.src)).every(m => m.paused)), 'Leaving stops narration');
      }
      await page.getByTestId('story-book-abeja-haragana').click();
      await button(page, 'Escuchar').click();
      await button(page, 'Ajustes de sonido').click();
      await page.getByRole('switch', { name: 'Palabras y cuentos' }).click();
      await button(page, '¡Listo!').click();
      await button(page, 'Activar voz').waitFor();
      assert.ok(await page.evaluate(() => window.__media.filter(m => m.src.includes('abeja-haragana')).every(m => m.paused)), 'Voice preference pauses narration');
      await button(page, 'Activar voz').click();
      await button(page, 'Escuchar').click();
      await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, value: true }); document.dispatchEvent(new Event('visibilitychange')); });
      await button(page, 'Escuchar').waitFor();
      assert.ok(await page.evaluate(() => window.__media.filter(m => m.src.includes('abeja-haragana')).every(m => m.paused)), 'Hiding the tab pauses narration');
      await page.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event('visibilitychange')); });
      await button(page, 'Escuchar').waitFor();
      await button(page, 'Volver a los libros').click();
      await page.route('**/*abeja-haragana.mp3*', route => route.abort());
      await page.getByTestId('story-book-abeja-haragana').click();
      await button(page, 'Reintentar').waitFor();
      await page.unroute('**/*abeja-haragana.mp3*');
      await button(page, 'Reintentar').click();
      await button(page, 'Escuchar').waitFor();
      await button(page, 'Escuchar').click();
      await page.waitForFunction(() => window.__media.some(m => m.src.includes('abeja-haragana') && !m.paused && m.currentTime > .2));
      await button(page, 'Volver a los libros').click();
      await button(page, 'Casa').click();
      const target = page.getByTestId('interior-library');
      await target.waitFor();
      await page.getByTestId('interior-scroll').evaluate(node => { node.scrollLeft = 0; });
      await target.click();
      await page.getByTestId('library-books').filter({ visible: true }).waitFor();
      assert.deepEqual(remoteAudio, [], 'Narrations are bundled, no external requests');
      assert.deepEqual(errors, []);
      await page.close();
      console.log(`Library books, icon-only menu, two real MP3s and two reading-only books, controls, sequences, replay, credits, music and house access passed at ${viewport.width}x${viewport.height}.`);
    }
  } finally { await browser.close(); }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
