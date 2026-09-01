import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '../styles/screens/shopCategoryScreen.styles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { AppBottomMenu } from '../components/AppBottomMenu';
import { AppTopMenu } from '../components/AppTopMenu';
import { useProgress } from '../context/ProgressContext';
import { catItemImages, farmAnimalImages, furnitureImages, uiImages } from '../data/assetImages';
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
      <AppTopMenu
        icon={category.icon as keyof typeof MaterialCommunityIcons.glyphMap}
        title={category.label}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {message ? <Text style={styles.message}>{message}</Text> : null}

        <View style={styles.grid}>
          {visibleItems.map((item) => {
            const owned = progress.ownedItems.includes(item.id);
            const canBuy = progress.coins >= item.price;
            const itemImage = item.target === 'cat'
              ? catItemImages[item.id]
              : item.target === 'yard'
                ? farmAnimalImages[item.id]
                : furnitureImages[item.id];

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
