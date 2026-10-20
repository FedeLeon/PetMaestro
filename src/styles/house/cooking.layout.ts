// The food row sits below the pot in the shared landscape illustration.
export function cookingIngredientSize(width: number, height: number) {
  return Math.max(48, Math.min(144, height * .28, (width * .87 - 24) / 3));
}

export function stirProgressPlacement(width: number, height: number) {
  const panelWidth = Math.max(190, Math.min(280, width * .57));
  const panelHeight = panelWidth / 3;
  return { width: panelWidth, height: panelHeight, left: width * .445 - panelWidth / 2, top: Math.max(6, height * .30 - panelHeight - 8) };
}
