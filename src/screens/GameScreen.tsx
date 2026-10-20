import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '../styles/screens/gameScreen.styles';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Animated, Image, Text, TouchableOpacity, View } from 'react-native';
import { AppBottomMenu } from '../components/AppBottomMenu';
import { AppTopMenu } from '../components/AppTopMenu';
import { AudioButton, useWordAudio } from '../components/AudioButton';
import { SuccessCelebration } from '../components/PetCat';
import { WordDrawing } from '../components/WordDrawing';
import { useProgress } from '../context/ProgressContext';
import { getWord, levels, words } from '../data/gameContent';
import { uiImages } from '../data/assetImages';
import { RootStackParamList } from '../types';
import { wordAudio } from '../data/audioAssets';
import { useGameAudio } from '../context/AudioContext';
import { reviewLevelFor } from '../data/adventureContent';

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
      accessibilityRole="button"
      accessibilityLabel={`Elegir palabra ${word.english}`}
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
  const { completeLevel, completeReview, progress, recordAnswer } = useProgress();
  const { playSound } = useGameAudio();
  const review = route.params.mode === 'review';
  const [reviewLevel] = useState(() => reviewLevelFor(progress));
  const level = review ? reviewLevel : levels.find((item) => item.id === route.params.levelId) ?? levels[0];
  const [roundIndex, setRoundIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [disabledChoiceIds, setDisabledChoiceIds] = useState<string[]>([]);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [earnedCoins, setEarnedCoins] = useState<number | null>(null);
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  const [selectedPictureId, setSelectedPictureId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const locked = useRef(false);
  const madeMistake = useRef(false);
  const session = useRef(0);
  const [transitioning, setTransitioning] = useState(false);
  const entrance = useRef(new Animated.Value(1)).current;
  useFocusEffect(useCallback(() => {
    locked.current = false;
    setTransitioning(false);
    setIsCelebrating(false);
    setFeedback('');
    return () => {
      session.current += 1;
      if (timer.current) clearTimeout(timer.current);
      entrance.stopAnimation();
    };
  }, [entrance]));
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
      ? round.promptLanguage === 'spanish' ? `Buscá: ${answer.spanish.toUpperCase()}` : 'Escuchá y elegí el dibujo'
      : `¿Qué significa ${round.promptLanguage === 'english' ? answer.english.toUpperCase() : answer.spanish.toUpperCase()}?`;
  }, [round]);

  const finishRound = async (wasCorrect: boolean) => {
    if (locked.current) return;
    locked.current = true;
    setTransitioning(true);
    const currentSession = session.current;
    const nextCorrectAnswers = correctAnswers + (wasCorrect && !madeMistake.current ? 1 : 0);
    setFeedback(wasCorrect ? '' : 'Intentalo de nuevo');
    setIsCelebrating(wasCorrect);
    playSound('correct');

    timer.current = setTimeout(async () => {
      if (session.current !== currentSession) return;
      setFeedback('');
      setIsCelebrating(false);
      setDisabledChoiceIds([]);
      setSelectedWordId(null);
      setSelectedPictureId(null);
      setMatchedIds([]);

      if (roundIndex + 1 >= level.rounds.length) {
        const coins = review ? await completeReview() : await completeLevel(level.id, nextCorrectAnswers, level.rounds.length);
        if (session.current !== currentSession) return;
        setCorrectAnswers(nextCorrectAnswers);
        setEarnedCoins(coins);
        return;
      }

      setCorrectAnswers(nextCorrectAnswers);
      madeMistake.current = false;
      locked.current = false;
      setTransitioning(false);
      entrance.setValue(0);
      setRoundIndex(roundIndex + 1);
      Animated.timing(entrance, { toValue: 1, duration: 220, useNativeDriver: true }).start();
    }, wasCorrect ? 900 : 650);
  };

  const handleChoice = (wordId: string) => {
    if (locked.current || isFinished || round.type === 'match-pair' || disabledChoiceIds.includes(wordId)) {
      return;
    }

    const wasCorrect = wordId === round.answerId;
    void recordAnswer(round.answerId, wasCorrect);

    if (!wasCorrect) {
      madeMistake.current = true;
      playSound('retry');
      setDisabledChoiceIds((currentIds) => [...currentIds, wordId]);
      setFeedback('Probá otra tarjeta. ¡Vos podés!');
      return;
    }

    void finishRound(wasCorrect);
  };

  const rejectMatch = () => {
    locked.current = true;
    madeMistake.current = true;
    const practicedId = selectedWordId || selectedPictureId;
    if (practicedId) void recordAnswer(practicedId, false);
    playSound('retry');
    setFeedback('Busca su pareja');
    timer.current = setTimeout(() => {
      locked.current = false;
      setFeedback('');
      setSelectedWordId(null);
      setSelectedPictureId(null);
    }, 650);
  };

  const completeMatch = (wordId: string) => {
    void recordAnswer(wordId, true);
    const nextMatchedIds = [...matchedIds, wordId];
    setMatchedIds(nextMatchedIds);
    setSelectedWordId(null);
    setSelectedPictureId(null);

    if (nextMatchedIds.length === displayIds.length) {
      void finishRound(true);
    } else playSound('correct');
  };

  const handleMatchWord = (wordId: string) => {
    if (locked.current || round.type !== 'match-pair' || matchedIds.includes(wordId)) {
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
    if (locked.current || round.type !== 'match-pair' || matchedIds.includes(wordId)) {
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
        <AppTopMenu compact icon={level.icon as keyof typeof MaterialCommunityIcons.glyphMap} title={level.title} />
        <View style={styles.resultArea}>
          <View style={styles.resultCard}>
            <View style={styles.resultCardInner}>
              <View style={styles.resultSummary}>
              <Text style={styles.resultKicker}>{review ? 'Repaso completo' : 'Nivel completo'}</Text>
              <Text style={styles.resultTitle}>{level.title}</Text>
              <Text style={styles.progressText}>{correctAnswers} de {level.rounds.length} rondas sin ayuda</Text>
              <View style={styles.resultCoinsRow}>
                <Text style={styles.resultCoins}>Ganaste {earnedCoins}</Text>
                <Image resizeMode="contain" source={uiImages.goldenPawCoin} style={styles.resultCoinImage} />
              </View>
              </View>
              <View style={styles.resultActions}>
              <TouchableOpacity accessibilityRole="button" style={styles.primaryButton} onPress={() => navigation.navigate('Map')}>
                <Text style={styles.primaryButtonText}>Volver al mapa</Text>
              </TouchableOpacity>
              {!review && level.id < levels.length ? <TouchableOpacity accessibilityRole="button" style={styles.nextButton} onPress={() => navigation.replace('Game', { levelId: level.id + 1 })}><Text style={styles.nextButtonText}>Siguiente nivel →</Text></TouchableOpacity> : null}
              {review && <TouchableOpacity accessibilityRole="button" style={styles.nextButton} onPress={() => navigation.navigate('Album')}><Text style={styles.nextButtonText}>Ver mis pegatinas ★</Text></TouchableOpacity>}
              </View>
            </View>
          </View>
        </View>
        <AppBottomMenu />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <AppTopMenu compact icon={level.icon as keyof typeof MaterialCommunityIcons.glyphMap} title={level.title} />

      <Animated.View style={[styles.card, { opacity: entrance, transform: [{ translateX: entrance.interpolate({ inputRange: [0, 1], outputRange: [18, 0] }) }] }]}>
        <View style={styles.roundHeader}><Text style={styles.progressText}>Ronda {roundIndex + 1} de {level.rounds.length}</Text><Text style={styles.progressText}>{round.type === 'match-pair' ? `${matchedIds.length}/${displayIds.length} parejas` : 'Podés volver a intentar'}</Text></View>
        <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: level.rounds.length, now: roundIndex }} style={styles.progressTrack}><View style={[styles.progressFill, { width: `${roundIndex / level.rounds.length * 100}%` }]} /></View>
        <View style={styles.promptRow}>
          <Text style={styles.prompt}>{round.type === 'picture-choice' && round.promptLanguage === 'english' && !wordAudio[round.answerId] ? `Buscá: ${getWord(round.answerId).english.toUpperCase()}` : prompt}</Text>
          {playRoundPrompt()}
        </View>
        {round.type === 'audio-choice' ? (
          <View style={styles.audioPromptDrawing}>
            <WordDrawing word={getWord(round.answerId)} fit />
          </View>
        ) : null}
        <Text accessibilityLiveRegion="polite" style={styles.feedback}>{feedback || ' '}</Text>

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
                    <MatchWordOption disabled={matched || transitioning} onPress={() => handleMatchWord(wordId)} styles={styles} word={word} />
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
                    <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Elegir dibujo ${word.spanish}`} disabled={matched || transitioning} onPress={() => handleMatchPicture(wordId)} style={styles.matchPictureMain}>
                      <View style={styles.matchPictureDrawing}>
                        <WordDrawing word={word} bare />
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
                      ? (round.promptLanguage === 'english' ? word.spanish : word.english).toUpperCase()
                      : word.spanish.toUpperCase();

              return (
                <View
                  key={wordId}
                  style={[styles.option, round.type === 'audio-choice' && styles.audioOption, round.type === 'translation-choice' && styles.translationOption, disabled && styles.disabledOption]}
                >
                  <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel={`Elegir ${label}`}
                    disabled={disabled || transitioning}
                    onPress={() => handleChoice(wordId)}
                    style={styles.optionMain}
                  >
                    {round.type === 'picture-choice' || round.type === 'translation-choice' ? (
                      <View style={styles.optionDrawing}><WordDrawing word={word} small={round.type === 'translation-choice'} fit /></View>
                    ) : null}
                    <Text style={[styles.optionText, round.type === 'audio-choice' && styles.audioOptionText]}>{label}</Text>
                  </TouchableOpacity>
                  {round.type === 'audio-choice' ? <AudioButton word={word} language="english" /> : null}
                </View>
              );
            })}
          </View>
        )}
      </Animated.View>
      {isCelebrating ? (
        <View pointerEvents="none" style={styles.celebrationOverlay}>
          <SuccessCelebration height={280} width={420} />
        </View>
      ) : null}
    </View>
  );
}
