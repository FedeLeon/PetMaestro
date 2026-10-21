import type { Presentation } from '../types';
import { styles } from './scene.styles';
import { layout } from './layout';
import { policy } from './policy';

export const mobilePresentation: Presentation = { variant: 'mobile' as const, styles, layout, policy };
