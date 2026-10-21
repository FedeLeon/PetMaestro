import { usePresentation } from '../../presentation/usePresentation';
import { useSceneActivity } from '../../context/ScenePresentation';
import { BackHandler, Image, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useInteriorCamera } from './useInteriorCamera';
import Svg, { Path } from 'react-native-svg';
import { SparkleBurst, WalkingPetCat, type WalkingPetCatHandle } from '../PetCat';
import { furnitureImages, houseImages, uiImages } from '../../data/assetImages';
import { INTERIOR_WIDTH, INTERIOR_FLOOR_Y, interiorDoors, interiorFurniture, type InteriorDoorId } from '../../data/houseInteriorLayout';
import type { ProgressState, ShopItem } from '../../types';
import { styles } from '../../styles/house/interior.styles';
import { interiorViewportLayout } from '../../styles/house/interior.layout';
import { styles as televisionStyles } from '../../styles/house/television.styles';
import { FarmAnimationClock } from '../FarmAnimationClock';
import { useTelevision } from './useTelevision';
import { TelevisionCat, TelevisionPicture } from './TelevisionAnimation';
import { useSoftBedRest } from './useSoftBedRest';
import { useHouseLamps } from './useHouseLamps';
import { HouseLamp, SoftBedCat, SoftBedFront } from './FurnitureAnimations';
import { styles as furnitureStyles } from '../../styles/house/furnitureInteraction.styles';
import { furnitureTouchRect } from '../../styles/house/furnitureInteraction.layout';

