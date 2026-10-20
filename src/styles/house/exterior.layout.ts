// Ground anchors measured on exterior-yard-barn-v2.png (normalized panorama).
// Sizes are uniform in both axes; maxWidth keeps each animal inside its pen
// even in a taller landscape viewport. Coordinates refer to the feet.
export const exteriorAnimalLayout: Record<string, { x: number; floor: number; size: number; maxWidth: number; feet: number }> = {
  'farm-cow': { x: .067, floor: .55, size: 132, maxWidth: .108, feet: .98 },
  'farm-sheep': { x: .221, floor: .53, size: 108, maxWidth: .09, feet: .96 },
  'farm-duck': { x: .148, floor: .595, size: 56, maxWidth: .043, feet: .993 },
  'farm-horse': { x: .78, floor: .545, size: 144, maxWidth: .118, feet: .982 },
  'farm-pig': { x: .942, floor: .565, size: 100, maxWidth: .09, feet: .97 },
  'farm-rabbit': { x: .868, floor: .58, size: 62, maxWidth: .05, feet: .97 },
};
