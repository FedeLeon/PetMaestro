import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import { Animated, Image, ImageBackground, Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { AppBottomMenu } from '../components/AppBottomMenu';
import { AppTopMenu } from '../components/AppTopMenu';
import { useProgress } from '../context/ProgressContext';
import { mapImages, uiImages } from '../data/assetImages';
import { levels } from '../data/gameContent';
import { styles } from '../styles/screens/mapScreen.styles';
import { Level, RootStackParamList } from '../types';
import { useGameAudio } from '../context/AudioContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Map'>;
import { levelPointPositions, mapViewportLayout } from '../styles/screens/map.layout';

export function MapScreen({ navigation }: Props) {
  const { progress } = useProgress();
  const { playSound } = useGameAudio();
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [mapLayout, setMapLayout] = useState({ height: 0, width: 0 });
  const mapScroll = useRef<ScrollView>(null);
  const [scrollX, setScrollX] = useState(0);
  const modalScale = useRef(new Animated.Value(0.84)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;
  const { worldWidth, levelSize } = mapViewportLayout(mapLayout.width, mapLayout.height);
  const maxScroll = Math.max(0, worldWidth - mapLayout.width);
  const moveMap = (delta: number) => mapScroll.current?.scrollTo({ x: Math.max(0, Math.min(maxScroll, scrollX + delta)), animated: true });
  useEffect(() => {
    if (!mapLayout.width) return;
    const point = levelPointPositions[Math.min(levelPointPositions.length - 1, Math.max(0, progress.unlockedLevel - 1))];
    mapScroll.current?.scrollTo({ x: Math.max(0, Math.min(worldWidth - mapLayout.width, worldWidth * point.x - mapLayout.width * .4)), animated: false });
  }, [mapLayout.width, progress.unlockedLevel, worldWidth]);

  useEffect(() => {
    if (!selectedLevel) {
      modalScale.setValue(0.84);
      modalOpacity.setValue(0);
      return;
    }
    Animated.parallel([
      Animated.spring(modalScale, { friction: 7, tension: 110, toValue: 1, useNativeDriver: false }),
      Animated.timing(modalOpacity, { duration: 180, toValue: 1, useNativeDriver: false }),
    ]).start();
  }, [modalOpacity, modalScale, selectedLevel]);

  const closeModal = () => setSelectedLevel(null);
  const selectedLevelLocked = selectedLevel ? selectedLevel.id > progress.unlockedLevel : false;
  const cityUnlocked = progress.completedLevels.includes(11);
  return <View style={styles.screen}>
    <AppTopMenu scene icon="map" title="Mapa de Niveles" />
    <View testID="map-viewport" onLayout={event => setMapLayout(event.nativeEvent.layout)} style={styles.mapScene}>
    <ScrollView testID="map-scroll" horizontal ref={mapScroll} showsHorizontalScrollIndicator={false} scrollEventThrottle={16} onScroll={event => setScrollX(event.nativeEvent.contentOffset.x)}>
    <ImageBackground imageStyle={styles.mapImage} resizeMode="stretch" source={mapImages.sunnyPath} style={[styles.mapWorld, { width: worldWidth, height: mapLayout.height }]}>
      {levels.map((level, index) => {
        const locked = level.id > progress.unlockedLevel;
        const completed = progress.completedLevels.includes(level.id);
        const pointPosition = levelPointPositions[index] ?? levelPointPositions[0];
        return <TouchableOpacity accessibilityLabel={`Nivel ${level.id}: ${level.title}`} accessibilityRole="button" key={level.id} onPress={() => setSelectedLevel(level)} style={[styles.levelPointWrap, { height: levelSize, left: worldWidth * pointPosition.x - levelSize / 2, top: mapLayout.height * pointPosition.y - levelSize / 2, width: levelSize }]}>
          <View style={[styles.levelPoint, { borderRadius: levelSize / 2, height: levelSize, width: levelSize }, completed && styles.completedPoint, locked && styles.lockedPoint]}>
            <MaterialCommunityIcons color={locked ? '#7f7569' : '#ffffff'} name={(locked ? 'lock' : level.icon) as keyof typeof MaterialCommunityIcons.glyphMap} size={Math.round(levelSize * 0.34)} />
            <Text style={[styles.levelNumber, { fontSize: Math.round(levelSize * 0.19) }, locked && styles.lockedText]}>{level.id}</Text>
          </View>
        </TouchableOpacity>;
      })}
      <TouchableOpacity accessibilityLabel={cityUnlocked ? 'Entrar a Ciudad Gatuna' : 'Completá la evaluación final para entrar a Ciudad Gatuna'} accessibilityRole="button" disabled={!cityUnlocked} onPress={() => navigation.navigate('CityMap')} style={[styles.nextWorldButton, { height: levelSize * 1.45, left: worldWidth * levelPointPositions[11].x - levelSize * 0.725, top: mapLayout.height * levelPointPositions[11].y - levelSize * 0.725, width: levelSize * 1.45 }, !cityUnlocked && styles.lockedNextWorldButton]}>
        <Image resizeMode="contain" source={uiImages.nextWorldArrow} style={styles.nextWorldImage} />
      </TouchableOpacity>
    </ImageBackground>
    </ScrollView>
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="Ver niveles anteriores" disabled={scrollX < 2} onPress={() => moveMap(-mapLayout.width * .72)} style={[styles.mapArrow, styles.mapArrowLeft, scrollX < 2 && styles.mapArrowDisabled]}><Image accessible={false} source={uiImages.shopPageArrow} resizeMode="contain" style={[styles.mapArrowImage, styles.mapArrowReverse]} /></TouchableOpacity>
    <Text pointerEvents="none" style={styles.mapHint}>Deslizá para explorar el camino</Text>
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="Ver niveles siguientes" disabled={scrollX >= maxScroll - 2} onPress={() => moveMap(mapLayout.width * .72)} style={[styles.mapArrow, styles.mapArrowRight, scrollX >= maxScroll - 2 && styles.mapArrowDisabled]}><Image accessible={false} source={uiImages.shopPageArrow} resizeMode="contain" style={styles.mapArrowImage} /></TouchableOpacity>
    </View>
    <AppBottomMenu />
    <Modal animationType="fade" onRequestClose={closeModal} transparent visible={selectedLevel !== null} supportedOrientations={['landscape']}>
      <Pressable style={styles.modalBackdrop} onPress={closeModal}>
        <Pressable>
          <Animated.View style={[styles.modalCard, { opacity: modalOpacity, transform: [{ scale: modalScale }] }]}>
            <TouchableOpacity accessibilityRole="button" accessibilityLabel="Cerrar nivel" onPress={closeModal} style={styles.modalClose}><MaterialCommunityIcons name="close" color="#6c5a42" size={26} /></TouchableOpacity>
            {selectedLevel ? <>
              <View style={styles.modalIconWrap}><MaterialCommunityIcons color="#ffffff" name={(selectedLevelLocked ? 'lock' : selectedLevel.icon) as keyof typeof MaterialCommunityIcons.glyphMap} size={42} /></View>
              <Text style={styles.modalKicker}>Nivel {selectedLevel.id}</Text>
              <Text style={styles.modalTitle}>{selectedLevel.title}</Text>
              <Text style={styles.modalTheme}>{selectedLevel.theme}</Text>
              <Text style={styles.modalDescription}>{selectedLevelLocked ? 'Completa el nivel anterior para desbloquear este punto.' : selectedLevel.description}</Text>
              <View style={styles.rewardRow}><MaterialCommunityIcons color="#b77900" name="cash-multiple" size={24} /><Text style={styles.rewardText}>Recompensa: {selectedLevel.reward} moneditas</Text></View>
              <TouchableOpacity accessibilityRole="button" disabled={selectedLevelLocked} onPress={() => { playSound('tap'); const levelId = selectedLevel.id; closeModal(); navigation.navigate('Game', { levelId }); }} style={[styles.playButton, selectedLevelLocked && styles.disabledPlayButton]}><Text style={styles.playButtonText}>{selectedLevelLocked ? 'Bloqueado' : 'Jugar'}</Text></TouchableOpacity>
            </> : null}
          </Animated.View>
        </Pressable>
      </Pressable>
    </Modal>
  </View>;
}
