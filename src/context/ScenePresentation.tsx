import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { usePresentation } from '../presentation/usePresentation';

type Activity = { hideHud: boolean; exit: () => void };
const ScenePresentation = createContext<{ activity: Activity | null; setActivity: (activity: Activity | null) => void }>({ activity: null, setActivity: () => {} });

// Scoped to one house screen: activities cannot hide another route's navigation.
export function ScenePresentationProvider({ children }: { children: ReactNode }) {
  const [activity, setActivity] = useState<Activity | null>(null);
  const value = useMemo(() => ({ activity, setActivity }), [activity]);
  return <ScenePresentation.Provider value={value}>{children}</ScenePresentation.Provider>;
}
export function useScenePresentation() { return useContext(ScenePresentation); }
export function useSceneActivity(active: boolean, onExit: () => void, hideHud = true) {
  const presentation = usePresentation();
  const focused = useIsFocused();
  const { setActivity } = useScenePresentation();
  const exitRef = useRef(onExit);
  exitRef.current = onExit;
  const exit = useCallback(() => exitRef.current(), []);
  const immersive = presentation.policy.isImmersiveActivity(active, focused);
  useLayoutEffect(() => {
    if (!immersive) return;
    setActivity({ hideHud, exit });
    return () => setActivity(null);
  }, [immersive, hideHud, exit, setActivity]);
  return immersive;
}
