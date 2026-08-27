import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CoinBadge } from '../components/CoinBadge';
import { HeaderBackButton } from '../components/HeaderBackButton';
import { WordDrawing } from '../components/WordDrawing';
import { useProgress } from '../context/ProgressContext';
import { getWord, levels } from '../data/gameContent';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Game'>;

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

  const prompt = useMemo(() => {
    if (round.type === 'match-pair') {
      return 'Une cada palabra con su dibujo';
    }

    const answer = getWord(round.answerId);
    const text = round.promptLanguage === 'spanish' ? answer.spanish : answer.english;

    return round.type === 'picture-choice' ? `Toca el dibujo: ${text}` : `Que significa: ${text}?`;
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

    if (nextMatchedIds.length === round.pairIds.length) {
      void finishRound(true);
    }
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
        <Text style={styles.prompt}>{prompt}</Text>
        {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}

        {round.type === 'match-pair' ? (
          <View style={styles.matchBoard}>
            <View style={styles.matchColumn}>
              {round.pairIds.map((wordId) => {
                const word = getWord(wordId);
                const matched = matchedIds.includes(wordId);

                return (
                  <TouchableOpacity
                    disabled={matched}
                    key={wordId}
                    onPress={() => setSelectedWordId(wordId)}
                    style={[
                      styles.matchWord,
                      selectedWordId === wordId && styles.selectedMatch,
                      matched && styles.matched,
                    ]}
                  >
                    <Text style={styles.matchWordText}>{word.english}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={styles.matchColumn}>
              {round.pairIds.map((wordId) => {
                const word = getWord(wordId);
                const matched = matchedIds.includes(wordId);

                return (
                  <TouchableOpacity
                    disabled={matched}
                    key={wordId}
                    onPress={() => handleMatchPicture(wordId)}
                    style={[styles.matchPicture, matched && styles.matched]}
                  >
                    <WordDrawing word={word} small />
                    <Text style={styles.pictureCaption}>{word.spanish}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ) : (
          <View style={styles.optionsGrid}>
            {round.optionIds.map((wordId) => {
              const word = getWord(wordId);
              const label =
                round.type === 'picture-choice'
                  ? word.spanish
                  : round.promptLanguage === 'spanish'
                    ? word.english
                    : word.spanish;

              return (
                <TouchableOpacity key={wordId} style={styles.option} onPress={() => handleChoice(wordId)}>
                  {round.type === 'picture-choice' ? <WordDrawing word={word} /> : null}
                  <Text style={styles.optionText}>{label}</Text>
                </TouchableOpacity>
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
    fontSize: 14,
    fontWeight: '800',
    marginTop: 5,
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
    paddingTop: 44,
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
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 14,
  },
});
