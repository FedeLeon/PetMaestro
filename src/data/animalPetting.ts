export const PETTING_DURATION_MS = 3600;
export const animalPettingProfiles: Record<string, { angle: number; extension?: number; amplitude: number; rate: number; contact: { x: number; y: number }; label: string; reaction: 'nuzzle' | 'wool' | 'ears' | 'wings' }> = {
  'farm-cow': { angle: -45, amplitude: 7, rate: 5, contact: { x: .455, y: .26 }, label: '¡Qué lindo mimo!', reaction: 'nuzzle' },
  'farm-horse': { angle: -60, amplitude: 6, rate: 4.5, contact: { x: .329, y: .27 }, label: '¡Le encanta en la crin!', reaction: 'nuzzle' },
  'farm-sheep': { angle: -22, amplitude: 8, rate: 5.5, contact: { x: .428, y: .312 }, label: '¡Qué suave su lana!', reaction: 'wool' },
  'farm-pig': { angle: -30, amplitude: 9, rate: 7, contact: { x: .644, y: .26 }, label: '¡Cosquillas en la orejita!', reaction: 'ears' },
  'farm-duck': { angle: -5, extension: 1.4, amplitude: 5, rate: 5, contact: { x: .518, y: .28 }, label: '¡Cuac, qué lindo!', reaction: 'wings' },
  'farm-rabbit': { angle: -5, extension: 1.4, amplitude: 5, rate: 4, contact: { x: .50, y: .385 }, label: '¡Mimos bien suaves!', reaction: 'ears' },
};
export type CatPetting = { animalId: string; startedAt: number };
export type AnimalAffection = { phase: 'approaching' | 'petting'; startedAt: number };
export function pettingStroke(animalId: string, elapsed: number, reducedMotion = false) {
  const profile = animalPettingProfiles[animalId];
  if (!profile) return undefined;
  const t = Math.max(0, elapsed);
  const envelope = reducedMotion ? 1 : Math.min(1, t / .3, Math.max(0, (PETTING_DURATION_MS / 1000 - t) / .3));
  return { angle: (profile.angle + (reducedMotion ? 0 : Math.sin(t * profile.rate) * profile.amplitude)) * envelope,
    extension: 1 + ((profile.extension ?? 1.15) - 1) * envelope, affection: envelope, reaction: profile.reaction };
}

// The paw endpoint and floor anchor are measured on PetCat's room rig. Both
// placement and animation use the same shoulder pivot/extension.
export function pettingCatTarget(animalId: string, headX: number, headY: number, worldWidth: number) {
  const profile = animalPettingProfiles[animalId];
  const angle = profile.angle * Math.PI / 180;
  const extension = profile.extension ?? 1.15;
  const pawX = 62.3 + .60577 * (105 + extension * (49 * Math.cos(angle) - 42 * Math.sin(angle)));
  const pawY = 63.25 + .60577 * (118 + extension * (49 * Math.sin(angle) + 42 * Math.cos(angle)));
  const rightX = headX - pawX;
  const leftX = headX - (230 - pawX);
  const clamp = (x: number) => Math.max(0, Math.min(worldWidth - 230, x));
  const rightError = Math.abs(clamp(rightX) + pawX - headX);
  const leftError = Math.abs(clamp(leftX) + 230 - pawX - headX);
  const facing = rightError <= leftError ? 'right' : 'left';
  const x = clamp(facing === 'right' ? rightX : leftX);
  return { x, y: Math.max(0, headY - pawY), facing } as const;
}
