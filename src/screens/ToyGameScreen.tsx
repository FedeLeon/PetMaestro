import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Image, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppTopMenu } from '../components/AppTopMenu';
import { WordDrawing } from '../components/WordDrawing';
import { MouseHideAndSeek } from '../components/MouseHideAndSeek';
import { RollingYarnGame } from '../components/RollingYarnGame';
import { FishMemoryGame } from '../components/FishMemoryGame';
import { BellRunnerGame } from '../components/BellRunnerGame';
import { FISH_MEMORY_PAIRS } from '../data/fishMemory';
import { MOUSE_ROUND_FINDS } from '../data/mouseHideAndSeek';
import { useProgress } from '../context/ProgressContext';
import { useGameAudio } from '../context/AudioContext';
import { catItemImages } from '../data/assetImages';
import { getWord, shopItems } from '../data/gameContent';
import { reviewWordIds, toyMode } from '../data/adventureContent';
import { styles } from '../styles/screens/adventure.styles';
import { RootStackParamList } from '../types';

const trail = [[.1, .25], [.7, .5], [.36, .1], [.8, .05], [.15, .6], [.5, .4]];
const sequence = [1, 3, 0, 2, 1, 0];
export function ToyGameScreen({ route, navigation }: NativeStackScreenProps<RootStackParamList, 'ToyGame'>) {
  const { progress, completeToy, recordAnswer } = useProgress();
  const { playSound, speak } = useGameAudio();
  const { toyId } = route.params;
  const toy = shopItems.find(item => item.id === toyId && item.category === 'cat-toys');
  const mode = toyMode(toyId);
  const fishMemory = toyId === 'fish-plush';
  const bellRunner = toyId === 'bell-ball';
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const [reward, setReward] = useState<number | null>(null);
  const finished = useRef(false);
  const [feedback, setFeedback] = useState('');
  const [arena, setArena] = useState({ width: 0, height: 0 });
  const target = useRef(new Animated.ValueXY()).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [cards] = useState(() => reviewWordIds(progress).slice(0, 3).flatMap(id => [id, id]).map(id => ({ id, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(entry => entry.id));
  const [open, setOpen] = useState<number[]>([]);
  const openRef = useRef<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const matchedRef = useRef<string[]>([]);
  useFocusEffect(useCallback(() => {
    openRef.current = [];
    setOpen([]);
    return () => { if (timer.current) clearTimeout(timer.current); target.stopAnimation(); };
  }, [target]));
  useEffect(() => {
    if (mode !== 'chase' || bellRunner) return;
    const point = trail[count % trail.length];
    Animated.spring(target, { toValue: { x: Math.max(0, arena.width - 76) * point[0], y: Math.max(0, arena.height - 76) * point[1] }, useNativeDriver: true, tension: 70, friction: 9 }).start();
  }, [mode, count, arena.width, arena.height, target, bellRunner]);
  const finish = async (score: number) => {
    if (finished.current) return;
    finished.current = true;
    setReward(await completeToy(toyId, score));
  };
  const advance = () => {
    if (finished.current) return;
    countRef.current += 1;
    setCount(countRef.current);
    playSound('correct');
    const goal = mode === 'hide-and-seek' ? MOUSE_ROUND_FINDS : 6;
    if (countRef.current >= goal && mode !== 'rolling-yarn') void finish(goal);
  };
  const mouseFound = () => {
    if (finished.current || countRef.current >= MOUSE_ROUND_FINDS) return;
    countRef.current += 1;
    setCount(countRef.current);
    playSound('correct');
  };
  const reveal = (index: number) => {
    if (finished.current || openRef.current.length >= 2 || openRef.current.includes(index) || matchedRef.current.includes(cards[index])) return;
    const next = [...openRef.current, index];
    openRef.current = next;
    setOpen(next);
    playSound('tap');
    if (next.length !== 2) return;
    if (cards[next[0]] === cards[next[1]]) {
      const id = cards[index];
      void recordAnswer(id, true);
      speak(id);
      matchedRef.current = [...matchedRef.current, id];
      setMatched(matchedRef.current);
      openRef.current = [];
      setOpen([]);
      setCount(matchedRef.current.length);
      if (matchedRef.current.length === 3) void finish(3);
    } else {
      setFeedback('Recordá los dibujos y buscá su pareja.');
      timer.current = setTimeout(() => { openRef.current = []; setOpen([]); setFeedback(''); }, 800);
    }
  };
  if (!toy || !progress.ownedItems.includes(toyId)) return <View style={styles.screen}><AppTopMenu compact icon="lock" title="Este juguete está en la tienda" /><View style={styles.result}><TouchableOpacity accessibilityRole="button" onPress={() => navigation.replace('ShopCategory', { categoryId: 'cat-toys' })} style={styles.button}><Text style={styles.buttonText}>Ver juguetes</Text></TouchableOpacity></View></View>;
  return <View style={styles.screen}>
    <AppTopMenu compact icon="tennis-ball" title={toy.name} />
    {reward !== null ? <View style={styles.result}>
      <Text style={styles.title}>{bellRunner ? '¡Alcanzaste el cascabel!' : '¡Qué bien jugaron juntos!'}</Text><Text style={styles.text}>Diversión recuperada · Ganaste {reward + (bellRunner ? count : 0)} monedas</Text>
      <TouchableOpacity accessibilityRole="button" style={styles.button} onPress={() => navigation.replace('ToyGame', { toyId })}><Text style={styles.buttonText}>Volver a jugar</Text></TouchableOpacity>
      <TouchableOpacity accessibilityRole="button" style={styles.shortcut} onPress={() => navigation.navigate('Toys')}><Text style={styles.buttonText}>Mis juguetes</Text></TouchableOpacity>
    </View> : <View style={styles.gameBody}>
      {!fishMemory && !bellRunner && mode !== 'hide-and-seek' && mode !== 'rolling-yarn' && <View style={styles.gameHeader}><Text style={styles.text}>{mode === 'memory' ? 'Encontrá los dibujos iguales' : mode === 'sequence' ? 'Tocá la luz amarilla' : '¡Atrapá el juguete!'}</Text><Text style={styles.badge}>{count}/{mode === 'memory' ? 3 : 6}</Text></View>}
      {bellRunner ? <BellRunnerGame onCoin={() => { countRef.current += 1; setCount(countRef.current); }} onComplete={coins => void finish(Math.max(1, coins))} /> : fishMemory ? <FishMemoryGame onComplete={() => void finish(FISH_MEMORY_PAIRS)} /> : mode === 'rolling-yarn' ? <RollingYarnGame count={count} onCatch={advance} onRoundComplete={() => void finish(6)} /> : mode === 'hide-and-seek' ? <MouseHideAndSeek count={count} onFound={mouseFound} onRoundComplete={() => void finish(MOUSE_ROUND_FINDS)} /> : mode === 'chase' ? (
        <View testID="toy-arena" style={styles.arena} onLayout={event => setArena(event.nativeEvent.layout)}>
          <Animated.View style={[styles.target, { transform: target.getTranslateTransform() }]}>
            <TouchableOpacity accessibilityRole="button" accessibilityLabel="Atrapar juguete" onPress={advance} style={styles.targetImage}>
              <Image source={catItemImages[toyId]} style={styles.targetImage} resizeMode="contain" />
            </TouchableOpacity>
          </Animated.View>
        </View>
      ) : mode === 'sequence' ? (
        <View style={styles.pads}>{[0, 1, 2, 3].map(index => (
          <TouchableOpacity key={index} accessibilityRole="button" accessibilityLabel={`Luz ${index + 1}`}
            accessibilityState={{ selected: sequence[count] === index }}
            onPress={() => {
              if (index === sequence[countRef.current]) { setFeedback('¡Muy bien!'); advance(); }
              else { setFeedback('Buscá la luz amarilla.'); playSound('retry'); }
            }} style={[styles.pad, sequence[count] === index && styles.padActive]}>
            {sequence[count] === index && <Image source={catItemImages[toyId]} resizeMode="contain" style={styles.padToy} />}
            <Text style={styles.padText}>{index + 1}</Text>
          </TouchableOpacity>
        ))}</View>
      ) : (
        <View style={styles.memoryBoard}>{cards.map((id, index) => {
          const visible = open.includes(index) || matched.includes(id);
          return <TouchableOpacity key={index} accessibilityRole="button"
            accessibilityLabel={`Carta ${index + 1}${visible ? `: ${getWord(id).spanish}` : ''}`}
            disabled={matched.includes(id)} onPress={() => reveal(index)}
            style={[styles.memoryCard, matched.includes(id) && styles.matched]}>
            {visible ? <><View style={styles.cityDrawing}><WordDrawing word={getWord(id)} bare /></View><Text style={styles.small}>{getWord(id).english}</Text></> : <Text style={styles.padText}>?</Text>}
          </TouchableOpacity>;
        })}</View>
      )}
      {!fishMemory && !bellRunner && mode !== 'hide-and-seek' && mode !== 'rolling-yarn' && <Text accessibilityLiveRegion="polite" style={styles.small}>{feedback || 'Sin apuro: podés volver a intentar.'}</Text>}
    </View>}
  </View>;
}
