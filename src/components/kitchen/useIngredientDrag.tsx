import { useEffect, useRef, useState } from 'react';
import { Animated, View } from 'react-native';
import { kitchenFoods } from '../../data/kitchenContent';
import { styles } from '../../styles/house/kitchen.styles';

type Rect = { x: number; y: number; width: number; height: number };
// Keep the floating food above both the scene and the right-hand ScrollView.
// Window coordinates are shared across the two, regardless of the touch target.
export function useIngredientDrag(onAdded: (id: string) => void) {
  const rootRef = useRef<View>(null);
  const stageRef = useRef<View>(null);
  const geometry = useRef<{ root: Rect; stage: Rect } | null>(null);
  const active = useRef<string | null>(null);
  const settling = useRef(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [iconSize, setIconSize] = useState(72);
  const position = useRef(new Animated.ValueXY()).current;
  const lastPoint = useRef({ x: 0, y: 0 });
  const notify = useRef(onAdded); notify.current = onAdded;
  const cancel = () => { active.current = null; settling.current = false; geometry.current = null; setDragId(null); setVisible(false); position.stopAnimation(); };
  useEffect(() => () => { active.current = null; position.stopAnimation(); }, [position]);
  const move = (x: number, y: number) => {
    lastPoint.current = { x, y };
    if (!active.current || settling.current || !geometry.current) return;
    position.setValue({ x: x - geometry.current.root.x, y: y - geometry.current.root.y });
  };
  const start = (id: string, x: number, y: number) => {
    if (active.current) return;
    active.current = id; geometry.current = null; setDragId(id); lastPoint.current = { x, y };
    rootRef.current?.measureInWindow((rx, ry, rw, rh) => {
      stageRef.current?.measureInWindow((sx, sy, sw, sh) => {
        if (active.current !== id || !sw || !sh) return;
        geometry.current = { root: { x: rx, y: ry, width: rw, height: rh }, stage: { x: sx, y: sy, width: sw, height: sh } };
        setIconSize(Math.max(58, Math.min(110, sh * .25)));
        move(lastPoint.current.x, lastPoint.current.y); setVisible(true);
      });
    });
  };
  const drop = (x: number, y: number) => {
    if (!active.current || settling.current) return;
    const id = active.current, rects = geometry.current;
    if (!rects) { cancel(); return; }
    const nx = (x - rects.stage.x) / rects.stage.width, ny = (y - rects.stage.y) / rects.stage.height;
    if (((nx - .445) / .19) ** 2 + ((ny - .48) / .16) ** 2 > 1) { cancel(); return; }
    settling.current = true;
    Animated.spring(position, { toValue: { x: rects.stage.x + rects.stage.width * .445 - rects.root.x, y: rects.stage.y + rects.stage.height * .48 - rects.root.y }, speed: 22, bounciness: 2, useNativeDriver: true }).start(({ finished }) => {
      if (finished && active.current === id) { cancel(); notify.current(id); }
    });
  };
  const food = kitchenFoods.find(item => item.id === dragId);
  const overlay = visible && food ? <View pointerEvents="none" style={styles.fill}><Animated.Image testID="dragging-ingredient" source={food.image} resizeMode="contain" style={[styles.dragOverlay, { width: iconSize, height: iconSize, left: -iconSize / 2, top: -iconSize / 2, transform: position.getTranslateTransform() }]} /></View> : null;
  return { rootRef, stageRef, dragId, overlay, start, move, drop, cancel };
}
