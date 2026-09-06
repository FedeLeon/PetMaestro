import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
  brushCursor: { position: 'absolute', zIndex: 8 },
  dirtClip: { position: 'absolute', overflow: 'hidden' },
  plaque: { width: '100%', height: '100%' },
  brushFoam: { position: 'absolute', width: 24, height: 12, backgroundColor: '#f0ffff', borderRadius: 12, opacity: .85 },
  selectedTool: { backgroundColor: '#def3e6', borderColor: '#4aa994' },
  tools: { flex: 1, maxHeight: 140, minHeight: 44, alignSelf: 'stretch', flexDirection: 'row', gap: 4 },
  toolAction: { flex: 1, minHeight: 44, maxHeight: 140, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center', borderRadius: 12, borderWidth: 2, borderColor: 'transparent', overflow: 'hidden' },
  toothpasteAsset: { height: '100%', width: '70%' },
  toothbrushAsset: { height: '100%', width: '100%' },
});
