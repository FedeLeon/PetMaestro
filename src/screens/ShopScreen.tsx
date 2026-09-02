import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Image, ImageBackground, Text, TouchableOpacity, View } from 'react-native';
import { AppBottomMenu } from '../components/AppBottomMenu';
import { AppTopMenu } from '../components/AppTopMenu';
import { useProgress } from '../context/ProgressContext';
import { shopCategoryImages, shopImages } from '../data/assetImages';
import { shopCategories, shopItems } from '../data/gameContent';
import { styles } from '../styles/screens/shopScreen.styles';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Shop'>;
const categoryPositions = [
  { x: 0.4, y: 0.27 }, { x: 0.56, y: 0.27 }, { x: 0.72, y: 0.27 }, { x: 0.87, y: 0.27 },
  { x: 0.4, y: 0.66 }, { x: 0.56, y: 0.66 }, { x: 0.72, y: 0.66 }, { x: 0.87, y: 0.66 },
];

export function ShopScreen({ navigation }: Props) {
  const { progress } = useProgress();
  const [sceneLayout, setSceneLayout] = useState({ height: 0, width: 0 });
  const buttonSize = Math.max(84, Math.min(132, sceneLayout.width * 0.105));

  return <View style={styles.screen}>
    <AppTopMenu icon="storefront" title="Tienda" />
    <ImageBackground imageStyle={styles.backgroundImage} onLayout={(event) => setSceneLayout(event.nativeEvent.layout)} resizeMode="stretch" source={shopImages.interior} style={styles.scene}>
      <View pointerEvents="none" style={styles.prompt}><Text style={styles.promptText}>ELIGE UNA CATEGORIA</Text></View>
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
          style={[styles.categoryButton, { borderColor: category.color, borderRadius: buttonSize / 2, height: buttonSize, left: sceneLayout.width * position.x - buttonSize / 2, top: sceneLayout.height * position.y - buttonSize / 2, width: buttonSize }]}
        >
          <View style={[styles.categoryIcon, { backgroundColor: category.color, borderRadius: buttonSize / 2 }]}>
            {shopCategoryImages[category.id] ? <Image resizeMode="contain" source={shopCategoryImages[category.id]} style={styles.categoryAsset} /> : <MaterialCommunityIcons color="#ffffff" name={category.icon as keyof typeof MaterialCommunityIcons.glyphMap} size={32} />}
          </View>
          <Text numberOfLines={1} style={styles.categoryTitle}>{category.label.toUpperCase()}</Text>
          <Text style={styles.categoryMeta}>{ownedCount}/{itemsCount}</Text>
        </TouchableOpacity>;
      })}
    </ImageBackground>
    <AppBottomMenu />
  </View>;
}
