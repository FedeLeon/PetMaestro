import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useProgress } from '../../context/ProgressContext';
import { useActivitySound } from './useActivitySound';
import { useCareActivity } from './useCareActivity';

export function useBedroomSleep() {
  const { completeSleep } = useProgress();
  const care = useCareActivity();
  const save = useRef(completeSleep);
  save.current = completeSleep;
  const darkness = useRef(new Animated.Value(0)).current;
  const animation = useRef<Animated.CompositeAnimation | null>(null);
  const running = useRef(false);
  const generation = useRef(0);
  const [phase, setPhase] = useState<'awake' | 'sleeping' | 'rested'>('awake');
  useActivitySound(phase === 'sleeping', 'sleep');
  const [error, setError] = useState(false);
  useEffect(() => {
    if (care.active) return;
    generation.current++; running.current = false; animation.current?.stop(); darkness.setValue(0); setPhase('awake');
  }, [care.active, darkness]);
  useFocusEffect(useCallback(() => {
    setPhase('awake');
    return () => {
      generation.current += 1;
      running.current = false;
      animation.current?.stop();
      darkness.setValue(0);
    };
  }, [darkness]));
  const start = () => {
    if (running.current || !care.live.current) return;
    running.current = true;
    const current = ++generation.current;
    setError(false);
    setPhase('sleeping');
    const sequence = Animated.sequence([
      Animated.timing(darkness, { toValue: .72, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.delay(6500),
      Animated.timing(darkness, { toValue: 0, duration: 900, useNativeDriver: true }),
    ]);
    animation.current = sequence;
    sequence.start(async ({ finished }) => {
      if (!finished || current !== generation.current || !care.live.current) return;
      try {
        await save.current();
        if (current === generation.current) setPhase('rested');
      } catch {
        if (current === generation.current) { setError(true); setPhase('awake'); }
      } finally {
        if (current === generation.current) running.current = false;
      }
    });
  };
  return { phase, darkness, start, error };
}
