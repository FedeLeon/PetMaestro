import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
  chainHit: { position: 'absolute', left: '64%', top: '18%', width: '23%', height: '39%', minWidth: 44, minHeight: 44, zIndex: 4 },
  asset: { width: '100%', height: '100%' },
  flushWindow: { position: 'absolute', left: '66%', top: '59%', width: '25%', aspectRatio: 1, borderRadius: 200, borderColor: '#fff6df', borderWidth: 6, backgroundColor: '#83d9e8', overflow: 'hidden' },
  paw: { position: 'absolute', width: '16%', height: '24%', top: '42.5%' },
  pawDirt: { position: 'absolute', left: '30%', top: '48%', width: '43%', height: '43%' },
  pawFoam: { position: 'absolute', left: '20%', top: '50%', width: '60%', height: '45%' },
  pawClean: { position: 'absolute', right: '12%', bottom: '2%', color: '#ffffff', backgroundColor: '#238a76', borderRadius: 12, fontSize: 16, fontWeight: '900', paddingHorizontal: 4 },
  curtainRail: { position: 'absolute', left: '12%', right: '35%', top: '43%', height: 5, borderRadius: 4, backgroundColor: '#ffe9ad' },
  actionCopy: { flexShrink: 1, alignItems: 'center' },
  showerLabel: { color: '#237d75', fontSize: 12, fontWeight: '800', textAlign: 'center' },
});
