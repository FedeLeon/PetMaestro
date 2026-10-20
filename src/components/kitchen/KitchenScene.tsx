import { type ReactNode, type RefObject } from 'react';
import { Text, TouchableOpacity, View, type ImageSourcePropType } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '../../styles/house/kitchen.styles';
import { useGameAudio } from '../../context/AudioContext';
import { CareActivityScene } from '../house/CareActivityScene';
export function KitchenScene({ source, children, label, value, onClose, rootRef, overlay, showProgress }: { rootRef?: RefObject<View | null>; overlay?: ReactNode; source: ImageSourcePropType; children: ReactNode; label: string; value: number; onClose: () => void; showProgress?: boolean }) {
  return <CareActivityScene source={source} onClose={onClose} rootRef={rootRef} overlay={overlay} label={label} value={value} backLabel="Volver a la cocina" backgroundColor="#ecdcb9" showProgress={showProgress}>{children}</CareActivityScene>;
}
export function KitchenButton({ label, shortLabel, onPress, disabled = false, secondary = false, play = false }: { label: string; shortLabel?: string; onPress: () => void; disabled?: boolean; secondary?: boolean; play?: boolean }) {
  const { playSound } = useGameAudio();
  return <TouchableOpacity accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled }} disabled={disabled} onPress={() => { playSound('tap'); onPress(); }} style={[styles.action, secondary && styles.secondary, play && styles.playAction, disabled && styles.disabled]}>{play ? <MaterialCommunityIcons name="play" size={22} color="#335e54" /> : null}<Text style={styles.actionText}>{shortLabel ?? label}</Text></TouchableOpacity>;
}
export function KitchenProgress({ value }: { value: number }) {
  return <View accessibilityRole="progressbar" accessibilityLabel="Progreso de la comida" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value * 100)} style={styles.track}><View style={[styles.progress, { width: `${Math.max(0, Math.min(100, value * 100))}%` }]} /></View>;
}
export function KitchenSteps({ active }: { active: number }) {
  const icons = ['carrot', 'pot-steam', 'weather-windy', 'cat'] as const;
  return <View accessibilityLabel={`Paso ${active + 1} de 4`} style={styles.steps}>{icons.map((icon, index) => <View key={icon} style={[styles.step, index === active && styles.stepActive, index < active && styles.stepComplete]}><MaterialCommunityIcons name={index < active ? 'check' : icon} color="#26796e" size={20} /></View>)}</View>;
}
export function KitchenDots({ count, total = 3, label }: { count: number; total?: number; label: string }) {
  return <Text accessibilityLabel={`${label}: ${count} de ${total}`} style={styles.dots}>{Array.from({ length: total }, (_, index) => index < count ? '●' : '○').join('  ')}</Text>;
}
