import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { GestureResponderEvent } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { AppBottomMenu } from '../components/AppBottomMenu';
import { CoinBadge } from '../components/CoinBadge';
import { HeaderBackButton } from '../components/HeaderBackButton';
import { BlinkingFarmAnimal } from '../components/BlinkingFarmAnimal';
import { NeedsMeters } from '../components/NeedsMeters';
import { SparkleBurst, WalkingPetCat, WalkingPetCatHandle } from '../components/PetCat';
import { useProgress } from '../context/ProgressContext';
import { farmAnimalBlinkImages, farmAnimalImages, furnitureImages, houseImages, shopCategoryImages } from '../data/assetImages';
import { shopItems } from '../data/gameContent';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'House'>;

const WIDE_ROOM_WIDTH = 1300;
const KITCHEN_ROOM_WIDTH = 760;
const BATHROOM_ROOM_WIDTH = 720;
const EXTERIOR_YARD_WIDTH = 960;
const ROOM_HEIGHT = 420;
const ROOM_FLOOR_HEIGHT = 184;

const furnitureDefaults: Record<string, { x: number; y: number }> = {
  'soft-bed': { x: 0, y: 55 },
  'small-table': { x: 500, y: -8 },
  'fish-lamp': { x: 580, y: -38 },
  'window-plant': { x: 430, y: -4 },
  'red-sofa': { x: 860, y: -35 },
  'bookcase-open': { x: 1212, y: -67 },
  'round-rug': { x: 690, y: 58 },
  'floor-lamp': { x: 950, y: -210 },
  'tv-cabinet': { x: 45, y: -65 },
};

const furnitureSizes: Record<string, { width: number; height: number }> = {
  'soft-bed': { width: 176, height: 108 },
  'small-table': { width: 104, height: 86 },
  'fish-lamp': { width: 92, height: 142 },
  'window-plant': { width: 72, height: 94 },
  'red-sofa': { width: 193, height: 113 },
  'bookcase-open': { width: 116, height: 166 },
  'round-rug': { width: 190, height: 116 },
  'floor-lamp': { width: 176, height: 392 },
  'tv-cabinet': { width: 303, height: 168 },
};

const animalPositions: Record<string, { x: number; y: number }> = {
  'farm-cow': { x: 72, y: 220 },
  'farm-pig': { x: 820, y: 220 },
  'farm-sheep': { x: 214, y: 228 },
  'farm-horse': { x: 704, y: 214 },
  'farm-duck': { x: 342, y: 286 },
  'farm-rabbit': { x: 600, y: 244 },
};

