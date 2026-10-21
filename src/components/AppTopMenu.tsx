import { useProgress } from '../context/ProgressContext';
import { useScenePresentation } from '../context/ScenePresentation';
import { MobileTopMenu } from '../presentation/mobile/AppTopMenu';
import { DesktopTopMenu } from '../presentation/desktop/AppTopMenu';
import { useFullScreenRoute, usePresentation } from '../presentation/usePresentation';
import type { AppTopMenuProps } from '../presentation/types';

export function AppTopMenu(props: AppTopMenuProps) {
  const { progress, saveError, retrySave } = useProgress();
  const { activity } = useScenePresentation();
  const presentation = usePresentation();
  const fullScreen = useFullScreenRoute();
  const Header = presentation.variant === 'mobile' ? MobileTopMenu : DesktopTopMenu;
  return <Header {...props} needs={progress.needs} coins={progress.coins} saveError={saveError}
    onRetrySave={() => void retrySave()} immersive={fullScreen || !!activity} activity={activity} />;
}
