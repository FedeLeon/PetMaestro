import { BackHandler, Image, TouchableOpacity, View } from 'react-native';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { PetCat } from '../PetCat';
import { kitchenImages } from '../../data/kitchenContent';
import type { ProgressState } from '../../types';
import { styles } from '../../styles/house/kitchen.styles';
import { BreathingBathroomButton } from './BreathingBathroomButton';
import { FridgeGame } from '../kitchen/FridgeGame';
import { CookingGame } from '../kitchen/CookingGame';
import { FeedingGame } from '../kitchen/FeedingGame';
import { roomFrame } from './roomFrame';

type Props = { equippedCatItems: ProgressState['equippedCatItems']; equippedItemId: string | null; onOpenInside: () => void };
export function HouseKitchen({ equippedCatItems, equippedItemId, onOpenInside }: Props) {
  const [activity, setActivity] = useState<'fridge' | 'cook' | 'feed' | null>(null);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const { width, height } = viewport;
  const frame = roomFrame(viewport, 1.5, .62);
  const catScale = height / 300;
  const catPosition = frame.point(.64, .8);
  const buttonSize = Math.max(44, Math.min(64, height * .15));
  const close = () => { setActivity(null); setIngredients([]); };
  useFocusEffect(useCallback(() => {
    const listener = BackHandler.addEventListener('hardwareBackPress', () => { if (activity) { setActivity(null); setIngredients([]); } else onOpenInside(); return true; });
    return () => listener.remove();
  }, [activity, onOpenInside]));
  if (activity === 'fridge') return <FridgeGame onClose={close} onCook={ids => { setIngredients(ids); setActivity('cook'); }} />;
  if (activity === 'cook') return <CookingGame ids={ingredients} onClose={close} onServe={() => setActivity('feed')} />;
  if (activity === 'feed') return <FeedingGame ids={ingredients} onClose={close} />;
  return <View testID="kitchen-room" style={styles.room} onLayout={event => setViewport(event.nativeEvent.layout)}>
    <View style={[styles.scene, { width, height }]}>
      <View pointerEvents="none" style={styles.fill}><Image testID="kitchen-background" source={kitchenImages.room} resizeMode="contain" style={[styles.roomImage, frame.image]} /></View>
      <View testID="kitchen-standing-cat" pointerEvents="none" style={[styles.cat, {
        left: catPosition.x - 115,
        top: height * .94 - 142 - 79 * catScale,
        transform: [{ scale: catScale }],
      }]}>
        <PetCat equippedCatItems={equippedCatItems} equippedItemId={equippedItemId} size="room" />
      </View>
      <BreathingBathroomButton label="Abrir heladera" icon="fridge-outline" onPress={() => setActivity('fridge')} style={frame.button(.145, .40, buttonSize)} />
      <BreathingBathroomButton label="Preparar comida" icon="pot-steam-outline" onPress={() => setActivity('fridge')} delay={400} style={frame.button(.445, .44, buttonSize)} />
      <TouchableOpacity testID="kitchen-exit" accessibilityLabel="Volver al interior de la casa" accessibilityRole="button" onPress={onOpenInside} style={[styles.exit, frame.hit(.835, .27, .115, .28)]} />
    </View>
  </View>;
}
