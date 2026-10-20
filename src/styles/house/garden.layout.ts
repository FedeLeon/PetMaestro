export const GARDEN_BED_BOTTOM = 8;
export const gardenFlowerSize = (height: number) => Math.max(80, Math.min(142, height * .36));
export const gardenFlowerX = (index: number, width: number) => width * (.14 + index * .24);
