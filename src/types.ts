export type RootStackParamList = {
  Map: undefined;
  Game: { levelId: number };
  Pet: undefined;
  Shop: undefined;
  ShopCategory: { categoryId: ShopCategory['id'] };
  House: undefined;
};

export type WordCard = {
  id: string;
  spanish: string;
  english: string;
  drawing: string;
  color: string;
};

export type Round =
  | {
      id: string;
      type: 'picture-choice';
      promptLanguage: 'spanish' | 'english';
      answerId: string;
      optionIds: string[];
    }
  | {
      id: string;
      type: 'translation-choice';
      promptLanguage: 'spanish' | 'english';
      answerId: string;
      optionIds: string[];
    }
  | {
      id: string;
      type: 'match-pair';
      pairIds: string[];
    };

export type Level = {
  id: number;
  title: string;
  theme: string;
  description: string;
  icon: string;
  reward: number;
  rounds: Round[];
};

export type ShopItem = {
  id: string;
  name: string;
  price: number;
  category: 'hats' | 'glasses' | 'shirts' | 'shoes' | 'cat-toys' | 'furniture' | 'pets';
  target: 'cat' | 'house' | 'yard';
  slot: 'neck' | 'head' | 'eyes' | 'body' | 'feet' | 'toy' | 'furniture' | 'animal';
  color: string;
  label: string;
  icon: string;
};

export type ShopCategory = {
  id: 'hats' | 'glasses' | 'shirts' | 'shoes' | 'cat-toys' | 'furniture' | 'pets';
  label: string;
  description: string;
  icon: string;
  color: string;
};

export type ProgressState = {
  unlockedLevel: number;
  coins: number;
  ownedItems: string[];
  equippedItemId: string | null;
  equippedCatItems: Partial<Record<'neck' | 'head' | 'eyes' | 'body' | 'feet' | 'toy', string | null>>;
  placedFurnitureIds: string[];
  placedAnimalIds: string[];
  furniturePositions: Record<string, { x: number; y: number }>;
  completedLevels: number[];
};
