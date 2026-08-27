import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppBottomMenu } from '../components/AppBottomMenu';
import { CoinBadge } from '../components/CoinBadge';
import { HeaderBackButton } from '../components/HeaderBackButton';
import { useProgress } from '../context/ProgressContext';
import { shopItems } from '../data/gameContent';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'House'>;

export function HouseScreen({ navigation }: Props) {
  const { progress, toggleFurniture } = useProgress();
  const [inside, setInside] = useState(false);
  const ownedFurniture = useMemo(
    () => shopItems.filter((item) => item.target === 'house' && progress.ownedItems.includes(item.id)),
    [progress.ownedItems],
  );
  const placedFurniture = ownedFurniture.filter((item) => progress.placedFurnitureIds.includes(item.id));

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <HeaderBackButton />
        <Text style={styles.title}>Casa</Text>
        <CoinBadge coins={progress.coins} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.modeRow}>
          <TouchableOpacity onPress={() => setInside(false)} style={[styles.modeButton, !inside && styles.activeMode]}>
            <MaterialCommunityIcons color={!inside ? '#ffffff' : '#26796e'} name="home" size={22} />
            <Text style={[styles.modeText, !inside && styles.activeModeText]}>Afuera</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setInside(true)} style={[styles.modeButton, inside && styles.activeMode]}>
            <MaterialCommunityIcons color={inside ? '#ffffff' : '#26796e'} name="sofa" size={22} />
            <Text style={[styles.modeText, inside && styles.activeModeText]}>Adentro</Text>
          </TouchableOpacity>
        </View>

        {inside ? (
          <View style={styles.room}>
            <View style={styles.wall}>
              <View style={styles.window}>
                <View style={styles.windowLine} />
              </View>
            </View>
            <View style={styles.floor}>
              {placedFurniture.length === 0 ? (
                <View style={styles.emptyRoom}>
                  <MaterialCommunityIcons color="#9a6b45" name="sofa-outline" size={48} />
                  <Text style={styles.emptyText}>Compra muebles en la tienda y colocalos aca.</Text>
                </View>
              ) : (
                <View style={styles.furnitureStage}>
                  {placedFurniture.map((item, index) => (
                    <View
                      key={item.id}
                      style={[
                        styles.furniturePiece,
                        { backgroundColor: item.color },
                        index % 2 === 1 && styles.furniturePieceRight,
                      ]}
                    >
                      <MaterialCommunityIcons color="#ffffff" name={item.icon as keyof typeof MaterialCommunityIcons.glyphMap} size={30} />
                      <Text style={styles.furnitureLabel}>{item.label}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.exterior}>
            <View style={styles.sun} />
            <View style={styles.cloud} />
            <View style={styles.houseBody}>
              <View style={styles.roof} />
              <View style={styles.houseWall}>
                <View style={styles.smallWindow} />
                <TouchableOpacity accessibilityRole="button" onPress={() => setInside(true)} style={styles.door}>
                  <View style={styles.doorKnob} />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.tapHint}>Toca la puerta para entrar</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Mis muebles</Text>
        <View style={styles.inventoryGrid}>
          {ownedFurniture.length === 0 ? (
            <View style={styles.emptyInventory}>
              <Text style={styles.emptyText}>Todavia no compraste muebles.</Text>
            </View>
          ) : (
            ownedFurniture.map((item) => {
              const placed = progress.placedFurnitureIds.includes(item.id);

              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => toggleFurniture(item.id)}
                  style={[styles.inventoryCard, placed && styles.placedInventoryCard]}
                >
                  <View style={[styles.inventoryPreview, { backgroundColor: item.color }]}>
                    <MaterialCommunityIcons color="#ffffff" name={item.icon as keyof typeof MaterialCommunityIcons.glyphMap} size={24} />
                  </View>
                  <Text style={styles.inventoryName}>{item.name}</Text>
                  <Text style={styles.inventoryAction}>{placed ? 'Quitar' : 'Colocar'}</Text>
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
  activeMode: {
    backgroundColor: '#ff7a59',
    borderColor: '#ff7a59',
  },
  activeModeText: {
    color: '#ffffff',
  },
  cloud: {
    backgroundColor: '#ffffff',
    borderRadius: 999,
    height: 30,
    left: 30,
    position: 'absolute',
    top: 36,
    width: 90,
  },
  content: {
    padding: 20,
    paddingBottom: 128,
  },
  door: {
    alignItems: 'flex-end',
    backgroundColor: '#8d552c',
    borderColor: '#623915',
    borderRadius: 8,
    borderWidth: 3,
    height: 88,
    justifyContent: 'center',
    marginTop: 22,
    paddingRight: 8,
    width: 58,
  },
  doorKnob: {
    backgroundColor: '#ffd966',
    borderRadius: 6,
    height: 12,
    width: 12,
  },
  emptyInventory: {
    backgroundColor: '#ffffff',
    borderColor: '#f0dcc0',
    borderRadius: 8,
    borderWidth: 2,
    padding: 16,
    width: '100%',
  },
  emptyRoom: {
    alignItems: 'center',
    gap: 10,
    justifyContent: 'center',
    minHeight: 190,
    padding: 18,
  },
  emptyText: {
    color: '#6c5a42',
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
    textAlign: 'center',
  },
  exterior: {
    alignItems: 'center',
    backgroundColor: '#9edaf7',
    borderColor: '#77c1e4',
    borderRadius: 8,
    borderWidth: 2,
    height: 340,
    justifyContent: 'flex-end',
    marginBottom: 22,
    overflow: 'hidden',
    paddingBottom: 18,
  },
  floor: {
    backgroundColor: '#e8b56d',
    flex: 1,
  },
  furnitureLabel: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
    marginTop: 4,
  },
  furniturePiece: {
    alignItems: 'center',
    borderColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 3,
    justifyContent: 'center',
    minHeight: 72,
    padding: 8,
    width: '42%',
  },
  furniturePieceRight: {
    alignSelf: 'flex-end',
  },
  furnitureStage: {
    gap: 12,
    padding: 16,
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
  houseBody: {
    alignItems: 'center',
    zIndex: 2,
  },
  houseWall: {
    alignItems: 'center',
    backgroundColor: '#ffd59e',
    borderColor: '#7b4c28',
    borderRadius: 8,
    borderWidth: 4,
    height: 150,
    justifyContent: 'flex-end',
    width: 178,
  },
  inventoryAction: {
    color: '#ff7a59',
    fontSize: 14,
    fontWeight: '900',
    marginTop: 4,
  },
  inventoryCard: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#f0dcc0',
    borderRadius: 8,
    borderWidth: 2,
    flexBasis: '47%',
    flexGrow: 1,
    minHeight: 142,
    padding: 10,
  },
  inventoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  inventoryName: {
    color: '#372413',
    fontSize: 15,
    fontWeight: '900',
    marginTop: 8,
    textAlign: 'center',
  },
  inventoryPreview: {
    alignItems: 'center',
    borderRadius: 8,
    height: 54,
    justifyContent: 'center',
    width: '100%',
  },
  modeButton: {
    alignItems: 'center',
    backgroundColor: '#e8fbf7',
    borderColor: '#bde8df',
    borderRadius: 8,
    borderWidth: 2,
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 48,
  },
  modeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  modeText: {
    color: '#26796e',
    fontSize: 16,
    fontWeight: '900',
  },
  placedInventoryCard: {
    borderColor: '#57b8a9',
  },
  roof: {
    borderBottomColor: '#e06666',
    borderBottomWidth: 84,
    borderLeftColor: 'transparent',
    borderLeftWidth: 108,
    borderRightColor: 'transparent',
    borderRightWidth: 108,
    height: 0,
    marginBottom: -4,
    width: 0,
  },
  room: {
    backgroundColor: '#ffffff',
    borderColor: '#f0dcc0',
    borderRadius: 8,
    borderWidth: 2,
    height: 340,
    marginBottom: 22,
    overflow: 'hidden',
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
  smallWindow: {
    backgroundColor: '#9edaf7',
    borderColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 3,
    height: 42,
    position: 'absolute',
    right: 24,
    top: 24,
    width: 42,
  },
  sun: {
    backgroundColor: '#ffd966',
    borderColor: '#fff3b0',
    borderRadius: 38,
    borderWidth: 5,
    height: 76,
    position: 'absolute',
    right: 28,
    top: 24,
    width: 76,
  },
  tapHint: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: 8,
    color: '#372413',
    fontSize: 16,
    fontWeight: '900',
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    zIndex: 2,
  },
  title: {
    color: '#372413',
    flex: 1,
    fontSize: 24,
    fontWeight: '900',
    paddingHorizontal: 10,
    textAlign: 'center',
  },
  wall: {
    alignItems: 'flex-end',
    backgroundColor: '#ffd59e',
    borderBottomColor: '#d8a46d',
    borderBottomWidth: 3,
    height: 132,
    paddingRight: 26,
    paddingTop: 24,
  },
  window: {
    backgroundColor: '#9edaf7',
    borderColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 3,
    height: 58,
    width: 74,
  },
  windowLine: {
    backgroundColor: '#ffffff',
    height: 3,
    marginTop: 25,
    width: '100%',
  },
});
