import { useEffect, useRef } from 'react';
import { Animated, Image, Text, View } from 'react-native';
import { uiImages } from '../data/assetImages';
import { styles } from '../styles/components/coinRewardNotice.styles';

export function CoinRewardNotice({ amount, label }: { amount: number; label: string }) {
  const animation = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const sequence = Animated.sequence([
      Animated.timing(animation, { toValue: 1, duration: 140, useNativeDriver: true }),
      Animated.delay(1250),
      Animated.timing(animation, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]);
    sequence.start(); return () => sequence.stop();
  }, [animation]);
  return <Animated.View pointerEvents="none" testID="coin-reward-notice" accessibilityLiveRegion="polite" accessibilityLabel={`${label} Más ${amount} monedas`} style={[styles.notice, { opacity: animation }]}>
    <Image accessible={false} source={uiImages.goldenPawCoin} resizeMode="contain" style={styles.coin} />
    <View><Text style={styles.amount}>+{amount}</Text><Text style={styles.label}>Premio: {label}</Text></View>
  </Animated.View>;
}
