import { useEffect, useRef } from 'react';
import { Animated, Easing, Image, TouchableOpacity, View, type ImageSourcePropType, type StyleProp, type ViewStyle } from 'react-native';
import { styles } from '../../styles/house/bathroom.styles';
import { useGameAudio } from '../../context/AudioContext';

export function BreathingBathroomButton({ label, source, onPress, style, delay = 0, disabled = false }: {
  label: string; source: ImageSourcePropType; onPress: () => void; style: StyleProp<ViewStyle>; delay?: number; disabled?: boolean;
}) {
  const { playSound } = useGameAudio();
  const breath = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(breath, { toValue: 1, duration: 1300, easing: Easing.inOut(Easing.sin), useNativeDriver: true, isInteraction: false }),
      Animated.timing(breath, { toValue: 0, duration: 1300, easing: Easing.inOut(Easing.sin), useNativeDriver: true, isInteraction: false }),
    ]));
    const timer = setTimeout(() => loop.start(), delay);
    return () => { clearTimeout(timer); loop.stop(); };
  }, [breath, delay]);
  return <View style={[styles.actionPosition, style]}>
    <TouchableOpacity accessibilityLabel={label} accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} activeOpacity={.8} onPress={() => { playSound('tap'); onPress(); }} style={[styles.actionBubble, disabled && styles.actionDisabled]}>
      <Animated.View pointerEvents="none" style={[styles.actionArt, { transform: [{ scale: breath.interpolate({ inputRange: [0, 1], outputRange: [1, disabled ? 1 : 1.04] }) }, { translateY: breath.interpolate({ inputRange: [0, 1], outputRange: [0, disabled ? 0 : -2] }) }] }]}><Image accessible={false} source={source} resizeMode="contain" style={styles.actionArt} /></Animated.View>
    </TouchableOpacity>
  </View>;
}
