import { Level, ShopCategory, ShopItem, WordCard } from '../types';

export const words: WordCard[] = [
  { id: 'cat', spanish: 'gato', english: 'cat', drawing: 'CAT', color: '#f6b26b' },
  { id: 'dog', spanish: 'perro', english: 'dog', drawing: 'DOG', color: '#9fc5e8' },
  { id: 'sun', spanish: 'sol', english: 'sun', drawing: 'SUN', color: '#ffd966' },
  { id: 'moon', spanish: 'luna', english: 'moon', drawing: 'MOON', color: '#b4a7d6' },
  { id: 'apple', spanish: 'manzana', english: 'apple', drawing: 'APPLE', color: '#e06666' },
  { id: 'ball', spanish: 'pelota', english: 'ball', drawing: 'BALL', color: '#76a5af' },
  { id: 'house', spanish: 'casa', english: 'house', drawing: 'HOUSE', color: '#93c47d' },
  { id: 'car', spanish: 'auto', english: 'car', drawing: 'CAR', color: '#6fa8dc' },
  { id: 'book', spanish: 'libro', english: 'book', drawing: 'BOOK', color: '#c27ba0' },
  { id: 'star', spanish: 'estrella', english: 'star', drawing: 'STAR', color: '#f1c232' },
  { id: 'fish', spanish: 'pez', english: 'fish', drawing: 'FISH', color: '#6d9eeb' },
  { id: 'tree', spanish: 'arbol', english: 'tree', drawing: 'TREE', color: '#6aa84f' },
  { id: 'flower', spanish: 'flor', english: 'flower', drawing: 'FLOWER', color: '#e691b5' },
  { id: 'bird', spanish: 'pajaro', english: 'bird', drawing: 'BIRD', color: '#8e7cc3' },
  { id: 'water', spanish: 'agua', english: 'water', drawing: 'WATER', color: '#6d9eeb' },
  { id: 'shoe', spanish: 'zapato', english: 'shoe', drawing: 'SHOE', color: '#3d85c6' },
  { id: 'hat', spanish: 'sombrero', english: 'hat', drawing: 'HAT', color: '#f6b26b' },
  { id: 'bed', spanish: 'cama', english: 'bed', drawing: 'BED', color: '#c27ba0' },
  { id: 'chair', spanish: 'silla', english: 'chair', drawing: 'CHAIR', color: '#8d552c' },
  { id: 'door', spanish: 'puerta', english: 'door', drawing: 'DOOR', color: '#a47148' },
];

