import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  actionPosition: { position: 'absolute', width: 68, height: 68, zIndex: 10 },
  actionBubble: { alignItems: 'center', backgroundColor: '#ffffff', borderColor: '#f6c445', borderRadius: 34, borderWidth: 4, height: '100%', justifyContent: 'center', shadowColor: '#5c3519', shadowOffset: { height: 3, width: 0 }, shadowOpacity: .25, shadowRadius: 3, width: '100%' },
  exitDoorHit: { position: 'absolute', zIndex: 8 },
  room: { backgroundColor: '#72cbd0', flex: 1, marginBottom: 94, minHeight: 0, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  background: { position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 },
  roomBackgroundImage: { position: 'absolute' },
  scene: { overflow: 'hidden', position: 'relative' },
  staticCat: { alignItems: 'center', height: 284, width: 230, position: 'absolute', zIndex: 5 },
});
