import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  button: { alignItems: 'center', justifyContent: 'center', width: 48, height: 48, marginHorizontal: 6, borderRadius: 24, backgroundColor: '#e8fbf7' },
  backdrop: { flex: 1, backgroundColor: 'rgba(30, 26, 20, .5)', alignItems: 'center', justifyContent: 'center', padding: 12 },
  card: { backgroundColor: '#fffaf0', borderColor: '#57b8a9', borderWidth: 3, borderRadius: 20, padding: 18, width: 370, maxWidth: '95%' },
  title: { color: '#372413', fontSize: 24, fontWeight: '900', textAlign: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 48, gap: 12 },
  label: { color: '#372413', fontSize: 18, fontWeight: '700' },
  close: { backgroundColor: '#26796e', borderRadius: 12, minHeight: 48, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  closeText: { color: '#fff', fontSize: 19, fontWeight: '900' },
});
