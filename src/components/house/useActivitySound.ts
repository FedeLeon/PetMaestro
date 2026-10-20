import { useIsFocused } from '@react-navigation/native';
import { useEffect } from 'react';
import { useGameAudio } from '../../context/AudioContext';
import { gameSounds } from '../../data/gameAudio';

export function useActivitySound(active: boolean, sound: keyof typeof gameSounds) {
  const focused = useIsFocused();
  const { playSound } = useGameAudio();
  useEffect(() => {
    if (active && focused) playSound(sound);
  }, [active, focused, playSound, sound]);
}
