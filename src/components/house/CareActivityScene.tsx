import { usePresentation } from '../../presentation/usePresentation';
import { useScenePresentation } from '../../context/ScenePresentation';
import { useState, type ReactNode, type RefObject } from 'react';
import { Image, Text, TouchableOpacity, View, type ImageSourcePropType, type StyleProp, type ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { careSceneFrame, styles } from '../../styles/house/careScene.styles';
import { useGameAudio } from '../../context/AudioContext';
import { uiImages } from '../../data/assetImages';
export function CareActivityScene({ source, onClose, children, label, value, aspectRatio = 1.5, backLabel, rootRef, overlay, backgroundColor, showProgress = true }: {
  source: ImageSourcePropType; aspectRatio?: number; onClose: () => void; children: ReactNode; label: string; value: number;
  backLabel: string; rootRef?: RefObject<View | null>; overlay?: ReactNode; backgroundColor?: string; showProgress?: boolean;
}) {
  const presentation = usePresentation();
  const { activity } = useScenePresentation();
  const [size, setSize] = useState({ width: 0, height: 0 });
  return <View ref={rootRef} collapsable={false} testID="care-scene" style={[styles.root, activity && presentation.styles.activityRoom, backgroundColor ? { backgroundColor } : undefined]} onLayout={event => setSize(event.nativeEvent.layout)}>
    <View testID="care-scene-canvas" style={[styles.canvas, careSceneFrame(size.width, size.height, aspectRatio)]}>
      <View pointerEvents="none" style={styles.fill}><Image source={source} resizeMode="contain" style={styles.image} /></View>
      {size.width > 0 && size.height > 0 ? children : null}
    </View>
    <View pointerEvents="box-none" style={styles.hud}>
      <TouchableOpacity accessibilityRole="button" accessibilityLabel={backLabel} onPress={onClose} style={styles.back}><MaterialCommunityIcons name="arrow-left" size={26} color="#26796e" /></TouchableOpacity>
      {showProgress && <View pointerEvents="none" style={styles.progressGroup}><Text accessibilityLiveRegion="polite" style={styles.instruction}>{label}</Text>
        <View accessibilityRole="progressbar" accessibilityLabel="Progreso" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value * 100)} style={styles.track}><View style={[styles.progress, { width: `${Math.max(0, Math.min(100, value * 100))}%` }]} /></View>
      </View>}
    </View>
    {overlay}
  </View>;
}
export function SceneTool({ source, label, caption = label, style, onPress, disabled = false, selected = false }: {
  source: ImageSourcePropType; label: string; caption?: string; style: StyleProp<ViewStyle>; onPress: () => void; disabled?: boolean; selected?: boolean;
}) {
  const { playSound } = useGameAudio();
  return <TouchableOpacity accessibilityRole="button" accessibilityLabel={label} aria-pressed={selected} disabled={disabled} activeOpacity={.85}
    onPress={() => { playSound('tap'); onPress(); }} style={[styles.tool, style, selected && styles.toolSelected, disabled && styles.toolDisabled]}>
    <Image accessible={false} source={source} resizeMode="contain" style={styles.toolImage} /><Text numberOfLines={2} style={styles.toolLabel}>{caption}</Text>
  </TouchableOpacity>;
}
export function SceneFinish({ onPress, label = '¡Listo!' }: { onPress: () => void; label?: string }) {
  const { playSound } = useGameAudio();
  return <TouchableOpacity accessibilityRole="button" accessibilityLabel={label} accessibilityHint="Volver al baño con el gatito feliz" activeOpacity={.8}
    onPress={() => { playSound('tap'); onPress(); }} style={styles.finish}>
    <Image accessible={false} source={uiImages.feedingFinish} resizeMode="contain" style={styles.image} />
    <View pointerEvents="none" style={styles.finishLabel}><Text numberOfLines={1} adjustsFontSizeToFit style={styles.finishText}>{label}</Text></View>
  </TouchableOpacity>;
}
