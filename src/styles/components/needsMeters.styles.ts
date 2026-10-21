import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { alignItems: 'center', flexDirection: 'row', gap: 2, flexShrink: 0 },
  fill: { borderRadius: 4, height: '100%' },
  icon: { height: 32, width: 32 },
  meter: { alignItems: 'center', justifyContent: 'center', width: 44, height: 48, gap: 2 },
  track: { backgroundColor: '#eadfce', borderRadius: 4, height: 5, width: 36, overflow: 'hidden' },
});
