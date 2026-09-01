import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  activeButton: { backgroundColor: '#ff7a59', borderColor: '#ff7a59' },
  button: {
    alignItems: 'center', backgroundColor: '#e8fbf7', borderColor: '#bde8df', borderRadius: 34,
    borderWidth: 2, height: 68, justifyContent: 'center', width: 68,
  },
  icon: { height: 48, width: 52 },
  menu: {
    alignItems: 'center', backgroundColor: '#ffffff', borderTopColor: '#f0dcc0', borderTopWidth: 2,
    bottom: 0, flexDirection: 'row', gap: 8, justifyContent: 'center', left: 0, padding: 12,
    position: 'absolute', right: 0,
  },
});
