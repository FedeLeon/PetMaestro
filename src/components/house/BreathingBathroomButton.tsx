import { useEffect, useRef, type ComponentProps } from 'react';
import { Animated, Easing, TouchableOpacity, type StyleProp, type ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '../../styles/house/bathroom.styles';

export function BreathingBathroomButton({ label, icon, onPress, style, delay = 0 }: {
  label: string; icon: ComponentProps<typeof MaterialCommunityIcons>['name']; onPress: () => void; style: StyleProp<ViewStyle>; delay?: number;
}) {
  const breath = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(breath, { toValue: 1, duration: 1300, easing: Easing.inOut(Easing.sin), useNativeDriver: true, isInteraction: false }),
      Animated.timing(breath, { toValue: 0, duration: 1300, easing: Easing.inOut(Easing.sin), useNativeDriver: true, isInteraction: false }),
    ]));
    const timer = setTimeout(() => loop.start(), delay);
    return () => { clearTimeout(timer); loop.stop(); };
  }, [breath, delay]);
  return <Animated.View style={[styles.actionPosition, style, { transform: [{ scale: breath.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] }) }, { translateY: breath.interpolate({ inputRange: [0, 1], outputRange: [0, -4] }) }] }]}>
    <TouchableOpacity accessibilityLabel={label} accessibilityRole="button" onPress={onPress} style={styles.actionBubble}>
      <MaterialCommunityIcons color="#237d75" name={icon} size={31} />
    </TouchableOpacity>
  </Animated.View>;
}
