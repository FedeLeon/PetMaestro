import { useEffect, useRef } from 'react';
import { Animated, Easing, Image, Text, TouchableOpacity, View } from 'react-native';
import { uiImages } from '../data/assetImages';
import { getWord } from '../data/gameContent';
import { FISH_MEMORY_FLIP_MS } from '../data/fishMemory';
import { styles } from '../styles/components/fishMemory.styles';
import { WordDrawing } from './WordDrawing';

export function FlippingMemoryCard({ id, index, side, visible, matched, disabled, active, reducedMotion, onPress, onSettled }: {
  id: string; index: number; side: number; visible: boolean; matched: boolean; disabled: boolean; active: boolean; reducedMotion: boolean;
  onPress: () => void; onSettled: (index: number, front: boolean) => void;
}) {
  const flip = useRef(new Animated.Value(0)).current;
  const callback = useRef(onSettled);
  callback.current = onSettled;
  useEffect(() => {
    if (!active) { flip.stopAnimation(); flip.setValue(visible ? 1 : 0); return; }
    const animation = Animated.timing(flip, { toValue: visible ? 1 : 0, duration: reducedMotion ? 0 : FISH_MEMORY_FLIP_MS, easing: Easing.inOut(Easing.cubic), useNativeDriver: true });
    animation.start(({ finished }) => { if (finished) callback.current(index, visible); });
    return () => animation.stop();
  }, [active, flip, index, reducedMotion, visible]);
  const word = getWord(id);
  return <TouchableOpacity testID={`fish-memory-card-${index + 1}`} accessibilityRole="button"
    accessibilityLabel={`Carta ${index + 1}${visible ? `: ${word.spanish}` : ''}`} aria-disabled={disabled}
    disabled={disabled} activeOpacity={1} onPress={onPress} style={[styles.card, { width: side, height: side }]}>
    <Animated.View pointerEvents="none" testID={`memory-flip-${index + 1}`} aria-hidden={visible} style={[styles.face, {
      opacity: flip.interpolate({ inputRange: [0, .499, .5, 1], outputRange: [1, 1, 0, 0] }),
      transform: [{ perspective: 850 }, { rotateY: flip.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] }) }],
    }]}><Image accessible={false} source={uiImages.fishMemoryBack} resizeMode="contain" style={styles.backArt} /></Animated.View>
    <Animated.View pointerEvents="none" testID={`memory-front-${index + 1}`} aria-hidden={!visible} style={[styles.face, styles.front, matched && styles.matched, {
      opacity: flip.interpolate({ inputRange: [0, .499, .5, 1], outputRange: [0, 0, 1, 1] }),
      transform: [{ perspective: 850 }, { rotateY: flip.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] }) }],
    }]}>
      <View style={styles.drawing}><WordDrawing word={word} bare /></View>
      <Text numberOfLines={1} style={[styles.word, { fontSize: Math.max(12, Math.min(17, side * .12)) }]}>{word.english}</Text>
      {matched && <Text style={styles.check}>✓</Text>}
    </Animated.View>
  </TouchableOpacity>;
}
