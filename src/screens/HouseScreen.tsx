import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useRef, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import type { GestureResponderEvent } from 'react-native';
import { AppBottomMenu } from '../components/AppBottomMenu';
import { AppTopMenu } from '../components/AppTopMenu';
import { HouseBathroom } from '../components/house/HouseBathroom';
import { HouseExterior } from '../components/house/HouseExterior';
import { HouseInterior } from '../components/house/HouseInterior';
import { HouseKitchen } from '../components/house/HouseKitchen';
import { WalkingPetCatHandle } from '../components/PetCat';
import { useProgress } from '../context/ProgressContext';
import { farmAnimalImages, furnitureImages } from '../data/assetImages';
import { shopItems } from '../data/gameContent';
import { BATHROOM_ROOM_WIDTH, styles } from '../styles/screens/houseScreen.styles';
import type { ProgressState, RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'House'>;
type HouseView = 'outside' | 'inside' | 'kitchen' | 'bathroom';
const BATHROOM_FLOOR_START_RATIO = 0.67;
const BATHROOM_ASPECT_RATIO = 1.5;
const WALKING_CAT_HEIGHT = 284;
const WALKING_CAT_WIDTH = 230;

export function HouseScreen({ navigation }: Props) {
  const { progress, toggleAnimal, toggleFurniture } = useProgress();
  const [houseView, setHouseView] = useState<HouseView>('outside');
  const [sceneViewportWidth, setSceneViewportWidth] = useState(0);
  const [bathroomViewport, setBathroomViewport] = useState({ height: 0, width: 0 });
  const [sparkle, setSparkle] = useState<{ x: number; y: number; key: number } | null>(null);
  const walkingCatRef = useRef<WalkingPetCatHandle>(null);
  const ownedFurniture = useMemo(() => shopItems.filter((item) => item.target === 'house' && progress.ownedItems.includes(item.id)), [progress.ownedItems]);
  const ownedAnimals = useMemo(() => shopItems.filter((item) => item.target === 'yard' && progress.ownedItems.includes(item.id)), [progress.ownedItems]);
  const placedFurniture = ownedFurniture.filter((item) => progress.placedFurnitureIds.includes(item.id));
  const placedAnimals = ownedAnimals.filter((item) => progress.placedAnimalIds.includes(item.id));
  const bathroomFloorTop = bathroomViewport.height > 0 ? bathroomViewport.height * BATHROOM_FLOOR_START_RATIO : 450;
  const bathroomContentWidth = Math.max(bathroomViewport.height > 0 ? bathroomViewport.height * BATHROOM_ASPECT_RATIO : BATHROOM_ROOM_WIDTH, sceneViewportWidth);
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
        {houseView === 'inside' ? <HouseInterior {...sceneProps} drawingStrokes={progress.drawingStrokes} onOpenBathroom={() => setHouseView('bathroom')} onOpenDrawing={() => navigation.navigate('Drawing')} onOpenKitchen={() => setHouseView('kitchen')} onOpenOutside={() => setHouseView('outside')} onWalkTo={handleWalkTo} placedFurniture={placedFurniture} /> : null}
        {houseView === 'kitchen' ? <HouseKitchen {...sceneProps} onOpenInside={() => setHouseView('inside')} /> : null}
        {houseView === 'bathroom' ? <HouseBathroom {...sceneProps} contentWidth={bathroomContentWidth} maxX={Math.max(0, bathroomContentWidth - WALKING_CAT_WIDTH)} maxY={bathroomViewport.height > 0 ? Math.max(Math.max(0, bathroomFloorTop - WALKING_CAT_HEIGHT), bathroomViewport.height - WALKING_CAT_HEIGHT) : 390} minY={Math.max(0, bathroomFloorTop - WALKING_CAT_HEIGHT)} onLayout={(event) => setBathroomViewport(event.nativeEvent.layout)} onOpenInside={() => setHouseView('inside')} /> : null}
        {houseView === 'outside' ? <HouseExterior {...sceneProps} contentWidth={Math.max(960, sceneViewportWidth)} onEnterHouse={() => setHouseView('inside')} placedAnimals={placedAnimals} /> : null}
      </View>
      <Inventory houseView={houseView} ownedAnimals={ownedAnimals} ownedFurniture={ownedFurniture} progress={progress} toggleAnimal={toggleAnimal} toggleFurniture={toggleFurniture} />
    </View>
    <AppBottomMenu />
  </View>;
}

type InventoryProps = { houseView: HouseView; ownedAnimals: typeof shopItems; ownedFurniture: typeof shopItems; progress: ProgressState; toggleAnimal: (id: string) => void; toggleFurniture: (id: string) => void };
function Inventory({ houseView, ownedAnimals, ownedFurniture, progress, toggleAnimal, toggleFurniture }: InventoryProps) {
  return <View style={styles.inventorySection}>{houseView === 'inside' || houseView === 'outside' ? <>
    {houseView === 'outside' ? <View style={styles.inventoryTitleRow}><MaterialCommunityIcons color="#7d4e28" name="paw-outline" size={22} /><Text style={styles.inventoryTitle}>MASCOTAS</Text></View> : null}
    {houseView === 'inside' ? <View style={styles.inventoryTitleRow}><MaterialCommunityIcons color="#7d4e28" name="sofa-outline" size={22} /><Text style={styles.inventoryTitle}>MUEBLES</Text></View> : null}
    <ScrollView contentContainerStyle={styles.inventoryScroll} showsVerticalScrollIndicator={false}><View style={styles.inventoryGrid}>
      {houseView === 'inside' ? ownedFurniture.map((item) => <TouchableOpacity key={item.id} onPress={() => toggleFurniture(item.id)} style={[styles.inventoryCard, progress.placedFurnitureIds.includes(item.id) && styles.placedInventoryCard]}><View style={[styles.inventoryPreview, styles.inventoryFurniturePreview, { backgroundColor: item.color }]}>{furnitureImages[item.id] ? <Image resizeMode="contain" source={furnitureImages[item.id]} style={styles.inventoryImage} /> : <MaterialCommunityIcons color="#ffffff" name={item.icon as keyof typeof MaterialCommunityIcons.glyphMap} size={38} />}</View><Text style={styles.inventoryName}>{item.name.toUpperCase()}</Text></TouchableOpacity>) : ownedAnimals.map((item) => <TouchableOpacity key={item.id} onPress={() => toggleAnimal(item.id)} style={[styles.inventoryCard, progress.placedAnimalIds.includes(item.id) && styles.placedInventoryCard]}><View style={[styles.inventoryPreview, styles.inventoryAnimalPreview, { backgroundColor: item.color }]}>{farmAnimalImages[item.id] ? <Image resizeMode="contain" source={farmAnimalImages[item.id]} style={styles.inventoryAnimalImage} /> : <MaterialCommunityIcons color="#ffffff" name={item.icon as keyof typeof MaterialCommunityIcons.glyphMap} size={34} />}</View><Text style={styles.inventoryName}>{item.name.toUpperCase()}</Text></TouchableOpacity>)}
    </View></ScrollView>
  </> : null}</View>;
}
