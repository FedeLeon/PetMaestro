import { useEffect, useRef } from 'react';
import { Animated, Easing, Image, Text, TouchableOpacity, type ImageSourcePropType } from 'react-native';
import { styles } from '../../styles/house/kitchen.styles';

export function KitchenAssetButton({ label, source, onPress, disabled = false, caption }: {
  label: string; source: ImageSourcePropType; onPress: () => void; disabled?: boolean; caption?: string;
}) {
  const breath = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    breath.setValue(0);
    if (disabled) return;
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(breath, { toValue: 1, duration: 1150, easing: Easing.inOut(Easing.sin), useNativeDriver: true, isInteraction: false }),
      Animated.timing(breath, { toValue: 0, duration: 1150, easing: Easing.inOut(Easing.sin), useNativeDriver: true, isInteraction: false }),
    ]));
    loop.start(); return () => loop.stop();
  }, [breath, disabled]);
  return <TouchableOpacity accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} style={[styles.assetButton, disabled && styles.disabled]}>
    <Animated.View style={[styles.assetButtonArt, { transform: [{ scale: breath.interpolate({ inputRange: [0, 1], outputRange: [1, 1.09] }) }, { translateY: breath.interpolate({ inputRange: [0, 1], outputRange: [0, -3] }) }] }]}>
      <Image source={source} resizeMode="contain" style={styles.image} />
    </Animated.View>
    {caption ? <Text style={styles.assetCaption}>{caption}</Text> : null}
  </TouchableOpacity>;
}
