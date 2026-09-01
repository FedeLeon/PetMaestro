import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '../styles/screens/shopScreen.styles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { AppBottomMenu } from '../components/AppBottomMenu';
import { AppTopMenu } from '../components/AppTopMenu';
import { useProgress } from '../context/ProgressContext';
import { shopCategoryImages } from '../data/assetImages';
import { shopCategories, shopItems } from '../data/gameContent';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Shop'>;

export function ShopScreen({ navigation }: Props) {
  const { progress } = useProgress();

  return (
    <View style={styles.screen}>
      <AppTopMenu icon="storefront" title="Tienda" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.subtitle}>Elegi una categoria para ver sus items.</Text>

        <View style={styles.grid}>
          {shopCategories.map((category) => {
            const itemsCount = shopItems.filter((item) => item.category === category.id).length;
            const ownedCount = shopItems.filter(
              (item) => item.category === category.id && progress.ownedItems.includes(item.id),
            ).length;

            return (
              <TouchableOpacity
                accessibilityRole="button"
                key={category.id}
                onPress={() => navigation.navigate('ShopCategory', { categoryId: category.id })}
                style={styles.categoryCard}
              >
                <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                  {shopCategoryImages[category.id] ? (
                    <Image resizeMode="contain" source={shopCategoryImages[category.id]} style={styles.categoryAsset} />
                  ) : (
                    <MaterialCommunityIcons
                      color="#ffffff"
                      name={category.icon as keyof typeof MaterialCommunityIcons.glyphMap}
                      size={36}
                    />
                  )}
                </View>
                <Text style={styles.categoryTitle}>{category.label}</Text>
                <Text style={styles.categoryDescription} numberOfLines={2}>
                  {category.description}
                </Text>
                <Text style={styles.categoryMeta}>
                  {ownedCount}/{itemsCount} comprados
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
      <AppBottomMenu />
    </View>
  );
}
