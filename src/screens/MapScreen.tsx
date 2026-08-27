import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import { Animated, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DimensionValue } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { AppBottomMenu } from '../components/AppBottomMenu';
import { CoinBadge } from '../components/CoinBadge';
import { useProgress } from '../context/ProgressContext';
import { foliageImages } from '../data/assetImages';
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
        <View>
          <Text style={styles.kicker}>PetMaestro</Text>
          <Text style={styles.title}>Camino de palabras</Text>
        </View>
        <CoinBadge coins={progress.coins} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.landscape}>
          <View style={styles.sun} />
          <View style={[styles.cloud, styles.cloudOne]} />
          <View style={[styles.cloud, styles.cloudTwo]} />
          <View style={styles.mountains}>
            <View style={[styles.mountain, styles.mountainLeft]} />
            <View style={[styles.mountain, styles.mountainCenter]} />
            <View style={[styles.mountain, styles.mountainRight]} />
          </View>
          <View style={styles.ground} />
          <Svg height="1320" style={styles.roadSvg} viewBox="0 0 360 1320" width="100%">
            <Path
              d="M180 158 C146 198 96 218 108 284 C124 364 275 320 268 402 C260 488 84 456 106 552 C124 632 196 630 214 724 C236 820 78 788 104 890 C128 982 280 940 252 1046 C230 1130 104 1118 152 1210 C174 1252 196 1284 180 1330"
              fill="none"
              stroke="#cf9550"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={88}
            />
            <Path
              d="M180 158 C146 198 96 218 108 284 C124 364 275 320 268 402 C260 488 84 456 106 552 C124 632 196 630 214 724 C236 820 78 788 104 890 C128 982 280 940 252 1046 C230 1130 104 1118 152 1210 C174 1252 196 1284 180 1330"
              fill="none"
              stroke="#e8b56d"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={72}
            />
            <Path
              d="M180 158 C146 198 96 218 108 284 C124 364 275 320 268 402 C260 488 84 456 106 552 C124 632 196 630 214 724 C236 820 78 788 104 890 C128 982 280 940 252 1046 C230 1130 104 1118 152 1210 C174 1252 196 1284 180 1330"
              fill="none"
              stroke="#f2ca87"
              strokeDasharray="2 22"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={6}
            />
          </Svg>
          <View style={[styles.tree, styles.treeOne]}>
            <Image resizeMode="contain" source={foliageImages.tree1} style={styles.treeImage} />
          </View>
          <View style={[styles.tree, styles.treeTwo]}>
            <Image resizeMode="contain" source={foliageImages.tree2} style={styles.treeImage} />
          </View>
          <View style={[styles.tree, styles.treeThree]}>
            <Image resizeMode="contain" source={foliageImages.tree3} style={styles.treeImage} />
          </View>
          <View style={[styles.tree, styles.treeFour]}>
            <Image resizeMode="contain" source={foliageImages.tree1} style={styles.treeImage} />
          </View>
          <View style={[styles.tree, styles.treeFive]}>
            <Image resizeMode="contain" source={foliageImages.tree2} style={styles.treeImage} />
          </View>
          <Image resizeMode="contain" source={foliageImages.bush1} style={[styles.bushImage, styles.bushOne]} />
          <Image resizeMode="contain" source={foliageImages.bush2} style={[styles.bushImage, styles.bushTwo]} />
          <Image resizeMode="contain" source={foliageImages.bush1} style={[styles.bushImage, styles.bushThree]} />
          <Image resizeMode="contain" source={foliageImages.bush2} style={[styles.bushImage, styles.bushFour]} />
          <Image resizeMode="contain" source={foliageImages.bush1} style={[styles.bushImage, styles.bushFive]} />
          <View style={[styles.puddle, styles.puddleOne]} />
          <View style={[styles.puddle, styles.puddleTwo]} />
          <View style={[styles.puddle, styles.puddleThree]} />

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

