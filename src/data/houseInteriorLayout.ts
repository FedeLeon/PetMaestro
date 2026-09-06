// One shared world for art, furniture, doors and cat movement. Landscape only.
export const INTERIOR_WIDTH = 2400;
export const INTERIOR_HEIGHT = 600;
export const INTERIOR_FLOOR_Y = 360;
export const interiorDoors = [
  { id: 'kitchen', label: 'Cocina', accessibilityLabel: 'Ir a la cocina', x: 48, y: 80, width: 195, height: 280 },
  { id: 'outside', label: 'Jardín', accessibilityLabel: 'Salir al exterior', x: 684, y: 72, width: 300, height: 292 },
  { id: 'bathroom', label: 'Baño', accessibilityLabel: 'Ir al baño', x: 1720, y: 100, width: 176, height: 258 },
  { id: 'bedroom', label: 'Dormitorio', accessibilityLabel: 'Ir a la habitación del gato', x: 2180, y: 100, width: 176, height: 258 },
] as const;
export type InteriorDoorId = typeof interiorDoors[number]['id'];
// x is the center, floorY the bottom of the image box. Actual sprite proportions
// are preserved; every furnishing has its own spot, clear of the door thresholds.
export const interiorFurniture: Record<string, { x: number; floorY: number; height: number; aspectRatio: number; layer?: number }> = {
  'tv-cabinet': { aspectRatio: 1071 / 1245, x: 420, floorY: 443, height: 167 },
  'bookcase-open': { aspectRatio: 1103 / 1189, x: 580, floorY: 435, height: 180 },
  'red-sofa': { aspectRatio: 1191 / 967, x: 1390, floorY: 470, height: 175 },
  'small-table': { aspectRatio: 1192 / 1187, x: 1585, floorY: 462, height: 120 },
  'fish-lamp': { aspectRatio: 1240 / 1222, x: 1620, floorY: 435, height: 72 },
  'round-rug': { aspectRatio: 1202 / 1207, x: 1390, floorY: 548, height: 200, layer: 1 },
  'soft-bed': { aspectRatio: 1191 / 1237, x: 2040, floorY: 465, height: 130 },
  'window-plant': { aspectRatio: 1232 / 1211, x: 1080, floorY: 425, height: 115 },
  'floor-lamp': { aspectRatio: 1167 / 1220, x: 2090, floorY: 414, height: 175, layer: 3 },
};
