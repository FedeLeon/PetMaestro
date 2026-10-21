import { toysGridLayout } from '../../styles/screens/toysScreen.layout';
import { fishMemoryLayout } from '../../styles/components/fishMemory.styles';
export const layout = {
  toysGrid: (width: number, height: number) => toysGridLayout(width, height, 68),
  shopProductHeight: (height: number) => Math.max(0, height - 82),
  memoryBoard: (width: number, height: number) => fishMemoryLayout(Math.max(0, width - 64), height),
};
