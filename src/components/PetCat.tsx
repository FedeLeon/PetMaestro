import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { StyleProp, View, ViewStyle, AppState } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { petImages, uiImages } from '../data/assetImages';
import { shopItems } from '../data/gameContent';
import { styles } from '../styles/components/petCat.styles';
import { ProgressState } from '../types';
import { SpriteFrames } from './SpriteFrames';
import { CatRig } from './CatRig';
import { CAT_WALK_SPEED, walkFraction } from '../data/catMotion';
import { CatPetting, pettingStroke } from '../data/animalPetting';
import { useFarmAnimationClock } from './FarmAnimationClock';

type PetCatProps = {
  equippedItemId: string | null;
  equippedCatItems?: ProgressState['equippedCatItems'];
  size?: 'small' | 'large' | 'room' | 'bathroom';
  walking?: boolean;
  travelDistance?: number;
  petting?: CatPetting;
};

type SparkleBurstProps = {
  size?: number;
  style?: StyleProp<ViewStyle>;
};

type SuccessCelebrationProps = {
  height?: number;
  width?: number;
};

export type WalkingPetCatHandle = {
  walkTo: (targetX: number, targetY: number, options?: { minY?: number; facing?: 'left' | 'right'; maxDurationMs?: number; onArrive?: () => void }) => void;
  stop: () => void;
};

type WalkingPetCatProps = PetCatProps & {
  initialX: number;
  initialY: number;
  minY: number;
  maxX: number;
  maxY: number;
  onPositionChange?: (x: number, y: number) => void;
  style?: StyleProp<ViewStyle>;
};

export function PetCat({ equippedCatItems = {}, equippedItemId, size = 'large', walking = false, travelDistance, petting }: PetCatProps) {
  const farmClock = useFarmAnimationClock();
  const stroke = petting ? pettingStroke(petting.animalId, farmClock.time - petting.startedAt, farmClock.reducedMotion) : undefined;
  const focused = useIsFocused();
  const [appActive, setAppActive] = useState(AppState.currentState === 'active');
  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => setAppActive(state === 'active'));
    return () => subscription.remove();
  }, []);
  const [blinkFrame, setBlinkFrame] = useState(0);
  const [motion, setMotion] = useState({ amount: 0, distance: 0 });
  const motionRef = useRef(motion);
  const fallbackItem = shopItems.find((entry) => entry.id === equippedItemId);
  const getEquippedItem = (slot: keyof NonNullable<PetCatProps['equippedCatItems']>) =>
    shopItems.find((entry) => entry.id === equippedCatItems[slot]) ??
    (fallbackItem?.slot === slot ? fallbackItem : undefined);
  const hat = getEquippedItem('head');
  const glasses = getEquippedItem('eyes');
  const shirt = getEquippedItem('body');
  const bottom = getEquippedItem('bottom');
  const shoes = getEquippedItem('feet');
  const neck = getEquippedItem('neck');
  const toy = getEquippedItem('toy');
  const isRoomSize = size === 'room';
  const scale = size === 'bathroom' ? 1.5 : size === 'large' ? 1 : isRoomSize ? 0.75 : 0.72;

  useEffect(() => {
    if (!focused || !appActive) return;
    const frameDuration = blinkFrame === 0 ? 3600 : blinkFrame === 1 ? 120 : 180;
    const timeoutId = setTimeout(() => {
      setBlinkFrame((currentFrame) => (currentFrame + 1) % petImages.catBlink.length);
    }, frameDuration);

    return () => clearTimeout(timeoutId);
  }, [blinkFrame, focused, appActive]);

  useEffect(() => {
    if (!focused || !appActive) {
      motionRef.current = { ...motionRef.current, amount: 0 };
      setMotion(motionRef.current);
      return;
    }
    const target = walking ? 1 : 0;
    let previous = 0;
    let frame: number;
    const tick = (now: number) => {
      const dt = previous ? Math.min(40, now - previous) : 16;
      previous = now;
      const current = motionRef.current;
      const amount = target ? Math.min(1, current.amount + dt / 140) : Math.max(0, current.amount - dt / 140);
      const distance = current.distance + (walking && travelDistance === undefined ? CAT_WALK_SPEED * dt / 1000 : 0);
      motionRef.current = { amount, distance };
      setMotion(motionRef.current);
      if (amount !== target || walking && travelDistance === undefined) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [walking, focused, appActive, travelDistance === undefined]);

  return <View testID="pet-cat" style={[styles.wrap, { transform: [{ scale }] }]}>
    <View style={[styles.outfitCanvas, { transform: [{ scale: isRoomSize ? 210 / 260 : 1 }] }]}>
      <CatRig stroke={stroke} blink={blinkFrame} distance={travelDistance ?? motion.distance} amount={motion.amount} items={{ head: hat, eyes: glasses, body: shirt, bottom, feet: shoes, neck, toy }} />
    </View>
  </View>;
}

export function SparkleBurst({ size = 76, style }: SparkleBurstProps) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (frame >= uiImages.clickSparkles.length - 1) return;
    const intervalId = setTimeout(() => {
      setFrame((currentFrame) => Math.min(currentFrame + 1, uiImages.clickSparkles.length - 1));
    }, 105);

    return () => clearTimeout(intervalId);
  }, [frame]);

  return (
    <View pointerEvents="none" style={[styles.sparkleWindow, style, { height: size, width: size }]}>
      <SpriteFrames sources={uiImages.clickSparkles} active={frame} style={{ height: size, width: size }} />
    </View>
  );
}

