import type { Presentation } from '../types';
import { styles } from './scene.styles';
import { layout } from './layout';
import { policy } from './policy';

export const desktopPresentation: Presentation = { variant: 'desktop' as const, styles, layout, policy };
