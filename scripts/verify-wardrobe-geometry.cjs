const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { shopItems } = require('./load-game-data.cjs');
const { garmentMeshes, triangleTransform } = require('../src/styles/components/catGarmentMesh.layout.ts');
const { wardrobeBounds } = require('../src/data/wardrobeBounds.ts');
const queries = [];
assert.deepEqual(Object.keys(garmentMeshes).sort(), shopItems.filter(item => item.category === 'shirts' || item.category === 'bottoms').map(item => item.id).sort(), 'Every body garment must have its own measured fit');
function uvAt(triangles, [x, y]) {
  for (const triangle of triangles) {
    const [a, b, c, d, e, f] = triangleTransform(triangle);
    const det = a * d - b * c;
    assert.ok(Number.isFinite(det) && det > 0, 'No collapsed or inverted texture triangles');
    const u = (d * (x - e) - c * (y - f)) / det;
    const v = (-b * (x - e) + a * (y - f)) / det;
    const [p, q, r] = triangle.source;
    const cross = (A, B, C) => (B[0] - A[0]) * (C[1] - A[1]) - (B[1] - A[1]) * (C[0] - A[0]);
    const signs = [cross(p, q, [u, v]), cross(q, r, [u, v]), cross(r, p, [u, v])];
    if (signs.every(n => n >= -1e-6) || signs.every(n => n <= 1e-6)) return [u, v];
  }
}
for (const [id, parts] of Object.entries(garmentMeshes)) {
  for (const triangles of Object.values(parts)) for (const triangle of triangles) {
    const matrix = triangleTransform(triangle);
    assert.ok(matrix.every(Number.isFinite), `${id}: finite mesh`);
    triangle.source.forEach(([x, y], i) => {
      const [a, b, c, d, e, f] = matrix;
      assert.ok(Math.hypot(a * x + c * y + e - triangle.target[i][0], b * x + d * y + f - triangle.target[i][1]) < 1e-8, `${id}: exact continuous landmarks`);
    });
  }
  const samples = id.endsWith('shirt') ? {
    body: [[67, 126], [106, 126], [64, 146], [109, 146], [58, 173], [115, 173], [86.5, 175]],
    leftSleeve: [[53, 128], [49, 142]], rightSleeve: [[120, 128], [124, 142]],
  } : id.endsWith('skirt') ? { skirt: [[56, 180], [117, 180], [86.5, 202]] }
    : { waist: [[56, 182], [117, 182], [85, 190], [88, 190]], leftLeg: [[68, 206]], rightLeg: [[105, 206]] };
  for (const [part, points] of Object.entries(samples)) for (const point of points) {
    const uv = uvAt(parts[part], point);
    assert.ok(uv, `${id}/${part} must cover body point ${point}`);
    const [bx, by, bw, bh] = wardrobeBounds[id];
    const file = ['v2', 'v1'].map(v => path.resolve(__dirname, `../assets/generated/cat-items/${id}-${v}.png`)).find(fs.existsSync);
    queries.push({ id, part, point, file, u: bx + uv[0] * bw, v: by + uv[1] * bh });
  }
  if (parts.leftLeg) assert.ok(!uvAt(parts.leftLeg, [86.5, 208]) && !uvAt(parts.rightLeg, [86.5, 208]), `${id}: preserve the real gap between legs`);
}
// Sample original alpha without modifying or regenerating any PNG.
const samples = JSON.parse(execFileSync('python3', ['-c', 'import sys,json\nfrom PIL import Image\ncache={}\nresult=[]\nfor q in json.load(sys.stdin):\n p=q["file"]\n if p not in cache: cache[p]=Image.open(p)\n im=cache[p]; x=max(0,min(im.width-1,round(q["u"]*im.width))); y=max(0,min(im.height-1,round(q["v"]*im.height)))\n result.append(im.getpixel((x,y))[3])\nprint(json.dumps(result))'], { input: JSON.stringify(queries), encoding: 'utf8' }));
for (let i = 0; i < samples.length; i++) assert.ok(samples[i] >= 80, `${queries[i].id}/${queries[i].part}: transparent hole at anatomical point ${queries[i].point}, alpha=${samples[i]}`);
console.log(`Tailoring geometry: ${Object.keys(garmentMeshes).length} garments, ${samples.length} opaque anatomical samples, correct crotch gaps and continuous non-inverted texture maps passed.`);
