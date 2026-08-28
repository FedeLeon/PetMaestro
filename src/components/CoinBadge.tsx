import { Image, StyleSheet, Text, View } from 'react-native';
import { uiImages } from '../data/assetImages';

type CoinBadgeProps = {
  coins: number;
};

export function CoinBadge({ coins }: CoinBadgeProps) {
  return (
    <View style={styles.badge}>
      <Image resizeMode="contain" source={uiImages.goldenPawCoin} style={styles.coin} />
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
    height: 28,
    width: 28,
  },
  text: {
    color: '#513b13',
    fontSize: 18,
    fontWeight: '900',
  },
});
