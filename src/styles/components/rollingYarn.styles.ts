import { StyleSheet } from 'react-native';
import { yarnCounterLayout } from './rollingYarn.layout';
export const styles = StyleSheet.create({
  game: { flex: 1, gap: 8, minHeight: 0 },
  arena: { flex: 1, minHeight: 0, backgroundColor: '#eed4ac', borderRadius: 18, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  room: { overflow: 'hidden' },
  fill: { position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 },
  target: { position: 'absolute', left: 0, top: 0 },
  touch: { width: '100%', height: '100%' },
  yarn: { width: '100%', height: '100%' },
  shadow: { position: 'absolute', left: '23%', bottom: '5%', width: '54%', height: '12%', borderRadius: 100, backgroundColor: '#62402135' },
  controls: { minHeight: 36, flexDirection: 'row', alignItems: 'center', gap: 10 },
  hit: { position: 'absolute' },
  counterFrame: { position: 'absolute', ...yarnCounterLayout, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  counterBackground: { position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' },
  counterIcon: { width: 27, height: 27 },
  counter: { color: '#26796e', fontWeight: '900', fontSize: 20 },
  message: { flex: 1, fontSize: 14, color: '#674c31', fontWeight: '700' },
});
