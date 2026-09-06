import { useCallback, useState } from 'react';
import { Image, ImageSourcePropType, ImageStyle, StyleProp, View } from 'react-native';
import { styles } from '../styles/components/spriteFrames.styles';

type Props = { sources: ImageSourcePropType[]; active: number; style?: StyleProp<ImageStyle> };

function Frame({ source, visible, onReady }: { source: ImageSourcePropType; visible: boolean; onReady: (source: ImageSourcePropType) => void }) {
  const onLoad = useCallback(() => onReady(source), [onReady, source]);
  return <Image source={source} resizeMode="contain" fadeDuration={0} onLoad={onLoad}
    style={[styles.frame, { opacity: visible ? 1 : 0 }]} />;
}

export function SpriteFrames({ sources, active, style }: Props) {
  const [loaded, setLoaded] = useState<Set<ImageSourcePropType>>(() => new Set());
  const onReady = useCallback((source: ImageSourcePropType) => {
    setLoaded(current => current.has(source) ? current : new Set(current).add(source));
  }, []);
  const ready = sources.every(source => loaded.has(source));
  // Keep decoded frames mounted. Changing a source can trigger a new load even
  // after prefetch (notably with Metro's development cache headers).
  return <View pointerEvents="none" style={style}>
    {sources.map((source, index) => <Frame key={index} source={source} onReady={onReady}
      visible={index === (ready ? active : 0)} />)}
  </View>;
}
