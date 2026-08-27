import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Image,
  ImageBackground,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AppBottomMenu } from '../components/AppBottomMenu';
import { CoinBadge } from '../components/CoinBadge';
import { HeaderBackButton } from '../components/HeaderBackButton';
import { PetCat } from '../components/PetCat';
import { useProgress } from '../context/ProgressContext';
import { furnitureImages, houseImages } from '../data/assetImages';
import { shopItems } from '../data/gameContent';
import { RootStackParamList, ShopItem } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'House'>;

const MAIN_ROOM_WIDTH = 720;
const EXTERIOR_YARD_WIDTH = 960;

const furnitureDefaults: Record<string, { x: number; y: number }> = {
  'soft-bed': { x: 24, y: 144 },
  'small-table': { x: 142, y: 176 },
  'fish-lamp': { x: 226, y: 116 },
  'window-plant': { x: 34, y: 54 },
  'red-sofa': { x: 392, y: 142 },
  'bookcase-open': { x: 590, y: 46 },
  'round-rug': { x: 414, y: 205 },
  'floor-lamp': { x: 526, y: 96 },
  'tv-cabinet': { x: 430, y: 56 },
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

export function HouseScreen({ navigation }: Props) {
  const { progress, setFurniturePosition, toggleFurniture } = useProgress();
  const [houseView, setHouseView] = useState<'outside' | 'inside' | 'bathroom'>('outside');
  const [activeFurnitureId, setActiveFurnitureId] = useState<string | null>(null);
  const [isDraggingFurniture, setIsDraggingFurniture] = useState(false);
  const [roomSize, setRoomSize] = useState({ height: 0, width: 0 });
  const ownedFurniture = useMemo(
    () => shopItems.filter((item) => item.target === 'house' && progress.ownedItems.includes(item.id)),
    [progress.ownedItems],
  );
  const placedFurniture = ownedFurniture.filter((item) => progress.placedFurnitureIds.includes(item.id));

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <HeaderBackButton />
        <Text style={styles.title}>Casa</Text>
        <CoinBadge coins={progress.coins} />
      </View>

      <View style={styles.sceneArea}>
        {houseView === 'inside' ? (
          <View style={styles.room}>
            <ScrollView horizontal scrollEnabled={!isDraggingFurniture} showsHorizontalScrollIndicator={false}>
              <ImageBackground
                imageStyle={styles.roomBackgroundImage}
                resizeMode="stretch"
                source={houseImages.interior}
                style={styles.mainRoomPane}
              >
                <View
                  onLayout={(event) => {
                    const { height, width } = event.nativeEvent.layout;
                    setRoomSize({ height, width });
                  }}
                  style={styles.floor}
                >
                  <View style={styles.roomCat}>
                    <PetCat
                      equippedCatItems={progress.equippedCatItems}
                      equippedItemId={progress.equippedItemId}
                      size="room"
                    />
                  </View>
                  {placedFurniture.length === 0 ? (
                    <View style={styles.emptyRoom}>
                      <MaterialCommunityIcons color="#9a6b45" name="sofa-outline" size={48} />
                      <Text style={styles.emptyText}>Compra muebles en la tienda y colocalos aca.</Text>
                    </View>
                  ) : (
                    <View style={styles.furnitureStage}>
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
                <TouchableOpacity accessibilityRole="button" onPress={() => setHouseView('bathroom')} style={styles.bathroomDoorHit} />
              </ImageBackground>
            </ScrollView>
          </View>
        ) : houseView === 'bathroom' ? (
          <View style={styles.room}>
            <ImageBackground
              imageStyle={styles.roomBackgroundImage}
              resizeMode="stretch"
              source={houseImages.bathroomInterior}
              style={styles.bathroomPane}
            >
              <TouchableOpacity accessibilityRole="button" onPress={() => setHouseView('inside')} style={styles.bathroomExitDoorHit} />
            </ImageBackground>
          </View>
        ) : (
          <View style={styles.room}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <ImageBackground
                imageStyle={styles.roomBackgroundImage}
                resizeMode="stretch"
                source={houseImages.exteriorWide}
                style={styles.exteriorWide}
              >
                <View style={styles.exteriorHouseBody}>
                  <Image resizeMode="contain" source={houseImages.cuteHouse} style={styles.houseImage} />
                  <TouchableOpacity accessibilityRole="button" onPress={() => setHouseView('inside')} style={styles.doorTileButton} />
                </View>
              </ImageBackground>
            </ScrollView>
          </View>
        )}
      </View>

      <View style={styles.inventorySection}>
        <Text style={styles.sectionTitle}>Mis muebles</Text>
        <ScrollView contentContainerStyle={styles.inventoryScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.inventoryGrid}>
            {ownedFurniture.length === 0 ? (
              <View style={styles.emptyInventory}>
                <Text style={styles.emptyText}>Todavia no compraste muebles.</Text>
              </View>
            ) : (
              ownedFurniture.map((item) => {
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
                        <MaterialCommunityIcons color="#ffffff" name={item.icon as keyof typeof MaterialCommunityIcons.glyphMap} size={24} />
                      )}
                    </View>
                    <Text style={styles.inventoryName}>{item.name}</Text>
                    <Text style={styles.inventoryAction}>{placed ? 'Quitar' : 'Colocar'}</Text>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </ScrollView>
      </View>
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

function DraggableFurniture({ isActive, item, onDragEnd, onDragStart, onMoveEnd, position, roomSize, source }: DraggableFurnitureProps) {
  const size = furnitureSizes[item.id] ?? { height: 86, width: 86 };
  const pan = useRef(new Animated.ValueXY(position)).current;
  const latestPosition = useRef(position);
  const roomSizeRef = useRef(roomSize);

  useEffect(() => {
    latestPosition.current = position;
    pan.setValue(position);
  }, [pan, position]);

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
        const maxX = Math.max(0, currentRoomSize.width - size.width);
        const maxY = Math.max(0, currentRoomSize.height - size.height);
        const nextPosition = {
          x: clamp(latestPosition.current.x + gesture.dx, 0, maxX),
          y: clamp(latestPosition.current.y + gesture.dy, 0, maxY),
        };

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
          transform: pan.getTranslateTransform(),
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
    zIndex: 8,
  },
  bathroomExitDoorHit: {
    height: 204,
    left: 30,
    position: 'absolute',
    top: 50,
    width: 116,
    zIndex: 8,
  },
  bathroomPane: {
    backgroundColor: '#ffffff',
    height: 336,
    overflow: 'hidden',
    width: '100%',
  },
  doorTileButton: {
    bottom: 8,
    height: 88,
    left: 98,
    position: 'absolute',
    width: 72,
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
  emptyRoom: {
    alignItems: 'center',
    gap: 10,
    justifyContent: 'center',
    minHeight: 190,
    padding: 18,
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
  exteriorHouseBody: {
    alignItems: 'center',
    bottom: 58,
    height: 178,
    left: EXTERIOR_YARD_WIDTH / 2 - 122,
    position: 'absolute',
    width: 244,
    zIndex: 3,
  },
  exteriorWide: {
    height: 336,
    position: 'relative',
    width: EXTERIOR_YARD_WIDTH,
  },
  floor: {
    bottom: 0,
    left: 0,
    position: 'relative',
    right: 0,
    top: 0,
    width: '100%',
    height: '100%',
  },
  furnitureStage: {
    flex: 1,
    position: 'relative',
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomColor: '#f0dcc0',
    borderBottomWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 16,
    paddingHorizontal: 14,
    paddingTop: 54,
  },
  insideDoorHit: {
    height: 178,
    left: 28,
    position: 'absolute',
    top: 48,
    width: 166,
    zIndex: 8,
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
    height: 336,
    overflow: 'hidden',
    position: 'relative',
    width: MAIN_ROOM_WIDTH,
  },
  houseImage: {
    height: '100%',
    width: '100%',
  },
  inventoryAction: {
    color: '#ff7a59',
    fontSize: 14,
    fontWeight: '900',
    marginTop: 4,
  },
  inventoryCard: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#f0dcc0',
    borderRadius: 8,
    borderWidth: 2,
    flexBasis: '47%',
    flexGrow: 1,
    minHeight: 142,
    padding: 10,
  },
  inventoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  inventoryName: {
    color: '#372413',
    fontSize: 15,
    fontWeight: '900',
    marginTop: 8,
    textAlign: 'center',
  },
  inventoryImage: {
    height: 58,
    width: '100%',
  },
  inventoryPreview: {
    alignItems: 'center',
    borderRadius: 8,
    height: 54,
    justifyContent: 'center',
    width: '100%',
  },
  placedInventoryCard: {
    borderColor: '#57b8a9',
  },
  room: {
    backgroundColor: '#ffffff',
    borderColor: '#f0dcc0',
    borderRadius: 8,
    borderWidth: 2,
    height: 340,
    overflow: 'hidden',
  },
  roomCat: {
    bottom: -6,
    left: 112,
    position: 'absolute',
    zIndex: 2,
  },
  roomBackgroundImage: {
    borderRadius: 6,
  },
  sceneArea: {
    padding: 20,
    paddingBottom: 14,
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
    paddingHorizontal: 10,
    textAlign: 'center',
  },
});
