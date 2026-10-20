import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Image, Text, View } from 'react-native';
import { houseImages } from '../../data/assetImages';
import { useProgress } from '../../context/ProgressContext';
import { styles } from '../../styles/house/bathroomActivity.styles';
import { styles as toiletStyles } from '../../styles/house/toiletGame.styles';
import { BathroomActivityScene } from './BathroomActivityScene';
import { SceneFinish, SceneTool } from './CareActivityScene';
import { styles as sceneStyles } from '../../styles/house/careScene.styles';
import { useCareActivity } from './useCareActivity';
import { BathroomParticles } from './BathroomParticles';
import { BathroomWater } from './BathroomWater';
import { ToiletFlushAnimation } from './ToiletFlushAnimation';
import { useBathroomTouch } from './useBathroomTouch';
import { useActivitySound } from './useActivitySound';
import { ToiletPreparation } from './ToiletPreparation';

type Phase = 'lid' | 'position' | 'seating' | 'using' | 'flush' | 'flushing' | 'wash' | 'washing' | 'done';
type Point = { x: number; y: number };
const DURATION = { using: 4000, flushing: 2400 };
// Centers of the pink pads in the paw sprites, measured in the scene rectangle.
const PAWS = [{ x: .31, y: .595 }, { x: .48, y: .595 }];

export function ToiletGame({ onClose }: { onClose: () => void }) {
  const { improveBathroom } = useProgress();
  const care = useCareActivity();
  const [phase, setPhase] = useState<Phase>('lid');
  useActivitySound(phase === 'flushing' || phase === 'washing', 'water');
  const [elapsed, setElapsed] = useState(0);
  const elapsedRef = useRef(0);
  const [layout, setLayout] = useState({ width: 0, height: 0 });
  const [cursor, setCursor] = useState<Point | null>(null);
  const [remaining, setRemaining] = useState([6, 6]);
  const remainingRef = useRef(remaining);
  const lastPoint = useRef<Point | null>(null);
  const awarded = useRef(false);
  const curtain = useRef(new Animated.Value(0)).current;
  const pawsAppear = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!care.active || phase !== 'using' && phase !== 'flushing') return;
    const start = Date.now() - elapsedRef.current * DURATION[phase];
    const timer = setInterval(() => {
      if (!care.live.current) return;
      const fraction = Math.min(1, (Date.now() - start) / DURATION[phase]);
      elapsedRef.current = fraction;
      setElapsed(fraction);
      if (fraction === 1) {
        clearInterval(timer);
        elapsedRef.current = 0;
        setPhase(phase === 'using' ? 'flush' : 'washing');
      }
    }, 80);
    return () => clearInterval(timer);
  }, [care.active, care.live, phase]);
  useEffect(() => {
    const animation = Animated.timing(curtain, { toValue: ['lid', 'position', 'seating', 'done'].includes(phase) ? 0 : 1, duration: 550, useNativeDriver: true });
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
    if (!care.live.current || phase !== 'washing' || awarded.current || !layout.width || !layout.height) return;
    setCursor({ x, y });
    const previous = lastPoint.current;
    if (previous && Math.hypot(x - previous.x, y - previous.y) < Math.max(3, layout.width * .008)) return;
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
  }, [care.live, improveBathroom, layout, phase]);
  const touch = useBathroomTouch(care.active && phase === 'washing', washAt, () => { lastPoint.current = null; setCursor(null); });
  const washed = remaining.filter((value) => value === 0).length;
  const washProgress = 1 - (remaining[0] + remaining[1]) / 12;
  const label = { lid: 'Primero levantá la tapa del inodoro', position: 'Arrastrá al gatito hasta el asiento', seating: '¡Muy bien! El gatito se está sentando…', using: 'Un momento de privacidad…', flush: '¡Ahora tocá el tirador de la cadena!', flushing: 'Vaciando el inodoro…', wash: 'Lavá las patitas', washing: `Tocá o frotá las dos patitas · ${washed}/2 limpias`, done: '¡Muy bien! Todo limpio' }[phase];
  const progress = phase === 'lid' ? 0 : phase === 'position' || phase === 'seating' ? .08 : phase === 'using' ? .08 + elapsed * (1 / 3 - .08) : phase === 'flush' ? 1 / 3 : phase === 'flushing' ? (1 + elapsed) / 3 : phase === 'wash' ? 2 / 3 : phase === 'washing' ? (2 + washProgress) / 3 : 1;
  const toolSize = Math.max(118, Math.min(180, layout.height * .32));
  const flush = () => { if (care.live.current && phase === 'flush') { elapsedRef.current = 0; setElapsed(0); setPhase('flushing'); } };

  return <BathroomActivityScene source={houseImages.toiletRoom} onClose={onClose} value={progress} label={label}>
    <View ref={touch.stageRef} testID="toilet-stage" onLayout={(event) => setLayout(event.nativeEvent.layout)} style={styles.fill} {...touch.panHandlers}>
      <ToiletPreparation step={phase === 'lid' || phase === 'position' || phase === 'seating' ? phase : 'seated'} active={care.active} width={layout.width} height={layout.height}
        onOpen={() => { if (care.live.current && phase === 'lid') setPhase('position'); }}
        onSitStart={() => { if (care.live.current && phase === 'position') setPhase('seating'); }}
        onSeated={() => { if (care.live.current) { elapsedRef.current = 0; setElapsed(0); setPhase('using'); } }}
        onInterrupted={() => setPhase('position')} />
      <View pointerEvents="none" style={styles.fill}>
        <Animated.View testID="privacy-curtain" style={[styles.privacy, toiletStyles.privacy, { opacity: curtain, transform: [{ scaleX: curtain.interpolate({ inputRange: [0, 1], outputRange: [.05, 1] }) }] }]}>{Array.from({ length: 6 }, (_, index) => <View key={index} style={styles.curtainFold} />)}</Animated.View>
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
    {showPaws && <SceneTool label="Lavar patitas" caption="Agua lista" source={houseImages.bathHandShower} style={sceneStyles.pawShower} selected onPress={() => setPhase('washing')} />}
    {phase === 'done' && <SceneFinish onPress={onClose} />}
  </BathroomActivityScene>;
}
