import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAudioPlayer } from 'expo-audio';
import { TouchableOpacity } from 'react-native';
import { wordAudio } from '../data/audioAssets';
import { styles } from '../styles/components/audioButton.styles';
import { WordCard } from '../types';

type Props = {
  word: WordCard;
  language?: 'english' | 'spanish';
  size?: number;
};

export function useWordAudio(word: WordCard, language: 'english' | 'spanish' = 'english') {
  const localAudio = language === 'english' ? wordAudio[word.id] ?? null : null;
  const player = useAudioPlayer(localAudio);

  return () => {
    if (!localAudio) {
      return;
    }

    player.seekTo(0);
    player.play();
  };
}

export function AudioButton({ word, language = 'english', size = 42 }: Props) {
  const spokenText = language === 'english' ? word.english : word.spanish;
  const playLocalAudio = useWordAudio(word, language);

  return (
    <TouchableOpacity accessibilityLabel={`Escuchar ${spokenText}`} onPress={playLocalAudio} style={[styles.button, { height: size, width: size }]}>
      <MaterialCommunityIcons color="#26796e" name="volume-high" size={Math.round(size * 0.52)} />
    </TouchableOpacity>
  );
}
