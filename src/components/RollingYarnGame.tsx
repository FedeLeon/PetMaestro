import { useEffect, useRef, useState } from 'react';
import { Animated, Image, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { catItemImages, toySceneImages, uiImages } from '../data/assetImages';
import { YARN_ROUND_TOUCHES, YARN_TOUCH_COOLDOWN_MS } from '../data/rollingYarn';
import { rollingYarnLayout } from '../styles/components/rollingYarn.layout';
import { styles } from '../styles/components/rollingYarn.styles';
import { useRollingYarnMotion } from './useRollingYarnMotion';
import { useYarnCatchFeedback, YARN_FEEDBACK_MS } from './useYarnCatchFeedback';
import { SparkleBurst } from './PetCat';

export function RollingYarnGame({ count, onCatch, onRoundComplete }: { count: number; onCatch: () => void; onRoundComplete: () => void }) {
  const [arena, setArena] = useState({ width: 0, height: 0 });
  const [message, setMessage] = useState('¡Tocá el ovillo mientras gira y rueda!');
  const lastTouch = useRef(0);
  const room = rollingYarnLayout(arena.width, arena.height);
  const motion = useRollingYarnMotion(room.width, room.height, room.size, count, count < YARN_ROUND_TOUCHES);
  const { bursts, showBurst } = useYarnCatchFeedback(motion.position, motion.active);
  const complete = useRef(onRoundComplete);
  complete.current = onRoundComplete;
  useEffect(() => {
    if (count < YARN_ROUND_TOUCHES || !motion.active) return;
    const timer = setTimeout(() => complete.current(), YARN_FEEDBACK_MS);
    return () => clearTimeout(timer);
  }, [count, motion.active]);
  return <View style={styles.game}>
    <View testID="yarn-arena" style={styles.arena} onLayout={event => setArena(event.nativeEvent.layout)}>
      {room.width > 0 && <View testID="yarn-room" style={[styles.room, { width: room.width, height: room.height }]}>
        <Image accessible={false} source={toySceneImages.yarnRoom} resizeMode="stretch" style={[styles.fill, { width: room.width, height: room.height }]} />
        <Pressable accessibilityLabel="Piso de la habitación" style={styles.fill} onPress={() => setMessage('¡Seguí al ovillo! Podés intentar otra vez, sin apuro.')} />
        <Animated.View testID="yarn-motion" style={[styles.target, { width: room.size, height: room.size, transform: motion.position.getTranslateTransform() }]}>
          <View pointerEvents="none" style={styles.shadow} />
          <TouchableOpacity accessibilityRole="button" accessibilityLabel="Atrapar ovillo" accessibilityHint="Tocá el ovillo que gira y se mueve por el piso."
            disabled={!motion.interactive} activeOpacity={1} style={styles.touch} onPress={() => {
              const now = Date.now();
              if (!motion.interactive || now - lastTouch.current < YARN_TOUCH_COOLDOWN_MS) return;
              lastTouch.current = now;
              showBurst();
              setMessage('¡Lo tocaste! Seguí jugando.');
              onCatch();
            }}>
            <Animated.Image accessible={false} testID="yarn-spin" source={catItemImages['yarn-ball']} resizeMode="contain" style={[styles.yarn, { transform: [{ rotate: motion.rotation.interpolate({ inputRange: [0, 360], outputRange: ['0deg', '360deg'] }) }] }]} />
          </TouchableOpacity>
        </Animated.View>
        {bursts.map(burst => <View key={burst.id} testID="yarn-hit-sparkles" pointerEvents="none"
          style={[styles.hit, { left: burst.x - room.size * .3, top: burst.y - room.size * .3, width: room.size * 1.6, height: room.size * 1.6 }]}>
          <SparkleBurst size={room.size * 1.6} />
        </View>)}
        <View testID="yarn-counter" pointerEvents="none" style={styles.counterFrame}>
          <Image accessible={false} source={uiImages.cookingStirPanel} resizeMode="stretch" style={styles.counterBackground} />
          <Image accessible={false} source={catItemImages['yarn-ball']} resizeMode="contain" style={styles.counterIcon} />
          <Text accessibilityLabel={`${count} de ${YARN_ROUND_TOUCHES}`} style={styles.counter}>{count}/{YARN_ROUND_TOUCHES}</Text>
        </View>
      </View>}
    </View>
    <View style={styles.controls}>
      <Text accessibilityLiveRegion="polite" style={styles.message}>{message}</Text>
    </View>
  </View>;
}
