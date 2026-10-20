import { StyleSheet } from 'react-native';
const fill = { position: 'absolute' as const, left: 0, right: 0, top: 0, bottom: 0 };

export const MOUSE_ROOM_ASPECT = 1983 / 793;
export const mouseRoomGeometry = (width: number, height: number) => {
  const roomWidth = Math.min(width, height * MOUSE_ROOM_ASPECT);
  return { width: roomWidth, height: roomWidth / MOUSE_ROOM_ASPECT };
};

export const styles = StyleSheet.create({
  game: { flex: 1, gap: 6, minHeight: 0 },
  arena: { flex: 1, minHeight: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ead5b0', borderRadius: 18, overflow: 'hidden' },
  room: { overflow: 'hidden' },
  fill,
  curtain: { ...fill, zIndex: 10, overflow: 'hidden' },
  curtainPanel: { position: 'absolute', top: 0 },
  target: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  mouse: { width: '80%', height: '80%' },
  halo: { ...fill, borderRadius: 100, backgroundColor: '#ffe26780', borderWidth: 3, borderColor: '#fff5b0' },
  found: { ...fill, borderRadius: 100, backgroundColor: '#fff4b775', borderWidth: 3, borderColor: '#fff6bc' },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  counter: { color: '#26796e', backgroundColor: '#e0f6ed', borderRadius: 12, padding: 10, fontWeight: '900', fontSize: 15 },
  message: { flex: 1, color: '#674c31', fontSize: 13, fontWeight: '700' },
  hint: { minHeight: 44, paddingHorizontal: 14, justifyContent: 'center', backgroundColor: '#26796e', borderRadius: 14 },
  hintText: { color: '#fff', fontSize: 14, fontWeight: '900' },
});
