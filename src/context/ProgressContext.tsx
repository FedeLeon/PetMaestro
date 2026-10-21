import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { levels, shopItems } from '../data/gameContent';
import { kitchenFoods, mealNutrition } from '../data/kitchenContent';
import { flowerWait, gardenFlowers } from '../data/gardenContent';
import { PetNeeds, ProgressState } from '../types';
import { AppState } from 'react-native';
import { useGameAudio } from './AudioContext';
import { cityActivities, countActivity, emptyLearning, restoreLearning } from '../data/adventureContent';
import { words } from '../data/gameContent';
import { actionRewards, type ActionReward, type DirectActionReward } from '../data/actionRewards';
import { CoinRewardNotice } from '../components/CoinRewardNotice';
import { restoreStoryQuizResults, storyReadingContent, storyQuizReward } from '../data/storyReadingContent';
import type { StoryId } from '../data/audiobooks';
import { isStoryUnlocked } from '../data/libraryProgression';

const STORAGE_KEY = 'petmaestro.progress.v1';
// Temporary test mode: purchases keep the real saved balance untouched.
const DEV_INFINITE_COINS = true;
const DEV_COIN_BALANCE = 99999;
const NEEDS_TICK_MS = 60_000;
const NEEDS_DECAY_PER_MINUTE = .2;
const MAX_OFFLINE_DECAY = 35;

const initialNeeds: PetNeeds = {
  hunger: 100,
  hygiene: 100,
  bathroom: 100,
  play: 100,
  energy: 100,
};

const initialProgress: ProgressState = {
  storyQuizResults: {},
  learning: emptyLearning(),
  unlockedLevel: 1,
  coins: 0,
  ownedItems: [],
  unlockedFoodIds: [],
  equippedItemId: null,
  equippedCatItems: {},
  placedFurnitureIds: [],
  placedAnimalIds: [],
  flowerWateredAt: {},
  completedLevels: [],
  drawingStrokes: [],
  needs: initialNeeds,
  needsUpdatedAt: Date.now(),
};

