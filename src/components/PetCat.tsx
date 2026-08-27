import { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';
import { catItemImages, petImages } from '../data/assetImages';
import { shopItems } from '../data/gameContent';
import { ProgressState } from '../types';

type PetCatProps = {
  equippedItemId: string | null;
  equippedCatItems?: ProgressState['equippedCatItems'];
  size?: 'small' | 'large' | 'room';
};

export function PetCat({ equippedCatItems = {}, equippedItemId, size = 'large' }: PetCatProps) {
  const bounce = useRef(new Animated.Value(0)).current;
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
  const scale = size === 'large' ? 1 : isRoomSize ? 0.52 : 0.72;

  useEffect(() => {
    if (isRoomSize) {
      bounce.setValue(0);
      return;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, { duration: 900, toValue: -8, useNativeDriver: false }),
        Animated.timing(bounce, { duration: 900, toValue: 0, useNativeDriver: false }),
      ]),
    );
    animation.start();

    return () => animation.stop();
  }, [bounce, isRoomSize]);

  return (
    <Animated.View style={[styles.wrap, { transform: [{ translateY: bounce }, { scale }] }]}>
      <Image resizeMode="contain" source={petImages.cat} style={[styles.catImage, isRoomSize && styles.roomCatImage]} />
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
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  catImage: {
    height: 260,
    width: 174,
  },
  glasses: {
    height: 32,
    left: 93,
    position: 'absolute',
    top: 72,
    width: 44,
    zIndex: 4,
  },
  hat: {
    height: 54,
    left: 88,
    position: 'absolute',
    top: 16,
    width: 54,
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
    height: 42,
    left: 72,
    position: 'absolute',
    top: 145,
    width: 86,
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
});
