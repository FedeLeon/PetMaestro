import { Image, StyleSheet, View } from 'react-native';
import { uiImages, wordImages } from '../data/assetImages';
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

const styles = StyleSheet.create({
  drawing: {
    alignItems: 'center',
    aspectRatio: 1,
    borderColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 4,
    justifyContent: 'center',
    minWidth: 110,
    overflow: 'hidden',
    padding: 12,
    position: 'relative',
    width: '100%',
  },
  cardFrame: {
    height: '100%',
    position: 'absolute',
    width: '100%',
    zIndex: 2,
  },
  image: {
    height: '100%',
    width: '100%',
  },
  imagePlate: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.78)',
    borderRadius: 8,
    height: '100%',
    justifyContent: 'center',
    padding: 10,
    width: '100%',
  },
  small: {
    borderWidth: 3,
    minWidth: 74,
    padding: 7,
  },
  smallImagePlate: {
    padding: 6,
  },
});
