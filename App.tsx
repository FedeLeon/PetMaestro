import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { ProgressProvider, useProgress } from './src/context/ProgressContext';
import { GameScreen } from './src/screens/GameScreen';
import { HouseScreen } from './src/screens/HouseScreen';
import { MapScreen } from './src/screens/MapScreen';
import { PetScreen } from './src/screens/PetScreen';
import { ShopCategoryScreen } from './src/screens/ShopCategoryScreen';
import { ShopScreen } from './src/screens/ShopScreen';
import { RootStackParamList } from './src/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
  const { isReady } = useProgress();

  if (!isReady) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#ff7a59" size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator
        initialRouteName="Map"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: '#fffaf0' },
        }}
      >
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="Game" component={GameScreen} />
        <Stack.Screen name="Pet" component={PetScreen} />
        <Stack.Screen name="Shop" component={ShopScreen} />
        <Stack.Screen name="ShopCategory" component={ShopCategoryScreen} />
        <Stack.Screen name="House" component={HouseScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ProgressProvider>
      <AppNavigator />
    </ProgressProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    alignItems: 'center',
    backgroundColor: '#fffaf0',
    flex: 1,
    justifyContent: 'center',
  },
});
