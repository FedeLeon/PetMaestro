import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { AppBottomMenu } from '../components/AppBottomMenu';
import { AppTopMenu } from '../components/AppTopMenu';
import { StoryIllustration } from '../components/StoryIllustration';
import { useCareActivity } from '../components/house/useCareActivity';
import { useGameAudio } from '../context/AudioContext';
import { audiobooks, storyAudio, storyReadingMinutes, storyTime, type Audiobook } from '../data/audiobooks';
import { useStoryPlayer } from '../services/useStoryPlayer';
import { styles } from '../styles/screens/library.styles';
import { storyReaderLayout, styles as readerStyles } from '../styles/components/storyReader.styles';
import { storyReadingContent } from '../data/storyReadingContent';
import { StoryQuiz } from '../components/StoryQuiz';
import type { RootStackParamList } from '../types';
import { useProgress } from '../context/ProgressContext';
import { isStoryUnlocked } from '../data/libraryProgression';

export function AudiobookScreen({ route, navigation }: NativeStackScreenProps<RootStackParamList, 'Audiobook'>) {
  const { progress } = useProgress();
  const story = audiobooks.find(item => item.id === route.params.storyId);
  if (!story) return <View style={styles.screen}><AppTopMenu compact icon="bookshelf" title="Cuento no encontrado" onBack={() => navigation.navigate('Library')} /><AppBottomMenu /></View>;
  if (!isStoryUnlocked(story.id, progress.storyQuizResults)) return <View style={styles.screen}>
    <AppTopMenu compact icon="lock" title="Este cuento está bloqueado" onBack={() => navigation.navigate('Library')} />
    <View style={styles.lockedMessage}><MaterialCommunityIcons name="lock" size={52} color="#747b7d" /><Text style={styles.description}>Leé los cuentos anteriores y completá sus cinco preguntas para abrir este libro. ¡No hace falta acertar!</Text><TouchableOpacity accessibilityRole="button" onPress={() => navigation.navigate('Library')} style={styles.closeCredits}><Text style={styles.playText}>Volver a los libros</Text></TouchableOpacity></View>
    <AppBottomMenu />
  </View>;
  return <StoryPlayer key={story.id} story={story} onBack={() => navigation.goBack()} />;
}

