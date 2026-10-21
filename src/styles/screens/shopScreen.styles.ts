import { BOTTOM_MENU_HEIGHT } from '../layout';
import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff7e8' },
  scene: { flex: 1, marginBottom: BOTTOM_MENU_HEIGHT, backgroundColor: '#edc98e', overflow: 'hidden' },
  art: { position: 'absolute' },
  backgroundImage: { width: '100%', height: '100%' },
  portal: { position: 'absolute', justifyContent: 'flex-end', alignItems: 'center', minWidth: 44, minHeight: 44 },
  tag: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff3d5', borderBottomWidth: 3, borderBottomColor: '#bd8345', borderRadius: 12, paddingHorizontal: 3, minHeight: 24, width: '100%' },
  categoryTitle: { color: '#674124', fontWeight: '900', flexShrink: 1, textAlign: 'center' },
  welcome: { position: 'absolute', left: '2%', top: '5%', width: '23%', padding: 6, borderRadius: 18, backgroundColor: '#fffaf0ed', flexDirection: 'row', gap: 4, alignItems: 'center' },
  welcomeText: { color: '#26796e', fontWeight: '900', fontSize: 14, flex: 1, textAlign: 'center' },
});
