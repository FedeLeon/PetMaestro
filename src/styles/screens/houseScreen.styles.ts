import { StyleSheet } from 'react-native';

export const KITCHEN_ROOM_WIDTH = 760;
export const BATHROOM_ROOM_WIDTH = 720;
export const EXTERIOR_YARD_WIDTH = 960;

export const styles = StyleSheet.create({
  inventoryModal: { flex: 1, backgroundColor: '#193c3b66', alignItems: 'flex-end', padding: 8 },
  inventoryBackdrop: { position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 },
  inventoryToggle: { position: 'absolute', top: 10, right: 12, zIndex: 30, minHeight: 48, paddingHorizontal: 10, borderRadius: 16, borderWidth: 3, borderColor: '#e8b54e', backgroundColor: '#fff9e9', flexDirection: 'row', alignItems: 'center', gap: 6 },
  inventoryToggleArt: { width: 36, height: 36 },
  inventoryToggleText: { fontSize: 16, fontWeight: '900', color: '#32685e' },
  inventoryClose: { position: 'absolute', top: 4, right: 4, zIndex: 2, width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
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
  inventoryScroll: { paddingBottom: 12 },
  inventorySection: { backgroundColor: '#fff9ed', borderColor: '#e8b54e', borderWidth: 3, borderRadius: 18, height: '100%', width: 304, maxWidth: '70%', paddingHorizontal: 10, paddingTop: 16 },
  inventoryTitle: { color: '#372413', fontSize: 18, fontWeight: '900', textAlign: 'center' },
  inventoryTitleRow: { alignItems: 'center', flexDirection: 'row', gap: 5, justifyContent: 'center', marginBottom: 14, marginRight: 36, minHeight: 32 },
  placedInventoryCard: { borderColor: '#57b8a9', backgroundColor: '#e8fbf7' },
  sceneArea: { flex: 5, minWidth: 0, paddingBottom: 0, paddingHorizontal: 0, paddingTop: 0 },
  screen: { backgroundColor: '#fff7e8', flex: 1 },
});
