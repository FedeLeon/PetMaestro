import { ImageBackground, LayoutChangeEvent, Pressable, ScrollView, TouchableOpacity } from 'react-native';
import type { GestureResponderEvent } from 'react-native';
import { WalkingPetCat, WalkingPetCatHandle, SparkleBurst } from '../PetCat';
import { houseImages } from '../../data/assetImages';
import type { ProgressState } from '../../types';
import { styles } from '../../styles/house/bathroom.styles';

type Props = { contentWidth: number; equippedCatItems: ProgressState['equippedCatItems']; equippedItemId: string | null; onFloorPress: (event: GestureResponderEvent) => void; onLayout: (event: LayoutChangeEvent) => void; onOpenInside: () => void; walkingCatRef: React.RefObject<WalkingPetCatHandle | null>; minY: number; maxX: number; maxY: number; sparkle: { x: number; y: number; key: number } | null };

export function HouseBathroom({ contentWidth, equippedCatItems, equippedItemId, maxX, maxY, minY, onFloorPress, onLayout, onOpenInside, walkingCatRef, sparkle }: Props) {
  return <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
    <ImageBackground imageStyle={styles.roomBackgroundImage} onLayout={onLayout} resizeMode="stretch" source={houseImages.bathroomInterior} style={[styles.pane, { width: contentWidth }]}>
      <Pressable accessibilityLabel="Caminar hasta este lugar" onPressIn={onFloorPress} style={styles.touch} />
      {sparkle ? <SparkleBurst key={sparkle.key} size={60} style={[styles.clickSparkle, { left: sparkle.x - 30, top: sparkle.y - 30 }]} /> : null}
      <WalkingPetCat equippedCatItems={equippedCatItems} equippedItemId={equippedItemId} initialX={360} initialY={minY} maxX={maxX} maxY={maxY} minY={minY} ref={walkingCatRef} size="room" style={styles.cat} />
      <TouchableOpacity accessibilityRole="button" onPress={onOpenInside} style={styles.exitDoorHit} />
    </ImageBackground>
  </ScrollView>;
}
