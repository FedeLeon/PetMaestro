import { StyleSheet } from 'react-native';

export const shopPageArrowSize = (sceneHeight: number) => Math.max(72, Math.min(92, sceneHeight * .25));
export const styles = StyleSheet.create({
  button: { position: 'absolute', top: '50%', zIndex: 4 },
  previous: { left: 12 },
  next: { right: 12 },
  disabled: { opacity: .35 },
  art: { width: '100%', height: '100%' },
  mirrored: { transform: [{ scaleX: -1 }] },
});
