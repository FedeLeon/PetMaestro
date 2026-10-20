import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  actionPosition: { position: 'absolute', width: 82, height: 82, zIndex: 10 },
  actionBubble: { alignItems: 'center', height: '100%', justifyContent: 'center', width: '100%' },
  actionArt: { width: '100%', height: '100%' },
  actionDisabled: { opacity: .5 },
  exitDoorHit: { position: 'absolute', zIndex: 8 },
  room: { backgroundColor: '#72cbd0', flex: 1, marginBottom: 94, minHeight: 0, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  background: { position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 },
  roomBackgroundImage: { position: 'absolute' },
  scene: { overflow: 'hidden', position: 'relative' },
  staticCat: { alignItems: 'center', height: 284, width: 230, position: 'absolute', zIndex: 5 },
});
