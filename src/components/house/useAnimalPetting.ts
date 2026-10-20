import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AnimalAffection, PETTING_DURATION_MS } from '../../data/animalPetting';
import { useGameAudio } from '../../context/AudioContext';
import { WalkingPetCatHandle } from '../PetCat';
import { useFarmAnimationControls } from '../FarmAnimationClock';
import { useProgress } from '../../context/ProgressContext';

type Session = AnimalAffection & { animalId: string; serial: number };
export function useAnimalPetting(cat: React.RefObject<WalkingPetCatHandle | null>, placedIds: string, geometry: string) {
  const [session, setSession] = useState<Session | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const serial = useRef(0);
  const { getTime } = useFarmAnimationControls();
  const { playSound } = useGameAudio();
  const { rewardAction } = useProgress();
  const reward = useRef(rewardAction); reward.current = rewardAction;
  const cancel = useCallback(() => {
    serial.current += 1;
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    cat.current?.stop();
    setSession(null);
  }, [cat]);
  useFocusEffect(useCallback(() => () => cancel(), [cancel]));
  useEffect(() => { const subscription = AppState.addEventListener('change', state => { if (state !== 'active') cancel(); }); return () => subscription.remove(); }, [cancel]);
  useEffect(() => { cancel(); }, [cancel, geometry]);
  useEffect(() => { if (session && !placedIds.split('|').includes(session.animalId)) cancel(); }, [cancel, placedIds, session]);
  const start = (animalId: string, target: { x: number; y: number; facing: 'left' | 'right' }) => {
    cancel();
    const token = serial.current;
    if (!cat.current) return;
    playSound('tap');
    setSession({ animalId, phase: 'approaching', startedAt: getTime(), serial: token });
    cat.current.walkTo(target.x + 115, target.y + 142, {
      minY: 0, facing: target.facing, maxDurationMs: 2600,
      onArrive: () => {
        if (serial.current !== token) return;
        setSession({ animalId, phase: 'petting', startedAt: getTime(), serial: token });
        playSound('equip');
        timer.current = setTimeout(() => {
          if (serial.current === token) { timer.current = null; setSession(null); void reward.current('pet', animalId); }
        }, PETTING_DURATION_MS);
      },
    });
  };
  return { session, start, cancel };
}