export function HouseScreen({ navigation }: Props) {
  const { progress, toggleAnimal, toggleFurniture } = useProgress();
  const [houseView, setHouseView] = useState<'outside' | 'inside' | 'kitchen' | 'bathroom'>('outside');
  const [exteriorViewportWidth, setExteriorViewportWidth] = useState(0);
  const [sparkle, setSparkle] = useState<{ x: number; y: number; key: number } | null>(null);
  const exteriorScrollRef = useRef<ScrollView>(null);
  const walkingCatRef = useRef<WalkingPetCatHandle>(null);
  const ownedFurniture = useMemo(
    () => shopItems.filter((item) => item.target === 'house' && progress.ownedItems.includes(item.id)),
    [progress.ownedItems],
  );
  const ownedAnimals = useMemo(
    () => shopItems.filter((item) => item.target === 'yard' && progress.ownedItems.includes(item.id)),
    [progress.ownedItems],
  );
  const placedFurniture = ownedFurniture.filter((item) => progress.placedFurnitureIds.includes(item.id));
  const placedAnimals = ownedAnimals.filter((item) => progress.placedAnimalIds.includes(item.id));
  const handleFloorPress = (event: GestureResponderEvent) => {
    const { locationX, locationY, pageX, pageY } = event.nativeEvent;
    const targetX = Number.isFinite(locationX) ? locationX : pageX;
    const targetY = Number.isFinite(locationY) ? locationY : pageY;

    if (!Number.isFinite(targetX) || !Number.isFinite(targetY)) {
      return;
    }

    const sparkleKey = Date.now();
    setSparkle({ x: targetX, y: targetY, key: sparkleKey });
    setTimeout(() => {
      setSparkle((current) => (current?.key === sparkleKey ? null : current));
    }, 460);
    walkingCatRef.current?.walkTo(targetX, targetY);
  };

  useEffect(() => {
    if (houseView !== 'outside' || !exteriorViewportWidth) {
      return;
    }

    const timeoutId = setTimeout(() => {
      exteriorScrollRef.current?.scrollTo({
        animated: false,
        x: Math.max(0, (EXTERIOR_YARD_WIDTH - exteriorViewportWidth) / 2),
        y: 0,
      });
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [exteriorViewportWidth, houseView]);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <HeaderBackButton />
          <View style={styles.titleGroup}>
            <MaterialCommunityIcons color="#26796e" name="home-heart" size={28} />
            <Text style={styles.title}>Casa</Text>
          </View>
          <CoinBadge coins={progress.coins} />
        </View>
        <NeedsMeters needs={progress.needs} />
      </View>

      <View style={styles.sceneArea}>
        {houseView === 'inside' ? (
          <View style={styles.room}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <ImageBackground
                imageStyle={styles.roomBackgroundImage}
                resizeMode="stretch"
                source={houseImages.interiorWide}
                style={styles.mainRoomPane}
              >
                <View style={styles.floor}>
                  <Pressable accessibilityLabel="Caminar hasta este lugar" onPressIn={handleFloorPress} style={styles.floorTouch} />
                  {sparkle ? (
                    <SparkleBurst key={sparkle.key} size={60} style={[styles.clickSparkle, { left: sparkle.x - 30, top: sparkle.y - 30 }]} />
                  ) : null}
                  {placedFurniture.length > 0 && (
                    <View pointerEvents="none" style={styles.furnitureStage}>
                      {placedFurniture.map((item) => {
                        const source = furnitureImages[item.id];

                        return source ? (
                          <View
                            key={item.id}
                            style={[
                              styles.fixedFurniture,
                              {
                                height: furnitureSizes[item.id]?.height ?? 86,
                                left: furnitureDefaults[item.id]?.x ?? 24,
                                top: furnitureDefaults[item.id]?.y ?? 120,
                                width: furnitureSizes[item.id]?.width ?? 86,
                              },
                            ]}
                          >
                            <Image resizeMode="contain" source={source} style={styles.furnitureImage} />
                          </View>
                        ) : null;
                      })}
                    </View>
                  )}
                  <WalkingPetCat
                    style={styles.roomCat}
                    equippedCatItems={progress.equippedCatItems}
                    equippedItemId={progress.equippedItemId}
                    initialX={112}
                    initialY={-94}
                    maxX={WIDE_ROOM_WIDTH - 230}
                    maxY={-4}
                    minY={-104}
                    ref={walkingCatRef}
                    size="room"
                  />
                </View>
                <TouchableOpacity
                  accessibilityRole="button"
                  onPress={() => navigation.navigate('Drawing')}
                  style={styles.drawingFrameHit}
                >
                  <View pointerEvents="none" style={styles.drawingArtwork}>
                    <Svg height="100%" width="100%">
                      {progress.drawingStrokes.filter((stroke) => stroke.color !== '#ffffff').map((stroke, index) => (
                        <Path
                          d={drawingPointsToPath(stroke.points, 150, 150)}
                          key={`${index}-${stroke.points.length}`}
                          fill="none"
                          stroke={stroke.color}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={Math.max(1.5, stroke.width * 0.4)}
                        />
                      ))}
                    </Svg>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity accessibilityRole="button" onPress={() => setHouseView('outside')} style={styles.insideDoorHit} />
                <TouchableOpacity accessibilityRole="button" onPress={() => setHouseView('kitchen')} style={styles.kitchenDoorHit} />
                <TouchableOpacity accessibilityRole="button" onPress={() => setHouseView('bathroom')} style={styles.bathroomDoorHit} />
              </ImageBackground>
            </ScrollView>
          </View>
        ) : houseView === 'kitchen' ? (
          <View style={styles.room}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <ImageBackground
                imageStyle={styles.roomBackgroundImage}
                resizeMode="stretch"
                source={houseImages.kitchenInterior}
                style={styles.kitchenPane}
              >
                <Pressable accessibilityLabel="Caminar hasta este lugar" onPressIn={handleFloorPress} style={styles.kitchenTouch} />
                {sparkle ? (
                  <SparkleBurst key={sparkle.key} size={60} style={[styles.clickSparkle, { left: sparkle.x - 30, top: sparkle.y - 30 }]} />
                ) : null}
                <WalkingPetCat
                  style={styles.kitchenCat}
                  equippedCatItems={progress.equippedCatItems}
                  equippedItemId={progress.equippedItemId}
                  initialX={320}
                  initialY={132}
                  maxX={KITCHEN_ROOM_WIDTH - 230}
                  maxY={132}
                  minY={48}
                  ref={walkingCatRef}
                  size="room"
                />
                <TouchableOpacity accessibilityRole="button" onPress={() => setHouseView('inside')} style={styles.kitchenExitDoorHit} />
              </ImageBackground>
            </ScrollView>
          </View>
        ) : houseView === 'bathroom' ? (
          <View style={styles.room}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <ImageBackground
                imageStyle={styles.roomBackgroundImage}
                resizeMode="stretch"
                source={houseImages.bathroomInterior}
                style={styles.bathroomPane}
              >
                <Pressable accessibilityLabel="Caminar hasta este lugar" onPressIn={handleFloorPress} style={styles.bathroomTouch} />
                {sparkle ? (
                  <SparkleBurst key={sparkle.key} size={60} style={[styles.clickSparkle, { left: sparkle.x - 30, top: sparkle.y - 30 }]} />
                ) : null}
                <WalkingPetCat
                  style={styles.bathroomCat}
                    equippedCatItems={progress.equippedCatItems}
                    equippedItemId={progress.equippedItemId}
                    initialX={468}
                    initialY={132}
                    maxX={BATHROOM_ROOM_WIDTH - 230}
                    maxY={176}
                    minY={100}
                    ref={walkingCatRef}
                    size="room"
                  />
                <TouchableOpacity accessibilityRole="button" onPress={() => setHouseView('inside')} style={styles.bathroomExitDoorHit} />
              </ImageBackground>
            </ScrollView>
          </View>
        ) : (
          <View
            onLayout={(event) => {
              setExteriorViewportWidth(event.nativeEvent.layout.width);
            }}
            style={styles.room}
          >
            <ScrollView horizontal ref={exteriorScrollRef} showsHorizontalScrollIndicator={false}>
              <ImageBackground
                imageStyle={styles.roomBackgroundImage}
                resizeMode="stretch"
                source={houseImages.exteriorWide}
                style={styles.exteriorWide}
              >
                <Pressable accessibilityLabel="Caminar hasta este lugar" onPressIn={handleFloorPress} style={styles.exteriorTouch} />
                {sparkle ? (
                  <SparkleBurst key={sparkle.key} size={60} style={[styles.clickSparkle, { left: sparkle.x - 30, top: sparkle.y - 30 }]} />
                ) : null}
                <View pointerEvents="none" style={styles.exteriorBarn}>
                  <Image resizeMode="contain" source={shopCategoryImages.pets} style={styles.exteriorBarnImage} />
                </View>
                {placedAnimals.map((animal) => {
                  const position = animalPositions[animal.id] ?? { x: EXTERIOR_YARD_WIDTH / 2, y: 220 };

                  return (
                    <View
                      key={animal.id}
                      style={[styles.yardAnimal, animal.id === 'farm-duck' && styles.frontYardAnimal, { left: position.x, top: position.y }]}
                    >
                      {farmAnimalImages[animal.id] ? (
                        <BlinkingFarmAnimal frames={farmAnimalBlinkImages[animal.id] ?? [farmAnimalImages[animal.id]]} style={styles.yardAnimalImage} />
                      ) : (
                        <MaterialCommunityIcons
                          color={animal.color}
                          name={animal.icon as keyof typeof MaterialCommunityIcons.glyphMap}
                          size={54}
                        />
                      )}
                    </View>
                  );
                })}
                <View style={styles.exteriorHouseBody}>
                  <Image resizeMode="contain" source={houseImages.cuteHouse} style={styles.houseImage} />
                  <TouchableOpacity accessibilityRole="button" onPress={() => setHouseView('inside')} style={styles.doorTileButton} />
                </View>
                <WalkingPetCat
                  style={styles.exteriorCat}
                    equippedCatItems={progress.equippedCatItems}
                    equippedItemId={progress.equippedItemId}
                    initialX={EXTERIOR_YARD_WIDTH / 2 + 158}
                    initialY={120}
                    maxX={EXTERIOR_YARD_WIDTH - 230}
                    maxY={132}
                    minY={72}
                    ref={walkingCatRef}
                    size="room"
                  />
              </ImageBackground>
            </ScrollView>
          </View>
        )}
      </View>

      {houseView === 'inside' || houseView === 'outside' ? (
        <View style={styles.inventorySection}>
          <Text style={styles.sectionTitle}>{houseView === 'inside' ? 'Mis muebles' : 'Mis animales'}</Text>
          <ScrollView contentContainerStyle={styles.inventoryScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.inventoryGrid}>
              {houseView === 'inside' && ownedFurniture.length === 0 ? (
                <View style={styles.emptyInventory}>
                  <Text style={styles.emptyText}>Todavia no compraste muebles.</Text>
                </View>
              ) : null}
              {houseView === 'outside' && ownedAnimals.length === 0 ? (
              <View style={styles.emptyInventory}>
                <Text style={styles.emptyText}>Compra animalitos en la tienda para agregarlos a los corrales.</Text>
              </View>
              ) : null}
              {houseView === 'inside'
                ? ownedFurniture.map((item) => {
                    const placed = progress.placedFurnitureIds.includes(item.id);

                    return (
                      <TouchableOpacity
                        key={item.id}
                        onPress={() => toggleFurniture(item.id)}
                        style={[styles.inventoryCard, placed && styles.placedInventoryCard]}
                      >
                        <View style={[styles.inventoryPreview, { backgroundColor: item.color }]}>
                          {furnitureImages[item.id] ? (
                            <Image resizeMode="contain" source={furnitureImages[item.id]} style={styles.inventoryImage} />
                          ) : (
                            <MaterialCommunityIcons color="#ffffff" name={item.icon as keyof typeof MaterialCommunityIcons.glyphMap} size={26} />
                          )}
                        </View>
                        <Text style={styles.inventoryName}>{item.name}</Text>
                      </TouchableOpacity>
                    );
                  })
                : ownedAnimals.map((item) => {
                    const placed = progress.placedAnimalIds.includes(item.id);

                    return (
                      <TouchableOpacity
                        key={item.id}
                        onPress={() => toggleAnimal(item.id)}
                        style={[styles.inventoryCard, placed && styles.placedInventoryCard]}
                      >
                        <View style={[styles.inventoryPreview, { backgroundColor: item.color }]}>
                          {farmAnimalImages[item.id] ? (
                            <Image resizeMode="contain" source={farmAnimalImages[item.id]} style={styles.inventoryAnimalImage} />
                          ) : (
                            <MaterialCommunityIcons color="#ffffff" name={item.icon as keyof typeof MaterialCommunityIcons.glyphMap} size={34} />
                          )}
                        </View>
                        <Text style={styles.inventoryName}>{item.name}</Text>
                      </TouchableOpacity>
                    );
                  })}
            </View>
          </ScrollView>
        </View>
      ) : null}
      <AppBottomMenu />
    </View>
  );
}

function drawingPointsToPath(points: { x: number; y: number }[], width: number, height: number) {
  if (points.length === 0) {
    return '';
  }

  const [firstPoint, ...rest] = points;
  const safeFirstPoint = {
    x: Math.max(0, Math.min(1, firstPoint.x)),
    y: Math.max(0, Math.min(1, firstPoint.y)),
  };
  return [
    `M ${safeFirstPoint.x * width} ${safeFirstPoint.y * height}`,
    ...rest.map((point) => {
      const safePoint = {
        x: Math.max(0, Math.min(1, point.x)),
        y: Math.max(0, Math.min(1, point.y)),
      };
      return `L ${safePoint.x * width} ${safePoint.y * height}`;
    }),
  ].join(' ');
}

const styles = StyleSheet.create({
  bathroomDoorHit: {
    height: 148,
    position: 'absolute',
    right: 54,
    top: 82,
    width: 108,
    zIndex: 1,
  },
  bathroomCat: {
    position: 'absolute',
    zIndex: 4,
  },
  bathroomTouch: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 0,
  },
  clickSparkle: {
    zIndex: 20,
  },
  bathroomExitDoorHit: {
    height: 204,
    left: 36,
    position: 'absolute',
    top: 50,
    width: 132,
    zIndex: 8,
  },
  bathroomPane: {
    backgroundColor: '#ffffff',
    height: ROOM_HEIGHT - 4,
    overflow: 'hidden',
    position: 'relative',
    width: BATHROOM_ROOM_WIDTH,
  },
  doorTileButton: {
    bottom: 6,
    height: 112,
    left: 92,
    position: 'absolute',
    width: 110,
    zIndex: 3,
  },
  emptyInventory: {
    backgroundColor: '#ffffff',
    borderColor: '#f0dcc0',
    borderRadius: 8,
    borderWidth: 2,
    padding: 16,
    width: '100%',
  },
  fixedFurniture: {
    left: 0,
    position: 'absolute',
    top: 0,
    zIndex: 3,
  },
  furnitureImage: {
    height: '100%',
    width: '100%',
  },
  drawingArtwork: {
    aspectRatio: 1,
    left: 15,
    overflow: 'hidden',
    position: 'absolute',
    top: 15,
    width: 150,
    zIndex: 1,
  },
  drawingFrameHit: {
    aspectRatio: 1,
    left: 468,
    overflow: 'hidden',
    position: 'absolute',
    top: 76,
    width: 180,
    zIndex: 8,
  },
  emptyText: {
    color: '#6c5a42',
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
    textAlign: 'center',
  },
  exteriorCat: {
    position: 'absolute',
    zIndex: 4,
  },
  exteriorBarn: {
    height: 174,
    left: 706,
    position: 'absolute',
    top: 36,
    width: 190,
    zIndex: 1,
  },
  exteriorBarnImage: {
    height: '100%',
    width: '100%',
  },
  exteriorTouch: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 0,
  },
  frontYardAnimal: {
    zIndex: 4,
  },
  exteriorHouseBody: {
    alignItems: 'center',
    bottom: 125,
    height: 214,
    left: EXTERIOR_YARD_WIDTH / 2 - 146,
    position: 'absolute',
    transform: [{ scale: 1.2 }],
    width: 293,
    zIndex: 3,
  },
  exteriorWide: {
    height: ROOM_HEIGHT - 4,
    position: 'relative',
    width: EXTERIOR_YARD_WIDTH,
  },
  floor: {
    bottom: 0,
    left: 0,
    height: ROOM_FLOOR_HEIGHT,
    position: 'absolute',
    right: 0,
    width: '100%',
    zIndex: 4,
  },
  floorTouch: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 0,
  },
  furnitureStage: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 6,
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomColor: '#f0dcc0',
    borderBottomWidth: 2,
    paddingBottom: 6,
    paddingHorizontal: 14,
    paddingTop: 6,
  },
  headerTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  insideDoorHit: {
    height: 178,
    left: 682,
    position: 'absolute',
    top: 68,
    width: 166,
    zIndex: 1,
  },
  inventoryScroll: {
    paddingBottom: 128,
  },
  inventorySection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  mainRoomPane: {
    backgroundColor: '#ffffff',
    height: ROOM_HEIGHT - 4,
    overflow: 'hidden',
    position: 'relative',
    width: WIDE_ROOM_WIDTH,
  },
  kitchenCat: {
    position: 'absolute',
    zIndex: 4,
  },
  kitchenDoorHit: {
    height: 190,
    left: 278,
    position: 'absolute',
    top: 68,
    width: 154,
    zIndex: 1,
  },
  kitchenExitDoorHit: {
    height: 204,
    position: 'absolute',
    right: 22,
    top: 62,
    width: 132,
    zIndex: 8,
  },
  kitchenPane: {
    backgroundColor: '#ffffff',
    height: ROOM_HEIGHT - 4,
    overflow: 'hidden',
    position: 'relative',
    width: KITCHEN_ROOM_WIDTH,
  },
  kitchenTouch: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 0,
  },
  houseImage: {
    height: '100%',
    width: '100%',
  },
  inventoryCard: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#f0dcc0',
    borderRadius: 8,
    borderWidth: 2,
    flexBasis: '30.6%',
    height: 104,
    justifyContent: 'center',
    padding: 8,
  },
  inventoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  inventoryName: {
    color: '#372413',
    fontSize: 12,
    fontWeight: '900',
    marginTop: 5,
    textAlign: 'center',
  },
  inventoryImage: {
    height: 46,
    width: '100%',
  },
  inventoryAnimalImage: {
    height: 64,
    width: '100%',
  },
  inventoryPreview: {
    alignItems: 'center',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    width: '100%',
  },
  placedInventoryCard: {
    borderColor: '#57b8a9',
    borderWidth: 5,
  },
  room: {
    backgroundColor: '#ffffff',
    borderColor: '#f0dcc0',
    borderRadius: 8,
    borderWidth: 2,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    height: ROOM_HEIGHT,
    overflow: 'hidden',
  },
  roomCat: {
    position: 'absolute',
    zIndex: 20,
  },
  roomBackgroundImage: {
    borderRadius: 6,
  },
  sceneArea: {
    paddingBottom: 0,
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  screen: {
    backgroundColor: '#fff7e8',
    flex: 1,
  },
  sectionTitle: {
    color: '#372413',
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 12,
  },
  title: {
    color: '#372413',
    flex: 1,
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'left',
  },
  titleGroup: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 2,
    marginLeft: 8,
  },
  yardAnimal: {
    alignItems: 'center',
    height: 104,
    justifyContent: 'center',
    position: 'absolute',
    width: 104,
    zIndex: 2,
  },
  yardAnimalImage: {
    height: 100,
    width: 100,
  },
});