function StoryPlayer({ story, onBack }: { story: Audiobook; onBack: () => void }) {
  const hasAudio = storyAudio[story.id] !== null;
  const audio = useStoryPlayer(storyAudio[story.id]);
  const { preferences, toggle, setNarrationActive } = useGameAudio();
  const care = useCareActivity();
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [credits, setCredits] = useState(false);
  const [readMode, setReadMode] = useState(!hasAudio);
  const [readingScene, setReadingScene] = useState(0);
  const [quizAttempt, setQuizAttempt] = useState<string | null>(null);
  const [readFinished, setReadFinished] = useState(false);
  const { pause } = audio;
  useEffect(() => {
    setNarrationActive(care.active);
    if (!care.active) { pause(); setCredits(false); }
    return () => { pause(); setNarrationActive(false); };
  }, [care.active, pause, setNarrationActive]);
  useEffect(() => { if (!preferences.voice || credits || quizAttempt || readMode) pause(); }, [preferences.voice, credits, quizAttempt, readMode, pause]);
  const duration = audio.duration || story.duration;
  const ended = hasAudio && audio.loaded && duration > 0 && audio.currentTime >= duration - .25;
  const { rewardAction } = useProgress();
  const rewarded = useRef(false);
  useEffect(() => {
    if (care.active && ended && !audio.playing) {
      setReadFinished(true);
      if (!rewarded.current) { rewarded.current = true; void rewardAction('story', story.id); }
    }
  }, [care.active, ended, audio.playing, rewardAction, story.id]);
  const sceneIndex = readMode ? readingScene : story.scenes.reduce((index, scene, next) => audio.currentTime >= scene.at ? next : index, 0);
  const layout = storyReaderLayout(size.width, size.height);
  const reading = storyReadingContent[story.id];
  const label = !preferences.voice ? 'Activar voz' : audio.error ? 'Reintentar' : !audio.loaded ? 'Cargando…' : audio.playing ? 'Pausar' : ended ? 'Repetir cuento' : 'Escuchar';
  const start = async () => {
    if (!care.live.current) return;
    if (!preferences.voice) { toggle('voice'); return; }
    if (audio.error) { audio.retry(); return; }
    if (audio.playing) { audio.pause(); return; }
    setReadMode(false);
    if (ended) await audio.seek(0);
    if (care.live.current) await audio.play();
  };
  const startQuiz = () => {
    if (!care.live.current || (!readMode && !readFinished)) return;
    audio.pause(); setReadFinished(true);
    if (!rewarded.current) { rewarded.current = true; void rewardAction('story', story.id); }
    setQuizAttempt(`${story.id}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`);
  };
  return <View style={styles.screen}>
    <AppTopMenu compact icon="book-open-page-variant" title={story.title} onBack={quizAttempt ? () => setQuizAttempt(null) : onBack} backLabel={quizAttempt ? 'Volver al cuento' : 'Volver a los libros'} />
    {quizAttempt ? <StoryQuiz key={quizAttempt} storyId={story.id} attemptId={quizAttempt} onReadAgain={() => setQuizAttempt(null)} onOtherBooks={onBack} /> : <View testID="story-player" style={readerStyles.reader} onLayout={event => setSize(event.nativeEvent.layout)}>
      <View style={[readerStyles.illustrationColumn, { width: layout.pictureSide }]}>
      <View testID="story-illustration" style={[styles.picture, { width: layout.pictureSide, height: layout.pictureSide }]}>
        <StoryIllustration source={story.image} index={sceneIndex} description={story.scenes[sceneIndex].description} />
        <View pointerEvents="none" style={styles.sceneBadge}><Text style={styles.badgeText}>{sceneIndex + 1} / 3</Text></View>
      </View>
      {readMode && <TouchableOpacity accessibilityRole="button" accessibilityLabel="Siguiente ilustración" onPress={() => setReadingScene(current => (current + 1) % story.scenes.length)} style={readerStyles.sceneButton}><MaterialCommunityIcons name="image-multiple-outline" size={22} color="#26796e" /><Text style={readerStyles.sceneLabel}>Ver dibujo</Text></TouchableOpacity>}
      <TouchableOpacity accessibilityRole="button" accessibilityLabel="Créditos del cuento" onPress={() => setCredits(true)} style={styles.creditsButton}><Text numberOfLines={2} style={styles.creditsLabel}>{hasAudio ? `Voz: ${story.narrator}` : 'Versión para leer'} ⓘ</Text></TouchableOpacity>
      </View>
      <View style={readerStyles.textColumn}>
        <ScrollView testID="story-text" accessibilityLabel={`Texto completo: ${story.title}`} style={readerStyles.textPanel} contentContainerStyle={readerStyles.textContent}>
          <Text accessibilityRole="header" style={readerStyles.textHeading}>{story.title}</Text>
          {reading.paragraphs.map((paragraph, index) => <Text selectable key={index} style={readerStyles.paragraph}>{paragraph}</Text>)}
          <Text style={readerStyles.moral}>Moraleja: {reading.moral}</Text>
          <Text style={readerStyles.hint}>Fin del cuento · {story.author}</Text>
        </ScrollView>
        {hasAudio && audio.error && <Text accessibilityLiveRegion="polite" style={readerStyles.hint}>El audio no se pudo abrir. Podés reintentar o leer el texto.</Text>}
        {hasAudio && <View testID="story-progress" accessibilityRole="progressbar" accessibilityLabel="Progreso del cuento" aria-valuemin={0} aria-valuemax={Math.ceil(duration)} aria-valuenow={Math.floor(audio.currentTime)} style={styles.timeline}><View style={[styles.elapsed, { width: `${Math.min(100, audio.currentTime / duration * 100)}%` }]} /></View>}
        {hasAudio ? <><Text numberOfLines={1} style={readerStyles.hint}>{story.voiceDescription}</Text><View style={readerStyles.controls}>
          <TouchableOpacity testID="story-play" accessibilityRole="button" accessibilityLabel={label} disabled={!care.active || (!audio.loaded && !audio.error && preferences.voice)} onPress={() => void start()} style={[readerStyles.play, !audio.loaded && !audio.error && readerStyles.disabled]}><MaterialCommunityIcons name={audio.playing ? 'pause' : 'play'} size={24} color="#fff9e8" /><Text style={readerStyles.playText}>{label}</Text></TouchableOpacity>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel="Leer yo" accessibilityState={{ selected: readMode }} onPress={() => { audio.pause(); setReadMode(true); }} style={[readerStyles.play, readerStyles.read]}><MaterialCommunityIcons name="book-open-variant" size={22} color="#26796e" /><Text style={readerStyles.readText}>Leer yo</Text></TouchableOpacity>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel="Retroceder 10 segundos" disabled={!audio.loaded} onPress={() => void audio.seek(Math.max(0, audio.currentTime - 10))} style={[readerStyles.iconButton, !audio.loaded && styles.disabled]}><MaterialCommunityIcons name="rewind-10" size={24} color="#26796e" /></TouchableOpacity>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel="Avanzar 10 segundos" disabled={!audio.loaded} onPress={() => void audio.seek(Math.min(duration, audio.currentTime + 10))} style={[readerStyles.iconButton, !audio.loaded && styles.disabled]}><MaterialCommunityIcons name="fast-forward-10" size={24} color="#26796e" /></TouchableOpacity>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel="Volver al principio" disabled={!audio.loaded} onPress={() => void audio.seek(0)} style={[readerStyles.iconButton, !audio.loaded && styles.disabled]}><MaterialCommunityIcons name="restart" size={24} color="#26796e" /></TouchableOpacity>
          <Text numberOfLines={1} style={readerStyles.time}>{storyTime(audio.currentTime)} / {storyTime(duration)}</Text>
        </View></> : <Text testID="story-reading-only" style={readerStyles.hint}>Para leer en pantalla o en voz alta · ~{storyReadingMinutes(story.id)} minutos</Text>}
        <TouchableOpacity accessibilityRole="button" accessibilityLabel={readMode ? 'Terminé de leer: responder cinco preguntas' : 'Responder cinco preguntas'} disabled={!care.active || (!readMode && !readFinished)} onPress={startQuiz} style={[readerStyles.quizButton, !readMode && !readFinished && readerStyles.disabled]}><MaterialCommunityIcons name="comment-question-outline" size={22} color="#26796e" /><Text style={readerStyles.quizLabel}>{readMode ? 'Terminé de leer · 5 preguntas' : readFinished ? '¡Cuento terminado! · 5 preguntas' : 'Al terminar: 5 preguntas con premio'}</Text></TouchableOpacity>
      </View>
    </View>}
    <AppBottomMenu />
    <Modal visible={credits} transparent animationType="fade" onRequestClose={() => setCredits(false)} supportedOrientations={['landscape']}>
      <View style={styles.creditsBackdrop}><View accessibilityViewIsModal style={styles.creditsCard}>
        <Text style={styles.description}>{story.title}</Text>
        <Text style={styles.caption}>Autor: {story.author}.{hasAudio ? ` Narración: ${story.narrator}, para LibriVox. ${story.voiceDescription}.` : ''}</Text>
        <Text style={styles.caption}>{story.credits}</Text>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Cerrar créditos" onPress={() => setCredits(false)} style={styles.closeCredits}><Text style={styles.playText}>Volver al cuento</Text></TouchableOpacity>
      </View></View>
    </Modal>
  </View>;
}
