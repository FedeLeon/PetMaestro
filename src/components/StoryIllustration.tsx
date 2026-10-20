import { Image, View, type ImageSourcePropType } from 'react-native';
import { styles } from '../styles/screens/library.styles';

// Each original PNG has three square illustrations side by side. Rendering
// through a clipped viewport preserves the source art on both native and web.
export function StoryIllustration({ source, index = 0, description }: { source: ImageSourcePropType; index?: number; description: string }) {
  return <View accessible accessibilityRole="image" accessibilityLabel={description} style={styles.illustrationViewport}>
    <Image accessible={false} source={source} resizeMode="stretch" style={[styles.strip, { left: `${-100 * index}%` }]} />
  </View>;
}
