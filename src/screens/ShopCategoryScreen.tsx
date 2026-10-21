import { usePresentation } from '../presentation/usePresentation';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, Image, ImageBackground, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AppBottomMenu } from '../components/AppBottomMenu';
import { AppTopMenu } from '../components/AppTopMenu';
import { ShopProductImage } from '../components/ShopProductImage';
import { ShopPageArrow } from '../components/ShopPageArrow';
import { useShopArrowBreathing } from '../components/useShopArrowBreathing';
import { shopPageArrowSize } from '../styles/components/shopPageArrow.styles';
import { useProgress } from '../context/ProgressContext';
import { useGameAudio } from '../context/AudioContext';
import { catItemImages, farmAnimalImages, furnitureImages, shopImages, uiImages } from '../data/assetImages';
import { gardenImages } from '../data/gardenContent';
import { shopCategories, shopItems } from '../data/gameContent';
import { SHOP_ASPECT, displaySlotCenters } from '../styles/screens/shop.layout';
import { styles } from '../styles/screens/shopCategoryScreen.styles';
import { RootStackParamList, ShopItem } from '../types';

export function ShopCategoryScreen({ route, navigation }: NativeStackScreenProps<RootStackParamList, 'ShopCategory'>) {
  const presentation = usePresentation();
  const { buyItem, equipItem, toggleAnimal, toggleFurniture, progress, isReady } = useProgress();
  const { playSound } = useGameAudio();
  const [message, setMessage] = useState('');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [busyId, setBusyId] = useState<string | null>(null);
  const busy = useRef(false);
  const [justBought, setJustBought] = useState<string | null>(null);
  const purchaseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (purchaseTimer.current) clearTimeout(purchaseTimer.current); }, []);
  const category = shopCategories.find(item => item.id === route.params.categoryId) ?? shopCategories[0];
  const items = shopItems.filter(item => item.category === category.id);
  const pages = Math.ceil(items.length / 3);
  const currentPage = Math.min(page, pages - 1);
  const arrowScale = useShopArrowBreathing(pages > 1 && !busyId);
  const visibleItems = items.slice(currentPage * 3, currentPage * 3 + 3);
  const width = Math.min(size.width, size.height * SHOP_ASPECT);
  const height = width / SHOP_ASPECT;
  const productHeight = presentation.layout.shopProductHeight(height);
  const fontSize = Math.max(12, Math.min(18, height * .055));
  const returnToShop = useCallback(() => navigation.popTo('Shop'), [navigation]);
  useFocusEffect(useCallback(() => {
    const back = BackHandler.addEventListener('hardwareBackPress', () => { returnToShop(); return true; });
    return () => back.remove();
  }, [returnToShop]));
  useEffect(() => { setPage(0); setMessage(''); }, [category.id]);
  const handleBuy = async (id: string) => {
    if (busy.current) return;
    busy.current = true; setBusyId(id);
    let confirming = false;
    try {
      const result = await buyItem(id);
      setMessage(result.ok ? '¡Comprado!' : result.reason ?? 'Intentá otra vez.');
      if (result.ok) {
        // The second tap of a double tap must not launch the newly owned item.
        confirming = true; setJustBought(id);
        purchaseTimer.current = setTimeout(() => { busy.current = false; setBusyId(null); setJustBought(null); purchaseTimer.current = null; }, 650);
      }
    } catch { setMessage('No se pudo guardar. Tocá para reintentar.'); }
    finally { if (!confirming) { busy.current = false; setBusyId(null); } }
  };
  const useItem = async (item: ShopItem) => {
    if (busy.current) return;
    busy.current = true; setBusyId(item.id); playSound('tap');
    try {
      if (item.category === 'cat-toys') navigation.push('ToyGame', { toyId: item.id });
      else if (item.target === 'cat' && item.slot !== 'animal' && item.slot !== 'furniture') {
        if (progress.equippedCatItems[item.slot] !== item.id) await equipItem(item.id);
        navigation.navigate('Pet');
      } else {
        if (item.target === 'house' && !progress.placedFurnitureIds.includes(item.id)) await toggleFurniture(item.id);
        if (item.target === 'yard' && !progress.placedAnimalIds.includes(item.id)) await toggleAnimal(item.id);
        navigation.navigate('House', { room: item.target === 'house' ? 'inside' : 'outside' });
      }
    } catch { setMessage('No se pudo guardar. Tocá para reintentar.'); }
    finally { busy.current = false; setBusyId(null); }
  };
  const turnPage = (next: number) => { if (busy.current || next < 0 || next >= pages) return; playSound('tap'); setMessage(''); setPage(next); };
  return <View style={styles.screen}>
    <AppTopMenu scene compact icon={category.icon as keyof typeof MaterialCommunityIcons.glyphMap} title={category.label}
      onBack={returnToShop} backLabel="Volver a la tienda" backText="Tienda" />
    <View style={presentation.styles.shopStatus}><Text accessibilityLiveRegion="polite" style={styles.message}>{message || 'Elegí algo que te guste'}</Text><Text accessibilityLiveRegion="polite" style={styles.pageCount}>{currentPage + 1} de {pages}</Text></View>
    <View testID="shop-display-scene" style={styles.scene} onLayout={event => setSize(event.nativeEvent.layout)}>
      <ImageBackground testID="shop-display-art" source={shopImages.displayCabinet} imageStyle={styles.backgroundImage} resizeMode="contain"
        style={[styles.art, { width, height, left: (size.width - width) / 2, top: (size.height - height) / 2 }]}>
        {width > 0 && visibleItems.map((item, index) => {
          const owned = progress.ownedItems.includes(item.id);
          const canBuy = progress.coins >= item.price;
          const source = item.target === 'garden' ? gardenImages[item.id] : item.target === 'cat' ? catItemImages[item.id] : item.target === 'yard' ? farmAnimalImages[item.id] : furnitureImages[item.id];
          const actionText = item.category === 'cat-toys' ? 'Jugar' : item.target === 'cat' ? 'Vestir' : item.target === 'house' ? 'Colocar' : item.target === 'garden' ? 'Cuidar' : 'Al corral';
          return <View key={item.id} testID={`shop-product-${item.id}`} style={[presentation.styles.shopProduct, { left: width * (displaySlotCenters[index] - .11), width: width * .22, height: productHeight }]}>
            <View style={styles.preview}><ShopProductImage id={item.id} source={source} /></View>
            {owned && <View accessibilityLabel="Comprado" style={styles.owned}><MaterialCommunityIcons name="check-circle" color="#26796e" size={22} /><Text style={styles.ownedText}>¡Tuyo!</Text></View>}
            <View style={styles.namePlate}><Text numberOfLines={2} style={[styles.itemName, { fontSize, lineHeight: Math.round(fontSize * 1.2) }]}>{item.name}</Text></View>
            <TouchableOpacity accessibilityRole="button" accessibilityLabel={`${owned ? actionText : 'Comprar'} ${item.name}`} accessibilityState={{ disabled: !!busyId || !isReady || !owned && !canBuy }}
              disabled={!!busyId || !isReady || !owned && !canBuy} onPress={() => void (owned ? useItem(item) : handleBuy(item.id))}
              style={[styles.buyButton, owned && styles.useButton, (!!busyId || !isReady || !owned && !canBuy) && styles.disabledButton]}>
              <Text style={styles.buyButtonText}>{justBought === item.id ? '¡Tuyo!' : busyId === item.id ? '…' : owned ? actionText : 'Comprar'}</Text>
              {!owned && <View style={styles.price}><Image source={uiImages.goldenPawCoin} style={styles.priceCoin} /><Text style={styles.buyButtonText}>{item.price}</Text></View>}
            </TouchableOpacity>
          </View>;
        })}
      </ImageBackground>
      <ShopPageArrow direction="previous" disabled={currentPage === 0 || !!busyId} onPress={() => turnPage(currentPage - 1)} size={shopPageArrowSize(size.height)} scale={arrowScale} />
      <ShopPageArrow direction="next" disabled={currentPage + 1 === pages || !!busyId} onPress={() => turnPage(currentPage + 1)} size={shopPageArrowSize(size.height)} scale={arrowScale} />
    </View>
    <AppBottomMenu />
  </View>;
}
