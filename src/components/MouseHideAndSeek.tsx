import { useCallback, useId, useRef, useState } from 'react';
import { AppState, Image, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Svg, { ClipPath, Defs, Image as SvgImage, Polygon } from 'react-native-svg';
import { useGameAudio } from '../context/AudioContext';
import { catItemImages, toySceneImages } from '../data/assetImages';
import { MOUSE_ROUND_FINDS, mouseHidingSpots, shuffledMouseSpots } from '../data/mouseHideAndSeek';
import { mouseRoomGeometry, styles } from '../styles/components/mouseHideAndSeek.styles';
import { MouseRoomCurtain } from './MouseRoomCurtain';
import { useMouseCurtain } from './useMouseCurtain';

export function MouseHideAndSeek({ count, onFound, onRoundComplete }: { count: number; onFound: () => void; onRoundComplete: () => void }) {
  const clipId = `mouse-foreground-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const { playSound } = useGameAudio();
  const [order] = useState(() => shuffledMouseSpots());
  const [turn, setTurn] = useState(0);
  const [found, setFound] = useState(false);
  const [hint, setHint] = useState(false);
  const [message, setMessage] = useState('Tocá al ratoncito cuando lo veas.');
  const [arena, setArena] = useState({ width: 0, height: 0 });
  const focused = useRef(false);
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearTimers = useCallback(() => {
    if (hintTimer.current) clearTimeout(hintTimer.current);
  }, []);
  const move = useCallback(() => {
    setTurn(value => value + 1);
    setFound(false);
    setHint(false);
    setMessage('¡Se escondió en otro lugar! Buscalo de nuevo.');
  }, []);
  const curtain = useMouseCurtain(move, onRoundComplete);
  const transitioning = curtain.phase !== 'idle';
  const controlsLocked = transitioning || count >= MOUSE_ROUND_FINDS;
  useFocusEffect(useCallback(() => {
    focused.current = true;
    const subscription = AppState.addEventListener('change', state => {
      clearTimers();
      setHint(false);
      focused.current = state === 'active';
    });
    return () => { focused.current = false; clearTimers(); subscription.remove(); setHint(false); };
  }, [clearTimers]));
  const spot = mouseHidingSpots[order[turn % order.length]];
  const room = mouseRoomGeometry(arena.width, arena.height);
  const size = Math.max(44, room.height * .26);
  const findMouse = () => {
    if (count >= MOUSE_ROUND_FINDS) return;
    if (!curtain.start(count + 1 >= MOUSE_ROUND_FINDS)) return;
    if (hintTimer.current) clearTimeout(hintTimer.current);
    setHint(false);
    setFound(true);
    setMessage('¡Lo encontraste! Ahora va a esconderse…');
    onFound();
  };
  return <View style={styles.game}>
    <View testID="mouse-search-arena" style={styles.arena} onLayout={event => setArena(event.nativeEvent.layout)}>
      {room.width > 0 && <View testID={`mouse-room-${spot.id}`} style={[styles.room, room]}>
        <Image accessible={false} source={toySceneImages.mouseRoom} style={[styles.fill, room]} resizeMode="stretch" />
        <Pressable accessibilityLabel="Habitación con juguetes y libros" style={styles.fill} onPress={() => {
          if (!transitioning) setMessage('Mirá entre los objetos: buscá sus orejitas rosadas.');
        }} />
        <TouchableOpacity testID="hidden-mouse" accessibilityRole="button" accessibilityLabel="Encontrar al ratoncito"
          accessibilityHint="Buscalo entre los objetos. Podés pedir una pista."
          activeOpacity={1} disabled={controlsLocked} onPress={findMouse}
          style={[styles.target, { width: size, height: size, left: spot.x * room.width - size / 2, top: spot.y * room.height - size / 2 }]}>
          {hint && <View pointerEvents="none" style={styles.halo} />}
          {found && <View pointerEvents="none" style={styles.found} />}
          <Image accessible={false} source={catItemImages['mouse-toy']} style={styles.mouse} resizeMode="contain" />
        </TouchableOpacity>
        {!found && <Svg pointerEvents="none" style={styles.fill} width={room.width} height={room.height} viewBox="0 0 1000 1000" preserveAspectRatio="none">
          <Defs><ClipPath id={clipId}><Polygon points={spot.cover} /></ClipPath></Defs>
          <SvgImage href={toySceneImages.mouseRoom} width="1000" height="1000" preserveAspectRatio="none" clipPath={`url(#${clipId})`} />
        </Svg>}
        <MouseRoomCurtain progress={curtain.progress} phase={curtain.phase} width={room.width} height={room.height} />
      </View>}
    </View>
    <View style={styles.controls}>
      <Text accessibilityLabel={`${count} de ${MOUSE_ROUND_FINDS}`} style={styles.counter}>{count}/{MOUSE_ROUND_FINDS}</Text>
      <Text accessibilityLiveRegion="polite" style={styles.message}>{message}</Text>
      <TouchableOpacity accessibilityRole="button" accessibilityLabel="Dame una pista" disabled={controlsLocked} style={styles.hint} onPress={() => {
        if (!focused.current || controlsLocked) return;
        if (hintTimer.current) clearTimeout(hintTimer.current);
        playSound('tap');
        setHint(true);
        setMessage('¡Por acá! Buscá dentro del brillito.');
        hintTimer.current = setTimeout(() => setHint(false), 3000);
      }}><Text style={styles.hintText}>✦ Dame una pista</Text></TouchableOpacity>
    </View>
  </View>;
}
