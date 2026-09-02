import { StyleSheet } from 'react-native';
import { KITCHEN_ROOM_WIDTH } from '../screens/houseScreen.styles';

export const styles = StyleSheet.create({
  clickSparkle: { zIndex: 20 },
  cat: { position: 'absolute', zIndex: 4 },
  doorHit: { height: 204, position: 'absolute', right: 22, top: 62, width: 132, zIndex: 8 },
  horizontalScroll: { flex: 1 },
  roomBackgroundImage: { borderRadius: 6 },
  pane: { backgroundColor: '#ffffff', height: '100%', overflow: 'hidden', position: 'relative', width: KITCHEN_ROOM_WIDTH },
  touch: { bottom: 0, left: 0, position: 'absolute', right: 0, top: 0, zIndex: 0 },
});
