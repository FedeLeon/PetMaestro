import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Image, ImageBackground, Text, TouchableOpacity, View } from 'react-native';
import { AppBottomMenu } from '../components/AppBottomMenu';
import { AppTopMenu } from '../components/AppTopMenu';
import { useProgress } from '../context/ProgressContext';
import { shopCategoryImages, shopImages } from '../data/assetImages';
import { gardenImages } from '../data/gardenContent';
import { shopCategories, shopItems } from '../data/gameContent';
import { styles } from '../styles/screens/shopScreen.styles';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Shop'>;
const categoryPositions = [
  { x: 0.43, y: 0.34 }, { x: 0.545, y: 0.34 }, { x: 0.66, y: 0.34 }, { x: 0.775, y: 0.34 },
  { x: 0.43, y: 0.56 }, { x: 0.545, y: 0.56 }, { x: 0.66, y: 0.56 }, { x: 0.775, y: 0.56 }, { x: .90, y: .56 },
];

export function ShopScreen({ navigation }: Props) {
  const { progress } = useProgress();
  const [sceneLayout, setSceneLayout] = useState({ height: 0, width: 0 });
  const buttonSize = Math.max(98, Math.min(156, sceneLayout.width * 0.126));

  return <View style={styles.screen}>
    <AppTopMenu icon="storefront" title="Tienda" />
    <ImageBackground imageStyle={styles.backgroundImage} onLayout={(event) => setSceneLayout(event.nativeEvent.layout)} resizeMode="stretch" source={shopImages.interior} style={styles.scene}>
      {shopCategories.map((category, index) => {
        const position = categoryPositions[index];
        const itemsCount = shopItems.filter((item) => item.category === category.id).length;
        const ownedCount = shopItems.filter((item) => item.category === category.id && progress.ownedItems.includes(item.id)).length;
        if (!position) return null;
        return <TouchableOpacity
          accessibilityLabel={`Abrir ${category.label}`}
          accessibilityRole="button"
          key={category.id}
          onPress={() => navigation.navigate('ShopCategory', { categoryId: category.id })}
          style={[styles.categoryButton, { borderColor: category.color, borderRadius: 10, height: buttonSize, left: sceneLayout.width * position.x - buttonSize / 2, top: sceneLayout.height * position.y - buttonSize / 2, width: buttonSize }]}
        >
          <View style={[styles.categoryIcon, { backgroundColor: category.color, borderRadius: 7 }]}>
            {(category.id === 'flowers' ? gardenImages['flower-daisies'] : shopCategoryImages[category.id]) ? <Image resizeMode="contain" source={category.id === 'flowers' ? gardenImages['flower-daisies'] : shopCategoryImages[category.id]} style={styles.categoryAsset} /> : <MaterialCommunityIcons color="#ffffff" name={category.icon as keyof typeof MaterialCommunityIcons.glyphMap} size={32} />}
          </View>
          <Text numberOfLines={1} style={styles.categoryTitle}>{category.label.toUpperCase()}</Text>
          <Text style={styles.categoryMeta}>{ownedCount}/{itemsCount}</Text>
        </TouchableOpacity>;
      })}
    </ImageBackground>
    <AppBottomMenu />
  </View>;
}
