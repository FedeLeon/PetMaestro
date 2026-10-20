import { Image, View } from 'react-native';
import Svg, { Circle, Ellipse, G, Path, Rect, Text as SvgText } from 'react-native-svg';
import { petImages } from '../../data/assetImages';
import { useFarmAnimationClock } from '../FarmAnimationClock';
import { styles } from '../../styles/house/television.styles';

export function TelevisionPicture({ channel }: { channel: number }) {
  const { time, reducedMotion } = useFarmAnimationClock();
  const drift = reducedMotion ? 0 : Math.sin(time * 1.4) * 8;
  return <View pointerEvents="none" testID={`tv-channel-${channel}`} style={styles.screen}>
    <Svg width="100%" height="100%" viewBox="0 0 100 56" preserveAspectRatio="none">
      <Rect width={100} height={56} fill={['#88d8f3', '#41699c', '#edb8ed'][channel]} />
      {channel === 0 ? <>
        <Circle cx={81} cy={12} r={7} fill="#ffe27b" /><Path d="M0 45Q22 18 50 44Q78 19 100 39V56H0" fill="#8dcc75" />
        <G transform={`translate(${drift} 0)`}><Ellipse cx={45} cy={39} rx={14} ry={10} fill="#fff2cd" /><Circle cx={58} cy={29} r={9} fill="#fff2cd" /><Path d="M53 22L51 10Q57 7 57 22M60 22L64 11Q70 11 64 25" fill="#fff2cd" stroke="#ecb896" strokeWidth={2} /><Circle cx={61} cy={28} r={1.8} fill="#51443a" /></G>
      </> : channel === 1 ? <>
        {[12, 33, 68, 89].map((x, i) => <Circle key={x} cx={x} cy={10 + i * 7} r={1.5} fill="#fff6c9" />)}
        <G transform={`translate(0 ${drift * .45})`}><Path d="M40 42L50 10L60 42L50 37Z" fill="#fff4dd" /><Path d="M40 35L33 47L44 42M60 35L67 47L56 42" fill="#ed8a77" /><Circle cx={50} cy={26} r={5} fill="#91dded" /><Path d="M46 43L50 53L54 43" fill="#ffcb58" /></G>
      </> : <>
        <Path d="M0 46Q50 35 100 46V56H0" fill="#a592d9" />
        <G transform={`translate(0 ${drift * .3})`}><SvgText x={24} y={38} fontSize={32} fontWeight="bold" fill="#fff5c7">♪</SvgText><SvgText x={61} y={30} fontSize={28} fill="#9a4d91">♫</SvgText></G>
      </>}
      <Rect x={3} y={3} width={17} height={10} rx={3} fill="#fff7df" /><SvgText x={11.5} y={10.5} textAnchor="middle" fontSize={7} fontWeight="bold" fill="#555176">{channel + 1}</SvgText>
    </Svg>
  </View>;
}

export function TelevisionCat() {
  const { time, reducedMotion } = useFarmAnimationClock();
  return <View testID="tv-seated-cat" pointerEvents="none" style={[styles.seatedCat, { transform: [{ rotate: `${reducedMotion ? 0 : Math.sin(time * 1.8) * 1.3}deg` }] }]}>
    <Image source={petImages.watchingTv} resizeMode="contain" style={styles.image} />
  </View>;
}
