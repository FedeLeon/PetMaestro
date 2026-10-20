import { useEffect, useState } from 'react';
import { useGameAudio } from '../../context/AudioContext';

export type HouseLampId = 'fish-lamp' | 'floor-lamp';
export function useHouseLamps(fishPlaced: boolean, floorPlaced: boolean) {
  const [lit, setLit] = useState<Record<HouseLampId, boolean>>({ 'fish-lamp': false, 'floor-lamp': false });
  const { playSound } = useGameAudio();
  useEffect(() => {
    setLit(previous => {
      if ((!fishPlaced && previous['fish-lamp']) || (!floorPlaced && previous['floor-lamp'])) {
        return { 'fish-lamp': fishPlaced && previous['fish-lamp'], 'floor-lamp': floorPlaced && previous['floor-lamp'] };
      }
      return previous;
    });
  }, [fishPlaced, floorPlaced]);
  const toggle = (id: HouseLampId) => {
    if (!(id === 'fish-lamp' ? fishPlaced : floorPlaced)) return;
    setLit(previous => ({ ...previous, [id]: !previous[id] }));
    playSound('tap');
  };
  return { lit, toggle };
}
