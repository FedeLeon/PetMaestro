import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '../types';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

export function AppBottomMenu() {
  const navigation = useNavigation<Navigation>();
  const route = useRoute();

  const menuItems = [
    { routeName: 'Pet' as const, label: 'Mascota', icon: 'cat' },
    { routeName: 'House' as const, label: 'Casa', icon: 'home-heart' },
    { routeName: 'Shop' as const, label: 'Tienda', icon: 'storefront' },
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
            <MaterialCommunityIcons
              color={active ? '#ffffff' : '#26796e'}
              name={item.icon as keyof typeof MaterialCommunityIcons.glyphMap}
              size={28}
            />
            <Text style={[styles.label, active && styles.activeLabel]}>{item.label}</Text>
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
  activeLabel: {
    color: '#ffffff',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#e8fbf7',
    borderColor: '#bde8df',
    borderRadius: 8,
    borderWidth: 2,
    flex: 1,
    flexDirection: 'column',
    gap: 8,
    justifyContent: 'center',
    minHeight: 58,
  },
  label: {
    color: '#26796e',
    fontSize: 13,
    fontWeight: '900',
  },
  menu: {
    backgroundColor: '#ffffff',
    borderTopColor: '#f0dcc0',
    borderTopWidth: 2,
    bottom: 0,
    flexDirection: 'row',
    gap: 12,
    left: 0,
    padding: 16,
    position: 'absolute',
    right: 0,
  },
});
