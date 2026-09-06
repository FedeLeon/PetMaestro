import { useEffect, useRef } from 'react';
import { Animated, Easing, Image, View } from 'react-native';
import { houseImages } from '../../data/assetImages';
import { styles } from '../../styles/house/bedroom.styles';

function SleepLetter({ index, distance }: { index: number; distance: number }) {
  const rise = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.timing(rise, { toValue: 1, duration: 2400, easing: Easing.linear, useNativeDriver: true, isInteraction: false }));
    const timeout = setTimeout(() => loop.start(), index * 800);
    return () => { clearTimeout(timeout); loop.stop(); };
  }, [index, rise]);
  return <Animated.Text style={[styles.sleepLetter, {
    fontSize: Math.max(20, distance * .5),
    opacity: rise.interpolate({ inputRange: [0, .15, .75, 1], outputRange: [0, 1, 1, 0] }),
    transform: [{ translateY: rise.interpolate({ inputRange: [0, 1], outputRange: [0, -distance] }) }, { translateX: rise.interpolate({ inputRange: [0, 1], outputRange: [0, distance * .45] }) }, { scale: rise.interpolate({ inputRange: [0, 1], outputRange: [.6, 1.3] }) }],
  }]}>Z</Animated.Text>;
}

export function SleepingCat({ left, top, width, letterX, letterY, riseDistance }: { left: number; top: number; width: number; letterX: number; letterY: number; riseDistance: number }) {
  const breath = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(breath, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.sin), useNativeDriver: true, isInteraction: false }),
      Animated.timing(breath, { toValue: 0, duration: 1500, easing: Easing.inOut(Easing.sin), useNativeDriver: true, isInteraction: false }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [breath]);
  return <>
    <Animated.View pointerEvents="none" testID="sleeping-cat" style={[styles.sleepingCat, { left, top, width, height: width / 1.5, transform: [{ scaleY: breath.interpolate({ inputRange: [0, 1], outputRange: [1, 1.035] }) }] }]}>
      <Image source={houseImages.sleepingCat} resizeMode="contain" style={styles.image} />
    </Animated.View>
    <View pointerEvents="none" testID="sleep-letters" style={[styles.letters, { left: letterX, top: letterY }]}>
      {[0, 1, 2].map(index => <SleepLetter key={index} index={index} distance={riseDistance} />)}
    </View>
  </>;
}