export const levels: Level[] = [
  {
    id: 1,
    title: 'Primeros amigos',
    theme: 'Mascotas',
    description: 'Aprende palabras de mascotas y objetos cercanos para acompanar al gatito.',
    icon: 'paw',
    reward: 12,
    rounds: [
      { id: '1-1', type: 'picture-choice', promptLanguage: 'english', answerId: 'cat', optionIds: ['cat', 'dog', 'fish'] },
      { id: '1-2', type: 'translation-choice', promptLanguage: 'spanish', answerId: 'dog', optionIds: ['dog', 'cat', 'ball'] },
      { id: '1-3', type: 'match-pair', pairIds: ['cat', 'dog', 'fish'] },
      { id: '1-4', type: 'picture-choice', promptLanguage: 'spanish', answerId: 'ball', optionIds: ['ball', 'apple', 'sun'] },
      { id: '1-5', type: 'translation-choice', promptLanguage: 'english', answerId: 'fish', optionIds: ['fish', 'tree', 'book'] },
    ],
  },
  {
    id: 2,
    title: 'Cielo feliz',
    theme: 'Cielo',
    description: 'Reconoce sol, luna y estrellas con palabras simples en dos idiomas.',
    icon: 'weather-sunny',
    reward: 14,
    rounds: [
      { id: '2-1', type: 'picture-choice', promptLanguage: 'spanish', answerId: 'sun', optionIds: ['sun', 'moon', 'star'] },
      { id: '2-2', type: 'translation-choice', promptLanguage: 'english', answerId: 'moon', optionIds: ['moon', 'sun', 'car'] },
      { id: '2-3', type: 'match-pair', pairIds: ['sun', 'moon', 'star'] },
      { id: '2-4', type: 'picture-choice', promptLanguage: 'english', answerId: 'star', optionIds: ['star', 'book', 'apple'] },
      { id: '2-5', type: 'translation-choice', promptLanguage: 'spanish', answerId: 'sun', optionIds: ['sun', 'house', 'fish'] },
    ],
  },
  {
    id: 3,
    title: 'Merienda',
    theme: 'Comida',
    description: 'Practica palabras de comida y cosas del momento de jugar y leer.',
    icon: 'food-apple',
    reward: 16,
    rounds: [
      { id: '3-1', type: 'picture-choice', promptLanguage: 'english', answerId: 'apple', optionIds: ['apple', 'ball', 'cat'] },
      { id: '3-2', type: 'translation-choice', promptLanguage: 'spanish', answerId: 'apple', optionIds: ['apple', 'book', 'tree'] },
      { id: '3-3', type: 'match-pair', pairIds: ['apple', 'fish', 'book'] },
      { id: '3-4', type: 'picture-choice', promptLanguage: 'spanish', answerId: 'fish', optionIds: ['fish', 'dog', 'moon'] },
      { id: '3-5', type: 'translation-choice', promptLanguage: 'english', answerId: 'book', optionIds: ['book', 'car', 'sun'] },
    ],
  },
  {
    id: 4,
    title: 'Paseo',
    theme: 'Casa y calle',
    description: 'Descubre palabras del paseo: casa, auto y arbol.',
    icon: 'home-heart',
    reward: 18,
    rounds: [
      { id: '4-1', type: 'picture-choice', promptLanguage: 'spanish', answerId: 'house', optionIds: ['house', 'tree', 'car'] },
      { id: '4-2', type: 'translation-choice', promptLanguage: 'english', answerId: 'car', optionIds: ['car', 'ball', 'moon'] },
      { id: '4-3', type: 'match-pair', pairIds: ['house', 'car', 'tree'] },
      { id: '4-4', type: 'picture-choice', promptLanguage: 'english', answerId: 'tree', optionIds: ['tree', 'star', 'dog'] },
      { id: '4-5', type: 'translation-choice', promptLanguage: 'spanish', answerId: 'house', optionIds: ['house', 'fish', 'apple'] },
    ],
  },
  {
    id: 5,
    title: 'Gran repaso',
    theme: 'Mezcla',
    description: 'Mezcla lo aprendido para ganar mas moneditas y seguir avanzando.',
    icon: 'star-circle',
    reward: 22,
    rounds: [
      { id: '5-1', type: 'picture-choice', promptLanguage: 'english', answerId: 'book', optionIds: ['book', 'car', 'ball'] },
      { id: '5-2', type: 'translation-choice', promptLanguage: 'spanish', answerId: 'star', optionIds: ['star', 'sun', 'moon'] },
      { id: '5-3', type: 'match-pair', pairIds: ['cat', 'apple', 'house'] },
      { id: '5-4', type: 'picture-choice', promptLanguage: 'spanish', answerId: 'tree', optionIds: ['tree', 'fish', 'dog'] },
      { id: '5-5', type: 'translation-choice', promptLanguage: 'english', answerId: 'ball', optionIds: ['ball', 'book', 'car'] },
    ],
  },
  {
    id: 6,
    title: 'Jardin',
    theme: 'Naturaleza',
    description: 'Aprende palabras del jardin con flores, arboles y pajaros.',
    icon: 'flower',
    reward: 24,
    rounds: [
      { id: '6-1', type: 'picture-choice', promptLanguage: 'spanish', answerId: 'flower', optionIds: ['flower', 'tree', 'star'] },
      { id: '6-2', type: 'translation-choice', promptLanguage: 'english', answerId: 'bird', optionIds: ['bird', 'fish', 'dog'] },
      { id: '6-3', type: 'match-pair', pairIds: ['flower', 'tree', 'bird'] },
      { id: '6-4', type: 'picture-choice', promptLanguage: 'english', answerId: 'tree', optionIds: ['tree', 'house', 'car'] },
      { id: '6-5', type: 'translation-choice', promptLanguage: 'spanish', answerId: 'flower', optionIds: ['flower', 'moon', 'book'] },
    ],
  },
  {
    id: 7,
    title: 'Dia de lluvia',
    theme: 'Agua',
    description: 'Practica palabras de agua y objetos que aparecen cuando llueve.',
    icon: 'water',
    reward: 26,
    rounds: [
      { id: '7-1', type: 'picture-choice', promptLanguage: 'english', answerId: 'water', optionIds: ['water', 'sun', 'apple'] },
      { id: '7-2', type: 'translation-choice', promptLanguage: 'spanish', answerId: 'water', optionIds: ['water', 'ball', 'cat'] },
      { id: '7-3', type: 'match-pair', pairIds: ['water', 'fish', 'moon'] },
      { id: '7-4', type: 'picture-choice', promptLanguage: 'spanish', answerId: 'fish', optionIds: ['fish', 'bird', 'book'] },
      { id: '7-5', type: 'translation-choice', promptLanguage: 'english', answerId: 'moon', optionIds: ['moon', 'tree', 'dog'] },
    ],
  },
  {
    id: 8,
    title: 'Ropita',
    theme: 'Vestimenta',
    description: 'Descubre palabras de ropa para vestir al gatito.',
    icon: 'tshirt-crew',
    reward: 28,
    rounds: [
      { id: '8-1', type: 'picture-choice', promptLanguage: 'spanish', answerId: 'shoe', optionIds: ['shoe', 'hat', 'book'] },
      { id: '8-2', type: 'translation-choice', promptLanguage: 'english', answerId: 'hat', optionIds: ['hat', 'car', 'tree'] },
      { id: '8-3', type: 'match-pair', pairIds: ['shoe', 'hat', 'book'] },
      { id: '8-4', type: 'picture-choice', promptLanguage: 'english', answerId: 'shoe', optionIds: ['shoe', 'ball', 'apple'] },
      { id: '8-5', type: 'translation-choice', promptLanguage: 'spanish', answerId: 'hat', optionIds: ['hat', 'star', 'fish'] },
    ],
  },
  {
    id: 9,
    title: 'Casita',
    theme: 'Muebles',
    description: 'Aprende palabras de la casa para decorar nuevos espacios.',
    icon: 'sofa',
    reward: 30,
    rounds: [
      { id: '9-1', type: 'picture-choice', promptLanguage: 'english', answerId: 'bed', optionIds: ['bed', 'chair', 'door'] },
      { id: '9-2', type: 'translation-choice', promptLanguage: 'spanish', answerId: 'chair', optionIds: ['chair', 'house', 'car'] },
      { id: '9-3', type: 'match-pair', pairIds: ['bed', 'chair', 'door'] },
      { id: '9-4', type: 'picture-choice', promptLanguage: 'spanish', answerId: 'door', optionIds: ['door', 'moon', 'fish'] },
      { id: '9-5', type: 'translation-choice', promptLanguage: 'english', answerId: 'bed', optionIds: ['bed', 'apple', 'sun'] },
    ],
  },
  {
    id: 10,
    title: 'Super palabras',
    theme: 'Desafio',
    description: 'Un desafio con palabras mezcladas para llegar mas lejos en el camino.',
    icon: 'trophy',
    reward: 35,
    rounds: [
      { id: '10-1', type: 'picture-choice', promptLanguage: 'spanish', answerId: 'bird', optionIds: ['bird', 'cat', 'shoe'] },
      { id: '10-2', type: 'translation-choice', promptLanguage: 'english', answerId: 'door', optionIds: ['door', 'flower', 'ball'] },
      { id: '10-3', type: 'match-pair', pairIds: ['water', 'hat', 'chair'] },
      { id: '10-4', type: 'picture-choice', promptLanguage: 'english', answerId: 'flower', optionIds: ['flower', 'bed', 'car'] },
      { id: '10-5', type: 'translation-choice', promptLanguage: 'spanish', answerId: 'shoe', optionIds: ['shoe', 'moon', 'tree'] },
    ],
  },
];

