export function activityButtonSize(sceneHeight: number, proportion = .15) {
  return Math.max(54, Math.min(82, sceneHeight * proportion * 1.2));
}
