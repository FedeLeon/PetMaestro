import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import type { WalkingPetCatHandle } from '../PetCat';
import { interiorFurniture } from '../../data/houseInteriorLayout';
import { useGameAudio } from '../../context/AudioContext';
import { useCareActivity } from './useCareActivity';
import { useProgress } from '../../context/ProgressContext';

export function useSoftBedRest(cat: RefObject<WalkingPetCatHandle | null>, placed: boolean, follow: () => void) {
  const [phase, setPhase] = useState<'idle' | 'approaching' | 'resting'>('idle');
  const currentPhase = useRef(phase);
  const generation = useRef(0);
  const { active, live } = useCareActivity();
  const { playSound } = useGameAudio();
  const { rewardAction } = useProgress();
  const reward = useRef(rewardAction); reward.current = rewardAction;
  const sound = useRef(playSound); sound.current = playSound;
  const stop = useCallback(() => {
    generation.current++;
    if (currentPhase.current !== 'idle') cat.current?.stop();
    currentPhase.current = 'idle';
    setPhase('idle');
  }, [cat]);
  useEffect(() => { if (!active || !placed) stop(); }, [active, placed, stop]);
  useEffect(() => () => {
    generation.current++;
    if (currentPhase.current !== 'idle') cat.current?.stop();
  }, [cat]);
  useEffect(() => {
    if (phase !== 'resting') return;
    const timeout = setTimeout(() => { if (live.current && currentPhase.current === 'resting') { void reward.current('rest'); stop(); } }, 7000);
    return () => clearTimeout(timeout);
  }, [phase, stop, live]);
  const rest = () => {
    if (!placed || !live.current) return;
    if (currentPhase.current === 'resting') { stop(); return; }
    if (currentPhase.current === 'approaching' || !cat.current) return;
    const token = ++generation.current;
    currentPhase.current = 'approaching'; setPhase('approaching');
    sound.current('tap'); follow();
    cat.current.walkTo(interiorFurniture['soft-bed'].x, 489, { facing: 'right', maxDurationMs: 2800, onArrive: () => {
      if (generation.current !== token || !live.current) return;
      currentPhase.current = 'resting'; setPhase('resting'); sound.current('sleep');
    } });
  };
  return { phase, rest, stop };
}
