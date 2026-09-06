import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
  bed: { position: 'absolute', left: 0, right: 0, bottom: 8, zIndex: 15 },
  flower: { position: 'absolute', bottom: 0, alignItems: 'center', justifyContent: 'flex-end' },
  image: { width: '100%', flex: 1 },
  badge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 3, borderRadius: 12, paddingHorizontal: 7, height: 24, backgroundColor: '#fff8d8', borderWidth: 1, borderColor: '#eacb6a' },
  hydrated: { backgroundColor: '#d8f0eb', borderColor: '#85cbbc' },
  text: { fontSize: 11, fontWeight: '800', color: '#286e67' },
  wateringCat: { position: 'absolute', width: 230, height: 284 },
  can: { position: 'absolute', width: 92, height: 72 },
  drop: { position: 'absolute', width: 12, height: 18 },
  message: { position: 'absolute', top: -24, alignSelf: 'center', borderRadius: 12, padding: 5, backgroundColor: '#fff8dc', color: '#286e67', fontWeight: '800' },
  overlay: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
});
