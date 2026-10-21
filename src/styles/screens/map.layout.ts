export const levelPointPositions = [
  { x: 0.054, y: 0.435 }, { x: 0.153, y: 0.476 }, { x: 0.225, y: 0.568 }, { x: 0.3, y: 0.643 },
  { x: 0.387, y: 0.665 }, { x: 0.476, y: 0.625 }, { x: 0.563, y: 0.53 }, { x: 0.653, y: 0.53 },
  { x: 0.722, y: 0.615 }, { x: 0.8, y: 0.625 }, { x: 0.879, y: 0.542 }, { x: 0.945, y: 0.46 },
];

export function mapViewportLayout(width: number, height: number) {
  return { worldWidth: Math.max(width, 1440), levelSize: Math.max(68, Math.min(84, height * .28)) };
}
