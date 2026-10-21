import { usePresentation } from '../presentation/usePresentation';
import { useState } from 'react';
import { styles } from '../styles/screens/petScreen.styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image, ImageBackground, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { AppBottomMenu } from '../components/AppBottomMenu';
import { AppTopMenu } from '../components/AppTopMenu';
import { PetCat } from '../components/PetCat';
import { useProgress } from '../context/ProgressContext';
import { catItemImages, petImages } from '../data/assetImages';
import { shopCategories, shopItems } from '../data/gameContent';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

export function PetScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Pet'>) {
  const presentation = usePresentation();
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const displayScale = Math.max(0, Math.min(2.4, stageSize.width / 250, stageSize.height / 335));
  const { equipItem, progress } = useProgress();
  const ownedCatItems = progress.ownedItems.filter((itemId) => {
    const item = shopItems.find((entry) => entry.id === itemId);
    return item?.target === 'cat' && item.slot !== 'furniture' && item.slot !== 'animal';
  });
  const ownedCatItemsByCategory = shopCategories
    .filter((category) => category.id !== 'furniture' && category.id !== 'pets')
    .map((category) => ({
      category,
      itemIds: ownedCatItems.filter((itemId) => shopItems.find((item) => item.id === itemId)?.category === category.id),
    }))
    .filter(({ itemIds }) => itemIds.length > 0);

  return (
    <View style={styles.screen}>
      <AppTopMenu scene compact icon="cat" title="Mi gatito" />

      <View style={styles.mainArea}>
        <View testID="wardrobe-stage" style={presentation.styles.wardrobeStage} onLayout={event => setStageSize(event.nativeEvent.layout)}>
        <ImageBackground
          imageStyle={styles.stageBackgroundImage}
          resizeMode="cover"
          source={petImages.dressingRoom}
          style={styles.stageBackground}
        >
            <View style={[styles.petCatDisplay, { transform: [{ scale: displayScale }], top: (stageSize.height - 284) / 2 + 15 * displayScale }]}>
              <PetCat equippedCatItems={progress.equippedCatItems} equippedItemId={progress.equippedItemId} />
            </View>
        </ImageBackground>
      </View>

      <View style={presentation.styles.wardrobeItems}>
        <ScrollView contentContainerStyle={styles.itemsScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.itemsGrid}>
            {ownedCatItems.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>Aun no hay accesorios. Gana moneditas y visita la tienda.</Text>
                <TouchableOpacity accessibilityRole="button" onPress={() => navigation.navigate('Shop')} style={styles.playToysButton}><Text style={styles.playToysText}>Elegir accesorios en la tienda</Text></TouchableOpacity>
              </View>
            ) : (
              ownedCatItemsByCategory.map(({ category, itemIds }) => (
                <View key={category.id} style={styles.categorySection}>
                  <View style={styles.categorySubtitleRow}>
                    <MaterialCommunityIcons color="#7d4e28" name={category.icon as keyof typeof MaterialCommunityIcons.glyphMap} size={22} />
                    <Text style={styles.categorySubtitle}>{category.label.toUpperCase()}</Text>
                  </View>
                  <View style={styles.categoryGrid}>
                    {itemIds.map((itemId) => {
                      const item = shopItems.find((entry) => entry.id === itemId);

                      if (!item || item.target !== 'cat' || item.slot === 'furniture' || item.slot === 'animal') {
                        return null;
                      }

                      const equipped = progress.equippedCatItems[item.slot] === item.id;

                      return (
                        <TouchableOpacity
                          key={item.id}
                          accessibilityRole="button"
                          accessibilityLabel={`Usar ${item.name}`}
                          accessibilityState={{ selected: equipped }}
                          aria-pressed={equipped}
                          onPress={() => equipItem(item.id)}
                          style={[styles.itemCard, equipped && styles.equippedCard]}
                        >
                          <View style={[styles.itemPreview, { backgroundColor: item.color }]}>
                            <Image resizeMode="contain" source={catItemImages[item.id]} style={styles.itemPreviewImage} />
                            {equipped && <View style={styles.wearingBadge}><MaterialCommunityIcons name="check" size={18} color="#fff" /></View>}
                          </View>
                          <Text numberOfLines={2} adjustsFontSizeToFit minimumFontScale={.85} style={styles.itemName}>{item.name.toUpperCase()}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </View>
      </View>
      <AppBottomMenu />
    </View>
  );
}
