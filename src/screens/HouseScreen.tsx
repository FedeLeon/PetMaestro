import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import type { GestureResponderEvent } from 'react-native';
import { AppBottomMenu } from '../components/AppBottomMenu';
import { AppTopMenu } from '../components/AppTopMenu';
import { HouseBedroom } from '../components/house/HouseBedroom';
import { HouseBathroom } from '../components/house/HouseBathroom';
import { HouseExterior } from '../components/house/HouseExterior';
import { HouseInterior } from '../components/house/HouseInterior';
import { HouseKitchen } from '../components/house/HouseKitchen';
import { WalkingPetCatHandle } from '../components/PetCat';
import { useProgress } from '../context/ProgressContext';
import { farmAnimalImages, furnitureImages } from '../data/assetImages';
import { shopItems } from '../data/gameContent';
import { styles } from '../styles/screens/houseScreen.styles';
import type { ProgressState, RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'House'>;
type HouseView = 'outside' | 'inside' | 'kitchen' | 'bathroom' | 'bedroom';

export function HouseScreen({ navigation }: Props) {
  const { progress, toggleAnimal, toggleFurniture } = useProgress();
  const [houseView, setHouseView] = useState<HouseView>('inside');
  const openInterior = useCallback(() => setHouseView('inside'), []);
  useFocusEffect(openInterior);
  const [sceneViewportWidth, setSceneViewportWidth] = useState(0);
  const [sparkle, setSparkle] = useState<{ x: number; y: number; key: number } | null>(null);
  const interiorScrollRatio = useRef(0);
  const walkingCatRef = useRef<WalkingPetCatHandle>(null);
  const ownedFurniture = useMemo(() => shopItems.filter((item) => item.target === 'house' && progress.ownedItems.includes(item.id)), [progress.ownedItems]);
  const ownedAnimals = useMemo(() => shopItems.filter((item) => item.target === 'yard' && progress.ownedItems.includes(item.id)), [progress.ownedItems]);
  const placedFurniture = ownedFurniture.filter((item) => progress.placedFurnitureIds.includes(item.id));
  const placedAnimals = ownedAnimals.filter((item) => progress.placedAnimalIds.includes(item.id));
  const handleWalkTo = (targetX: number, targetY: number) => {
    if (!Number.isFinite(targetX) || !Number.isFinite(targetY)) return;
    const key = Date.now();
    setSparkle({ x: targetX, y: targetY, key });
    setTimeout(() => setSparkle((current) => (current?.key === key ? null : current)), 460);
    walkingCatRef.current?.walkTo(targetX, targetY);
  };
  const handleFloorPress = (event: GestureResponderEvent) => {
    const { locationX, locationY, pageX, pageY } = event.nativeEvent;
    const targetX = Number.isFinite(locationX) ? locationX : pageX;
    const targetY = Number.isFinite(locationY) ? locationY : pageY;
    handleWalkTo(targetX, targetY);
  };
  const sceneProps = { equippedCatItems: progress.equippedCatItems, equippedItemId: progress.equippedItemId, onFloorPress: handleFloorPress, walkingCatRef, sparkle };
  return <View style={styles.screen}>
    <AppTopMenu icon="home-heart" title="Casa" />
    <View style={styles.contentRow}>
      <View onLayout={(event) => setSceneViewportWidth(event.nativeEvent.layout.width)} style={styles.sceneArea}>
        {houseView === 'inside' ? <HouseInterior equippedCatItems={progress.equippedCatItems} equippedItemId={progress.equippedItemId} drawingStrokes={progress.drawingStrokes} onOpenDrawing={() => navigation.navigate('Drawing')} onOpenRoom={setHouseView} placedFurniture={placedFurniture} initialScrollRatio={interiorScrollRatio.current} onScrollRatioChange={ratio => { interiorScrollRatio.current = ratio; }} /> : null}
        {houseView === 'bedroom' ? <HouseBedroom equippedCatItems={progress.equippedCatItems} equippedItemId={progress.equippedItemId} onOpenInside={() => setHouseView('inside')} /> : null}
        {houseView === 'kitchen' ? <HouseKitchen {...sceneProps} onOpenInside={() => setHouseView('inside')} /> : null}
        {houseView === 'bathroom' ? <HouseBathroom equippedCatItems={progress.equippedCatItems} equippedItemId={progress.equippedItemId} onOpenInside={() => setHouseView('inside')} /> : null}
        {houseView === 'outside' ? <HouseExterior {...sceneProps} contentWidth={Math.max(960, sceneViewportWidth)} onEnterHouse={() => setHouseView('inside')} placedAnimals={placedAnimals} /> : null}
      </View>
      {houseView === 'inside' || houseView === 'outside' ? <Inventory houseView={houseView} ownedAnimals={ownedAnimals} ownedFurniture={ownedFurniture} progress={progress} toggleAnimal={toggleAnimal} toggleFurniture={toggleFurniture} /> : null}
    </View>
    <AppBottomMenu onOpenHouse={openInterior} />
  </View>;
}

type InventoryProps = { houseView: HouseView; ownedAnimals: typeof shopItems; ownedFurniture: typeof shopItems; progress: ProgressState; toggleAnimal: (id: string) => void; toggleFurniture: (id: string) => void };
function Inventory({ houseView, ownedAnimals, ownedFurniture, progress, toggleAnimal, toggleFurniture }: InventoryProps) {
  return <View style={styles.inventorySection}>{houseView === 'inside' || houseView === 'outside' ? <>
    {houseView === 'outside' ? <View style={styles.inventoryTitleRow}><MaterialCommunityIcons color="#7d4e28" name="paw-outline" size={22} /><Text style={styles.inventoryTitle}>MASCOTAS</Text></View> : null}
    {houseView === 'inside' ? <View style={styles.inventoryTitleRow}><MaterialCommunityIcons color="#7d4e28" name="sofa-outline" size={22} /><Text style={styles.inventoryTitle}>MUEBLES</Text></View> : null}
    <ScrollView contentContainerStyle={styles.inventoryScroll} showsVerticalScrollIndicator={false}><View style={styles.inventoryGrid}>
      {houseView === 'inside' ? ownedFurniture.map((item) => <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Colocar ${item.name}`} aria-pressed={progress.placedFurnitureIds.includes(item.id)} key={item.id} onPress={() => toggleFurniture(item.id)} style={[styles.inventoryCard, progress.placedFurnitureIds.includes(item.id) && styles.placedInventoryCard]}><View style={[styles.inventoryPreview, styles.inventoryFurniturePreview, { backgroundColor: item.color }]}>{furnitureImages[item.id] ? <Image resizeMode="contain" source={furnitureImages[item.id]} style={styles.inventoryImage} /> : <MaterialCommunityIcons color="#ffffff" name={item.icon as keyof typeof MaterialCommunityIcons.glyphMap} size={38} />}</View><Text style={styles.inventoryName}>{item.name.toUpperCase()}</Text></TouchableOpacity>) : ownedAnimals.map((item) => <TouchableOpacity key={item.id} onPress={() => toggleAnimal(item.id)} style={[styles.inventoryCard, progress.placedAnimalIds.includes(item.id) && styles.placedInventoryCard]}><View style={[styles.inventoryPreview, styles.inventoryAnimalPreview, { backgroundColor: item.color }]}>{farmAnimalImages[item.id] ? <Image resizeMode="contain" source={farmAnimalImages[item.id]} style={styles.inventoryAnimalImage} /> : <MaterialCommunityIcons color="#ffffff" name={item.icon as keyof typeof MaterialCommunityIcons.glyphMap} size={34} />}</View><Text style={styles.inventoryName}>{item.name.toUpperCase()}</Text></TouchableOpacity>)}
    </View></ScrollView>
  </> : null}</View>;
}
