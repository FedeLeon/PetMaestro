import type { ComponentProps } from 'react';
import { CareActivityScene } from './CareActivityScene';

export function BathroomActivityScene(props: Omit<ComponentProps<typeof CareActivityScene>, 'backLabel'>) {
  return <CareActivityScene {...props} backLabel="Volver al baño" />;
}
