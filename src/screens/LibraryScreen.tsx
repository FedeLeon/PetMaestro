import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { AppBottomMenu } from '../components/AppBottomMenu';
import { AppTopMenu } from '../components/AppTopMenu';
import { StoryIllustration } from '../components/StoryIllustration';
import { useGameAudio } from '../context/AudioContext';
import { useProgress } from '../context/ProgressContext';
import { STORY_GROUP_SIZE, isStoryUnlocked, storyIsCompleted } from '../data/libraryProgression';
import { audiobooks, storyReadingMinutes, storyTime } from '../data/audiobooks';
import { libraryLayout, styles } from '../styles/screens/library.styles';
import type { RootStackParamList } from '../types';

export function LibraryScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Library'>) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const { playSound } = useGameAudio();
  const { progress } = useProgress();
  const completed = audiobooks.filter(story => storyIsCompleted(story.id, progress.storyQuizResults)).length;
  const layout = libraryLayout(size.width, size.height);
  return <View style={styles.screen}>
    <AppTopMenu compact icon="bookshelf" title="Biblioteca de cuentos" />
    <View testID="library-books" style={styles.body} onLayout={event => setSize(event.nativeEvent.layout)}>
      <View style={styles.shelfHeader}>
        <View style={styles.shelfHeading}><Text accessibilityLiveRegion="polite" testID="library-group" style={styles.intro}>{completed} de {audiobooks.length} cuentos terminados</Text><Text numberOfLines={2} style={styles.unlockHint}>{completed === audiobooks.length ? '¡Completaste la biblioteca! Podés volver a leer todos los cuentos.' : 'Cada 4 cuentos y sus preguntas, abrís 4 más. ¡No importa acertar!'}</Text></View>
      </View>
      <ScrollView testID="library-scroll" style={styles.bookList} contentContainerStyle={styles.shelf}>{audiobooks.map((story, index) => {
        const available = isStoryUnlocked(story.id, progress.storyQuizResults);
        const group = Math.floor(index / STORY_GROUP_SIZE);
        return <TouchableOpacity key={story.id} testID={`story-book-${story.id}`} accessibilityRole="button" accessibilityState={{ disabled: !available }} disabled={!available} accessibilityLabel={`${available ? story.narrator ? 'Leer o escuchar' : 'Leer' : 'Bloqueado:'} ${story.title}`} accessibilityHint={available ? `${story.narrator ? `${storyTime(story.duration)} de audio` : `${storyReadingMinutes(story.id)} minutos de lectura aproximada`}. ${story.description}` : `Completá las preguntas de los cuatro cuentos del grupo ${group}.`} activeOpacity={.8}
        onPress={() => { if (available) { playSound('tap'); navigation.navigate('Audiobook', { storyId: story.id }); } }} style={[styles.book, { width: layout.cardWidth, backgroundColor: story.color }, !available && styles.lockedBook]}>
        <View style={[styles.bookArt, { width: layout.illustrationSide, height: layout.illustrationSide }, !available && styles.lockedArt]}>{available ? <StoryIllustration source={story.image} description={story.scenes[0].description} /> : <MaterialCommunityIcons name="lock" size={Math.min(52, layout.illustrationSide * .6)} color="#747b7d" />}</View>
        <Text numberOfLines={2} style={[styles.bookTitle, { fontSize: layout.titleSize }, !available && styles.lockedTitle]}>{story.title}</Text>
        <View style={[styles.listenBadge, !available && styles.lockedBadge]}><MaterialCommunityIcons name={!available ? 'lock' : storyIsCompleted(story.id, progress.storyQuizResults) ? 'check-circle' : story.narrator ? 'headphones' : 'book-open-variant'} size={20} color={available ? '#26796e' : '#626b70'} /><Text style={[styles.badgeText, !available && styles.lockedTitle]}>{!available ? 'Bloqueado' : storyIsCompleted(story.id, progress.storyQuizResults) ? 'Terminado' : story.narrator ? `Audio · ${storyTime(story.duration)}` : `Leer · ~${storyReadingMinutes(story.id)} min`}</Text></View>
      </TouchableOpacity>;
      })}</ScrollView>
    </View>
    <AppBottomMenu />
  </View>;
}
