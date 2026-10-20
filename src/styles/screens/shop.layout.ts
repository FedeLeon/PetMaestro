// Measured on the 1942×809 painted shop. These are object hotspots, not cards.
export const SHOP_ASPECT = 1942 / 809;
export const shopPortals = {
  hats: { x: .391, y: .10, width: .13, height: .43 },
  glasses: { x: .530, y: .19, width: .13, height: .34 },
  shirts: { x: .677, y: .11, width: .13, height: .42 },
  bottoms: { x: .812, y: .12, width: .13, height: .41 },
  shoes: { x: .347, y: .65, width: .12, height: .30 },
  'cat-toys': { x: .472, y: .57, width: .12, height: .38 },
  furniture: { x: .615, y: .54, width: .16, height: .41 },
  pets: { x: .760, y: .55, width: .12, height: .40 },
  flowers: { x: .880, y: .55, width: .11, height: .40 },
} as const;
export const displaySlotCenters = [.246, .501, .760];
