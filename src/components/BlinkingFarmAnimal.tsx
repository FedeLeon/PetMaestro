import { useEffect, useState } from 'react';
import { Image, ImageSourcePropType, ImageStyle, StyleProp, StyleSheet } from 'react-native';

type BlinkingFarmAnimalProps = {
  frames: ImageSourcePropType[];
  actionFrames?: ImageSourcePropType[];
  style?: StyleProp<ImageStyle>;
};

export function BlinkingFarmAnimal({ actionFrames = [], frames, style }: BlinkingFarmAnimalProps) {
  const [blinkFrame, setBlinkFrame] = useState(0);
  const [actionFrame, setActionFrame] = useState(0);
  const [isActing, setIsActing] = useState(false);

  useEffect(() => {
    if (frames.length < 2 || isActing) {
      return;
    }

    const frameDuration = blinkFrame === 0 ? 1800 + Math.floor(Math.random() * 1800) : blinkFrame === 1 ? 110 : 160;
    const timeoutId = setTimeout(() => {
      setBlinkFrame((currentFrame) => (currentFrame + 1) % frames.length);
    }, frameDuration);

    return () => clearTimeout(timeoutId);
  }, [blinkFrame, frames, isActing]);

  useEffect(() => {
    if (actionFrames.length < 2 || isActing) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setActionFrame(0);
      setIsActing(true);
    }, 5000 + Math.floor(Math.random() * 5000));

    return () => clearTimeout(timeoutId);
  }, [actionFrames.length, isActing]);

  useEffect(() => {
    if (!isActing || actionFrames.length < 2) {
      return;
    }

    const timeoutId = setTimeout(() => {
      if (actionFrame + 1 >= actionFrames.length) {
        setIsActing(false);
        setActionFrame(0);
        return;
      }

      setActionFrame((currentFrame) => currentFrame + 1);
    }, 260);

    return () => clearTimeout(timeoutId);
  }, [actionFrame, actionFrames.length, isActing]);

  return <Image resizeMode="contain" source={isActing ? actionFrames[actionFrame] : frames[blinkFrame]} style={[styles.image, style]} />;
}

const styles = StyleSheet.create({
  image: {
    height: '100%',
    width: '100%',
  },
});
