import { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import { kitchenImages } from '../../data/kitchenContent';
import { feedingHeartPositions, styles } from '../../styles/house/kitchen.styles';

export function FeedingHearts({ id, width, height, onComplete }: {
  id: number; width: number; height: number; onComplete: (id: number) => void;
}) {
  const particles = useRef(feedingHeartPositions.map(() => new Animated.Value(0))).current;
  useEffect(() => {
    const animation = Animated.stagger(120, particles.map(value => Animated.timing(value, {
      toValue: 1, duration: 2400, easing: Easing.linear, useNativeDriver: true, isInteraction: false,
    })));
    animation.start(({ finished }) => { if (finished) onComplete(id); });
    return () => animation.stop();
  }, [id, onComplete, particles]);
  const baseSize = Math.max(18, Math.min(42, height * .14));
  return <View pointerEvents="none" testID={`feeding-hearts-${id}`} style={styles.fill}>
    {feedingHeartPositions.map((heart, index) => {
      const value = particles[index];
      const size = baseSize * heart.size;
      return <Animated.Image key={index} testID="feeding-heart" source={kitchenImages.heart} resizeMode="contain" style={[styles.heart, {
        left: width * heart.x - size / 2, top: height * heart.y - size / 2, width: size, height: size,
        opacity: value.interpolate({ inputRange: [0, .12, .55, 1], outputRange: [0, 1, 1, 0] }),
        transform: [
          { translateY: value.interpolate({ inputRange: [0, 1], outputRange: [0, -height * .18] }) },
          { translateX: value.interpolate({ inputRange: [0, 1], outputRange: [0, width * heart.drift] }) },
          { scale: value.interpolate({ inputRange: [0, .15, 1], outputRange: [.55, 1, 1.12] }) },
        ],
      }]} />;
    })}
  </View>;
}
