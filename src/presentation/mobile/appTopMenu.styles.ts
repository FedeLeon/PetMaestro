import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  clearance: { height: 68 },
  floating: { position: 'absolute', top: 6, left: 8, right: 8, zIndex: 100, elevation: 10 },
  floatingRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 },
  backPill: { width: 54, height: 54, borderRadius: 27, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', padding: 2, backgroundColor: '#fff8e9', borderWidth: 2, borderColor: '#e8b54e', elevation: 3 },
  titlePill: { flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: 5, minHeight: 48, paddingHorizontal: 10, borderRadius: 20, backgroundColor: '#fff8e9f5', borderWidth: 2, borderColor: '#e8b54e' },
  floatingTitle: { flexShrink: 1, fontSize: 18, fontWeight: '900', color: '#372413' },
  needsPill: { paddingHorizontal: 5, paddingVertical: 1, borderRadius: 24, borderWidth: 2, borderColor: '#e8b54e', backgroundColor: '#fff8e9f5', elevation: 3 },
  actions: { flexDirection: 'row', alignItems: 'center', borderRadius: 24, backgroundColor: '#fff8e9f5', paddingRight: 2, elevation: 3 },
  errorPill: { alignSelf: 'center', backgroundColor: '#fff8e9', borderRadius: 14, borderWidth: 2, borderColor: '#d68b49', marginTop: 4 },
  saveError: { color: '#9c3c23', fontSize: 14, fontWeight: '700', textAlign: 'center', padding: 6 },
});
