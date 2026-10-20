import { StyleSheet } from 'react-native';

export const KITCHEN_ROOM_WIDTH = 760;
export const BATHROOM_ROOM_WIDTH = 720;
export const EXTERIOR_YARD_WIDTH = 960;

export const styles = StyleSheet.create({
  emptyInventory: { width: '100%', gap: 10, paddingVertical: 12 },
  emptyText: { color: '#6c5a42', fontSize: 14, textAlign: 'center' },
  shopButton: { minHeight: 44, backgroundColor: '#26796e', borderRadius: 10, alignItems: 'center', justifyContent: 'center', padding: 6 },
  shopButtonText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  contentRow: { flex: 1, flexDirection: 'row', minHeight: 0 },
  inventoryCard: { alignItems: 'center', aspectRatio: 1, backgroundColor: '#ffffff', borderColor: '#f0dcc0', borderRadius: 8, borderWidth: 2, width: '48%', flexGrow: 0, flexShrink: 0, padding: 5 },
  inventoryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 8 },
  inventoryImage: { height: '100%', width: '100%' },
  inventoryName: { color: '#372413', fontSize: 11, lineHeight: 13, fontWeight: '900', marginTop: 3, minHeight: 26, textAlign: 'center', width: '100%' },
  inventoryPreview: { alignItems: 'center', borderRadius: 6, flex: 1, minHeight: 0, justifyContent: 'center', width: '100%' },
  inventoryScroll: { paddingBottom: 128 },
  inventorySection: { backgroundColor: '#ffffff', borderLeftColor: '#f0dcc0', borderLeftWidth: 2, flex: 1, minWidth: 200, paddingHorizontal: 8, paddingTop: 8 },
  inventoryTitle: { color: '#372413', fontSize: 18, fontWeight: '900', textAlign: 'center' },
  inventoryTitleRow: { alignItems: 'center', flexDirection: 'row', gap: 5, justifyContent: 'center', marginBottom: 8 },
  placedInventoryCard: { borderColor: '#57b8a9', backgroundColor: '#e8fbf7' },
  sceneArea: { flex: 5, minWidth: 0, paddingBottom: 0, paddingHorizontal: 0, paddingTop: 0 },
  screen: { backgroundColor: '#fff7e8', flex: 1 },
});
