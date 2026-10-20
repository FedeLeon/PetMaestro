const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');
require('./load-game-data.cjs');
const { storyReadingContent } = require('../src/data/storyReadingContent.ts');
const sources = require('../docs/audiobook-sources.json');
const button = (page, name) => page.getByRole('button', { name, exact: true });
const saved = page => page.evaluate(() => JSON.parse(localStorage.getItem('petmaestro.progress.v1')));
async function answerQuiz(page, id, allWrong = false) {
  const questions = storyReadingContent[id].questions;
  for (let index = 0; index < 5; index++) {
    await page.getByText(`Pregunta ${index + 1} de 5`, { exact: true }).waitFor();
    const q = questions[index];
    assert.equal(await page.getByRole('button', { name: /^Responder: / }).count(), 3);
    const next = button(page, index === 4 ? 'Terminar preguntas y recibir monedas' : 'Siguiente pregunta');
    assert.equal(await next.isDisabled(), true);
    const option = q.options.find(o => (o.id !== q.answerId) === allWrong);
    await button(page, `Responder: ${option.text}`).click();
    for (const option of q.options) assert.equal(await button(page, `Responder: ${option.text}`).isDisabled(), true, 'One recorded answer per question');
    const rect = await next.boundingBox();
    assert.ok(rect.height >= 44 && rect.y + rect.height <= page.viewportSize().height - 94, 'Next button remains above footer');
    if (index === 4) await next.evaluate(el => { el.click(); el.click(); el.click(); });
    else await next.click();
  }
  await page.getByTestId('story-quiz-result').waitFor();
}
async function run() {
  fs.mkdirSync('/tmp/petmaestro-story-reading', { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  try {
    for (const viewport of [{ width: 1280, height: 720 }, { width: 844, height: 390 }]) {
      const page = await browser.newPage({ viewport });
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      await page.addInitScript(() => {
        if (!localStorage.getItem('petmaestro.progress.v1')) localStorage.setItem('petmaestro.progress.v1', JSON.stringify({ coins: 7, needsUpdatedAt: Date.now() }));
        window.__storyMedia = []; const OriginalAudio = window.Audio;
        window.Audio = function (...args) { const media = new OriginalAudio(...args); window.__storyMedia.push(media); return media; }; window.Audio.prototype = OriginalAudio.prototype;
      });
      await page.goto(process.env.GAME_URL || 'http://localhost:8087');
      await button(page, 'Biblioteca').waitFor({ timeout: 90000 }); await button(page, 'Biblioteca').click();
      let expectedCoins = 7;
      for (const [index, story] of sources.entries()) {
        await page.getByTestId(`story-book-${story.id}`).filter({ visible: true }).click();
        const text = page.getByTestId('story-text'); await text.waitFor();
        for (const paragraph of storyReadingContent[story.id].paragraphs) assert.ok((await text.innerText()).includes(paragraph));
        if (story.hasAudio) {
          assert.equal(await button(page, 'Responder cinco preguntas').isDisabled(), true);
          await button(page, 'Escuchar').click();
          await button(page, 'Pausar').waitFor();
          await button(page, 'Pausar').click();
          await button(page, 'Escuchar').waitFor();
          assert.ok(await page.evaluate(id => window.__storyMedia.filter(m => m.src.includes(id)).every(m => m.paused), story.id));
        } else {
          await page.getByTestId('story-reading-only').waitFor();
          assert.equal(await page.getByTestId('story-play').count(), 0);
          assert.equal((await saved(page)).coins, expectedCoins, 'Opening a reading-only book cannot automatically award completion');
        }
        const textBox = await text.boundingBox(); assert.ok(textBox.height >= 48 && textBox.y + textBox.height <= viewport.height - 94);
        await text.evaluate(node => { node.scrollTop = node.scrollHeight; });
        await page.screenshot({ path: `/tmp/petmaestro-story-reading/text-${story.id}-${viewport.width}.png` });
        if (index === 0) {
          // Audio completion unlocks questions without using manual reading.
          await button(page, 'Escuchar').click();
          await page.waitForFunction(id => window.__storyMedia.some(m => m.src.includes(id) && m.duration > 10), story.id);
          await page.evaluate(id => { const m = window.__storyMedia.find(m => m.src.includes(id)); m.currentTime = m.duration - .1; }, story.id);
          await button(page, 'Responder cinco preguntas').waitFor({ state: 'visible' });
          await page.waitForFunction(() => document.querySelector('[aria-label="Responder cinco preguntas"]')?.getAttribute('aria-disabled') !== 'true');
          await button(page, 'Responder cinco preguntas').click();
        } else {
          if (story.hasAudio) {
            await button(page, 'Escuchar').click();
            await button(page, 'Leer yo').click();
            assert.ok(await page.evaluate(id => window.__storyMedia.filter(m => m.src.includes(id)).every(m => m.paused), story.id));
          }
          await button(page, 'Siguiente ilustración').click();
          await page.getByText('2 / 3', { exact: true }).waitFor();
          await button(page, 'Terminé de leer: responder cinco preguntas').click();
        }
        await answerQuiz(page, story.id);
        expectedCoins += 13;
        assert.equal((await saved(page)).coins, expectedCoins, 'Three reading coins and ten quiz coins, once');
        assert.equal((await saved(page)).storyQuizResults[story.id].best, 5);
        await page.screenshot({ path: `/tmp/petmaestro-story-reading/result-${story.id}-${viewport.width}.png` });
        if (index === 0) {
          await button(page, 'Volver a leer el cuento').click(); await button(page, 'Leer yo').click();
          await button(page, 'Terminé de leer: responder cinco preguntas').click();
          await answerQuiz(page, story.id, true);
          expectedCoins += 5;
          const result = (await saved(page)).storyQuizResults[story.id];
          assert.equal(result.best, 5); assert.equal(result.completed, 2);
          assert.equal((await saved(page)).coins, expectedCoins, 'A finished retry gives its own graded reward');
        }
        await button(page, 'Elegir otro cuento').click();
      }
      // Leaving a partial question round cannot award quiz coins.
      await page.getByTestId('story-book-medias-flamencos').filter({ visible: true }).click();
      await button(page, 'Leer yo').click(); await button(page, 'Terminé de leer: responder cinco preguntas').click();
      expectedCoins += 3;
      await page.getByRole('button', { name: /^Responder: / }).first().click();
      await button(page, 'Volver al cuento').click(); await button(page, 'Volver a los libros').click();
      assert.equal((await saved(page)).coins, expectedCoins);
      await page.reload(); await button(page, 'Biblioteca').waitFor({ timeout: 90000 });
      assert.equal((await saved(page)).coins, expectedCoins);
      assert.equal((await saved(page)).storyQuizResults['abeja-haragana'].completed, 2);
      assert.deepEqual(errors, []);
      console.log(`Story reading passed at ${viewport.width}x${viewport.height}: all four extended texts and reading-only flows, play/pause, adult reading, audio end, 20 questions, mistakes, graded coins, double taps, retry, cancellation, old save and persistence.`);
      await page.close();
    }
  } finally { await browser.close(); }
}
run().catch(e => { console.error(e); process.exitCode = 1; });
