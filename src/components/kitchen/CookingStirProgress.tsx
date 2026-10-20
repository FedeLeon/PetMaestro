import { useId } from 'react';
import { Image, Text, View } from 'react-native';
import Svg, { ClipPath, Defs, G, LinearGradient, Rect, Stop } from 'react-native-svg';
import { uiImages } from '../../data/assetImages';
import { stirProgressPlacement } from '../../styles/house/cooking.layout';
import { styles } from '../../styles/house/cookingProgress.styles';

export function CookingStirProgress({ value, width, height }: { value: number; width: number; height: number }) {
  const prefix = `stir${useId().replace(/\W/g, '')}`;
  const progress = Math.max(0, Math.min(1, value));
  const placement = stirProgressPlacement(width, height);
  return <View testID="cooking-stir-progress" pointerEvents="none" style={[styles.panel, placement]}>
    <Image accessible={false} source={uiImages.cookingStirPanel} resizeMode="contain" style={styles.frame} />
    <View style={styles.content}>
      <Text numberOfLines={1} style={[styles.title, { fontSize: Math.min(16, placement.width * .068) }]}>¡Revolvé! · {Math.round(progress * 100)}%</Text>
      <View testID="stir-progress-bar" accessibilityRole="progressbar" accessibilityLabel="Progreso al revolver" accessibilityHint="Tocá la cuchara o arrastrala por la olla para mezclar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)} style={styles.bar}>
        <Svg width="100%" height="100%" viewBox="0 0 240 24" preserveAspectRatio="none">
          <Defs>
            <LinearGradient id={`${prefix}rim`} x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#ffe6a2" /><Stop offset=".45" stopColor="#efb844" /><Stop offset="1" stopColor="#c57d25" /></LinearGradient>
            <LinearGradient id={`${prefix}fill`} x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#a3f4cc" /><Stop offset=".4" stopColor="#4ed7b4" /><Stop offset="1" stopColor="#249b8b" /></LinearGradient>
            <ClipPath id={`${prefix}inside`}><Rect x={5} y={5} width={230} height={14} rx={7} /></ClipPath>
          </Defs>
          <Rect x={1} y={1} width={238} height={22} rx={11} fill={`url(#${prefix}rim)`} stroke="#a77231" strokeWidth={1.5} />
          <Rect x={5} y={5} width={230} height={14} rx={7} fill="#276f69" />
          <G clipPath={`url(#${prefix}inside)`}>
            <Rect testID="stir-progress-fill" x={5} y={5} width={230 * progress} height={14} fill={`url(#${prefix}fill)`} />
            <Rect x={7} y={6} width={Math.max(0, 230 * progress - 4)} height={3} rx={1.5} fill="#e4fff0" opacity={.65} />
          </G>
        </Svg>
      </View>
    </View>
  </View>;
}
