import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { levels, shopItems } from '../data/gameContent';
import { ProgressState } from '../types';

const STORAGE_KEY = 'petmaestro.progress.v1';
const DEV_INFINITE_COINS = true;
const DEV_COIN_BALANCE = 99999;

const initialProgress: ProgressState = {
  unlockedLevel: 1,
  coins: 0,
  ownedItems: [],
  equippedItemId: null,
  equippedCatItems: {},
  placedFurnitureIds: [],
  furniturePositions: {},
  completedLevels: [],
};

type ProgressContextValue = {
  progress: ProgressState;
  isReady: boolean;
  completeLevel: (levelId: number, correctAnswers: number, totalRounds: number) => Promise<number>;
  buyItem: (itemId: string) => Promise<{ ok: boolean; reason?: string }>;
  equipItem: (itemId: string | null) => Promise<void>;
  toggleFurniture: (itemId: string) => Promise<void>;
  setFurniturePosition: (itemId: string, position: { x: number; y: number }) => Promise<void>;
  resetProgress: () => Promise<void>;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: PropsWithChildren) {
  const [progress, setProgress] = useState<ProgressState>(initialProgress);
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
          setProgress({ ...initialProgress, ...JSON.parse(raw) });
        }
      })
      .finally(() => setIsReady(true));
  }, []);

  const saveProgress = async (next: ProgressState) => {
    setProgress(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
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

    if (!item || item.target !== 'cat' || item.slot === 'furniture') {
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
    if (!progress.ownedItems.includes(itemId)) {
      return;
    }

    const placedFurnitureIds = progress.placedFurnitureIds.includes(itemId)
      ? progress.placedFurnitureIds.filter((id) => id !== itemId)
      : [...progress.placedFurnitureIds, itemId];

    await saveProgress({ ...progress, placedFurnitureIds });
  };

  const setFurniturePosition = async (itemId: string, position: { x: number; y: number }) => {
    await saveProgress({
      ...progress,
      furniturePositions: {
        ...progress.furniturePositions,
        [itemId]: position,
      },
    });
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
      setFurniturePosition,
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
