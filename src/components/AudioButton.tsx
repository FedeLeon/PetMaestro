import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { WordCard } from '../types';

type Props = {
  word: WordCard;
  language?: 'english' | 'spanish';
  size?: number;
};

const voicePromises: Partial<Record<'english' | 'spanish', Promise<string | undefined>>> = {};

function getFemaleVoice(language: 'english' | 'spanish') {
  if (!voicePromises[language]) {
    const localePrefix = language === 'english' ? 'en' : 'es';
    voicePromises[language] = Speech.getAvailableVoicesAsync().then((voices) => {
      const matchingVoices = voices.filter((voice) => voice.language.toLowerCase().startsWith(localePrefix));
      const femaleVoice = matchingVoices
        .map((voice) => {
          const voiceText = `${voice.identifier} ${voice.name}`.toLowerCase();
          const femaleScore = /female|mujer|woman|samantha|karen|susan|google us english/.test(voiceText) ? 10 : 0;
          const localScore = /local/.test(voiceText) ? 2 : 0;
          return { voice, score: femaleScore + localScore };
        })
        .sort((left, right) => right.score - left.score)[0];

      return femaleVoice?.score ? femaleVoice.voice.identifier : undefined;
    });
  }

  return voicePromises[language];
}

export function AudioButton({ word, language = 'english', size = 42 }: Props) {
  const spokenText = language === 'english' ? word.english : word.spanish;

  const play = () => speakWord(spokenText, language);

  return (
    <TouchableOpacity accessibilityLabel={`Escuchar ${spokenText}`} onPress={play} style={[styles.button, { height: size, width: size }]}>
      <MaterialCommunityIcons color="#26796e" name="volume-high" size={Math.round(size * 0.52)} />
    </TouchableOpacity>
  );
}

export async function speakWord(text: string, language: 'english' | 'spanish' = 'english') {
    const voice = await getFemaleVoice(language);
    await Speech.stop();
    Speech.speak(text, {
      language: language === 'english' ? 'en-US' : 'es-AR',
      rate: 0.78,
      pitch: 1.05,
      voice,
    });
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#dff4ff',
    borderColor: '#77c4df',
    borderRadius: 999,
    borderWidth: 2,
    justifyContent: 'center',
  },
});
