import { BOTTOM_MENU_HEIGHT } from '../layout';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  room: { flex: 1, minHeight: 0, marginBottom: BOTTOM_MENU_HEIGHT, backgroundColor: '#c5dcb8', overflow: 'hidden' },
  background: { position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 },
  backgroundImage: { width: '100%', height: '100%' },
  scroll: { flex: 1, minHeight: 0 },
  content: { padding: 4, flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  card: { position: 'relative', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  frame: { position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' },
  cardContent: { position: 'absolute', left: '12%', top: '12%', right: '12%', bottom: '12%', alignItems: 'center', gap: 2 },
  image: { width: '100%', flex: 1, minHeight: 24 },
  title: { color: '#26796e', fontWeight: '900', textAlign: 'center', width: '100%', flexShrink: 0 },
  action: { minHeight: 22, paddingHorizontal: 5, paddingVertical: 2, borderRadius: 10, backgroundColor: '#26796e', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 3, alignSelf: 'stretch', flexShrink: 0 },
  shopAction: { backgroundColor: '#b86231' },
  actionText: { color: '#fff', fontWeight: '900' },
});
