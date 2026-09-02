import { ImageBackground, Pressable, ScrollView, TouchableOpacity } from 'react-native';
import type { GestureResponderEvent } from 'react-native';
import { WalkingPetCat, WalkingPetCatHandle, SparkleBurst } from '../PetCat';
import { houseImages } from '../../data/assetImages';
import type { ProgressState } from '../../types';
import { styles } from '../../styles/house/kitchen.styles';

type Props = { equippedCatItems: ProgressState['equippedCatItems']; equippedItemId: string | null; onFloorPress: (event: GestureResponderEvent) => void; onOpenInside: () => void; walkingCatRef: React.RefObject<WalkingPetCatHandle | null>; sparkle: { x: number; y: number; key: number } | null };

export function HouseKitchen({ equippedCatItems, equippedItemId, onFloorPress, onOpenInside, walkingCatRef, sparkle }: Props) {
  return <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
    <ImageBackground imageStyle={styles.roomBackgroundImage} resizeMode="stretch" source={houseImages.kitchenInterior} style={styles.pane}>
      <Pressable accessibilityLabel="Caminar hasta este lugar" onPressIn={onFloorPress} style={styles.touch} />
      {sparkle ? <SparkleBurst key={sparkle.key} size={60} style={[styles.clickSparkle, { left: sparkle.x - 30, top: sparkle.y - 30 }]} /> : null}
      <WalkingPetCat equippedCatItems={equippedCatItems} equippedItemId={equippedItemId} initialX={320} initialY={132} maxX={760 - 230} maxY={132} minY={48} ref={walkingCatRef} size="room" style={styles.cat} />
      <TouchableOpacity accessibilityRole="button" onPress={onOpenInside} style={styles.doorHit} />
    </ImageBackground>
  </ScrollView>;
}
