import { Image, Text, View } from 'react-native';
import { uiImages } from '../data/assetImages';
import { styles } from '../styles/components/coinBadge.styles';

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
