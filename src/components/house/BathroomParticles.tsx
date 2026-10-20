import { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BathroomWater } from './BathroomWater';
import { styles } from '../../styles/house/bathroomActivity.styles';

export function BathroomParticles({ kind }: { kind: 'water' | 'sparkles' }) {
  const phase = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (kind === 'water') return;
    const loop = Animated.loop(Animated.timing(phase, { toValue: 1, duration: 1600, easing: Easing.linear, useNativeDriver: true, isInteraction: false }));
    loop.start();
    return () => loop.stop();
  }, [kind, phase]);
  if (kind === 'water') return <BathroomWater />;
  return <View pointerEvents="none" style={styles.fill}>
    {Array.from({ length: 9 }, (_, index) => {
      const travel = Animated.modulo(Animated.add(phase, index / 9), 1);
      return <Animated.View key={index} style={[styles.sparkle, { left: `${18 + index % 3 * 17}%`, top: `${20 + Math.floor(index / 3) * 28}%`, opacity: travel.interpolate({ inputRange: [0, .5, 1], outputRange: [.1, 1, .1] }), transform: [{ scale: travel.interpolate({ inputRange: [0, .5, 1], outputRange: [.5, 1.15, .5] }) }] }]}><MaterialCommunityIcons name="star-four-points" color="#fff7a4" size={32} /></Animated.View>;
    })}
  </View>;
}
