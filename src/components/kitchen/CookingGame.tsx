import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, Text, View } from 'react-native';
import { kitchenFoods, kitchenImages } from '../../data/kitchenContent';
import { styles } from '../../styles/house/kitchen.styles';
import { useBathroomTouch as useKitchenTouch } from '../house/useBathroomTouch';
import { KitchenAssetButton } from './KitchenAssetButton';
import { DraggableIngredient } from './DraggableIngredient';
import { useIngredientDrag } from './useIngredientDrag';
import { KitchenProgress, KitchenScene } from './KitchenScene';
import { MealIngredients } from './MealIngredients';

type Step = 'add' | 'heat' | 'stir' | 'cool' | 'serve';
export function CookingGame({ ids, onClose, onServe }: { ids: string[]; onClose: () => void; onServe: () => void }) {
  const [step, setStep] = useState<Step>('add');
  const [addedIds, setAddedIds] = useState<string[]>([]);
  const added = addedIds.length;
  const drag = useIngredientDrag(id => setAddedIds(current => current.includes(id) ? current : [...current, id]));
  const [blowing, setBlowing] = useState(false);
  const blowBusy = useRef(false);
  const blow = useRef(new Animated.Value(0)).current;
  const [stir, setStir] = useState(0);
  const [cool, setCool] = useState(0);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const previous = useRef<{ x: number; y: number } | null>(null);
  const steam = useRef(new Animated.Value(0)).current;
  const active = step === 'stir' || step === 'cool';
  useEffect(() => {
    if (!active) return;
    const loop = Animated.loop(Animated.timing(steam, { toValue: 1, duration: 1500, easing: Easing.linear, useNativeDriver: true, isInteraction: false }));
    steam.setValue(0); loop.start(); return () => loop.stop();
  }, [active, steam]);
  useEffect(() => () => blow.stopAnimation(), [blow]);
  useEffect(() => { if (step === 'add' && added === ids.length) setStep('heat'); }, [step, added, ids.length]);
  const puff = () => {
    if (blowBusy.current || step !== 'cool') return;
    blowBusy.current = true; setBlowing(true); blow.setValue(0);
    Animated.timing(blow, { toValue: 1, duration: 1500, easing: Easing.linear, useNativeDriver: true }).start(({ finished }) => {
      if (!finished) return;
      blowBusy.current = false; setBlowing(false); setCool(value => value + 1);
      if (cool >= 2) setStep('serve');
    });
  };
  const { stageRef, panHandlers } = useKitchenTouch(step === 'stir', (x, y) => {
    const nx = x / size.width, ny = y / size.height;
    const inside = ((nx - .445) / .19) ** 2 + ((ny - .48) / .16) ** 2 <= 1;
    if (!inside) { previous.current = null; setCursor(null); return; }
    setCursor({ x, y });
    if (previous.current) {
      const distance = Math.hypot(nx - previous.current.x, ny - previous.current.y);
      if (distance > .003) setStir(value => Math.min(1, value + Math.min(distance, .065) / 3.4));
    }
    previous.current = { x: nx, y: ny };
  }, () => { previous.current = null; setCursor(null); });
  useEffect(() => { if (step === 'stir' && stir >= 1) { setStep('cool'); setCursor(null); } }, [step, stir]);
  const instructions = { add: 'Arrastrá los alimentos a la olla', heat: 'Encendé la cocina', stir: 'Mové la cuchara dentro de la olla', cool: '¡Ya se cocinó! Soplá 3 veces', serve: '¡Lista para comer!' };
  return <KitchenScene rootRef={drag.rootRef} overlay={drag.overlay} dragging={!!drag.dragId} source={kitchenImages.counter} onClose={onClose} controls={<>
    <Text style={styles.title}>A cocinar</Text>
    <Text style={styles.text} accessibilityLiveRegion="polite">{instructions[step]}</Text>
    <KitchenProgress value={step === 'add' ? added / ids.length * .2 : step === 'heat' ? .2 : step === 'stir' ? .2 + stir * .6 : .8 + cool / 3 * .2} />
    {step === 'add' ? <View style={styles.dragTray}>{ids.map(id => {
      const food = kitchenFoods.find(item => item.id === id)!;
      return <DraggableIngredient key={id} food={food} added={addedIds.includes(id)} dragging={drag.dragId === id} onStart={drag.start} onMove={drag.move} onDrop={drag.drop} onCancel={drag.cancel} />;
    })}</View> : null}
    {step === 'heat' ? <KitchenAssetButton source={kitchenImages.potFire} label="Encender cocina" onPress={() => setStep('stir')} /> : null}
    {step === 'stir' ? <Text style={styles.message}>Arrastrá de un lado a otro para revolver</Text> : null}
    {step === 'cool' ? <KitchenAssetButton source={kitchenImages.catBlowing} label={`Soplar (${cool}/3)`} caption={`${cool}/3`} disabled={blowing} onPress={puff} /> : null}
    {step === 'serve' ? <KitchenAssetButton source={kitchenImages.catEatingButton} label="Servir al gato" onPress={onServe} /> : null}
  </>}>
    <View ref={node => { stageRef.current = node; drag.stageRef.current = node; }} collapsable={false} testID="cooking-stage" style={styles.fill} onLayout={event => setSize(event.nativeEvent.layout)} {...panHandlers}>
      <View pointerEvents="none" style={styles.fill}>
        {step === 'stir' ? <Animated.View style={[styles.heat, { opacity: steam.interpolate({ inputRange: [0, .5, 1], outputRange: [.4, .85, .4] }) }]} /> : null}
        <Image source={kitchenImages.pot} resizeMode="contain" style={styles.vessel} />
        <MealIngredients ids={addedIds} style={styles.potFood} />
        {active ? [0, 1, 2].map(index => <Animated.Text key={index} style={[styles.steam, { left: `${33 + index * 8}%`, opacity: steam.interpolate({ inputRange: [0, .2, 1], outputRange: [0, .8 * (1 - cool / 3), 0] }), transform: [{ translateY: steam.interpolate({ inputRange: [0, 1], outputRange: [15, -35] }) }] }]}>∿</Animated.Text>) : null}
        {blowing ? <Animated.Image testID="cat-blowing" source={kitchenImages.catBlowing} resizeMode="contain" style={[styles.blowingCat, {
          opacity: blow.interpolate({ inputRange: [0, .15, .85, 1], outputRange: [0, 1, 1, 0] }),
          transform: [{ translateX: blow.interpolate({ inputRange: [0, .2, .8, 1], outputRange: [size.width * .16, 0, 0, size.width * .08] }) }, { scale: blow.interpolate({ inputRange: [0, .3, .5, .7, 1], outputRange: [.95, 1, 1.035, 1, .98] }) }],
        }]} /> : null}
        {step === 'stir' ? <Image source={kitchenImages.spoon} resizeMode="contain" style={[styles.spoon, { left: cursor ? cursor.x - size.width * .055 : size.width * .42, top: cursor ? cursor.y - size.height * .06 : size.height * .46 }]} /> : null}
      </View>
    </View>
  </KitchenScene>;
}
