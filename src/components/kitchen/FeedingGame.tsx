import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Image, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useProgress } from '../../context/ProgressContext';
import { kitchenFoods, kitchenImages, mealNutrition } from '../../data/kitchenContent';
import { styles } from '../../styles/house/kitchen.styles';
import { useBathroomTouch as useKitchenTouch } from '../house/useBathroomTouch';
import { KitchenDots, KitchenScene } from './KitchenScene';
import { MealIngredients } from './MealIngredients';
import { FeedingHearts } from './FeedingHearts';
import { useGameAudio } from '../../context/AudioContext';
import { uiImages } from '../../data/assetImages';
import { styles as sceneStyles } from '../../styles/house/careScene.styles';
import { useCareActivity } from '../house/useCareActivity';

export function FeedingGame({ ids, onClose }: { ids: string[]; onClose: () => void }) {
  const { feedMeal } = useProgress();
  const { playSound } = useGameAudio();
  const care = useCareActivity();
  const [bites, setBites] = useState(0);
  const totalBites = ids.length;
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
  useEffect(() => {
    if (care.active) return;
    if (timer.current) clearTimeout(timer.current);
    travel.stopAnimation(); busy.current = false; loaded.current = false;
    setChewing(false); setAutoFeeding(false); setCursor(null); setHeartBursts([]);
  }, [care.active, travel]);
  const eat = () => {
    playSound('eat');
    setHeartBursts(current => [...current, bites + 1]);
    setChewing(true); setCursor(null); loaded.current = false; setAutoFeeding(false);
    timer.current = setTimeout(() => {
      if (!mounted.current || !care.live.current) return;
      const next = bites + 1;
      setBites(next); setChewing(false); busy.current = false;
      if (next >= totalBites && !awarded.current) {
        awarded.current = true;
        void feedMeal(ids);
        setDone(true);
      }
    }, 750);
  };
  const automaticBite = () => {
    if (!care.live.current || busy.current || awarded.current || bites >= totalBites) return;
    busy.current = true; setAutoFeeding(true); travel.setValue(0);
    Animated.timing(travel, { toValue: 1, duration: 650, useNativeDriver: true }).start(({ finished }) => { if (finished && mounted.current && care.live.current) eat(); });
  };
  const { stageRef, panHandlers } = useKitchenTouch(care.active && !done && !chewing && !autoFeeding, (x, y) => {
    if (!care.live.current || busy.current || awarded.current) return;
    const nx = x / size.width, ny = y / size.height;
    if (!loaded.current && nx > .27 && nx < .64 && ny > .72 && ny < .99) loaded.current = true;
    if (!loaded.current) return;
    setCursor({ x, y });
    if (((nx - .445) / .09) ** 2 + ((ny - .455) / .1) ** 2 <= 1) { busy.current = true; eat(); }
  }, () => { loaded.current = false; setCursor(null); });
  const food = kitchenFoods.find(item => item.id === ids[bites]);
  const spoonLoaded = !!cursor || autoFeeding || chewing;
  const remainingFoods = ids.slice(bites + (spoonLoaded ? 1 : 0));
  return <KitchenScene source={chewing || done ? kitchenImages.catChew : kitchenImages.cat} onClose={onClose} value={totalBites ? bites / totalBites : 0} label={done ? `Comida +${mealNutrition(ids)} · ¡Pancita feliz!` : chewing ? '¡Ñam, ñam! Está masticando…' : 'Tocá el plato o la cuchara, o llevala a su boca'}>
    <View ref={stageRef} collapsable={false} testID="feeding-stage" style={styles.fill} onLayout={event => setSize(event.nativeEvent.layout)} {...panHandlers}>
      <View pointerEvents="none" style={styles.fill}>
        <Image source={kitchenImages.bowl} resizeMode="contain" style={styles.bowl} />
        <MealIngredients testID="feeding-bowl-ingredients" ids={remainingFoods} positionIds={ids} style={styles.bowlFood} />
        {!done && !chewing ? <Animated.View style={[styles.spoon, { left: cursor ? cursor.x - size.width * .055 : size.width * .40, top: cursor ? cursor.y - size.height * .06 : size.height * .75, transform: [{ translateY: autoFeeding ? travel.interpolate({ inputRange: [0, 1], outputRange: [0, -size.height * .355] }) : 0 }] }]}>
          <Image source={kitchenImages.spoon} style={styles.image} resizeMode="contain" />
          {(cursor || autoFeeding) && food ? <Image testID="feeding-spoon-food" accessibilityLabel={`Cucharada de ${food.name}`} source={food.image} style={styles.spoonFood} resizeMode="contain" /> : null}
        </Animated.View> : null}
        {heartBursts.map(id => <FeedingHearts key={id} id={id} width={size.width} height={size.height} onComplete={removeHearts} />)}
        {!done && !chewing && !autoFeeding && !cursor && <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={styles.fill}><Path d="M45 76 Q59 61 46 48 M43 53 L46 48 L51 51" stroke="#edb63a" strokeWidth={1.4} strokeDasharray="3 2" fill="none" /></Svg>}
      </View>
      {!done && <>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Dar cucharada desde el plato" disabled={!care.active || chewing || autoFeeding} onPressIn={() => { loaded.current = true; }} onPress={automaticBite} style={sceneStyles.feedingBowlHit} />
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Dar una cucharada" disabled={!care.active || chewing || autoFeeding} onPress={automaticBite} style={sceneStyles.feedingSpoonHit} />
      </>}
    </View>
    <View pointerEvents="none" style={sceneStyles.feedingCount}><KitchenDots count={bites} total={totalBites} label="Cucharadas" /></View>
    {done && <TouchableOpacity accessibilityRole="button" accessibilityLabel="Terminar comida" accessibilityHint="Volver a la cocina con la pancita feliz" activeOpacity={.8}
      onPress={() => { playSound('tap'); onClose(); }} style={styles.feedingFinish}>
      <Image accessible={false} source={uiImages.feedingFinish} resizeMode="contain" style={styles.image} />
      <View pointerEvents="none" style={styles.feedingFinishLabel}><Text numberOfLines={1} adjustsFontSizeToFit style={styles.feedingFinishText}>Terminar comida</Text></View>
    </TouchableOpacity>}
  </KitchenScene>;
}
