import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, TouchableOpacity, View } from 'react-native';
import { kitchenFoods, kitchenImages } from '../../data/kitchenContent';
import { styles } from '../../styles/house/kitchen.styles';
import { useBathroomTouch as useKitchenTouch } from '../house/useBathroomTouch';
import { DraggableIngredient } from './DraggableIngredient';
import { useIngredientDrag } from './useIngredientDrag';
import { KitchenScene } from './KitchenScene';
import { MealIngredients } from './MealIngredients';
import { useGameAudio } from '../../context/AudioContext';
import { SceneTool } from '../house/CareActivityScene';
import { styles as sceneStyles } from '../../styles/house/careScene.styles';
import { useCareActivity } from '../house/useCareActivity';
import { cookingIngredientSize } from '../../styles/house/cooking.layout';
import { CookingStirProgress } from './CookingStirProgress';
import { useProgress } from '../../context/ProgressContext';

type Step = 'add' | 'heat' | 'stir' | 'cool' | 'serve';
export function CookingGame({ ids, onClose, onServe }: { ids: string[]; onClose: () => void; onServe: () => void }) {
  const care = useCareActivity();
  const { rewardAction } = useProgress();
  const served = useRef(false);
  const serve = () => {
    if (!care.live.current || served.current || step !== 'serve') return;
    served.current = true;
    void rewardAction('cook');
    onServe();
  };
  const [step, setStep] = useState<Step>('add');
  const [addedIds, setAddedIds] = useState<string[]>([]);
  const addedRef = useRef(new Set<string>());
  const { playSound } = useGameAudio();
  const addIngredient = (id: string) => {
    if (!care.live.current || !ids.includes(id) || addedRef.current.has(id)) return;
    addedRef.current.add(id); setAddedIds([...addedRef.current]); playSound('correct');
  };
  const added = addedIds.length;
  const drag = useIngredientDrag(addIngredient);
  const [blowing, setBlowing] = useState(false);
  const blowBusy = useRef(false);
  const blow = useRef(new Animated.Value(0)).current;
  const [stir, setStir] = useState(0);
  const [stirring, setStirring] = useState(false);
  const stirBusy = useRef(false);
  const spoonMotion = useRef(new Animated.Value(0)).current;
  const [cool, setCool] = useState(0);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const previous = useRef<{ x: number; y: number } | null>(null);
  const steam = useRef(new Animated.Value(0)).current;
  const active = step === 'stir' || step === 'cool';
  useEffect(() => {
    if (!active || !care.active) return;
    const loop = Animated.loop(Animated.timing(steam, { toValue: 1, duration: 1500, easing: Easing.linear, useNativeDriver: true, isInteraction: false }));
    steam.setValue(0); loop.start(); return () => loop.stop();
  }, [active, care.active, steam]);
  useEffect(() => {
    if (care.active) return;
    blow.stopAnimation(); spoonMotion.stopAnimation(); drag.cancel();
    blowBusy.current = false; stirBusy.current = false; setBlowing(false); setStirring(false); setCursor(null);
  }, [care.active, blow, spoonMotion]);
  useEffect(() => () => { blow.stopAnimation(); spoonMotion.stopAnimation(); }, [blow, spoonMotion]);
  useEffect(() => { if (step === 'add' && added === ids.length) setStep('heat'); }, [step, added, ids.length]);
  const puff = () => {
    if (!care.live.current || blowBusy.current || step !== 'cool') return;
    blowBusy.current = true; setBlowing(true); blow.setValue(0);
    Animated.timing(blow, { toValue: 1, duration: 900, easing: Easing.linear, useNativeDriver: true }).start(({ finished }) => {
      if (!finished || !care.live.current) return;
      blowBusy.current = false; setBlowing(false); setCool(value => value + 1);
      if (cool >= 2) setStep('serve');
    });
  };
  const { stageRef, panHandlers } = useKitchenTouch(care.active && step === 'stir', (x, y) => {
    const nx = x / size.width, ny = y / size.height;
    const inside = ((nx - .445) / .19) ** 2 + ((ny - .48) / .16) ** 2 <= 1;
    if (!inside) { previous.current = null; setCursor(null); return; }
    setCursor({ x, y });
    if (previous.current) {
      const distance = Math.hypot(nx - previous.current.x, ny - previous.current.y);
      if (distance > .003) setStir(value => Math.min(1, value + Math.min(distance, .065) / 1.6));
    }
    previous.current = { x: nx, y: ny };
  }, () => { previous.current = null; setCursor(null); });
  useEffect(() => { if (step === 'stir' && stir >= 1) { setStep('cool'); setCursor(null); } }, [step, stir]);
  const mix = () => {
    if (!care.live.current || stirBusy.current || step !== 'stir') return;
    stirBusy.current = true; setStirring(true); spoonMotion.setValue(0); playSound('tap');
    Animated.timing(spoonMotion, { toValue: 1, duration: 450, useNativeDriver: true }).start(({ finished }) => {
      if (!finished || !care.live.current) return;
      stirBusy.current = false; setStirring(false); setStir(value => Math.min(1, value + .2));
    });
  };
  const instructions = { add: `Arrastrá los alimentos de abajo adentro de la olla · ${added}/${ids.length}`, heat: '¡Están todos! Tocá el fuego para cocinar', stir: 'Tocá la cuchara o movela por la olla para mezclar', cool: blowing ? '¡Fuuu! Se está enfriando…' : `Está caliente. Tocá al gatito para soplar · ${cool}/3`, serve: '¡Ya no quema! Tocá el plato para servir' };
  const action = step === 'heat' ? <SceneTool style={sceneStyles.cookingAction} source={kitchenImages.potFire} label="Encender cocina" caption="Cocinar" onPress={() => setStep('stir')} />
    : step === 'cool' ? <SceneTool style={sceneStyles.cookingAction} source={kitchenImages.catBlowing} label={`Soplar (${cool}/3)`} caption={`Soplar ${cool}/3`} disabled={blowing} onPress={puff} />
    : step === 'serve' ? <SceneTool style={sceneStyles.cookingAction} source={kitchenImages.catEatingButton} label="Servir al gato" caption="¡A comer!" onPress={serve} /> : undefined;
  return <KitchenScene rootRef={drag.rootRef} overlay={drag.overlay} source={kitchenImages.counter} onClose={onClose} label={instructions[step]} value={step === 'add' ? added / ids.length * .2 : step === 'heat' ? .2 : step === 'stir' ? .2 + stir * .5 : .7 + cool / 3 * .3} showProgress={step !== 'stir'}>
    <View ref={node => { stageRef.current = node; drag.stageRef.current = node; }} collapsable={false} testID="cooking-stage" style={styles.fill} onLayout={event => setSize(event.nativeEvent.layout)} {...panHandlers}>
      <View pointerEvents="none" style={styles.fill}>
        {step === 'stir' ? <Animated.View style={[styles.heat, { opacity: steam.interpolate({ inputRange: [0, .5, 1], outputRange: [.4, .85, .4] }) }]} /> : null}
        <Image source={kitchenImages.pot} resizeMode="contain" style={styles.vessel} />
        {step === 'add' && <View style={styles.potTarget} />}
        <MealIngredients ids={addedIds} style={styles.potFood} />
        {active ? [0, 1, 2].map(index => <Animated.Text key={index} style={[styles.steam, { left: `${33 + index * 8}%`, opacity: steam.interpolate({ inputRange: [0, .2, 1], outputRange: [0, .8 * (1 - cool / 3), 0] }), transform: [{ translateY: steam.interpolate({ inputRange: [0, 1], outputRange: [15, -35] }) }] }]}>∿</Animated.Text>) : null}
        {blowing ? <Animated.Image testID="cat-blowing" source={kitchenImages.catBlowing} resizeMode="contain" style={[styles.blowingCat, {
          opacity: blow.interpolate({ inputRange: [0, .15, .85, 1], outputRange: [0, 1, 1, 0] }),
          transform: [{ translateX: blow.interpolate({ inputRange: [0, .2, .8, 1], outputRange: [size.width * .16, 0, 0, size.width * .08] }) }, { scale: blow.interpolate({ inputRange: [0, .3, .5, .7, 1], outputRange: [.95, 1, 1.035, 1, .98] }) }],
        }]} /> : null}
        {step === 'stir' ? <Animated.Image source={kitchenImages.spoon} resizeMode="contain" style={[styles.spoon, { left: cursor ? cursor.x - size.width * .055 : size.width * .42, top: cursor ? cursor.y - size.height * .06 : size.height * .46, transform: [{ translateX: spoonMotion.interpolate({ inputRange: [0, .25, .5, .75, 1], outputRange: [0, size.width * .08, 0, -size.width * .08, 0] }) }, { translateY: spoonMotion.interpolate({ inputRange: [0, .25, .5, .75, 1], outputRange: [0, -size.height * .06, -size.height * .1, -size.height * .06, 0] }) }] }]} /> : null}
      </View>
    </View>
    {step === 'add' && <View style={sceneStyles.ingredientTray}>{ids.map(id => {
      const food = kitchenFoods.find(item => item.id === id)!;
      return <DraggableIngredient key={id} food={food} size={cookingIngredientSize(size.width, size.height)} added={addedIds.includes(id)} dragging={drag.dragId === id} onStart={drag.start} onMove={drag.move} onDrop={drag.drop} onCancel={drag.cancel} onTap={addIngredient} />;
    })}</View>}
    {step === 'stir' && <TouchableOpacity accessibilityRole="button" accessibilityLabel="Revolver" disabled={stirring} onPress={mix} style={sceneStyles.spoonHit} />}
    {step === 'stir' && <CookingStirProgress value={stir} width={size.width} height={size.height} />}
    {action}
  </KitchenScene>;
}
