import { useId } from 'react';
import { Animated } from 'react-native';
import Svg, { ClipPath, Defs, Ellipse, G, Image, LinearGradient, Path, Stop } from 'react-native-svg';
import { kitchenFoods } from '../../data/kitchenContent';
import { soupFoodPositions, styles } from '../../styles/house/cookingSoup.styles';

export function CookingSoup({ ids, fill, height }: { ids: readonly string[]; fill: Animated.Value; height: number }) {
  const prefix = `soup${useId().replace(/\W/g, '')}`;
  return <Animated.View testID="cooking-soup" pointerEvents="none" style={[styles.surface, {
    opacity: fill,
    transform: [{ translateY: fill.interpolate({ inputRange: [0, 1], outputRange: [height * .065, 0] }) }, { scaleX: fill.interpolate({ inputRange: [0, 1], outputRange: [.85, 1] }) }, { scaleY: fill.interpolate({ inputRange: [0, 1], outputRange: [.5, 1] }) }],
  }]}>
    <Svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="none">
      <Defs>
        <LinearGradient id={`${prefix}broth`} x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#eaa33c" /><Stop offset=".5" stopColor="#ffce66" /><Stop offset="1" stopColor="#d98630" /></LinearGradient>
        <ClipPath id={`${prefix}bowl`}><Ellipse cx="200" cy="100" rx="197" ry="96" /></ClipPath>
      </Defs>
      <Ellipse cx="200" cy="100" rx="197" ry="96" fill={`url(#${prefix}broth)`} stroke="#f4ba56" strokeWidth="4" />
      <G clipPath={`url(#${prefix}bowl)`}>
        {ids.map((id, index) => {
          const food = kitchenFoods.find(item => item.id === id);
          const position = ids.length === 1 ? { x: 145, y: 42, rotate: -8 } : soupFoodPositions[index % soupFoodPositions.length];
          return food && <Image key={id} testID={`soup-ingredient-${id}`} href={food.image} x={position.x} y={position.y} width="108" height="110" preserveAspectRatio="xMidYMid meet" transform={`rotate(${position.rotate} ${position.x + 54} ${position.y + 55})`} />;
        })}
        <Path d="M30 135Q85 164 155 151M256 45Q303 45 337 70" fill="none" stroke="#ffe8ac" strokeWidth="5" strokeLinecap="round" opacity=".7" />
        {[{ x: 67, y: 68 }, { x: 320, y: 125 }, { x: 218, y: 163 }, { x: 171, y: 28 }].map((point, index) => <Ellipse key={index} cx={point.x} cy={point.y} rx={index % 2 ? 7 : 10} ry={index % 2 ? 4 : 5} fill="#ffe7a0" stroke="#efa84a" strokeWidth="2" />)}
      </G>
    </Svg>
  </Animated.View>;
}
