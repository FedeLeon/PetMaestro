import { usePresentation } from '../presentation/usePresentation';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Image, Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { GestureResponderEvent } from 'react-native';
import { ScenePresentationProvider, useScenePresentation } from '../context/ScenePresentation';
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

export function HouseScreen(props: Props) {
  return <ScenePresentationProvider><HouseScene {...props} /></ScenePresentationProvider>;
}
function HouseScene({ navigation, route }: Props) {
  const presentation = usePresentation();
  const { activity } = useScenePresentation();
  const { progress, toggleAnimal, toggleFurniture } = useProgress();
  const [houseView, setHouseView] = useState<HouseView>('inside');
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const openInterior = useCallback(() => setHouseView('inside'), []);
  useFocusEffect(useCallback(() => { setHouseView(route.params?.room ?? 'inside'); setInventoryOpen(false); return () => setInventoryOpen(false); }, [route.params]));
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
    <AppTopMenu scene onBack={houseView !== 'inside' ? openInterior : undefined} compact={houseView === 'kitchen' || houseView === 'bathroom'} icon="home-heart" title={houseView === 'kitchen' ? 'Cocina' : houseView === 'bathroom' ? 'Baño' : 'Casa'} />
    <View style={styles.contentRow}>
      <View onLayout={(event) => setSceneViewportWidth(event.nativeEvent.layout.width)} style={styles.sceneArea}>
        {houseView === 'inside' ? <HouseInterior equippedCatItems={progress.equippedCatItems} equippedItemId={progress.equippedItemId} drawingStrokes={progress.drawingStrokes} onOpenDrawing={() => navigation.navigate('Drawing')} onOpenLibrary={() => navigation.navigate('Library')} onOpenRoom={setHouseView} placedFurniture={placedFurniture} initialScrollRatio={interiorScrollRatio.current} onScrollRatioChange={ratio => { interiorScrollRatio.current = ratio; }} /> : null}
        {houseView === 'bedroom' ? <HouseBedroom equippedCatItems={progress.equippedCatItems} equippedItemId={progress.equippedItemId} onOpenInside={() => setHouseView('inside')} /> : null}
        {houseView === 'kitchen' ? <HouseKitchen {...sceneProps} onOpenInside={() => setHouseView('inside')} /> : null}
        {houseView === 'bathroom' ? <HouseBathroom equippedCatItems={progress.equippedCatItems} equippedItemId={progress.equippedItemId} onOpenInside={() => setHouseView('inside')} /> : null}
        {houseView === 'outside' ? <HouseExterior {...sceneProps} contentWidth={Math.max(960, sceneViewportWidth)} ownedItemIds={progress.ownedItems} onEnterHouse={() => setHouseView('inside')} placedAnimals={placedAnimals} /> : null}
      </View>
      {!activity && (houseView === 'inside' || houseView === 'outside') ? <TouchableOpacity accessibilityRole="button" accessibilityLabel={houseView === 'inside' ? 'Abrir muebles' : 'Abrir mascotas'} onPress={() => setInventoryOpen(true)} style={presentation.styles.houseInventory}>
        <Image accessible={false} source={houseView === 'inside' ? furnitureImages['red-sofa'] : farmAnimalImages['farm-cow']} resizeMode="contain" style={styles.inventoryToggleArt} /><Text style={styles.inventoryToggleText}>{houseView === 'inside' ? 'Decorar' : 'Animales'}</Text>
      </TouchableOpacity> : null}
    </View>
    <AppBottomMenu onOpenHouse={openInterior} />
    <Modal transparent visible={inventoryOpen && (houseView === 'inside' || houseView === 'outside')} animationType="fade" supportedOrientations={['landscape']} onRequestClose={() => setInventoryOpen(false)}>
      <SafeAreaView style={styles.inventoryModal}>
        <Pressable accessibilityRole="button" accessibilityLabel="Cerrar inventario" onPress={() => setInventoryOpen(false)} style={styles.inventoryBackdrop} />
        <Inventory onClose={() => setInventoryOpen(false)} houseView={houseView} ownedAnimals={ownedAnimals} ownedFurniture={ownedFurniture} progress={progress} toggleAnimal={toggleAnimal} toggleFurniture={toggleFurniture} onOpenShop={() => { setInventoryOpen(false); navigation.navigate('ShopCategory', { categoryId: houseView === 'inside' ? 'furniture' : 'pets' }); }} />
      </SafeAreaView>
    </Modal>
  </View>;
}

type InventoryProps = { onClose: () => void; houseView: HouseView; ownedAnimals: typeof shopItems; ownedFurniture: typeof shopItems; progress: ProgressState; toggleAnimal: (id: string) => void; toggleFurniture: (id: string) => void; onOpenShop: () => void };
function Inventory({ onClose, houseView, ownedAnimals, ownedFurniture, progress, toggleAnimal, toggleFurniture, onOpenShop }: InventoryProps) {
  return <View testID="house-inventory" style={styles.inventorySection}><TouchableOpacity accessibilityRole="button" accessibilityLabel="Cerrar panel" onPress={onClose} style={styles.inventoryClose}><MaterialCommunityIcons name="close" color="#26796e" size={28} /></TouchableOpacity>{houseView === 'inside' || houseView === 'outside' ? <>
    {houseView === 'outside' ? <View style={styles.inventoryTitleRow}><MaterialCommunityIcons color="#7d4e28" name="paw-outline" size={22} /><Text style={styles.inventoryTitle}>MASCOTAS</Text></View> : null}
    {houseView === 'inside' ? <View style={styles.inventoryTitleRow}><MaterialCommunityIcons color="#7d4e28" name="sofa-outline" size={22} /><Text style={styles.inventoryTitle}>MUEBLES</Text></View> : null}
    <ScrollView contentContainerStyle={styles.inventoryScroll} showsVerticalScrollIndicator={false}><View style={styles.inventoryGrid}>
      {(houseView === 'inside' ? ownedFurniture : ownedAnimals).length === 0 ? <View style={styles.emptyInventory}><Text style={styles.emptyText}>{houseView === 'inside' ? 'Elegí muebles para decorar tu casa.' : 'Traé animalitos para tu jardín.'}</Text><TouchableOpacity accessibilityRole="button" onPress={onOpenShop} style={styles.shopButton}><Text style={styles.shopButtonText}>Ir a la tienda</Text></TouchableOpacity></View> : null}
      {(houseView === 'inside' ? ownedFurniture : ownedAnimals).map(item => {
        const inside = houseView === 'inside';
        const placed = (inside ? progress.placedFurnitureIds : progress.placedAnimalIds).includes(item.id);
        const image = (inside ? furnitureImages : farmAnimalImages)[item.id];
        return <TouchableOpacity key={item.id} accessibilityRole="button" accessibilityLabel={`Colocar ${item.name}`} aria-pressed={placed}
          onPress={() => inside ? toggleFurniture(item.id) : toggleAnimal(item.id)} style={[styles.inventoryCard, placed && styles.placedInventoryCard]}>
          <View style={[styles.inventoryPreview, { backgroundColor: item.color }]}>
            {image ? <Image resizeMode="contain" source={image} style={styles.inventoryImage} /> : <MaterialCommunityIcons color="#ffffff" name={item.icon as keyof typeof MaterialCommunityIcons.glyphMap} size={34} />}
          </View>
          <Text numberOfLines={2} adjustsFontSizeToFit minimumFontScale={.85} style={styles.inventoryName}>{item.name.toUpperCase()}</Text>
        </TouchableOpacity>;
      })}
    </View></ScrollView>
  </> : null}</View>;
}
