import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppBottomMenu } from '../components/AppBottomMenu';
import { CoinBadge } from '../components/CoinBadge';
import { HeaderBackButton } from '../components/HeaderBackButton';
import { useProgress } from '../context/ProgressContext';
import { shopCategories, shopItems } from '../data/gameContent';
import { RootStackParamList, ShopItem } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'ShopCategory'>;

export function ShopCategoryScreen({ navigation, route }: Props) {
  const { buyItem, progress } = useProgress();
  const [message, setMessage] = useState('');
  const category = shopCategories.find((item) => item.id === route.params.categoryId) ?? shopCategories[0];
  const visibleItems = useMemo(
    () => shopItems.filter((item) => item.category === category.id),
    [category.id],
  );

  const handleBuy = async (itemId: string) => {
    const result = await buyItem(itemId);
    setMessage(result.ok ? 'Listo!' : result.reason ?? 'No se pudo comprar.');
  };

  const getItemButtonLabel = (item: ShopItem) => {
    const owned = progress.ownedItems.includes(item.id);

    if (!owned) {
      return 'Comprar';
    }

    if (item.target === 'house') {
      return progress.placedFurnitureIds.includes(item.id) ? 'Quitar' : 'Colocar';
    }

    return item.slot !== 'furniture' && progress.equippedCatItems[item.slot] === item.id ? 'Quitar' : 'Usar';
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <HeaderBackButton />
        <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>
          {category.label}
        </Text>
        <CoinBadge coins={progress.coins} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.categoryIntro}>
          <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
            <MaterialCommunityIcons
              color="#ffffff"
              name={category.icon as keyof typeof MaterialCommunityIcons.glyphMap}
              size={38}
            />
          </View>
          <View style={styles.categoryCopy}>
            <Text style={styles.categoryTitle}>{category.label}</Text>
            <Text style={styles.categoryDescription}>{category.description}</Text>
          </View>
        </View>

        {message ? <Text style={styles.message}>{message}</Text> : null}

        <View style={styles.grid}>
          {visibleItems.map((item) => {
            const owned = progress.ownedItems.includes(item.id);
            const equipped =
              item.target === 'house'
                ? progress.placedFurnitureIds.includes(item.id)
                : item.slot !== 'furniture' && progress.equippedCatItems[item.slot] === item.id;
            const canBuy = progress.coins >= item.price;

            return (
              <View key={item.id} style={[styles.card, equipped && styles.equippedCard]}>
                <View style={[styles.preview, { backgroundColor: item.color }]}>
                  <MaterialCommunityIcons color="#ffffff" name={item.icon as keyof typeof MaterialCommunityIcons.glyphMap} size={30} />
                  <Text style={styles.previewText}>{item.label}</Text>
                </View>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.price}>{owned ? 'Comprado' : `${item.price} moneditas`}</Text>
                <TouchableOpacity
                  onPress={() => handleBuy(item.id)}
                  style={[
                    styles.buyButton,
                    owned && styles.ownedButton,
                    !owned && !canBuy && styles.disabledButton,
                    equipped && styles.equippedButton,
                  ]}
                >
                  <Text style={styles.buyButtonText}>{getItemButtonLabel(item)}</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>
      <AppBottomMenu />
    </View>
  );
}

const styles = StyleSheet.create({
  buyButton: {
    alignItems: 'center',
    backgroundColor: '#ff7a59',
    borderRadius: 8,
    justifyContent: 'center',
    marginTop: 12,
    minHeight: 48,
    width: '100%',
  },
  buyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
  },
  card: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#f0dcc0',
    borderRadius: 8,
    borderWidth: 2,
    flexBasis: '47%',
    flexGrow: 1,
    minHeight: 218,
    padding: 12,
  },
  categoryCopy: {
    flex: 1,
  },
  categoryDescription: {
    color: '#6c5a42',
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 21,
    marginTop: 4,
  },
  categoryIcon: {
    alignItems: 'center',
    borderRadius: 8,
    height: 82,
    justifyContent: 'center',
    width: 82,
  },
  categoryIntro: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#f0dcc0',
    borderRadius: 8,
    borderWidth: 2,
    flexDirection: 'row',
    gap: 14,
    marginBottom: 16,
    padding: 14,
  },
  categoryTitle: {
    color: '#372413',
    fontSize: 22,
    fontWeight: '900',
  },
  content: {
    padding: 20,
    paddingBottom: 128,
  },
  disabledButton: {
    backgroundColor: '#c8bba8',
  },
  equippedButton: {
    backgroundColor: '#57b8a9',
  },
  equippedCard: {
    borderColor: '#57b8a9',
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
    paddingBottom: 16,
    paddingHorizontal: 14,
    paddingTop: 54,
  },
  itemName: {
    color: '#372413',
    fontSize: 17,
    fontWeight: '900',
    marginTop: 10,
    minHeight: 42,
    textAlign: 'center',
  },
  message: {
    backgroundColor: '#d7f5cf',
    borderColor: '#5aa96a',
    borderRadius: 8,
    borderWidth: 2,
    color: '#2f6f3b',
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 14,
    padding: 12,
    textAlign: 'center',
  },
  ownedButton: {
    backgroundColor: '#6fa8dc',
  },
  preview: {
    alignItems: 'center',
    borderRadius: 8,
    height: 82,
    justifyContent: 'center',
    paddingHorizontal: 8,
    width: '100%',
  },
  previewText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
    marginTop: 5,
    textAlign: 'center',
  },
  price: {
    color: '#76624a',
    fontSize: 15,
    fontWeight: '800',
    marginTop: 4,
  },
  screen: {
    backgroundColor: '#fff7e8',
    flex: 1,
  },
  title: {
    color: '#372413',
    flex: 1,
    fontSize: 24,
    fontWeight: '900',
    paddingHorizontal: 10,
    textAlign: 'center',
  },
});
