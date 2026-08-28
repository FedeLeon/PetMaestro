import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CoinBadge } from '../components/CoinBadge';
import { AudioButton, speakWord } from '../components/AudioButton';
import { HeaderBackButton } from '../components/HeaderBackButton';
import { WordDrawing } from '../components/WordDrawing';
import { useProgress } from '../context/ProgressContext';
import { getWord, levels, words } from '../data/gameContent';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Game'>;

function shuffle<T>(items: T[]) {
  const shuffledItems = [...items];

  for (let index = shuffledItems.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffledItems[index], shuffledItems[randomIndex]] = [shuffledItems[randomIndex], shuffledItems[index]];
  }

  return shuffledItems;
}

export function GameScreen({ navigation, route }: Props) {
  const { completeLevel, progress } = useProgress();
  const level = levels.find((item) => item.id === route.params.levelId) ?? levels[0];
  const [roundIndex, setRoundIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [earnedCoins, setEarnedCoins] = useState<number | null>(null);
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
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
      return 'Escucha y elige el sonido';
    }

    const answer = getWord(round.answerId);

    return round.type === 'picture-choice'
      ? `Escucha y toca: ${answer.english.toUpperCase()}`
      : `Que significa: ${answer.english.toUpperCase()}?`;
  }, [round]);

  const finishRound = async (wasCorrect: boolean) => {
    const nextCorrectAnswers = correctAnswers + (wasCorrect ? 1 : 0);
    setFeedback(wasCorrect ? 'Muy bien!' : 'Intentalo de nuevo');

    setTimeout(async () => {
      setFeedback('');
      setSelectedWordId(null);
      setMatchedIds([]);

      if (roundIndex + 1 >= level.rounds.length) {
        const coins = await completeLevel(level.id, nextCorrectAnswers, level.rounds.length);
        setCorrectAnswers(nextCorrectAnswers);
        setEarnedCoins(coins);
        return;
      }

      setCorrectAnswers(nextCorrectAnswers);
      setRoundIndex(roundIndex + 1);
    }, 650);
  };

  const handleChoice = (wordId: string) => {
    if (feedback || isFinished || round.type === 'match-pair') {
      return;
    }

    void finishRound(wordId === round.answerId);
  };

  const handleMatchPicture = (wordId: string) => {
    if (!selectedWordId || feedback || round.type !== 'match-pair') {
      return;
    }

    if (selectedWordId !== wordId) {
      setFeedback('Busca su pareja');
      setTimeout(() => {
        setFeedback('');
        setSelectedWordId(null);
      }, 650);
      return;
    }

    const nextMatchedIds = [...matchedIds, wordId];
    setMatchedIds(nextMatchedIds);
    setSelectedWordId(null);

    if (nextMatchedIds.length === displayIds.length) {
      void finishRound(true);
    }
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
        <View style={styles.topBar}>
          <HeaderBackButton />
          <View style={styles.levelInfo}>
            <Text style={styles.levelTitle}>{level.title}</Text>
            <Text style={styles.progressText}>Resultado</Text>
          </View>
          <CoinBadge coins={progress.coins} />
        </View>
        <View style={styles.resultCard}>
          <Text style={styles.resultKicker}>Nivel completo</Text>
          <Text style={styles.resultTitle}>{level.title}</Text>
          <Text style={styles.resultScore}>
            Aciertos: {correctAnswers}/{level.rounds.length}
          </Text>
          <Text style={styles.resultCoins}>Ganaste {earnedCoins} moneditas</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Map')}>
            <Text style={styles.primaryButtonText}>Volver al mapa</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Pet')}>
            <Text style={styles.secondaryButtonText}>Ver mi gatito</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <HeaderBackButton />
        <View style={styles.levelInfo}>
          <Text style={styles.levelTitle}>{level.title}</Text>
          <Text style={styles.progressText}>
            Ronda {roundIndex + 1}/{level.rounds.length}
          </Text>
        </View>
        <CoinBadge coins={progress.coins} />
      </View>

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
                    <TouchableOpacity
                      disabled={matched}
                      onPress={() => {
                        setSelectedWordId(wordId);
                        void speakWord(word.english.toUpperCase());
                      }}
                      style={styles.matchWordMain}
                    >
                      <Text style={styles.matchWordText}>{word.english.toUpperCase()}</Text>
                    </TouchableOpacity>
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
                  <View key={wordId} style={[styles.matchPicture, matched && styles.matched]}>
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
              const label =
                round.type === 'picture-choice'
                  ? word.spanish.toUpperCase()
                  : round.type === 'audio-choice'
                    ? word.english.toUpperCase()
                  : round.type === 'translation-choice'
                      ? word.spanish.toUpperCase()
                      : word.spanish.toUpperCase();

              return (
                <View key={wordId} style={[styles.option, round.type === 'translation-choice' && styles.translationOption]}>
                  <TouchableOpacity onPress={() => handleChoice(wordId)} style={styles.optionMain}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderColor: '#f0dcc0',
    borderRadius: 8,
    borderWidth: 2,
    flex: 1,
    margin: 18,
    padding: 16,
  },
  audioPromptDrawing: {
    alignSelf: 'center',
    maxWidth: 220,
    width: '48%',
  },
  feedback: {
    color: '#ff7a59',
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 12,
    minHeight: 32,
    textAlign: 'center',
  },
  levelInfo: {
    flex: 1,
    paddingHorizontal: 10,
  },
  levelTitle: {
    color: '#372413',
    fontSize: 18,
    fontWeight: '900',
  },
  matchBoard: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  matchColumn: {
    flex: 1,
    gap: 12,
  },
  matchPicture: {
    alignItems: 'center',
    backgroundColor: '#fff7e8',
    borderColor: '#f0dcc0',
    borderRadius: 8,
    borderWidth: 2,
    flex: 1,
    justifyContent: 'center',
    padding: 8,
  },
  matchPictureMain: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  matchPictureDrawing: {
    alignSelf: 'center',
    width: '92%',
  },
  matchAudioButton: {
    marginBottom: 10,
  },
  matchWord: {
    alignItems: 'center',
    backgroundColor: '#dff4ff',
    borderColor: '#9ed3ea',
    borderRadius: 8,
    borderWidth: 2,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  matchWordMain: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  matchWordText: {
    color: '#22313b',
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
  },
  matched: {
    opacity: 0.35,
  },
  option: {
    alignItems: 'center',
    backgroundColor: '#fff7e8',
    borderColor: '#f0dcc0',
    borderRadius: 8,
    borderWidth: 2,
    flexBasis: '47%',
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: 160,
    padding: 10,
  },
  optionMain: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  optionText: {
    color: '#372413',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 8,
    textAlign: 'center',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  pictureCaption: {
    color: '#6c5a42',
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 16,
    marginTop: 2,
    textAlign: 'center',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#ff7a59',
    borderRadius: 8,
    justifyContent: 'center',
    marginTop: 28,
    minHeight: 58,
    paddingHorizontal: 16,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
  },
  progressText: {
    color: '#76624a',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 2,
  },
  prompt: {
    color: '#22313b',
    fontSize: 26,
    fontWeight: '900',
    lineHeight: 33,
    marginBottom: 14,
    textAlign: 'center',
  },
  promptRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    marginBottom: 14,
  },
  resultCard: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#f0dcc0',
    borderRadius: 8,
    borderWidth: 2,
    margin: 24,
    padding: 24,
  },
  resultCoins: {
    color: '#b77900',
    fontSize: 24,
    fontWeight: '900',
    marginTop: 12,
    textAlign: 'center',
  },
  resultKicker: {
    color: '#57b8a9',
    fontSize: 18,
    fontWeight: '900',
  },
  resultScore: {
    color: '#76624a',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 12,
  },
  resultTitle: {
    color: '#372413',
    fontSize: 32,
    fontWeight: '900',
    marginTop: 8,
    textAlign: 'center',
  },
  screen: {
    backgroundColor: '#fff7e8',
    flex: 1,
    paddingTop: 12,
  },
  secondaryButton: {
    alignItems: 'center',
    borderColor: '#57b8a9',
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: 'center',
    marginTop: 12,
    minHeight: 54,
    paddingHorizontal: 16,
    width: '100%',
  },
  secondaryButtonText: {
    color: '#26796e',
    fontSize: 18,
    fontWeight: '900',
  },
  selectedMatch: {
    backgroundColor: '#ffe1d6',
    borderColor: '#ff7a59',
  },
  translationOption: {
    minHeight: 190,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 14,
  },
});