export const shopItems: ShopItem[] = [
  { id: 'party-hat', name: 'Gorrito fiesta', price: 25, category: 'hats', target: 'cat', slot: 'head', color: '#f6b26b', label: 'GORRO', icon: 'party-popper' },
  { id: 'star-hat', name: 'Sombrero estrella', price: 34, category: 'hats', target: 'cat', slot: 'head', color: '#f1c232', label: 'STAR', icon: 'wizard-hat' },
  { id: 'round-glasses', name: 'Anteojos redondos', price: 28, category: 'glasses', target: 'cat', slot: 'eyes', color: '#6fa8dc', label: 'LENTES', icon: 'glasses' },
  { id: 'heart-glasses', name: 'Anteojos corazon', price: 36, category: 'glasses', target: 'cat', slot: 'eyes', color: '#e06666', label: 'LOVE', icon: 'heart' },
  { id: 'red-shirt', name: 'Remera roja', price: 30, category: 'shirts', target: 'cat', slot: 'body', color: '#e06666', label: 'REMERA', icon: 'tshirt-crew' },
  { id: 'green-shirt', name: 'Remera verde', price: 32, category: 'shirts', target: 'cat', slot: 'body', color: '#6aa84f', label: 'VERDE', icon: 'tshirt-crew' },
  { id: 'tiny-shoes', name: 'Zapatos azules', price: 24, category: 'shoes', target: 'cat', slot: 'feet', color: '#3d85c6', label: 'ZAP', icon: 'shoe-sneaker' },
  { id: 'sunny-shoes', name: 'Zapatos sol', price: 31, category: 'shoes', target: 'cat', slot: 'feet', color: '#ffd966', label: 'SOL', icon: 'shoe-print' },
  { id: 'yarn-ball', name: 'Ovillo', price: 30, category: 'cat-toys', target: 'cat', slot: 'toy', color: '#c27ba0', label: 'OVILLO', icon: 'circle' },
  { id: 'mouse-toy', name: 'Ratoncito', price: 35, category: 'cat-toys', target: 'cat', slot: 'toy', color: '#999999', label: 'JUGUETE', icon: 'mouse' },
  { id: 'soft-bed', name: 'Camita suave', price: 45, category: 'furniture', target: 'house', slot: 'furniture', color: '#c27ba0', label: 'CAMA', icon: 'bed' },
  { id: 'small-table', name: 'Mesita', price: 38, category: 'furniture', target: 'house', slot: 'furniture', color: '#8d552c', label: 'MESA', icon: 'table-furniture' },
  { id: 'fish-lamp', name: 'Lampara pez', price: 42, category: 'furniture', target: 'house', slot: 'furniture', color: '#6d9eeb', label: 'LUZ', icon: 'lamp' },
  { id: 'window-plant', name: 'Plantita', price: 26, category: 'furniture', target: 'house', slot: 'furniture', color: '#6aa84f', label: 'PLANTA', icon: 'flower' },
];

