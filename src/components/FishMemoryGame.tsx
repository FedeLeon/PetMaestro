import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, AppState, Text, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useGameAudio } from '../context/AudioContext';
import { useProgress } from '../context/ProgressContext';
import { reviewWordIds } from '../data/adventureContent';
import { fishMemoryDeck, FISH_MEMORY_LOOK_MS, FISH_MEMORY_PAIRS } from '../data/fishMemory';
import { fishMemoryLayout, styles } from '../styles/components/fishMemory.styles';
import { FlippingMemoryCard } from './FlippingMemoryCard';

type Phase = 'ready' | 'flipping' | 'comparing' | 'hiding' | 'complete';
export function FishMemoryGame({ onComplete }: { onComplete: () => void }) {
  const { progress, recordAnswer } = useProgress();
  const { playSound, speak } = useGameAudio();
  const [cards] = useState(() => fishMemoryDeck(reviewWordIds(progress)));
  const [open, setOpen] = useState<number[]>([]);
  const openRef = useRef<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const matchedRef = useRef<string[]>([]);
  const [phase, setPhase] = useState<Phase>('ready');
  const phaseRef = useRef<Phase>('ready');
  const [message, setMessage] = useState('Encontrá las cuatro parejas. Tocá una carta para darla vuelta.');
  const [arena, setArena] = useState({ width: 0, height: 0 });
  const [active, setActive] = useState(AppState.currentState === 'active');
  const [reducedMotion, setReducedMotion] = useState(true);
  const focused = useIsFocused();
  const interactive = active && focused;
  const live = useRef(interactive);
  live.current = interactive;
  const pendingHide = useRef(new Set<number>());
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedAnswers = useRef<Promise<void>[]>([]);
  const complete = useRef(onComplete);
  complete.current = onComplete;
  const board = fishMemoryLayout(arena.width, arena.height);
  const changePhase = (value: Phase) => { phaseRef.current = value; setPhase(value); };
  useEffect(() => {
    let alive = true;
    let changed = false;
    const app = AppState.addEventListener('change', state => setActive(state === 'active'));
    const preference = AccessibilityInfo.addEventListener('reduceMotionChanged', value => { changed = true; setReducedMotion(value); });
    void AccessibilityInfo.isReduceMotionEnabled().then(value => { if (alive && !changed) setReducedMotion(value); }).catch(() => { if (alive && !changed) setReducedMotion(false); });
    return () => { alive = false; app.remove(); preference.remove(); };
  }, []);
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    pendingHide.current.clear();
    openRef.current = [];
    setOpen([]);
    changePhase(matchedRef.current.length === FISH_MEMORY_PAIRS ? 'complete' : 'ready');
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [interactive]);
  useEffect(() => {
    if (!interactive || matched.length !== FISH_MEMORY_PAIRS) return;
    let alive = true;
    const celebration = setTimeout(() => {
      void Promise.all(savedAnswers.current).then(() => { if (alive && live.current) complete.current(); });
    }, 450);
    return () => { alive = false; clearTimeout(celebration); };
  }, [interactive, matched.length]);
  const reveal = (index: number) => {
    if (!live.current || phaseRef.current !== 'ready' || openRef.current.includes(index) || matchedRef.current.includes(cards[index])) return;
    changePhase('flipping');
    openRef.current = [...openRef.current, index];
    setOpen(openRef.current);
    setMessage('Mirá el dibujo y buscá su pareja.');
    playSound('tap');
  };
  const settled = (index: number, front: boolean) => {
    if (!live.current) return;
    if (!front) {
      if (phaseRef.current !== 'hiding') return;
      pendingHide.current.delete(index);
      if (!pendingHide.current.size) { changePhase('ready'); setMessage('Recordá los dibujos y buscá su pareja.'); }
      return;
    }
    if (phaseRef.current !== 'flipping' || !openRef.current.includes(index)) return;
    if (openRef.current.length === 1) { changePhase('ready'); return; }
    const [first, second] = openRef.current;
    if (cards[first] === cards[second]) {
      const id = cards[first];
      matchedRef.current = [...matchedRef.current, id];
      setMatched(matchedRef.current);
      openRef.current = [];
      setOpen([]);
      savedAnswers.current.push(recordAnswer(id, true));
      speak(id);
      playSound('correct');
      setMessage('¡Encontraste una pareja!');
      changePhase(matchedRef.current.length === FISH_MEMORY_PAIRS ? 'complete' : 'ready');
    } else {
      changePhase('comparing');
      setMessage('Mirá bien los dibujos. ¡Podés volver a intentar!');
      timer.current = setTimeout(() => {
        if (!live.current) return;
        pendingHide.current = new Set(openRef.current);
        changePhase('hiding');
        openRef.current = [];
        setOpen([]);
      }, FISH_MEMORY_LOOK_MS);
    }
  };
  return <View testID={`fish-memory-${phase}`} style={styles.game}>
    <View testID="fish-memory-arena" style={styles.arena} onLayout={event => setArena(event.nativeEvent.layout)}>
      {board.side > 0 && <View testID="fish-memory-board" style={[styles.board, { width: board.width, height: board.height, gap: board.gap }]}>
        {cards.map((id, index) => <FlippingMemoryCard key={index} id={id} index={index} side={board.side}
          visible={open.includes(index) || matched.includes(id)} matched={matched.includes(id)} active={interactive} reducedMotion={reducedMotion}
          disabled={!interactive || phase !== 'ready' || open.includes(index) || matched.includes(id)} onPress={() => reveal(index)} onSettled={settled} />)}
      </View>}
    </View>
    <View style={styles.controls}><Text accessibilityLabel={`${matched.length} de ${FISH_MEMORY_PAIRS} parejas`} style={styles.counter}>{matched.length}/{FISH_MEMORY_PAIRS}</Text><Text accessibilityLiveRegion="polite" style={styles.message}>{message}</Text></View>
  </View>;
}
