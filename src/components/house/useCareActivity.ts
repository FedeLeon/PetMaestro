import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
export function useCareActivity() {
  const focused = useIsFocused();
  const [foreground, setForeground] = useState(AppState.currentState === 'active');
  const active = focused && foreground;
  const live = useRef(active);
  live.current = active;
  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      if (state !== 'active') live.current = false;
      setForeground(state === 'active');
    });
    return () => { live.current = false; subscription.remove(); };
  }, []);
  return { active, live };
}
