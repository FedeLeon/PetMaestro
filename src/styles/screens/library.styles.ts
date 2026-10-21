import { BOTTOM_MENU_HEIGHT } from '../layout';
import { StyleSheet } from 'react-native';

export function libraryLayout(width: number, height: number) {
  const cardWidth = Math.max(120, Math.min(244, (width - 60) / 4));
  return { cardWidth, illustrationSide: Math.max(56, Math.min(160, cardWidth - 24, height - 170)), titleSize: cardWidth < 210 ? 13 : 17 };
}
export function storyLayout(width: number, height: number) {
  return { side: Math.max(80, Math.min(420, height - 20, width * .46)) };
}
export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f8edd3' },
  body: { flex: 1, minHeight: 0, marginBottom: BOTTOM_MENU_HEIGHT, padding: 8, gap: 6 },
  intro: { color: '#32685e', fontSize: 16, fontWeight: '800', textAlign: 'center' },
  shelfHeader: { minHeight: 40, flexDirection: 'row', alignItems: 'center', gap: 8 },
  shelfHeading: { flex: 1, gap: 2 },
  unlockHint: { color: '#526b5e', fontSize: 12, textAlign: 'center' },
  lockedBook: { backgroundColor: '#bfc3c5', borderColor: '#969da0', boxShadow: '0px 5px 0px #858e91' },
  lockedArt: { backgroundColor: '#d4d8da', borderColor: '#a6afb2', alignItems: 'center', justifyContent: 'center' },
  lockedTitle: { color: '#3f4a50' },
  lockedBadge: { backgroundColor: '#dfe3e5' },
  lockedMessage: { flex: 1, marginBottom: BOTTOM_MENU_HEIGHT, padding: 20, alignItems: 'center', justifyContent: 'center', gap: 12 },
  bookList: { flex: 1, minHeight: 0 },
  shelf: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'center', gap: 12, paddingBottom: 6 },
  book: { borderRadius: 14, borderWidth: 3, borderColor: '#e8b54e', borderLeftWidth: 10, borderBottomWidth: 7, padding: 8, alignItems: 'center', gap: 6, boxShadow: '0px 5px 0px #9e713c' },
  bookArt: { borderRadius: 8, borderWidth: 2, borderColor: '#ffe7a4', overflow: 'hidden' },
  bookTitle: { fontWeight: '900', color: '#fffdf3', textAlign: 'center', minHeight: 34 },
  listenBadge: { flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff5d9', borderRadius: 12, paddingVertical: 4, paddingHorizontal: 10 },
  badgeText: { color: '#285f56', fontSize: 12, fontWeight: '900' },
  illustrationViewport: { flex: 1, width: '100%', overflow: 'hidden' },
  strip: { position: 'absolute', top: 0, height: '100%', width: '300%' },
  player: { flex: 1, minHeight: 0, marginBottom: BOTTOM_MENU_HEIGHT, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, gap: 20 },
  picture: { overflow: 'hidden', borderRadius: 18, borderWidth: 5, borderColor: '#e6b24d', backgroundColor: '#fff5da' },
  sceneBadge: { position: 'absolute', bottom: 6, right: 6, backgroundColor: '#fff7e8ed', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3 },
  controls: { flex: 1, maxWidth: 540, minWidth: 200, gap: 8 },
  description: { color: '#32685e', fontSize: 16, fontWeight: '800' },
  caption: { color: '#674c31', fontSize: 12 },
  timeline: { height: 10, borderRadius: 8, backgroundColor: '#d3dfce', overflow: 'hidden', borderWidth: 1, borderColor: '#b5c8b1' },
  elapsed: { height: '100%', borderRadius: 8, backgroundColor: '#34a58e' },
  time: { flexDirection: 'row', justifyContent: 'space-between' },
  buttons: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  control: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: '#dfb14e', backgroundColor: '#fff5d9', alignItems: 'center', justifyContent: 'center' },
  play: { minHeight: 52, flex: 1, maxWidth: 220, borderRadius: 18, borderWidth: 3, borderColor: '#e1af47', backgroundColor: '#267d70', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingHorizontal: 8 },
  playText: { fontSize: 16, fontWeight: '900', color: '#fff9e8' },
  disabled: { opacity: .45 },
  creditsButton: { alignSelf: 'flex-end', minHeight: 44, paddingHorizontal: 8, justifyContent: 'center' },
  creditsLabel: { fontSize: 12, color: '#32685e', textDecorationLine: 'underline' },
  creditsBackdrop: { position: 'absolute', inset: 0, zIndex: 40, backgroundColor: '#193c35b8', alignItems: 'center', justifyContent: 'center', padding: 18 },
  creditsCard: { backgroundColor: '#fff7e8', borderRadius: 18, borderWidth: 3, borderColor: '#e1af47', padding: 14, maxWidth: 600, gap: 10 },
  closeCredits: { minHeight: 44, borderRadius: 12, backgroundColor: '#267d70', alignItems: 'center', justifyContent: 'center' },
});
