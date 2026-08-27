import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { RootStackParamList } from '../types';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

export function HeaderBackButton() {
  const navigation = useNavigation<Navigation>();

  const handlePress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate('Map');
  };

  return (
    <TouchableOpacity accessibilityRole="button" onPress={handlePress} style={styles.button}>
      <MaterialCommunityIcons color="#ffffff" name="arrow-left" size={28} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#57b8a9',
    borderRadius: 8,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
});
