import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
  room: { flex: 1, minHeight: 0, marginBottom: 94, backgroundColor: '#d9b6d9', overflow: 'hidden' },
  scene: { position: 'relative', overflow: 'hidden' },
  fill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  image: { width: '100%', height: '100%' },
  backgroundImage: { position: 'absolute' },
  door: { position: 'absolute', zIndex: 10 },
  cat: { position: 'absolute', width: 230, height: 284 },
  sleepingCat: { position: 'absolute', transformOrigin: 'bottom center' },
  night: { position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, backgroundColor: '#080d32', zIndex: 4 },
  letters: { position: 'absolute', zIndex: 6 },
  sleepLetter: { position: 'absolute', color: '#fff5c9', fontWeight: '900', textShadowColor: '#72569e', textShadowRadius: 3, textShadowOffset: { width: 1, height: 2 } },
  message: { position: 'absolute', top: 8, alignSelf: 'center', color: '#624375', backgroundColor: '#fff4e7f5', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12, fontWeight: '800', fontSize: 14, zIndex: 8 },
});
