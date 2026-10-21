import { styles as pet } from '../../styles/screens/petScreen.styles';
import { styles as house } from '../../styles/screens/houseScreen.styles';
import { styles as adventure } from '../../styles/screens/adventure.styles';
import { styles as shop } from '../../styles/screens/shopScreen.styles';
import { styles as category } from '../../styles/screens/shopCategoryScreen.styles';
import { styles as learning } from '../../styles/screens/gameScreen.styles';
import { styles as drawing } from '../../styles/screens/drawingScreen.styles';
import { styles as bell } from '../../styles/components/bellRunner.styles';
import { styles as memory } from '../../styles/components/fishMemory.styles';
import { styles as back } from '../../styles/components/headerBackButton.styles';
import type { SceneStyles } from '../types';

export const sharedSceneStyles = {
  wardrobeStage: { ...pet.stage },
  wardrobeItems: { ...pet.itemsSection },
  houseInventory: { ...house.inventoryToggle },
  cityCards: { ...adventure.cityCards },
  shopWelcome: { ...shop.welcome },
  shopStatus: { ...category.statusRow },
  shopProduct: { ...category.product },
  learningResult: { ...learning.resultArea },
  learningRoundHeader: { ...learning.roundHeader },
  gameBody: { ...adventure.gameBody },
  gameHeader: { ...adventure.gameHeader },
  drawingContent: { ...drawing.content },
  bellHud: { ...bell.hud },
  memoryBoard: { ...memory.board },
  backButton: { ...back.button },
  activityRoom: {},
} satisfies SceneStyles;
