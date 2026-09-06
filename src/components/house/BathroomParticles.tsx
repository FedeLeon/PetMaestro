import { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
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
    {Array.from({ length: 9 }, (_, index) => <Animated.Text key={index} style={[styles.sparkle, { left: `${18 + index % 3 * 17}%`, top: `${20 + Math.floor(index / 3) * 28}%`, opacity: phase.interpolate({ inputRange: [0, .5, 1], outputRange: [.2, 1, .2] }), transform: [{ scale: phase.interpolate({ inputRange: [0, .5, 1], outputRange: [.6, 1.2, .6] }) }] }]}>✦</Animated.Text>)}
  </View>;
}
