import { StyleSheet } from 'react-native';

export function fishMemoryLayout(width: number, height: number) {
  const gap = 12;
  const side = Math.max(0, Math.floor(Math.min(192, (width - gap * 3) / 4, (height - gap) / 2)));
  return { side, width: side * 4 + gap * 3, height: side * 2 + gap, gap };
}

const fill = { position: 'absolute' as const, left: 0, right: 0, top: 0, bottom: 0 };
export const styles = StyleSheet.create({
  game: { flex: 1, gap: 8, minHeight: 0 },
  arena: { flex: 1, minHeight: 0, backgroundColor: '#f5e5c7', borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  board: { flexDirection: 'row', flexWrap: 'wrap' },
  card: { position: 'relative' },
  face: { ...fill, backfaceVisibility: 'hidden' },
  backArt: { width: '100%', height: '100%' },
  front: { backgroundColor: '#fffaf0', borderRadius: 18, borderWidth: 4, borderColor: '#d99d40', padding: 8, alignItems: 'center', gap: 2 },
  matched: { backgroundColor: '#e6f7ec', borderColor: '#3ca48e' },
  drawing: { flex: 1, minHeight: 0, width: '100%' },
  word: { color: '#674c31', fontWeight: '900', textAlign: 'center' },
  check: { position: 'absolute', right: 6, top: 2, fontSize: 20, fontWeight: '900', color: '#26796e' },
  controls: { minHeight: 38, flexDirection: 'row', alignItems: 'center', gap: 10 },
  counter: { color: '#26796e', backgroundColor: '#e0f6ed', borderRadius: 12, padding: 9, fontSize: 15, fontWeight: '900' },
  message: { flex: 1, color: '#674c31', fontSize: 14, fontWeight: '700' },
});
