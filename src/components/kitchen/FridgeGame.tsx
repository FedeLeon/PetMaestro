import { useRef, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useProgress } from '../../context/ProgressContext';
import { kitchenFoods, kitchenImages, MAX_MEAL_INGREDIENTS, FRIDGE_PAGE_SIZE } from '../../data/kitchenContent';
import { styles, fridgeFoodPlacement } from '../../styles/house/kitchen.styles';
import { activityButtonImages, uiImages } from '../../data/assetImages';
import { useGameAudio } from '../../context/AudioContext';
import { KitchenScene } from './KitchenScene';
import { BreathingBathroomButton } from '../house/BreathingBathroomButton';
import { styles as sceneStyles } from '../../styles/house/careScene.styles';

export function FridgeGame({ onClose, onCook }: { onClose: () => void; onCook: (ids: string[]) => void }) {
  const { progress, buyFood, isReady } = useProgress();
  const [selected, setSelected] = useState<string[]>([]);
  const selectedRef = useRef<string[]>([]);
  const purchasing = useRef(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [page, setPage] = useState(0);
  const { playSound } = useGameAudio();
  const pages = Math.ceil(kitchenFoods.length / FRIDGE_PAGE_SIZE);
  const choose = async (id: string) => {
    if (purchasing.current) return;
    const current = selectedRef.current;
    if (!current.includes(id) && current.length >= MAX_MEAL_INGREDIENTS) { setMessage('Ya elegiste 3. Tocá uno marcado para cambiarlo.'); return; }
    if (!progress.unlockedFoodIds.includes(id)) {
      purchasing.current = true; setBusy(true);
      try {
        const result = await buyFood(id);
        if (!result.ok) { setMessage(result.reason ?? 'No se pudo comprar.'); return; }
      } finally { purchasing.current = false; setBusy(false); }
    }
    const next = current.includes(id) ? current.filter(item => item !== id) : [...current, id];
    selectedRef.current = next; setSelected(next);
    setMessage('');
  };
  return <KitchenScene source={kitchenImages.fridge} onClose={onClose} value={selected.length / 3} label={message || (selected.length ? `${selected.length}/3 elegidos · Tocá la olla para cocinar` : 'Elegí de 1 a 3 alimentos · 0/3 elegidos')}>
    {kitchenFoods.slice(page * FRIDGE_PAGE_SIZE, (page + 1) * FRIDGE_PAGE_SIZE).map((food, index) => {
      const owned = progress.unlockedFoodIds.includes(food.id);
      const chosen = selected.includes(food.id);
      return <TouchableOpacity key={food.id} accessibilityRole="button" accessibilityLabel={`${owned ? 'Elegir' : 'Comprar'} ${food.name}${owned ? '' : ` por ${food.price} monedas`}`} aria-pressed={chosen} accessibilityState={{ disabled: !isReady || busy, selected: chosen }} disabled={!isReady || busy} onPress={() => { void choose(food.id).catch(() => setMessage('No se pudo guardar. Intentá nuevamente.')); }} style={[styles.foodSlot, fridgeFoodPlacement(index), chosen && styles.foodSelected]}>
        <Image source={food.image} resizeMode="contain" style={styles.foodImage} />
        <View style={styles.foodLabel}><Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={.8} style={styles.foodLabelText}>{food.name}</Text><Text style={styles.foodLabelText}>{owned ? chosen ? '✓' : '∞' : `● ${food.price}`}</Text></View>
      </TouchableOpacity>;
    })}
    {([-1, 1] as const).map(direction => <TouchableOpacity key={direction} accessibilityRole="button" accessibilityLabel={direction < 0 ? 'Alimentos anteriores' : 'Más alimentos'} disabled={busy || page + direction < 0 || page + direction >= pages}
      onPress={() => { playSound('tap'); setMessage(''); setPage(value => value + direction); }}
      style={[styles.fridgeArrow, direction < 0 ? styles.fridgePrevious : styles.fridgeNext, (busy || page + direction < 0 || page + direction >= pages) && styles.disabled]}>
      <Image accessible={false} source={uiImages.shopPageArrow} resizeMode="contain" style={[styles.image, direction < 0 && styles.reverseArrow]} />
    </TouchableOpacity>)}
    <Text accessibilityLiveRegion="polite" accessibilityLabel={`Alimentos: página ${page + 1} de ${pages}`} style={styles.fridgePage}>{page + 1}/{pages}</Text>
    <BreathingBathroomButton source={activityButtonImages.cook} label="Cocinar" disabled={!selected.length || busy} onPress={() => onCook(selectedRef.current)} style={sceneStyles.fridgeCook} />
  </KitchenScene>;
}
