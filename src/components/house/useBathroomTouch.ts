import { useMemo, useRef } from 'react';
import { PanResponder, View } from 'react-native';

// Use window coordinates: foam, water and a moving tool can change the event
// target during a drag, so locationX/locationY are not a stable canvas origin.
export function useBathroomTouch(active: boolean, onTouch: (x: number, y: number) => void, onEnd: () => void) {
  const stageRef = useRef<View>(null);
  const origin = useRef<{ x: number; y: number } | null>(null);
  const handlers = useRef({ onTouch, onEnd });
  handlers.current = { onTouch, onEnd };
  const responder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => active,
    onMoveShouldSetPanResponder: () => active,
    onPanResponderGrant: (event) => {
      const { pageX, pageY } = event.nativeEvent;
      origin.current = null;
      stageRef.current?.measureInWindow((x, y) => {
        origin.current = { x, y };
        handlers.current.onTouch(pageX - x, pageY - y);
      });
    },
    onPanResponderMove: (event) => {
      if (origin.current) handlers.current.onTouch(event.nativeEvent.pageX - origin.current.x, event.nativeEvent.pageY - origin.current.y);
    },
    onPanResponderRelease: () => { origin.current = null; handlers.current.onEnd(); },
    onPanResponderTerminate: () => { origin.current = null; handlers.current.onEnd(); },
  }), [active]);
  return { stageRef, panHandlers: responder.panHandlers };
}
