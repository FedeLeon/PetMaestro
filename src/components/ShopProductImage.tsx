import Svg, { Image as SvgImage } from 'react-native-svg';
import { shopDisplayBounds } from '../data/shopDisplayBounds';

// Alpha bounds remove each PNG's different transparent margin. The product
// rests on the same shelf baseline, without stretching its proportions.
export function ShopProductImage({ id, source }: { id: string; source: number }) {
  const [x, y, width, height, aspect] = shopDisplayBounds[id] ?? [0, 0, 1, 1, 1];
  return <Svg testID={`shop-product-art-${id}`} width="100%" height="100%" viewBox={`${x * aspect} ${y} ${width * aspect} ${height}`} preserveAspectRatio="xMidYMax meet">
    <SvgImage href={source} width={aspect} height={1} preserveAspectRatio="none" />
  </Svg>;
}
