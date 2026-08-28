import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppBottomMenu } from '../components/AppBottomMenu';
import { CoinBadge } from '../components/CoinBadge';
import { HeaderBackButton } from '../components/HeaderBackButton';
import { useProgress } from '../context/ProgressContext';
import { catItemImages, furnitureImages, uiImages } from '../data/assetImages';
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
        <View style={styles.headerInfo}>
          <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
            <MaterialCommunityIcons
              color="#ffffff"
              name={category.icon as keyof typeof MaterialCommunityIcons.glyphMap}
              size={26}
            />
          </View>
          <View style={styles.categoryCopy}>
            <Text numberOfLines={1} style={styles.categoryTitle}>
              {category.label}
            </Text>
          </View>
        </View>
        <CoinBadge coins={progress.coins} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
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
                </View>
                <Text numberOfLines={2} style={styles.itemName}>
                  {item.name}
                </Text>
                <View style={styles.price}>
                  {owned ? (
                    <Text style={styles.priceText}>Comprado</Text>
                  ) : (
                    <>
                      <Text style={styles.priceText}>{item.price}</Text>
                      <Image resizeMode="contain" source={uiImages.goldenPawCoin} style={styles.priceCoin} />
                    </>
                  )}
                </View>
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
    marginBottom: 2,
    marginTop: 4,
    minHeight: 32,
    width: '88%',
  },
  buyButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
  },
  card: {
    alignItems: 'center',
    aspectRatio: 1,
    backgroundColor: '#ffffff',
    borderColor: '#f0dcc0',
    borderRadius: 8,
    borderWidth: 2,
    flexBasis: '47%',
    paddingBottom: 6,
    paddingHorizontal: 5,
    paddingTop: 5,
  },
  categoryIcon: {
    alignItems: 'center',
    borderRadius: 8,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  categoryCopy: {
    flex: 1,
    minWidth: 0,
  },
  content: {
    padding: 12,
    paddingBottom: 128,
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#f0dcc0',
    borderBottomWidth: 2,
    flexDirection: 'row',
    gap: 14,
    minHeight: 66,
    paddingBottom: 8,
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  headerInfo: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    minWidth: 0,
  },
  categoryTitle: {
    color: '#372413',
    fontSize: 19,
    fontWeight: '900',
    lineHeight: 23,
  },
  disabledButton: {
    backgroundColor: '#c8bba8',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  itemName: {
    color: '#372413',
    fontSize: 14,
    fontWeight: '900',
    lineHeight: 17,
    marginTop: 1,
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
    marginBottom: 2,
    marginTop: 4,
    minHeight: 32,
    width: '88%',
  },
  ownedBadgeText: {
    color: '#287568',
    fontSize: 14,
    fontWeight: '900',
  },
  ownedCard: {
    borderColor: '#57b8a9',
  },
  preview: {
    alignItems: 'center',
    borderRadius: 8,
    height: 68,
    justifyContent: 'center',
    paddingHorizontal: 8,
    width: '100%',
  },
  previewImage: {
    height: 60,
    width: '100%',
  },
  price: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
    marginTop: 0,
    minHeight: 22,
  },
  priceCoin: {
    height: 26,
    width: 26,
  },
  priceText: {
    color: '#76624a',
    fontSize: 16,
    fontWeight: '800',
  },
  screen: {
    backgroundColor: '#fff7e8',
    flex: 1,
  },
});
