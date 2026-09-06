export const kitchenImages = {
  heart: require('../../assets/generated/kitchen/feeding-heart-v1.png'),
  potFire: require('../../assets/generated/kitchen/button-pot-fire-v1.png'),
  catBlowing: require('../../assets/generated/kitchen/cat-blowing-v1.png'),
  catEatingButton: require('../../assets/generated/kitchen/button-cat-eating-v1.png'),
  room: require('../../assets/generated/kitchen/kitchen-interactive-v2.png'),
  fridge: require('../../assets/generated/kitchen/fridge-interior-v1.png'),
  counter: require('../../assets/generated/kitchen/cooking-counter-v1.png'),
  cat: require('../../assets/generated/kitchen/feeding-cat-v1.png'),
  catChew: require('../../assets/generated/kitchen/feeding-cat-chew-v1.png'),
  pot: require('../../assets/generated/kitchen/cooking-pot-v1.png'),
  spoon: require('../../assets/generated/kitchen/cooking-spoon-v1.png'),
  bowl: require('../../assets/generated/kitchen/feeding-bowl-v1.png'),
};

export const kitchenFoods = [
  { id: 'carrot', name: 'Zanahoria', price: 8, nutrition: 10, image: require('../../assets/generated/kitchen/food-carrot-v1.png') },
  { id: 'potato', name: 'Papa', price: 12, nutrition: 12, image: require('../../assets/generated/kitchen/food-potato-v1.png') },
  { id: 'peas', name: 'Arvejas', price: 18, nutrition: 10, image: require('../../assets/generated/kitchen/food-peas-v1.png') },
  { id: 'rice', name: 'Arroz', price: 15, nutrition: 14, image: require('../../assets/generated/kitchen/food-rice-v1.png') },
  { id: 'fish', name: 'Pescado', price: 25, nutrition: 20, image: require('../../assets/generated/kitchen/food-fish-v1.png') },
  { id: 'chicken', name: 'Pollo', price: 30, nutrition: 22, image: require('../../assets/generated/kitchen/food-chicken-v1.png') },
] as const;
export type KitchenFood = typeof kitchenFoods[number];
export const MAX_MEAL_INGREDIENTS = 3;
export function mealNutrition(ids: readonly string[]) {
  return kitchenFoods.filter(food => ids.includes(food.id)).slice(0, MAX_MEAL_INGREDIENTS).reduce((total, food) => total + food.nutrition, 0);
}
