import { useScenePresentation } from '../../context/ScenePresentation';
import { usePresentation } from '../../presentation/usePresentation';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { Image, ImageBackground, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import type { GestureResponderEvent } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlinkingFarmAnimal } from '../BlinkingFarmAnimal';
import { FarmAnimationClock } from '../FarmAnimationClock';
import { WalkingPetCat, WalkingPetCatHandle } from '../PetCat';
import { farmAnimalBlinkImages, farmAnimalImages, houseImages } from '../../data/assetImages';
import type { ProgressState, ShopItem } from '../../types';
import { exteriorFocusRightX, styles } from '../../styles/house/exterior.styles';
import { exteriorAnimalLayout } from '../../styles/house/exterior.layout';
import { gardenFlowers } from '../../data/gardenContent';
import { GARDEN_BED_BOTTOM, gardenFlowerSize, gardenFlowerX } from '../../styles/house/garden.layout';
import { GardenFlowers } from './GardenFlowers';
import { useAnimalPetting } from './useAnimalPetting';
import { animalPettingProfiles, pettingCatTarget } from '../../data/animalPetting';
import { AnimalAffectionHearts } from '../AnimalAffectionHearts';

type Props = { contentWidth: number; ownedItemIds: ProgressState['ownedItems']; equippedCatItems: ProgressState['equippedCatItems']; equippedItemId: string | null; onEnterHouse: () => void; onFloorPress: (event: GestureResponderEvent) => void; placedAnimals: ShopItem[]; walkingCatRef: React.RefObject<WalkingPetCatHandle | null>; sparkle: { x: number; y: number; key: number } | null };
const WALKING_CAT_WIDTH = 230;

export function HouseExterior(props: Props) {
  return <FarmAnimationClock enabled={props.placedAnimals.length > 0}><ExteriorScene {...props} /></FarmAnimationClock>;
}

