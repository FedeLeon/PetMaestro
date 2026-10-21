import { BOTTOM_MENU_HEIGHT } from '../layout';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  activeButton: { backgroundColor: '#ff7a59', borderColor: '#ff7a59' },
  button: {
    alignItems: 'center', backgroundColor: '#e8fbf7', borderColor: '#bde8df', borderRadius: 34,
    borderWidth: 2, height: 60, justifyContent: 'center', width: 60,
  },
  icon: { height: 54, width: 54 },
  menu: {
    alignItems: 'center', backgroundColor: 'transparent', height: BOTTOM_MENU_HEIGHT,
    bottom: 0, flexDirection: 'row', gap: 8, justifyContent: 'center', left: 0, padding: 8,
    position: 'absolute', right: 0,
  },
});
