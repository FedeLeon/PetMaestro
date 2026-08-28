import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppBottomMenu } from '../components/AppBottomMenu';
import { CoinBadge } from '../components/CoinBadge';
import { HeaderBackButton } from '../components/HeaderBackButton';
import { PetCat } from '../components/PetCat';
import { useProgress } from '../context/ProgressContext';
import { catItemImages } from '../data/assetImages';
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

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.stage}>
          <PetCat equippedCatItems={progress.equippedCatItems} equippedItemId={progress.equippedItemId} />
        </View>

        <Text style={styles.sectionTitle}>Items comprados</Text>
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
      <AppBottomMenu />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 128,
  },
  emptyBox: {
    backgroundColor: '#ffffff',
    borderColor: '#f0dcc0',
    borderRadius: 8,
    borderWidth: 2,
    padding: 18,
    width: '100%',
  },
  emptyText: {
    color: '#6c5a42',
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
    textAlign: 'center',
  },
  equippedCard: {
    borderColor: '#ff7a59',
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
  itemCard: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#f0dcc0',
    borderRadius: 8,
    borderWidth: 2,
    flexBasis: '31%',
    height: 112,
    justifyContent: 'center',
    padding: 12,
  },
  itemName: {
    color: '#372413',
    fontSize: 13,
    fontWeight: '900',
    marginTop: 6,
    textAlign: 'center',
  },
  itemPreview: {
    alignItems: 'center',
    borderRadius: 8,
    height: 58,
    justifyContent: 'center',
    paddingHorizontal: 8,
    width: '100%',
  },
  itemPreviewImage: {
    height: 54,
    width: '100%',
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  screen: {
    backgroundColor: '#fff7e8',
    flex: 1,
  },
  sectionTitle: {
    color: '#372413',
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 12,
  },
  stage: {
    alignItems: 'center',
    backgroundColor: '#dff4ff',
    borderColor: '#9ed3ea',
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: 'center',
    marginBottom: 24,
    minHeight: 300,
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
