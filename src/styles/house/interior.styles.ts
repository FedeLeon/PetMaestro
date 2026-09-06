import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
  room: { flex: 1, minHeight: 0, marginBottom: 94, backgroundColor: '#f4ce8c', overflow: 'hidden', userSelect: 'none' },
  scroll: { flex: 1 },
  scrollContent: { alignItems: 'center' },
  scene: { position: 'relative', overflow: 'hidden' },
  fill: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  image: { width: '100%', height: '100%' },
  floorTouch: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  fixedFurniture: { position: 'absolute' },
  catWorld: { position: 'absolute', left: 0, top: 0, width: 2400, height: 600, transformOrigin: 'top left', zIndex: 8 },
  cat: { position: 'absolute' },
  clickSparkle: { position: 'absolute', zIndex: 10 },
  door: { position: 'absolute', zIndex: 12 },
  drawingFrame: { position: 'absolute', zIndex: 5, overflow: 'hidden' },
});
