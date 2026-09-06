import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, View } from 'react-native';
import { houseImages } from '../../data/assetImages';
import { styles } from '../../styles/house/bathroomActivity.styles';

export function BathroomWater({ handheld = false }: { handheld?: boolean }) {
  const phase = useRef(new Animated.Value(0)).current;
  const [layout, setLayout] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const animation = Animated.loop(Animated.timing(phase, { toValue: 1, duration: handheld ? 650 : 1100, easing: Easing.linear, useNativeDriver: true, isInteraction: false }));
    animation.start();
    return () => animation.stop();
  }, [handheld, phase]);
  const dropSize = handheld ? Math.max(8, layout.width * .2) : Math.max(9, Math.min(18, layout.height * .038));
  return <View pointerEvents="none" onLayout={(event) => setLayout(event.nativeEvent.layout)} style={styles.fill}>
    {Array.from({ length: handheld ? 10 : 24 }, (_, index) => {
      const travel = Animated.modulo(Animated.add(phase, index / (handheld ? 10 : 24)), 1);
      return <Animated.Image key={index} source={houseImages.bathWaterDrop} resizeMode="contain" style={[styles.waterParticle, {
        width: dropSize, height: dropSize,
        left: layout.width * (handheld ? .12 + index % 5 * .16 : .27 + index % 8 * .025) - dropSize / 2,
        top: layout.height * (handheld ? 0 : .14),
        opacity: travel.interpolate({ inputRange: [0, .12, .8, 1], outputRange: [0, .9, .85, 0] }),
        transform: [{ translateY: travel.interpolate({ inputRange: [0, 1], outputRange: [0, layout.height * (handheld ? .8 : .74)] }) }],
      }]} />;
    })}
  </View>;
}