const styles = StyleSheet.create({
  bushImage: {
    height: 46,
    position: 'absolute',
    width: 76,
    zIndex: 3,
  },
  bushOne: {
    left: 18,
    top: 420,
  },
  bushFive: {
    right: 18,
    top: 1168,
  },
  bushFour: {
    left: 24,
    top: 900,
  },
  bushThree: {
    right: 24,
    top: 610,
  },
  bushTwo: {
    right: 18,
    top: 278,
  },
  cloud: {
    backgroundColor: '#ffffff',
    borderRadius: 999,
    height: 34,
    opacity: 0.9,
    position: 'absolute',
    width: 92,
  },
  cloudOne: {
    left: 30,
    top: 74,
  },
  cloudTwo: {
    right: 28,
    top: 130,
  },
  completedPoint: {
    backgroundColor: '#57b8a9',
    borderColor: '#d7f5cf',
  },
  content: {
    padding: 16,
    paddingBottom: 112,
  },
  disabledPlayButton: {
    backgroundColor: '#c8bba8',
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomColor: '#f0dcc0',
    borderBottomWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 16,
    paddingHorizontal: 20,
    paddingTop: 54,
  },
  ground: {
    backgroundColor: '#78c85f',
    borderTopColor: '#5faf4f',
    borderTopWidth: 4,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 206,
  },
  kicker: {
    color: '#ff7a59',
    fontSize: 16,
    fontWeight: '900',
  },
  landscape: {
    backgroundColor: '#9edaf7',
    borderColor: '#77c1e4',
    borderRadius: 8,
    borderWidth: 2,
    minHeight: 1320,
    overflow: 'hidden',
    position: 'relative',
  },
  levelCaption: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    color: '#372413',
    fontSize: 14,
    fontWeight: '900',
    marginTop: 7,
    maxWidth: 118,
    paddingHorizontal: 8,
    paddingVertical: 5,
    textAlign: 'center',
  },
  levelNumber: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
    marginTop: 2,
  },
  levelPoint: {
    alignItems: 'center',
    backgroundColor: '#ff7a59',
    borderColor: '#fff3b0',
    borderRadius: 44,
    borderWidth: 5,
    height: 88,
    justifyContent: 'center',
    width: 88,
  },
  levelPointWrap: {
    alignItems: 'center',
    marginLeft: -44,
    position: 'absolute',
    zIndex: 5,
  },
  lockedPoint: {
    backgroundColor: '#d8cec0',
    borderColor: '#eee7dc',
  },
  lockedText: {
    color: '#7f7569',
  },
  modalBackdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(31, 40, 45, 0.48)',
    flex: 1,
    justifyContent: 'center',
    padding: 22,
  },
  modalCard: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#fff3b0',
    borderRadius: 8,
    borderWidth: 3,
    maxWidth: 420,
    padding: 22,
    width: '100%',
  },
  modalDescription: {
    color: '#5f5344',
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 24,
    marginTop: 12,
    textAlign: 'center',
  },
  modalIconWrap: {
    alignItems: 'center',
    backgroundColor: '#ff7a59',
    borderRadius: 40,
    height: 80,
    justifyContent: 'center',
    marginBottom: 12,
    width: 80,
  },
  modalKicker: {
    color: '#57b8a9',
    fontSize: 16,
    fontWeight: '900',
  },
  modalTheme: {
    color: '#76624a',
    fontSize: 16,
    fontWeight: '900',
    marginTop: 4,
  },
  modalTitle: {
    color: '#372413',
    fontSize: 28,
    fontWeight: '900',
    marginTop: 4,
    textAlign: 'center',
  },
  playButton: {
    alignItems: 'center',
    backgroundColor: '#ff7a59',
    borderRadius: 8,
    justifyContent: 'center',
    marginTop: 18,
    minHeight: 58,
    width: '100%',
  },
  playButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
  },
  rewardRow: {
    alignItems: 'center',
    backgroundColor: '#fff3b0',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  rewardText: {
    color: '#744d00',
    fontSize: 16,
    fontWeight: '900',
  },
  mountain: {
    borderBottomColor: '#6f9f7a',
    borderBottomWidth: 150,
    borderLeftColor: 'transparent',
    borderLeftWidth: 92,
    borderRightColor: 'transparent',
    borderRightWidth: 92,
    height: 0,
    position: 'absolute',
    top: 74,
    width: 0,
  },
  mountainCenter: {
    borderBottomColor: '#5e8e72',
    left: '24%',
    top: 52,
  },
  mountainLeft: {
    left: '-13%',
  },
  mountainRight: {
    right: '-12%',
  },
  mountains: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  puddle: {
    backgroundColor: '#69c7ef',
    borderColor: '#399ac2',
    borderRadius: 999,
    borderWidth: 2,
    height: 24,
    opacity: 0.9,
    position: 'absolute',
    transform: [{ rotate: '-7deg' }],
    width: 72,
  },
  puddleOne: {
    left: 28,
    top: 544,
  },
  puddleTwo: {
    right: 28,
    top: 374,
    transform: [{ rotate: '10deg' }],
  },
  puddleThree: {
    left: 34,
    top: 1052,
    transform: [{ rotate: '12deg' }],
  },
  roadSvg: {
    bottom: 0,
    left: 0,
    pointerEvents: 'none',
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 2,
  },
  screen: {
    backgroundColor: '#fff7e8',
    flex: 1,
  },
  sun: {
    backgroundColor: '#ffd966',
    borderColor: '#fff3b0',
    borderRadius: 44,
    borderWidth: 6,
    height: 88,
    position: 'absolute',
    right: 22,
    top: 24,
    width: 88,
  },
  title: {
    color: '#372413',
    fontSize: 28,
    fontWeight: '900',
  },
  tree: {
    alignItems: 'center',
    position: 'absolute',
    zIndex: 3,
  },
  treeOne: {
    left: 24,
    top: 252,
  },
  treeThree: {
    left: 32,
    top: 648,
  },
  treeFour: {
    right: 22,
    top: 778,
  },
  treeFive: {
    left: 26,
    top: 1120,
  },
  treeImage: {
    height: 92,
    width: 82,
  },
  treeTwo: {
    right: 26,
    top: 486,
  },
});
