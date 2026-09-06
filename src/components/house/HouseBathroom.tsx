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

type Props = {
  equippedCatItems: ProgressState['equippedCatItems'];
  equippedItemId: string | null;
  onOpenInside: () => void;
};

export function HouseBathroom({ equippedCatItems, equippedItemId, onOpenInside }: Props) {
  const [activity, setActivity] = useState<'teeth' | 'shower' | 'toilet' | null>(null);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const sceneWidth = Math.min(viewport.width, viewport.height * 1672 / 941);
  const sceneHeight = sceneWidth * 941 / 1672;
  const buttonSize = Math.max(44, Math.min(68, sceneHeight * .14));
  const bubblePosition = (x: number, y: number) => ({ left: sceneWidth * x - buttonSize / 2, top: sceneHeight * y - buttonSize / 2, width: buttonSize, height: buttonSize });
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

  return <View style={styles.room} onLayout={(event) => setViewport(event.nativeEvent.layout)}>
    <View style={[styles.scene, { width: sceneWidth, height: sceneHeight }]}>
      <View pointerEvents="none" style={styles.background}><Image resizeMode="contain" source={houseImages.bathroomInterior} style={styles.roomBackgroundImage} /></View>
      <BreathingBathroomButton label="Lavarse los dientes" icon="toothbrush" onPress={() => setActivity('teeth')} style={bubblePosition(.36, .26)} />
      <BreathingBathroomButton label="Bañarse" icon="shower-head" onPress={() => setActivity('shower')} style={bubblePosition(.68, .15)} delay={350} />
      <BreathingBathroomButton label="Usar inodoro" icon="toilet" onPress={() => setActivity('toilet')} style={bubblePosition(.88, .28)} delay={700} />
      <View pointerEvents="none" style={[styles.staticCat, { left: sceneWidth * .5 - 115, top: sceneHeight * .73 - 142, transform: [{ scale: sceneHeight * .35 / 390 }] }]}>
        <PetCat equippedCatItems={equippedCatItems} equippedItemId={equippedItemId} size="bathroom" />
      </View>
      <TouchableOpacity accessibilityLabel="Volver al interior de la casa" accessibilityRole="button" onPress={onOpenInside} style={styles.exitDoorHit} />
    </View>
  </View>;
}
