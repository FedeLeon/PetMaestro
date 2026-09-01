import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  cardFrame: { height: '100%', position: 'absolute', width: '100%', zIndex: 2 },
  drawing: {
    alignItems: 'center', aspectRatio: 1, borderColor: '#ffffff', borderRadius: 8, borderWidth: 4,
    justifyContent: 'center', minWidth: 110, overflow: 'hidden', padding: 12, position: 'relative', width: '100%',
  },
  image: { height: '100%', width: '100%' },
  imagePlate: {
    alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.78)', borderRadius: 8,
    height: '100%', justifyContent: 'center', padding: 10, width: '100%',
  },
  small: { borderWidth: 3, minWidth: 74, padding: 7 },
  smallImagePlate: { padding: 6 },
});
