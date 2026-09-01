import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { alignItems: 'center', flexDirection: 'row', gap: 2, marginTop: 2, width: '100%' },
  fill: { borderRadius: 4, height: '100%' },
  icon: { height: 36, width: 36 },
  meter: { alignItems: 'center', flex: 1, flexDirection: 'row', gap: 2 },
  track: { backgroundColor: '#eadfce', borderRadius: 4, flex: 1, height: 8, minWidth: 12, overflow: 'hidden' },
  value: { color: '#6c5a42', fontSize: 8, fontWeight: '900', width: 18 },
});
