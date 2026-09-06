import type { ShopItem } from '../types';

export const FLOWER_WATER_INTERVAL_MS = 5 * 60 * 1000;
export const gardenFlowers: ShopItem[] = [
  { id: 'flower-daisies', name: 'Margaritas', price: 20, category: 'flowers', target: 'garden', slot: 'furniture', color: '#f5d85b', label: 'MARGARITAS', icon: 'flower' },
  { id: 'flower-tulips', name: 'Tulipanes', price: 30, category: 'flowers', target: 'garden', slot: 'furniture', color: '#ef9ac0', label: 'TULIPANES', icon: 'flower-tulip' },
  { id: 'flower-sunflowers', name: 'Girasoles', price: 40, category: 'flowers', target: 'garden', slot: 'furniture', color: '#f4bd4c', label: 'GIRASOLES', icon: 'flower' },
  { id: 'flower-roses', name: 'Rosas', price: 50, category: 'flowers', target: 'garden', slot: 'furniture', color: '#ed7895', label: 'ROSAS', icon: 'flower' },
];
export const gardenImages: Record<string, number> = {
  'flower-daisies': require('../../assets/generated/garden/daisies-v1.png'),
  'flower-tulips': require('../../assets/generated/garden/tulips-v1.png'),
  'flower-sunflowers': require('../../assets/generated/garden/sunflowers-v1.png'),
  'flower-roses': require('../../assets/generated/garden/roses-v1.png'),
  wateringCan: require('../../assets/generated/garden/watering-can-v1.png'),
};
export function flowerWait(lastWatered: number | undefined, now: number) {
  return lastWatered === undefined ? 0 : Math.max(0, lastWatered + FLOWER_WATER_INTERVAL_MS - now);
}
export const thirstyGardenImages: Record<string, number> = {
  'flower-daisies': require('../../assets/generated/garden/daisies-thirsty-v1.png'),
  'flower-tulips': require('../../assets/generated/garden/tulips-thirsty-v1.png'),
  'flower-sunflowers': require('../../assets/generated/garden/sunflowers-thirsty-v1.png'),
  'flower-roses': require('../../assets/generated/garden/roses-thirsty-v1.png'),
};
