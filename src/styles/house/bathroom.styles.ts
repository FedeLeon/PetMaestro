import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  clickSparkle: { zIndex: 20 },
  cat: { position: 'absolute', zIndex: 4 },
  exitDoorHit: { height: '55%', left: '8.5%', position: 'absolute', top: '13%', width: '22%', zIndex: 8 },
  horizontalScroll: { flex: 1 },
  roomBackgroundImage: { borderRadius: 6 },
  pane: { backgroundColor: '#ffffff', height: '100%', overflow: 'hidden', position: 'relative' },
  room: { backgroundColor: '#ffffff', borderColor: '#f0dcc0', borderRadius: 8, borderWidth: 2, borderLeftWidth: 0, borderRightWidth: 0, flex: 1, minHeight: 0, overflow: 'hidden' },
  touch: { bottom: 0, left: 0, position: 'absolute', right: 0, top: 0, zIndex: 0 },
});
