import type { toysGridLayout } from '../styles/screens/toysScreen.layout';
import type { fishMemoryLayout } from '../styles/components/fishMemory.styles';
import type { MaterialCommunityIcons } from '@expo/vector-icons';
import type { StyleProp, ViewStyle } from 'react-native';
import type { PetNeeds } from '../types';

export type AppTopMenuProps = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  compact?: boolean;
  scene?: boolean;
  onBack?: () => void;
  backLabel?: string;
  backText?: string;
};
export type TopMenuViewProps = AppTopMenuProps & {
  needs: PetNeeds;
  coins: number;
  saveError: boolean;
  onRetrySave: () => void;
  immersive: boolean;
  activity: { hideHud: boolean; exit: () => void } | null;
};
export type SceneStyles = Record<
  'wardrobeStage' | 'wardrobeItems' | 'houseInventory' | 'cityCards' |
  'shopWelcome' | 'shopStatus' | 'shopProduct' | 'learningResult' |
  'learningRoundHeader' | 'gameBody' | 'gameHeader' | 'drawingContent' |
  'bellHud' | 'memoryBoard' | 'backButton' | 'activityRoom', StyleProp<ViewStyle>>;

export type Presentation = {
  variant: 'mobile' | 'desktop';
  styles: SceneStyles;
  layout: {
    toysGrid: (width: number, height: number) => ReturnType<typeof toysGridLayout>;
    shopProductHeight: (height: number) => number;
    memoryBoard: (width: number, height: number) => ReturnType<typeof fishMemoryLayout>;
  };
  policy: {
    isFullScreenRoute: (route: string) => boolean;
    isImmersiveActivity: (active: boolean, focused: boolean) => boolean;
  };
};
