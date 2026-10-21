import { Platform, useWindowDimensions } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { mobilePresentation } from './mobile';
import { desktopPresentation } from './desktop';

export function selectPresentation(platform: string, width: number) {
  return platform !== 'web' || width <= 1000 ? mobilePresentation : desktopPresentation;
}
export function usePresentation() {
  const { width } = useWindowDimensions();
  return selectPresentation(Platform.OS, width);
}
export function useFullScreenRoute() {
  const route = useRoute();
  return usePresentation().policy.isFullScreenRoute(route.name);
}
