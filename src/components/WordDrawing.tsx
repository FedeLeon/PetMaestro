import { Image, View } from 'react-native';
import { uiImages, wordImages } from '../data/assetImages';
import { styles } from '../styles/components/wordDrawing.styles';
import { WordCard } from '../types';

type WordDrawingProps = {
  word: WordCard;
  small?: boolean;
};

export function WordDrawing({ word, small = false }: WordDrawingProps) {
  return (
    <View style={[styles.drawing, small && styles.small, { backgroundColor: word.color }]}>
      <View style={[styles.imagePlate, small && styles.smallImagePlate]}>
        <Image resizeMode="contain" source={wordImages[word.id]} style={styles.image} />
      </View>
      <Image resizeMode="contain" source={uiImages.wordCardFrame} style={styles.cardFrame} />
    </View>
  );
}