type Props = {
  drawingStrokes: ProgressState['drawingStrokes']; onOpenDrawing: () => void;
  onOpenLibrary: () => void;
  onOpenRoom: (room: InteriorDoorId) => void; placedFurniture: ShopItem[];
  equippedCatItems: ProgressState['equippedCatItems']; equippedItemId: string | null;
  initialScrollRatio: number; onScrollRatioChange: (ratio: number) => void;
};
export function HouseInterior({ drawingStrokes, equippedCatItems, equippedItemId, onOpenDrawing, onOpenLibrary, onOpenRoom, placedFurniture, initialScrollRatio, onScrollRatioChange }: Props) {
  const presentation = usePresentation();
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [sparkle, setSparkle] = useState<{ x: number; y: number; key: number } | null>(null);
  const cat = useRef<WalkingPetCatHandle>(null);
  const world = useRef<View>(null);
  const pressStart = useRef({ x: 0, y: 0 });
  const sparkleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { scale, width, height, top } = interiorViewportLayout(viewport.height);
  const camera = useInteriorCamera({ width, viewportWidth: viewport.width, scale, initialRatio: initialScrollRatio, onRatioChange: onScrollRatioChange });
  const hasTelevision = placedFurniture.some(item => item.id === 'tv-cabinet');
  const television = useTelevision(cat, hasTelevision, camera.startFollowing);
  const hasBed = placedFurniture.some(item => item.id === 'soft-bed');
  const rest = useSoftBedRest(cat, hasBed, camera.startFollowing);
  const immersive = useSceneActivity(rest.phase !== 'idle' || television.phase !== 'idle', () => { rest.stop(); television.stop(); }, false);
  const lamps = useHouseLamps(placedFurniture.some(item => item.id === 'fish-lamp'), placedFurniture.some(item => item.id === 'floor-lamp'));
  const tvPlacement = interiorFurniture['tv-cabinet'];
  useEffect(() => () => { if (sparkleTimer.current) clearTimeout(sparkleTimer.current); }, []);
  useFocusEffect(useCallback(() => {
    const listener = BackHandler.addEventListener('hardwareBackPress', () => { onOpenRoom('outside'); return true; });
    return () => listener.remove();
  }, [onOpenRoom]));
  return <FarmAnimationClock enabled={television.phase === 'watching' || rest.phase === 'resting'}><View style={[styles.room, immersive && presentation.styles.activityRoom]} onLayout={event => setViewport(event.nativeEvent.layout)} {...camera.panHandlers}>
    <ScrollView testID="interior-scroll" horizontal ref={camera.scrollRef} scrollEnabled={false} style={styles.scroll} contentContainerStyle={styles.scrollContent} showsHorizontalScrollIndicator={false}>
      <View ref={world} collapsable={false} testID="interior-world" style={[styles.scene, { width, height, top }]}>
        <View pointerEvents="none" style={styles.fill}>
          <Image testID="interior-background" source={houseImages.interiorPanorama} resizeMode="contain" style={styles.image} />
        </View>
        {scale > 0 ? <>
          <Pressable accessibilityLabel="Caminar por el salón" style={[styles.floorTouch, { top: INTERIOR_FLOOR_Y * scale }]} onPressIn={event => { pressStart.current = { x: event.nativeEvent.pageX, y: event.nativeEvent.pageY }; }} onPress={event => {
            if (!camera.canTap()) return;
            const { pageX, pageY } = event.nativeEvent;
            if (Math.hypot(pageX - pressStart.current.x, pageY - pressStart.current.y) > 10) return;
            television.stop();
            rest.stop();
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
            const lamp = item.id === 'fish-lamp' || item.id === 'floor-lamp' ? item.id : null;
            return <View testID={`placed-${item.id}`} key={item.id} pointerEvents="box-none" style={[styles.fixedFurniture, { left: placement.x * scale - furnitureWidth / 2, top: bottom * scale - furnitureHeight, width: furnitureWidth, height: furnitureHeight, zIndex: placement.layer ?? 4 }]}>
              <View pointerEvents="none" style={styles.fill}>
                {lamp ? <HouseLamp id={lamp} lit={lamps.lit[lamp]} /> : <Image source={source} resizeMode="contain" style={styles.image} />}
                {item.id === 'tv-cabinet' && television.phase === 'watching' ? <TelevisionPicture channel={television.channel} /> : null}
                {item.id === 'soft-bed' && rest.phase === 'resting' ? <><SoftBedCat /><SoftBedFront height={furnitureHeight} /></> : null}
              </View>
            </View>;
          })}
          <View testID="interior-cat-world" pointerEvents="none" style={[styles.catWorld, { transform: [{ scale }] }]}>
            <WalkingPetCat onPositionChange={camera.followCat} ref={cat} equippedCatItems={equippedCatItems} equippedItemId={equippedItemId} initialX={410} initialY={307} minY={284} maxY={347} maxX={INTERIOR_WIDTH - 230} size="room" style={[styles.cat, { opacity: television.phase === 'watching' || rest.phase === 'resting' ? 0 : 1 }]} />
            {television.phase === 'watching' ? <TelevisionCat /> : null}
          </View>
          {hasTelevision ? <Pressable testID="interior-tv" accessibilityRole="button" accessibilityLabel={television.phase === 'watching' ? 'Cambiar canal de la tele' : 'Mirar la tele'} onPress={() => { if (camera.canTap()) { rest.stop(); television.watch(); } }} style={[televisionStyles.touch, { left: (tvPlacement.x - tvPlacement.height * tvPlacement.aspectRatio / 2) * scale, top: (tvPlacement.floorY - tvPlacement.height) * scale, width: tvPlacement.height * tvPlacement.aspectRatio * scale, height: tvPlacement.height * scale }]} /> : null}
          {hasBed ? <Pressable testID="interior-soft-bed" accessibilityRole="button" accessibilityLabel={rest.phase === 'resting' ? 'Despertar al gatito' : 'Descansar en la camita suave'} onPress={() => { if (camera.canTap()) { television.stop(); rest.rest(); } }} style={[furnitureStyles.touch, furnitureTouchRect('soft-bed', scale)]} /> : null}
          {placedFurniture.filter(item => item.id === 'fish-lamp' || item.id === 'floor-lamp').map(item => {
            const id = item.id as 'fish-lamp' | 'floor-lamp';
            const label = id === 'fish-lamp' ? 'lámpara de pez' : 'lámpara de pie';
            const bottom = id === 'fish-lamp' && placedFurniture.some(entry => entry.id === 'small-table') ? 396 : interiorFurniture[id].floorY;
            return <Pressable key={id} testID={`interior-${id}`} accessibilityRole="button" accessibilityLabel={`${lamps.lit[id] ? 'Apagar' : 'Encender'} ${label}`} accessibilityState={{ selected: lamps.lit[id] }} aria-pressed={lamps.lit[id]} onPress={() => { if (camera.canTap()) lamps.toggle(id); }} style={[furnitureStyles.touch, furnitureTouchRect(id, scale, bottom)]} />;
          })}
          {placedFurniture.some(item => item.id === 'bookcase-open') ? <Pressable testID="interior-library" accessibilityRole="button" accessibilityLabel="Abrir biblioteca de cuentos" onPress={() => { if (camera.canTap()) { television.stop(); rest.stop(); onOpenLibrary(); } }} style={[furnitureStyles.touch, furnitureTouchRect('bookcase-open', scale)]} /> : null}
          {sparkle ? <SparkleBurst key={sparkle.key} size={36} style={[styles.clickSparkle, { left: sparkle.x - 18, top: sparkle.y - 18 }]} /> : null}
          <TouchableOpacity accessibilityLabel="Abrir lienzo de dibujo" accessibilityRole="button" onPress={() => { if (camera.canTap()) onOpenDrawing(); }} style={[styles.drawingFrame, { left: 324 * scale, top: 141 * scale, width: 207 * scale, height: 97 * scale }]}>
            <View pointerEvents="none" style={styles.fill}><Svg height="100%" viewBox="0 0 100 100" width="100%">{drawingStrokes.filter(stroke => stroke.color !== '#ffffff').map((stroke, index) => <Path d={drawingPointsToPath(stroke.points)} key={`${index}-${stroke.points.length}`} fill="none" stroke={stroke.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={Math.max(1.5, stroke.width * .4)} />)}</Svg></View>
          </TouchableOpacity>
          {interiorDoors.map(door => <TouchableOpacity key={door.id} testID={`interior-door-${door.id}`} accessibilityLabel={door.accessibilityLabel} accessibilityRole="button" onPress={() => { if (camera.canTap()) onOpenRoom(door.id); }} style={[styles.door, { left: door.x * scale, top: door.y * scale, width: door.width * scale, height: door.height * scale }]} />)}
        </> : null}
      </View>
    </ScrollView>
    {width > viewport.width + 2 && [-1, 1].map(direction => <TouchableOpacity key={direction} accessibilityRole="button" accessibilityLabel={direction < 0 ? 'Ver la izquierda de la casa' : 'Ver la derecha de la casa'} onPress={() => camera.scrollBy(direction as -1 | 1)} style={[styles.cameraArrow, direction < 0 ? styles.cameraLeft : styles.cameraRight]}><Image accessible={false} source={uiImages.shopPageArrow} resizeMode="contain" style={[styles.image, direction < 0 && styles.reverseArrow]} /></TouchableOpacity>)}
    {television.phase !== 'idle' ? <View testID="tv-status" pointerEvents="none" style={televisionStyles.status}><Text style={televisionStyles.statusText}>{television.phase === 'approaching' ? '¡Vamos a mirar la tele!' : 'Tocá la tele para cambiar de canal'}</Text></View> : null}
    {rest.phase !== 'idle' ? <View testID="soft-bed-status" pointerEvents="none" style={televisionStyles.status}><Text style={televisionStyles.statusText}>{rest.phase === 'approaching' ? '¡Vamos a descansar en la camita!' : 'Shhh… Tocá la camita para despertarlo'}</Text></View> : null}
  </View></FarmAnimationClock>;
}
function drawingPointsToPath(points: { x: number; y: number }[]) {
  if (!points.length) return '';
  return points.map((point, index) => `${index ? 'L' : 'M'} ${Math.max(0, Math.min(1, point.x)) * 100} ${Math.max(0, Math.min(1, point.y)) * 100}`).join(' ');
}
