import { Level, Round, ShopCategory, ShopItem, WordCard } from '../types';

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
  { id: 'cloud', spanish: 'nube', english: 'cloud', drawing: 'CLOUD', color: '#b7d7f0' },
  { id: 'banana', spanish: 'banana', english: 'banana', drawing: 'BANANA', color: '#ffd966' },
  { id: 'bread', spanish: 'pan', english: 'bread', drawing: 'BREAD', color: '#e6b566' },
  { id: 'milk', spanish: 'leche', english: 'milk', drawing: 'MILK', color: '#f4cccc' },
  { id: 'puzzle', spanish: 'rompecabezas', english: 'puzzle', drawing: 'PUZZLE', color: '#76a5af' },
  { id: 'kite', spanish: 'cometa', english: 'kite', drawing: 'KITE', color: '#ea9999' },
  { id: 'blocks', spanish: 'bloques', english: 'blocks', drawing: 'BLOCKS', color: '#f6b26b' },
  { id: 'butterfly', spanish: 'mariposa', english: 'butterfly', drawing: 'BUTTERFLY', color: '#c27ba0' },
  { id: 'boat', spanish: 'barco', english: 'boat', drawing: 'BOAT', color: '#6d9eeb' },
  { id: 'wave', spanish: 'ola', english: 'wave', drawing: 'WAVE', color: '#46bdc6' },
  { id: 'shirt', spanish: 'remera', english: 'shirt', drawing: 'SHIRT', color: '#6aa84f' },
  { id: 'socks', spanish: 'medias', english: 'socks', drawing: 'SOCKS', color: '#e691b5' },
  { id: 'table', spanish: 'mesa', english: 'table', drawing: 'TABLE', color: '#8d552c' },
  { id: 'lamp', spanish: 'lampara', english: 'lamp', drawing: 'LAMP', color: '#d6bf77' },
  { id: 'lion', spanish: 'leon', english: 'lion', drawing: 'LION', color: '#f6b26b' },
  { id: 'elephant', spanish: 'elefante', english: 'elephant', drawing: 'ELEPHANT', color: '#9fc5e8' },
  { id: 'monkey', spanish: 'mono', english: 'monkey', drawing: 'MONKEY', color: '#b45f06' },
  { id: 'bear', spanish: 'oso', english: 'bear', drawing: 'BEAR', color: '#8d552c' },
];

