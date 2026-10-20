import { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';

export const YARN_FEEDBACK_MS = 650;

export function useYarnCatchFeedback(position: Animated.ValueXY, active: boolean) {
  const center = useRef({ x: 0, y: 0 });
  const sequence = useRef(0);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number }[]>([]);
  useEffect(() => {
    const listener = position.addListener(value => { center.current = value; });
    return () => position.removeListener(listener);
  }, [position]);
  useEffect(() => {
    if (!active) setBursts([]);
    const pending = timers.current;
    return () => { pending.forEach(clearTimeout); pending.clear(); };
  }, [active]);
  const showBurst = () => {
    const id = ++sequence.current;
    // Snapshot the hit position: the sparkle stays where the child caught it,
    // even when reduced-motion play immediately offers a new yarn position.
    setBursts(current => [...current, { id, ...center.current }]);
    const timer = setTimeout(() => {
      timers.current.delete(timer);
      setBursts(current => current.filter(burst => burst.id !== id));
    }, YARN_FEEDBACK_MS);
    timers.current.add(timer);
  };
  return { bursts, showBurst };
}
