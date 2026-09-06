import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
  cat: { position: 'absolute', zIndex: 5 },
  clickSparkle: { position: 'absolute', zIndex: 20 },
  doorHit: { position: 'absolute', zIndex: 8 },
  floorTouch: { bottom: 0, left: 0, position: 'absolute', right: 0, zIndex: 1 },
  room: { backgroundColor: '#ffffff', flex: 1, minHeight: 0, overflow: 'hidden' },
  roomBackgroundImage: { borderRadius: 0 },
  scene: { flex: 1, overflow: 'hidden', position: 'relative' },
});
