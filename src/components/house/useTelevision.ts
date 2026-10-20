import { useCallback, useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import type { WalkingPetCatHandle } from '../PetCat';
import { useCareActivity } from './useCareActivity';
import { useGameAudio } from '../../context/AudioContext';
import { useProgress } from '../../context/ProgressContext';

export function useTelevision(cat: RefObject<WalkingPetCatHandle | null>, placed: boolean, follow: () => void) {
  const [phase, setPhase] = useState<'idle' | 'approaching' | 'watching'>('idle');
  const [channel, setChannel] = useState(0);
  const phaseRef = useRef(phase);
  const generation = useRef(0);
  const { active, live } = useCareActivity();
  const { playSound } = useGameAudio();
  const { rewardAction } = useProgress();
  const reward = useRef(rewardAction); reward.current = rewardAction;
  const sound = useRef(playSound); sound.current = playSound;
  const stop = useCallback(() => {
    generation.current++;
    if (phaseRef.current !== 'idle') cat.current?.stop();
    phaseRef.current = 'idle';
    setPhase('idle');
  }, [cat]);
  useEffect(() => { if (!active || !placed) stop(); }, [active, placed, stop]);
  useEffect(() => () => { generation.current++; cat.current?.stop(); }, [cat]);
  useEffect(() => {
    if (phase !== 'watching') return;
    const channels = setInterval(() => { setChannel(value => (value + 1) % 3); sound.current('tap'); }, 2600);
    const end = setTimeout(() => { if (live.current && phaseRef.current === 'watching') { void reward.current('television'); stop(); } }, 8200);
    return () => { clearInterval(channels); clearTimeout(end); };
  }, [phase, stop, live]);
  const watch = () => {
    if (!placed || !live.current) return;
    if (phaseRef.current === 'watching') { setChannel(value => (value + 1) % 3); sound.current('tap'); return; }
    if (phaseRef.current === 'approaching' || !cat.current) return;
    const token = ++generation.current;
    phaseRef.current = 'approaching'; setPhase('approaching'); setChannel(0);
    sound.current('tap'); follow();
    cat.current.walkTo(440, 489, { facing: 'left', maxDurationMs: 2400, onArrive: () => {
      if (token !== generation.current || !live.current) return;
      phaseRef.current = 'watching'; setPhase('watching');
    } });
  };
  return { phase, channel, watch, stop };
}
