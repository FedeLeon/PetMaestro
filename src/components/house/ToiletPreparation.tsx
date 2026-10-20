import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Image, PanResponder, TouchableOpacity, View } from 'react-native';
import Svg, { Ellipse, Path } from 'react-native-svg';
import { houseImages, petImages } from '../../data/assetImages';
import { useGameAudio } from '../../context/AudioContext';
import { styles } from '../../styles/house/toiletGame.styles';
import { toiletCatFrame, toiletDropFits, toiletPreparation as placement } from '../../styles/house/toiletPreparation.layout';

type Props = {
  step: 'lid' | 'position' | 'seating' | 'seated'; active: boolean; width: number; height: number;
  onOpen: () => void; onSitStart: () => void; onSeated: () => void; onInterrupted: () => void;
};

function LidArt({ open }: { open: boolean }) {
  return <Svg width="100%" height="100%" viewBox="0 0 300 200">
    <Ellipse cx="150" cy={open ? 95 : 155} rx="140" ry={open ? 88 : 36} fill="#d8ded6" stroke="#b3c5bc" strokeWidth="5" />
    <Ellipse cx="150" cy={open ? 90 : 149} rx="135" ry={open ? 84 : 32} fill="#fffbed" stroke="#e7d9be" strokeWidth="4" />
    <Path d={open ? 'M64 65Q90 20 158 20' : 'M54 146Q90 128 150 129'} stroke="#ffffff" strokeWidth="8" fill="none" strokeLinecap="round" />
  </Svg>;
}

export function ToiletPreparation(props: Props) {
  const { step, active, width, height } = props;
  const { playSound } = useGameAudio();
  const latest = useRef(props); latest.current = props;
  const offset = useRef(new Animated.ValueXY()).current;
  const lid = useRef(new Animated.Value(0)).current;
  const [held, setHeld] = useState(false);
  const [opening, setOpening] = useState(false);
  const [seated, setSeated] = useState(false);
  const busy = useRef(false);
  const catSize = toiletCatFrame(width, height);
  const sitting = step === 'seated' || seated;
  useEffect(() => {
    if (!active) return;
    const animation = Animated.timing(lid, { toValue: step === 'lid' && !opening ? 0 : 1, duration: 600, useNativeDriver: true });
    animation.start(({ finished }) => { if (finished && opening && latest.current.active) { latest.current.onOpen(); setOpening(false); } });
    return () => animation.stop();
  }, [active, lid, step === 'lid', opening]);
  const reset = () => { busy.current = false; setHeld(false); offset.stopAnimation(); offset.setValue({ x: 0, y: 0 }); };
  useEffect(() => {
    if (!active) { reset(); if (step === 'seating') { setSeated(false); latest.current.onInterrupted(); } }
    return () => offset.stopAnimation();
  }, [active, offset]);
  const settle = (dx: number, dy: number) => {
    const current = latest.current;
    if (!current.active || current.step !== 'position' || busy.current) return;
    if (Math.hypot(dx, dy) < 12 || !toiletDropFits(current.width * placement.standing.x + dx, current.height * placement.standing.y + dy, current.width, current.height)) {
      setHeld(false); playSound('retry');
      Animated.spring(offset, { toValue: { x: 0, y: 0 }, speed: 20, bounciness: 4, useNativeDriver: true }).start();
      return;
    }
    busy.current = true; setHeld(false); current.onSitStart(); playSound('correct');
    Animated.timing(offset, { toValue: { x: current.width * (placement.seated.x - placement.standing.x), y: current.height * (placement.seated.y - placement.standing.y) }, duration: 550, useNativeDriver: true }).start(({ finished }) => {
      if (!finished || !latest.current.active) return;
      setSeated(true); latest.current.onSeated();
    });
  };
  const handlers = useRef({ settle, reset }); handlers.current = { settle, reset };
  const responder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => latest.current.active && latest.current.step === 'position' && !busy.current,
    onMoveShouldSetPanResponder: () => latest.current.active && latest.current.step === 'position' && !busy.current,
    onPanResponderGrant: () => { offset.stopAnimation(); offset.setValue({ x: 0, y: 0 }); setHeld(true); },
    onPanResponderMove: (_, gesture) => {
      const current = latest.current;
      if (!current.active || busy.current) return;
      offset.setValue({ x: Math.max(-current.width * .65, Math.min(current.width * .18, gesture.dx)), y: Math.max(-current.height * .5, Math.min(current.height * .2, gesture.dy)) });
    },
    onPanResponderRelease: (_, gesture) => handlers.current.settle(gesture.dx, gesture.dy),
    onPanResponderTerminate: () => handlers.current.reset(),
    onPanResponderTerminationRequest: () => false,
  }), [offset]);

  return <>
    <View pointerEvents="none" style={styles.lidArt}>
      <Animated.View style={[styles.layer, { opacity: lid.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }), transform: [{ translateY: height * .065 }] }]}><LidArt open={false} /></Animated.View>
      <Animated.View style={[styles.layer, { opacity: lid, transform: [{ translateY: lid.interpolate({ inputRange: [0, 1], outputRange: [height * .1, 0] }) }, { scaleY: lid.interpolate({ inputRange: [0, 1], outputRange: [.35, 1] }) }] }]}><LidArt open /></Animated.View>
    </View>
    {step === 'lid' && <TouchableOpacity testID="toilet-lid" accessibilityRole="button" accessibilityLabel="Levantar la tapa del inodoro" disabled={!active || opening} onPress={() => { if (latest.current.active && latest.current.step === 'lid' && !opening) { playSound('tap'); setOpening(true); } }} style={styles.lidHit} />}
    {step === 'position' && <View pointerEvents="none" testID="toilet-drop-target" style={styles.dropTarget} />}
    {sitting ? <Image testID="toilet-seated-cat" accessible={false} source={houseImages.toiletSeatedCat} resizeMode="contain" style={styles.seatedCat} />
      : <Animated.View testID="toilet-standing-cat" accessibilityRole="button" accessibilityLabel="Arrastrar al gatito hasta el inodoro" accessibilityHint={step === 'lid' ? 'Primero levantá la tapa' : 'Arrastrá al gatito hasta el asiento'} accessibilityState={{ disabled: step !== 'position' || !active }}
          onAccessibilityTap={() => handlers.current.settle(width * (placement.drop.x - placement.standing.x), height * (placement.drop.y - placement.standing.y))}
          style={[styles.dragCat, { width: catSize.width, height: catSize.height, left: width * placement.standing.x - catSize.width / 2, top: height * placement.standing.y - catSize.height / 2, transform: [...offset.getTranslateTransform(), { scale: held ? 1.04 : 1 }] }]} {...responder.panHandlers}>
          <View pointerEvents="none" style={styles.layer}><Image accessible={false} source={petImages.catBlink[0]} resizeMode="contain" style={styles.asset} /></View>
        </Animated.View>}
  </>;
}
