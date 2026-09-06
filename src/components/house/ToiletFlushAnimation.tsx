import { useEffect, useRef } from 'react';
import { Animated, Easing, TouchableOpacity, View } from 'react-native';
import { houseImages } from '../../data/assetImages';
import { styles } from '../../styles/house/toiletGame.styles';

export function ToiletFlushAnimation({ flushing, onFlush }: { flushing: boolean; onFlush: () => void }) {
  const pull = useRef(new Animated.Value(0)).current;
  const water = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!flushing) return;
    const animation = Animated.parallel([
      Animated.sequence([
        Animated.timing(pull, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.timing(pull, { toValue: 0, duration: 420, useNativeDriver: true }),
      ]),
      Animated.timing(water, { toValue: 1, duration: 2200, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
    ]);
    animation.start();
    return () => animation.stop();
  }, [flushing, pull, water]);
  return <>
    <TouchableOpacity testID="flush-chain" accessibilityRole="button" accessibilityLabel="Accionar tirador de la cadena" accessibilityState={{ disabled: flushing }} disabled={flushing} onPress={onFlush} style={styles.chainHit}>
      <Animated.Image source={houseImages.toiletFlushChain} resizeMode="contain" style={[styles.asset, { transform: [{ translateY: pull.interpolate({ inputRange: [0, 1], outputRange: [0, 18] }) }] }]} />
    </TouchableOpacity>
    {flushing ? <View testID="flush-water" pointerEvents="none" style={styles.flushWindow}>
      <Animated.Image source={houseImages.toiletFlushWater} resizeMode="contain" style={[styles.asset, {
        opacity: water.interpolate({ inputRange: [0, .8, 1], outputRange: [1, 1, .15] }),
        transform: [{ rotate: water.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '900deg'] }) }, { scale: water.interpolate({ inputRange: [0, .7, 1], outputRange: [1, .85, .2] }) }],
      }]} />
    </View> : null}
  </>;
}
