import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  rig: { position: 'absolute', left: -20, top: -48 },
  outfitClip: { overflow: 'hidden' },
  catImage: { height: 260, width: 174 },
  outfitCanvas: { position: 'absolute', left: 28, top: 12, width: 174, height: 260 },
  gripWindow: { position: 'absolute', left: 22, top: 153, width: 25, height: 18, overflow: 'hidden' },
  gripCat: { position: 'absolute', left: -22, top: -153, width: 174, height: 260 },
  wrap: { alignItems: 'center', justifyContent: 'center', minHeight: 284, width: 230 },
  walkingCat: { height: 284, position: 'absolute', width: 230, zIndex: 5 },
  sparkleWindow: { overflow: 'hidden', position: 'absolute', zIndex: 20 },
  successImage: { height: '100%', width: '100%' },
  successWindow: { alignItems: 'center', justifyContent: 'center' },
});
