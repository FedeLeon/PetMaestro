import { StyleSheet } from 'react-native';
const obstacleArt = {
  log: { aspect: 1697 / 927, baseline: 818 / 927 },
  rock: { aspect: 1, baseline: 959 / 1254 },
  bush: { aspect: 1, baseline: 901 / 1254 },
};
export function bellObstacleLayout(kind: keyof typeof obstacleArt, side: number, ground: number) {
  const height = side / obstacleArt[kind].aspect;
  return { width: side, height, top: ground - height * obstacleArt[kind].baseline };
}
export function bellRunnerLayout(width: number, height: number) {
  return {
    ground: height * .75,
    catSide: Math.min(210, Math.max(90, height * .40)),
    jumpHeight: Math.min(106, Math.max(45, height * .23)),
    obstacleSide: Math.min(110, Math.max(64, height * .22)),
    bellSide: Math.min(78, Math.max(44, height * .17)),
    coinSide: Math.min(44, Math.max(28, height * .09)),
  };
}
export const styles = StyleSheet.create({
  game: { flex: 1, minHeight: 0, backgroundColor: '#b2e2ce' },
  arena: { flex: 1, overflow: 'hidden' },
  fill: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' },
  background: { position: 'absolute', top: 0, height: '100%' },
  cat: { position: 'absolute', overflow: 'hidden' },
  sprite: { position: 'absolute', width: '400%', height: '200%' },
  jumpSprite: { position: 'absolute', top: 0, width: '300%', height: '100%' },
  object: { position: 'absolute' },
  shadow: { position: 'absolute', height: 10, borderRadius: 99, backgroundColor: '#71501b35' },
  hud: { position: 'absolute', top: 10, left: 12, right: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
  instruction: { flex: 1, color: '#266e62', fontWeight: '900', fontSize: 16, backgroundColor: '#fff8e8ee', borderRadius: 14, padding: 8 },
  coinCount: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fff5d9f5', padding: 6, borderRadius: 14, borderWidth: 2, borderColor: '#e7b345' },
  coinArt: { width: 28, height: 28 },
  count: { color: '#87611b', fontSize: 19, fontWeight: '900' },
  journey: { position: 'absolute', left: '25%', right: '25%', bottom: 14, height: 10, borderRadius: 8, borderWidth: 2, borderColor: '#e5b54b', backgroundColor: '#fff5d9' },
  journeyFill: { height: '100%', backgroundColor: '#34aa8d', borderRadius: 8 },
  overlay: { position: 'absolute', inset: 0, backgroundColor: '#1d65594d', alignItems: 'center', justifyContent: 'center', gap: 10 },
  start: { minHeight: 60, minWidth: 190, paddingHorizontal: 22, borderWidth: 4, borderColor: '#efbd4e', borderRadius: 22, backgroundColor: '#fff5d9', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  startText: { fontWeight: '900', fontSize: 23, color: '#26796e' },
  help: { borderRadius: 12, backgroundColor: '#fff5d9ed', padding: 8, color: '#32685e', fontSize: 15, fontWeight: '800', textAlign: 'center' },
});
