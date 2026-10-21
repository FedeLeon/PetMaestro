import { INTERIOR_HEIGHT, INTERIOR_WIDTH } from '../../data/houseInteriorLayout';

export function interiorViewportLayout(viewportHeight: number) {
  const height = viewportHeight * 1.4;
  const scale = height / INTERIOR_HEIGHT;
  return { scale, width: INTERIOR_WIDTH * scale, height, top: viewportHeight - height };
}
