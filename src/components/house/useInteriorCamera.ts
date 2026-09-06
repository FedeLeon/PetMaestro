import { useEffect, useMemo, useRef } from 'react';
import { PanResponder, ScrollView } from 'react-native';

export function useInteriorCamera({ width, viewportWidth, scale, initialRatio, onRatioChange }: {
  width: number; viewportWidth: number; scale: number; initialRatio: number; onRatioChange: (ratio: number) => void;
}) {
  const scrollRef = useRef<ScrollView>(null);
  const offset = useRef(0);
  const ratio = useRef(initialRatio);
  const following = useRef(false);
  const dragging = useRef(false);
  const dragOrigin = useRef(0);
  const suppressPressUntil = useRef(0);
  const previousCatX = useRef(410);
  const current = useRef({ width, viewportWidth, scale, onRatioChange });
  current.current = { width, viewportWidth, scale, onRatioChange };
  const moveTo = (requested: number) => {
    const max = Math.max(0, current.current.width - current.current.viewportWidth);
    const x = Math.max(0, Math.min(max, requested));
    offset.current = x;
    ratio.current = max ? x / max : 0;
    current.current.onRatioChange(ratio.current);
    scrollRef.current?.scrollTo({ x, animated: false });
  };
  const maxOffset = Math.max(0, width - viewportWidth);
  useEffect(() => { if (width > 0 && viewportWidth > 0) moveTo(ratio.current * maxOffset); }, [maxOffset, width, viewportWidth]);
  const panHandlers = useMemo(() => PanResponder.create({
    // A tap still belongs to a door or the floor. Claim only a horizontal drag.
    onStartShouldSetPanResponderCapture: () => { following.current = false; return false; },
    onMoveShouldSetPanResponderCapture: (_, gesture) => Math.abs(gesture.dx) > 8 && Math.abs(gesture.dx) > Math.abs(gesture.dy),
    onPanResponderGrant: (_, gesture) => {
      dragging.current = true; following.current = false; dragOrigin.current = offset.current;
      moveTo(dragOrigin.current - gesture.dx);
    },
    onPanResponderMove: (_, gesture) => moveTo(dragOrigin.current - gesture.dx),
    onPanResponderRelease: () => { dragging.current = false; suppressPressUntil.current = Date.now() + 150; },
    onPanResponderTerminate: () => { dragging.current = false; suppressPressUntil.current = Date.now() + 150; },
    onPanResponderTerminationRequest: () => false,
  }).panHandlers, []);
  const followCat = (x: number) => {
    const direction = x - previousCatX.current; previousCatX.current = x;
    if (!following.current || dragging.current) return;
    const { scale: zoom, viewportWidth: visibleWidth } = current.current;
    const center = (x + 115) * zoom;
    const edge = Math.min(160, visibleWidth * .22);
    const left = offset.current, right = left + visibleWidth;
    // Follow the walking direction inside an edge band, never snap back to an
    // offscreen cat after the player has deliberately moved the camera away.
    if (direction > 0 && center > right - edge && center < right + edge) moveTo(left + Math.min(12, center - (right - edge)));
    else if (direction < 0 && center < left + edge && center > left - edge) moveTo(left - Math.min(12, left + edge - center));
  };
  return {
    scrollRef, panHandlers, followCat,
    startFollowing: () => { following.current = true; },
    canTap: () => !dragging.current && Date.now() > suppressPressUntil.current,
  };
}
