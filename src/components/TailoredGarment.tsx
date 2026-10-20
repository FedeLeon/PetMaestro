import { memo, useId } from 'react';
import { ClipPath, Defs, Ellipse, G, Image as SvgImage, Mask, Path, Rect } from 'react-native-svg';
import { catItemImages } from '../data/assetImages';
import { wardrobeBounds } from '../data/wardrobeBounds';
import { garmentMeshes, triangleTransform, type GarmentPart, type Point } from '../styles/components/catGarmentMesh.layout';

function trianglePath(points: readonly Point[]) {
  const x = points.reduce((sum, p) => sum + p[0], 0) / 3;
  const y = points.reduce((sum, p) => sum + p[1], 0) / 3;
  // Tiny overlap prevents antialias seams between neighboring texture patches.
  return points.map((p, i) => {
    const length = Math.hypot(p[0] - x, p[1] - y);
    return `${i ? 'L' : 'M'}${p[0] + (p[0] - x) / length * .15} ${p[1] + (p[1] - y) / length * .15}`;
  }).join('') + 'Z';
}

export const TailoredGarment = memo(function TailoredGarment({ id, part }: { id: string; part: GarmentPart }) {
  const prefix = `cloth${useId().replace(/\W/g, '')}`;
  const triangles = garmentMeshes[id]?.[part];
  if (!triangles) return null;
  const [bx, by, bw, bh] = wardrobeBounds[id];
  return <G testID={`tailored-${part}-${id}`}>
    <Defs>{triangles.map((triangle, index) => <ClipPath key={index} id={`${prefix}${index}`}><Path d={trianglePath(triangle.target)} /></ClipPath>)}
      {part === 'body' && <Mask id={`${prefix}neck`} x={0} y={0} width={174} height={260} maskUnits="userSpaceOnUse"><Rect width={174} height={260} fill="white" /><Ellipse cx={86.5} cy={108} rx={15} ry={5} fill="black" /></Mask>}
    </Defs>
    <G mask={part === 'body' ? `url(#${prefix}neck)` : undefined}>{triangles.map((triangle, index) => <G key={index} clipPath={`url(#${prefix}${index})`}>
      <G transform={`matrix(${triangleTransform(triangle).join(' ')})`}>
        <SvgImage href={catItemImages[id]} x={-bx / bw} y={-by / bh} width={1 / bw} height={1 / bh} preserveAspectRatio="none" />
      </G>
    </G>)}</G>
  </G>;
});
