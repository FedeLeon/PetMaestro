import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { AppBottomMenu } from '../components/AppBottomMenu';
import { AppTopMenu } from '../components/AppTopMenu';
import { StoryIllustration } from '../components/StoryIllustration';
import { useGameAudio } from '../context/AudioContext';
import { useProgress } from '../context/ProgressContext';
import { uiImages } from '../data/assetImages';
import { STORY_GROUP_COUNT, STORY_GROUP_SIZE, libraryGroupCompleted, libraryGroupUnlocked, storyIsCompleted, unlockedLibraryGroups } from '../data/libraryProgression';
import { audiobooks, storyReadingMinutes, storyTime } from '../data/audiobooks';
import { libraryLayout, styles } from '../styles/screens/library.styles';
import type { RootStackParamList } from '../types';

export function LibraryScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Library'>) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const { playSound } = useGameAudio();
  const { progress } = useProgress();
  const unlocked = unlockedLibraryGroups(progress.storyQuizResults);
  const [group, setGroup] = useState(unlocked - 1);
  const previousUnlocked = useRef(unlocked);
  useEffect(() => {
    if (unlocked > previousUnlocked.current) setGroup(unlocked - 1);
    previousUnlocked.current = unlocked;
  }, [unlocked]);
  const available = libraryGroupUnlocked(group, progress.storyQuizResults);
  const completed = libraryGroupCompleted(group, progress.storyQuizResults);
  const books = audiobooks.slice(group * STORY_GROUP_SIZE, (group + 1) * STORY_GROUP_SIZE);
  const layout = libraryLayout(size.width, size.height);
  return <View style={styles.screen}>
    <AppTopMenu compact icon="bookshelf" title="Biblioteca de cuentos" />
    <View testID="library-books" style={styles.body} onLayout={event => setSize(event.nativeEvent.layout)}>
      <View style={styles.shelfHeader}>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Grupo anterior de cuentos" disabled={group === 0} onPress={() => { playSound('tap'); setGroup(current => current - 1); }} style={[styles.pageArrow, group === 0 && styles.disabled]}><Image accessible={false} source={uiImages.shopPageArrow} resizeMode="contain" style={[styles.arrowArt, styles.arrowBack]} /></TouchableOpacity>
        <View style={styles.shelfHeading}><Text accessibilityLiveRegion="polite" testID="library-group" style={styles.intro}>Estante {group + 1} de {STORY_GROUP_COUNT} · {completed}/4 terminados</Text><Text numberOfLines={2} style={styles.unlockHint}>{available ? completed === 4 ? '¡Muy bien! Podés volver a leerlos cuando quieras.' : 'Leé y respondé las 5 preguntas de cada cuento. ¡No importa acertar!' : `Completá los cuatro cuentos del estante ${group} para abrir estos libros.`}</Text></View>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Grupo siguiente de cuentos" disabled={group === STORY_GROUP_COUNT - 1} onPress={() => { playSound('tap'); setGroup(current => current + 1); }} style={[styles.pageArrow, group === STORY_GROUP_COUNT - 1 && styles.disabled]}><Image accessible={false} source={uiImages.shopPageArrow} resizeMode="contain" style={styles.arrowArt} /></TouchableOpacity>
      </View>
      <View style={styles.shelf}>{books.map(story => <TouchableOpacity key={story.id} testID={`story-book-${story.id}`} accessibilityRole="button" accessibilityState={{ disabled: !available }} disabled={!available} accessibilityLabel={`${available ? story.narrator ? 'Leer o escuchar' : 'Leer' : 'Bloqueado:'} ${story.title}`} accessibilityHint={available ? `${story.narrator ? `${storyTime(story.duration)} de audio` : `${storyReadingMinutes(story.id)} minutos de lectura aproximada`}. ${story.description}` : `Completá las preguntas de los cuatro cuentos del estante ${group}.`} activeOpacity={.8}
        onPress={() => { if (available) { playSound('tap'); navigation.navigate('Audiobook', { storyId: story.id }); } }} style={[styles.book, { width: layout.cardWidth, backgroundColor: story.color }, !available && styles.lockedBook]}>
        <View style={[styles.bookArt, { width: layout.illustrationSide, height: layout.illustrationSide }, !available && styles.lockedArt]}>{available ? <StoryIllustration source={story.image} description={story.scenes[0].description} /> : <MaterialCommunityIcons name="lock" size={Math.min(52, layout.illustrationSide * .6)} color="#747b7d" />}</View>
        <Text numberOfLines={2} style={[styles.bookTitle, { fontSize: layout.titleSize }, !available && styles.lockedTitle]}>{story.title}</Text>
        <View style={[styles.listenBadge, !available && styles.lockedBadge]}><MaterialCommunityIcons name={!available ? 'lock' : storyIsCompleted(story.id, progress.storyQuizResults) ? 'check-circle' : story.narrator ? 'headphones' : 'book-open-variant'} size={20} color={available ? '#26796e' : '#626b70'} /><Text style={[styles.badgeText, !available && styles.lockedTitle]}>{!available ? 'Bloqueado' : storyIsCompleted(story.id, progress.storyQuizResults) ? 'Terminado' : story.narrator ? `Audio · ${storyTime(story.duration)}` : `Leer · ~${storyReadingMinutes(story.id)} min`}</Text></View>
      </TouchableOpacity>)}</View>
    </View>
    <AppBottomMenu />
  </View>;
}
