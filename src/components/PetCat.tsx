import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { shopItems } from '../data/gameContent';
import { ProgressState } from '../types';

type PetCatProps = {
  equippedItemId: string | null;
  equippedCatItems?: ProgressState['equippedCatItems'];
  size?: 'small' | 'large';
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
  const scale = size === 'large' ? 1 : 0.72;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, { duration: 900, toValue: -8, useNativeDriver: false }),
        Animated.timing(bounce, { duration: 900, toValue: 0, useNativeDriver: false }),
      ]),
    );
    animation.start();

    return () => animation.stop();
  }, [bounce]);

  return (
    <Animated.View style={[styles.wrap, { transform: [{ translateY: bounce }, { scale }] }]}>
      {hat ? (
        <View style={[styles.hat, { backgroundColor: hat.color }]}>
          <Text style={styles.itemText}>{hat.label}</Text>
        </View>
      ) : null}
      <View style={styles.ears}>
        <View style={styles.ear} />
        <View style={styles.ear} />
      </View>
      <View style={styles.face}>
        <View style={styles.eyes}>
          <View style={styles.eye} />
          <View style={styles.eye} />
        </View>
        {glasses ? (
          <View style={[styles.glasses, { borderColor: glasses.color }]}>
            <View style={styles.glassesLens} />
            <View style={styles.glassesBridge} />
            <View style={styles.glassesLens} />
          </View>
        ) : null}
        <Text style={styles.mouth}>w</Text>
        {neck ? (
          <View style={[styles.neckItem, { backgroundColor: neck.color }]}>
            <Text style={styles.itemText}>{neck.label}</Text>
          </View>
        ) : null}
        {shirt ? (
          <View style={[styles.shirt, { backgroundColor: shirt.color }]}>
            <Text style={styles.itemText}>{shirt.label}</Text>
          </View>
        ) : null}
      </View>
      {shoes ? (
        <View style={styles.shoes}>
          <View style={[styles.shoe, { backgroundColor: shoes.color }]} />
          <View style={[styles.shoe, { backgroundColor: shoes.color }]} />
        </View>
      ) : null}
      {toy ? (
        <View style={[styles.toy, { backgroundColor: toy.color }]}>
          <Text style={styles.itemText}>{toy.label}</Text>
        </View>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  ear: {
    backgroundColor: '#f7c78a',
    borderColor: '#7b4c28',
    borderRadius: 8,
    borderWidth: 3,
    height: 54,
    transform: [{ rotate: '45deg' }],
    width: 54,
  },
  ears: {
    flexDirection: 'row',
    gap: 56,
    marginBottom: -26,
  },
  eye: {
    backgroundColor: '#4f3327',
    borderRadius: 10,
    height: 20,
    width: 20,
  },
  eyes: {
    flexDirection: 'row',
    gap: 48,
    marginTop: 44,
  },
  face: {
    alignItems: 'center',
    backgroundColor: '#ffd59e',
    borderColor: '#7b4c28',
    borderRadius: 74,
    borderWidth: 4,
    height: 148,
    width: 168,
  },
  glasses: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: -22,
    zIndex: 3,
  },
  glassesBridge: {
    backgroundColor: '#263238',
    height: 4,
    width: 14,
  },
  glassesLens: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderColor: '#263238',
    borderRadius: 15,
    borderWidth: 4,
    height: 30,
    width: 34,
  },
  hat: {
    alignItems: 'center',
    borderRadius: 8,
    justifyContent: 'center',
    marginBottom: -4,
    minHeight: 34,
    paddingHorizontal: 10,
    zIndex: 2,
  },
  itemText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '900',
  },
  mouth: {
    color: '#7b4c28',
    fontSize: 28,
    fontWeight: '900',
    marginTop: 4,
  },
  neckItem: {
    alignItems: 'center',
    borderRadius: 12,
    justifyContent: 'center',
    marginTop: 4,
    minHeight: 24,
    paddingHorizontal: 10,
  },
  shirt: {
    alignItems: 'center',
    borderRadius: 8,
    justifyContent: 'center',
    marginTop: 6,
    minHeight: 28,
    paddingHorizontal: 12,
    width: 100,
  },
  shoe: {
    borderRadius: 8,
    height: 18,
    width: 48,
  },
  shoes: {
    flexDirection: 'row',
    gap: 34,
    marginTop: -12,
  },
  toy: {
    alignItems: 'center',
    borderRadius: 24,
    height: 52,
    justifyContent: 'center',
    marginLeft: 148,
    marginTop: -44,
    width: 72,
  },
  wrap: {
    alignItems: 'center',
    minHeight: 210,
    width: 230,
  },
});
