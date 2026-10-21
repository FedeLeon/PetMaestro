import { usePresentation } from '../presentation/usePresentation';
import { useEffect, useRef, useState } from 'react';
import { AppState, Image, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { catItemImages, toySceneImages, uiImages } from '../data/assetImages';
import { BELL_CAT_X, BELL_OBSTACLES, BELL_OBSTACLE_KINDS, BELL_RUN_SECONDS, bellJumpLift, bellObstacleX, bellRunFrame, initialBellRun, startBellJump, stepBellRun } from '../data/bellRunner';
import { bellObstacleLayout, bellRunnerLayout, styles } from '../styles/components/bellRunner.styles';
import { useCareActivity } from './house/useCareActivity';
import { useGameAudio } from '../context/AudioContext';
import { useProgress } from '../context/ProgressContext';

export function BellRunnerGame({ onCoin, onComplete }: { onCoin: () => void; onComplete: (coins: number) => void }) {
  const presentation = usePresentation();
  const care = useCareActivity();
  const { rewardAction } = useProgress();
  const { playSound } = useGameAudio();
  const callbacks = useRef({ onCoin, onComplete, rewardAction, playSound });
  callbacks.current = { onCoin, onComplete, rewardAction, playSound };
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [phase, setPhase] = useState<'ready' | 'running' | 'paused' | 'finished'>('ready');
  const [state, setState] = useState(initialBellRun);
  const run = useRef(state);
  const phaseRef = useRef(phase); phaseRef.current = phase;
  const live = useRef(care.active); live.current = care.active;
  const completed = useRef(false);
  useEffect(() => {
    const app = AppState.addEventListener('change', next => {
      if (next !== 'active') { live.current = false; if (phaseRef.current === 'running') setPhase('paused'); }
    });
    return () => app.remove();
  }, []);
  useEffect(() => { if (!care.active && phaseRef.current === 'running') setPhase('paused'); }, [care.active]);
  useEffect(() => {
    if (phase !== 'running' || !care.active) return;
    let frame: number;
    let previous: number | undefined;
    const tick = (now: number) => {
      if (!live.current || !care.live.current) return;
      if (previous === undefined) previous = now;
      if (now - previous >= 1000 / 30 - 1) {
        const before = run.current;
        const next = stepBellRun(before, (now - previous) / 1000);
        previous = now; run.current = next; setState(next);
        if (next.coins > before.coins) { callbacks.current.onCoin(); void callbacks.current.rewardAction('jump'); }
        if (next.hits.length > before.hits.length) callbacks.current.playSound('retry');
        if (next.done && !completed.current) {
          completed.current = true; setPhase('finished'); callbacks.current.onComplete(next.coins); return;
        }
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase, care.active, care.live]);
  const layout = bellRunnerLayout(size.width, size.height);
  const lift = bellJumpLift(state);
  const jumping = state.jumpAt !== null;
  const progress = Math.min(1, state.time / BELL_RUN_SECONDS);
  const sprite = bellRunFrame(state.time);
  const backgroundWidth = Math.max(size.width, size.height * 3);
  const scroll = state.time * size.width * .065 % backgroundWidth;
  const catX = size.width * BELL_CAT_X;
  const catTop = layout.ground - layout.catSide * .94 - lift * layout.jumpHeight;
  const bellX = size.width * (.80 - .58 * progress ** 5);
  const stumble = state.time < state.stumbleUntil;
  const jump = () => {
    if (phaseRef.current !== 'running' || !live.current || !care.live.current) return;
    const next = startBellJump(run.current);
    if (next === run.current) return;
    run.current = next; setState(next); callbacks.current.playSound('tap');
  };
  return <View style={styles.game}>
    <View testID="bell-runner-arena" style={styles.arena} onLayout={event => setSize(event.nativeEvent.layout)}>
      {[0, 1].map(tile => <Image key={tile} accessible={false} source={toySceneImages.bellPark} resizeMode="stretch" style={[styles.background, { width: backgroundWidth, left: tile * backgroundWidth - scroll }]} />)}
      <View pointerEvents="none" style={styles.fill}>
        <View style={[styles.shadow, { left: catX - layout.catSide * .26, top: layout.ground - 3, width: layout.catSide * .6, opacity: 1 - lift * .5 }]} />
        {BELL_OBSTACLES.map((at, index) => {
          const x = bellObstacleX(at, state.time) * size.width;
          return x > -layout.obstacleSide && x < size.width + layout.obstacleSide ? <View key={index} style={styles.fill}>
            <Image testID={`bell-obstacle-${index}`} accessible={false} source={toySceneImages.bellObstacles[BELL_OBSTACLE_KINDS[index]]} resizeMode="contain"
              style={[styles.object, bellObstacleLayout(BELL_OBSTACLE_KINDS[index], layout.obstacleSide, layout.ground), { left: x - layout.obstacleSide / 2 }]} />
            {!state.collected.includes(index) && <Image testID={`bell-course-coin-${index}`} accessible={false} source={uiImages.goldenPawCoin} resizeMode="contain"
              style={[styles.object, { left: x - layout.coinSide / 2, top: layout.ground - layout.catSide * .47 - layout.jumpHeight * .78 - layout.coinSide / 2, width: layout.coinSide, height: layout.coinSide }]} />}
          </View> : null;
        })}
        <Image testID="bell-runner-goal" source={catItemImages['bell-ball']} resizeMode="contain" style={[styles.object, { left: bellX - layout.bellSide / 2, top: layout.ground - layout.bellSide - Math.abs(Math.sin(state.time * 6)) * 8, width: layout.bellSide, height: layout.bellSide, transform: [{ rotate: `${state.time * 110}deg` }] }]} />
        <View testID="bell-runner-cat" accessible accessibilityRole="image" accessibilityLabel={stumble ? 'Gatito triste después de chocar' : 'Gatito corriendo'} style={[styles.cat, { left: catX - layout.catSide / 2, top: catTop, width: layout.catSide, height: layout.catSide, transform: [{ rotate: stumble ? '-9deg' : jumping ? `${(lift - .5) * -8}deg` : `${Math.sin(state.time * 16) * 2}deg` }] }]}>
          <Image accessible={false} testID="bell-run-sprite" source={toySceneImages.bellCatRun} resizeMode="stretch" style={[styles.sprite, { left: `${-(sprite % 4) * 100}%`, top: `${-Math.floor(sprite / 4) * 100}%`, opacity: jumping || stumble ? 0 : 1 }]} />
          <Image accessible={false} testID="bell-sad-sprite" source={toySceneImages.bellCatSad} resizeMode="stretch" style={[styles.sprite, { left: `${-(sprite % 4) * 100}%`, top: `${-Math.floor(sprite / 4) * 100}%`, opacity: stumble ? 1 : 0 }]} />
          <Image accessible={false} source={toySceneImages.bellCat} resizeMode="stretch" style={[styles.jumpSprite, { left: '-200%', opacity: jumping && !stumble ? 1 : 0 }]} />
        </View>
      </View>
      <Pressable testID="bell-jump-area" accessibilityRole="button" accessibilityLabel="Saltar en el parque" accessibilityHint="Esperá que se acerque un obstáculo con su moneda y tocá para saltar." disabled={phase !== 'running'} onPress={jump} style={styles.fill} />
      <View pointerEvents="none" style={presentation.styles.bellHud}>
        <Text style={styles.instruction}>{stumble ? '¡Arriba! Saltá el próximo obstáculo' : 'Cuando se acerque la moneda, ¡tocá para saltar!'}</Text>
        <View style={styles.coinCount}><Image accessible={false} source={uiImages.goldenPawCoin} style={styles.coinArt} /><Text testID="bell-runner-coins" accessibilityLabel={`${state.coins} monedas atrapadas`} style={styles.count}>{state.coins}</Text></View>
      </View>
      <View pointerEvents="none" accessibilityRole="progressbar" accessibilityLabel="Camino hasta el cascabel" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.floor(progress * 100)} style={styles.journey}><View style={[styles.journeyFill, { width: `${progress * 100}%` }]} /></View>
      {(phase === 'ready' || phase === 'paused') && <View style={styles.overlay}>
        <Text style={styles.help}>{phase === 'ready' ? '¡Seguí al cascabel! Un toque, un salto' : 'La carrera está en pausa'}</Text>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel={phase === 'ready' ? 'Empezar carrera' : 'Continuar carrera'} activeOpacity={.8} onPress={() => { if (care.live.current) setPhase('running'); }} style={styles.start}><MaterialCommunityIcons name="play-circle" color="#26796e" size={34} /><Text style={styles.startText}>{phase === 'ready' ? '¡Vamos!' : 'Continuar'}</Text></TouchableOpacity>
      </View>}
    </View>
  </View>;
}
