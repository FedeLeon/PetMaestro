import { toysGridLayout } from '../../styles/screens/toysScreen.layout';
import { fishMemoryLayout } from '../../styles/components/fishMemory.styles';
export const layout = {
  toysGrid: (width: number, height: number) => toysGridLayout(width, height, 4),
  shopProductHeight: (height: number) => height,
  memoryBoard: (width: number, height: number) => fishMemoryLayout(width, height),
};
