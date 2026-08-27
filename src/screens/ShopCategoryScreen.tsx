import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppBottomMenu } from '../components/AppBottomMenu';
import { CoinBadge } from '../components/CoinBadge';
import { HeaderBackButton } from '../components/HeaderBackButton';
import { useProgress } from '../context/ProgressContext';
import { catItemImages, furnitureImages } from '../data/assetImages';
import { shopCategories, shopItems } from '../data/gameContent';
import { RootStackParamList } from '../types';

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
    setMessage(result.ok ? 'Comprado!' : result.reason ?? 'No se pudo comprar.');
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
            const canBuy = progress.coins >= item.price;
            const itemImage = item.target === 'cat' ? catItemImages[item.id] : furnitureImages[item.id];

            return (
              <View key={item.id} style={[styles.card, owned && styles.ownedCard]}>
                <View style={[styles.preview, { backgroundColor: item.color }]}>
                  {itemImage ? (
                    <Image resizeMode="contain" source={itemImage} style={styles.previewImage} />
                  ) : (
                    <MaterialCommunityIcons color="#ffffff" name={item.icon as keyof typeof MaterialCommunityIcons.glyphMap} size={30} />
                  )}
                  <Text style={styles.previewText}>{item.label}</Text>
                </View>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.price}>{owned ? 'Comprado' : `${item.price} moneditas`}</Text>
                {owned ? (
                  <View style={styles.ownedBadge}>
                    <Text style={styles.ownedBadgeText}>Comprado</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    disabled={!canBuy}
                    onPress={() => handleBuy(item.id)}
                    style={[styles.buyButton, !canBuy && styles.disabledButton]}
                  >
                    <Text style={styles.buyButtonText}>Comprar</Text>
                  </TouchableOpacity>
                )}
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
    paddingBottom: 10,
    paddingHorizontal: 14,
    paddingTop: 32,
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
  ownedBadge: {
    alignItems: 'center',
    backgroundColor: '#e4f6ef',
    borderColor: '#57b8a9',
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: 'center',
    marginTop: 12,
    minHeight: 48,
    width: '100%',
  },
  ownedBadgeText: {
    color: '#287568',
    fontSize: 16,
    fontWeight: '900',
  },
  ownedCard: {
    borderColor: '#57b8a9',
  },
  preview: {
    alignItems: 'center',
    borderRadius: 8,
    height: 82,
    justifyContent: 'center',
    paddingHorizontal: 8,
    width: '100%',
  },
  previewImage: {
    height: 52,
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
