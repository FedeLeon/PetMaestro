import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '../styles/screens/mapScreen.styles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import { Animated, ImageBackground, Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { DimensionValue, useWindowDimensions } from 'react-native';
import { AppBottomMenu } from '../components/AppBottomMenu';
import { CoinBadge } from '../components/CoinBadge';
import { useProgress } from '../context/ProgressContext';
import { mapImages } from '../data/assetImages';
import { levels } from '../data/gameContent';
import { Level, RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Map'>;

const levelPointPositions: { top: number; left: DimensionValue }[] = [
  { top: 134, left: '50%' },
  { top: 252, left: '30%' },
  { top: 372, left: '71%' },
  { top: 492, left: '31%' },
  { top: 606, left: '58%' },
  { top: 724, left: '29%' },
  { top: 842, left: '69%' },
  { top: 962, left: '34%' },
  { top: 1082, left: '67%' },
  { top: 1200, left: '45%' },
];

export function MapScreen({ navigation }: Props) {
  const { progress } = useProgress();
  const { width: screenWidth } = useWindowDimensions();
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const modalScale = useRef(new Animated.Value(0.84)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!selectedLevel) {
      modalScale.setValue(0.84);
      modalOpacity.setValue(0);
      return;
    }

    Animated.parallel([
      Animated.spring(modalScale, {
        friction: 7,
        tension: 110,
        toValue: 1,
        useNativeDriver: false,
      }),
      Animated.timing(modalOpacity, {
        duration: 180,
        toValue: 1,
        useNativeDriver: false,
      }),
    ]).start();
  }, [modalOpacity, modalScale, selectedLevel]);

  const closeModal = () => setSelectedLevel(null);
  const selectedLevelLocked = selectedLevel ? selectedLevel.id > progress.unlockedLevel : false;

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <MaterialCommunityIcons color="#26796e" name="map" size={27} />
          <Text style={styles.title}>Mapa de Niveles</Text>
        </View>
        <CoinBadge coins={progress.coins} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.landscapeViewport}>
          <ImageBackground
            imageStyle={styles.landscapeImage}
            resizeMode="cover"
            source={mapImages.sunnyPathVertical}
            style={[styles.landscape, { left: -(screenWidth * 0.06), width: screenWidth * 1.12 }]}
          >

          {levels.map((level, index) => {
            const locked = level.id > progress.unlockedLevel;
            const completed = progress.completedLevels.includes(level.id);
            const pointPosition = levelPointPositions[index] ?? levelPointPositions[0];

            return (
              <TouchableOpacity
                accessibilityRole="button"
                key={level.id}
                onPress={() => setSelectedLevel(level)}
                style={[styles.levelPointWrap, pointPosition]}
              >
                <View style={[styles.levelPoint, completed && styles.completedPoint, locked && styles.lockedPoint]}>
                  <MaterialCommunityIcons
                    color={locked ? '#7f7569' : '#ffffff'}
                    name={(locked ? 'lock' : level.icon) as keyof typeof MaterialCommunityIcons.glyphMap}
                    size={30}
                  />
                  <Text style={[styles.levelNumber, locked && styles.lockedText]}>{level.id}</Text>
                </View>
                <Text style={styles.levelCaption} numberOfLines={1}>
                  {level.theme}
                </Text>
              </TouchableOpacity>
            );
          })}
          </ImageBackground>
        </View>
      </ScrollView>

      <AppBottomMenu />

      <Modal animationType="fade" onRequestClose={closeModal} transparent visible={selectedLevel !== null}>
        <Pressable style={styles.modalBackdrop} onPress={closeModal}>
          <Pressable>
            <Animated.View
              style={[
                styles.modalCard,
                {
                  opacity: modalOpacity,
                  transform: [{ scale: modalScale }],
                },
              ]}
            >
              {selectedLevel ? (
                <>
                  <View style={styles.modalIconWrap}>
                    <MaterialCommunityIcons
                      color="#ffffff"
                      name={
                        (selectedLevelLocked ? 'lock' : selectedLevel.icon) as keyof typeof MaterialCommunityIcons.glyphMap
                      }
                      size={42}
                    />
                  </View>
                  <Text style={styles.modalKicker}>Nivel {selectedLevel.id}</Text>
                  <Text style={styles.modalTitle}>{selectedLevel.title}</Text>
                  <Text style={styles.modalTheme}>{selectedLevel.theme}</Text>
                  <Text style={styles.modalDescription}>
                    {selectedLevelLocked ? 'Completa el nivel anterior para desbloquear este punto.' : selectedLevel.description}
                  </Text>
                  <View style={styles.rewardRow}>
                    <MaterialCommunityIcons color="#b77900" name="cash-multiple" size={24} />
                    <Text style={styles.rewardText}>Recompensa: {selectedLevel.reward} moneditas</Text>
                  </View>
                  <TouchableOpacity
                    disabled={selectedLevelLocked}
                    onPress={() => {
                      const levelId = selectedLevel.id;
                      closeModal();
                      navigation.navigate('Game', { levelId });
                    }}
                    style={[styles.playButton, selectedLevelLocked && styles.disabledPlayButton]}
                  >
                    <Text style={styles.playButtonText}>{selectedLevelLocked ? 'Bloqueado' : 'Jugar'}</Text>
                  </TouchableOpacity>
                </>
              ) : null}
            </Animated.View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
