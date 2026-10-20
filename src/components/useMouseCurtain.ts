import { useCallback, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, AppState, Easing } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { mouseCurtainTiming } from '../data/mouseHideAndSeek';

export type MouseCurtainPhase = 'idle' | 'found' | 'closing' | 'closed' | 'opening';

// The hiding place changes only after both opaque panels have met in the middle.
export function useMouseCurtain(onMove: () => void, onComplete: () => void) {
  const progress = useRef(new Animated.Value(0)).current;
  const [phase, setPhase] = useState<MouseCurtainPhase>('idle');
  const busy = useRef(false);
  const pendingMove = useRef(false);
  const completeDue = useRef(false);
  const focused = useRef(false);
  const reducedMotion = useRef(false);
  const serial = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbacks = useRef({ onMove, onComplete });
  callbacks.current = { onMove, onComplete };
  useEffect(() => {
    let alive = true;
    void AccessibilityInfo.isReduceMotionEnabled().then(value => { if (alive) reducedMotion.current = value; }).catch(() => {});
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', value => { reducedMotion.current = value; });
    return () => { alive = false; subscription.remove(); };
  }, []);
  const cancel = useCallback(() => {
    serial.current += 1;
    if (timer.current) clearTimeout(timer.current);
    progress.stopAnimation();
  }, [progress]);
  const animate = useCallback(() => {
    cancel();
    const run = serial.current;
    const valid = () => focused.current && run === serial.current;
    setPhase('closing');
    Animated.timing(progress, { toValue: 1, duration: reducedMotion.current ? 80 : mouseCurtainTiming.close, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }).start(({ finished }) => {
      if (!finished || !valid()) return;
      setPhase('closed');
      if (pendingMove.current) {
        pendingMove.current = false;
        callbacks.current.onMove();
      }
      timer.current = setTimeout(() => {
        if (!valid()) return;
        setPhase('opening');
        Animated.timing(progress, { toValue: 0, duration: reducedMotion.current ? 80 : mouseCurtainTiming.open, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }).start(({ finished: opened }) => {
          if (!opened || !valid()) return;
          busy.current = false;
          setPhase('idle');
          if (completeDue.current) {
            completeDue.current = false;
            callbacks.current.onComplete();
          }
        });
      }, mouseCurtainTiming.covered);
    });
  }, [cancel, progress]);
  useFocusEffect(useCallback(() => {
    focused.current = AppState.currentState === 'active';
    if (focused.current && busy.current) animate();
    const subscription = AppState.addEventListener('change', state => {
      focused.current = state === 'active';
      if (!focused.current) cancel();
      else if (busy.current) animate();
    });
    return () => { focused.current = false; cancel(); subscription.remove(); };
  }, [animate, cancel]));
  const start = (lastFind: boolean) => {
    if (!focused.current || busy.current) return false;
    busy.current = true;
    pendingMove.current = true;
    completeDue.current = lastFind;
    setPhase('found');
    timer.current = setTimeout(animate, mouseCurtainTiming.reveal);
    return true;
  };
  return { progress, phase, start };
}
