import { wardrobeContours, type WardrobeContour } from '../../data/wardrobeContours';

export type Point = readonly [number, number];
export type Triangle = { source: readonly [Point, Point, Point]; target: readonly [Point, Point, Point] };
export type GarmentPart = 'body' | 'leftSleeve' | 'rightSleeve' | 'waist' | 'leftLeg' | 'rightLeg' | 'skirt';
type Row = { y: number; left: number; right: number };

function strip(source: Row[], target: Row[]): Triangle[] {
  return source.slice(1).flatMap((row, index) => {
    const s = source[index], t = target[index], next = target[index + 1];
    const a: Point = [s.left, s.y], b: Point = [s.right, s.y], c: Point = [row.left, row.y], d: Point = [row.right, row.y];
    const A: Point = [t.left, t.y], B: Point = [t.right, t.y], C: Point = [next.left, next.y], D: Point = [next.right, next.y];
    return [{ source: [a, b, c], target: [A, B, C] }, { source: [b, d, c], target: [B, D, C] }];
  });
}
const center = 86.5;
const shirtTarget = [
  { y: 107, left: 67, right: 106 }, { y: 113, left: 63, right: 110 },
  { y: 120, left: 63, right: 110 }, { y: 130, left: 62, right: 111 },
  { y: 143, left: 60, right: 113 }, { y: 156, left: 56, right: 117 },
  { y: 173, left: 51, right: 122 }, { y: 184, left: 51, right: 122 },
];
function shirtMesh(c: WardrobeContour) {
  const body = strip(c.rows.map((y, i) => ({ y, left: c.left[i], right: .5 })), shirtTarget.map(r => ({ ...r, right: center })))
    .concat(strip(c.rows.map((y, i) => ({ y, left: .5, right: c.right[i] })), shirtTarget.map(r => ({ ...r, left: center }))));
  const uv: Point[] = [[.26, .08], [.10, .18], [0, .32], [.12, .57], [c.left[4], .5], [.235, .32]];
  const xy: Point[] = [[63, 113], [49, 120], [34, 139], [53, 155], [60, 143], [62, 130]];
  const indices = [[0, 1, 5], [1, 2, 5], [2, 3, 5], [3, 4, 5]];
  const leftSleeve: Triangle[] = indices.map(ids => ({ source: ids.map(i => uv[i]) as unknown as Triangle['source'], target: ids.map(i => xy[i]) as unknown as Triangle['target'] }));
  const rightSleeve = leftSleeve.map(triangle => ({ source: triangle.source.map(([x, y]) => [1 - x, y]) as unknown as Triangle['source'], target: triangle.target.map(([x, y]) => [173 - x, y]) as unknown as Triangle['target'] }));
  return { body, leftSleeve, rightSleeve };
}
function interpolate(a: Row, b: Row, fraction: number): Row {
  return { y: a.y + (b.y - a.y) * fraction, left: a.left + (b.left - a.left) * fraction, right: a.right + (b.right - a.right) * fraction };
}
function trousersMesh(c: WardrobeContour, shorts: boolean) {
  const ys = shorts ? [174, 178, 185, 192, 199, 204, 208, 212] : [174, 178, 185, 192, 201, 218, 227, 232];
  const outer = shorts ? [52, 52, 52.5, 53, 53.5, 54, 54, 54] : [52, 52, 52.5, 53, 54, 54, 53, 52];
  const inner = shorts ? [center, center, center, center, 83, 82, 81, 80] : [center, center, center, center, 83, 79, 78, 77];
  const result: Partial<Record<GarmentPart, Triangle[]>> = { waist: [] };
  for (const side of ['left', 'right'] as const) {
    const source = c.rows.map((y, i) => ({ y, left: side === 'left' ? c.left[i] : c.innerRight![i], right: side === 'left' ? c.innerLeft![i] : c.right[i] }));
    const target = ys.map((y, i) => ({ y, left: side === 'left' ? outer[i] : 173 - inner[i], right: side === 'left' ? inner[i] : 173 - outer[i] }));
    result[side === 'left' ? 'leftLeg' : 'rightLeg'] = strip(source.slice(3), target.slice(3));
    // Two pixels of overlap close the hip joint while the legs move.
    const fraction = 2 / (ys[4] - ys[3]);
    result.waist!.push(...strip([...source.slice(0, 4), interpolate(source[3], source[4], fraction)], [...target.slice(0, 4), interpolate(target[3], target[4], fraction)]));
  }
  return result;
}
function skirtMesh(c: WardrobeContour) {
  const ys = [174, 178, 185, 193, 202, 209, 216];
  const left = [53, 52, 49, 45, 42, 42, 42];
  return { skirt: strip(c.rows.map((y, i) => ({ y, left: c.left[i], right: c.right[i] })), ys.map((y, i) => ({ y, left: left[i], right: 173 - left[i] }))) };
}

export const garmentMeshes: Record<string, Partial<Record<GarmentPart, Triangle[]>>> = Object.fromEntries(
  Object.entries(wardrobeContours).map(([id, contour]) => [id, id.endsWith('shirt') ? shirtMesh(contour) : id.endsWith('skirt') ? skirtMesh(contour) : trousersMesh(contour, id.endsWith('shorts'))]),
);

export function triangleTransform({ source: [p, q, r], target: [P, Q, R] }: Triangle) {
  const determinant = (q[0] - p[0]) * (r[1] - p[1]) - (r[0] - p[0]) * (q[1] - p[1]);
  const a = ((Q[0] - P[0]) * (r[1] - p[1]) - (R[0] - P[0]) * (q[1] - p[1])) / determinant;
  const c = ((R[0] - P[0]) * (q[0] - p[0]) - (Q[0] - P[0]) * (r[0] - p[0])) / determinant;
  const b = ((Q[1] - P[1]) * (r[1] - p[1]) - (R[1] - P[1]) * (q[1] - p[1])) / determinant;
  const d = ((R[1] - P[1]) * (q[0] - p[0]) - (Q[1] - P[1]) * (r[0] - p[0])) / determinant;
  return [a, b, c, d, P[0] - a * p[0] - c * p[1], P[1] - b * p[0] - d * p[1]];
}