type ProgressContextValue = {
  progress: ProgressState;
  isReady: boolean;
  saveError: boolean;
  retrySave: () => Promise<void>;
  completeLevel: (levelId: number, correctAnswers: number, totalRounds: number) => Promise<number>;
  buyItem: (itemId: string) => Promise<{ ok: boolean; reason?: string }>;
  buyFood: (foodId: string) => Promise<{ ok: boolean; reason?: string }>;
  feedMeal: (foodIds: string[]) => Promise<void>;
  equipItem: (itemId: string | null) => Promise<void>;
  toggleFurniture: (itemId: string) => Promise<void>;
  toggleAnimal: (itemId: string) => Promise<void>;
  improveHygiene: (amount: number) => Promise<void>;
  improveBathroom: (amount: number, hygieneAmount?: number) => Promise<void>;
  completeSleep: () => Promise<void>;
  waterFlower: (id: string) => Promise<boolean>;
  saveDrawing: (strokes: ProgressState['drawingStrokes']) => Promise<void>;
  resetProgress: () => Promise<void>;
  recordAnswer: (wordId: string, correct: boolean) => Promise<void>;
  completeReview: () => Promise<number>;
  completeToy: (toyId: string, score: number) => Promise<number>;
  completeCity: (activityId: string) => Promise<number>;
  rewardAction: (kind: DirectActionReward, targetId?: string) => Promise<number>;
  completeStoryQuiz: (storyId: string, answers: string[], attemptId: string) => Promise<{ coins: number; score: number } | null>;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

function decreaseNeeds(needs: PetNeeds, amount: number): PetNeeds {
  return {
    hunger: Math.max(0, needs.hunger - amount),
    hygiene: Math.max(0, needs.hygiene - amount),
    bathroom: Math.max(0, needs.bathroom - amount),
    play: Math.max(0, needs.play - amount),
    energy: Math.max(0, needs.energy - amount),
  };
}

function finite(value: unknown, fallback: number, min = 0, max = Number.MAX_SAFE_INTEGER) {
  return typeof value === 'number' && Number.isFinite(value) ? Math.max(min, Math.min(max, value)) : fallback;
}

function restoreProgress(raw: string): ProgressState {
  const parsed = JSON.parse(raw) as Partial<ProgressState> | null;
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Invalid progress');
  const ids = (value: unknown, allowed: string[]) => Array.isArray(value) ? [...new Set(value.filter((id): id is string => typeof id === 'string' && allowed.includes(id)))] : [];
  const ownedItems = ids(parsed.ownedItems, shopItems.map(item => item.id));
  const completedLevels = Array.isArray(parsed.completedLevels) ? [...new Set(parsed.completedLevels.filter(id => Number.isInteger(id) && levels.some(level => level.id === id)))] : [];
  const needs = { ...initialNeeds };
  for (const key of Object.keys(needs) as (keyof PetNeeds)[]) needs[key] = finite(parsed.needs?.[key], 100, 0, 100);
  const elapsed = Math.max(0, Math.floor((Date.now() - finite(parsed.needsUpdatedAt, Date.now(), 0, Date.now())) / NEEDS_TICK_MS));
  const equippedCatItems: ProgressState['equippedCatItems'] = {};
  for (const item of shopItems) {
    if (item.target === 'cat' && item.slot !== 'furniture' && item.slot !== 'animal' && ownedItems.includes(item.id) &&
        (parsed.equippedCatItems?.[item.slot] === item.id || parsed.equippedItemId === item.id)) equippedCatItems[item.slot] = item.id;
  }
  const drawingStrokes = Array.isArray(parsed.drawingStrokes) ? parsed.drawingStrokes.filter(stroke =>
    stroke && typeof stroke.color === 'string' && /^#[0-9a-f]{6}$/i.test(stroke.color) &&
    typeof stroke.width === 'number' && Number.isFinite(stroke.width) && stroke.width > 0 && stroke.width <= 100 &&
    Array.isArray(stroke.points) && stroke.points.length > 0 && stroke.points.every(point => point && Number.isFinite(point.x) && Number.isFinite(point.y)),
  ) : [];
  return {
    ...initialProgress,
    learning: restoreLearning(parsed.learning),
    storyQuizResults: restoreStoryQuizResults(parsed.storyQuizResults),
    coins: Math.floor(finite(parsed.coins, 0)),
    unlockedLevel: Math.floor(finite(parsed.unlockedLevel, Math.min(levels.length, Math.max(0, ...completedLevels) + 1), 1, levels.length)),
    completedLevels,
    ownedItems,
    unlockedFoodIds: ids(parsed.unlockedFoodIds, kitchenFoods.map(food => food.id)),
    equippedCatItems,
    equippedItemId: ownedItems.includes(parsed.equippedItemId ?? '') ? parsed.equippedItemId! : null,
    placedFurnitureIds: ids(parsed.placedFurnitureIds, shopItems.filter(item => item.target === 'house' && ownedItems.includes(item.id)).map(item => item.id)),
    placedAnimalIds: ids(parsed.placedAnimalIds, shopItems.filter(item => item.target === 'yard' && ownedItems.includes(item.id)).map(item => item.id)),
    flowerWateredAt: Object.fromEntries(gardenFlowers.flatMap(flower => {
      const timestamp = parsed.flowerWateredAt?.[flower.id];
      return typeof timestamp === 'number' && Number.isFinite(timestamp) && timestamp >= 0 ? [[flower.id, Math.min(Date.now(), timestamp)]] : [];
    })),
    drawingStrokes,
    needs: decreaseNeeds(needs, Math.min(MAX_OFFLINE_DECAY, elapsed * NEEDS_DECAY_PER_MINUTE)),
    needsUpdatedAt: Date.now(),
  };
}

export function ProgressProvider({ children }: PropsWithChildren) {
  const { playSound } = useGameAudio();
  const [progress, setProgress] = useState<ProgressState>(initialProgress);
  const progressRef = useRef(initialProgress);
  const [isReady, setIsReady] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const writeQueue = useRef(Promise.resolve());
  const storageLoaded = useRef(false);
  const rewardSerial = useRef(0);
  const [rewardNotice, setRewardNotice] = useState<{ serial: number; amount: number; label: string } | null>(null);
  const notifyReward = (kind: ActionReward, amount = actionRewards[kind].coins as number) => {
    setRewardNotice({ serial: ++rewardSerial.current, amount, label: actionRewards[kind].label });
  };
  const visibleProgress = useMemo(
    () => ({
      ...progress,
      coins: DEV_INFINITE_COINS ? DEV_COIN_BALANCE : progress.coins,
    }),
    [progress],
  );

  const loadProgress = async () => {
    await AsyncStorage.getItem(STORAGE_KEY)
      .then(async (raw) => {
        if (raw) {
          let storedProgress: ProgressState;
          try { storedProgress = restoreProgress(raw); }
          catch {
            // Keep the original save before allowing new progress to replace it.
            await AsyncStorage.setItem(`${STORAGE_KEY}.recovery`, raw);
            storedProgress = { ...initialProgress, needsUpdatedAt: Date.now() };
          }
          progressRef.current = storedProgress;
          setProgress(storedProgress);
        }
        storageLoaded.current = true;
        setSaveError(false);
      })
      .catch(() => setSaveError(true))
      .finally(() => setIsReady(true));
  };

  useEffect(() => { void loadProgress(); }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const tick = () => {
      const current = progressRef.current;
      const minutes = Math.max(0, Math.floor((Date.now() - current.needsUpdatedAt) / NEEDS_TICK_MS));
      if (!minutes) return;
      void saveProgress({
        ...current,
        needs: decreaseNeeds(current.needs, Math.min(MAX_OFFLINE_DECAY, minutes * NEEDS_DECAY_PER_MINUTE)),
        needsUpdatedAt: Date.now(),
      });
    };
    const intervalId = setInterval(tick, NEEDS_TICK_MS);
    const subscription = AppState.addEventListener('change', state => { if (state === 'active') tick(); });

    return () => { clearInterval(intervalId); subscription.remove(); };
  }, [isReady]);

  const saveProgress = async (next: ProgressState) => {
    progressRef.current = next;
    setProgress(next);
    if (!storageLoaded.current) { setSaveError(true); return; }
    const snapshot = JSON.stringify(next);
    writeQueue.current = writeQueue.current.catch(() => {}).then(async () => {
      try { await AsyncStorage.setItem(STORAGE_KEY, snapshot); setSaveError(false); }
      catch { setSaveError(true); }
    });
    await writeQueue.current;
  };

  const updateProgress = async (updater: (current: ProgressState) => ProgressState) => {
    const next = updater(progressRef.current);
    await saveProgress(next);
  };

  const completeLevel = async (levelId: number, correctAnswers: number, totalRounds: number) => {
    const level = levels.find((item) => item.id === levelId);
    const current = progressRef.current;
    if (!isReady || !level || levelId > current.unlockedLevel || totalRounds !== level.rounds.length || !Number.isInteger(correctAnswers) || correctAnswers < 0 || correctAnswers > totalRounds) return 0;
    const baseReward = level.reward;
    const perfectBonus = correctAnswers === totalRounds ? 8 : 0;
    const earnedCoins = Math.max(5, Math.round((baseReward * correctAnswers) / totalRounds) + perfectBonus);
    const nextUnlockedLevel = Math.min(levels.length, Math.max(current.unlockedLevel, levelId + 1));
    const completedLevels = current.completedLevels.includes(levelId)
      ? current.completedLevels
      : [...current.completedLevels, levelId];

    await saveProgress({
      ...current,
      coins: current.coins + earnedCoins,
      completedLevels,
      unlockedLevel: nextUnlockedLevel,
      needs: { ...current.needs, play: Math.min(100, current.needs.play + 25) },
    });
    playSound('complete');

    return earnedCoins;
  };

  const buyItem = async (itemId: string) => {
    const item = shopItems.find((entry) => entry.id === itemId);
    const current = progressRef.current;

    if (!item || !isReady) {
      return { ok: false, reason: 'Item no encontrado.' };
    }

    if (current.ownedItems.includes(itemId)) {
      return { ok: false, reason: 'Ya lo compraste.' };
    }

    if (!DEV_INFINITE_COINS && current.coins < item.price) {
      return { ok: false, reason: 'Necesitas mas moneditas.' };
    }

    const nextOwnedItems = [...current.ownedItems, itemId];
    const nextProgress: ProgressState = {
      ...current,
      coins: DEV_INFINITE_COINS ? current.coins : current.coins - item.price,
      ownedItems: nextOwnedItems,
    };

    await saveProgress(nextProgress);
    playSound('purchase');

    return { ok: true };
  };

  // Read the current ref so rapid taps cannot charge twice or overwrite an unlock.
  const buyFood = async (foodId: string) => {
    const food = kitchenFoods.find(item => item.id === foodId);
    const current = progressRef.current;
    if (!food || !isReady) return { ok: false, reason: 'Esperá un momento.' };
    if (current.unlockedFoodIds.includes(foodId)) return { ok: true };
    if (!DEV_INFINITE_COINS && current.coins < food.price) return { ok: false, reason: 'Te faltan moneditas. ¡Ganás jugando!' };
    await saveProgress({ ...current, coins: DEV_INFINITE_COINS ? current.coins : current.coins - food.price, unlockedFoodIds: [...current.unlockedFoodIds, foodId] });
    playSound('purchase');
    return { ok: true };
  };

  const feedMeal = async (foodIds: string[]) => {
    if (!foodIds.some(id => progressRef.current.unlockedFoodIds.includes(id))) return;
    await updateProgress(current => ({
      ...current,
      coins: current.coins + actionRewards.feed.coins,
      learning: countActivity(current.learning, 'meal'),
      needs: { ...current.needs, hunger: Math.min(100, current.needs.hunger + mealNutrition(foodIds.filter(id => current.unlockedFoodIds.includes(id)))) },
      needsUpdatedAt: Date.now(),
    }));
    playSound('eat');
    notifyReward('feed');
  };

  const equipItem = async (itemId: string | null) => {
    const current = progressRef.current;
    if (!itemId) {
      await saveProgress({ ...current, equippedItemId: null, equippedCatItems: {} });
      return;
    }

    if (!current.ownedItems.includes(itemId)) {
      return;
    }

    const item = shopItems.find((entry) => entry.id === itemId);

    if (!item || item.target !== 'cat' || item.slot === 'furniture' || item.slot === 'animal') {
      return;
    }

    const currentInSlot = current.equippedCatItems[item.slot];
    const equippedCatItems = {
      ...current.equippedCatItems,
      [item.slot]: currentInSlot === itemId ? null : itemId,
    };

    await saveProgress({
      ...current,
      equippedCatItems,
      equippedItemId: currentInSlot === itemId ? null : itemId,
    });
    playSound('equip');
  };

  const toggleFurniture = async (itemId: string) => {
    await updateProgress((current) => {
      if (!current.ownedItems.includes(itemId)) {
        return current;
      }

      const placedFurnitureIds = current.placedFurnitureIds.includes(itemId)
        ? current.placedFurnitureIds.filter((id) => id !== itemId)
        : [...current.placedFurnitureIds, itemId];

      return { ...current, placedFurnitureIds };
    });
    playSound('equip');
  };

  const toggleAnimal = async (itemId: string) => {
    await updateProgress((current) => {
      if (!current.ownedItems.includes(itemId)) {
        return current;
      }

      const placedAnimalIds = current.placedAnimalIds.includes(itemId)
        ? current.placedAnimalIds.filter((id) => id !== itemId)
        : [...current.placedAnimalIds, itemId];

      return { ...current, placedAnimalIds };
    });
    playSound('equip');
  };

  const improveHygiene = async (amount: number) => {
    if (!Number.isFinite(amount) || amount <= 0) return;
    const kind = amount >= 40 ? 'wash' : 'teeth';
    await updateProgress((current) => ({
      ...current,
      coins: current.coins + actionRewards[kind].coins,
      learning: amount >= 10 ? countActivity(current.learning, 'wash') : current.learning,
      needs: { ...current.needs, hygiene: Math.min(100, current.needs.hygiene + Math.max(0, amount)) },
      needsUpdatedAt: Date.now(),
    }));
    playSound('correct');
    notifyReward(kind);
  };

  const improveBathroom = async (amount: number, hygieneAmount = 0) => {
    if (!Number.isFinite(amount) || amount <= 0 || !Number.isFinite(hygieneAmount)) return;
    await updateProgress((current) => ({
      ...current,
      coins: current.coins + actionRewards.toilet.coins,
      learning: hygieneAmount >= 10 ? countActivity(current.learning, 'wash') : current.learning,
      needs: { ...current.needs, bathroom: Math.min(100, current.needs.bathroom + Math.max(0, amount)), hygiene: Math.min(100, current.needs.hygiene + Math.max(0, hygieneAmount)) },
      needsUpdatedAt: Date.now(),
    }));
    playSound('correct');
    notifyReward('toilet');
  };

  const completeSleep = async () => {
    await updateProgress(current => ({
      ...current,
      coins: current.coins + actionRewards.sleep.coins,
      learning: countActivity(current.learning, 'sleep'),
      needs: { ...current.needs, energy: 100 },
      needsUpdatedAt: Date.now(),
    }));
    playSound('sleep');
    notifyReward('sleep');
  };

  const waterFlower = async (id: string) => {
    const current = progressRef.current;
    const now = Date.now();
    if (!isReady || !gardenFlowers.some(flower => flower.id === id) || !current.ownedItems.includes(id) || flowerWait(current.flowerWateredAt[id], now) > 0) return false;
    await saveProgress({
      ...current,
      flowerWateredAt: { ...current.flowerWateredAt, [id]: now },
      coins: current.coins + actionRewards.water.coins,
      learning: countActivity(current.learning, 'water'),
      needs: { ...current.needs, play: Math.min(100, current.needs.play + 5) },
      needsUpdatedAt: now,
    });
    playSound('water');
    notifyReward('water');
    return true;
  };

  const saveDrawing = async (strokes: ProgressState['drawingStrokes']) => {
    await updateProgress((current) => ({ ...current, drawingStrokes: strokes }));
  };

  const resetProgress = async () => {
    await saveProgress({ ...initialProgress, needsUpdatedAt: Date.now() });
  };

  const recordAnswer = async (wordId: string, correct: boolean) => {
    if (!words.some(word => word.id === wordId)) return;
    await updateProgress(current => {
      const previous = current.learning.words[wordId] || { correct: 0, errors: 0, lastPracticed: 0 };
      const learning = correct ? countActivity(current.learning, 'answers') : current.learning;
      return { ...current, learning: { ...learning, words: { ...learning.words, [wordId]: { correct: previous.correct + (correct ? 1 : 0), errors: previous.errors + (correct ? 0 : 1), lastPracticed: Date.now() } } } };
    });
  };
  const completeReview = async () => {
    await updateProgress(current => ({ ...current, learning: countActivity(current.learning, 'review'), coins: current.coins + 10, needs: { ...current.needs, play: Math.min(100, current.needs.play + 15) } }));
    playSound('complete');
    return 10;
  };
  const completeToy = async (toyId: string, score: number) => {
    const current = progressRef.current;
    if (!current.ownedItems.includes(toyId) || !shopItems.some(item => item.id === toyId && item.category === 'cat-toys') || !Number.isFinite(score) || score < 1) return 0;
    const reward = actionRewards.toy.coins;
    const learning = countActivity(current.learning, 'toy');
    await saveProgress({ ...current, coins: current.coins + reward, learning: { ...learning, toyBest: { ...learning.toyBest, [toyId]: Math.max(current.learning.toyBest[toyId] || 0, score) } }, needs: { ...current.needs, play: Math.min(100, current.needs.play + 25) } });
    playSound('complete');
    notifyReward('toy', reward);
    return reward;
  };
  const completeCity = async (activityId: string) => {
    const current = progressRef.current;
    if (!current.completedLevels.includes(11) || !cityActivities.some(activity => activity.id === activityId)) return 0;
    const first = !current.learning.cityCompleted.includes(activityId);
    const learning = countActivity(current.learning, 'city');
    const reward = first ? 15 : actionRewards.city.coins;
    await saveProgress({ ...current, coins: current.coins + reward, learning: { ...learning, cityCompleted: first ? [...learning.cityCompleted, activityId] : learning.cityCompleted } });
    playSound('complete');
    notifyReward('city', reward);
    return reward;
  };
  const rewardAction = async (kind: DirectActionReward, targetId?: string) => {
    if (!isReady || !storageLoaded.current || !['cook', 'pet', 'rest', 'television', 'drawing', 'story', 'jump'].includes(kind)) return 0;
    const current = progressRef.current;
    if (kind === 'story' && (!targetId || !isStoryUnlocked(targetId, current.storyQuizResults))) return 0;
    if (kind === 'pet' && (!targetId || !current.placedAnimalIds.includes(targetId) || !current.ownedItems.includes(targetId))) return 0;
    if (kind === 'jump' && !current.ownedItems.includes('bell-ball')) return 0;
    if (kind === 'rest' && !current.placedFurnitureIds.includes('soft-bed')) return 0;
    if (kind === 'television' && !current.placedFurnitureIds.includes('tv-cabinet')) return 0;
    const reward = actionRewards[kind].coins;
    await saveProgress({ ...current, coins: current.coins + reward });
    if (kind !== 'jump') notifyReward(kind, reward);
    if (kind === 'jump') playSound('purchase');
    return reward;
  };
  const completeStoryQuiz = async (storyId: string, answers: string[], attemptId: string) => {
    if (!isReady || !storageLoaded.current || !Object.hasOwn(storyReadingContent, storyId) || !/^[a-z0-9-]{1,160}$/.test(attemptId)) return null;
    if (!isStoryUnlocked(storyId, progressRef.current.storyQuizResults)) return null;
    const questions = storyReadingContent[storyId as StoryId].questions;
    if (answers.length !== 5 || questions.some((question, index) => !question.options.some(option => option.id === answers[index]))) return null;
    const current = progressRef.current;
    const previous = current.storyQuizResults[storyId];
    const score = questions.filter((question, index) => question.answerId === answers[index]).length;
    if (previous?.lastAttemptId === attemptId) return { coins: 0, score };
    const coins = storyQuizReward(score);
    await saveProgress({ ...current, coins: current.coins + coins, storyQuizResults: { ...current.storyQuizResults, [storyId]: { best: Math.max(previous?.best || 0, score), completed: (previous?.completed || 0) + 1, lastAttemptId: attemptId } } });
    notifyReward('storyQuiz', coins); playSound('complete');
    return { coins, score };
  };
  const value = useMemo(
    () => ({
      progress: visibleProgress,
      isReady,
      saveError,
      retrySave: () => storageLoaded.current ? saveProgress(progressRef.current) : loadProgress(),
      completeLevel,
      buyItem,
      buyFood,
      feedMeal,
      equipItem,
      toggleFurniture,
      toggleAnimal,
      improveHygiene,
      improveBathroom,
      completeSleep,
      waterFlower,
      saveDrawing,
      resetProgress,
      recordAnswer,
      completeReview,
      completeToy,
      completeCity,
      rewardAction,
      completeStoryQuiz,
    }),
    [visibleProgress, isReady, saveError, playSound],
  );

  return <ProgressContext.Provider value={value}>{children}{rewardNotice && <CoinRewardNotice key={rewardNotice.serial} amount={rewardNotice.amount} label={rewardNotice.label} />}</ProgressContext.Provider>;
}

export function useProgress() {
  const context = useContext(ProgressContext);

  if (!context) {
    throw new Error('useProgress must be used inside ProgressProvider');
  }

  return context;
}
