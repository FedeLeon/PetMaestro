const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');
require('./load-game-data.cjs');
const { storyOrder } = require('../src/data/libraryProgression.ts');
const { storyReadingContent } = require('../src/data/storyReadingContent.ts');
const button = (page, name) => page.getByRole('button', { name, exact: true });
const saved = page => page.evaluate(() => JSON.parse(localStorage.getItem('petmaestro.progress.v1')));
const output = '/tmp/petmaestro-library-progression';
async function run() {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  try {
    for (const viewport of [{ width: 844, height: 390 }, { width: 1280, height: 720 }]) {
      const page = await browser.newPage({ viewport });
      page.setDefaultTimeout(15000);
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      await page.addInitScript(() => {
        if (!localStorage.getItem('petmaestro.progress.v1')) localStorage.setItem('petmaestro.progress.v1', JSON.stringify({ coins: 7, needsUpdatedAt: Date.now(), storyQuizResults: { 'burro-flautista': { best: 5, completed: 100, lastAttemptId: 'legacy-1' } } }));
      });
      const open = async () => { await page.goto(process.env.GAME_URL || 'http://localhost:8087'); await button(page, 'Biblioteca').waitFor({ timeout: 90000 }); await button(page, 'Biblioteca').click(); };
      const checkGroup = async (group, locked) => {
        await page.getByTestId('library-group').filter({ hasText: `Estante ${group + 1} de 3` }).waitFor();
        for (const id of storyOrder.slice(group * 4, (group + 1) * 4)) {
          const card = page.getByTestId(`story-book-${id}`);
          assert.equal(await card.isDisabled(), locked);
          const rect = await card.boundingBox();
          assert.ok(rect.x >= 0 && rect.x + rect.width <= viewport.width && rect.y >= 58 && rect.y + rect.height <= viewport.height - 94, 'Every square-page book fits above the menu');
          if (locked) {
            assert.equal(await card.evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(191, 195, 197)', 'Locked cards are gray');
            await card.evaluate(el => el.click());
            assert.equal(await page.getByTestId('story-player').filter({ visible: true }).count(), 0, 'Locked cards cannot open a story');
          }
        }
      };
      const read = async id => {
        await page.getByTestId(`story-book-${id}`).filter({ visible: true }).click();
        const text = page.getByTestId('story-text'); await text.waitFor();
        assert.ok((await text.innerText()).includes(storyReadingContent[id].paragraphs.at(-1)), 'Every new book includes its full ending');
        await text.evaluate(el => { el.scrollTop = el.scrollHeight; });
        if (await button(page, 'Leer yo').count()) await button(page, 'Leer yo').click();
        await button(page, 'Terminé de leer: responder cinco preguntas').click();
      };
      const answerWrong = async (id, index) => {
        await page.getByText(`Pregunta ${index + 1} de 5`, { exact: true }).waitFor();
        const q = storyReadingContent[id].questions[index];
        await button(page, `Responder: ${q.options.find(o => o.id !== q.answerId).text}`).click();
        const next = button(page, index === 4 ? 'Terminar preguntas y recibir monedas' : 'Siguiente pregunta');
        const rect = await next.boundingBox();
        assert.ok(rect.height >= 44 && rect.y + rect.height <= viewport.height - 94);
        await next.click();
      };
      const finish = async id => {
        await read(id);
        for (let i = 0; i < 5; i++) await answerWrong(id, i);
        await page.getByTestId('story-quiz-result').waitFor();
        const result = (await saved(page)).storyQuizResults[id];
        assert.equal(result.best, 0, 'All five answers may be wrong');
        assert.ok(result.completed >= 1);
        const other = await button(page, 'Elegir otro cuento').boundingBox();
        assert.ok(other.y + other.height <= viewport.height - 94, 'Completion and unlock controls fit');
        await button(page, 'Elegir otro cuento').click();
      };
      await open(); await checkGroup(0, false);
      await button(page, 'Grupo siguiente de cuentos').click(); await checkGroup(1, true);
      await page.screenshot({ path: `${output}/locked-${viewport.width}.png` });
      await button(page, 'Grupo siguiente de cuentos').click(); await checkGroup(2, true);
      await button(page, 'Grupo anterior de cuentos').click(); await button(page, 'Grupo anterior de cuentos').click();
      for (const id of storyOrder.slice(0, 3)) await finish(id);
      await finish(storyOrder[0]);
      assert.equal((await saved(page)).storyQuizResults[storyOrder[0]].completed, 2);
      await button(page, 'Grupo siguiente de cuentos').click(); await checkGroup(1, true);
      await button(page, 'Grupo anterior de cuentos').click();
      await read(storyOrder[3]); await answerWrong(storyOrder[3], 0);
      await button(page, 'Volver al cuento').click(); await button(page, 'Volver a los libros').click();
      await button(page, 'Grupo siguiente de cuentos').click(); await checkGroup(1, true);
      await page.reload(); await button(page, 'Biblioteca').waitFor({ timeout: 90000 }); await button(page, 'Biblioteca').click();
      await checkGroup(0, false);
      await finish(storyOrder[3]);
      await checkGroup(1, false);
      await page.screenshot({ path: `${output}/unlocked-2-${viewport.width}.png` });
      await button(page, 'Grupo siguiente de cuentos').click(); await checkGroup(2, true); await button(page, 'Grupo anterior de cuentos').click();
      for (const id of storyOrder.slice(4, 8)) await finish(id);
      await checkGroup(2, false);
      await page.screenshot({ path: `${output}/unlocked-3-${viewport.width}.png` });
      for (const id of storyOrder.slice(8)) await finish(id);
      assert.equal(await page.getByText('¡Desbloqueaste cuatro cuentos nuevos!', { exact: true }).count(), 0, 'The last group does not promise nonexistent books');
      const final = await saved(page);
      for (const id of storyOrder) assert.ok(final.storyQuizResults[id].completed >= 1);
      assert.equal(final.storyQuizResults['burro-flautista'].completed, 100, 'Legacy history is preserved');
      assert.equal(final.coins, 7 + 13 * 8 + 3, 'Distinct books and repeated quizzes retain their normal rewards');
      await page.reload(); await button(page, 'Biblioteca').waitFor({ timeout: 90000 }); await button(page, 'Biblioteca').click();
      await checkGroup(2, false);
      assert.equal((await saved(page)).coins, final.coins);
      assert.deepEqual(errors, []);
      await page.close();
      console.log(`Library progression passed at ${viewport.width}x${viewport.height}: gray locks, 12 complete stories and 60 questions, zero-score unlocking, repeats, cancellation, both unlocks and reload.`);
    }
  } finally { await browser.close(); }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
