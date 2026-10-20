export const CAT_STRIDE = 76;
export const CAT_WALK_SPEED = 165;

export function catGait(distance: number, amount: number) {
  const phase = distance / CAT_STRIDE * Math.PI * 2;
  const swing = Math.sin(phase) * amount;
  const bounce = (1 - Math.cos(phase * 2)) * .8 * amount;
  return {
    bounce,
    leftLeg: `translate(${swing} ${Math.min(0, -swing) * 5 + bounce}) rotate(${-swing * 5} 68 185)`,
    rightLeg: `translate(${-swing} ${Math.min(0, swing) * 5 + bounce}) rotate(${swing * 5} 106 185)`,
    leftArm: `rotate(${swing * 7} 69 118)`,
    rightArm: `rotate(${-swing * 7} 105 118)`,
    tail: `rotate(${Math.sin(phase - .5) * 4 * amount} 117 192)`,
    skirt: `rotate(${-swing * 1.5} 87 177)`,
  };
}

export function walkFraction(elapsed: number, duration: number) {
  const t = Math.max(0, Math.min(1, elapsed / duration));
  // Ease acceleration and braking; the gait uses actual distance, not time.
  return t * t * (3 - 2 * t);
}