export const shopCategories: ShopCategory[] = [
  {
    id: 'hats',
    label: 'Sombreros',
    description: 'Gorritos y sombreros para la cabeza del gatito.',
    icon: 'wizard-hat',
    color: '#f6b26b',
  },
  {
    id: 'glasses',
    label: 'Anteojos',
    description: 'Lentes divertidos para cambiar su mirada.',
    icon: 'glasses',
    color: '#6fa8dc',
  },
  {
    id: 'shirts',
    label: 'Remeras',
    description: 'Ropita colorida para vestir al gatito.',
    icon: 'tshirt-crew',
    color: '#e06666',
  },
  {
    id: 'shoes',
    label: 'Zapatos',
    description: 'Zapatos pequenos para completar el look.',
    icon: 'shoe-sneaker',
    color: '#3d85c6',
  },
  {
    id: 'cat-toys',
    label: 'Juguetes',
    description: 'Juguetes para que el gatito se divierta.',
    icon: 'mouse',
    color: '#c27ba0',
  },
  {
    id: 'furniture',
    label: 'Muebles',
    description: 'Objetos para decorar la casa por dentro.',
    icon: 'sofa',
    color: '#8d552c',
  },
];

export function getWord(id: string) {
  const word = words.find((item) => item.id === id);

  if (!word) {
    throw new Error(`Missing word card: ${id}`);
  }

  return word;
}
