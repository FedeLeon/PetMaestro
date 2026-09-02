import { StyleSheet } from 'react-native';
import { EXTERIOR_YARD_WIDTH } from '../screens/houseScreen.styles';

export const styles = StyleSheet.create({
  clickSparkle: { zIndex: 20 },
  barn: { height: 174, left: 706, position: 'absolute', top: 50, transform: [{ scale: 1.44 }], width: 190, zIndex: 1 },
  barnImage: { height: '100%', width: '100%' },
  cat: { position: 'absolute', zIndex: 10 },
  house: { alignItems: 'center', height: 214, left: EXTERIOR_YARD_WIDTH / 2 - 146, position: 'absolute', transform: [{ scale: 1.44 }], width: 293, zIndex: 3 },
  houseImage: { height: '100%', width: '100%' },
  houseDoorHit: { bottom: 6, height: 112, left: 92, position: 'absolute', width: 110, zIndex: 3 },
  horizontalScroll: { flex: 1 },
  roomBackgroundImage: { borderRadius: 6 },
  room: { backgroundColor: '#ffffff', borderColor: '#f0dcc0', borderRadius: 8, borderWidth: 2, borderLeftWidth: 0, borderRightWidth: 0, flex: 1, minHeight: 0, overflow: 'hidden' },
  touch: { bottom: 0, left: 0, position: 'absolute', right: 0, top: 0, zIndex: 0 },
  wide: { height: '100%', position: 'relative', width: EXTERIOR_YARD_WIDTH },
  yardAnimal: { alignItems: 'center', height: 125, justifyContent: 'center', position: 'absolute', width: 125, zIndex: 2 },
  cowAnimal: { height: 132, width: 132 },
  horseAnimal: { height: 134, width: 134 },
  animalImage: { height: 120, width: 120 },
  frontAnimal: { zIndex: 4 },
});
