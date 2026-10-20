const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { shopItems } = require('./load-game-data.cjs');
const output = process.env.REVIEW_OUTPUT || '/tmp/petmaestro-review';
const button = (page, name) => page.getByRole('button', { name, exact: typeof name === 'string' });
const text = (page, value) => page.getByText(value, { exact: true }).filter({ visible: true });
const state = page => page.evaluate(() => JSON.parse(localStorage.getItem('petmaestro.progress.v1')));
const screenshot = (page, name) => page.screenshot({ path: `${output}/${name}.png` });
async function rub(page, testId, points, repeats = 1) {
  const rect = await page.getByTestId(testId).boundingBox();
  const move = point => page.mouse.move(rect.x + rect.width * point[0], rect.y + rect.height * point[1], { steps: 4 });
  await move(points[0]);
  await page.mouse.down();
  for (let repeat = 0; repeat < repeats; repeat++) for (const point of points) await move(point);
  await page.mouse.up();
}
async function run() {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  try {
    const page = await browser.newPage({ viewport: { width: 960, height: 540 } });
    page.setDefaultTimeout(15000);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(items => {
      localStorage.setItem('petmaestro.progress.v1', JSON.stringify({ coins: 300, unlockedLevel: 1, ownedItems: items, needs: { hunger: 35, hygiene: 35, bathroom: 35, play: 35, energy: 35 }, needsUpdatedAt: Date.now() }));
      window.__petAudio = [];
      const original = HTMLMediaElement.prototype.play;
      const watched = new WeakSet();
      HTMLMediaElement.prototype.play = function (...args) {
        const media = this;
        if (!watched.has(media)) {
          watched.add(media);
          media.addEventListener('playing', () => window.__petAudio.push({ src: media.currentSrc || media.src, volume: media.volume, duration: media.duration }));
        }
        return original.apply(media, args);
      };
    }, shopItems.filter(item => item.target === 'garden').map(item => item.id));
    await page.goto(process.env.GAME_URL || 'http://localhost:8087');
    await button(page, /^Higiene:/).waitFor({ timeout: 90000 });
    await button(page, /^Higiene:/).click();
    await button(page, 'Lavarse los dientes').click();
    await button(page, 'Poner pasta dental en el cepillo').click();
    await button(page, 'Activar cepillo de dientes').click();
    const teeth = [[.250,.686],[.272,.698],[.297,.707],[.327,.707],[.363,.707],[.395,.700],[.418,.690],[.438,.678]];
    for (const [x,y] of teeth) await rub(page, 'tooth-stage', [[x-.01,y], [x+.01,y]], 6);
    await text(page, '¡Dientes brillantes!').waitFor();
    assert.ok((await state(page)).needs.hygiene >= 59);
    await screenshot(page, 'teeth-complete');
    await button(page, '¡Listo!').click();
    console.log('Tooth brushing: all eight teeth cleaned.');

    await button(page, 'Bañarse').click();
    const zones = [[.28,.49],[.44,.49],[.32,.64],[.4,.68],[.31,.84],[.42,.85]];
    for (const tool of ['Jabón', 'Ducha', 'Toalla']) {
      await button(page, tool).click();
      await rub(page, 'shower-stage', zones);
    }
    await text(page, '¡Limpito y seco!').waitFor();
    assert.equal((await state(page)).needs.hygiene, 100);
    await screenshot(page, 'shower-complete');
    await button(page, '¡Listo!').click();

    await button(page, 'Usar inodoro').click();
    await button(page, 'Levantar la tapa del inodoro').click();
    await page.getByText('Arrastrá al gatito hasta el asiento', { exact: true }).waitFor();
    const toilet = await page.getByTestId('toilet-stage').boundingBox();
    await page.mouse.move(toilet.x + toilet.width * .72, toilet.y + toilet.height * .66);
    await page.mouse.down();
    await page.mouse.move(toilet.x + toilet.width * .35, toilet.y + toilet.height * .62, { steps: 16 });
    await page.mouse.up();
    await button(page, 'Tirar de la cadena').click();
    await button(page, 'Lavar patitas').click();
    for (const x of [.31, .48]) await rub(page, 'toilet-stage', [[x-.025,.595], [x+.025,.595]], 10);
    await text(page, '¡Muy bien! Todo limpio').waitFor();
    assert.equal((await state(page)).needs.bathroom, 100);
    await screenshot(page, 'toilet-complete');
    await button(page, '¡Listo!').click();
    console.log('Shower and toilet: all phases completed.');

    await button(page, 'Casa').click();
    await button(page, /^Energía:/).click();
    await button(page, 'Dormir en la cama').click();
    await text(page, '¡Descansó! Sueño al 100%').waitFor();
    assert.equal((await state(page)).needs.energy, 100);
    await screenshot(page, 'bedroom-complete');

    await button(page, /^Hambre:/).click();
    await button(page, 'Abrir heladera').click();
    await button(page, 'Comprar Zanahoria por 8 monedas').click();
    await button(page, 'Cocinar').click();
    const carrot = await page.getByTestId('drag-food-carrot').boundingBox();
    const pot = await page.getByTestId('cooking-stage').boundingBox();
    await page.mouse.move(carrot.x + carrot.width/2, carrot.y + carrot.height/2);
    await page.mouse.down();
    await page.mouse.move(pot.x + pot.width*.445, pot.y + pot.height*.48, { steps: 12 });
    await page.mouse.up();
    await button(page, 'Soplar (0/3)').waitFor();
    assert.equal(await page.getByTestId('cooking-soup').count(), 1);
    for (let i=0; i<3; i++) await button(page, `Soplar (${i}/3)`).click();
    await button(page, 'Servir al gato').click();
    await button(page, 'Dar una cucharada').click();
    await button(page, 'Terminar comida').waitFor({ state: 'visible' });
    assert.ok((await state(page)).needs.hunger >= 44);
    assert.equal((await state(page)).coins, process.env.INFINITE_COINS === '1' ? 328 : 320);
    await screenshot(page, 'feeding-complete');
    await button(page, 'Terminar comida').click();
    console.log('Cooking: purchase, drag, stir, cooling, feeding and activity rewards passed.');

    await button(page, 'Casa').click();
    await page.getByTestId('interior-door-outside').click();
    await button(page, 'Regar Margaritas').click();
    await text(page, '¡Flores regadas!').waitFor();
    assert.ok((await state(page)).flowerWateredAt['flower-daisies'] > 0);
    assert.equal((await state(page)).coins, process.env.INFINITE_COINS === '1' ? 331 : 323, 'Completed watering adds three coins');
    assert.equal(await button(page, 'Regar Margaritas').isDisabled(), true);
    const counts = (await state(page)).learning.counts;
    assert.equal(counts.wash, 3, 'Teeth, shower and washing paws must each advance hygiene missions once');
    assert.equal(counts.meal, 1, 'A served meal must advance missions once');
    assert.equal(counts.sleep, 1, 'Finished sleep must advance missions once');
    assert.equal(counts.water, 1, 'Watering must advance missions once');
    await screenshot(page, 'garden-watered');
    const audio = await page.evaluate(() => window.__petAudio);
    fs.writeFileSync(`${output}/care-runtime.json`, JSON.stringify({ errors, audio, progress: await state(page) }, null, 2));
    assert.ok(audio.length > 5, 'Interactions must play actual media');
    assert.ok(audio.every(item => Number.isFinite(item.duration) && item.duration > 0));
    assert.deepEqual(errors, []);
    console.log('Garden watering and audio playback passed.');
  } finally { await browser.close(); }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
