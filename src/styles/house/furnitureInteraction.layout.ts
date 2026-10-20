import { interiorFurniture } from '../../data/houseInteriorLayout';

// Center a generous touch area on the cushion or lampshade, even on a small
// landscape screen. The standing lamp's stem does not steal taps from the bed.
export function furnitureTouchRect(id: 'soft-bed' | 'fish-lamp' | 'floor-lamp' | 'bookcase-open', scale: number, bottom = interiorFurniture[id].floorY) {
  const placement = interiorFurniture[id];
  if (id === 'bookcase-open') {
    const width = Math.max(48, placement.height * placement.aspectRatio * scale);
    const height = Math.max(48, placement.height * scale);
    return { left: placement.x * scale - width / 2, top: (bottom - placement.height / 2) * scale - height / 2, width, height, zIndex: 10 };
  }
  const bed = id === 'soft-bed';
  const width = Math.max(48, placement.height * placement.aspectRatio * scale * (bed ? 1 : .65));
  const height = Math.max(48, placement.height * scale * (bed ? .9 : .45));
  const centerY = bottom - placement.height + placement.height * (bed ? .52 : id === 'floor-lamp' ? .21 : .32);
  return { left: placement.x * scale - width / 2, top: centerY * scale - height / 2, width, height, zIndex: bed ? 10 : 9 };
}
