export const STORY_GROUP_SIZE = 4;
// Keep this order stable: saved results unlock successive groups of four.
export const storyOrder = [
  'abeja-haragana', 'medias-flamencos', 'liebre-tortuga', 'leon-raton',
  'cigarra-hormiga', 'zorro-ciguena', 'raton-campo-ciudad', 'viento-sol',
  'semilla-impaciente', 'puente-amigos', 'farol-luciernaga', 'barrilete-colores',
] as const;
export type StoryId = typeof storyOrder[number];
type Results = Record<string, { completed: number } | undefined>;
export const STORY_GROUP_COUNT = Math.ceil(storyOrder.length / STORY_GROUP_SIZE);
export function storyIsCompleted(id: string, results: Results) {
  const completed = results[id]?.completed;
  return typeof completed === 'number' && Number.isFinite(completed) && completed >= 1;
}
export function libraryGroupCompleted(group: number, results: Results) {
  return storyOrder.slice(group * STORY_GROUP_SIZE, (group + 1) * STORY_GROUP_SIZE).filter(id => storyIsCompleted(id, results)).length;
}
export function libraryGroupUnlocked(group: number, results: Results) {
  if (!Number.isInteger(group) || group < 0 || group >= STORY_GROUP_COUNT) return false;
  return storyOrder.slice(0, group * STORY_GROUP_SIZE).every(id => storyIsCompleted(id, results));
}
export function unlockedLibraryGroups(results: Results) {
  let count = 1;
  while (count < STORY_GROUP_COUNT && libraryGroupUnlocked(count, results)) count += 1;
  return count;
}
export function isStoryUnlocked(id: string, results: Results) {
  const index = (storyOrder as readonly string[]).indexOf(id);
  return index >= 0 && libraryGroupUnlocked(Math.floor(index / STORY_GROUP_SIZE), results);
}
