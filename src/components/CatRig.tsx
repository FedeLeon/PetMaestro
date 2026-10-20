import { memo, useId } from 'react';
import Svg, { ClipPath, Defs, G, Image as SvgImage, Path } from 'react-native-svg';
import { catItemImages, catShoeImages, petImages } from '../data/assetImages';
import { wardrobeBounds } from '../data/wardrobeBounds';
import { catGait } from '../data/catMotion';
import { catParts } from '../styles/components/catRig.layout';
import { outfitPlacement, shoePlacementFor, type OutfitPlacement } from '../styles/components/catWardrobe.layout';
import { styles } from '../styles/components/petCat.styles';
import type { ShopItem } from '../types';
import { pettingStroke } from '../data/animalPetting';
import { TailoredGarment } from './TailoredGarment';

type Items = Partial<Record<'head' | 'eyes' | 'body' | 'bottom' | 'feet' | 'neck' | 'toy', ShopItem>>;
type Part = keyof typeof catParts;

const Outfit = memo(function Outfit({ id, source = catItemImages[id], placement = outfitPlacement[id] }: { id: string; source?: number; placement?: OutfitPlacement }) {
  if (!source || !placement) return null;
  const [bx, by, bw, bh, aspect] = wardrobeBounds[id] ?? [0, 0, 1, 1, 1];
  const visibleAspect = aspect * bw / bh;
  const width = placement.stretch ? placement.width : Math.min(placement.width, placement.height * visibleAspect);
  const height = placement.stretch ? placement.height : width / visibleAspect;
  // A nested SVG clips exactly to the visible alpha bounds, independent of the
  // PNG's transparent margin. The entire garment shares the anatomical joint.
  const shift = placement.ankleShift ? placement.ankleShift / placement.height : 0;
  return <Svg testID={`cat-outfit-${id}`} x={placement.x + (placement.width - width) / 2} y={placement.y + (placement.height - height) * (placement.alignBottom ? 1 : .5)} width={width} height={height} viewBox={`${bx} ${by} ${bw} ${bh}`} preserveAspectRatio="none" transform={shift ? `matrix(1 0 ${-shift} 1 ${254 * shift} 0)` : undefined} style={styles.outfitClip}>
    <SvgImage href={source} x={0} y={0} width={1} height={1} preserveAspectRatio="none" />
  </Svg>;
});

const Skin = memo(function Skin({ clipPath }: { clipPath: string }) {
  return <G clipPath={clipPath}><SvgImage href={petImages.catBlink[0]} x={0} y={0} width={174} height={260} /></G>;
});

export function CatRig({ items, blink, distance, amount, stroke }: { items: Items; blink: number; distance: number; amount: number; stroke?: ReturnType<typeof pettingStroke> }) {
  const prefix = `cat${useId().replace(/\W/g, '')}`;
  const gait = catGait(distance, amount);
  const clip = (part: Part) => `url(#${prefix}${part})`;
  const skin = (part: Part) => <Skin clipPath={clip(part)} />;
  const garment = (item: ShopItem | undefined) => item && <Outfit id={item.id} />;
  const pants = items.bottom && /(?:pants|shorts)$/.test(items.bottom.id) ? items.bottom : undefined;
  const skirt = pants ? undefined : items.bottom;
  const shoes = items.feet && catShoeImages[items.feet.id];
  return <Svg testID="cat-rig" width={214} height={318} viewBox="-20 -48 214 318" style={styles.rig}>
    <Defs>{Object.entries(catParts).map(([key, path]) => <ClipPath key={key} id={`${prefix}${key}`}><Path d={path} /></ClipPath>)}<ClipPath id={`${prefix}shoeSkin`}><Path d="M0 0H174V232H0Z" /></ClipPath></Defs>
    <G transform={`translate(0 ${-gait.bounce})`}>
      <G testID="cat-tail" transform={gait.tail}>{skin('tail')}</G>
      <G testID="cat-leg-left" transform={gait.leftLeg}>
        <G clipPath={shoes ? `url(#${prefix}shoeSkin)` : undefined}>{skin('leftLeg')}</G>{pants && <TailoredGarment id={pants.id} part="leftLeg" />}
        {items.feet && shoes && <Outfit id={`${items.feet.id}-left`} source={shoes.left} placement={shoePlacementFor(items.feet.id).left} />}
      </G>
      <G testID="cat-leg-right" transform={gait.rightLeg}>
        <G clipPath={shoes ? `url(#${prefix}shoeSkin)` : undefined}>{skin('rightLeg')}</G>{pants && <TailoredGarment id={pants.id} part="rightLeg" />}
        {items.feet && shoes && <Outfit id={`${items.feet.id}-right`} source={shoes.right} placement={shoePlacementFor(items.feet.id).right} />}
      </G>
      {skin('torso')}
      <G testID="cat-arm-left" transform={gait.leftArm}>
        {skin('leftArm')}{items.body && <TailoredGarment id={items.body.id} part="leftSleeve" />}{garment(items.toy)}
        {items.toy && skin('grip')}
      </G>
      <G testID="cat-arm-right" transform={stroke ? `translate(105 118) rotate(${stroke.angle}) scale(${stroke.extension}) translate(-105 -118)` : gait.rightArm}>{skin('rightArm')}{items.body && <TailoredGarment id={items.body.id} part="rightSleeve" />}</G>
      {items.body && <TailoredGarment id={items.body.id} part="body" />}
      {pants && <TailoredGarment id={pants.id} part="waist" />}
      <G transform={gait.skirt}>{skirt && <TailoredGarment id={skirt.id} part="skirt" />}</G>
      {garment(items.neck)}
      <G clipPath={clip('head')}>{petImages.catBlink.map((source, index) => <SvgImage key={index} href={source} x={0} y={0} width={174} height={260} opacity={index === blink ? 1 : 0} />)}</G>
      {garment(items.head)}{garment(items.eyes)}
    </G>
  </Svg>;
}
