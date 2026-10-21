import { Image, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { needsImages } from '../data/assetImages';
import { styles } from '../styles/components/needsMeters.styles';
import { PetNeeds, RootStackParamList } from '../types';
import { useGameAudio } from '../context/AudioContext';

type NeedsMetersProps = {
  needs: PetNeeds;
};

const meters: Array<{ key: keyof PetNeeds; label: string; color: string; image: number }> = [
  { key: 'hunger', label: 'Hambre', color: '#f3a72f', image: needsImages.hunger },
  { key: 'hygiene', label: 'Higiene', color: '#41b9d1', image: needsImages.hygiene },
  { key: 'bathroom', label: 'Baño', color: '#9b78d8', image: needsImages.bathroom },
  { key: 'play', label: 'Juego', color: '#ec6b63', image: needsImages.play },
  { key: 'energy', label: 'Energía', color: '#8dbd3f', image: needsImages.energy },
];

export function NeedsMeters({ needs }: NeedsMetersProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { playSound } = useGameAudio();
  return (
    <View accessibilityLabel="Necesidades del gatito" style={styles.container}>
      {meters.map((meter) => {
        const value = Math.round(Math.max(0, Math.min(100, needs[meter.key])));

        return (
          <TouchableOpacity accessibilityRole="button" accessibilityLabel={`${meter.label}: ${value}%`} accessibilityHint="Abrir actividad para cuidar al gatito" key={meter.key} style={styles.meter} onPress={() => {
            playSound('tap');
            if (meter.key === 'play') navigation.navigate('Map');
            else navigation.navigate('House', { room: meter.key === 'hunger' ? 'kitchen' : meter.key === 'energy' ? 'bedroom' : 'bathroom' });
          }}>
            <Image resizeMode="contain" source={meter.image} style={styles.icon} />
            <View style={styles.track}>
              <View style={[styles.fill, { backgroundColor: meter.color, width: `${value}%` }]} />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
