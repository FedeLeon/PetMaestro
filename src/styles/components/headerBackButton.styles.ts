import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  withText: { width: 'auto', minWidth: 100, paddingHorizontal: 10, flexDirection: 'row', gap: 4 },
  text: { color: '#ffffff', fontSize: 16, fontWeight: '900' },
  button: {
    alignItems: 'center', backgroundColor: '#57b8a9', borderRadius: 8, height: 46,
    justifyContent: 'center', width: 46,
  },
});
