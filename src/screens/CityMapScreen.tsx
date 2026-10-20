import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ImageBackground, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppBottomMenu } from '../components/AppBottomMenu';
import { AppTopMenu } from '../components/AppTopMenu';
import { mapImages } from '../data/assetImages';
import { styles } from '../styles/screens/adventure.styles';
import { useProgress } from '../context/ProgressContext';
import { cityActivities } from '../data/adventureContent';
import { RootStackParamList } from '../types';

export function CityMapScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'CityMap'>) {
  const { progress } = useProgress();
  const unlocked = progress.completedLevels.includes(11);
  return <View style={styles.screen}>
    <AppTopMenu compact icon="city-variant-outline" title="Ciudad Gatuna" />
    <ImageBackground imageStyle={styles.citySceneImage} resizeMode="cover" source={mapImages.catCity} style={styles.cityScene}>
      <ScrollView contentContainerStyle={styles.cityCards}>
        <Text style={styles.title}>{unlocked ? '¡La ciudad te necesita!' : 'Completá el nivel 11 para entrar'}</Text>
        <Text style={styles.small}>3 encargos · 15 monedas por lugar, una sola vez.</Text>
        <View style={styles.row}>{cityActivities.map(activity => <View key={activity.id} style={styles.cityCard}>
          <View style={styles.goal}><MaterialCommunityIcons name={activity.icon} size={26} color="#26796e" /><Text style={styles.cityTitle}>{activity.name}</Text></View>
          <Text style={styles.small}>{activity.welcome}</Text>
          {progress.learning.cityCompleted.includes(activity.id) && <Text style={styles.badge}>Encargo completado ★</Text>}
          <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Visitar ${activity.name}`} disabled={!unlocked} style={[styles.button, !unlocked && styles.disabled]} onPress={() => navigation.push('CityActivity', { activityId: activity.id })}><Text style={styles.buttonText}>{unlocked ? 'Ayudar' : 'Bloqueado'}</Text></TouchableOpacity>
        </View>)}</View>
      </ScrollView>
    </ImageBackground>
    <AppBottomMenu />
  </View>;
}
