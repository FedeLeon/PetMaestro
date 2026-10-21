import { ActivityKind, LearningProgress, Level, ProgressState } from '../types';
import { levels, words } from './gameContent';

export const toyMode = (id: string) => id === 'yarn-ball' ? 'rolling-yarn' : id === 'mouse-toy' ? 'hide-and-seek' : ['fish-plush', 'star-plush'].includes(id) ? 'memory' : id === 'feather-wand' ? 'sequence' : 'chase';

export const cityActivities = [
  { id: 'bakery', name: 'La panadería', icon: 'baguette' as const, welcome: 'Ayudá a preparar la merienda.', tasks: [
    { answer: 'bread', phrase: 'Bread, please!', translation: '¡Pan, por favor!', options: ['bread', 'book', 'ball'] },
    { answer: 'milk', phrase: 'Milk, please!', translation: '¡Leche, por favor!', options: ['water', 'milk', 'apple'] },
    { answer: 'apple', phrase: 'An apple, please!', translation: '¡Una manzana, por favor!', options: ['banana', 'fish', 'apple'] },
  ] },
  { id: 'park', name: 'El parque', icon: 'tree' as const, welcome: 'Encontrá los tesoros del parque.', tasks: [
    { answer: 'tree', phrase: 'Find the tree.', translation: 'Encontrá el árbol.', options: ['flower', 'tree', 'house'] },
    { answer: 'bird', phrase: 'Find the bird.', translation: 'Encontrá el pájaro.', options: ['bird', 'cat', 'dog'] },
    { answer: 'flower', phrase: 'Find the flower.', translation: 'Encontrá la flor.', options: ['sun', 'flower', 'moon'] },
  ] },
  { id: 'library', name: 'La biblioteca', icon: 'book-open-page-variant' as const, welcome: 'Ayudá a ordenar el rincón de lectura.', tasks: [
    { answer: 'book', phrase: 'A book, please!', translation: '¡Un libro, por favor!', options: ['book', 'boat', 'ball'] },
    { answer: 'chair', phrase: 'Find the chair.', translation: 'Encontrá la silla.', options: ['bed', 'door', 'chair'] },
    { answer: 'lamp', phrase: 'Find the lamp.', translation: 'Encontrá la lámpara.', options: ['table', 'lamp', 'star'] },
  ] },
];

export const emptyLearning = (): LearningProgress => ({ words: {}, counts: {}, cityCompleted: [], toyBest: {} });
export const countActivity = (learning: LearningProgress, kind: ActivityKind): LearningProgress => ({ ...learning, counts: { ...learning.counts, [kind]: (learning.counts[kind] || 0) + 1 } });
export const stickerUnlocked = (learning: LearningProgress, wordId: string) => (learning.words[wordId]?.correct || 0) >= 3;

function availableWords(unlockedLevel: number) {
  return new Set(levels.filter(level => level.id <= unlockedLevel).flatMap(level => level.rounds.flatMap(round => round.type === 'match-pair' ? round.pairIds : [round.answerId])));
}
export function reviewWordIds(progress: Pick<ProgressState, 'unlockedLevel' | 'learning'>, now = Date.now()) {
  const available = availableWords(progress.unlockedLevel);
  const priority = (id: string) => {
    const stat = progress.learning.words[id];
    if (!stat) return 4;
    const due = Math.min(10, Math.max(0, (now - stat.lastPracticed) / 86_400_000));
    return stat.errors * 4 / (stat.correct + 1) + due - Math.min(3, stat.correct);
  };
  return words.filter(word => available.has(word.id)).sort((a, b) => priority(b.id) - priority(a.id)).slice(0, 5).map(word => word.id);
}

export function reviewLevelFor(progress: Pick<ProgressState, 'unlockedLevel' | 'learning'>): Level {
  const available = [...availableWords(progress.unlockedLevel)];
  return { id: 0, title: 'Repaso a tu ritmo', theme: 'Palabras para practicar', description: '', icon: 'brain', reward: 10,
    rounds: reviewWordIds(progress).map((id, index) => ({ id: `review-${index}`, type: 'picture-choice', promptLanguage: index % 2 ? 'english' : 'spanish', answerId: id, optionIds: [id, ...available.filter(other => other !== id).slice(0, 3)] })),
  };
}

// Only known, finite values enter the save. Older saves receive empty defaults.
export function restoreLearning(value: unknown): LearningProgress {
  const result = emptyLearning();
  if (!value || typeof value !== 'object' || Array.isArray(value)) return result;
  const raw = value as Partial<LearningProgress>;
  const number = (v: unknown) => typeof v === 'number' && Number.isFinite(v) ? Math.max(0, Math.min(1_000_000_000, Math.floor(v))) : 0;
  for (const word of words) {
    const stat = raw.words?.[word.id];
    if (stat && typeof stat === 'object') result.words[word.id] = { correct: number(stat.correct), errors: number(stat.errors), lastPracticed: typeof stat.lastPracticed === 'number' && Number.isFinite(stat.lastPracticed) ? Math.max(0, Math.min(Date.now(), stat.lastPracticed)) : 0 };
  }
  for (const kind of ['answers', 'review', 'meal', 'wash', 'sleep', 'water', 'toy', 'city'] as const) result.counts[kind] = number(raw.counts?.[kind]);
  result.cityCompleted = cityActivities.filter(a => Array.isArray(raw.cityCompleted) && raw.cityCompleted.includes(a.id)).map(a => a.id);
  for (const id of ['yarn-ball', 'mouse-toy', 'fish-plush', 'bell-ball', 'feather-wand', 'star-plush']) if (number(raw.toyBest?.[id])) result.toyBest[id] = number(raw.toyBest?.[id]);
  return result;
}
