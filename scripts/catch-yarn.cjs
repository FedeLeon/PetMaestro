// Physical taps follow the visible moving target; no forced or synthetic clicks.
module.exports = async function catchYarn(page, touches = 6) {
  const target = page.getByRole('button', { name: 'Atrapar ovillo', exact: true });
  await target.waitFor();
  for (let i = 0; i < touches; i++) {
    const rect = await target.boundingBox();
    await page.mouse.click(rect.x + rect.width / 2, rect.y + rect.height / 2);
    if (i < touches - 1) await page.waitForTimeout(400);
  }
};
