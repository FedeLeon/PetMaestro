import { useState, type ReactNode } from 'react';
import { Image, Text, TouchableOpacity, View, type ImageSourcePropType } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '../../styles/house/bathroomActivity.styles';

// All interaction coordinates belong to this exact, uncropped image rectangle.
export function BathroomActivityScene({ source, onClose, children, controls, aspectRatio = 1.5 }: {
  source: ImageSourcePropType; aspectRatio?: number; onClose: () => void; children: ReactNode; controls: ReactNode;
}) {
  const [layout, setLayout] = useState({ width: 0, height: 0 });
  const width = Math.min(layout.width * 0.76, layout.height * aspectRatio);
  const height = width / aspectRatio;
  return <View style={styles.root} onLayout={(event) => setLayout(event.nativeEvent.layout)}>
    <View style={[styles.canvas, { width, height, left: (layout.width * 0.76 - width) / 2, top: (layout.height - height) / 2 }]}>
      <View pointerEvents="none" style={styles.fill}><Image source={source} resizeMode="contain" style={styles.sceneImage} /></View>
      {width > 0 && height > 0 ? children : null}
    </View>
    <View style={styles.controls}>
      <TouchableOpacity accessibilityRole="button" accessibilityLabel="Volver al baño" onPress={onClose} style={styles.back}>
        <MaterialCommunityIcons name="arrow-left" size={24} color="#237d75" /><Text style={styles.backText}>Volver</Text>
      </TouchableOpacity>
      {controls}
    </View>
  </View>;
}

export function ActivityProgress({ value, label }: { value: number; label: string }) {
  return <View style={styles.progressGroup}>
    <Text accessibilityLiveRegion="polite" style={styles.instruction}>{label}</Text>
    <View accessibilityRole="progressbar" accessibilityLabel="Progreso" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value * 100)} style={styles.track}>
      <View style={[styles.progress, { width: `${Math.min(100, Math.max(0, value * 100))}%` }]} />
    </View>
  </View>;
}
