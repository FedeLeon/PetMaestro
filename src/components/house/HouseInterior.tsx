import { BackHandler, Image, Pressable, ScrollView, TouchableOpacity, View } from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useInteriorCamera } from './useInteriorCamera';
import Svg, { Path } from 'react-native-svg';
import { SparkleBurst, WalkingPetCat, type WalkingPetCatHandle } from '../PetCat';
import { furnitureImages, houseImages } from '../../data/assetImages';
import { INTERIOR_WIDTH, INTERIOR_HEIGHT, INTERIOR_FLOOR_Y, interiorDoors, interiorFurniture, type InteriorDoorId } from '../../data/houseInteriorLayout';
import type { ProgressState, ShopItem } from '../../types';
import { styles } from '../../styles/house/interior.styles';

type Props = {
  drawingStrokes: ProgressState['drawingStrokes']; onOpenDrawing: () => void;
  onOpenRoom: (room: InteriorDoorId) => void; placedFurniture: ShopItem[];
  equippedCatItems: ProgressState['equippedCatItems']; equippedItemId: string | null;
  initialScrollRatio: number; onScrollRatioChange: (ratio: number) => void;
};
export function HouseInterior({ drawingStrokes, equippedCatItems, equippedItemId, onOpenDrawing, onOpenRoom, placedFurniture, initialScrollRatio, onScrollRatioChange }: Props) {
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [sparkle, setSparkle] = useState<{ x: number; y: number; key: number } | null>(null);
  const cat = useRef<WalkingPetCatHandle>(null);
  const world = useRef<View>(null);
  const pressStart = useRef({ x: 0, y: 0 });
  const sparkleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scale = viewport.height / INTERIOR_HEIGHT;
  const width = INTERIOR_WIDTH * scale;
  const camera = useInteriorCamera({ width, viewportWidth: viewport.width, scale, initialRatio: initialScrollRatio, onRatioChange: onScrollRatioChange });
  useEffect(() => () => { if (sparkleTimer.current) clearTimeout(sparkleTimer.current); }, []);
  useFocusEffect(useCallback(() => {
    const listener = BackHandler.addEventListener('hardwareBackPress', () => { onOpenRoom('outside'); return true; });
    return () => listener.remove();
  }, [onOpenRoom]));
  return <View style={styles.room} onLayout={event => setViewport(event.nativeEvent.layout)} {...camera.panHandlers}>
    <ScrollView testID="interior-scroll" horizontal ref={camera.scrollRef} scrollEnabled={false} style={styles.scroll} contentContainerStyle={styles.scrollContent} showsHorizontalScrollIndicator={false}>
      <View ref={world} collapsable={false} testID="interior-world" style={[styles.scene, { width, height: viewport.height }]}>
        <View pointerEvents="none" style={styles.fill}>
          <Image testID="interior-background" source={houseImages.interiorPanorama} resizeMode="contain" style={styles.image} />
        </View>
        {scale > 0 ? <>
          <Pressable accessibilityLabel="Caminar por el salón" style={[styles.floorTouch, { top: INTERIOR_FLOOR_Y * scale }]} onPressIn={event => { pressStart.current = { x: event.nativeEvent.pageX, y: event.nativeEvent.pageY }; }} onPress={event => {
            if (!camera.canTap()) return;
            const { pageX, pageY } = event.nativeEvent;
            if (Math.hypot(pageX - pressStart.current.x, pageY - pressStart.current.y) > 10) return;
            // Click events on web do not expose locationX/Y. Window coordinates
            // also remain correct after scrolling and over transparent sprites.
            world.current?.measureInWindow((originX, originY) => {
              if (!cat.current) return;
              const x = (pageX - originX) / scale;
              const floorY = Math.max(505, Math.min(568, (pageY - originY) / scale));
              camera.startFollowing();
              cat.current.walkTo(x, floorY - 79);
              setSparkle({ x: x * scale, y: floorY * scale, key: Date.now() });
              if (sparkleTimer.current) clearTimeout(sparkleTimer.current);
              sparkleTimer.current = setTimeout(() => setSparkle(null), 500);
            });
          }} />
          {placedFurniture.map(item => {
            const placement = interiorFurniture[item.id], source = furnitureImages[item.id];
            if (!placement || !source) return null;
            const furnitureHeight = placement.height * scale;
            const furnitureWidth = furnitureHeight * placement.aspectRatio;
            // The fish lamp sits on the free right side of the mesita, if present.
            const bottom = item.id === 'fish-lamp' && placedFurniture.some(entry => entry.id === 'small-table') ? 396 : placement.floorY;
            return <View testID={`placed-${item.id}`} key={item.id} pointerEvents="none" style={[styles.fixedFurniture, { left: placement.x * scale - furnitureWidth / 2, top: bottom * scale - furnitureHeight, width: furnitureWidth, height: furnitureHeight, zIndex: placement.layer ?? 4 }]}><Image source={source} resizeMode="contain" style={styles.image} /></View>;
          })}
          <View testID="interior-cat-world" pointerEvents="none" style={[styles.catWorld, { transform: [{ scale }] }]}>
            <WalkingPetCat onPositionChange={camera.followCat} ref={cat} equippedCatItems={equippedCatItems} equippedItemId={equippedItemId} initialX={410} initialY={307} minY={284} maxY={347} maxX={INTERIOR_WIDTH - 230} size="room" style={styles.cat} />
          </View>
          {sparkle ? <SparkleBurst key={sparkle.key} size={36} style={[styles.clickSparkle, { left: sparkle.x - 18, top: sparkle.y - 18 }]} /> : null}
          <TouchableOpacity accessibilityLabel="Abrir lienzo de dibujo" accessibilityRole="button" onPress={() => { if (camera.canTap()) onOpenDrawing(); }} style={[styles.drawingFrame, { left: 324 * scale, top: 141 * scale, width: 207 * scale, height: 97 * scale }]}>
            <View pointerEvents="none" style={styles.fill}><Svg height="100%" viewBox="0 0 100 100" width="100%">{drawingStrokes.filter(stroke => stroke.color !== '#ffffff').map((stroke, index) => <Path d={drawingPointsToPath(stroke.points)} key={`${index}-${stroke.points.length}`} fill="none" stroke={stroke.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={Math.max(1.5, stroke.width * .4)} />)}</Svg></View>
          </TouchableOpacity>
          {interiorDoors.map(door => <TouchableOpacity key={door.id} testID={`interior-door-${door.id}`} accessibilityLabel={door.accessibilityLabel} accessibilityRole="button" onPress={() => { if (camera.canTap()) onOpenRoom(door.id); }} style={[styles.door, { left: door.x * scale, top: door.y * scale, width: door.width * scale, height: door.height * scale }]} />)}
        </> : null}
      </View>
    </ScrollView>

  </View>;
}
function drawingPointsToPath(points: { x: number; y: number }[]) {
  if (!points.length) return '';
  return points.map((point, index) => `${index ? 'L' : 'M'} ${Math.max(0, Math.min(1, point.x)) * 100} ${Math.max(0, Math.min(1, point.y)) * 100}`).join(' ');
}
