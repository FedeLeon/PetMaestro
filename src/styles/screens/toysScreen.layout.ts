export function toysGridLayout(width: number, height: number, topInset: number) {
  const gap = 6;
  const centerWidth = width * .56;
  // Keep three columns and two rows in the clear center, below floating controls.
  const side = Math.floor(Math.max(48, Math.min((centerWidth - 8 - gap * 2) / 3, (height - topInset - 4 - gap) / 2)));
  return { side, gap, topInset, gridWidth: side * 3 + gap * 2, titleSize: Math.max(12, Math.min(20, side * .085)), actionSize: Math.max(11, Math.min(17, side * .075)), iconSize: Math.max(15, Math.min(25, side * .12)) };
}
