import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Image as SvgImage } from 'react-native-svg';
import { uiImages } from '../data/assetImages';

// Virtual crops keep original alpha PNGs intact. Nine slices preserve the
// painted corners at every landscape width and with/without needs meters.
const artwork = {
  top: { x: 32, y: 45, width: 2108, height: 621, inset: 180 },
  bottom: { x: 14, y: 88, width: 2144, height: 524, inset: 190 },
};

export function MenuFrame({ kind }: { kind: 'top' | 'bottom' }) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const art = artwork[kind];
  const corner = Math.min(kind === 'top' ? 22 : 26, size.height / 2, size.width / 2);
  const targetX = [0, corner, size.width - corner, size.width];
  const targetY = [0, corner, size.height - corner, size.height];
  const sourceX = [art.x, art.x + art.inset, art.x + art.width - art.inset, art.x + art.width];
  const sourceY = [art.y, art.y + art.inset, art.y + art.height - art.inset, art.y + art.height];
  const source = kind === 'top' ? uiImages.topMenuFrame : uiImages.bottomMenuFrame;
  return <View testID={`menu-frame-${kind}`} pointerEvents="none" accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"
    style={StyleSheet.absoluteFill} onLayout={event => setSize(event.nativeEvent.layout)}>
    {size.width > 0 && size.height > 0 && <Svg width={size.width} height={size.height}>
      {[0, 1, 2].flatMap(row => [0, 1, 2].map(column => <Svg key={`${row}-${column}`}
        x={targetX[column]} y={targetY[row]} width={targetX[column + 1] - targetX[column]} height={targetY[row + 1] - targetY[row]}
        viewBox={`${sourceX[column]} ${sourceY[row]} ${sourceX[column + 1] - sourceX[column]} ${sourceY[row + 1] - sourceY[row]}`} preserveAspectRatio="none" style={frameStyles.slice}>
        <SvgImage href={source} width={2172} height={724} preserveAspectRatio="none" />
      </Svg>))}
    </Svg>}
  </View>;
}

const frameStyles = StyleSheet.create({ slice: { overflow: 'hidden' } });
