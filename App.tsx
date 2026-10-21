import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ProgressProvider, useProgress } from './src/context/ProgressContext';
import { GameScreen } from './src/screens/GameScreen';
import { HouseScreen } from './src/screens/HouseScreen';
import { DrawingScreen } from './src/screens/DrawingScreen';
import { MapScreen } from './src/screens/MapScreen';
import { CityMapScreen } from './src/screens/CityMapScreen';
import { PetScreen } from './src/screens/PetScreen';
import { ShopCategoryScreen } from './src/screens/ShopCategoryScreen';
import { ShopScreen } from './src/screens/ShopScreen';
import { LoadingScreen } from './src/screens/LoadingScreen';
import { RootStackParamList } from './src/types';
import { preloadGameAssets } from './src/data/preloadGameAssets';
import { AudioProvider, useGameAudio } from './src/context/AudioContext';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './src/styles/app.styles';
import { AlbumScreen } from './src/screens/AlbumScreen';
import { ToysScreen } from './src/screens/ToysScreen';
import { ToyGameScreen } from './src/screens/ToyGameScreen';
import { CityActivityScreen } from './src/screens/CityActivityScreen';
import { LibraryScreen } from './src/screens/LibraryScreen';
import { AudiobookScreen } from './src/screens/AudiobookScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
  const navigationRef = useNavigationContainerRef<RootStackParamList>();
  const { changeScene } = useGameAudio();
  const { isReady } = useProgress();
  const [animationsReady, setAnimationsReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadError, setLoadError] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);

  useEffect(() => {
    let mounted = true;
    setLoadError(false);
    preloadGameAssets((loaded, total) => { if (mounted) setLoadProgress(loaded / total); }).then(() => {
      if (mounted) setAnimationsReady(true);
    }).catch(error => {
      console.error('[PetMaestro] No se pudo iniciar el juego', error);
      if (mounted) setLoadError(true);
    });
    return () => { mounted = false; };
  }, [loadAttempt]);

  if (!isReady || !animationsReady) {
    return <LoadingScreen progress={loadProgress} error={loadError} onRetry={() => setLoadAttempt(attempt => attempt + 1)} />;
  }

  return (
    <NavigationContainer ref={navigationRef} onStateChange={() => changeScene(navigationRef.getCurrentRoute()?.name ?? 'Map')}>
      <Stack.Navigator
        initialRouteName="Map"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: '#fffaf0' },
        }}
      >
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="CityMap" component={CityMapScreen} />
        <Stack.Screen name="Album" component={AlbumScreen} />
        <Stack.Screen name="Toys" component={ToysScreen} />
        <Stack.Screen name="Library" component={LibraryScreen} />
        <Stack.Screen name="Audiobook" component={AudiobookScreen} />
        <Stack.Screen name="ToyGame" component={ToyGameScreen} />
        <Stack.Screen name="CityActivity" component={CityActivityScreen} />
        <Stack.Screen name="Game" component={GameScreen} />
        <Stack.Screen name="Pet" component={PetScreen} />
        <Stack.Screen name="Shop" component={ShopScreen} />
        <Stack.Screen name="ShopCategory" component={ShopCategoryScreen} />
        <Stack.Screen name="House" component={HouseScreen} />
        <Stack.Screen name="Drawing" component={DrawingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'top', 'bottom']}>
        <StatusBar hidden />
        <AudioProvider>
          <ProgressProvider>
            <AppNavigator />
          </ProgressProvider>
        </AudioProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
