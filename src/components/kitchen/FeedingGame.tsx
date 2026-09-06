import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Image, Text, View } from 'react-native';
import { useProgress } from '../../context/ProgressContext';
import { kitchenFoods, kitchenImages, mealNutrition } from '../../data/kitchenContent';
import { styles } from '../../styles/house/kitchen.styles';
import { useBathroomTouch as useKitchenTouch } from '../house/useBathroomTouch';
import { KitchenButton, KitchenProgress, KitchenScene } from './KitchenScene';
import { MealIngredients } from './MealIngredients';
import { FeedingHearts } from './FeedingHearts';

export function FeedingGame({ ids, onClose }: { ids: string[]; onClose: () => void }) {
  const { feedMeal } = useProgress();
  const [bites, setBites] = useState(0);
  const [chewing, setChewing] = useState(false);
  const [done, setDone] = useState(false);
  const [heartBursts, setHeartBursts] = useState<number[]>([]);
  const removeHearts = useCallback((id: number) => setHeartBursts(current => current.filter(burst => burst !== id)), []);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const loaded = useRef(false);
  const busy = useRef(false);
  const awarded = useRef(false);
  const mounted = useRef(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const travel = useRef(new Animated.Value(0)).current;
  const [autoFeeding, setAutoFeeding] = useState(false);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; if (timer.current) clearTimeout(timer.current); travel.stopAnimation(); }; }, [travel]);
  const eat = () => {
    setHeartBursts(current => [...current, bites + 1]);
    setChewing(true); setCursor(null); loaded.current = false; setAutoFeeding(false);
    timer.current = setTimeout(() => {
      if (!mounted.current) return;
      const next = bites + 1;
      setBites(next); setChewing(false); busy.current = false;
      if (next >= 3 && !awarded.current) {
        awarded.current = true;
        void feedMeal(ids);
        setDone(true);
      }
    }, 750);
  };
  const automaticBite = () => {
    if (busy.current || awarded.current) return;
    busy.current = true; setAutoFeeding(true); travel.setValue(0);
    Animated.timing(travel, { toValue: 1, duration: 650, useNativeDriver: true }).start(({ finished }) => { if (finished && mounted.current) eat(); });
  };
  const { stageRef, panHandlers } = useKitchenTouch(!done && !chewing && !autoFeeding, (x, y) => {
    if (busy.current || awarded.current) return;
    const nx = x / size.width, ny = y / size.height;
    if (!loaded.current && nx > .27 && nx < .64 && ny > .72 && ny < .99) loaded.current = true;
    if (!loaded.current) return;
    setCursor({ x, y });
    if (((nx - .445) / .09) ** 2 + ((ny - .455) / .1) ** 2 <= 1) { busy.current = true; eat(); }
  }, () => { loaded.current = false; setCursor(null); });
  const food = kitchenFoods.find(item => item.id === ids[bites % ids.length]);
  return <KitchenScene source={chewing || done ? kitchenImages.catChew : kitchenImages.cat} onClose={onClose} controls={<>
    <Text style={styles.title}>{done ? '¡Qué rico!' : 'A comer'}</Text>
    <Text accessibilityLiveRegion="polite" style={styles.text}>{done ? `Comida +${mealNutrition(ids)} · ¡Pancita feliz!` : 'Llevá la cuchara del plato a su boca'}</Text>
    <KitchenProgress value={bites / 3} />
    {done ? <KitchenButton play label="Terminar comida" onPress={onClose} /> : <KitchenButton label="Dar una cucharada" disabled={chewing || autoFeeding} onPress={automaticBite} />}
  </>}>
    <View ref={stageRef} collapsable={false} testID="feeding-stage" style={styles.fill} onLayout={event => setSize(event.nativeEvent.layout)} {...panHandlers}>
      <View pointerEvents="none" style={styles.fill}>
        <Image source={kitchenImages.bowl} resizeMode="contain" style={styles.bowl} />
        {bites < 3 ? <MealIngredients ids={ids} style={styles.bowlFood} amount={1 - bites * .22} /> : null}
        {!done && !chewing ? <Animated.View style={[styles.spoon, { left: cursor ? cursor.x - size.width * .055 : size.width * .40, top: cursor ? cursor.y - size.height * .06 : size.height * .75, transform: [{ translateY: autoFeeding ? travel.interpolate({ inputRange: [0, 1], outputRange: [0, -size.height * .355] }) : 0 }] }]}>
          <Image source={kitchenImages.spoon} style={styles.image} resizeMode="contain" />
          {cursor || autoFeeding ? <Image source={food?.image} style={styles.spoonFood} resizeMode="contain" /> : null}
        </Animated.View> : null}
        {heartBursts.map(id => <FeedingHearts key={id} id={id} width={size.width} height={size.height} onComplete={removeHearts} />)}
      </View>
    </View>
  </KitchenScene>;
}
