import { useId } from 'react';
import { Animated, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { styles } from '../styles/components/mouseHideAndSeek.styles';
import type { MouseCurtainPhase } from './useMouseCurtain';

export function MouseRoomCurtain({ progress, phase, width, height }: { progress: Animated.Value; phase: MouseCurtainPhase; width: number; height: number }) {
  const id = `curtain-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const panelWidth = width / 2 + 2;
  if (phase === 'idle' || phase === 'found') return null;
  return <View pointerEvents="none" testID={`mouse-curtain-${phase}`} style={styles.curtain}>
    {(['left', 'right'] as const).map(side => <Animated.View key={side} testID={`mouse-curtain-${side}`}
      style={[styles.curtainPanel, { width: panelWidth, height, [side]: 0, transform: [{ translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [side === 'left' ? -panelWidth : panelWidth, 0] }) }] }]}>
      <Svg width={panelWidth} height={height} viewBox="0 0 300 400" preserveAspectRatio="none">
        <Defs><LinearGradient id={`${id}-${side}`} x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#a43a32" /><Stop offset=".28" stopColor="#ed8e68" /><Stop offset=".58" stopColor="#d5644e" /><Stop offset="1" stopColor="#9f352f" />
        </LinearGradient></Defs>
        <Rect width="300" height="400" fill="#bd4c3d" />
        {[0, 1, 2, 3, 4, 5].map(index => <Rect key={index} x={index * 50} width="51" height="400" fill={`url(#${id}-${side})`} />)}
        <Path d="M0 378Q25 390 50 378Q75 390 100 378Q125 390 150 378Q175 390 200 378Q225 390 250 378Q275 390 300 378" fill="none" stroke="#f4cb78" strokeWidth="5" />
        <Rect width="300" height="12" fill="#8e382e" /><Path d="M0 16H300" stroke="#f4cb78" strokeWidth="4" />
      </Svg>
    </Animated.View>)}
  </View>;
}
