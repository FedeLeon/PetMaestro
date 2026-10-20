import { useEffect, useMemo, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, AppState, Easing } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { yarnTrack } from '../styles/components/rollingYarn.layout';

export function useRollingYarnMotion(width: number, height: number, size: number, count: number, enabled: boolean) {
  const position = useRef(new Animated.ValueXY()).current;
  const rotation = useRef(new Animated.Value(0)).current;
  const focused = useIsFocused();
  const [active, setActive] = useState(AppState.currentState === 'active');
  const [reducedMotion, setReducedMotion] = useState(true);
  const points = useMemo(() => yarnTrack(width, height, size), [width, height, size]);
  useEffect(() => {
    let alive = true;
    let changed = false;
    const app = AppState.addEventListener('change', state => setActive(state === 'active'));
    const preference = AccessibilityInfo.addEventListener('reduceMotionChanged', value => { changed = true; setReducedMotion(value); });
    void AccessibilityInfo.isReduceMotionEnabled().then(value => { if (alive && !changed) setReducedMotion(value); }).catch(() => { if (alive && !changed) setReducedMotion(false); });
    return () => { alive = false; app.remove(); preference.remove(); };
  }, []);
  useEffect(() => {
    if (!width || !height || !active || !focused || !enabled) return;
    position.setValue(points[0]);
    rotation.setValue(0);
    if (reducedMotion) return;
    let alive = true;
    let index = 1;
    let previous = points[0];
    let segment: Animated.CompositeAnimation;
    const roll = () => {
      const next = points[index];
      const duration = Math.max(1200, Math.hypot(next.x - previous.x, next.y - previous.y) / (width * .13) * 1000);
      const easing = Easing.inOut(Easing.sin);
      // Horizontal travel determines spin, so it reverses when rolling left.
      const degrees = (next.x - points[0].x) / (Math.PI * size * .75) * 360;
      segment = Animated.parallel([
        Animated.timing(position, { toValue: next, duration, easing, useNativeDriver: true, isInteraction: false }),
        Animated.timing(rotation, { toValue: degrees, duration, easing, useNativeDriver: true, isInteraction: false }),
      ]);
      segment.start(({ finished }) => {
        if (!alive || !finished) return;
        previous = next;
        index = (index + 1) % points.length;
        roll();
      });
    };
    roll();
    return () => { alive = false; segment?.stop(); position.stopAnimation(); rotation.stopAnimation(); };
  }, [active, enabled, focused, height, points, position, reducedMotion, rotation, size, width]);
  useEffect(() => {
    // No automatic motion under the OS preference; each touch offers a new spot.
    if (reducedMotion && active && focused && enabled && width && height) {
      position.setValue(points[count % points.length]);
      rotation.setValue(0);
    }
  }, [active, count, enabled, focused, height, points, position, reducedMotion, rotation, width]);
  return { position, rotation, active: active && focused, interactive: active && focused && enabled };
}
