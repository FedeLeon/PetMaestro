import { StyleSheet } from 'react-native';
import { BOTTOM_MENU_HEIGHT } from '../../styles/layout';
import { sharedSceneStyles } from '../shared/scene.styles';
import type { SceneStyles } from '../types';

export const styles = StyleSheet.create({
  ...sharedSceneStyles,
  wardrobeItems: { ...sharedSceneStyles.wardrobeItems, paddingTop: 68 },
  houseInventory: { ...sharedSceneStyles.houseInventory, top: 68 },
  cityCards: { ...sharedSceneStyles.cityCards, paddingTop: 68 },
  shopWelcome: { ...sharedSceneStyles.shopWelcome, display: 'none' },
  shopStatus: { ...sharedSceneStyles.shopStatus, position: 'absolute', bottom: BOTTOM_MENU_HEIGHT + 4, left: 72, right: 72, height: 24, borderRadius: 12, backgroundColor: '#fff8e9f5', zIndex: 20 },
  shopProduct: { ...sharedSceneStyles.shopProduct, top: 52 },
  learningResult: { ...sharedSceneStyles.learningResult, marginBottom: 0 },
  learningRoundHeader: { ...sharedSceneStyles.learningRoundHeader, paddingLeft: 64, minHeight: 44 },
  gameBody: { ...sharedSceneStyles.gameBody, padding: 0 },
  gameHeader: { ...sharedSceneStyles.gameHeader, paddingLeft: 76, paddingRight: 12, minHeight: 60 },
  drawingContent: { ...sharedSceneStyles.drawingContent, paddingBottom: 14, paddingLeft: 72 },
  bellHud: { ...sharedSceneStyles.bellHud, left: 76 },
  memoryBoard: { ...sharedSceneStyles.memoryBoard, marginLeft: 64 },
  backButton: { ...sharedSceneStyles.backButton, borderRadius: 23, overflow: 'hidden' },
  activityRoom: { marginBottom: 0 },
}) satisfies SceneStyles;
