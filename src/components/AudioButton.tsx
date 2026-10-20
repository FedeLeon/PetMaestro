import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { wordAudio } from '../data/audioAssets';
import { styles } from '../styles/components/audioButton.styles';
import { WordCard } from '../types';
import { useGameAudio } from '../context/AudioContext';

type Props = {
  word: WordCard;
  language?: 'english' | 'spanish';
  size?: number;
};

export function useWordAudio(word: WordCard, language: 'english' | 'spanish' = 'english') {
  const { speak } = useGameAudio();
  return () => { if (language === 'english') speak(word.id); };
}

export function AudioButton({ word, language = 'english', size = 42 }: Props) {
  const spokenText = language === 'english' ? word.english : word.spanish;
  const playLocalAudio = useWordAudio(word, language);
  if (language !== 'english' || !wordAudio[word.id]) return null;

  return (
    <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Escuchar ${spokenText}`} onPress={playLocalAudio} style={[styles.button, { height: Math.max(44, size), width: Math.max(44, size) }]}>
      <MaterialCommunityIcons color="#26796e" name="volume-high" size={Math.round(size * 0.52)} />
    </TouchableOpacity>
  );
}
