import { usePresentation } from '../presentation/usePresentation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { AppTopMenu } from '../components/AppTopMenu';
import { AppBottomMenu } from '../components/AppBottomMenu';
import { useProgress } from '../context/ProgressContext';
import { shopItems } from '../data/gameContent';
import { catItemImages, toySceneImages, uiImages } from '../data/assetImages';
import { styles } from '../styles/screens/adventure.styles';
import { RootStackParamList } from '../types';
import { toyMode } from '../data/adventureContent';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useGameAudio } from '../context/AudioContext';
import { styles as toyStyles } from '../styles/screens/toysScreen.styles';

export function ToysScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Toys'>) {
  const presentation = usePresentation();
  const { progress } = useProgress();
  const { playSound } = useGameAudio();
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const layout = presentation.layout.toysGrid(viewport.width, viewport.height);
  return <View style={styles.screen}>
    <AppTopMenu scene compact icon="tennis-ball" title="Juguetes para jugar" />
    <View testID="toys-room" onLayout={event => setViewport(event.nativeEvent.layout)} style={toyStyles.room}>
      <View pointerEvents="none" style={toyStyles.background}><Image testID="toys-room-background" accessible={false} source={toySceneImages.selectionRoom} resizeMode="stretch" style={toyStyles.backgroundImage} /></View>
      <ScrollView testID="toys-play-area" style={toyStyles.scroll} contentContainerStyle={[toyStyles.content, { paddingTop: layout.topInset }]}>
        <View testID="toys-grid" style={[toyStyles.grid, { width: layout.gridWidth, gap: layout.gap }]}>{shopItems.filter(item => item.category === 'cat-toys').map(item => {
          const owned = progress.ownedItems.includes(item.id);
          const mode = toyMode(item.id);
          const description = item.id === 'bell-ball' ? 'Perseguí el cascabel por el parque. Tocá para saltar tronquitos y atrapar monedas.' : item.id === 'fish-plush' ? 'Encontrá cuatro parejas entre ocho cartas.' : mode === 'rolling-yarn' ? 'Atrapá el ovillo que gira y rueda.' : mode === 'hide-and-seek' ? 'Buscá al ratoncito entre los objetos.' : mode === 'memory' ? 'Encontrá tres parejas de dibujos.' : mode === 'sequence' ? 'Seguí las luces amarillas.' : 'Atrapá el juguete seis veces.';
          return <TouchableOpacity testID={`toy-card-${item.id}`} key={item.id} accessibilityRole="button" accessibilityLabel={`${owned ? 'Jugar' : 'Comprar'} ${item.name}`} accessibilityHint={owned ? description : `${item.price} monedas en la tienda`} activeOpacity={.85}
            onPress={() => { playSound('tap'); owned ? navigation.push('ToyGame', { toyId: item.id }) : navigation.navigate('ShopCategory', { categoryId: 'cat-toys' }); }} style={[toyStyles.card, { width: layout.side, height: layout.side }]}>
            <Image accessible={false} source={uiImages.toyCardFrame} resizeMode="contain" style={toyStyles.frame} />
            <View pointerEvents="none" style={toyStyles.cardContent}>
              <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={.8} style={[toyStyles.title, { fontSize: layout.titleSize }]}>{item.name}</Text>
              <Image accessible={false} source={catItemImages[item.id]} style={toyStyles.image} resizeMode="contain" />
              <View style={[toyStyles.action, !owned && toyStyles.shopAction]}><MaterialCommunityIcons name={owned ? 'play-circle' : 'store'} size={layout.iconSize} color="#fff" /><Text numberOfLines={1} style={[toyStyles.actionText, { fontSize: layout.actionSize }]}>{owned ? '¡Jugar!' : 'Tienda'}</Text></View>
            </View>
          </TouchableOpacity>;
        })}</View>
      </ScrollView>
    </View>
    <AppBottomMenu />
  </View>;
}
