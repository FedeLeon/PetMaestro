import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  image: { width: '100%', height: '100%' },
  fill: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  lampGlow: { position: 'absolute', left: '-60%', top: '-30%', width: '220%', height: '150%' },
  restingCat: { position: 'absolute', left: '11%', top: '24%', width: '78%', height: '52%', transformOrigin: 'bottom center' },
  sleepLetters: { position: 'absolute', left: '63%', top: '4%', width: '38%', height: '32%' },
  touch: { position: 'absolute', zIndex: 9 },
});
