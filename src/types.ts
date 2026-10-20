export type RootStackParamList = {
  Map: undefined;
  CityMap: undefined;
  Game: { levelId: number; mode?: 'review' };
  Activities: undefined;
  Album: undefined;
  Toys: undefined;
  Library: undefined;
  Audiobook: { storyId: string };
  ToyGame: { toyId: string };
  CityActivity: { activityId: string };
  Pet: undefined;
  Shop: undefined;
  ShopCategory: { categoryId: ShopCategory['id'] };
  House: { room?: 'inside' | 'outside' | 'kitchen' | 'bathroom' | 'bedroom' } | undefined;
  Drawing: undefined;
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
      type: 'audio-choice';
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
  category: 'hats' | 'glasses' | 'shirts' | 'bottoms' | 'shoes' | 'cat-toys' | 'furniture' | 'pets' | 'flowers';
  target: 'cat' | 'house' | 'yard' | 'garden';
  slot: 'neck' | 'head' | 'eyes' | 'body' | 'bottom' | 'feet' | 'toy' | 'furniture' | 'animal';
  color: string;
  label: string;
  icon: string;
};

export type ShopCategory = {
  id: 'hats' | 'glasses' | 'shirts' | 'bottoms' | 'shoes' | 'cat-toys' | 'furniture' | 'pets' | 'flowers';
  label: string;
  description: string;
  icon: string;
  color: string;
};

export type ProgressState = {
  storyQuizResults: Record<string, { best: number; completed: number; lastAttemptId: string }>;
  learning: LearningProgress;
  unlockedLevel: number;
  coins: number;
  ownedItems: string[];
  unlockedFoodIds: string[];
  equippedItemId: string | null;
  equippedCatItems: Partial<Record<'neck' | 'head' | 'eyes' | 'body' | 'bottom' | 'feet' | 'toy', string | null>>;
  placedFurnitureIds: string[];
  placedAnimalIds: string[];
  flowerWateredAt: Record<string, number>;
  completedLevels: number[];
  drawingStrokes: DrawingStroke[];
  needs: PetNeeds;
  needsUpdatedAt: number;
};

export type WordProgress = { correct: number; errors: number; lastPracticed: number };
export type ActivityKind = 'answers' | 'review' | 'meal' | 'wash' | 'sleep' | 'water' | 'toy' | 'city';
export type LearningProgress = {
  words: Record<string, WordProgress>;
  counts: Partial<Record<ActivityKind, number>>;
  claimedMissions: string[];
  cityCompleted: string[];
  toyBest: Record<string, number>;
};

export type PetNeeds = {
  hunger: number;
  hygiene: number;
  bathroom: number;
  play: number;
  energy: number;
};

export type DrawingPoint = {
  x: number;
  y: number;
};

export type DrawingStroke = {
  color: string;
  points: DrawingPoint[];
  width: number;
};
