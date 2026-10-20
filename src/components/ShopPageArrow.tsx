import { Animated, Image, TouchableOpacity } from 'react-native';
import { uiImages } from '../data/assetImages';
import { styles } from '../styles/components/shopPageArrow.styles';

export function ShopPageArrow({ direction, disabled, size, scale, onPress }: {
  direction: 'previous' | 'next'; disabled: boolean; size: number; scale: Animated.Value; onPress: () => void;
}) {
  return <TouchableOpacity accessibilityRole="button" accessibilityLabel={direction === 'previous' ? 'Ver productos anteriores' : 'Ver productos siguientes'}
    accessibilityState={{ disabled }} disabled={disabled} activeOpacity={.8} onPress={onPress}
    style={[styles.button, styles[direction], { width: size, height: size, marginTop: -size / 2 }, disabled && styles.disabled]}>
    <Animated.View pointerEvents="none" testID={`shop-page-arrow-${direction}-motion`} style={[styles.art, { transform: [{ scale: disabled ? 1 : scale }] }]}>
      <Image accessible={false} source={uiImages.shopPageArrow} resizeMode="contain" style={[styles.art, direction === 'previous' && styles.mirrored]} />
    </Animated.View>
  </TouchableOpacity>;
}
