import { StyleSheet, Text, View } from 'react-native';

type CoinBadgeProps = {
  coins: number;
};

export function CoinBadge({ coins }: CoinBadgeProps) {
  return (
    <View style={styles.badge}>
      <Text style={styles.coin}>$</Text>
      <Text style={styles.text}>{coins}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    backgroundColor: '#fff3b0',
    borderColor: '#f6c445',
    borderRadius: 22,
    borderWidth: 2,
    flexDirection: 'row',
    gap: 8,
    minHeight: 44,
    paddingHorizontal: 14,
  },
  coin: {
    backgroundColor: '#f6c445',
    borderRadius: 14,
    color: '#744d00',
    fontSize: 18,
    fontWeight: '900',
    height: 28,
    lineHeight: 28,
    textAlign: 'center',
    width: 28,
  },
  text: {
    color: '#513b13',
    fontSize: 18,
    fontWeight: '900',
  },
});
