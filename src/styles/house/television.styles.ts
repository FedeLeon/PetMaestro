import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  screen: { position: 'absolute', left: '16.4%', top: '17.1%', width: '68.3%', height: '31.6%', borderRadius: 3, overflow: 'hidden' },
  seatedCat: { position: 'absolute', left: 367, top: 425, width: 146, height: 140, transformOrigin: 'bottom center' },
  image: { width: '100%', height: '100%' },
  touch: { position: 'absolute', zIndex: 9, minWidth: 48, minHeight: 48 },
  status: { position: 'absolute', alignSelf: 'center', top: 8, backgroundColor: '#fff8e7', borderColor: '#d99a49', borderWidth: 2, borderRadius: 18, paddingHorizontal: 16, paddingVertical: 6 },
  statusText: { color: '#76502d', fontSize: 14, fontWeight: '800' },
});
