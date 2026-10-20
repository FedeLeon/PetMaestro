import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native';
import { AppBottomMenu } from '../components/AppBottomMenu';
import { AppTopMenu } from '../components/AppTopMenu';
import { shopImages } from '../data/assetImages';
import { shopCategories } from '../data/gameContent';
import { useGameAudio } from '../context/AudioContext';
import { SHOP_ASPECT, shopPortals } from '../styles/screens/shop.layout';
import { styles } from '../styles/screens/shopScreen.styles';
import { RootStackParamList } from '../types';

export function ShopScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Shop'>) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const { playSound } = useGameAudio();
  const width = Math.min(size.width, size.height * SHOP_ASPECT);
  const height = width / SHOP_ASPECT;
  return <View style={styles.screen}>
    <AppTopMenu compact icon="storefront" title="La tienda de nuestros amigos" />
    <View testID="shop-explore-scene" style={styles.scene} onLayout={event => setSize(event.nativeEvent.layout)}>
      <ImageBackground testID="shop-explore-art" source={shopImages.interior} resizeMode="contain" imageStyle={styles.backgroundImage}
        style={[styles.art, { width, height, left: (size.width - width) / 2, top: (size.height - height) / 2 }]}>
        <View pointerEvents="none" style={styles.welcome}><MaterialCommunityIcons name="hand-pointing-up" size={24} color="#26796e" /><Text style={styles.welcomeText}>¡Tocá un objeto!</Text></View>
        {width > 0 && shopCategories.map(category => {
          const portal = shopPortals[category.id];
          return <TouchableOpacity key={category.id} testID={`shop-portal-${category.id}`} accessibilityRole="button"
            accessibilityLabel={`Abrir ${category.label}`} accessibilityHint={category.description} activeOpacity={.65}
            onPress={() => { playSound('tap'); navigation.navigate('ShopCategory', { categoryId: category.id }); }}
            style={[styles.portal, { left: width * (portal.x - portal.width / 2), top: height * portal.y, width: width * portal.width, height: height * portal.height }]}>
            <View style={styles.tag}><Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={.8} style={[styles.categoryTitle, { fontSize: Math.max(11, Math.min(17, width * .016)) }]}>{category.label}</Text></View>
          </TouchableOpacity>;
        })}
      </ImageBackground>
    </View>
    <AppBottomMenu />
  </View>;
}
