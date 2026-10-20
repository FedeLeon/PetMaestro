// Coordinates on the 174 x 260 cat image, shared by the wardrobe and rooms.
import { wardrobeBounds } from '../../data/wardrobeBounds';
export type OutfitPlacement = { x: number; y: number; width: number; height: number; stretch?: boolean; alignBottom?: boolean; ankleShift?: number };

// Lens centers inside each visible alpha crop. Decorative ears and temples
// must not determine the position of the lenses on the cat's eyes.
export const glassesLensAnchors: Record<string, readonly [number, number, number]> = {
  'oval-pink-glasses': [.25, .75, .5], 'mint-round-glasses': [.25, .75, .55],
  'flower-glasses': [.25, .75, .55], 'orange-sport-glasses': [.25, .75, .59],
  'navy-square-glasses': [.25, .75, .55], 'moon-glasses': [.25, .75, .55],
  'round-glasses': [.22, .78, .61], 'heart-glasses': [.25, .75, .5],
  'star-glasses': [.24, .76, .57], 'square-glasses': [.23, .77, .6],
  'sun-glasses': [.22, .78, .5], 'teal-glasses': [.25, .75, .62],
};
const fittedGlasses = Object.fromEntries(Object.entries(glassesLensAnchors).map(([id, [left, right, y]]) => {
  const [, , bw, bh, aspect] = wardrobeBounds[id];
  const width = 41 / (right - left), height = width / (aspect * bw / bh);
  return [id, { x: 66 - left * width, y: 69.5 - y * height, width, height }];
}));
export const outfitPlacement: Record<string, OutfitPlacement> = {
  ...fittedGlasses,
  'brown-flower-hat': { x: 35, y: -10, width: 105, height: 51 },
  'party-hat': { x: 55, y: -38, width: 64, height: 76 },
  'star-hat': { x: 46, y: -15, width: 84, height: 54 },
  'blue-cap': { x: 47, y: -17, width: 82, height: 59 },
  'pink-beanie': { x: 50, y: -34, width: 76, height: 78 },
  'wizard-hat-purple': { x: 47, y: -37, width: 82, height: 79 },
  'red-bow': { x: 83, y: 9, width: 43, height: 29 },
  'golden-crown': { x: 47, y: -7, width: 81, height: 44 },
  'rainbow-beanie': { x: 46, y: -38, width: 83, height: 82 },
  'flower-sunhat': { x: 35, y: -13, width: 105, height: 56 },
  'bear-hood': { x: 28, y: -8, width: 121, height: 126 },
  'explorer-hat': { x: 35, y: -15, width: 106, height: 60 },
  'yarn-ball': { x: 17, y: 146, width: 29, height: 30 },
  'mouse-toy': { x: 12, y: 146, width: 38, height: 29 },
  'fish-plush': { x: 12, y: 148, width: 42, height: 25 },
  'bell-ball': { x: 16, y: 144, width: 32, height: 34 },
  'feather-wand': { x: 27, y: 111, width: 39, height: 59 },
  'star-plush': { x: 16, y: 143, width: 31, height: 36 },
};
export function shoePlacementFor(id: string) {
  const boot = id.includes('boots') || id === 'purple-shoes';
  const slipper = id.includes('slippers');
  const height = boot ? 46 : slipper ? 24 : id === 'brown-shoes' ? 30 : 38;
  const y = 254 - height;
  return {
    left: { x: 42, y, width: 36, height, stretch: true, ankleShift: 5 },
    right: { x: 96, y, width: 36, height, stretch: true, ankleShift: -5 },
  };
}

