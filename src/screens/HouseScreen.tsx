import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Image,
  ImageBackground,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { GestureResponderEvent } from 'react-native';
import { AppBottomMenu } from '../components/AppBottomMenu';
import { CoinBadge } from '../components/CoinBadge';
import { HeaderBackButton } from '../components/HeaderBackButton';
import { SparkleBurst, WalkingPetCat, WalkingPetCatHandle } from '../components/PetCat';
import { useProgress } from '../context/ProgressContext';
import { furnitureImages, houseImages } from '../data/assetImages';
import { shopItems } from '../data/gameContent';
import { RootStackParamList, ShopItem } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'House'>;

const WIDE_ROOM_WIDTH = 920;
const KITCHEN_ROOM_WIDTH = 760;
const BATHROOM_ROOM_WIDTH = 720;
const EXTERIOR_YARD_WIDTH = 960;
const ROOM_HEIGHT = 420;
const ROOM_FLOOR_HEIGHT = 184;

const furnitureDefaults: Record<string, { x: number; y: number }> = {
  'soft-bed': { x: 24, y: 44 },
  'small-table': { x: 142, y: 58 },
  'fish-lamp': { x: 226, y: 22 },
  'window-plant': { x: 34, y: 26 },
  'red-sofa': { x: 392, y: 48 },
  'bookcase-open': { x: 590, y: 12 },
  'round-rug': { x: 414, y: 64 },
  'floor-lamp': { x: 526, y: 8 },
  'tv-cabinet': { x: 430, y: 54 },
};

const furnitureSizes: Record<string, { width: number; height: number }> = {
  'soft-bed': { width: 112, height: 92 },
  'small-table': { width: 90, height: 74 },
  'fish-lamp': { width: 78, height: 100 },
  'window-plant': { width: 76, height: 88 },
  'red-sofa': { width: 128, height: 92 },
  'bookcase-open': { width: 82, height: 118 },
  'round-rug': { width: 126, height: 82 },
  'floor-lamp': { width: 62, height: 132 },
  'tv-cabinet': { width: 122, height: 78 },
};

const animalPositions: Record<string, { x: number; y: number }> = {
  'farm-cow': { x: 130, y: 176 },
  'farm-pig': { x: 750, y: 204 },
  'farm-sheep': { x: 230, y: 216 },
  'farm-horse': { x: 675, y: 152 },
  'farm-duck': { x: 342, y: 238 },
  'farm-rabbit': { x: 600, y: 244 },
};

