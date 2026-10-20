import { useEffect, useMemo, useRef } from 'react';
import { PanResponder, View } from 'react-native';

// Use window coordinates: foam, water and a moving tool can change the event
// target during a drag, so locationX/locationY are not a stable canvas origin.
export function useBathroomTouch(active: boolean, onTouch: (x: number, y: number) => void, onEnd: () => void) {
  const stageRef = useRef<View>(null);
  const origin = useRef<{ x: number; y: number } | null>(null);
  const session = useRef<{ x: number; y: number; lastX: number; lastY: number; released: boolean } | null>(null);
  const handlers = useRef({ onTouch, onEnd });
  handlers.current = { onTouch, onEnd };
  useEffect(() => {
    if (!active) { origin.current = null; session.current = null; }
    return () => { origin.current = null; session.current = null; };
  }, [active]);
  const responder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => active,
    onMoveShouldSetPanResponder: () => active,
    onPanResponderGrant: (event) => {
      const { pageX, pageY } = event.nativeEvent;
      const gesture = { x: pageX, y: pageY, lastX: pageX, lastY: pageY, released: false };
      session.current = gesture;
      origin.current = null;
      stageRef.current?.measureInWindow((x, y) => {
        if (session.current !== gesture) return;
        origin.current = { x, y };
        handlers.current.onTouch(pageX - x, pageY - y);
        if (gesture.lastX !== gesture.x || gesture.lastY !== gesture.y) handlers.current.onTouch(gesture.lastX - x, gesture.lastY - y);
        // A short tap can finish before native measurement returns. Apply it
        // before onEnd so repeated taps do not leave a stale brush position.
        if (gesture.released) { origin.current = null; session.current = null; handlers.current.onEnd(); }
      });
    },
    onPanResponderMove: (event) => {
      if (session.current) { session.current.lastX = event.nativeEvent.pageX; session.current.lastY = event.nativeEvent.pageY; }
      if (origin.current) handlers.current.onTouch(event.nativeEvent.pageX - origin.current.x, event.nativeEvent.pageY - origin.current.y);
    },
    onPanResponderRelease: () => {
      if (session.current && !origin.current) { session.current.released = true; return; }
      origin.current = null; session.current = null; handlers.current.onEnd();
    },
    onPanResponderTerminate: () => { origin.current = null; session.current = null; handlers.current.onEnd(); },
  }), [active]);
  return { stageRef, panHandlers: responder.panHandlers };
}
