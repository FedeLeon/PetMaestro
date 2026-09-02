import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '../styles/screens/gameScreen.styles';
import { useMemo, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { AppTopMenu } from '../components/AppTopMenu';
import { AudioButton, useWordAudio } from '../components/AudioButton';
import { SuccessCelebration } from '../components/PetCat';
import { WordDrawing } from '../components/WordDrawing';
import { useProgress } from '../context/ProgressContext';
import { getWord, levels, words } from '../data/gameContent';
import { uiImages } from '../data/assetImages';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Game'>;

type MatchWordOptionProps = {
  disabled: boolean;
  onPress: () => void;
  styles: typeof styles;
  word: (typeof words)[number];
};

function MatchWordOption({ disabled, onPress, styles, word }: MatchWordOptionProps) {
  const playAudio = useWordAudio(word);

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={() => {
        playAudio();
        onPress();
      }}
      style={styles.matchWordMain}
    >
      <Text style={styles.matchWordText}>{word.english.toUpperCase()}</Text>
    </TouchableOpacity>
  );
}

function shuffle<T>(items: T[]) {
  const shuffledItems = [...items];

  for (let index = shuffledItems.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffledItems[index], shuffledItems[randomIndex]] = [shuffledItems[randomIndex], shuffledItems[index]];
  }

  return shuffledItems;
}

