import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppBottomMenu } from '../components/AppBottomMenu';
import { CoinBadge } from '../components/CoinBadge';
import { HeaderBackButton } from '../components/HeaderBackButton';
import { useProgress } from '../context/ProgressContext';
import { shopCategories, shopItems } from '../data/gameContent';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Shop'>;

export function ShopScreen({ navigation }: Props) {
  const { progress } = useProgress();

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <HeaderBackButton />
        <View style={styles.titleGroup}>
          <MaterialCommunityIcons color="#26796e" name="storefront" size={28} />
          <Text style={styles.title}>Tienda</Text>
        </View>
        <CoinBadge coins={progress.coins} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.subtitle}>Elegi una categoria para ver sus items.</Text>

        <View style={styles.grid}>
          {shopCategories.map((category) => {
            const itemsCount = shopItems.filter((item) => item.category === category.id).length;
            const ownedCount = shopItems.filter(
              (item) => item.category === category.id && progress.ownedItems.includes(item.id),
            ).length;

            return (
              <TouchableOpacity
                accessibilityRole="button"
                key={category.id}
                onPress={() => navigation.navigate('ShopCategory', { categoryId: category.id })}
                style={styles.categoryCard}
              >
                <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                  <MaterialCommunityIcons
                    color="#ffffff"
                    name={category.icon as keyof typeof MaterialCommunityIcons.glyphMap}
                    size={36}
                  />
                </View>
                <Text style={styles.categoryTitle}>{category.label}</Text>
                <Text style={styles.categoryDescription} numberOfLines={2}>
                  {category.description}
                </Text>
                <Text style={styles.categoryMeta}>
                  {ownedCount}/{itemsCount} comprados
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
      <AppBottomMenu />
    </View>
  );
}

const styles = StyleSheet.create({
  categoryCard: {
    alignItems: 'center',
    aspectRatio: 1,
    backgroundColor: '#ffffff',
    borderColor: '#f0dcc0',
    borderRadius: 8,
    borderWidth: 2,
    flexBasis: '47%',
    justifyContent: 'space-between',
    padding: 10,
  },
  categoryDescription: {
    color: '#6c5a42',
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 16,
    marginTop: 4,
    textAlign: 'center',
  },
  categoryIcon: {
    alignItems: 'center',
    borderRadius: 8,
    height: 60,
    justifyContent: 'center',
    width: '100%',
  },
  categoryMeta: {
    color: '#ff7a59',
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'center',
  },
  categoryTitle: {
    color: '#372413',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 4,
    textAlign: 'center',
  },
  content: {
    padding: 20,
    paddingBottom: 128,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomColor: '#f0dcc0',
    borderBottomWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 8,
    paddingHorizontal: 14,
    paddingTop: 8,
  },
  screen: {
    backgroundColor: '#fff7e8',
    flex: 1,
  },
  subtitle: {
    color: '#6c5a42',
    fontSize: 17,
    fontWeight: '800',
    lineHeight: 24,
    marginBottom: 14,
  },
  title: {
    color: '#372413',
    flex: 1,
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'left',
  },
  titleGroup: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 2,
  },
});
