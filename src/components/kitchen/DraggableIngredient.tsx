import { useMemo, useRef } from 'react';
import { Image, PanResponder, Text, View } from 'react-native';
import type { KitchenFood } from '../../data/kitchenContent';
import { styles } from '../../styles/house/kitchen.styles';

type DragCallbacks = {
  onStart: (id: string, x: number, y: number) => void;
  onMove: (x: number, y: number) => void;
  onDrop: (x: number, y: number) => void;
  onCancel: () => void;
};
export function DraggableIngredient({ food, added, dragging, onStart, onMove, onDrop, onCancel }: DragCallbacks & {
  food: KitchenFood; added: boolean; dragging: boolean;
}) {
  const callbacks = useRef({ onStart, onMove, onDrop, onCancel });
  callbacks.current = { onStart, onMove, onDrop, onCancel };
  const responder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => !added,
    onMoveShouldSetPanResponder: () => !added,
    onPanResponderGrant: event => callbacks.current.onStart(food.id, event.nativeEvent.pageX, event.nativeEvent.pageY),
    onPanResponderMove: event => callbacks.current.onMove(event.nativeEvent.pageX, event.nativeEvent.pageY),
    onPanResponderRelease: event => callbacks.current.onDrop(event.nativeEvent.pageX, event.nativeEvent.pageY),
    onPanResponderTerminate: () => callbacks.current.onCancel(),
    onPanResponderTerminationRequest: () => false,
    onShouldBlockNativeResponder: () => true,
  }), [added, food.id]);
  return <View accessible accessibilityLabel={`${added ? 'En la olla' : 'Arrastrar'} ${food.name}`} accessibilityHint="Arrastrá este alimento y soltalo dentro de la olla" testID={`drag-food-${food.id}`} style={[styles.dragCard, (added || dragging) && styles.disabled]} {...responder.panHandlers}>
    <View pointerEvents="none" style={styles.dragCardContent}>
      <Image source={food.image} resizeMode="contain" style={styles.dragCardImage} />
      <Text numberOfLines={1} style={styles.foodLabelText}>{added ? '✓' : food.name}</Text>
    </View>
  </View>;
}
