import { createContext, ReactNode, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AccessibilityInfo, AppState } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

const Clock = createContext({ time: 0, reducedMotion: true });
const Controls = createContext<{ getTime: () => number; reducedMotion: boolean }>({ getTime: () => 0, reducedMotion: true });
export const useFarmAnimationClock = () => useContext(Clock);
export const useFarmAnimationControls = () => useContext(Controls);

// One 30 fps clock for all rigs. The panorama and inventory do not render on ticks.
export function FarmAnimationClock({ children, enabled }: { children: ReactNode; enabled: boolean }) {
  const focused = useIsFocused();
  const [active, setActive] = useState(AppState.currentState === 'active');
  const [reducedMotion, setReducedMotion] = useState(true);
  const [time, setTime] = useState(0);
  const elapsed = useRef(0);
  const controls = useMemo(() => ({ getTime: () => elapsed.current, reducedMotion }), [reducedMotion]);
  useEffect(() => {
    let mounted = true;
    let preferenceChanged = false;
    const app = AppState.addEventListener('change', state => setActive(state === 'active'));
    const preference = AccessibilityInfo.addEventListener('reduceMotionChanged', value => {
      preferenceChanged = true; setReducedMotion(value);
    });
    AccessibilityInfo.isReduceMotionEnabled().then(value => {
      if (mounted && !preferenceChanged) setReducedMotion(value);
    }).catch(() => { if (mounted && !preferenceChanged) setReducedMotion(false); });
    return () => { mounted = false; app.remove(); preference.remove(); };
  }, []);
  useEffect(() => {
    if (!enabled || !active || !focused || reducedMotion) return;
    let frame: number;
    let previous: number | undefined;
    const tick = (now: number) => {
      if (previous === undefined) previous = now;
      if (now - previous >= 1000 / 30 - 1) {
        elapsed.current += Math.min(50, now - previous) / 1000;
        previous = now;
        setTime(elapsed.current);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, enabled, focused, reducedMotion]);
  return <Controls.Provider value={controls}><Clock.Provider value={{ time, reducedMotion }}>{children}</Clock.Provider></Controls.Provider>;
}