const levelDefinitions: Level[] = [
  {
    id: 1,
    title: 'Primeros amigos',
    theme: 'Mascotas',
    description: 'Aprende los nombres de cuatro mascotas en dos idiomas.',
    icon: 'paw',
    reward: 12,
    rounds: [
      { id: '1-1', type: 'picture-choice', promptLanguage: 'english', answerId: 'cat', optionIds: ['cat', 'dog', 'fish', 'bird'] },
      { id: '1-2', type: 'audio-choice', answerId: 'dog', optionIds: ['dog', 'cat', 'bird', 'fish'] },
      { id: '1-3', type: 'match-pair', pairIds: ['cat', 'dog', 'fish', 'bird'] },
      { id: '1-4', type: 'picture-choice', promptLanguage: 'spanish', answerId: 'fish', optionIds: ['fish', 'cat', 'dog', 'bird'] },
      { id: '1-5', type: 'translation-choice', promptLanguage: 'english', answerId: 'bird', optionIds: ['bird', 'cat', 'dog', 'fish'] },
    ],
  },
  {
    id: 2,
    title: 'Cielo feliz',
    theme: 'Cielo',
    description: 'Reconoce el sol, la luna, las estrellas y las nubes.',
    icon: 'weather-sunny',
    reward: 14,
    rounds: [
      { id: '2-1', type: 'picture-choice', promptLanguage: 'spanish', answerId: 'sun', optionIds: ['sun', 'moon', 'star', 'cloud'] },
      { id: '2-2', type: 'audio-choice', answerId: 'moon', optionIds: ['moon', 'sun', 'star', 'cloud'] },
      { id: '2-3', type: 'match-pair', pairIds: ['sun', 'moon', 'star', 'cloud'] },
      { id: '2-4', type: 'picture-choice', promptLanguage: 'english', answerId: 'star', optionIds: ['star', 'cloud', 'moon', 'sun'] },
      { id: '2-5', type: 'translation-choice', promptLanguage: 'spanish', answerId: 'cloud', optionIds: ['cloud', 'sun', 'moon', 'star'] },
    ],
  },
  {
    id: 3,
    title: 'Merienda',
    theme: 'Comida',
    description: 'Practica palabras de comida para una merienda deliciosa.',
    icon: 'food-apple',
    reward: 16,
    rounds: [
      { id: '3-1', type: 'picture-choice', promptLanguage: 'english', answerId: 'apple', optionIds: ['apple', 'banana', 'bread', 'milk'] },
      { id: '3-2', type: 'audio-choice', answerId: 'banana', optionIds: ['banana', 'apple', 'bread', 'milk'] },
      { id: '3-3', type: 'match-pair', pairIds: ['apple', 'banana', 'bread', 'milk'] },
      { id: '3-4', type: 'picture-choice', promptLanguage: 'spanish', answerId: 'bread', optionIds: ['bread', 'milk', 'apple', 'banana'] },
      { id: '3-5', type: 'translation-choice', promptLanguage: 'english', answerId: 'milk', optionIds: ['milk', 'apple', 'banana', 'bread'] },
    ],
  },
  {
    id: 4,
    title: 'Paseo',
    theme: 'Casa y calle',
    description: 'Descubre palabras de la casa y del paseo por la calle.',
    icon: 'home-heart',
    reward: 18,
    rounds: [
      { id: '4-1', type: 'picture-choice', promptLanguage: 'spanish', answerId: 'house', optionIds: ['house', 'tree', 'car', 'door'] },
      { id: '4-2', type: 'audio-choice', answerId: 'car', optionIds: ['car', 'house', 'tree', 'door'] },
      { id: '4-3', type: 'match-pair', pairIds: ['house', 'car', 'tree', 'door'] },
      { id: '4-4', type: 'picture-choice', promptLanguage: 'english', answerId: 'tree', optionIds: ['tree', 'door', 'house', 'car'] },
      { id: '4-5', type: 'translation-choice', promptLanguage: 'spanish', answerId: 'door', optionIds: ['door', 'house', 'tree', 'car'] },
    ],
  },
  {
    id: 5,
    title: 'Hora de jugar',
    theme: 'Juegos',
    description: 'Aprende palabras de juegos y juguetes coloridos.',
    icon: 'toy-brick',
    reward: 22,
    rounds: [
      { id: '5-1', type: 'picture-choice', promptLanguage: 'english', answerId: 'ball', optionIds: ['ball', 'puzzle', 'kite', 'blocks'] },
      { id: '5-2', type: 'audio-choice', answerId: 'puzzle', optionIds: ['puzzle', 'ball', 'kite', 'blocks'] },
      { id: '5-3', type: 'match-pair', pairIds: ['ball', 'puzzle', 'kite', 'blocks'] },
      { id: '5-4', type: 'picture-choice', promptLanguage: 'spanish', answerId: 'kite', optionIds: ['kite', 'blocks', 'ball', 'puzzle'] },
      { id: '5-5', type: 'translation-choice', promptLanguage: 'english', answerId: 'blocks', optionIds: ['blocks', 'ball', 'puzzle', 'kite'] },
    ],
  },
  {
    id: 6,
    title: 'Jardin',
    theme: 'Naturaleza',
    description: 'Aprende palabras del jardin con flores y animales pequeños.',
    icon: 'flower',
    reward: 24,
    rounds: [
      { id: '6-1', type: 'picture-choice', promptLanguage: 'spanish', answerId: 'flower', optionIds: ['flower', 'tree', 'bird', 'butterfly'] },
      { id: '6-2', type: 'audio-choice', answerId: 'bird', optionIds: ['bird', 'flower', 'tree', 'butterfly'] },
      { id: '6-3', type: 'match-pair', pairIds: ['flower', 'tree', 'bird', 'butterfly'] },
      { id: '6-4', type: 'picture-choice', promptLanguage: 'english', answerId: 'butterfly', optionIds: ['butterfly', 'tree', 'flower', 'bird'] },
      { id: '6-5', type: 'translation-choice', promptLanguage: 'spanish', answerId: 'tree', optionIds: ['tree', 'flower', 'bird', 'butterfly'] },
    ],
  },
  {
    id: 7,
    title: 'Dia de lluvia',
    theme: 'Agua',
    description: 'Practica palabras del agua, el mar y los paseos en barco.',
    icon: 'water',
    reward: 26,
    rounds: [
      { id: '7-1', type: 'picture-choice', promptLanguage: 'english', answerId: 'water', optionIds: ['water', 'fish', 'boat', 'wave'] },
      { id: '7-2', type: 'audio-choice', answerId: 'boat', optionIds: ['boat', 'water', 'fish', 'wave'] },
      { id: '7-3', type: 'match-pair', pairIds: ['water', 'fish', 'boat', 'wave'] },
      { id: '7-4', type: 'picture-choice', promptLanguage: 'spanish', answerId: 'fish', optionIds: ['fish', 'wave', 'water', 'boat'] },
      { id: '7-5', type: 'translation-choice', promptLanguage: 'english', answerId: 'wave', optionIds: ['wave', 'water', 'fish', 'boat'] },
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
      { id: '8-1', type: 'picture-choice', promptLanguage: 'spanish', answerId: 'shoe', optionIds: ['shoe', 'hat', 'shirt', 'socks'] },
      { id: '8-2', type: 'audio-choice', answerId: 'hat', optionIds: ['hat', 'shoe', 'shirt', 'socks'] },
      { id: '8-3', type: 'match-pair', pairIds: ['shoe', 'hat', 'shirt', 'socks'] },
      { id: '8-4', type: 'picture-choice', promptLanguage: 'english', answerId: 'shirt', optionIds: ['shirt', 'shoe', 'socks', 'hat'] },
      { id: '8-5', type: 'translation-choice', promptLanguage: 'spanish', answerId: 'socks', optionIds: ['socks', 'hat', 'shoe', 'shirt'] },
    ],
  },
  {
    id: 9,
    title: 'Casita',
    theme: 'Muebles',
    description: 'Aprende palabras de los muebles para decorar la casa.',
    icon: 'sofa',
    reward: 30,
    rounds: [
      { id: '9-1', type: 'picture-choice', promptLanguage: 'english', answerId: 'bed', optionIds: ['bed', 'chair', 'table', 'lamp'] },
      { id: '9-2', type: 'audio-choice', answerId: 'chair', optionIds: ['chair', 'bed', 'table', 'lamp'] },
      { id: '9-3', type: 'match-pair', pairIds: ['bed', 'chair', 'table', 'lamp'] },
      { id: '9-4', type: 'picture-choice', promptLanguage: 'spanish', answerId: 'table', optionIds: ['table', 'lamp', 'bed', 'chair'] },
      { id: '9-5', type: 'translation-choice', promptLanguage: 'english', answerId: 'lamp', optionIds: ['lamp', 'bed', 'chair', 'table'] },
    ],
  },
  {
    id: 10,
    title: 'Safari de palabras',
    theme: 'Animales salvajes',
    description: 'Conoce cuatro animales nuevos y aprende sus nombres en ingles.',
    icon: 'paw',
    reward: 35,
    rounds: [
      { id: '10-1', type: 'picture-choice', promptLanguage: 'spanish', answerId: 'lion', optionIds: ['lion', 'elephant', 'monkey', 'bear'] },
      { id: '10-2', type: 'audio-choice', answerId: 'elephant', optionIds: ['elephant', 'lion', 'monkey', 'bear'] },
      { id: '10-3', type: 'match-pair', pairIds: ['lion', 'elephant', 'monkey', 'bear'] },
      { id: '10-4', type: 'picture-choice', promptLanguage: 'english', answerId: 'monkey', optionIds: ['monkey', 'bear', 'lion', 'elephant'] },
      { id: '10-5', type: 'translation-choice', promptLanguage: 'spanish', answerId: 'bear', optionIds: ['bear', 'lion', 'elephant', 'monkey'] },
    ],
  },
  {
    id: 11,
    title: 'Gran evaluacion',
    theme: 'Todo lo aprendido',
    description: 'Mezcla palabras de todos los niveles para abrir la ciudad gatuna.',
    icon: 'trophy',
    reward: 60,
    rounds: [
      { id: '11-1', type: 'picture-choice', promptLanguage: 'english', answerId: 'cat', optionIds: ['cat', 'dog', 'fish', 'bird'] },
      { id: '11-2', type: 'audio-choice', answerId: 'moon', optionIds: ['moon', 'sun', 'star', 'cloud'] },
      { id: '11-3', type: 'translation-choice', promptLanguage: 'spanish', answerId: 'apple', optionIds: ['apple', 'banana', 'bread', 'milk'] },
      { id: '11-4', type: 'picture-choice', promptLanguage: 'spanish', answerId: 'car', optionIds: ['car', 'house', 'tree', 'door'] },
      { id: '11-5', type: 'audio-choice', answerId: 'puzzle', optionIds: ['puzzle', 'ball', 'kite', 'blocks'] },
      { id: '11-6', type: 'translation-choice', promptLanguage: 'english', answerId: 'butterfly', optionIds: ['butterfly', 'flower', 'tree', 'bird'] },
      { id: '11-7', type: 'picture-choice', promptLanguage: 'spanish', answerId: 'boat', optionIds: ['boat', 'water', 'fish', 'wave'] },
      { id: '11-8', type: 'audio-choice', answerId: 'shirt', optionIds: ['shirt', 'shoe', 'hat', 'socks'] },
      { id: '11-9', type: 'translation-choice', promptLanguage: 'spanish', answerId: 'lamp', optionIds: ['lamp', 'bed', 'chair', 'table'] },
      { id: '11-10', type: 'picture-choice', promptLanguage: 'english', answerId: 'elephant', optionIds: ['elephant', 'lion', 'monkey', 'bear'] },
    ],
  },
];

