import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image, TouchableOpacity, View } from 'react-native';
import { MenuFrame } from './MenuFrame';
import { furnitureImages, navigationImages } from '../data/assetImages';
import { styles } from '../styles/components/appBottomMenu.styles';
import { useScenePresentation } from '../context/ScenePresentation';
import { useFullScreenRoute } from '../presentation/usePresentation';
import { RootStackParamList } from '../types';
import { useGameAudio } from '../context/AudioContext';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

export function AppBottomMenu({ onOpenHouse }: { onOpenHouse?: () => void } = {}) {
  const navigation = useNavigation<Navigation>();
  const route = useRoute();
  const { playSound } = useGameAudio();
  const fullScreen = useFullScreenRoute();
  const { activity } = useScenePresentation();
  if (fullScreen || activity) return null;

  const menuItems = [
    { routeName: 'Map' as const, label: 'Mapa', image: navigationImages.map },
    { routeName: 'Pet' as const, label: 'Mascota', image: navigationImages.pet },
    { routeName: 'House' as const, label: 'Casa', image: navigationImages.house },
    { routeName: 'Shop' as const, label: 'Tienda', image: navigationImages.shop },
  ];

  return (
    <View testID="app-bottom-menu" style={styles.menu}>
      <MenuFrame kind="bottom" />
      {menuItems.map((item) => {
        const active = route.name === item.routeName || (item.routeName === 'Map' && route.name === 'CityMap') || (item.routeName === 'Shop' && route.name === 'ShopCategory');

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={item.label}
            aria-selected={active}
            key={item.routeName}
            onPress={() => { playSound('tap'); if (item.routeName === 'House') { if (onOpenHouse) onOpenHouse(); else navigation.navigate('House', { room: 'inside' }); } else navigation.navigate(item.routeName); }}
            style={[styles.button, active && styles.activeButton]}
          >
            <Image accessible={false} resizeMode="contain" source={item.image} style={styles.icon} />
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity accessibilityRole="button" accessibilityLabel="Juguetes" aria-selected={['Toys', 'ToyGame'].includes(route.name)} onPress={() => { playSound('tap'); navigation.navigate('Toys'); }} style={[styles.button, ['Toys', 'ToyGame'].includes(route.name) && styles.activeButton]}>
        <Image accessible={false} testID="toys-menu-art" resizeMode="contain" source={navigationImages.toys} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity accessibilityRole="button" accessibilityLabel="Álbum de figuritas" aria-selected={route.name === 'Album'} onPress={() => { playSound('tap'); navigation.navigate('Album'); }} style={[styles.button, route.name === 'Album' && styles.activeButton]}>
        <Image accessible={false} testID="album-menu-art" resizeMode="contain" source={navigationImages.album} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity accessibilityRole="button" accessibilityLabel="Biblioteca" aria-selected={['Library', 'Audiobook'].includes(route.name)} onPress={() => { playSound('tap'); navigation.navigate('Library'); }} style={[styles.button, ['Library', 'Audiobook'].includes(route.name) && styles.activeButton]}>
        <Image accessible={false} testID="library-menu-art" resizeMode="contain" source={furnitureImages['bookcase-open']} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
}
