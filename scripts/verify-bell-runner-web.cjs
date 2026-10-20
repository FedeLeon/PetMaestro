const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');
const button = (page, name) => page.getByRole('button', { name, exact: true });
const saved = page => page.evaluate(() => JSON.parse(localStorage.getItem('petmaestro.progress.v1')));
async function run() {
  fs.mkdirSync('/tmp/petmaestro-bell', { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  try {
    for (const viewport of [{ width: 1280, height: 720 }, { width: 844, height: 390 }]) {
      const page = await browser.newPage({ viewport });
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      await page.addInitScript(() => { if (!localStorage.getItem('petmaestro.progress.v1')) localStorage.setItem('petmaestro.progress.v1', JSON.stringify({ coins: 7, ownedItems: ['bell-ball'], needsUpdatedAt: Date.now() })); });
      await page.goto(process.env.GAME_URL || 'http://localhost:8087');
      await button(page, 'Juguetes').waitFor({ timeout: 90000 });
      await button(page, 'Juguetes').click(); await button(page, 'Jugar Pelota cascabel').click();
      await button(page, 'Empezar carrera').click();
      const jump = button(page, 'Saltar en el parque');
      const grounded = await page.getByTestId('bell-runner-cat').boundingBox();
      await jump.click(); await page.waitForTimeout(160);
      const airborne = await page.getByTestId('bell-runner-cat').boundingBox();
      assert.ok(airborne.y < grounded.y - 15, 'The cat rises when the screen is tapped');
      await jump.click(); await jump.click();
      await page.waitForTimeout(850);
      assert.equal((await saved(page)).coins, 7, 'An early jump in empty space creates no coin');
      const frames = new Set();
      for (let i = 0; i < 18; i++) {
        frames.add(await page.getByTestId('bell-run-sprite').evaluate(el => `${el.style.left}/${el.style.top}`));
        await page.waitForTimeout(45);
      }
      assert.equal(frames.size, 8, 'The cat cycles through eight distinct running frames');
      const coinBefore = await page.getByTestId('bell-course-coin-0').boundingBox();
      const obstacleBefore = await page.getByTestId('bell-obstacle-0').boundingBox();
      assert.ok(coinBefore && obstacleBefore, 'Coin and obstacle are visible before jumping');
      assert.ok(Math.abs(coinBefore.x + coinBefore.width / 2 - obstacleBefore.x - obstacleBefore.width / 2) < 2, 'Coin travels above its obstacle');
      await page.waitForTimeout(160);
      const coinAfter = await page.getByTestId('bell-course-coin-0').boundingBox();
      const obstacleAfter = await page.getByTestId('bell-obstacle-0').boundingBox();
      assert.ok(coinAfter.x < coinBefore.x - 10, 'Visible coin approaches from the right');
      assert.ok(Math.abs((coinAfter.x - coinBefore.x) - (obstacleAfter.x - obstacleBefore.x)) < 3, 'Coin and obstacle share their travel speed');
      const catchCoin = async index => {
        await page.waitForFunction(index => {
          const obstacle = document.querySelector(`[data-testid="bell-obstacle-${index}"]`);
          const cat = document.querySelector('[data-testid="bell-runner-cat"]');
          const arena = document.querySelector('[data-testid="bell-runner-arena"]');
          if (!obstacle || !cat || !arena) return false;
          const a = obstacle.getBoundingClientRect(), b = cat.getBoundingClientRect();
          const gap = (a.x + a.width / 2 - b.x - b.width / 2) / arena.getBoundingClientRect().width;
          return gap < .14 && gap > .06;
        }, index, { timeout: 8000 });
        const obstacle = page.getByTestId(`bell-obstacle-${index}`);
        assert.equal(await obstacle.locator('img').count(), 1, 'Obstacle uses an illustrated raster asset');
        assert.ok(await obstacle.locator('img').evaluate(el => el.complete && el.naturalWidth > 0), 'Obstacle illustration loads successfully');
        await page.screenshot({ path: `/tmp/petmaestro-bell/approach-${index}-${viewport.width}.png` });
        await jump.click(); await jump.click();
        await page.getByLabel(`${index + 1} monedas atrapadas`, { exact: true }).waitFor();
        assert.equal(await page.getByTestId(`bell-course-coin-${index}`).count(), 0, 'Caught coin disappears from the course');
      };
      await catchCoin(0);
      assert.equal((await saved(page)).coins, 8, 'Catching the first visible coin saves exactly one reward');
      await page.screenshot({ path: `/tmp/petmaestro-bell/jumping-${viewport.width}.png` });
      await page.evaluate(() => { Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' }); document.dispatchEvent(new Event('visibilitychange')); });
      await page.getByText('La carrera está en pausa', { exact: true }).waitFor();
      const before = (await saved(page)).coins;
      await page.waitForTimeout(1100);
      assert.equal((await saved(page)).coins, before);
      await page.evaluate(() => { delete document.visibilityState; document.dispatchEvent(new Event('visibilitychange')); });
      await button(page, 'Continuar carrera').click();
      for (let index = 1; index < 4; index++) await catchCoin(index);
      await page.getByText('¡Alcanzaste el cascabel!', { exact: true }).waitFor();
      const result = await saved(page);
      assert.equal(result.learning.counts.toy, 1);
      const coins = result.coins - 7 - 5;
      assert.equal(coins, 4, 'Only the four visible course coins are paid');
      await page.getByText(`Diversión recuperada · Ganaste ${coins + 5} monedas`, { exact: true }).waitFor();
      await page.screenshot({ path: `/tmp/petmaestro-bell/finish-${viewport.width}.png` });
      // A replay pays again; quitting before its first apex gives nothing.
      await button(page, 'Volver a jugar').click(); await button(page, 'Empezar carrera').click();
      await jump.click(); await button(page, 'Volver').click();
      await page.waitForTimeout(1200);
      assert.equal((await saved(page)).coins, result.coins, 'No late jump/completion reward after navigation');
      await button(page, 'Jugar Pelota cascabel').click(); await button(page, 'Empezar carrera').click();
      await page.getByText('¡Alcanzaste el cascabel!', { exact: true }).waitFor({ timeout: 25000 });
      assert.equal((await saved(page)).coins, result.coins + 5, 'A completed replay pays five more coins');
      await page.reload(); await button(page, 'Juguetes').waitFor({ timeout: 90000 });
      assert.equal((await saved(page)).coins, result.coins + 5, 'Rewards survive reload in infinite mode');
      assert.deepEqual(errors, []);
      await page.close(); console.log(`Bell runner passed at ${viewport.width}x${viewport.height}: jump, coin, rapid taps, pause, completion, replay, cancellation and persistence.`);
    }
  } finally { await browser.close(); }
}
run().catch(e => { console.error(e); process.exitCode = 1; });