function ExteriorScene({ contentWidth, ownedItemIds, equippedCatItems, equippedItemId, onEnterHouse, placedAnimals, walkingCatRef }: Props) {
  const presentation = usePresentation();
  const { activity } = useScenePresentation();
  const [watering, setWatering] = useState(false);
  const [viewport, setViewport] = useState({ height: 0, width: 0 });
  const scrollRef = useRef<ScrollView>(null);
  const floorRef = useRef<View>(null);
  const catScale = viewport.height / 600;
  const petting = useAnimalPetting(walkingCatRef, placedAnimals.map(animal => animal.id).join('|'), `${contentWidth}:${viewport.height}`);
  const changeWatering = useCallback((active: boolean) => { if (active) petting.cancel(); setWatering(active); }, [petting.cancel]);
  useEffect(() => {
    if (!viewport.width) return;
    const centered = (contentWidth - viewport.width) / 2;
    const sceneryInView = contentWidth * exteriorFocusRightX - viewport.width + 12;
    scrollRef.current?.scrollTo({ animated: false, x: Math.min(Math.max(0, contentWidth - viewport.width), Math.max(0, centered, sceneryInView)), y: 0 });
  }, [contentWidth, viewport.width]);
  return <View testID="exterior-scene" style={[styles.room, activity && presentation.styles.activityRoom]} onLayout={(event) => setViewport(event.nativeEvent.layout)}>
    <ScrollView horizontal ref={scrollRef} showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
      <ImageBackground testID="exterior-background" imageStyle={styles.roomBackgroundImage} resizeMode="stretch" source={houseImages.exteriorWide} style={[styles.wide, { width: contentWidth }]}>
        <Pressable ref={floorRef} disabled={watering} accessibilityLabel="Caminar hasta este lugar" onPress={event => {
          if (catScale <= 0) return;
          petting.cancel();
          const { pageX, pageY } = event.nativeEvent;
          floorRef.current?.measureInWindow((x, y) => walkingCatRef.current?.walkTo((pageX - x) / catScale, (pageY - y) / catScale - 79));
        }} style={styles.touch} />
        {catScale > 0 && placedAnimals.map(animal => {
          const position = exteriorAnimalLayout[animal.id];
          if (!position) return null;
          const size = Math.min(position.size * catScale, contentWidth * position.maxWidth);
          const center = contentWidth * position.x;
          const flowerSize = gardenFlowerSize(viewport.height);
          const overlapsGarden = gardenFlowers.some((flower, index) => ownedItemIds.includes(flower.id)
            && Math.abs(center - gardenFlowerX(index, contentWidth)) < (size + flowerSize) / 2);
          const floor = overlapsGarden ? Math.min(viewport.height * position.floor, viewport.height - GARDEN_BED_BOTTOM - flowerSize - 4) : viewport.height * position.floor;
          const top = floor - size * position.feet;
          const active = petting.session?.animalId === animal.id;
          const heartsTop = Math.max(38, top - 58);
          const profile = animalPettingProfiles[animal.id];
          const headX = center - size / 2 + size * profile.contact.x;
          const headY = top + size * profile.contact.y;
          const target = pettingCatTarget(animal.id, headX / catScale, headY / catScale, contentWidth / catScale);
          return <Fragment key={animal.id}><View testID={`exterior-animal-${animal.id}`} pointerEvents="box-none" style={[styles.yardAnimal, {
            left: center - size / 2, top: floor - size * position.feet, width: size, height: size,
          }]}>
            <TouchableOpacity testID={`pet-animal-${animal.id}`} accessibilityRole="button" accessibilityLabel={`Acariciar ${animal.name}`} accessibilityHint="El gatito se acerca para darle un mimo"
              disabled={watering} onPress={() => {
                petting.start(animal.id, target);
                scrollRef.current?.scrollTo({ animated: true, x: Math.max(0, Math.min(contentWidth - viewport.width, (headX + (target.x + 115) * catScale) / 2 - viewport.width / 2)) });
              }} style={[styles.animalTouch, { width: Math.max(44, size), height: Math.max(44, size), left: (size - Math.max(44, size)) / 2, top: (size - Math.max(44, size)) / 2 }]} />
            <View style={[styles.animalShadow, { bottom: size * (1 - position.feet) - size * .025, height: size * .07 }]} />
            {farmAnimalImages[animal.id] ? <BlinkingFarmAnimal animalId={animal.id}
              affection={active ? petting.session! : undefined}
              frames={farmAnimalBlinkImages[animal.id] ?? [farmAnimalImages[animal.id]]} style={styles.animalImage} />
              : <MaterialCommunityIcons color={animal.color} name={animal.icon as keyof typeof MaterialCommunityIcons.glyphMap} size={size * .8} />}
          </View>
          {active && petting.session?.phase === 'petting' && <AnimalAffectionHearts animalId={animal.id} startedAt={petting.session.startedAt} left={Math.max(4, Math.min(center - 56, contentWidth - 116))} top={heartsTop} />}
          {active && <View testID="animal-petting-status" pointerEvents="none" style={[styles.pettingStatus, { left: Math.max(4, Math.min(center - 82, contentWidth - 168)), top: petting.session?.phase === 'petting' ? heartsTop - 30 : Math.max(8, Math.min(top, (target.y + 55) * catScale) - 30) }]}><Text accessibilityLiveRegion="polite" style={styles.pettingText}>{petting.session?.phase === 'approaching' ? '¡Voy a darte un mimo!' : `♥ ${profile.label}`}</Text></View>}
          </Fragment>;
        })}
        <View style={[styles.house, { left: contentWidth / 2 - 146, top: viewport.height * .46 - 107, transform: [{ scale: catScale * 1.44 }] }]}><Image resizeMode="contain" source={houseImages.cuteHouse} style={styles.houseImage} /><TouchableOpacity accessibilityLabel="Entrar a la casa" accessibilityRole="button" onPress={() => { petting.cancel(); onEnterHouse(); }} style={styles.houseDoorHit} /></View>
        {!watering && catScale > 0 && <View pointerEvents="none" style={[styles.catWorld, { width: contentWidth / catScale, transform: [{ scale: catScale }] }]}>
          <WalkingPetCat key={`${contentWidth}:${catScale}`} petting={petting.session?.phase === 'petting' ? petting.session : undefined} equippedCatItems={equippedCatItems} equippedItemId={equippedItemId} initialX={Math.max(0, contentWidth / catScale / 2 - 115)} initialY={340} maxX={Math.max(0, contentWidth / catScale - WALKING_CAT_WIDTH)} maxY={365} minY={300} ref={walkingCatRef} size="room" style={styles.cat} />
        </View>}
        <GardenFlowers width={contentWidth} height={viewport.height} onWateringChange={changeWatering} />
      </ImageBackground>
    </ScrollView>
    {placedAnimals.length > 0 && !petting.session && <View pointerEvents="none" style={[styles.pettingHint, { left: Math.max(8, (viewport.width - 340) / 2), width: Math.max(0, Math.min(340, viewport.width - 16)) }]}><Text style={styles.pettingHintText}>Tocá un animal para darle un mimo ♥</Text></View>}
  </View>;
}
