import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image, TouchableOpacity, View } from 'react-native';
import { navigationImages } from '../data/assetImages';
import { styles } from '../styles/components/appBottomMenu.styles';
import { RootStackParamList } from '../types';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

export function AppBottomMenu() {
  const navigation = useNavigation<Navigation>();
  const route = useRoute();

  const menuItems = [
    { routeName: 'Map' as const, label: 'Mapa', image: navigationImages.map },
    { routeName: 'Pet' as const, label: 'Mascota', image: navigationImages.pet },
    { routeName: 'House' as const, label: 'Casa', image: navigationImages.house },
    { routeName: 'Shop' as const, label: 'Tienda', image: navigationImages.shop },
  ];

  return (
    <View style={styles.menu}>
      {menuItems.map((item) => {
        const active = route.name === item.routeName || (item.routeName === 'Map' && route.name === 'CityMap') || (item.routeName === 'Shop' && route.name === 'ShopCategory');

        return (
          <TouchableOpacity
            accessibilityRole="button"
            key={item.routeName}
            onPress={() => navigation.navigate(item.routeName)}
            style={[styles.button, active && styles.activeButton]}
          >
            <Image accessibilityLabel={item.label} resizeMode="contain" source={item.image} style={styles.icon} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
