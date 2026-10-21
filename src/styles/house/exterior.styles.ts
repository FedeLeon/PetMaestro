import { BOTTOM_MENU_HEIGHT } from '../layout';
import { StyleSheet } from 'react-native';
import { EXTERIOR_YARD_WIDTH } from '../screens/houseScreen.styles';
// Keep the right edge of the painted barn visible in the initial panorama.
export const exteriorFocusRightX = .965;

export const styles = StyleSheet.create({
  clickSparkle: { zIndex: 20 },
  // The scaled world is a stacking context: the cat's own zIndex cannot lift
  // it above the house unless this sibling layer also sits in front.
  catWorld: { position: 'absolute', left: 0, top: 0, height: 600, transformOrigin: 'top left', zIndex: 5 },
  cat: { position: 'absolute', zIndex: 10 },
  house: { alignItems: 'center', height: 214, left: EXTERIOR_YARD_WIDTH / 2 - 146, position: 'absolute', transform: [{ scale: 1.44 }], width: 293, zIndex: 3 },
  houseImage: { height: '100%', width: '100%' },
  houseDoorHit: { bottom: 6, height: 112, left: 92, position: 'absolute', width: 110, zIndex: 3 },
  horizontalScroll: { flex: 1 },
  roomBackgroundImage: { borderRadius: 6, width: '100%', height: '100%' },
  room: { marginBottom: BOTTOM_MENU_HEIGHT, backgroundColor: '#ffffff', borderColor: '#f0dcc0', borderRadius: 8, borderWidth: 2, borderLeftWidth: 0, borderRightWidth: 0, flex: 1, minHeight: 0, overflow: 'hidden' },
  touch: { bottom: 0, left: 0, position: 'absolute', right: 0, top: 0, zIndex: 0 },
  wide: { height: '100%', position: 'relative', width: EXTERIOR_YARD_WIDTH },
  yardAnimal: { alignItems: 'center', justifyContent: 'center', position: 'absolute', zIndex: 2 },
  animalTouch: { position: 'absolute', zIndex: 10, borderRadius: 18 },
  pettingStatus: { position: 'absolute', width: 164, padding: 5, borderRadius: 12, backgroundColor: '#fff6df', zIndex: 20 },
  pettingText: { color: '#7c472a', fontWeight: '900', fontSize: 11, textAlign: 'center' },
  pettingHint: { position: 'absolute', top: 8, padding: 5, borderRadius: 12, backgroundColor: '#fff7dfec' },
  pettingHintText: { color: '#26796e', fontSize: 12, fontWeight: '800', textAlign: 'center' },
  animalShadow: { position: 'absolute', width: '52%', borderRadius: 100, backgroundColor: '#78512b24' },
  animalImage: { height: '100%', width: '100%' },
});
