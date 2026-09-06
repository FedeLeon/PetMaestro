import { ImageBackground, Pressable, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import type { GestureResponderEvent, LayoutChangeEvent } from 'react-native';
import { WalkingPetCat, WalkingPetCatHandle, SparkleBurst } from '../PetCat';
import { houseImages } from '../../data/assetImages';
import type { ProgressState } from '../../types';
import { styles } from '../../styles/house/kitchen.styles';

type Props = { equippedCatItems: ProgressState['equippedCatItems']; equippedItemId: string | null; onOpenInside: () => void; onWalkTo: (x: number, y: number) => void; walkingCatRef: React.RefObject<WalkingPetCatHandle | null>; sparkle: { x: number; y: number; key: number } | null };
const FLOOR_TOP_RATIO = 0.56;
const WALKING_CAT_WIDTH = 230;
const WALKING_CAT_HEIGHT = 284;

export function HouseKitchen({ equippedCatItems, equippedItemId, onOpenInside, onWalkTo, walkingCatRef, sparkle }: Props) {
  const [sceneLayout, setSceneLayout] = useState({ height: 0, width: 0 });
  const floorTop = sceneLayout.height * FLOOR_TOP_RATIO;
  const minY = Math.max(0, floorTop - WALKING_CAT_HEIGHT);
  const maxY = Math.max(minY, sceneLayout.height - WALKING_CAT_HEIGHT);
  const handleLayout = (event: LayoutChangeEvent) => setSceneLayout(event.nativeEvent.layout);
  const handleFloorPress = (event: GestureResponderEvent) => onWalkTo(event.nativeEvent.locationX, floorTop + event.nativeEvent.locationY);

  return <View style={styles.room}>
    <ImageBackground imageStyle={styles.roomBackgroundImage} onLayout={handleLayout} resizeMode="cover" source={houseImages.kitchenInterior} style={styles.scene}>
      <Pressable accessibilityLabel="Caminar por el suelo de la cocina" onPressIn={handleFloorPress} style={[styles.floorTouch, { top: floorTop }]} />
      {sparkle ? <SparkleBurst key={sparkle.key} size={60} style={[styles.clickSparkle, { left: sparkle.x - 30, top: sparkle.y - 30 }]} /> : null}
      <WalkingPetCat equippedCatItems={equippedCatItems} equippedItemId={equippedItemId} initialX={Math.max(0, sceneLayout.width * 0.4)} initialY={minY} maxX={Math.max(0, sceneLayout.width - WALKING_CAT_WIDTH)} maxY={maxY} minY={minY} ref={walkingCatRef} size="room" style={styles.cat} />
      <TouchableOpacity accessibilityLabel="Volver al interior de la casa" accessibilityRole="button" onPress={onOpenInside} style={[styles.doorHit, { height: sceneLayout.height * 0.48, left: sceneLayout.width * 0.02, top: sceneLayout.height * 0.1, width: sceneLayout.width * 0.18 }]} />
    </ImageBackground>
  </View>;
}
