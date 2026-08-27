import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppBottomMenu } from '../components/AppBottomMenu';
import { CoinBadge } from '../components/CoinBadge';
import { HeaderBackButton } from '../components/HeaderBackButton';
import { PetCat } from '../components/PetCat';
import { useProgress } from '../context/ProgressContext';
import { shopItems } from '../data/gameContent';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Pet'>;

export function PetScreen({ navigation }: Props) {
  const { equipItem, progress, resetProgress } = useProgress();
  const ownedCatItems = progress.ownedItems.filter((itemId) => {
    const item = shopItems.find((entry) => entry.id === itemId);
    return item?.target === 'cat' && item.slot !== 'furniture';
  });

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <HeaderBackButton />
        <Text style={styles.title}>Mi gatito</Text>
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

              if (!item || item.target !== 'cat' || item.slot === 'furniture') {
                return null;
              }

              const equipped = progress.equippedCatItems[item.slot] === item.id;

              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => equipItem(equipped ? null : item.id)}
                  style={[styles.itemCard, equipped && styles.equippedCard]}
                >
                  <View style={[styles.itemPreview, { backgroundColor: item.color }]}>
                    <Text style={styles.itemPreviewText}>{item.label}</Text>
                  </View>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemAction}>{equipped ? 'Quitar' : 'Usar'}</Text>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        <TouchableOpacity style={styles.resetButton} onPress={resetProgress}>
          <Text style={styles.resetButtonText}>Reiniciar progreso</Text>
        </TouchableOpacity>
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
    paddingBottom: 16,
    paddingHorizontal: 14,
    paddingTop: 54,
  },
  itemAction: {
    color: '#ff7a59',
    fontSize: 15,
    fontWeight: '900',
    marginTop: 6,
  },
  itemCard: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#f0dcc0',
    borderRadius: 8,
    borderWidth: 2,
    flexBasis: '47%',
    flexGrow: 1,
    minHeight: 150,
    padding: 12,
  },
  itemName: {
    color: '#372413',
    fontSize: 16,
    fontWeight: '900',
    marginTop: 8,
    textAlign: 'center',
  },
  itemPreview: {
    alignItems: 'center',
    borderRadius: 8,
    height: 62,
    justifyContent: 'center',
    paddingHorizontal: 8,
    width: '100%',
  },
  itemPreviewText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  resetButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    minHeight: 44,
  },
  resetButtonText: {
    color: '#9a6b45',
    fontSize: 15,
    fontWeight: '800',
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
    paddingHorizontal: 10,
    textAlign: 'center',
  },
});
