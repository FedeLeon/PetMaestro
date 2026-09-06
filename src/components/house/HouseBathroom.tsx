import { BackHandler, Image, TouchableOpacity, View } from 'react-native';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { PetCat } from '../PetCat';
import { houseImages } from '../../data/assetImages';
import type { ProgressState } from '../../types';
import { styles } from '../../styles/house/bathroom.styles';
import { ToothBrushingGame } from './ToothBrushingGame';
import { ShowerGame } from './ShowerGame';
import { ToiletGame } from './ToiletGame';
import { BreathingBathroomButton } from './BreathingBathroomButton';
import { roomFrame } from './roomFrame';

type Props = {
  equippedCatItems: ProgressState['equippedCatItems'];
  equippedItemId: string | null;
  onOpenInside: () => void;
};

export function HouseBathroom({ equippedCatItems, equippedItemId, onOpenInside }: Props) {
  const [activity, setActivity] = useState<'teeth' | 'shower' | 'toilet' | null>(null);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const { width: sceneWidth, height: sceneHeight } = viewport;
  const frame = roomFrame(viewport, 1672 / 941, .60);
  const catScale = sceneHeight / 300;
  const buttonSize = Math.max(44, Math.min(68, sceneHeight * .14));
  const closeActivity = () => setActivity(null);
  useFocusEffect(useCallback(() => {
    const listener = BackHandler.addEventListener('hardwareBackPress', () => {
      if (activity) setActivity(null);
      else onOpenInside();
      return true;
    });
    return () => listener.remove();
  }, [activity, onOpenInside]));

  if (activity === 'teeth') return <ToothBrushingGame onClose={closeActivity} />;
  if (activity === 'shower') return <ShowerGame onClose={closeActivity} />;
  if (activity === 'toilet') return <ToiletGame onClose={closeActivity} />;

  return <View testID="bathroom-room" style={styles.room} onLayout={(event) => setViewport(event.nativeEvent.layout)}>
    <View style={[styles.scene, { width: sceneWidth, height: sceneHeight }]}>
      <View pointerEvents="none" style={styles.background}><Image testID="bathroom-background" resizeMode="contain" source={houseImages.bathroomInterior} style={[styles.roomBackgroundImage, frame.image]} /></View>
      <BreathingBathroomButton label="Lavarse los dientes" icon="toothbrush" onPress={() => setActivity('teeth')} style={frame.button(.36, .37, buttonSize)} />
      <BreathingBathroomButton label="Bañarse" icon="shower-head" onPress={() => setActivity('shower')} style={frame.button(.68, .40, buttonSize)} delay={350} />
      <BreathingBathroomButton label="Usar inodoro" icon="toilet" onPress={() => setActivity('toilet')} style={frame.button(.88, .44, buttonSize)} delay={700} />
      <View testID="bathroom-standing-cat" pointerEvents="none" style={[styles.staticCat, {
        left: sceneWidth * .5 - 115,
        top: sceneHeight * .94 - 142 - 79 * catScale,
        transform: [{ scale: catScale }],
      }]}>
        <PetCat equippedCatItems={equippedCatItems} equippedItemId={equippedItemId} size="room" />
      </View>
      <TouchableOpacity testID="bathroom-exit" accessibilityLabel="Volver al interior de la casa" accessibilityRole="button" onPress={onOpenInside} style={[styles.exitDoorHit, frame.hit(.035, .10, .13, .50)]} />
    </View>
  </View>;
}
