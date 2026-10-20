import { useRef, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useProgress } from '../context/ProgressContext';
import { useGameAudio } from '../context/AudioContext';
import { useCareActivity } from './house/useCareActivity';
import { storyReadingContent } from '../data/storyReadingContent';
import { uiImages } from '../data/assetImages';
import type { StoryId } from '../data/audiobooks';
import { STORY_GROUP_COUNT, STORY_GROUP_SIZE, libraryGroupUnlocked, storyOrder } from '../data/libraryProgression';
import { styles } from '../styles/components/storyQuiz.styles';

export function StoryQuiz({ storyId, attemptId, onReadAgain, onOtherBooks }: { storyId: StoryId; attemptId: string; onReadAgain: () => void; onOtherBooks: () => void }) {
  const { completeStoryQuiz, progress } = useProgress();
  const group = Math.floor(storyOrder.indexOf(storyId) / STORY_GROUP_SIZE);
  const nextWasLocked = useRef(group + 1 < STORY_GROUP_COUNT && !libraryGroupUnlocked(group + 1, progress.storyQuizResults));
  const { playSound } = useGameAudio();
  const care = useCareActivity();
  const questions = storyReadingContent[storyId].questions;
  const [answers, setAnswers] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const locked = useRef(false);
  const submitting = useRef(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [result, setResult] = useState<{ coins: number; score: number } | null>(null);
  const question = questions[index];
  const correct = question.answerId === selected;
  const choose = (id: string) => {
    if (!care.live.current || locked.current || submitting.current) return;
    locked.current = true; setSelected(id); setAnswers(current => [...current, id]);
    playSound(id === question.answerId ? 'correct' : 'retry');
  };
  const next = async () => {
    if (!care.live.current || !selected || submitting.current || !locked.current) return;
    locked.current = false;
    if (index < questions.length - 1) { setIndex(current => current + 1); setSelected(null); locked.current = false; return; }
    submitting.current = true; setBusy(true); setError(false);
    try {
      const earned = await completeStoryQuiz(storyId, answers, attemptId);
      if (care.live.current) { if (earned) setResult(earned); else setError(true); }
    } catch { if (care.live.current) setError(true); }
    finally { submitting.current = false; if (care.live.current) { setBusy(false); locked.current = true; } }
  };
  if (result) return <View testID="story-quiz-result" style={styles.root}><View style={styles.result}>
    <Text style={styles.resultTitle}>¡Terminaste las cinco preguntas!</Text>
    <Text style={styles.resultText}>Acertaste {result.score} de 5 en el primer intento</Text>
    {nextWasLocked.current && libraryGroupUnlocked(group + 1, progress.storyQuizResults) && <Text accessibilityLiveRegion="polite" style={styles.resultText}>¡Desbloqueaste cuatro cuentos nuevos!</Text>}
    <View style={styles.reward}><Image accessible={false} source={uiImages.goldenPawCoin} resizeMode="contain" style={styles.coin} /><Text style={styles.resultText}>{result.coins ? `Ganaste ${result.coins} moneditas` : 'Premio de esta ronda ya recibido'}</Text></View>
    <View style={styles.resultButtons}><TouchableOpacity accessibilityRole="button" accessibilityLabel="Volver a leer el cuento" onPress={onReadAgain} style={styles.next}><Text style={styles.nextText}>Volver al cuento</Text></TouchableOpacity><TouchableOpacity accessibilityRole="button" accessibilityLabel="Elegir otro cuento" onPress={onOtherBooks} style={styles.next}><Text style={styles.nextText}>Otros cuentos</Text></TouchableOpacity></View>
  </View></View>;
  return <View testID="story-quiz" style={styles.root}>
    <View style={styles.heading}><Text accessibilityLiveRegion="polite" style={styles.step}>Pregunta {index + 1} de 5</Text><MaterialCommunityIcons name="head-question-outline" size={26} color="#26796e" /></View>
    <View style={styles.card}>
      <ScrollView key={index} style={styles.scroll} contentContainerStyle={styles.content}>
        <Text accessibilityRole="header" style={styles.question}>{question.prompt}</Text>
        <View style={styles.options}>{question.options.map(option => <TouchableOpacity key={option.id} accessibilityRole="button" accessibilityLabel={`Responder: ${option.text}`} accessibilityState={{ selected: selected === option.id, disabled: !!selected }} disabled={!!selected} activeOpacity={.8} onPress={() => choose(option.id)} style={[styles.option, !!selected && option.id === question.answerId && styles.correct, selected === option.id && !correct && styles.incorrect]}>
          <Text style={styles.optionText}>{selected && option.id === question.answerId ? '✓ ' : ''}{option.text}</Text>
        </TouchableOpacity>)}</View>
        {selected && <Text accessibilityLiveRegion="polite" style={styles.explanation}>{correct ? '¡Muy bien! ' : 'Vamos a aprender: '}{question.explanation}</Text>}
      </ScrollView>
      {error && <Text accessibilityLiveRegion="polite" style={styles.explanation}>No pudimos terminar la ronda. Tocá de nuevo para reintentar.</Text>}
      <TouchableOpacity accessibilityRole="button" accessibilityLabel={index === 4 ? 'Terminar preguntas y recibir monedas' : 'Siguiente pregunta'} disabled={!selected || busy} onPress={() => void next()} style={[styles.next, (!selected || busy) && styles.disabled]}><Text style={styles.nextText}>{busy ? 'Guardando…' : index === 4 ? '¡Terminar y recibir monedas!' : 'Siguiente pregunta'}</Text></TouchableOpacity>
    </View>
  </View>;
}
