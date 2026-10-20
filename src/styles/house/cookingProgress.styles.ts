import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  panel: { position: 'absolute', zIndex: 15 },
  frame: { position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' },
  content: { position: 'absolute', left: '10%', right: '10%', top: '21%', bottom: '20%', justifyContent: 'center', gap: 3 },
  title: { color: '#32685e', fontWeight: '900', textAlign: 'center', flexShrink: 0 },
  bar: { height: '35%', minHeight: 13, maxHeight: 22, width: '100%' },
});
