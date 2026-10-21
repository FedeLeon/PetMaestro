import { usePresentation } from '../presentation/usePresentation';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text, TouchableOpacity } from 'react-native';
import { RootStackParamList } from '../types';
import { styles } from '../styles/components/headerBackButton.styles';
import { useGameAudio } from '../context/AudioContext';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

export function HeaderBackButton({ onPress, label = 'Volver', text }: { onPress?: () => void; label?: string; text?: string } = {}) {
  const presentation = usePresentation();
  const navigation = useNavigation<Navigation>();
  const route = useRoute();
  const { playSound } = useGameAudio();

  const handlePress = () => {
    playSound('tap');
    if (onPress) { onPress(); return; }
    if (route.name === 'Pet' || route.name === 'House' || route.name === 'Shop') {
      navigation.navigate('Map');
      return;
    }

    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate('Map');
  };

  return (
    <TouchableOpacity accessibilityRole="button" accessibilityLabel={label} onPress={handlePress} style={[presentation.styles.backButton, text && styles.withText]}>
      <MaterialCommunityIcons color="#ffffff" name="arrow-left" size={28} />
      {text && <Text style={styles.text}>{text}</Text>}
    </TouchableOpacity>
  );
}
