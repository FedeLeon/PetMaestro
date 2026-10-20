import { Image, View, type StyleProp, type ViewStyle } from 'react-native';
import { kitchenFoods } from '../../data/kitchenContent';
import { styles } from '../../styles/house/kitchen.styles';
export function MealIngredients({ ids, style, positionIds = ids, testID }: { ids: readonly string[]; style: StyleProp<ViewStyle>; positionIds?: readonly string[]; testID?: string }) {
  return <View testID={testID} pointerEvents="none" style={style}>{ids.map(id => {
    const index = positionIds.indexOf(id);
    return <Image key={id} accessibilityLabel={`Ingrediente ${id}`} source={kitchenFoods.find(food => food.id === id)?.image} resizeMode="contain" style={[styles.ingredient, { left: `${positionIds.length === 1 ? 28 : index * 27}%`, transform: [{ rotate: `${index * 27 - 15}deg` }] }]} />;
  })}</View>;
}
