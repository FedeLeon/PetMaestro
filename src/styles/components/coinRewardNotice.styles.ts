import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
  notice: { position: 'absolute', top: 64, right: 12, zIndex: 100, elevation: 20, flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 18, borderWidth: 3, borderColor: '#e4b243', backgroundColor: '#fff5d9f5', paddingHorizontal: 12, paddingVertical: 6 },
  coin: { width: 34, height: 34 },
  amount: { color: '#96700b', fontSize: 22, fontWeight: '900' },
  label: { color: '#26796e', fontSize: 12, fontWeight: '800' },
});
