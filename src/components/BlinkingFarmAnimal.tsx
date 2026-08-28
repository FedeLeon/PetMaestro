import { useEffect, useState } from 'react';
import { Image, ImageSourcePropType, ImageStyle, StyleProp, StyleSheet } from 'react-native';

type BlinkingFarmAnimalProps = {
  frames: ImageSourcePropType[];
  style?: StyleProp<ImageStyle>;
};

export function BlinkingFarmAnimal({ frames, style }: BlinkingFarmAnimalProps) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (frames.length < 2) {
      return;
    }

    const frameDuration = frame === 0 ? 1800 + Math.floor(Math.random() * 1800) : frame === 1 ? 110 : 160;
    const timeoutId = setTimeout(() => {
      setFrame((currentFrame) => (currentFrame + 1) % frames.length);
    }, frameDuration);

    return () => clearTimeout(timeoutId);
  }, [frame, frames]);

  return <Image resizeMode="contain" source={frames[frame]} style={[styles.image, style]} />;
}

const styles = StyleSheet.create({
  image: {
    height: '100%',
    width: '100%',
  },
});
