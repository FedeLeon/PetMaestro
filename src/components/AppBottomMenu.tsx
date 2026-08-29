import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { navigationImages } from '../data/assetImages';
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
        const active = route.name === item.routeName || (item.routeName === 'Shop' && route.name === 'ShopCategory');

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

const styles = StyleSheet.create({
  activeButton: {
    backgroundColor: '#ff7a59',
    borderColor: '#ff7a59',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#e8fbf7',
    borderColor: '#bde8df',
    borderRadius: 34,
    borderWidth: 2,
    height: 68,
    justifyContent: 'center',
    width: 68,
  },
  icon: {
    height: 48,
    width: 52,
  },
  menu: {
    backgroundColor: '#ffffff',
    borderTopColor: '#f0dcc0',
    borderTopWidth: 2,
    bottom: 0,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    left: 0,
    padding: 12,
    position: 'absolute',
    right: 0,
  },
});
