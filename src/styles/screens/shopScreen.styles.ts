import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  backgroundImage: { borderRadius: 6 },
  categoryAsset: { height: '54%', width: '62%' },
  categoryButton: { alignItems: 'center', backgroundColor: '#fffdf7', borderWidth: 4, justifyContent: 'center', paddingHorizontal: 5, position: 'absolute', shadowColor: '#5c3519', shadowOffset: { height: 3, width: 0 }, shadowOpacity: 0.22, shadowRadius: 3 },
  categoryIcon: { alignItems: 'center', height: '60%', justifyContent: 'center', width: '60%' },
  categoryMeta: { color: '#ff7a59', fontSize: 11, fontWeight: '900', lineHeight: 13, marginTop: 1 },
  categoryTitle: { color: '#372413', fontSize: 11, fontWeight: '900', lineHeight: 13, marginTop: 2, textAlign: 'center', width: '120%' },
  prompt: { alignSelf: 'center', backgroundColor: 'rgba(255, 253, 247, 0.9)', borderColor: '#e9ba67', borderRadius: 18, borderWidth: 2, paddingHorizontal: 18, paddingVertical: 6, position: 'absolute', top: 14 },
  promptText: { color: '#7d4e28', fontSize: 15, fontWeight: '900', letterSpacing: 0.6 },
  scene: { flex: 1, overflow: 'hidden', position: 'relative' },
  screen: { backgroundColor: '#fff7e8', flex: 1 },
});
