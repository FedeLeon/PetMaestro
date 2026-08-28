import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { levels, shopItems } from '../data/gameContent';
import { PetNeeds, ProgressState } from '../types';

const STORAGE_KEY = 'petmaestro.progress.v1';
const DEV_INFINITE_COINS = true;
const DEV_COIN_BALANCE = 99999;
const NEEDS_TICK_MS = 60_000;
const NEEDS_DECAY_PER_MINUTE = 1;

const initialNeeds: PetNeeds = {
  hunger: 100,
  hygiene: 100,
  bathroom: 100,
  play: 100,
  energy: 100,
};

const initialProgress: ProgressState = {
  unlockedLevel: 1,
  coins: 0,
  ownedItems: [],
  equippedItemId: null,
  equippedCatItems: {},
  placedFurnitureIds: [],
  placedAnimalIds: [],
  completedLevels: [],
  drawingStrokes: [],
  needs: initialNeeds,
  needsUpdatedAt: Date.now(),
};

type ProgressContextValue = {
  progress: ProgressState;
  isReady: boolean;
  completeLevel: (levelId: number, correctAnswers: number, totalRounds: number) => Promise<number>;
  buyItem: (itemId: string) => Promise<{ ok: boolean; reason?: string }>;
  equipItem: (itemId: string | null) => Promise<void>;
  toggleFurniture: (itemId: string) => Promise<void>;
  toggleAnimal: (itemId: string) => Promise<void>;
  saveDrawing: (strokes: ProgressState['drawingStrokes']) => Promise<void>;
  resetProgress: () => Promise<void>;
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

export function ProgressProvider({ children }: PropsWithChildren) {
  const [progress, setProgress] = useState<ProgressState>(initialProgress);
  const progressRef = useRef(initialProgress);
  const [isReady, setIsReady] = useState(false);
  const visibleProgress = useMemo(
    () => ({
      ...progress,
      coins: DEV_INFINITE_COINS ? DEV_COIN_BALANCE : progress.coins,
    }),
    [progress],
  );

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          const parsedProgress = JSON.parse(raw) as Partial<ProgressState>;
          const storedNeeds = { ...initialNeeds, ...(parsedProgress.needs ?? {}) };
          const lastUpdatedAt = parsedProgress.needsUpdatedAt ?? Date.now();
          const elapsedMinutes = Math.max(0, Math.floor((Date.now() - lastUpdatedAt) / NEEDS_TICK_MS));
          const storedProgress: ProgressState = {
            ...initialProgress,
            ...parsedProgress,
            needs: decreaseNeeds(storedNeeds, elapsedMinutes * NEEDS_DECAY_PER_MINUTE),
            needsUpdatedAt: Date.now(),
          };
          progressRef.current = storedProgress;
          setProgress(storedProgress);
        }
      })
      .finally(() => setIsReady(true));
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const intervalId = setInterval(() => {
      const current = progressRef.current;
      void saveProgress({
        ...current,
        needs: decreaseNeeds(current.needs, NEEDS_DECAY_PER_MINUTE),
        needsUpdatedAt: Date.now(),
      });
    }, NEEDS_TICK_MS);

    return () => clearInterval(intervalId);
  }, [isReady]);

  const saveProgress = async (next: ProgressState) => {
    progressRef.current = next;
    setProgress(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const updateProgress = async (updater: (current: ProgressState) => ProgressState) => {
    const next = updater(progressRef.current);
    await saveProgress(next);
  };

  const completeLevel = async (levelId: number, correctAnswers: number, totalRounds: number) => {
    const level = levels.find((item) => item.id === levelId);
    const baseReward = level?.reward ?? 10;
    const perfectBonus = correctAnswers === totalRounds ? 8 : 0;
    const earnedCoins = Math.max(5, Math.round((baseReward * correctAnswers) / totalRounds) + perfectBonus);
    const nextUnlockedLevel = Math.min(levels.length, Math.max(progress.unlockedLevel, levelId + 1));
    const completedLevels = progress.completedLevels.includes(levelId)
      ? progress.completedLevels
      : [...progress.completedLevels, levelId];

    await saveProgress({
      ...progress,
      coins: progress.coins + earnedCoins,
      completedLevels,
      unlockedLevel: nextUnlockedLevel,
    });

    return earnedCoins;
  };

  const buyItem = async (itemId: string) => {
    const item = shopItems.find((entry) => entry.id === itemId);

    if (!item) {
      return { ok: false, reason: 'Item no encontrado.' };
    }

    if (progress.ownedItems.includes(itemId)) {
      return { ok: false, reason: 'Ya lo compraste.' };
    }

    if (!DEV_INFINITE_COINS && progress.coins < item.price) {
      return { ok: false, reason: 'Necesitas mas moneditas.' };
    }

    const nextOwnedItems = [...progress.ownedItems, itemId];
    const nextProgress: ProgressState = {
      ...progress,
      coins: DEV_INFINITE_COINS ? progress.coins : progress.coins - item.price,
      ownedItems: nextOwnedItems,
    };

    await saveProgress(nextProgress);

    return { ok: true };
  };

  const equipItem = async (itemId: string | null) => {
    if (!itemId) {
      await saveProgress({ ...progress, equippedItemId: null, equippedCatItems: {} });
      return;
    }

    if (!progress.ownedItems.includes(itemId)) {
      return;
    }

    const item = shopItems.find((entry) => entry.id === itemId);

    if (!item || item.target !== 'cat' || item.slot === 'furniture' || item.slot === 'animal') {
      return;
    }

    const currentInSlot = progress.equippedCatItems[item.slot];
    const equippedCatItems = {
      ...progress.equippedCatItems,
      [item.slot]: currentInSlot === itemId ? null : itemId,
    };

    await saveProgress({
      ...progress,
      equippedCatItems,
      equippedItemId: currentInSlot === itemId ? null : itemId,
    });
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
  };

  const saveDrawing = async (strokes: ProgressState['drawingStrokes']) => {
    await updateProgress((current) => ({ ...current, drawingStrokes: strokes }));
  };

  const resetProgress = async () => {
    await saveProgress(initialProgress);
  };

  const value = useMemo(
    () => ({
      progress: visibleProgress,
      isReady,
      completeLevel,
      buyItem,
      equipItem,
      toggleFurniture,
      toggleAnimal,
      saveDrawing,
      resetProgress,
    }),
    [visibleProgress, isReady],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const context = useContext(ProgressContext);

  if (!context) {
    throw new Error('useProgress must be used inside ProgressProvider');
  }

  return context;
}
