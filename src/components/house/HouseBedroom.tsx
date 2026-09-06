import { useCallback, useState } from 'react';
import { Animated, BackHandler, Image, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { PetCat } from '../PetCat';
import { houseImages } from '../../data/assetImages';
import { styles } from '../../styles/house/bedroom.styles';
import type { ProgressState } from '../../types';
import { roomFrame } from './roomFrame';
import { BreathingBathroomButton } from './BreathingBathroomButton';
import { SleepingCat } from './SleepingCat';
import { useBedroomSleep } from './useBedroomSleep';

export function HouseBedroom({ equippedCatItems, equippedItemId, onOpenInside }: { equippedCatItems: ProgressState['equippedCatItems']; equippedItemId: string | null; onOpenInside: () => void }) {
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const { width, height } = viewport;
  const frame = roomFrame(viewport, 1.5, .64);
  const sleep = useBedroomSleep();
  const sleeping = sleep.phase === 'sleeping';
  const buttonSize = Math.max(44, Math.min(68, height * .15));
  const kitten = frame.point(.70, .385);
  const letter = frame.point(.84, .41);
  useFocusEffect(useCallback(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => { onOpenInside(); return true; });
    return () => subscription.remove();
  }, [onOpenInside]));
  return <View style={styles.room} onLayout={event => setViewport(event.nativeEvent.layout)}>
    <View testID="cat-bedroom" style={[styles.scene, { width, height }]}>
      <View pointerEvents="none" style={styles.fill}><Image testID="bedroom-background" source={houseImages.bedroom} resizeMode="contain" style={[styles.backgroundImage, frame.image]} /></View>
      {!sleeping && <View testID="bedroom-awake-cat" pointerEvents="none" style={[styles.cat, { left: width * .42 - 115, top: height * .75 - 142 - 79 * height / 530, transform: [{ scale: height / 265 }] }]}><PetCat equippedCatItems={equippedCatItems} equippedItemId={equippedItemId} size="room" /></View>}
      {sleeping && <SleepingCat left={kitten.x} top={Math.max(8, kitten.y)} width={frame.image.width * .19} letterX={letter.x} letterY={Math.max(height * .34, letter.y)} riseDistance={height * .22} />}
      <Animated.View testID="bedroom-darkness" pointerEvents="none" style={[styles.night, { opacity: sleep.darkness }]} />
      {!sleeping && <BreathingBathroomButton label="Dormir en la cama" icon="sleep" onPress={sleep.start} style={frame.button(.79, .43, buttonSize)} />}
      <TouchableOpacity testID="bedroom-exit" accessibilityRole="button" accessibilityLabel="Puerta al salón" style={[styles.door, frame.hit(.065, .10, .14, .50)]} onPress={onOpenInside} />
      {sleep.phase === 'rested' && <Text accessibilityLiveRegion="polite" style={styles.message}>¡Descansó! Sueño al 100%</Text>}
      {sleep.error && <Text accessibilityLiveRegion="polite" style={styles.message}>No se pudo guardar. Intentá dormir de nuevo.</Text>}
    </View>
  </View>;
}
