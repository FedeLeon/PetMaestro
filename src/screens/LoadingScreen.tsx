import { useEffect, useRef, useState } from 'react';
import { Animated, ImageBackground, Text, View } from 'react-native';
import { styles } from '../styles/screens/loadingScreen.styles';

const loadingImage = require('../../assets/generated/loading/petmaestro-loading.png');

export function LoadingScreen() {
  const progress = useRef(new Animated.Value(0)).current;
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const animation = Animated.timing(progress, {
      duration: 2200,
      toValue: 1,
      useNativeDriver: false,
    });
    animation.start();

    const interval = setInterval(() => {
      setPercentage((current) => Math.min(100, current + 5));
    }, 110);

    return () => {
      animation.stop();
      clearInterval(interval);
    };
  }, [progress]);

  return (
    <View style={styles.screen}>
      <ImageBackground imageStyle={styles.background} resizeMode="cover" source={loadingImage} style={styles.screen}>
        <View style={styles.overlay}>
          <Text style={styles.title}>PETMAESTRO</Text>
          <Text style={styles.subtitle}>PREPARANDO TU AVENTURA...</Text>
          <View style={styles.progressTrack}>
            <Animated.View
              style={[styles.progressFill, { width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]}
            />
          </View>
          <Text style={styles.percentage}>{percentage}%</Text>
        </View>
      </ImageBackground>
    </View>
  );
}
