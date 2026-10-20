import { useMemo, useRef } from 'react';
import { Image, PanResponder, View } from 'react-native';
import type { KitchenFood } from '../../data/kitchenContent';
import { styles } from '../../styles/house/kitchen.styles';

type DragCallbacks = {
  onStart: (id: string, x: number, y: number) => void;
  onMove: (x: number, y: number) => void;
  onDrop: (x: number, y: number) => void;
  onCancel: () => void;
};
export function DraggableIngredient({ food, size, added, dragging, onStart, onMove, onDrop, onCancel, onTap }: DragCallbacks & {
  onTap: (id: string) => void;
  food: KitchenFood; size: number; added: boolean; dragging: boolean;
}) {
  const origin = useRef({ x: 0, y: 0 });
  const moved = useRef(false);
  const callbacks = useRef({ onStart, onMove, onDrop, onCancel, onTap });
  callbacks.current = { onStart, onMove, onDrop, onCancel, onTap };
  const responder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => !added,
    onMoveShouldSetPanResponder: () => !added,
    onPanResponderGrant: event => { origin.current = { x: event.nativeEvent.pageX, y: event.nativeEvent.pageY }; moved.current = false; callbacks.current.onStart(food.id, event.nativeEvent.pageX, event.nativeEvent.pageY); },
    onPanResponderMove: event => { if (Math.hypot(event.nativeEvent.pageX - origin.current.x, event.nativeEvent.pageY - origin.current.y) > 12) moved.current = true; callbacks.current.onMove(event.nativeEvent.pageX, event.nativeEvent.pageY); },
    onPanResponderRelease: event => { if (!moved.current) { callbacks.current.onCancel(); callbacks.current.onTap(food.id); } else callbacks.current.onDrop(event.nativeEvent.pageX, event.nativeEvent.pageY); },
    onPanResponderTerminate: () => callbacks.current.onCancel(),
    onPanResponderTerminationRequest: () => false,
    onShouldBlockNativeResponder: () => true,
  }), [added, food.id]);
  return <View accessible={!added} accessibilityRole="button" accessibilityState={{ disabled: added }} onAccessibilityTap={() => { if (!added) onTap(food.id); }} accessibilityLabel={`${added ? 'En la olla' : 'Agregar'} ${food.name}`} accessibilityHint="Tocá para agregar o arrastrá hasta la olla" testID={`drag-food-${food.id}`} style={[styles.dragIngredient, { width: size, height: size }, dragging && styles.dragIngredientHeld, added && styles.dragIngredientAdded]} {...responder.panHandlers}>
    <View pointerEvents="none" style={styles.fill}>
      <Image accessible={false} source={food.image} resizeMode="contain" style={styles.image} />
    </View>
  </View>;
}
