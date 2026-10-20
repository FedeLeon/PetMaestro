import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useRef, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppTopMenu } from '../components/AppTopMenu';
import { AppBottomMenu } from '../components/AppBottomMenu';
import { useProgress } from '../context/ProgressContext';
import { missionReady, missions } from '../data/adventureContent';
import { styles } from '../styles/screens/adventure.styles';
import { ActivityKind, RootStackParamList } from '../types';
import { mapImages, navigationImages, wordImages } from '../data/assetImages';
import { useGameAudio } from '../context/AudioContext';

export function ActivitiesScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Activities'>) {
  const { progress, claimMission } = useProgress();
  const learning = progress.learning;
  const { playSound } = useGameAudio();
  const claiming = useRef(false);
  const [message, setMessage] = useState('');
  const collect = async (id: string) => {
    if (claiming.current) return;
    claiming.current = true;
    try { if (await claimMission(id)) setMessage('¡Premio recibido! Seguí explorando con tu gatito.'); }
    catch { setMessage('No se pudo guardar. Probá cobrar de nuevo.'); }
    finally { claiming.current = false; }
  };
  const go = (kind: ActivityKind) => {
    playSound('tap');
    if (kind === 'answers' || kind === 'review') navigation.push('Game', { levelId: 0, mode: 'review' });
    else if (kind === 'toy') navigation.navigate('Toys');
    else if (kind === 'city') navigation.navigate('CityMap');
    else navigation.navigate('House', { room: kind === 'meal' ? 'kitchen' : kind === 'sleep' ? 'bedroom' : kind === 'water' ? 'outside' : 'bathroom' });
  };
  return <View style={styles.screen}>
    <AppTopMenu compact icon="compass-outline" title="Aventuras y misiones" />
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <View style={styles.row}>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Repaso adaptativo" onPress={() => go('review')} style={styles.exploreCard}><Image accessible={false} source={navigationImages.map} resizeMode="contain" style={styles.exploreImage} /><View style={styles.exploreCopy}><Text style={styles.exploreTitle}>¡A practicar!</Text><Text style={styles.small}>Palabras a tu ritmo</Text></View><MaterialCommunityIcons name="chevron-right" size={24} color="#26796e" /></TouchableOpacity>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Álbum de palabras" onPress={() => { playSound('tap'); navigation.navigate('Album'); }} style={styles.exploreCard}><Image accessible={false} source={wordImages.book} resizeMode="contain" style={styles.exploreImage} /><View style={styles.exploreCopy}><Text style={styles.exploreTitle}>Mi álbum</Text><Text style={styles.small}>Coleccioná pegatinas</Text></View><MaterialCommunityIcons name="chevron-right" size={24} color="#26796e" /></TouchableOpacity>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Ciudad Gatuna" onPress={() => { playSound('tap'); navigation.navigate('CityMap'); }} style={styles.exploreCard}><Image accessible={false} source={mapImages.catCity} resizeMode="contain" style={styles.exploreImage} /><View style={styles.exploreCopy}><Text style={styles.exploreTitle}>Ciudad Gatuna</Text><Text style={styles.small}>Ayudá a tus amigos</Text></View><MaterialCommunityIcons name="chevron-right" size={24} color="#26796e" /></TouchableOpacity>
      </View>
      <Text style={styles.title}>Misiones cortas</Text>
      <Text style={styles.small}>Tocá un paso para ir a jugar. Deslizá para ver todas las misiones ↓</Text>
      {!!message && <Text accessibilityLiveRegion="polite" style={styles.badge}>{message}</Text>}
      <View style={styles.row}>{missions.map(mission => {
        const claimed = learning.claimedMissions.includes(mission.id);
        const ready = missionReady(learning, mission.id);
        const completed = mission.goals.filter(goal => (learning.counts[goal.kind] || 0) >= goal.target).length;
        return <View key={mission.id} style={styles.card}>
          <Text style={styles.title}>{mission.title}</Text>
          <Text style={styles.badge}>{claimed ? 'Misión completa ★' : `${completed}/${mission.goals.length} pasos · Premio: ${mission.reward} monedas`}</Text>
          {mission.goals.map(goal => {
            const count = Math.min(goal.target, learning.counts[goal.kind] || 0);
            return <TouchableOpacity key={goal.kind} accessibilityRole="button" accessibilityLabel={`${goal.text}: ${count} de ${goal.target}`} onPress={() => go(goal.kind)} style={styles.goal}>
              <MaterialCommunityIcons name={count >= goal.target ? 'check-circle' : 'arrow-right-circle'} color="#26796e" size={25} /><Text style={styles.goalText}>{goal.text} · {count}/{goal.target}</Text>
            </TouchableOpacity>;
          })}
          <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Cobrar misión ${mission.id}`} disabled={!ready || claimed} onPress={() => void collect(mission.id)} style={[styles.button, (!ready || claimed) && styles.disabled]}><Text style={styles.buttonText}>{claimed ? 'Premio recibido ✓' : ready ? `¡Cobrar ${mission.reward} monedas!` : 'Completá los pasos de arriba'}</Text></TouchableOpacity>
        </View>;
      })}</View>
    </ScrollView>
    <AppBottomMenu />
  </View>;
}
