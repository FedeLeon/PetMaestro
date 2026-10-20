import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff7e8' },
  statusRow: { height: 30, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff3d5' },
  message: { color: '#26796e', fontSize: 14, fontWeight: '800', flex: 1 },
  pageCount: { color: '#674124', fontSize: 14, fontWeight: '900', paddingLeft: 8 },
  scene: { flex: 1, marginBottom: 94, backgroundColor: '#edc98e', overflow: 'hidden' },
  art: { position: 'absolute' },
  backgroundImage: { width: '100%', height: '100%' },
  product: { position: 'absolute', top: 0 },
  // Reduce art by 12% in both axes, keeping the pedestal baseline at 61%.
  preview: { position: 'absolute', left: '6%', top: '10.84%', width: '88%', height: '50.16%' },
  namePlate: { position: 'absolute', top: '62%', width: '100%', height: '14%', minHeight: 28, alignItems: 'center', justifyContent: 'center' },
  itemName: { color: '#593619', fontWeight: '900', textAlign: 'center' },
  buyButton: { position: 'absolute', top: '77%', width: '100%', minHeight: 44, paddingHorizontal: 5, paddingVertical: 8, borderRadius: 14, backgroundColor: '#e97543', borderColor: '#fff3d5', borderWidth: 2, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 5 },
  buyButtonText: { color: '#ffffff', fontSize: 12, fontWeight: '900', textAlign: 'center' },
  price: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  priceCoin: { height: 18, width: 18 },
  useButton: { backgroundColor: '#26796e' },
  disabledButton: { opacity: .45 },
  owned: { position: 'absolute', top: '4%', right: 0, padding: 3, borderRadius: 12, backgroundColor: '#e0f6ed', flexDirection: 'row', alignItems: 'center', gap: 3 },
  ownedText: { color: '#26796e', fontWeight: '900', fontSize: 12 },
});
