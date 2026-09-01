import { styles } from '../styles/screens/petScreen.styles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, ImageBackground, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { AppBottomMenu } from '../components/AppBottomMenu';
import { AppTopMenu } from '../components/AppTopMenu';
import { PetCat } from '../components/PetCat';
import { useProgress } from '../context/ProgressContext';
import { catItemImages, petImages } from '../data/assetImages';
import { shopCategories, shopItems } from '../data/gameContent';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Pet'>;

export function PetScreen({ navigation }: Props) {
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
      <AppTopMenu icon="cat" title="Mi gatito" />

      <View style={styles.mainArea}>
        <View style={styles.stage}>
        <ImageBackground
          imageStyle={styles.stageBackgroundImage}
          resizeMode="cover"
          source={petImages.dressingRoom}
          style={styles.stageBackground}
        >
            <View style={styles.petCatDisplay}>
              <PetCat equippedCatItems={progress.equippedCatItems} equippedItemId={progress.equippedItemId} />
            </View>
        </ImageBackground>
        </View>

      <View style={styles.itemsSection}>
        <Text style={styles.sectionTitle}>Items comprados</Text>
        <ScrollView contentContainerStyle={styles.itemsScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.itemsGrid}>
            {ownedCatItems.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>Aun no hay accesorios. Gana moneditas y visita la tienda.</Text>
              </View>
            ) : (
              ownedCatItemsByCategory.map(({ category, itemIds }) => (
                <View key={category.id} style={styles.categorySection}>
                  <Text style={styles.categorySubtitle}>{category.label.toUpperCase()}</Text>
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
                          onPress={() => equipItem(item.id)}
                          style={[styles.itemCard, equipped && styles.equippedCard]}
                        >
                          <View style={[styles.itemPreview, { backgroundColor: item.color }]}>
                            <Image resizeMode="contain" source={catItemImages[item.id]} style={styles.itemPreviewImage} />
                          </View>
                          <Text style={styles.itemName}>{item.name.toUpperCase()}</Text>
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
