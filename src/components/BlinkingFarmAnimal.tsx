import { memo, useId, useRef } from 'react';
import { ImageSourcePropType, ImageStyle, StyleProp, View } from 'react-native';
import Svg, { ClipPath, Defs, G, Image as SvgImage, Mask, Path, Rect } from 'react-native-svg';
import { farmAnimalMotion } from '../data/farmAnimalMotion';
import { farmAnimalRigs } from '../styles/components/farmAnimalRig.layout';
import { styles } from '../styles/components/blinkingFarmAnimal.styles';
import { useFarmAnimationClock } from './FarmAnimationClock';
import { AnimalAffection, pettingStroke } from '../data/animalPetting';

type Props = { animalId: string; frames: ImageSourcePropType[]; style?: StyleProp<ImageStyle>; affection?: AnimalAffection };
const Skin = memo(function Skin({ source }: { source: ImageSourcePropType }) {
  return <SvgImage href={source} width={1000} height={1000} preserveAspectRatio="none" />;
});

export function BlinkingFarmAnimal({ animalId, frames, style, affection }: Props) {
  const { time, reducedMotion } = useFarmAnimationClock();
  const pose = farmAnimalMotion(animalId, time, reducedMotion);
  const previous = useRef({ active: false, endedAt: -1 });
  if (affection) previous.current.active = true;
  else if (previous.current.active) previous.current = { active: false, endedAt: time };
  const settle = affection ? (affection.phase === 'petting' ? 0 : Math.max(0, 1 - (time - affection.startedAt) / .3)) : Math.min(1, Math.max(0, (time - previous.current.endedAt) / .35));
  pose.x *= settle; pose.lift *= settle; pose.stride *= settle; pose.roll *= settle;
  const reaction = affection?.phase === 'petting' ? pettingStroke(animalId, time - affection.startedAt, reducedMotion) : undefined;
  if (reaction) {
    pose.blink = Math.max(pose.blink, reaction.affection * .85);
    if (!reducedMotion) {
      const delight = Math.sin((time - affection!.startedAt) * 5) * reaction.affection;
      pose.ear = delight * (reaction.reaction === 'ears' ? 5 : 2);
      pose.tail = delight * 5;
      pose.fur = delight * (reaction.reaction === 'wool' ? 2.5 : 1);
    }
  }
  const rig = farmAnimalRigs[animalId];
  const prefix = `farm${useId().replace(/\W/g, '')}`;
  if (!rig || !frames.length) return null;
  return <View pointerEvents="none" style={[styles.image, style]}>
    <Svg testID={`farm-rig-${animalId}`} width="100%" height="100%" viewBox="0 0 1000 1000">
      <Defs>
        <Mask id={`${prefix}body`} x={0} y={0} width={1000} height={1000} maskUnits="userSpaceOnUse">
          <Rect width={1000} height={1000} fill="white" />
          {rig.parts.map((part, index) => <Path key={index} d={part.cut} fill="black" />)}
        </Mask>
        <ClipPath id={`${prefix}eyes`}><Path d={rig.eyes} /></ClipPath>
        {rig.parts.map((part, index) => <ClipPath key={index} id={`${prefix}part${index}`}><Path d={part.clip} /></ClipPath>)}
      </Defs>
      <G testID={`farm-motion-${animalId}`} transform={`translate(${pose.x} ${-pose.lift}) translate(500 ${rig.floor}) rotate(${pose.roll}) scale(.9 ${.9 * pose.breath}) translate(-500 ${-rig.floor})`}>
        {rig.parts.map((part, index) => {
          const angle = part.kind === 'leg' ? pose.stride * part.phase * 2.2 : part.kind === 'ear' ? pose.ear * part.phase
            : part.kind === 'tail' ? pose.tail * .65 : part.kind === 'wing' ? pose.ear * .5 + pose.stride : pose.fur;
          const lift = part.kind === 'leg' ? Math.max(0, pose.stride * part.phase) * -12 : 0;
          return <G key={index} testID={`farm-part-${animalId}-${part.kind}-${index}`} transform={`translate(0 ${lift}) rotate(${angle} ${part.pivot[0]} ${part.pivot[1]})`}>
            <G clipPath={`url(#${prefix}part${index})`}><Skin source={frames[0]} /></G>
          </G>;
        })}
        <G mask={`url(#${prefix}body)`}><Skin source={frames[0]} /></G>
        <G testID={`farm-blink-${animalId}`} clipPath={`url(#${prefix}eyes)`} opacity={pose.blink}><Skin source={frames[1] ?? frames[0]} /></G>
      </G>
    </Svg>
  </View>;
}
