const immersiveRoutes = new Set(['ToyGame', 'Game', 'CityActivity', 'Drawing']);
export const policy = {
  isFullScreenRoute: (route: string) => immersiveRoutes.has(route),
  isImmersiveActivity: (active: boolean, focused: boolean) => active && focused,
};
