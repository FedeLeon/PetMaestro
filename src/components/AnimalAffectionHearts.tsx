import { View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';
import { useFarmAnimationClock } from './FarmAnimationClock';
import { pettingStroke } from '../data/animalPetting';
import { styles } from '../styles/components/blinkingFarmAnimal.styles';

// Screen-sized feedback stays readable even for the tiny duck and rabbit.
export function AnimalAffectionHearts({ animalId, startedAt, left, top }: { animalId: string; startedAt: number; left: number; top: number }) {
  const { time, reducedMotion } = useFarmAnimationClock();
  const reaction = pettingStroke(animalId, time - startedAt, reducedMotion);
  return <View pointerEvents="none" testID={`animal-affection-${animalId}`} style={[styles.hearts, { left, top, opacity: reaction?.affection ?? 1 }]}>
    <Svg width={112} height={58} viewBox="0 0 112 58">
      {[0, 1, 2].map(index => <G key={index} transform={`translate(${20 + index * 36} ${index === 1 ? 7 : 16}) translate(0 ${reducedMotion ? 0 : -Math.sin((time - startedAt) * 3 + index) * 4}) scale(${index === 1 ? 1.25 : 1})`}>
        <Path d="M0 7C-8-3-19 3-13 14L0 27L13 14C19 3 8-3 0 7Z" fill="#ee527c" stroke="#fff8ee" strokeWidth={2.5} strokeLinejoin="round" />
        <Path d="M-9 7Q-10 4-6 4" fill="none" stroke="#ffc6d6" strokeWidth={2} strokeLinecap="round" />
      </G>)}
    </Svg>
  </View>;
}
