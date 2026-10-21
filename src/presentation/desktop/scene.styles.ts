import { StyleSheet } from 'react-native';
import { sharedSceneStyles } from '../shared/scene.styles';
import type { SceneStyles } from '../types';

export const styles = StyleSheet.create({
  ...sharedSceneStyles,
  wardrobeStage: { ...sharedSceneStyles.wardrobeStage, marginBottom: 12 },
  backButton: { ...sharedSceneStyles.backButton, borderRadius: 8 },
}) satisfies SceneStyles;
