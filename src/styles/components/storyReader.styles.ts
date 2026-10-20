import { StyleSheet } from 'react-native';
export function storyReaderLayout(width: number, height: number) {
  return { pictureSide: Math.max(80, Math.min(300, width * .24, height - 116)) };
}
export const styles = StyleSheet.create({
  reader: { flex: 1, minHeight: 0, marginBottom: 94, padding: 8, flexDirection: 'row', gap: 12 },
  illustrationColumn: { alignItems: 'center', justifyContent: 'center', gap: 4 },
  sceneButton: { minHeight: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 3 },
  sceneLabel: { color: '#26796e', fontSize: 12, fontWeight: '800', flexShrink: 1 },
  textColumn: { flex: 1, minWidth: 0, minHeight: 0, gap: 5 },
  textPanel: { flex: 1, minHeight: 48, borderRadius: 16, borderWidth: 2, borderColor: '#e6b24d', backgroundColor: '#fffaf0' },
  textContent: { paddingHorizontal: 14, paddingVertical: 10, gap: 12 },
  paragraph: { color: '#453c2b', fontSize: 18, lineHeight: 25 },
  textHeading: { color: '#26796e', fontSize: 18, fontWeight: '900' },
  moral: { color: '#32685e', fontSize: 16, lineHeight: 23, fontWeight: '700' },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  play: { minHeight: 44, paddingHorizontal: 12, borderRadius: 14, borderWidth: 2, borderColor: '#e1af47', backgroundColor: '#267d70', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 },
  playText: { color: '#fff9e8', fontSize: 15, fontWeight: '900' },
  read: { backgroundColor: '#fff5d9' },
  readText: { color: '#26796e', fontSize: 15, fontWeight: '900' },
  iconButton: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: '#dfb14e', backgroundColor: '#fff5d9', alignItems: 'center', justifyContent: 'center' },
  time: { flex: 1, minWidth: 0, fontSize: 12, color: '#32685e', textAlign: 'right' },
  quizButton: { minHeight: 44, borderWidth: 2, borderColor: '#e1af47', borderRadius: 14, backgroundColor: '#fff0bc', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingHorizontal: 8 },
  quizLabel: { color: '#26796e', fontSize: 15, fontWeight: '900', textAlign: 'center', flexShrink: 1 },
  hint: { fontSize: 12, color: '#32685e', textAlign: 'center' },
  disabled: { opacity: .45 },
});
