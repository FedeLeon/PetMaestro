import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  backgroundImage: { borderRadius: 6 },
  buyButton: { alignItems: 'center', backgroundColor: '#ff7a59', borderColor: '#ffffff', borderRadius: 12, borderWidth: 2, justifyContent: 'center', marginTop: 2, minHeight: 26, paddingHorizontal: 10 },
  buyButtonText: { color: '#ffffff', fontSize: 11, fontWeight: '900' },
  card: { alignItems: 'center', flexBasis: '31%', minWidth: 0, paddingHorizontal: 4, paddingVertical: 3 },
  content: { paddingBottom: 42 },
  disabledButton: { backgroundColor: '#c8bba8' },
  displayScene: { flex: 1, overflow: 'hidden' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between' },
  itemName: { backgroundColor: 'rgba(255, 253, 247, 0.9)', borderRadius: 7, color: '#372413', fontSize: 11, fontWeight: '900', marginTop: 1, overflow: 'hidden', paddingHorizontal: 5, paddingVertical: 2, textAlign: 'center', width: '100%' },
  message: { alignSelf: 'center', backgroundColor: '#d7f5cf', borderColor: '#5aa96a', borderRadius: 10, borderWidth: 2, color: '#2f6f3b', fontSize: 14, fontWeight: '900', marginBottom: 8, paddingHorizontal: 12, paddingVertical: 5, textAlign: 'center' },
  ownedCheck: { height: 32, marginTop: 3, width: 32 },
  preview: { alignItems: 'center', height: 94, justifyContent: 'center', width: '100%' },
  previewImage: { height: 94, width: '96%' },
  price: { alignItems: 'center', backgroundColor: 'rgba(255, 253, 247, 0.9)', borderRadius: 9, flexDirection: 'row', gap: 3, justifyContent: 'center', marginTop: 2, paddingHorizontal: 6, paddingVertical: 1 },
  priceCoin: { height: 19, width: 19 },
  priceText: { color: '#76624a', fontSize: 14, fontWeight: '900' },
  screen: { backgroundColor: '#fff7e8', flex: 1 },
});
