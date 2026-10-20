import { Image, ImageSourcePropType, View } from 'react-native';
import { wardrobeBounds } from '../data/wardrobeBounds';
import { OutfitPlacement } from '../styles/components/catWardrobe.layout';
import { styles } from '../styles/components/catOutfitItem.styles';

type Props = { id: string; source: ImageSourcePropType; placement: OutfitPlacement };
export function CatOutfitItem({ id, source, placement: p }: Props) {
  const [bx, by, bw, bh, aspect] = wardrobeBounds[id] ?? [0, 0, 1, 1, 1];
  const visibleAspect = aspect * bw / bh;
  const width = p.stretch ? p.width : Math.min(p.width, p.height * visibleAspect);
  const height = p.stretch ? p.height : width / visibleAspect;
  return <View testID={`cat-outfit-${id}`} pointerEvents="none" style={[styles.window, {
    left: p.x + (p.width - width) / 2, top: p.y + (p.height - height) * (p.alignBottom ? 1 : .5), width, height,
  }]}>
    <Image source={source} fadeDuration={0} resizeMode="stretch" style={[styles.image, {
      left: -bx * width / bw, top: -by * height / bh, width: width / bw, height: height / bh,
    }]} />
  </View>;
}
