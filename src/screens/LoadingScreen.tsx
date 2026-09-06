import { useEffect, useRef } from 'react';
import { Animated, ImageBackground, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles/screens/loadingScreen.styles';
import { uiImages } from '../data/assetImages';

type Props = { progress: number; error: boolean; onRetry: () => void };

export function LoadingScreen({ progress: loaded, error, onRetry }: Props) {
  const progress = useRef(new Animated.Value(0)).current;
  const percentage = Math.floor(Math.max(0, Math.min(1, loaded)) * 100);
  useEffect(() => {
    const animation = Animated.timing(progress, { duration: 150, toValue: loaded, useNativeDriver: false });
    animation.start();
    return () => animation.stop();
  }, [loaded, progress]);

  return <View testID="game-loading" style={styles.screen}>
    <ImageBackground imageStyle={styles.background} resizeMode="cover" source={uiImages.loading} style={styles.screen}>
      <View style={styles.overlay}>
        <Text style={styles.title}>PETMAESTRO</Text>
        <Text style={styles.subtitle}>{error ? 'No pudimos cargar todo. Intentá de nuevo.' : 'PREPARANDO TU AVENTURA...'}</Text>
        <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: percentage }} style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]} />
        </View>
        <Text style={styles.percentage}>{percentage}%</Text>
        {error && <TouchableOpacity accessibilityRole="button" onPress={onRetry} style={styles.retry}><Text style={styles.retryText}>Reintentar</Text></TouchableOpacity>}
      </View>
    </ImageBackground>
  </View>;
}
