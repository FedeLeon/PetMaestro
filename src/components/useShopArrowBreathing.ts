import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, AppState, Easing } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

export function useShopArrowBreathing(enabled: boolean) {
  const scale = useRef(new Animated.Value(1)).current;
  const focused = useIsFocused();
  const [active, setActive] = useState(AppState.currentState === 'active');
  const [reducedMotion, setReducedMotion] = useState(true);
  useEffect(() => {
    let alive = true;
    let preferenceChanged = false;
    const app = AppState.addEventListener('change', state => setActive(state === 'active'));
    const preference = AccessibilityInfo.addEventListener('reduceMotionChanged', value => {
      preferenceChanged = true;
      setReducedMotion(value);
    });
    void AccessibilityInfo.isReduceMotionEnabled().then(value => {
      if (alive && !preferenceChanged) setReducedMotion(value);
    }).catch(() => { if (alive && !preferenceChanged) setReducedMotion(false); });
    return () => { alive = false; app.remove(); preference.remove(); };
  }, []);
  useEffect(() => {
    scale.setValue(1);
    if (!enabled || !focused || !active || reducedMotion) return;
    const breathing = Animated.loop(Animated.sequence([
      Animated.timing(scale, { toValue: 1.06, duration: 1100, easing: Easing.inOut(Easing.sin), useNativeDriver: true, isInteraction: false }),
      Animated.timing(scale, { toValue: 1, duration: 1100, easing: Easing.inOut(Easing.sin), useNativeDriver: true, isInteraction: false }),
    ]));
    breathing.start();
    return () => { breathing.stop(); scale.stopAnimation(); scale.setValue(1); };
  }, [active, enabled, focused, reducedMotion, scale]);
  return scale;
}
