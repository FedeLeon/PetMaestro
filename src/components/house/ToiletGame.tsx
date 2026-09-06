import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Image, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { houseImages } from '../../data/assetImages';
import { useProgress } from '../../context/ProgressContext';
import { styles } from '../../styles/house/bathroomActivity.styles';
import { styles as toiletStyles } from '../../styles/house/toiletGame.styles';
import { ActivityProgress, BathroomActivityScene } from './BathroomActivityScene';
import { BathroomParticles } from './BathroomParticles';
import { BathroomWater } from './BathroomWater';
import { ToiletFlushAnimation } from './ToiletFlushAnimation';
import { useBathroomTouch } from './useBathroomTouch';

type Phase = 'ready' | 'using' | 'flush' | 'flushing' | 'wash' | 'washing' | 'done';
type Point = { x: number; y: number };
const DURATION = { using: 4000, flushing: 2400 };
// Centers of the pink pads in the paw sprites, measured in the scene rectangle.
const PAWS = [{ x: .31, y: .595 }, { x: .48, y: .595 }];

export function ToiletGame({ onClose }: { onClose: () => void }) {
  const { improveBathroom } = useProgress();
  const [phase, setPhase] = useState<Phase>('ready');
  const [elapsed, setElapsed] = useState(0);
  const [layout, setLayout] = useState({ width: 0, height: 0 });
  const [cursor, setCursor] = useState<Point | null>(null);
  const [remaining, setRemaining] = useState([6, 6]);
  const remainingRef = useRef(remaining);
  const lastPoint = useRef<Point | null>(null);
  const awarded = useRef(false);
  const curtain = useRef(new Animated.Value(0)).current;
  const pawsAppear = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (phase !== 'using' && phase !== 'flushing') return;
    setElapsed(0);
    const start = Date.now();
    const timer = setInterval(() => {
      const fraction = Math.min(1, (Date.now() - start) / DURATION[phase]);
      setElapsed(fraction);
      if (fraction === 1) {
        clearInterval(timer);
        setPhase(phase === 'using' ? 'flush' : 'wash');
      }
    }, 80);
    return () => clearInterval(timer);
  }, [phase]);
  useEffect(() => {
    const animation = Animated.timing(curtain, { toValue: phase === 'ready' || phase === 'done' ? 0 : 1, duration: 550, useNativeDriver: true });
    animation.start();
    return () => animation.stop();
  }, [curtain, phase]);
  const showPaws = phase === 'wash' || phase === 'washing';
  useEffect(() => {
    const animation = Animated.timing(pawsAppear, { toValue: showPaws ? 1 : 0, duration: 450, useNativeDriver: true });
    animation.start();
    return () => animation.stop();
  }, [pawsAppear, showPaws]);

  const washAt = useCallback((x: number, y: number) => {
    if (phase !== 'washing' || awarded.current || !layout.width || !layout.height) return;
    setCursor({ x, y });
    const previous = lastPoint.current;
    if (!previous) { lastPoint.current = { x, y }; return; }
    if (Math.hypot(x - previous.x, y - previous.y) < Math.max(3, layout.width * .008)) return;
    lastPoint.current = { x, y };
    const next = remainingRef.current.map((value, index) => {
      const paw = PAWS[index];
      const dx = (x - layout.width * paw.x) / Math.max(18, layout.width * .047);
      const dy = (y - layout.height * paw.y) / Math.max(18, layout.height * .065);
      return dx * dx + dy * dy <= 1 ? Math.max(0, value - 1) : value;
    });
    remainingRef.current = next;
    setRemaining(next);
    if (next.every((value) => value === 0)) {
      awarded.current = true;
      setCursor(null);
      setPhase('done');
      void improveBathroom(70, 10);
    }
  }, [improveBathroom, layout, phase]);
  const touch = useBathroomTouch(phase === 'washing', washAt, () => { lastPoint.current = null; setCursor(null); });
  const washed = remaining.filter((value) => value === 0).length;
  const washProgress = 1 - (remaining[0] + remaining[1]) / 12;
  const label = { ready: 'Ayudá al gato a ir al baño', using: 'Un momento de privacidad…', flush: '¡Ahora tirá de la cadena!', flushing: 'Vaciando el inodoro…', wash: 'Lavá las patitas', washing: 'Enjuagá las patitas', done: '¡Muy bien! Todo limpio' }[phase];
  const progress = phase === 'ready' ? 0 : phase === 'using' ? elapsed / 3 : phase === 'flush' ? 1 / 3 : phase === 'flushing' ? (1 + elapsed) / 3 : phase === 'wash' ? 2 / 3 : phase === 'washing' ? (2 + washProgress) / 3 : 1;
  const action = phase === 'ready' ? { label: 'Usar inodoro', next: 'using', icon: 'toilet' } as const : phase === 'flush' ? { label: 'Tirar de la cadena', next: 'flushing', icon: 'water-sync' } as const : null;
  const toolSize = Math.max(118, Math.min(180, layout.height * .32));
  const flush = () => { if (phase === 'flush') { setElapsed(0); setPhase('flushing'); } };

  return <BathroomActivityScene source={houseImages.toiletCat} onClose={onClose} controls={<>
    <ActivityProgress value={progress} label={label} />
    {action ? <TouchableOpacity accessibilityRole="button" accessibilityLabel={action.label} onPress={() => { setElapsed(0); setPhase(action.next); }} style={styles.action}><MaterialCommunityIcons name={action.icon} color="#237d75" size={28} /><Text style={styles.actionText}>{action.label}</Text></TouchableOpacity> : null}
    {showPaws ? <>
      <TouchableOpacity accessibilityRole="button" accessibilityLabel="Lavar patitas" accessibilityState={{ selected: phase === 'washing' }} onPress={() => setPhase('washing')} style={styles.action}>
        <Image source={houseImages.bathHandShower} resizeMode="contain" style={styles.toolImage} /><View style={toiletStyles.actionCopy}><Text style={styles.actionText}>{phase === 'washing' ? 'Ducha lista' : 'Lavar patitas'}</Text><Text accessibilityLiveRegion="polite" style={toiletStyles.showerLabel}>{washed} de 2 patitas limpias</Text></View>
      </TouchableOpacity>
    </> : null}
    {phase === 'done' ? <><Text style={styles.success}>Baño +70 · Higiene +10</Text><TouchableOpacity accessibilityRole="button" onPress={onClose} style={styles.action}><Text style={styles.actionText}>¡Listo!</Text></TouchableOpacity></> : null}
  </>}>
    <View ref={touch.stageRef} testID="toilet-stage" onLayout={(event) => setLayout(event.nativeEvent.layout)} style={styles.fill} {...touch.panHandlers}>
      <View pointerEvents="none" style={styles.fill}>
        <Animated.View testID="privacy-curtain" style={[styles.privacy, { opacity: curtain, transform: [{ scaleX: curtain.interpolate({ inputRange: [0, 1], outputRange: [.05, 1] }) }] }]}>{Array.from({ length: 6 }, (_, index) => <View key={index} style={styles.curtainFold} />)}</Animated.View>
        {showPaws ? <>
          {PAWS.map((paw, index) => <Animated.View key={index} testID={`washing-paw-${index}`} style={[toiletStyles.paw, { left: `${(paw.x - .08) * 100}%`, opacity: pawsAppear, transform: [{ translateY: pawsAppear.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }] }]}>
            <Image source={houseImages.toiletWashingPaw} resizeMode="contain" style={toiletStyles.asset} />
            {remaining[index] > 0 ? <>
              <Image source={houseImages.toothPlaque} resizeMode="contain" style={[toiletStyles.pawDirt, { opacity: remaining[index] / 6 }]} />
              <Image source={houseImages.bathFoam} resizeMode="contain" style={[toiletStyles.pawFoam, { opacity: remaining[index] / 6 }]} />
            </> : <Text style={toiletStyles.pawClean}>✓</Text>}
          </Animated.View>)}
          <View style={toiletStyles.curtainRail} />
        </> : null}
        {cursor && phase === 'washing' ? <View testID="paw-shower-cursor" style={[styles.cursor, { left: cursor.x - toolSize * .3, top: cursor.y - toolSize * .28, width: toolSize, height: toolSize }]}>
          <Image source={houseImages.bathHandShower} resizeMode="contain" style={styles.cursorImage} />
          <View style={styles.handShowerWater}><BathroomWater handheld /></View>
        </View> : null}
        {phase === 'done' ? <BathroomParticles kind="sparkles" /> : null}
      </View>
      {phase === 'flush' || phase === 'flushing' ? <ToiletFlushAnimation flushing={phase === 'flushing'} onFlush={flush} /> : null}
    </View>
  </BathroomActivityScene>;
}
