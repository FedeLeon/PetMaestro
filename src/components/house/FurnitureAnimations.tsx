import { useEffect, useId, useRef } from 'react';
import { Animated, Image, View } from 'react-native';
import Svg, { Defs, Ellipse, G, Path, RadialGradient, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import { furnitureImages, houseImages } from '../../data/assetImages';
import { useFarmAnimationClock } from '../FarmAnimationClock';
import type { HouseLampId } from './useHouseLamps';
import { styles } from '../../styles/house/furnitureInteraction.styles';

export function SoftBedCat() {
  const { time, reducedMotion } = useFarmAnimationClock();
  const appear = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const animation = Animated.timing(appear, { toValue: 1, duration: reducedMotion ? 0 : 280, useNativeDriver: true, isInteraction: false });
    animation.start();
    return () => animation.stop();
  }, [appear, reducedMotion]);
  return <>
    <Animated.View testID="soft-bed-resting-cat" style={[styles.restingCat, { opacity: appear, transform: [{ scaleY: reducedMotion ? 1 : 1 + Math.sin(time * 2) * .02 }] }]}>
      <Image source={houseImages.sleepingCat} resizeMode="contain" style={styles.image} />
    </Animated.View>
    <View style={styles.sleepLetters} pointerEvents="none"><Svg width="100%" height="100%" viewBox="0 0 40 32">
      <G transform={`translate(0 ${reducedMotion ? 0 : -Math.sin(time * 1.5) * 2})`}><SvgText x={4} y={26} fill="#72569e" fontSize={13} fontWeight="bold">z</SvgText><SvgText x={15} y={17} fill="#72569e" fontSize={16} fontWeight="bold">z</SvgText><SvgText x={28} y={8} fill="#72569e" fontSize={12} fontWeight="bold">z</SvgText></G>
    </Svg></View>
  </>;
}

// Repaint the front rim over the kitten so it lies inside the cushion.
export function SoftBedFront({ height }: { height: number }) {
  return <View pointerEvents="none" style={[styles.fill, { top: height * .69, overflow: 'hidden' }]}>
    <Image source={furnitureImages['soft-bed']} resizeMode="contain" style={[styles.image, { position: 'absolute', top: -height * .69, height }]} />
  </View>;
}

export function HouseLamp({ id, lit }: { id: HouseLampId; lit: boolean }) {
  const prefix = `lamp${useId().replace(/\W/g, '')}`;
  const { reducedMotion } = useFarmAnimationClock();
  const light = useRef(new Animated.Value(lit ? 1 : 0)).current;
  useEffect(() => {
    const animation = Animated.timing(light, { toValue: lit ? 1 : 0, duration: reducedMotion ? 0 : 260, useNativeDriver: true, isInteraction: false });
    animation.start();
    return () => animation.stop();
  }, [light, lit, reducedMotion]);
  const fish = id === 'fish-lamp';
  const center = fish ? 43 : 32;
  return <>
    <Animated.View testID={lit ? `lamp-glow-${id}` : undefined} pointerEvents="none" style={[styles.lampGlow, { opacity: light }]}>
      <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <Defs>
          <RadialGradient id={`${prefix}halo`}><Stop offset="0" stopColor="#fff5bd" stopOpacity={.78} /><Stop offset=".45" stopColor="#ffe180" stopOpacity={.32} /><Stop offset="1" stopColor="#ffd05b" stopOpacity={0} /></RadialGradient>
          <LinearGradient id={`${prefix}beam`} x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#fff1ad" stopOpacity={.3} /><Stop offset="1" stopColor="#ffe08b" stopOpacity={0} /></LinearGradient>
        </Defs>
        <Path d={`M43 ${center + 5}H57L88 98H12Z`} fill={`url(#${prefix}beam)`} />
        <Ellipse cx={50} cy={center} rx={48} ry={35} fill={`url(#${prefix}halo)`} />
      </Svg>
    </Animated.View>
    <Image source={furnitureImages[id]} resizeMode="contain" style={styles.image} />
    <Animated.View pointerEvents="none" style={[styles.fill, { opacity: light.interpolate({ inputRange: [0, 1], outputRange: [.25, 0] }) }]}>
      <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <Path d={fish ? 'M14 37Q12 18 35 11L40 3Q47 -3 54 6Q64 4 68 14L74 35Q89 12 98 23L97 47Q96 61 87 56L77 50L80 58Q46 67 18 57L23 47Z' : 'M39 7Q50 4 61 7L73 28Q74 34 68 35Q50 38 31 35Q25 33 28 28Z'} fill="#775f56" />
      </Svg>
    </Animated.View>
  </>;
}