export function SuccessCelebration({ height = 160, width = 240 }: SuccessCelebrationProps) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (frame >= uiImages.successCelebration.length - 1) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setFrame((currentFrame) => Math.min(currentFrame + 1, uiImages.successCelebration.length - 1));
    }, 135);

    return () => clearTimeout(timeoutId);
  }, [frame]);

  return (
    <View pointerEvents="none" style={[styles.successWindow, { height, width }]}>
      <SpriteFrames sources={uiImages.successCelebration} active={frame} style={styles.successImage} />
    </View>
  );
}

export const WalkingPetCat = forwardRef<WalkingPetCatHandle, WalkingPetCatProps>(function WalkingPetCat(
  { initialX, initialY, maxX, maxY, minY, style, onPositionChange, ...petCatProps },
  ref,
) {
  const focused = useIsFocused();
  const [appActive, setAppActive] = useState(AppState.currentState === 'active');
  const [positionX, setPositionX] = useState(initialX);
  const [positionY, setPositionY] = useState(initialY);
  const [travelDistance, setTravelDistance] = useState(0);
  const distanceRef = useRef(0);
  const positionCallback = useRef(onPositionChange);
  positionCallback.current = onPositionChange;
  const positionXRef = useRef(initialX);
  const positionYRef = useRef(initialY);
  const animationFrameRef = useRef<number | null>(null);
  const arrivalRef = useRef<(() => void) | undefined>(undefined);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [walking, setWalking] = useState(false);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => setAppActive(state === 'active'));
    return () => subscription.remove();
  }, []);
  useEffect(() => {
    if (!focused || !appActive) {
      if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
      arrivalRef.current = undefined;
      setWalking(false);
    }
  }, [focused, appActive]);

  useImperativeHandle(ref, () => ({
    stop: () => {
      if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null; arrivalRef.current = undefined; setWalking(false);
    },
    walkTo: (requestedX, requestedY, options) => {
      if (!focused || !appActive) return;
      const targetX = Number(requestedX);
      const targetY = Number(requestedY);
      const nextX = Math.min(Math.max(targetX - 115, 0), maxX);
      const nextY = Math.min(Math.max(targetY - 142, options?.minY ?? minY), maxY);
      const startX = positionXRef.current;
      const startY = positionYRef.current;

      if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
      arrivalRef.current = options?.onArrive;

      if (!Number.isFinite(targetX) || !Number.isFinite(targetY) || !Number.isFinite(nextX) || !Number.isFinite(nextY)) {
        setWalking(false);
        arrivalRef.current = undefined;
        return;
      }

      if (Math.hypot(nextX - startX, nextY - startY) < 4) {
        setWalking(false);
        if (options?.facing) setDirection(options.facing);
        const arrived = arrivalRef.current; arrivalRef.current = undefined; arrived?.();
        return;
      }

      if (Math.abs(nextX - startX) >= 4) setDirection(nextX < startX ? 'left' : 'right');
      setWalking(true);

      const duration = Math.max(320, Math.min(options?.maxDurationMs ?? Infinity, Math.hypot(nextX - startX, nextY - startY) / CAT_WALK_SPEED * 1000));
      let startedAt: number | undefined;
      const animatePosition = (now: number) => {
        startedAt ??= now;
        const progress = walkFraction(now - startedAt, duration);
        const nextPosition = startX + (nextX - startX) * progress;
        const nextVerticalPosition = startY + (nextY - startY) * progress;

        distanceRef.current += Math.hypot(nextPosition - positionXRef.current, nextVerticalPosition - positionYRef.current);
        setTravelDistance(distanceRef.current);
        positionXRef.current = nextPosition;
        positionYRef.current = nextVerticalPosition;
        setPositionX(nextPosition);
        setPositionY(nextVerticalPosition);
        positionCallback.current?.(nextPosition, nextVerticalPosition);

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animatePosition);
        } else {
          animationFrameRef.current = null;
          setWalking(false);
          if (options?.facing) setDirection(options.facing);
          const arrived = arrivalRef.current; arrivalRef.current = undefined; arrived?.();
        }
      };

      animationFrameRef.current = requestAnimationFrame(animatePosition);
    },
  }), [maxX, maxY, minY, focused, appActive]);

  useEffect(
    () => () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    },
    [],
  );

  return (
    <View
      pointerEvents="none"
      style={[
        styles.walkingCat,
        style,
        {
          left: positionX,
          top: positionY,
          transform: [{ scaleX: direction === 'left' ? -1 : 1 }],
        },
      ]}
    >
      <PetCat {...petCatProps} walking={walking} travelDistance={travelDistance} />
    </View>
  );
});
