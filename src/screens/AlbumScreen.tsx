import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';
import { useGameAudio } from '../context/AudioContext';
import { AppTopMenu } from '../components/AppTopMenu';
import { AppBottomMenu } from '../components/AppBottomMenu';
import { AudioButton } from '../components/AudioButton';
import { WordDrawing } from '../components/WordDrawing';
import { useProgress } from '../context/ProgressContext';
import { words } from '../data/gameContent';
import { stickerUnlocked } from '../data/adventureContent';
import { styles } from '../styles/screens/adventure.styles';

export function AlbumScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Album'>) {
  const { progress } = useProgress();
  const { playSound } = useGameAudio();
  const [filter, setFilter] = useState<'all' | 'won' | 'remaining'>('all');
  const unlocked = words.filter(word => stickerUnlocked(progress.learning, word.id)).length;
  const visibleWords = words.filter(word => filter === 'all' || stickerUnlocked(progress.learning, word.id) === (filter === 'won'));
  return <View style={styles.screen}>
    <AppTopMenu compact icon="book-open-variant" title={`Álbum · ${unlocked}/${words.length} pegatinas`} />
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <View style={styles.filters}>{([{ id: 'all', label: 'Todas' }, { id: 'won', label: `Ganadas (${unlocked})` }, { id: 'remaining', label: 'Por conseguir' }] as const).map(item => <TouchableOpacity key={item.id} accessibilityRole="button" aria-pressed={filter === item.id} onPress={() => { playSound('tap'); setFilter(item.id); }} style={[styles.filter, filter === item.id && styles.filterActive]}><Text style={[styles.filterText, filter === item.id && styles.filterTextActive]}>{item.label}</Text></TouchableOpacity>)}
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Practicar palabras" onPress={() => navigation.push('Game', { levelId: 0, mode: 'review' })} style={styles.button}><Text style={styles.buttonText}>▶ Practicar palabras</Text></TouchableOpacity></View>
      {!visibleWords.length && <View style={styles.card}><Text style={styles.title}>{filter === 'won' ? '¡Tu primera pegatina te espera!' : '¡Completaste el álbum!'}</Text><Text style={styles.text}>Tocá «Practicar palabras» para seguir jugando.</Text></View>}
      <View style={styles.row}>{visibleWords.map(word => {
        const stat = progress.learning.words[word.id];
        const sticker = stickerUnlocked(progress.learning, word.id);
        return <View key={word.id} testID={`album-${word.id}`} style={styles.albumCard}>
          <View style={styles.albumPreview}><View style={[styles.sticker, !sticker && styles.stickerLocked]}><WordDrawing word={word} bare /></View><AudioButton word={word} size={44} /></View>
          <Text style={styles.text}>{word.spanish} · {word.english}</Text>
          {sticker ? <Text style={styles.filterText}>Pegatina ganada ★</Text> : <View accessibilityLabel={`${Math.min(3, stat?.correct || 0)} de 3 aciertos`} style={styles.stickerSteps}>{[0, 1, 2].map(index => <MaterialCommunityIcons key={index} name={index < (stat?.correct || 0) ? 'star' : 'star-outline'} color={index < (stat?.correct || 0) ? '#bf8200' : '#8a775e'} size={22} />)}<Text style={styles.small}>{Math.min(3, stat?.correct || 0)}/3</Text></View>}
        </View>;
      })}</View>
      <Text style={styles.small}>Reconocé una palabra tres veces para ganar su pegatina. Tocá el parlante para escucharla.</Text>
    </ScrollView>
    <AppBottomMenu />
  </View>;
}
