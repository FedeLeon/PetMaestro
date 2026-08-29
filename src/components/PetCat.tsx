import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { catItemImages, petImages, uiImages } from '../data/assetImages';
import { shopItems } from '../data/gameContent';
import { ProgressState } from '../types';

type PetCatProps = {
  equippedItemId: string | null;
  equippedCatItems?: ProgressState['equippedCatItems'];
  size?: 'small' | 'large' | 'room';
  walking?: boolean;
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
  walkTo: (targetX: number, targetY: number) => void;
};

type WalkingPetCatProps = PetCatProps & {
  initialX: number;
  initialY: number;
  minY: number;
  maxX: number;
  maxY: number;
  style?: StyleProp<ViewStyle>;
};

export function PetCat({ equippedCatItems = {}, equippedItemId, size = 'large', walking = false }: PetCatProps) {
  const [blinkFrame, setBlinkFrame] = useState(0);
  const [walkFrame, setWalkFrame] = useState(0);
  const fallbackItem = shopItems.find((entry) => entry.id === equippedItemId);
  const getEquippedItem = (slot: keyof NonNullable<PetCatProps['equippedCatItems']>) =>
    shopItems.find((entry) => entry.id === equippedCatItems[slot]) ??
    (fallbackItem?.slot === slot ? fallbackItem : undefined);
  const hat = getEquippedItem('head');
  const glasses = getEquippedItem('eyes');
  const shirt = getEquippedItem('body');
  const shoes = getEquippedItem('feet');
  const neck = getEquippedItem('neck');
  const toy = getEquippedItem('toy');
  const isRoomSize = size === 'room';
  const scale = size === 'large' ? 1 : isRoomSize ? 0.75 : 0.72;

  useEffect(() => {
    const frameDuration = blinkFrame === 0 ? 3600 : blinkFrame === 1 ? 120 : 180;
    const timeoutId = setTimeout(() => {
      setBlinkFrame((currentFrame) => (currentFrame + 1) % petImages.catBlink.length);
    }, frameDuration);

    return () => clearTimeout(timeoutId);
  }, [blinkFrame]);

  useEffect(() => {
    if (!walking) {
      setWalkFrame(0);
      return;
    }

    const intervalId = setInterval(() => {
      setWalkFrame((currentFrame) => (currentFrame + 1) % petImages.catWalk.length);
    }, 120);

    return () => clearInterval(intervalId);
  }, [walking]);

  return (
    <View style={[styles.wrap, { transform: [{ scale }] }]}>
      <Image
        resizeMode="contain"
        source={walking ? petImages.catWalk[walkFrame] : petImages.catBlink[blinkFrame]}
        style={[styles.catImage, isRoomSize && styles.roomCatImage]}
      />
      {hat ? (
        <Image resizeMode="contain" source={catItemImages[hat.id]} style={[styles.hat, isRoomSize && styles.roomHat]} />
      ) : null}
      {glasses ? (
        <Image resizeMode="contain" source={catItemImages[glasses.id]} style={[styles.glasses, isRoomSize && styles.roomGlasses]} />
      ) : null}
      {neck ? (
        <Image resizeMode="contain" source={catItemImages[neck.id]} style={[styles.neckItem, isRoomSize && styles.roomNeckItem]} />
      ) : null}
      {shirt ? (
        <Image resizeMode="stretch" source={catItemImages[shirt.id]} style={[styles.shirt, isRoomSize && styles.roomShirt]} />
      ) : null}
      {shoes ? (
        <View style={styles.shoes}>
          <Image resizeMode="contain" source={catItemImages[shoes.id]} style={[styles.shoe, isRoomSize && styles.roomShoe]} />
          <Image
            resizeMode="contain"
            source={catItemImages[shoes.id]}
            style={[styles.shoe, styles.secondShoe, isRoomSize && styles.roomShoe]}
          />
        </View>
      ) : null}
      {toy ? (
        <Image resizeMode="contain" source={catItemImages[toy.id]} style={[styles.toy, isRoomSize && styles.roomToy]} />
      ) : null}
    </View>
  );
}

export function SparkleBurst({ size = 76, style }: SparkleBurstProps) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setFrame((currentFrame) => Math.min(currentFrame + 1, uiImages.clickSparkles.length - 1));
    }, 105);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <View pointerEvents="none" style={[styles.sparkleWindow, style, { height: size, width: size }]}>
      <Image
        resizeMode="stretch"
        source={uiImages.clickSparkles[frame]}
        style={{ height: size, width: size }}
      />
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
      <Image resizeMode="contain" source={uiImages.successCelebration[frame]} style={styles.successImage} />
    </View>
  );
}

