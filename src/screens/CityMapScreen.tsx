import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ImageBackground, Text, View } from 'react-native';
import { AppBottomMenu } from '../components/AppBottomMenu';
import { AppTopMenu } from '../components/AppTopMenu';
import { mapImages } from '../data/assetImages';
import { styles } from '../styles/screens/cityMapScreen.styles';

const cityLevelPositions = [0.08, 0.16, 0.24, 0.32, 0.4, 0.48, 0.56, 0.64, 0.72, 0.8, 0.88, 0.95];

export function CityMapScreen() {
  return <View style={styles.screen}>
    <AppTopMenu icon="city-variant-outline" title="Ciudad Gatuna" />
    <ImageBackground imageStyle={styles.mapImage} resizeMode="stretch" source={mapImages.catCity} style={styles.mapScene}>
      {cityLevelPositions.map((x, index) => <View key={x} style={[styles.futurePoint, { left: `${x * 100}%` }]}>
        <MaterialCommunityIcons color="#7f7569" name="lock" size={22} />
        <Text style={styles.futureNumber}>{index + 1}</Text>
      </View>)}
      <View style={styles.comingSoon}><Text style={styles.comingSoonText}>PROXIMAMENTE</Text></View>
    </ImageBackground>
    <AppBottomMenu />
  </View>;
}
