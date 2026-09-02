import { Image, ImageBackground, Pressable, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SparkleBurst, WalkingPetCat, WalkingPetCatHandle } from '../PetCat';
import { furnitureImages, houseImages } from '../../data/assetImages';
import type { ProgressState, ShopItem } from '../../types';
import { styles } from '../../styles/house/interior.styles';

type Props = {
  drawingStrokes: ProgressState['drawingStrokes'];
  sparkle: { x: number; y: number; key: number } | null;
  onWalkTo: (x: number, y: number) => void;
  onOpenBathroom: () => void;
  onOpenDrawing: () => void;
  onOpenKitchen: () => void;
  onOpenOutside: () => void;
  placedFurniture: ShopItem[];
  walkingCatRef: React.RefObject<WalkingPetCatHandle | null>;
  equippedCatItems: ProgressState['equippedCatItems'];
  equippedItemId: string | null;
};

const FLOOR_TOP_RATIO = 0.545;
const WALKING_CAT_WIDTH = 230;
const WALKING_CAT_HEIGHT = 284;

const furniturePlacements: Record<string, { height: number; width: number; x: number; y: number }> = {
  'soft-bed': { width: 176, height: 108, x: 0.025, y: 0.47 },
  'small-table': { width: 104, height: 86, x: 0.29, y: 0.38 },
  'fish-lamp': { width: 92, height: 142, x: 0.43, y: 0.18 },
  'window-plant': { width: 72, height: 94, x: 0.37, y: 0.43 },
  'red-sofa': { width: 193, height: 113, x: 0.56, y: 0.38 },
  'bookcase-open': { width: 116, height: 166, x: 0.66, y: 0.4 },
  'round-rug': { width: 190, height: 116, x: 0.46, y: 0.62 },
  'floor-lamp': { width: 176, height: 392, x: 0.62, y: -0.36 },
  'tv-cabinet': { width: 303, height: 168, x: 0.12, y: 0.18 },
};

export function HouseInterior({ drawingStrokes, equippedCatItems, equippedItemId, onOpenBathroom, onOpenDrawing, onOpenKitchen, onOpenOutside, onWalkTo, placedFurniture, walkingCatRef, sparkle }: Props) {
  const [sceneLayout, setSceneLayout] = useState({ height: 0, width: 0 });
  const floorTop = sceneLayout.height * FLOOR_TOP_RATIO;
  const floorHeight = Math.max(0, sceneLayout.height - floorTop);
  const furnitureScale = sceneLayout.width > 0 ? sceneLayout.width / 1300 : 1;
  const handleLayout = (event: LayoutChangeEvent) => setSceneLayout(event.nativeEvent.layout);

  return (
    <View style={styles.room}>
      <ImageBackground imageStyle={styles.roomBackgroundImage} onLayout={handleLayout} resizeMode="stretch" source={houseImages.interiorWide} style={styles.scene}>
        <View pointerEvents="box-none" style={[styles.floor, { height: floorHeight }]}> 
          <Pressable accessibilityLabel="Caminar hasta este lugar" onPressIn={(event) => onWalkTo(event.nativeEvent.locationX, event.nativeEvent.locationY)} style={styles.floorTouch} />
          {sparkle ? <SparkleBurst key={sparkle.key} size={60} style={[styles.clickSparkle, { left: sparkle.x - 30, top: sparkle.y - 30 }]} /> : null}
          {placedFurniture.length > 0 ? <View pointerEvents="none" style={styles.furnitureStage}>
            {placedFurniture.map((item) => {
              const placement = furniturePlacements[item.id];
              if (!furnitureImages[item.id] || !placement) return null;
              return <View key={item.id} style={[styles.fixedFurniture, {
                height: placement.height * furnitureScale,
                left: sceneLayout.width * placement.x,
                top: floorHeight * placement.y,
                width: placement.width * furnitureScale,
              }]}>
                <Image resizeMode="contain" source={furnitureImages[item.id]} style={styles.furnitureImage} />
              </View>;
            })}
          </View> : null}
          <WalkingPetCat
            equippedCatItems={equippedCatItems}
            equippedItemId={equippedItemId}
            initialX={112}
            initialY={-94}
            maxX={Math.max(0, sceneLayout.width - WALKING_CAT_WIDTH)}
            maxY={Math.max(-110, floorHeight - WALKING_CAT_HEIGHT)}
            minY={-110}
            ref={walkingCatRef}
            size="room"
            style={styles.roomCat}
          />
        </View>
        <TouchableOpacity accessibilityLabel="Abrir lienzo de dibujo" accessibilityRole="button" onPress={onOpenDrawing} style={[styles.drawingFrameHit, { height: sceneLayout.height * 0.24, left: sceneLayout.width * 0.205, top: sceneLayout.height * 0.18, width: sceneLayout.width * 0.235 }]}>
          <View pointerEvents="none" style={styles.drawingArtwork}>
            <Svg height="100%" viewBox="0 0 100 100" width="100%">
              {drawingStrokes.filter((stroke) => stroke.color !== '#ffffff').map((stroke, index) => <Path d={drawingPointsToPath(stroke.points)} key={`${index}-${stroke.points.length}`} fill="none" stroke={stroke.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={Math.max(1.5, stroke.width * 0.4)} />)}
            </Svg>
          </View>
        </TouchableOpacity>
        <TouchableOpacity accessibilityLabel="Salir al exterior" accessibilityRole="button" onPress={onOpenOutside} style={[styles.insideDoorHit, { height: sceneLayout.height * 0.43, left: sceneLayout.width * 0.455, top: sceneLayout.height * 0.13, width: sceneLayout.width * 0.24 }]} />
        <TouchableOpacity accessibilityLabel="Ir a la cocina" accessibilityRole="button" onPress={onOpenKitchen} style={[styles.kitchenDoorHit, { height: sceneLayout.height * 0.42, left: sceneLayout.width * 0.02, top: sceneLayout.height * 0.13, width: sceneLayout.width * 0.17 }]} />
        <TouchableOpacity accessibilityLabel="Ir al baño" accessibilityRole="button" onPress={onOpenBathroom} style={[styles.bathroomDoorHit, { height: sceneLayout.height * 0.42, left: sceneLayout.width * 0.79, top: sceneLayout.height * 0.13, width: sceneLayout.width * 0.19 }]} />
      </ImageBackground>
    </View>
  );
}

function drawingPointsToPath(points: { x: number; y: number }[]) {
  if (!points.length) return '';
  const [first, ...rest] = points;
  const clamp = (point: { x: number; y: number }) => ({ x: Math.max(0, Math.min(1, point.x)), y: Math.max(0, Math.min(1, point.y)) });
  const safeFirst = clamp(first);
  return [`M ${safeFirst.x * 100} ${safeFirst.y * 100}`, ...rest.map((point) => { const safe = clamp(point); return `L ${safe.x * 100} ${safe.y * 100}`; })].join(' ');
}
