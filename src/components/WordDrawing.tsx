import { StyleSheet, Text, View } from 'react-native';
import { WordCard } from '../types';

type WordDrawingProps = {
  word: WordCard;
  small?: boolean;
};

export function WordDrawing({ word, small = false }: WordDrawingProps) {
  return (
    <View style={[styles.drawing, small && styles.small, { backgroundColor: word.color }]}>
      <View style={[styles.shape, small && styles.smallShape]} />
      <Text style={[styles.label, small && styles.smallLabel]} numberOfLines={1} adjustsFontSizeToFit>
        {word.drawing}
      </Text>
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
    padding: 10,
    width: '100%',
  },
  label: {
    color: '#263238',
    fontSize: 20,
    fontWeight: '900',
    marginTop: 6,
    textAlign: 'center',
  },
  shape: {
    backgroundColor: 'rgba(255, 255, 255, 0.78)',
    borderRadius: 999,
    height: 48,
    width: 64,
  },
  small: {
    borderWidth: 3,
    minWidth: 74,
    padding: 7,
  },
  smallLabel: {
    fontSize: 13,
  },
  smallShape: {
    height: 32,
    width: 44,
  },
});
