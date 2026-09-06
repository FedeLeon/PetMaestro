import { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useProgress } from '../../context/ProgressContext';
import { kitchenFoods, kitchenImages, MAX_MEAL_INGREDIENTS, mealNutrition } from '../../data/kitchenContent';
import { styles } from '../../styles/house/kitchen.styles';
import { KitchenAssetButton } from './KitchenAssetButton';
import { KitchenScene } from './KitchenScene';

export function FridgeGame({ onClose, onCook }: { onClose: () => void; onCook: (ids: string[]) => void }) {
  const { progress, buyFood, isReady } = useProgress();
  const [selected, setSelected] = useState<string[]>([]);
  const [message, setMessage] = useState('Comprás una vez. ¡Lo usás para siempre!');
  const choose = async (id: string) => {
    const result = await buyFood(id);
    if (!result.ok) { setMessage(result.reason ?? 'No se pudo comprar.'); return; }
    setSelected(current => current.includes(id) ? current.filter(item => item !== id) : current.length < MAX_MEAL_INGREDIENTS ? [...current, id] : current);
    setMessage(selected.length >= MAX_MEAL_INGREDIENTS && !selected.includes(id) ? 'Elegí hasta 3. Tocá uno elegido para cambiarlo.' : '¡Listo! Podés usarlo en todas tus comidas.');
  };
  return <KitchenScene source={kitchenImages.fridge} onClose={onClose} controls={<>
    <Text style={styles.title}>Mi heladera</Text>
    <Text style={styles.text}>Elegí de 1 a 3 alimentos</Text>
    <Text style={styles.message} accessibilityLiveRegion="polite">{message}</Text>
    <View style={styles.selection}>{kitchenFoods.filter(food => selected.includes(food.id)).map(food => <Image key={food.id} source={food.image} style={styles.selectedIcon} />)}</View>
    <Text style={styles.text}>{selected.length}/3 · Comida +{mealNutrition(selected)}</Text>
    <KitchenAssetButton source={kitchenImages.potFire} label="Cocinar" disabled={!selected.length} onPress={() => onCook(selected)} />
  </>}>
    {kitchenFoods.map((food, index) => {
      const owned = progress.unlockedFoodIds.includes(food.id);
      const chosen = selected.includes(food.id);
      return <TouchableOpacity key={food.id} accessibilityRole="button" accessibilityLabel={`${owned ? 'Elegir' : 'Comprar'} ${food.name}${owned ? '' : ` por ${food.price} monedas`}`} aria-pressed={chosen} accessibilityState={{ disabled: !isReady }} disabled={!isReady} onPress={() => { void choose(food.id).catch(() => setMessage('No se pudo guardar. Intentá nuevamente.')); }} style={[styles.foodSlot, { left: `${index % 2 === 0 ? 18 : 53}%`, top: `${10 + Math.floor(index / 2) * 25}%` }, chosen && styles.foodSelected]}>
        <Image source={food.image} resizeMode="contain" style={styles.foodImage} />
        <View style={styles.foodLabel}><Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={.8} style={styles.foodLabelText}>{food.name}</Text><Text style={styles.foodLabelText}>{owned ? chosen ? '✓' : '∞' : `● ${food.price}`}</Text></View>
      </TouchableOpacity>;
    })}
  </KitchenScene>;
}
