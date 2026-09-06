import { useEffect, useRef, useState } from 'react';
import { Image, ImageBackground, Pressable, ScrollView, TouchableOpacity, View } from 'react-native';
import type { GestureResponderEvent } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlinkingFarmAnimal } from '../BlinkingFarmAnimal';
import { WalkingPetCat, WalkingPetCatHandle } from '../PetCat';
import { farmAnimalActionImages, farmAnimalBlinkImages, farmAnimalGrazeImages, farmAnimalImages, houseImages, shopCategoryImages } from '../../data/assetImages';
import type { ProgressState, ShopItem } from '../../types';
import { EXTERIOR_YARD_WIDTH } from '../../styles/screens/houseScreen.styles';
import { styles } from '../../styles/house/exterior.styles';
import { GardenFlowers } from './GardenFlowers';

type Props = { contentWidth: number; equippedCatItems: ProgressState['equippedCatItems']; equippedItemId: string | null; onEnterHouse: () => void; onFloorPress: (event: GestureResponderEvent) => void; placedAnimals: ShopItem[]; walkingCatRef: React.RefObject<WalkingPetCatHandle | null>; sparkle: { x: number; y: number; key: number } | null };
const animalPositions: Record<string, { x: number; y: number }> = { 'farm-cow': { x: 25, y: 340 }, 'farm-pig': { x: 850, y: 345 }, 'farm-sheep': { x: 120, y: 375 }, 'farm-horse': { x: 580, y: 400 }, 'farm-duck': { x: 330, y: 430 }, 'farm-rabbit': { x: 500, y: 505 } };
const WALKING_CAT_WIDTH = 230;

export function HouseExterior({ contentWidth, equippedCatItems, equippedItemId, onEnterHouse, placedAnimals, walkingCatRef }: Props) {
  const [watering, setWatering] = useState(false);
  const [viewport, setViewport] = useState({ height: 0, width: 0 });
  const scrollRef = useRef<ScrollView>(null);
  const scale = contentWidth / EXTERIOR_YARD_WIDTH;
  const catScale = viewport.height / 600;
  useEffect(() => { if (viewport.width) scrollRef.current?.scrollTo({ animated: false, x: Math.max(0, (contentWidth - viewport.width) / 2), y: 0 }); }, [contentWidth, viewport.width]);
  return <View style={styles.room} onLayout={(event) => setViewport(event.nativeEvent.layout)}>
    <ScrollView horizontal ref={scrollRef} showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
      <ImageBackground imageStyle={styles.roomBackgroundImage} resizeMode="stretch" source={houseImages.exteriorWide} style={[styles.wide, { width: contentWidth }]}>
        <Pressable disabled={watering} accessibilityLabel="Caminar hasta este lugar" onPressIn={event => { if (catScale > 0) walkingCatRef.current?.walkTo(event.nativeEvent.locationX / catScale, event.nativeEvent.locationY / catScale - 79); }} style={styles.touch} />
        <View pointerEvents="none" style={[styles.barn, { left: contentWidth * .82 - 95, top: viewport.height * .48 - 87, transform: [{ scale: catScale * 1.44 }] }]}><Image resizeMode="contain" source={shopCategoryImages.pets} style={styles.barnImage} /></View>
        {placedAnimals.map((animal) => { const position = animalPositions[animal.id] ?? { x: EXTERIOR_YARD_WIDTH / 2, y: 340 }; return <View key={animal.id} pointerEvents="none" style={[styles.yardAnimal, animal.id === 'farm-duck' && styles.frontAnimal, { left: position.x * scale, top: position.y * catScale - 62.5, transform: [{ scale: catScale }] }]}>{farmAnimalImages[animal.id] ? <BlinkingFarmAnimal actionFrames={farmAnimalActionImages[animal.id] ?? farmAnimalGrazeImages[animal.id]} frames={farmAnimalBlinkImages[animal.id] ?? [farmAnimalImages[animal.id]]} style={[styles.animalImage, animal.id === 'farm-cow' && styles.cowAnimal, animal.id === 'farm-horse' && styles.horseAnimal]} /> : <MaterialCommunityIcons color={animal.color} name={animal.icon as keyof typeof MaterialCommunityIcons.glyphMap} size={54} />}</View>; })}
        <View style={[styles.house, { left: contentWidth / 2 - 146, top: viewport.height * .46 - 107, transform: [{ scale: catScale * 1.44 }] }]}><Image resizeMode="contain" source={houseImages.cuteHouse} style={styles.houseImage} /><TouchableOpacity accessibilityLabel="Entrar a la casa" accessibilityRole="button" onPress={onEnterHouse} style={styles.houseDoorHit} /></View>
        {!watering && catScale > 0 && <View pointerEvents="none" style={[styles.catWorld, { width: contentWidth / catScale, transform: [{ scale: catScale }] }]}>
          <WalkingPetCat equippedCatItems={equippedCatItems} equippedItemId={equippedItemId} initialX={Math.max(0, contentWidth / catScale / 2 - 115)} initialY={340} maxX={Math.max(0, contentWidth / catScale - WALKING_CAT_WIDTH)} maxY={365} minY={300} ref={walkingCatRef} size="room" style={styles.cat} />
        </View>}
        <GardenFlowers width={contentWidth} height={viewport.height} onWateringChange={setWatering} />
      </ImageBackground>
    </ScrollView>
  </View>;
}
