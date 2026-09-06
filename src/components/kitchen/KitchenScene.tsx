import { useState, type ReactNode, type RefObject } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View, type ImageSourcePropType } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '../../styles/house/kitchen.styles';
export function KitchenScene({ source, children, controls, onClose, rootRef, overlay, dragging = false }: { rootRef?: RefObject<View | null>; overlay?: ReactNode; dragging?: boolean; source: ImageSourcePropType; children: ReactNode; controls: ReactNode; onClose: () => void }) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const width = Math.min(size.width * .73, size.height * 1.5);
  return <View ref={rootRef} collapsable={false} style={styles.root} onLayout={event => setSize(event.nativeEvent.layout)}>
    <View style={[styles.canvas, { width, height: width / 1.5, left: (size.width * .73 - width) / 2, top: (size.height - width / 1.5) / 2 }]}>
      <View pointerEvents="none" style={styles.fill}><Image source={source} style={styles.image} resizeMode="contain" /></View>
      {width > 0 ? children : null}
    </View>
    <ScrollView scrollEnabled={!dragging} style={styles.panel} contentContainerStyle={styles.panelContent}>
      <KitchenButton label="Volver a la cocina" shortLabel="‹ Volver" onPress={onClose} secondary />
      {controls}
    </ScrollView>
    {overlay}
  </View>;
}
export function KitchenButton({ label, shortLabel, onPress, disabled = false, secondary = false, play = false }: { label: string; shortLabel?: string; onPress: () => void; disabled?: boolean; secondary?: boolean; play?: boolean }) {
  return <TouchableOpacity accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} style={[styles.action, secondary && styles.secondary, play && styles.playAction, disabled && styles.disabled]}>{play ? <MaterialCommunityIcons name="play" size={22} color="#335e54" /> : null}<Text style={styles.actionText}>{shortLabel ?? label}</Text></TouchableOpacity>;
}
export function KitchenProgress({ value }: { value: number }) {
  return <View accessibilityRole="progressbar" accessibilityLabel="Progreso de la comida" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value * 100)} style={styles.track}><View style={[styles.progress, { width: `${Math.max(0, Math.min(100, value * 100))}%` }]} /></View>;
}
