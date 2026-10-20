export function toysGridLayout(width: number, height: number) {
  const gap = 6;
  // Always three columns and two rows in the game's landscape play area.
  const side = Math.floor(Math.max(48, Math.min((width - 8 - gap * 2) / 3, (height - 8 - gap) / 2)));
  return { side, gap, gridWidth: side * 3 + gap * 2, titleSize: Math.max(12, Math.min(20, side * .085)), actionSize: Math.max(11, Math.min(17, side * .075)), iconSize: Math.max(15, Math.min(25, side * .12)) };
}
