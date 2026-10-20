export const toiletPreparation = {
  standing: { x: .72, y: .66 },
  seated: { x: .395, y: .43 },
  drop: { x: .35, y: .62, radiusX: .20, radiusY: .25 },
};

export function toiletCatFrame(width: number, height: number) {
  const catHeight = height * .72;
  return { width: catHeight * .68, height: catHeight };
}

export function toiletDropFits(x: number, y: number, width: number, height: number) {
  if (!width || !height) return false;
  const target = toiletPreparation.drop;
  return ((x / width - target.x) / target.radiusX) ** 2 + ((y / height - target.y) / target.radiusY) ** 2 <= 1;
}
