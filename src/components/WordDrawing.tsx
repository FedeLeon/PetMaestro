import { Image, View } from 'react-native';
import { uiImages, wordImages } from '../data/assetImages';
import { styles } from '../styles/components/wordDrawing.styles';
import { WordCard } from '../types';
import { useState } from 'react';

type WordDrawingProps = {
  word: WordCard;
  small?: boolean;
  fit?: boolean;
  bare?: boolean;
};

export function WordDrawing({ word, small = false, fit = false, bare = false }: WordDrawingProps) {
  const [side, setSide] = useState(0);
  if (bare) return <Image resizeMode="contain" source={wordImages[word.id]} style={styles.image} />;
  const card = <View style={[styles.drawing, small && styles.small, { backgroundColor: word.color }, fit && { width: side, height: side, minWidth: 0 }]}>
      <View style={[styles.imagePlate, small && styles.smallImagePlate]}>
        <Image resizeMode="contain" source={wordImages[word.id]} style={styles.image} />
      </View>
      <Image resizeMode="contain" source={uiImages.wordCardFrame} style={styles.cardFrame} />
    </View>;
  return fit ? <View style={styles.fit} onLayout={event => setSide(Math.max(0, Math.min(event.nativeEvent.layout.width, event.nativeEvent.layout.height)))}>{card}</View> : card;
}