export function HouseScreen({ navigation }: Props) {
  const { progress, setFurniturePosition, toggleAnimal, toggleFurniture } = useProgress();
  const [houseView, setHouseView] = useState<'outside' | 'inside' | 'kitchen' | 'bathroom'>('outside');
  const [activeFurnitureId, setActiveFurnitureId] = useState<string | null>(null);
  const [isDraggingFurniture, setIsDraggingFurniture] = useState(false);
  const [exteriorViewportWidth, setExteriorViewportWidth] = useState(0);
  const [roomSize, setRoomSize] = useState({ height: 0, width: 0 });
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
        <HeaderBackButton />
        <View style={styles.titleGroup}>
          <MaterialCommunityIcons color="#26796e" name="home-heart" size={28} />
          <Text style={styles.title}>Casa</Text>
        </View>
        <CoinBadge coins={progress.coins} />
      </View>

      <View style={styles.sceneArea}>
        {houseView === 'inside' ? (
          <View style={styles.room}>
            <ScrollView horizontal scrollEnabled={!isDraggingFurniture} showsHorizontalScrollIndicator={false}>
              <ImageBackground
                imageStyle={styles.roomBackgroundImage}
                resizeMode="stretch"
                source={houseImages.interiorWide}
                style={styles.mainRoomPane}
              >
                <View
                  onLayout={(event) => {
                    const { height, width } = event.nativeEvent.layout;
                    setRoomSize({ height, width });
                  }}
                  style={styles.floor}
                >
                  <Pressable accessibilityLabel="Caminar hasta este lugar" onPressIn={handleFloorPress} style={styles.floorTouch} />
                  {sparkle ? (
                    <SparkleBurst key={sparkle.key} size={60} style={[styles.clickSparkle, { left: sparkle.x - 30, top: sparkle.y - 30 }]} />
                  ) : null}
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
                  {placedFurniture.length > 0 && (
                    <View pointerEvents="box-none" style={styles.furnitureStage}>
                      {placedFurniture.map((item) => {
                        const source = furnitureImages[item.id];

                        return source ? (
                          <DraggableFurniture
                            isActive={activeFurnitureId === item.id}
                            item={item}
                            key={item.id}
                            onDragEnd={() => {
                              setActiveFurnitureId(null);
                              setIsDraggingFurniture(false);
                            }}
                            onDragStart={() => {
                              setActiveFurnitureId(item.id);
                              setIsDraggingFurniture(true);
                            }}
                            onMoveEnd={setFurniturePosition}
                            position={progress.furniturePositions[item.id] ?? furnitureDefaults[item.id] ?? { x: 24, y: 120 }}
                            roomSize={roomSize}
                            source={source}
                          />
                        ) : null;
                      })}
                    </View>
                  )}
                </View>
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
                {placedAnimals.map((animal) => {
                  const position = animalPositions[animal.id] ?? { x: EXTERIOR_YARD_WIDTH / 2, y: 220 };

                  return (
                    <View key={animal.id} style={[styles.yardAnimal, { left: position.x, top: position.y }]}>
                      <MaterialCommunityIcons
                        color={animal.color}
                        name={animal.icon as keyof typeof MaterialCommunityIcons.glyphMap}
                        size={54}
                      />
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
                          <MaterialCommunityIcons color="#ffffff" name={item.icon as keyof typeof MaterialCommunityIcons.glyphMap} size={34} />
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

type DraggableFurnitureProps = {
  isActive: boolean;
  item: ShopItem;
  onDragEnd: () => void;
  onDragStart: () => void;
  onMoveEnd: (itemId: string, position: { x: number; y: number }) => Promise<void>;
  position: { x: number; y: number };
  roomSize: { height: number; width: number };
  source: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function clampFurniturePosition(position: { x: number; y: number }, roomSize: { height: number; width: number }, size: { height: number; width: number }) {
  if (!roomSize.height || !roomSize.width) {
    return position;
  }

  return {
    x: clamp(position.x, 0, Math.max(0, roomSize.width - size.width)),
    y: clamp(position.y, 0, Math.max(0, roomSize.height - size.height)),
  };
}

function DraggableFurniture({ isActive, item, onDragEnd, onDragStart, onMoveEnd, position, roomSize, source }: DraggableFurnitureProps) {
  const size = furnitureSizes[item.id] ?? { height: 86, width: 86 };
  const initialPosition = clampFurniturePosition(position, roomSize, size);
  const pan = useRef(new Animated.ValueXY(initialPosition)).current;
  const latestPosition = useRef(initialPosition);
  const roomSizeRef = useRef(roomSize);

  useEffect(() => {
    const nextPosition = clampFurniturePosition(position, roomSize, size);
    latestPosition.current = nextPosition;
    pan.setValue(nextPosition);
  }, [pan, position, roomSize, size]);

  useEffect(() => {
    roomSizeRef.current = roomSize;
  }, [roomSize]);

  const responder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        onDragStart();
        pan.setOffset(latestPosition.current);
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_event, gesture) => {
        pan.flattenOffset();
        const currentRoomSize = roomSizeRef.current;
        const nextPosition = clampFurniturePosition(
          {
            x: latestPosition.current.x + gesture.dx,
            y: latestPosition.current.y + gesture.dy,
          },
          currentRoomSize,
          size,
        );

        latestPosition.current = nextPosition;
        pan.setValue(nextPosition);
        void onMoveEnd(item.id, nextPosition);
        onDragEnd();
      },
      onPanResponderTerminate: () => {
        pan.flattenOffset();
        pan.setValue(latestPosition.current);
        onDragEnd();
      },
      onPanResponderTerminationRequest: () => false,
      onShouldBlockNativeResponder: () => true,
    }),
  ).current;

  return (
    <Animated.View
      {...responder.panHandlers}
      style={[
        styles.draggableFurniture,
        {
          height: size.height,
          left: pan.x,
          top: pan.y,
          width: size.width,
          zIndex: isActive ? 30 : 4,
        },
      ]}
    >
      <Image resizeMode="contain" source={source} style={styles.draggableFurnitureImage} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bathroomDoorHit: {
    height: 148,
    position: 'absolute',
    right: 20,
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
    bottom: 10,
    height: 106,
    left: 118,
    position: 'absolute',
    width: 86,
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
  draggableFurniture: {
    left: 0,
    position: 'absolute',
    top: 0,
    zIndex: 3,
  },
  draggableFurnitureImage: {
    height: '100%',
    width: '100%',
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
  exteriorTouch: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 0,
  },
  exteriorHouseBody: {
    alignItems: 'center',
    bottom: 62,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 8,
    paddingHorizontal: 14,
    paddingTop: 8,
  },
  insideDoorHit: {
    height: 178,
    left: 286,
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
    left: 48,
    position: 'absolute',
    top: 68,
    width: 134,
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
    height: ROOM_HEIGHT,
    overflow: 'hidden',
  },
  roomCat: {
    position: 'absolute',
    zIndex: 2,
  },
  roomBackgroundImage: {
    borderRadius: 6,
  },
  sceneArea: {
    paddingBottom: 12,
    paddingHorizontal: 0,
    paddingTop: 12,
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
  },
  yardAnimal: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.82)',
    borderColor: '#ffffff',
    borderRadius: 999,
    borderWidth: 3,
    height: 72,
    justifyContent: 'center',
    position: 'absolute',
    width: 72,
    zIndex: 2,
  },
});