export const WalkingPetCat = forwardRef<WalkingPetCatHandle, WalkingPetCatProps>(function WalkingPetCat(
  { initialX, initialY, maxX, maxY, minY, style, ...petCatProps },
  ref,
) {
  const [positionX, setPositionX] = useState(initialX);
  const [positionY, setPositionY] = useState(initialY);
  const positionXRef = useRef(initialX);
  const positionYRef = useRef(initialY);
  const animationFrameRef = useRef<number | null>(null);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [walking, setWalking] = useState(false);

  useImperativeHandle(ref, () => ({
    walkTo: (requestedX, requestedY) => {
      const targetX = Number(requestedX);
      const targetY = Number(requestedY);
      const nextX = Math.min(Math.max(targetX - 115, 0), maxX);
      const nextY = Math.min(Math.max(targetY - 142, minY), maxY);
      const startX = positionXRef.current;
      const startY = positionYRef.current;

      if (!Number.isFinite(targetX) || !Number.isFinite(targetY) || !Number.isFinite(nextX) || !Number.isFinite(nextY)) {
        setWalking(false);
        return;
      }

      if (Math.hypot(nextX - startX, nextY - startY) < 4) {
        setWalking(false);
        return;
      }

      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      setDirection(nextX < startX ? 'left' : 'right');
      setWalking(true);

      const duration = Math.max(280, Math.hypot(nextX - startX, nextY - startY) * 3.2);
      const startedAt = Date.now();
      const animatePosition = () => {
        const progress = Math.min(1, (Date.now() - startedAt) / duration);
        const nextPosition = startX + (nextX - startX) * progress;
        const nextVerticalPosition = startY + (nextY - startY) * progress;

        positionXRef.current = nextPosition;
        positionYRef.current = nextVerticalPosition;
        setPositionX(nextPosition);
        setPositionY(nextVerticalPosition);

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animatePosition);
        } else {
          animationFrameRef.current = null;
          setWalking(false);
        }
      };

      animationFrameRef.current = requestAnimationFrame(animatePosition);
    },
  }), [maxX]);

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
      <PetCat {...petCatProps} walking={walking} />
    </View>
  );
});

const styles = StyleSheet.create({
  catImage: {
    height: 260,
    width: 174,
  },
  glasses: {
    height: 100,
    left: 64,
    position: 'absolute',
    top: 25,
    width: 100,
    zIndex: 4,
  },
  hat: {
    height: 100,
    left: 65,
    position: 'absolute',
    top: -28,
    width: 100,
    zIndex: 4,
  },
  neckItem: {
    height: 26,
    left: 84,
    position: 'absolute',
    top: 124,
    width: 64,
    zIndex: 4,
  },
  roomCatImage: {
    height: 210,
    width: 140,
  },
  roomGlasses: {
    height: 26,
    left: 96,
    top: 62,
    width: 36,
  },
  roomHat: {
    height: 44,
    left: 91,
    top: 18,
    width: 44,
  },
  roomNeckItem: {
    height: 22,
    left: 88,
    top: 104,
    width: 52,
  },
  roomShirt: {
    height: 34,
    left: 80,
    top: 122,
    width: 68,
  },
  roomShoe: {
    height: 28,
    width: 30,
  },
  roomToy: {
    height: 46,
    right: 36,
    top: 146,
    width: 46,
  },
  secondShoe: {
    transform: [{ scaleX: -1 }],
  },
  shirt: {
    height: 130,
    left: 66,
    position: 'absolute',
    top: 90,
    width: 100,
    zIndex: 4,
  },
  shoe: {
    height: 34,
    width: 36,
  },
  shoes: {
    flexDirection: 'row',
    gap: 38,
    left: 60,
    position: 'absolute',
    top: 234,
    zIndex: 5,
  },
  toy: {
    height: 58,
    position: 'absolute',
    right: 18,
    top: 178,
    width: 58,
    zIndex: 4,
  },
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 284,
    width: 230,
  },
  walkingCat: {
    height: 284,
    position: 'absolute',
    width: 230,
    zIndex: 5,
  },
  sparkleWindow: {
    overflow: 'hidden',
    position: 'absolute',
    zIndex: 20,
  },
  successImage: {
    height: '100%',
    width: '100%',
  },
  successWindow: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
