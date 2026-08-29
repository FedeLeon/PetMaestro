import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '../styles/screens/petScreen.styles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, ImageBackground, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { AppBottomMenu } from '../components/AppBottomMenu';
import { CoinBadge } from '../components/CoinBadge';
import { HeaderBackButton } from '../components/HeaderBackButton';
import { PetCat } from '../components/PetCat';
import { useProgress } from '../context/ProgressContext';
import { catItemImages, petImages } from '../data/assetImages';
import { shopItems } from '../data/gameContent';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Pet'>;

export function PetScreen({ navigation }: Props) {
  const { equipItem, progress } = useProgress();
  const ownedCatItems = progress.ownedItems.filter((itemId) => {
    const item = shopItems.find((entry) => entry.id === itemId);
    return item?.target === 'cat' && item.slot !== 'furniture' && item.slot !== 'animal';
  });

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <HeaderBackButton />
        <View style={styles.titleGroup}>
          <MaterialCommunityIcons color="#26796e" name="cat" size={28} />
          <Text style={styles.title}>Mi gatito</Text>
        </View>
        <CoinBadge coins={progress.coins} />
      </View>

      <View style={styles.stage}>
        <ImageBackground
          imageStyle={styles.stageBackgroundImage}
          resizeMode="cover"
          source={petImages.dressingRoom}
          style={styles.stageBackground}
        >
          <PetCat equippedCatItems={progress.equippedCatItems} equippedItemId={progress.equippedItemId} />
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
              ownedCatItems.map((itemId) => {
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
                    <Text style={styles.itemName}>{item.name}</Text>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </ScrollView>
      </View>
      <AppBottomMenu />
    </View>
  );
}
