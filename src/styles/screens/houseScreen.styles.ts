import { StyleSheet } from 'react-native';

export const KITCHEN_ROOM_WIDTH = 760;
export const BATHROOM_ROOM_WIDTH = 720;
export const EXTERIOR_YARD_WIDTH = 960;

export const styles = StyleSheet.create({
  contentRow: { flex: 1, flexDirection: 'row', minHeight: 0 },
  inventoryAnimalImage: { height: 82, width: '100%' },
  inventoryAnimalPreview: { height: 70 },
  inventoryCard: { alignItems: 'center', aspectRatio: 1, backgroundColor: '#ffffff', borderColor: '#f0dcc0', borderRadius: 8, borderWidth: 2, flexBasis: '47%', justifyContent: 'center', padding: 8 },
  inventoryFurniturePreview: { height: 70 },
  inventoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  inventoryImage: { height: 68, width: '100%' },
  inventoryName: { color: '#372413', fontSize: 12, fontWeight: '900', marginTop: 5, textAlign: 'center' },
  inventoryPreview: { alignItems: 'center', borderRadius: 8, height: 48, justifyContent: 'center', width: '100%' },
  inventoryScroll: { paddingBottom: 128 },
  inventorySection: { backgroundColor: '#ffffff', borderLeftColor: '#f0dcc0', borderLeftWidth: 2, flex: 1, minWidth: 0, paddingHorizontal: 8, paddingTop: 8 },
  inventoryTitle: { color: '#372413', fontSize: 18, fontWeight: '900', textAlign: 'center' },
  inventoryTitleRow: { alignItems: 'center', flexDirection: 'row', gap: 5, justifyContent: 'center', marginBottom: 8 },
  placedInventoryCard: { borderColor: '#57b8a9', borderWidth: 5 },
  sceneArea: { flex: 5, minWidth: 0, paddingBottom: 0, paddingHorizontal: 0, paddingTop: 0 },
  screen: { backgroundColor: '#fff7e8', flex: 1 },
});
