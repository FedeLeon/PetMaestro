import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { Image, ImageBackground, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { AppBottomMenu } from '../components/AppBottomMenu';
import { AppTopMenu } from '../components/AppTopMenu';
import { useProgress } from '../context/ProgressContext';
import { catItemImages, farmAnimalImages, furnitureImages, shopImages, uiImages } from '../data/assetImages';
import { shopCategories, shopItems } from '../data/gameContent';
import { styles } from '../styles/screens/shopCategoryScreen.styles';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'ShopCategory'>;

export function ShopCategoryScreen({ route }: Props) {
  const { buyItem, progress } = useProgress();
  const [message, setMessage] = useState('');
  const [displayLayout, setDisplayLayout] = useState({ height: 0, width: 0 });
  const category = shopCategories.find((item) => item.id === route.params.categoryId) ?? shopCategories[0];
  const visibleItems = useMemo(() => shopItems.filter((item) => item.category === category.id), [category.id]);
  const handleBuy = async (itemId: string) => {
    const result = await buyItem(itemId);
    setMessage(result.ok ? '¡Comprado!' : result.reason ?? 'No se pudo comprar.');
  };

  return <View style={styles.screen}>
    <AppTopMenu icon={category.icon as keyof typeof MaterialCommunityIcons.glyphMap} title={category.label} />
    <ImageBackground imageStyle={styles.backgroundImage} onLayout={(event) => setDisplayLayout(event.nativeEvent.layout)} resizeMode="stretch" source={shopImages.displayCabinet} style={styles.displayScene}>
      <ScrollView contentContainerStyle={[styles.content, { paddingHorizontal: displayLayout.width * 0.18, paddingTop: displayLayout.height * 0.16 }]} showsVerticalScrollIndicator={false}>
        {message ? <Text style={styles.message}>{message}</Text> : null}
        <View style={styles.grid}>
          {visibleItems.map((item) => {
            const owned = progress.ownedItems.includes(item.id);
            const canBuy = progress.coins >= item.price;
            const itemImage = item.target === 'cat' ? catItemImages[item.id] : item.target === 'yard' ? farmAnimalImages[item.id] : furnitureImages[item.id];
            return <View key={item.id} style={styles.card}>
              <View style={styles.preview}>
                {itemImage ? <Image resizeMode="contain" source={itemImage} style={styles.previewImage} /> : <MaterialCommunityIcons color={item.color} name={item.icon as keyof typeof MaterialCommunityIcons.glyphMap} size={42} />}
              </View>
              <Text numberOfLines={1} style={styles.itemName}>{item.name.toUpperCase()}</Text>
              {owned ? <Image accessibilityLabel="Comprado" resizeMode="contain" source={uiImages.ownedCheck} style={styles.ownedCheck} /> : <>
                <View style={styles.price}><Text style={styles.priceText}>{item.price}</Text><Image resizeMode="contain" source={uiImages.goldenPawCoin} style={styles.priceCoin} /></View>
                <TouchableOpacity disabled={!canBuy} onPress={() => handleBuy(item.id)} style={[styles.buyButton, !canBuy && styles.disabledButton]}><Text style={styles.buyButtonText}>COMPRAR</Text></TouchableOpacity>
              </>}
            </View>;
          })}
        </View>
      </ScrollView>
    </ImageBackground>
    <AppBottomMenu />
  </View>;
}
