import { Image, View, type StyleProp, type ViewStyle } from 'react-native';
import { kitchenFoods } from '../../data/kitchenContent';
import { styles } from '../../styles/house/kitchen.styles';
export function MealIngredients({ ids, style, amount = 1 }: { ids: readonly string[]; style: StyleProp<ViewStyle>; amount?: number }) {
  return <View pointerEvents="none" style={style}>{ids.map((id, index) => <Image key={id} accessibilityLabel={`Ingrediente ${id}`} source={kitchenFoods.find(food => food.id === id)?.image} resizeMode="contain" style={[styles.ingredient, { left: `${ids.length === 1 ? 28 : index * 27}%`, transform: [{ scale: amount }, { rotate: `${index * 27 - 15}deg` }] }]} />)}</View>;
}
