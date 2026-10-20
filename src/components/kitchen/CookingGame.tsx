import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, View } from 'react-native';
import { kitchenFoods, kitchenImages } from '../../data/kitchenContent';
import { styles } from '../../styles/house/kitchen.styles';
import { DraggableIngredient } from './DraggableIngredient';
import { useIngredientDrag } from './useIngredientDrag';
import { KitchenScene } from './KitchenScene';
import { MealIngredients } from './MealIngredients';
import { useGameAudio } from '../../context/AudioContext';
import { SceneTool } from '../house/CareActivityScene';
import { styles as sceneStyles } from '../../styles/house/careScene.styles';
import { useCareActivity } from '../house/useCareActivity';
import { cookingIngredientSize } from '../../styles/house/cooking.layout';
import { CookingSoup } from './CookingSoup';
import { useProgress } from '../../context/ProgressContext';

type Step = 'add' | 'filling' | 'cool' | 'serve';
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
  const soupFill = useRef(new Animated.Value(0)).current;
  const [cool, setCool] = useState(0);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const steam = useRef(new Animated.Value(0)).current;
  const active = step === 'filling' || step === 'cool';
  useEffect(() => {
    if (!active || !care.active) return;
    const loop = Animated.loop(Animated.timing(steam, { toValue: 1, duration: 1500, easing: Easing.linear, useNativeDriver: true, isInteraction: false }));
    steam.setValue(0); loop.start(); return () => loop.stop();
  }, [active, care.active, steam]);
  useEffect(() => {
    if (care.active) return;
    blow.stopAnimation(); drag.cancel();
    blowBusy.current = false; setBlowing(false);
  }, [care.active, blow]);
  useEffect(() => () => { blow.stopAnimation(); soupFill.stopAnimation(); }, [blow, soupFill]);
  useEffect(() => { if (step === 'add' && ids.length > 0 && added === ids.length) setStep('filling'); }, [step, added, ids.length]);
  useEffect(() => {
    if (step !== 'filling' || !care.active) return;
    const animation = Animated.timing(soupFill, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.quad), useNativeDriver: true });
    animation.start(({ finished }) => { if (finished && care.live.current) setStep('cool'); });
    return () => animation.stop();
  }, [care.active, care.live, soupFill, step]);
  const puff = () => {
    if (!care.live.current || blowBusy.current || step !== 'cool') return;
    blowBusy.current = true; setBlowing(true); blow.setValue(0);
    Animated.timing(blow, { toValue: 1, duration: 900, easing: Easing.linear, useNativeDriver: true }).start(({ finished }) => {
      if (!finished || !care.live.current) return;
      blowBusy.current = false; setBlowing(false); setCool(value => value + 1);
      if (cool >= 2) setStep('serve');
    });
  };
  const instructions = { add: `Arrastrá los alimentos de abajo adentro de la olla · ${added}/${ids.length}`, filling: '¡Están todos! La olla se llena de sopita…', cool: blowing ? '¡Fuuu! Se está enfriando…' : `Está caliente. Tocá al gatito para soplar · ${cool}/3`, serve: '¡Ya no quema! Tocá el plato para servir' };
  const action = step === 'cool' ? <SceneTool style={sceneStyles.cookingAction} source={kitchenImages.catBlowing} label={`Soplar (${cool}/3)`} caption={`Soplar ${cool}/3`} disabled={blowing} onPress={puff} />
    : step === 'serve' ? <SceneTool style={sceneStyles.cookingAction} source={kitchenImages.catEatingButton} label="Servir al gato" caption="¡A comer!" onPress={serve} /> : undefined;
  return <KitchenScene rootRef={drag.rootRef} overlay={drag.overlay} source={kitchenImages.counter} onClose={onClose} label={instructions[step]} value={step === 'add' ? added / Math.max(1, ids.length) * .3 : step === 'filling' ? .3 : .7 + cool / 3 * .3}>
    <View ref={drag.stageRef} collapsable={false} testID="cooking-stage" style={styles.fill} onLayout={event => setSize(event.nativeEvent.layout)}>
      <View pointerEvents="none" style={styles.fill}>
        <Image source={kitchenImages.pot} resizeMode="contain" style={styles.vessel} />
        {step === 'add' && <View style={styles.potTarget} />}
        <Animated.View style={[styles.fill, { opacity: soupFill.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }]}><MealIngredients ids={addedIds} style={styles.potFood} /></Animated.View>
        {step !== 'add' && <CookingSoup ids={ids} fill={soupFill} height={size.height} />}
        {active ? [0, 1, 2].map(index => <Animated.Text key={index} style={[styles.steam, { left: `${33 + index * 8}%`, opacity: steam.interpolate({ inputRange: [0, .2, 1], outputRange: [0, .8 * (1 - cool / 3), 0] }), transform: [{ translateY: steam.interpolate({ inputRange: [0, 1], outputRange: [15, -35] }) }] }]}>∿</Animated.Text>) : null}
        {blowing ? <Animated.Image testID="cat-blowing" source={kitchenImages.catBlowing} resizeMode="contain" style={[styles.blowingCat, {
          opacity: blow.interpolate({ inputRange: [0, .15, .85, 1], outputRange: [0, 1, 1, 0] }),
          transform: [{ translateX: blow.interpolate({ inputRange: [0, .2, .8, 1], outputRange: [size.width * .16, 0, 0, size.width * .08] }) }, { scale: blow.interpolate({ inputRange: [0, .3, .5, .7, 1], outputRange: [.95, 1, 1.035, 1, .98] }) }],
        }]} /> : null}
      </View>
    </View>
    {step === 'add' && <View style={sceneStyles.ingredientTray}>{ids.map(id => {
      const food = kitchenFoods.find(item => item.id === id)!;
      return <DraggableIngredient key={id} food={food} size={cookingIngredientSize(size.width, size.height)} added={addedIds.includes(id)} dragging={drag.dragId === id} onStart={drag.start} onMove={drag.move} onDrop={drag.drop} onCancel={drag.cancel} onTap={addIngredient} />;
    })}</View>}
    {action}
  </KitchenScene>;
}
