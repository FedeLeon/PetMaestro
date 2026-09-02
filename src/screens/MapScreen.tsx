import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import { Animated, Image, ImageBackground, Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { AppBottomMenu } from '../components/AppBottomMenu';
import { AppTopMenu } from '../components/AppTopMenu';
import { useProgress } from '../context/ProgressContext';
import { mapImages, uiImages } from '../data/assetImages';
import { levels } from '../data/gameContent';
import { styles } from '../styles/screens/mapScreen.styles';
import { Level, RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Map'>;
const levelPointPositions = [
  { x: 0.054, y: 0.435 }, { x: 0.153, y: 0.476 }, { x: 0.225, y: 0.568 }, { x: 0.3, y: 0.643 },
  { x: 0.387, y: 0.665 }, { x: 0.476, y: 0.625 }, { x: 0.563, y: 0.53 }, { x: 0.653, y: 0.53 },
  { x: 0.722, y: 0.615 }, { x: 0.8, y: 0.625 }, { x: 0.879, y: 0.542 }, { x: 0.945, y: 0.46 },
];

export function MapScreen({ navigation }: Props) {
  const { progress } = useProgress();
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [mapLayout, setMapLayout] = useState({ height: 0, width: 0 });
  const modalScale = useRef(new Animated.Value(0.84)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;
  const levelSize = Math.max(56, Math.min(86, mapLayout.width * 0.05));

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
    <AppTopMenu icon="map" title="Mapa de Niveles" />
    <ImageBackground imageStyle={styles.mapImage} onLayout={(event) => setMapLayout(event.nativeEvent.layout)} resizeMode="stretch" source={mapImages.sunnyPath} style={styles.mapScene}>
      {levels.map((level, index) => {
        const locked = level.id > progress.unlockedLevel;
        const completed = progress.completedLevels.includes(level.id);
        const pointPosition = levelPointPositions[index] ?? levelPointPositions[0];
        return <TouchableOpacity accessibilityLabel={`Nivel ${level.id}: ${level.title}`} accessibilityRole="button" key={level.id} onPress={() => setSelectedLevel(level)} style={[styles.levelPointWrap, { height: levelSize, left: mapLayout.width * pointPosition.x - levelSize / 2, top: mapLayout.height * pointPosition.y - levelSize / 2, width: levelSize }]}>
          <View style={[styles.levelPoint, { borderRadius: levelSize / 2, height: levelSize, width: levelSize }, completed && styles.completedPoint, locked && styles.lockedPoint]}>
            <MaterialCommunityIcons color={locked ? '#7f7569' : '#ffffff'} name={(locked ? 'lock' : level.icon) as keyof typeof MaterialCommunityIcons.glyphMap} size={Math.round(levelSize * 0.34)} />
            <Text style={[styles.levelNumber, { fontSize: Math.round(levelSize * 0.19) }, locked && styles.lockedText]}>{level.id}</Text>
          </View>
        </TouchableOpacity>;
      })}
      <TouchableOpacity accessibilityLabel={cityUnlocked ? 'Ir al mundo Ciudad Gatuna' : 'Completa la evaluacion final para abrir Ciudad Gatuna'} accessibilityRole="button" disabled={!cityUnlocked} onPress={() => navigation.navigate('CityMap')} style={[styles.nextWorldButton, { height: levelSize * 1.45, left: mapLayout.width * levelPointPositions[11].x - levelSize * 0.725, top: mapLayout.height * levelPointPositions[11].y - levelSize * 0.725, width: levelSize * 1.45 }, !cityUnlocked && styles.lockedNextWorldButton]}>
        <Image resizeMode="contain" source={uiImages.nextWorldArrow} style={styles.nextWorldImage} />
      </TouchableOpacity>
    </ImageBackground>
    <AppBottomMenu />
    <Modal animationType="fade" onRequestClose={closeModal} transparent visible={selectedLevel !== null}>
      <Pressable style={styles.modalBackdrop} onPress={closeModal}>
        <Pressable>
          <Animated.View style={[styles.modalCard, { opacity: modalOpacity, transform: [{ scale: modalScale }] }]}>
            {selectedLevel ? <>
              <View style={styles.modalIconWrap}><MaterialCommunityIcons color="#ffffff" name={(selectedLevelLocked ? 'lock' : selectedLevel.icon) as keyof typeof MaterialCommunityIcons.glyphMap} size={42} /></View>
              <Text style={styles.modalKicker}>Nivel {selectedLevel.id}</Text>
              <Text style={styles.modalTitle}>{selectedLevel.title}</Text>
              <Text style={styles.modalTheme}>{selectedLevel.theme}</Text>
              <Text style={styles.modalDescription}>{selectedLevelLocked ? 'Completa el nivel anterior para desbloquear este punto.' : selectedLevel.description}</Text>
              <View style={styles.rewardRow}><MaterialCommunityIcons color="#b77900" name="cash-multiple" size={24} /><Text style={styles.rewardText}>Recompensa: {selectedLevel.reward} moneditas</Text></View>
              <TouchableOpacity disabled={selectedLevelLocked} onPress={() => { const levelId = selectedLevel.id; closeModal(); navigation.navigate('Game', { levelId }); }} style={[styles.playButton, selectedLevelLocked && styles.disabledPlayButton]}><Text style={styles.playButtonText}>{selectedLevelLocked ? 'Bloqueado' : 'Jugar'}</Text></TouchableOpacity>
            </> : null}
          </Animated.View>
        </Pressable>
      </Pressable>
    </Modal>
  </View>;
}
