import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  saveError: { color: '#9c3c23', fontSize: 14, fontWeight: '700', textAlign: 'center', padding: 6 },
  header: {
    backgroundColor: 'transparent',
    minHeight: 72,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  titleGroup: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 4,
    marginLeft: 12,
  },
  title: {
    color: '#372413',
    flex: 1,
    fontSize: 24,
    fontWeight: '900',
  },
});
