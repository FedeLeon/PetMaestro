import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  bathroomDoorHit: { position: 'absolute', zIndex: 12 },
  clickSparkle: { position: 'absolute', zIndex: 20 },
  drawingArtwork: { bottom: 14, left: 14, overflow: 'hidden', position: 'absolute', right: 14, top: 14 },
  drawingFrameHit: { overflow: 'hidden', position: 'absolute', zIndex: 12 },
  fixedFurniture: { position: 'absolute', zIndex: 3 },
  floor: { bottom: 0, left: 0, position: 'absolute', right: 0, zIndex: 4 },
  floorTouch: { bottom: 0, left: 0, position: 'absolute', right: 0, top: 0, zIndex: 0 },
  furnitureImage: { height: '100%', width: '100%' },
  furnitureStage: { bottom: 0, left: 0, position: 'absolute', right: 0, top: 0, zIndex: 6 },
  insideDoorHit: { position: 'absolute', zIndex: 12 },
  kitchenDoorHit: { position: 'absolute', zIndex: 12 },
  room: { backgroundColor: '#ffffff', borderColor: '#f0dcc0', borderRadius: 8, borderWidth: 2, borderLeftWidth: 0, borderRightWidth: 0, flex: 1, minHeight: 0, overflow: 'hidden' },
  roomBackgroundImage: { borderRadius: 6 },
  roomCat: { position: 'absolute', zIndex: 20 },
  scene: { backgroundColor: '#ffffff', flex: 1, overflow: 'hidden', position: 'relative' },
});