const reviewRoundTypes = ['picture-choice', 'audio-choice', 'translation-choice', 'picture-choice'] as const;

function addReviewRounds(level: Level): Level {
  const firstRound = level.rounds[0];
  const wordIds = firstRound.type === 'match-pair' ? firstRound.pairIds : firstRound.optionIds;
  const reviewRounds = wordIds.map((wordId, index): Round => {
    const type = reviewRoundTypes[index % reviewRoundTypes.length];

    if (type === 'audio-choice') {
      return {
        answerId: wordId,
        id: `${level.id}-review-${index + 1}`,
        optionIds: wordIds,
        type,
      };
    }

    return {
      answerId: wordId,
      id: `${level.id}-review-${index + 1}`,
      optionIds: wordIds,
      promptLanguage: 'english',
      type,
    };
  });

  return { ...level, rounds: [...level.rounds, ...reviewRounds] };
}

export const levels = levelDefinitions.map(addReviewRounds);

export const shopItems: ShopItem[] = [
  { id: 'party-hat', name: 'Gorrito fiesta', price: 25, category: 'hats', target: 'cat', slot: 'head', color: '#f6b26b', label: 'GORRO', icon: 'party-popper' },
  { id: 'star-hat', name: 'Sombrero estrella', price: 34, category: 'hats', target: 'cat', slot: 'head', color: '#f1c232', label: 'STAR', icon: 'wizard-hat' },
  { id: 'blue-cap', name: 'Gorra azul', price: 29, category: 'hats', target: 'cat', slot: 'head', color: '#6fa8dc', label: 'GORRA', icon: 'hat-fedora' },
  { id: 'pink-beanie', name: 'Gorrito rosa', price: 31, category: 'hats', target: 'cat', slot: 'head', color: '#e691b5', label: 'ROSA', icon: 'hat-fedora' },
  { id: 'wizard-hat-purple', name: 'Sombrero magico', price: 42, category: 'hats', target: 'cat', slot: 'head', color: '#8e7cc3', label: 'MAGIA', icon: 'wizard-hat' },
  { id: 'red-bow', name: 'Mono rojo', price: 27, category: 'hats', target: 'cat', slot: 'head', color: '#e06666', label: 'MONO', icon: 'bow-tie' },
  { id: 'golden-crown', name: 'Corona brillante', price: 55, category: 'hats', target: 'cat', slot: 'head', color: '#f1c232', label: 'CORONA', icon: 'crown' },
  { id: 'rainbow-beanie', name: 'Gorrito arcoiris', price: 48, category: 'hats', target: 'cat', slot: 'head', color: '#6fa8dc', label: 'ARCOIRIS', icon: 'palette' },
  { id: 'flower-sunhat', name: 'Sombrero flor', price: 52, category: 'hats', target: 'cat', slot: 'head', color: '#f6b26b', label: 'FLOR', icon: 'flower' },
  { id: 'bear-hood', name: 'Capucha osito', price: 49, category: 'hats', target: 'cat', slot: 'head', color: '#76a5af', label: 'OSITO', icon: 'teddy-bear' },
  { id: 'explorer-hat', name: 'Sombrero explorador', price: 46, category: 'hats', target: 'cat', slot: 'head', color: '#45818e', label: 'EXPLORADOR', icon: 'hat-fedora' },
  { id: 'round-glasses', name: 'Anteojos redondos', price: 28, category: 'glasses', target: 'cat', slot: 'eyes', color: '#6fa8dc', label: 'LENTES', icon: 'glasses' },
  { id: 'heart-glasses', name: 'Anteojos corazon', price: 36, category: 'glasses', target: 'cat', slot: 'eyes', color: '#e06666', label: 'LOVE', icon: 'heart' },
  { id: 'star-glasses', name: 'Anteojos estrella', price: 38, category: 'glasses', target: 'cat', slot: 'eyes', color: '#ffd966', label: 'STAR', icon: 'star' },
  { id: 'square-glasses', name: 'Anteojos cuadrados', price: 30, category: 'glasses', target: 'cat', slot: 'eyes', color: '#263238', label: 'CUADRO', icon: 'glasses' },
  { id: 'sun-glasses', name: 'Lentes de sol', price: 33, category: 'glasses', target: 'cat', slot: 'eyes', color: '#222222', label: 'SOL', icon: 'sunglasses' },
  { id: 'teal-glasses', name: 'Anteojos turquesa', price: 32, category: 'glasses', target: 'cat', slot: 'eyes', color: '#32b6ad', label: 'TEAL', icon: 'glasses' },
  { id: 'red-shirt', name: 'Remera roja', price: 30, category: 'shirts', target: 'cat', slot: 'body', color: '#e06666', label: 'REMERA', icon: 'tshirt-crew' },
  { id: 'green-shirt', name: 'Remera verde', price: 32, category: 'shirts', target: 'cat', slot: 'body', color: '#6aa84f', label: 'VERDE', icon: 'tshirt-crew' },
  { id: 'blue-shirt', name: 'Remera azul', price: 32, category: 'shirts', target: 'cat', slot: 'body', color: '#4f8fd9', label: 'AZUL', icon: 'tshirt-crew' },
  { id: 'yellow-shirt', name: 'Remera amarilla', price: 34, category: 'shirts', target: 'cat', slot: 'body', color: '#f1c232', label: 'SOL', icon: 'tshirt-crew' },
  { id: 'striped-shirt', name: 'Remera rayada', price: 39, category: 'shirts', target: 'cat', slot: 'body', color: '#6dcef0', label: 'RAYAS', icon: 'tshirt-crew' },
  { id: 'heart-shirt', name: 'Remera corazon', price: 41, category: 'shirts', target: 'cat', slot: 'body', color: '#e691b5', label: 'LOVE', icon: 'heart' },
  { id: 'star-shirt', name: 'Remera estrella', price: 43, category: 'shirts', target: 'cat', slot: 'body', color: '#8e7cc3', label: 'STAR', icon: 'star' },
  { id: 'rainbow-shirt', name: 'Remera arcoiris', price: 48, category: 'shirts', target: 'cat', slot: 'body', color: '#ff9f68', label: 'COLOR', icon: 'rainbow' },
  { id: 'pink-skirt', name: 'Pollera rosa', price: 38, category: 'bottoms', target: 'cat', slot: 'bottom', color: '#e691b5', label: 'ROSA', icon: 'tshirt-crew' },
  { id: 'denim-skirt', name: 'Pollera de jean', price: 42, category: 'bottoms', target: 'cat', slot: 'bottom', color: '#6d9eeb', label: 'JEAN', icon: 'tshirt-crew' },
  { id: 'rainbow-skirt', name: 'Pollera arcoiris', price: 47, category: 'bottoms', target: 'cat', slot: 'bottom', color: '#ff7a59', label: 'COLOR', icon: 'rainbow' },
  { id: 'blue-pants', name: 'Pantalon azul', price: 40, category: 'bottoms', target: 'cat', slot: 'bottom', color: '#4f8fd9', label: 'AZUL', icon: 'tshirt-crew' },
  { id: 'purple-pants', name: 'Pantalon violeta', price: 44, category: 'bottoms', target: 'cat', slot: 'bottom', color: '#8e7cc3', label: 'VIOLE', icon: 'tshirt-crew' },
  { id: 'green-pants', name: 'Pantalon verde', price: 43, category: 'bottoms', target: 'cat', slot: 'bottom', color: '#6aa84f', label: 'VERDE', icon: 'tshirt-crew' },
  { id: 'tiny-shoes', name: 'Zapatos azules', price: 24, category: 'shoes', target: 'cat', slot: 'feet', color: '#3d85c6', label: 'ZAP', icon: 'shoe-sneaker' },
  { id: 'sunny-shoes', name: 'Zapatos sol', price: 31, category: 'shoes', target: 'cat', slot: 'feet', color: '#ffd966', label: 'SOL', icon: 'shoe-print' },
  { id: 'red-sneakers', name: 'Zapatillas rojas', price: 33, category: 'shoes', target: 'cat', slot: 'feet', color: '#e06666', label: 'ROJO', icon: 'shoe-sneaker' },
  { id: 'green-boots', name: 'Botitas verdes', price: 35, category: 'shoes', target: 'cat', slot: 'feet', color: '#6aa84f', label: 'BOTAS', icon: 'shoe-print' },
  { id: 'purple-shoes', name: 'Zapatos violeta', price: 37, category: 'shoes', target: 'cat', slot: 'feet', color: '#8e7cc3', label: 'VIOLE', icon: 'shoe-sneaker' },
  { id: 'orange-slippers', name: 'Pantuflas naranja', price: 36, category: 'shoes', target: 'cat', slot: 'feet', color: '#f6b26b', label: 'SUAVE', icon: 'shoe-print' },
  { id: 'yarn-ball', name: 'Ovillo', price: 30, category: 'cat-toys', target: 'cat', slot: 'toy', color: '#c27ba0', label: 'OVILLO', icon: 'circle' },
  { id: 'mouse-toy', name: 'Ratoncito', price: 35, category: 'cat-toys', target: 'cat', slot: 'toy', color: '#999999', label: 'JUGUETE', icon: 'mouse' },
  { id: 'fish-plush', name: 'Pez de peluche', price: 34, category: 'cat-toys', target: 'cat', slot: 'toy', color: '#6d9eeb', label: 'PEZ', icon: 'fish' },
  { id: 'bell-ball', name: 'Pelota cascabel', price: 32, category: 'cat-toys', target: 'cat', slot: 'toy', color: '#ffd966', label: 'BOLA', icon: 'bell' },
  { id: 'feather-wand', name: 'Varita estrella', price: 44, category: 'cat-toys', target: 'cat', slot: 'toy', color: '#8e7cc3', label: 'VARITA', icon: 'magic-staff' },
  { id: 'star-plush', name: 'Estrella suave', price: 38, category: 'cat-toys', target: 'cat', slot: 'toy', color: '#f1c232', label: 'STAR', icon: 'star' },
  { id: 'soft-bed', name: 'Camita suave', price: 45, category: 'furniture', target: 'house', slot: 'furniture', color: '#c27ba0', label: 'CAMA', icon: 'bed' },
  { id: 'small-table', name: 'Mesita', price: 38, category: 'furniture', target: 'house', slot: 'furniture', color: '#8d552c', label: 'MESA', icon: 'table-furniture' },
  { id: 'fish-lamp', name: 'Lampara pez', price: 42, category: 'furniture', target: 'house', slot: 'furniture', color: '#6d9eeb', label: 'LUZ', icon: 'lamp' },
  { id: 'window-plant', name: 'Plantita', price: 26, category: 'furniture', target: 'house', slot: 'furniture', color: '#6aa84f', label: 'PLANTA', icon: 'flower' },
  { id: 'red-sofa', name: 'Sillon rojo', price: 58, category: 'furniture', target: 'house', slot: 'furniture', color: '#e06666', label: 'SILLON', icon: 'sofa' },
  { id: 'bookcase-open', name: 'Biblioteca', price: 52, category: 'furniture', target: 'house', slot: 'furniture', color: '#c9935b', label: 'LIBROS', icon: 'bookshelf' },
  { id: 'round-rug', name: 'Alfombra redonda', price: 40, category: 'furniture', target: 'house', slot: 'furniture', color: '#ff7a59', label: 'ALFOMBRA', icon: 'rug' },
  { id: 'floor-lamp', name: 'Lampara de pie', price: 46, category: 'furniture', target: 'house', slot: 'furniture', color: '#d6bf77', label: 'LUZ', icon: 'floor-lamp' },
  { id: 'tv-cabinet', name: 'Mueble TV', price: 55, category: 'furniture', target: 'house', slot: 'furniture', color: '#b7864f', label: 'MUEBLE', icon: 'television-classic' },
  { id: 'farm-cow', name: 'Vaquita', price: 70, category: 'pets', target: 'yard', slot: 'animal', color: '#7fc8f8', label: 'MUU', icon: 'cow' },
  { id: 'farm-pig', name: 'Cerdito', price: 62, category: 'pets', target: 'yard', slot: 'animal', color: '#f4a6bd', label: 'OINK', icon: 'pig' },
  { id: 'farm-sheep', name: 'Ovejita', price: 66, category: 'pets', target: 'yard', slot: 'animal', color: '#b7d88a', label: 'BEE', icon: 'sheep' },
  { id: 'farm-horse', name: 'Caballito', price: 84, category: 'pets', target: 'yard', slot: 'animal', color: '#c9935b', label: 'HIH', icon: 'horse' },
  { id: 'farm-duck', name: 'Patito', price: 54, category: 'pets', target: 'yard', slot: 'animal', color: '#ffd966', label: 'CUAC', icon: 'duck' },
  { id: 'farm-rabbit', name: 'Conejito', price: 58, category: 'pets', target: 'yard', slot: 'animal', color: '#d9d2e9', label: 'SALTA', icon: 'rabbit' },
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
    id: 'bottoms',
    label: 'Ropa',
    description: 'Polleras y pantalones para completar el look del gatito.',
    icon: 'tshirt-crew',
    color: '#e691b5',
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
  {
    id: 'pets',
    label: 'Mascotas',
    description: 'Animalitos de granja para los corrales exteriores.',
    icon: 'barn',
    color: '#7fc8f8',
  },
];

export function getWord(id: string) {
  const word = words.find((item) => item.id === id);

  if (!word) {
    throw new Error(`Missing word card: ${id}`);
  }

  return word;
}