export function GameScreen({ navigation, route }: Props) {
  const { completeLevel } = useProgress();
  const level = levels.find((item) => item.id === route.params.levelId) ?? levels[0];
  const [roundIndex, setRoundIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [disabledChoiceIds, setDisabledChoiceIds] = useState<string[]>([]);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [earnedCoins, setEarnedCoins] = useState<number | null>(null);
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  const [selectedPictureId, setSelectedPictureId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const round = level.rounds[roundIndex];
  const isFinished = earnedCoins !== null;
  const displayIds = useMemo(() => {
    const ids = round.type === 'match-pair' ? round.pairIds : round.optionIds;
    return shuffle([...ids, ...words.map((word) => word.id).filter((wordId) => !ids.includes(wordId))].slice(0, 4));
  }, [round]);
  const matchPictureIds = useMemo(() => {
    if (round.type !== 'match-pair') {
      return displayIds;
    }

    return shuffle(displayIds);
  }, [displayIds, round.type]);

  const prompt = useMemo(() => {
    if (round.type === 'match-pair') {
      return 'Une cada palabra con su dibujo';
    }

    if (round.type === 'audio-choice') {
      return 'Escucha las palabras y elige la correcta';
    }

    const answer = getWord(round.answerId);

    return round.type === 'picture-choice'
      ? 'Escucha el sonido y elige la tarjeta correcta'
      : `Que significa: ${answer.english.toUpperCase()}?`;
  }, [round]);

  const finishRound = async (wasCorrect: boolean) => {
    const nextCorrectAnswers = correctAnswers + (wasCorrect ? 1 : 0);
    setFeedback(wasCorrect ? '' : 'Intentalo de nuevo');
    setIsCelebrating(wasCorrect);

    setTimeout(async () => {
      setFeedback('');
      setIsCelebrating(false);
      setDisabledChoiceIds([]);
      setSelectedWordId(null);
      setSelectedPictureId(null);
      setMatchedIds([]);

      if (roundIndex + 1 >= level.rounds.length) {
        const coins = await completeLevel(level.id, nextCorrectAnswers, level.rounds.length);
        setCorrectAnswers(nextCorrectAnswers);
        setEarnedCoins(coins);
        return;
      }

      setCorrectAnswers(nextCorrectAnswers);
      setRoundIndex(roundIndex + 1);
    }, wasCorrect ? 900 : 650);
  };

  const handleChoice = (wordId: string) => {
    if (isCelebrating || isFinished || round.type === 'match-pair' || disabledChoiceIds.includes(wordId)) {
      return;
    }

    const wasCorrect = wordId === round.answerId;

    if (!wasCorrect && (round.type === 'picture-choice' || round.type === 'audio-choice')) {
      setDisabledChoiceIds((currentIds) => [...currentIds, wordId]);
      setFeedback('Intentalo de nuevo');
      return;
    }

    void finishRound(wasCorrect);
  };

  const rejectMatch = () => {
    setFeedback('Busca su pareja');
    setTimeout(() => {
      setFeedback('');
      setSelectedWordId(null);
      setSelectedPictureId(null);
    }, 650);
  };

  const completeMatch = (wordId: string) => {
    const nextMatchedIds = [...matchedIds, wordId];
    setMatchedIds(nextMatchedIds);
    setSelectedWordId(null);
    setSelectedPictureId(null);

    if (nextMatchedIds.length === displayIds.length) {
      void finishRound(true);
    }
  };

  const handleMatchWord = (wordId: string) => {
    if (feedback || round.type !== 'match-pair' || matchedIds.includes(wordId)) {
      return;
    }

    if (!selectedPictureId) {
      setSelectedWordId(wordId);
      return;
    }

    if (selectedPictureId !== wordId) {
      rejectMatch();
      return;
    }

    completeMatch(wordId);
  };

  const handleMatchPicture = (wordId: string) => {
    if (feedback || round.type !== 'match-pair' || matchedIds.includes(wordId)) {
      return;
    }

    if (!selectedWordId) {
      setSelectedPictureId(wordId);
      return;
    }

    if (selectedWordId !== wordId) {
      rejectMatch();
      return;
    }

    completeMatch(wordId);
  };

  const playRoundPrompt = () => {
    if (round.type === 'match-pair') {
      return;
    }

    if (round.type === 'audio-choice') {
      return;
    }

    const word = getWord(round.answerId);
    return <AudioButton word={word} size={48} />;
  };

  if (isFinished) {
    return (
      <View style={styles.screen}>
        <AppTopMenu icon={level.icon as keyof typeof MaterialCommunityIcons.glyphMap} title={level.title} />
        <View style={styles.resultArea}>
          <View style={styles.resultCard}>
            <View style={styles.resultCardInner}>
              <View style={styles.resultDecorations}>
                <MaterialCommunityIcons color="#f6c445" name="paw" size={24} />
                <MaterialCommunityIcons color="#ff7a59" name="star-four-points" size={22} />
                <MaterialCommunityIcons color="#f6c445" name="paw" size={24} />
              </View>
              <Text style={styles.resultKicker}>Nivel completo</Text>
              <Text style={styles.resultTitle}>{level.title}</Text>
              <View style={styles.resultCoinsRow}>
                <Text style={styles.resultCoins}>Ganaste {earnedCoins}</Text>
                <Image resizeMode="contain" source={uiImages.goldenPawCoin} style={styles.resultCoinImage} />
              </View>
              <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Map')}>
                <Text style={styles.primaryButtonText}>Volver al mapa</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <AppTopMenu icon={level.icon as keyof typeof MaterialCommunityIcons.glyphMap} title={level.title} />

      <View style={styles.card}>
        <View style={styles.promptRow}>
          <Text style={styles.prompt}>{prompt}</Text>
          {playRoundPrompt()}
        </View>
        {round.type === 'audio-choice' ? (
          <View style={styles.audioPromptDrawing}>
            <WordDrawing word={getWord(round.answerId)} />
          </View>
        ) : null}
        {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}

        {round.type === 'match-pair' ? (
          <View style={styles.matchBoard}>
            <View style={styles.matchColumn}>
              {displayIds.map((wordId) => {
                const word = getWord(wordId);
                const matched = matchedIds.includes(wordId);

                return (
                  <View
                    key={wordId}
                    style={[
                      styles.matchWord,
                      selectedWordId === wordId && styles.selectedMatch,
                      matched && styles.matched,
                    ]}
                  >
                    <MatchWordOption disabled={matched} onPress={() => handleMatchWord(wordId)} styles={styles} word={word} />
                    <View style={styles.matchAudioButton}>
                      <AudioButton word={word} />
                    </View>
                  </View>
                );
              })}
            </View>
            <View style={styles.matchColumn}>
              {matchPictureIds.map((wordId) => {
                const word = getWord(wordId);
                const matched = matchedIds.includes(wordId);

                return (
                  <View
                    key={wordId}
                    style={[styles.matchPicture, selectedPictureId === wordId && styles.selectedMatch, matched && styles.matched]}
                  >
                    <TouchableOpacity disabled={matched} onPress={() => handleMatchPicture(wordId)} style={styles.matchPictureMain}>
                      <View style={styles.matchPictureDrawing}>
                        <WordDrawing word={word} small />
                      </View>
                      <Text style={styles.pictureCaption}>{word.spanish.toUpperCase()}</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>
        ) : (
          <View style={styles.optionsGrid}>
            {displayIds.map((wordId) => {
              const word = getWord(wordId);
              const disabled = disabledChoiceIds.includes(wordId);
              const label =
                round.type === 'picture-choice'
                  ? word.spanish.toUpperCase()
                  : round.type === 'audio-choice'
                    ? word.english.toUpperCase()
                  : round.type === 'translation-choice'
                      ? word.spanish.toUpperCase()
                      : word.spanish.toUpperCase();

              return (
                <View
                  key={wordId}
                  style={[styles.option, round.type === 'audio-choice' && styles.audioOption, round.type === 'translation-choice' && styles.translationOption, disabled && styles.disabledOption]}
                >
                  <TouchableOpacity
                    disabled={disabled || isCelebrating}
                    onPress={() => handleChoice(wordId)}
                    style={styles.optionMain}
                  >
                    {round.type === 'picture-choice' || round.type === 'translation-choice' ? (
                      <WordDrawing word={word} small={round.type === 'translation-choice'} />
                    ) : null}
                    <Text style={styles.optionText}>{label}</Text>
                  </TouchableOpacity>
                  {round.type === 'audio-choice' ? <AudioButton word={word} language="english" /> : null}
                </View>
              );
            })}
          </View>
        )}
      </View>
      {isCelebrating ? (
        <View pointerEvents="none" style={styles.celebrationOverlay}>
          <SuccessCelebration height={280} width={420} />
        </View>
      ) : null}
    </View>
  );
}
