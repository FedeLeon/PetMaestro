import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useProgress } from '../../context/ProgressContext';
import { flowerWait, gardenFlowers, gardenImages, thirstyGardenImages } from '../../data/gardenContent';
import { houseImages } from '../../data/assetImages';
import { styles } from '../../styles/house/garden.styles';
import { PetCat } from '../PetCat';
import { SpriteFrames } from '../SpriteFrames';

export function GardenFlowers({ width, height, onWateringChange }: { width: number; height: number; onWateringChange: (watering: boolean) => void }) {
  const { progress, waterFlower } = useProgress();
  const [now, setNow] = useState(Date.now());
  const [active, setActive] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const busy = useRef(false);
  const sequence = useRef<Animated.CompositeAnimation | null>(null);
  const session = useRef(0);
  const water = useRef(new Animated.Value(0)).current;
  const hasFlowers = gardenFlowers.some(flower => progress.ownedItems.includes(flower.id));
  useEffect(() => {
    if (!hasFlowers) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [hasFlowers]);
  useFocusEffect(useCallback(() => () => {
    session.current += 1;
    sequence.current?.stop();
    busy.current = false;
    setActive(null);
    onWateringChange(false);
  }, [onWateringChange]));
  const start = (id: string) => {
    if (busy.current || flowerWait(progress.flowerWateredAt[id], Date.now()) > 0) return;
    busy.current = true;
    const current = ++session.current;
    setMessage(''); setActive(id); onWateringChange(true); water.setValue(0);
    const animation = Animated.timing(water, { toValue: 1, duration: 3000, useNativeDriver: true });
    sequence.current = animation;
    animation.start(async ({ finished }) => {
      if (!finished || current !== session.current) return;
      try {
        const ok = await waterFlower(id);
        if (current === session.current) setMessage(ok ? '¡Flores regadas!' : 'Estas flores ya tienen agua.');
      } catch {
        if (current === session.current) setMessage('No se pudo guardar el riego. Intentá otra vez.');
      } finally {
        if (current === session.current) { busy.current = false; setActive(null); onWateringChange(false); setNow(Date.now()); }
      }
    });
  };
  if (!hasFlowers) return null;
  const flowerSize = Math.max(80, Math.min(142, height * .36));
  const catScale = height / 600;
  const xFor = (index: number) => width * (.14 + index * .24);
  const activeX = xFor(gardenFlowers.findIndex(flower => flower.id === active));
  return <View testID="garden-flowers" pointerEvents="box-none" style={[styles.bed, { height: flowerSize }]}>
    {gardenFlowers.map((flower, index) => {
      if (!progress.ownedItems.includes(flower.id)) return null;
      const wait = flowerWait(progress.flowerWateredAt[flower.id], now);
      const seconds = Math.ceil(wait / 1000);
      const countdown = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
      return <TouchableOpacity key={flower.id} testID={flower.id} accessibilityRole="button" accessibilityLabel={`Regar ${flower.name}`} accessibilityHint={wait ? `Disponible en ${countdown}` : 'El gatito regará estas flores'} accessibilityState={{ disabled: !!active || wait > 0 }} disabled={!!active || wait > 0} onPress={() => start(flower.id)} style={[styles.flower, { left: xFor(index) - flowerSize / 2, width: flowerSize, height: flowerSize }]}>
        <SpriteFrames sources={[thirstyGardenImages[flower.id], gardenImages[flower.id]]} active={wait > 0 ? 1 : 0} style={styles.image} />
        <View style={[styles.badge, wait > 0 && styles.hydrated]}><MaterialCommunityIcons name={wait ? 'check' : 'watering-can'} size={16} color="#287c77" /><Text style={styles.text}>{active === flower.id ? 'Regando…' : wait ? countdown : 'Regar'}</Text></View>
      </TouchableOpacity>;
    })}
    {active && <View testID="garden-watering" pointerEvents="none" style={styles.overlay}>
      <View testID="garden-watering-cat" style={[styles.wateringCat, { left: activeX + 60 * catScale - 115, top: flowerSize - 30 - 142 - 79 * catScale, transform: [{ scale: catScale }] }]}>
        <PetCat equippedCatItems={progress.equippedCatItems} equippedItemId={progress.equippedItemId} size="room" />
        <Animated.Image source={gardenImages.wateringCan} resizeMode="contain" style={[styles.can, { left: 34, top: 138, transform: [{ rotate: water.interpolate({ inputRange: [0, .15, .85, 1], outputRange: ['0deg', '-30deg', '-30deg', '0deg'] }) }] }]} />
        {[0, 1, 2, 3, 4, 5].map(index => <Animated.Image key={index} source={houseImages.bathWaterDrop} resizeMode="contain" style={[styles.drop, { left: 24 + index % 3 * 8, top: 165, opacity: water.interpolate({ inputRange: [0, .12, .85, 1], outputRange: [0, 1, 1, 0] }), transform: [{ translateY: Animated.modulo(Animated.add(Animated.multiply(water, 6), index / 6), 1).interpolate({ inputRange: [0, 1], outputRange: [0, 36] }) }] }]} />)}
      </View>
    </View>}
    {message ? <Text accessibilityLiveRegion="polite" style={styles.message}>{message}</Text> : null}
  </View>;
}
