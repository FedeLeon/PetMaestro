// Landscape room framing: fill the viewport without stretching the illustration.
// Keep the wall/floor junction visible and use the same transform for hit targets.
export function roomFrame(viewport: { width: number; height: number }, aspect: number, floorY: number) {
  const width = Math.max(viewport.width, viewport.height * aspect);
  const height = width / aspect;
  const left = (viewport.width - width) / 2;
  const top = Math.min(0, Math.max(viewport.height - height, viewport.height * .68 - height * floorY));
  return {
    image: { width, height, left, top },
    point: (x: number, y: number) => ({ x: left + width * x, y: top + height * y }),
    button: (x: number, y: number, size: number) => ({
      left: Math.max(8, Math.min(viewport.width - size - 8, left + width * x - size / 2)),
      top: Math.max(10, Math.min(viewport.height - size - 8, top + height * y - size / 2)),
      width: size, height: size,
    }),
    hit: (x: number, y: number, w: number, h: number) => {
      const x1 = Math.max(0, left + width * x);
      const y1 = Math.max(0, top + height * y);
      return { left: x1, top: y1, width: Math.max(0, Math.min(viewport.width, left + width * (x + w)) - x1), height: Math.max(0, Math.min(viewport.height, top + height * (y + h)) - y1) };
    },
  };
}
