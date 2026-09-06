import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as images from './assetImages';
import { gardenImages, thirstyGardenImages } from './gardenContent';
import { kitchenFoods, kitchenImages } from './kitchenContent';
import { wordAudio } from './audioAssets';
import { cacheGameAsset } from '../services/cacheGameAsset';

type Task = { source: number; image: boolean; assign: (value: unknown) => void };
const tasks: Task[] = [];
function collect(group: object, image = true) {
  for (const [key, value] of Object.entries(group)) {
    if (value && typeof value === 'object' && !('uri' in value)) collect(value, image);
    else tasks.push({ source: value, image, assign: next => { (group as Record<string, unknown>)[key] = next; } });
  }
}
Object.values(images).forEach(group => collect(group));
collect(gardenImages);
collect(thirstyGardenImages);
collect(kitchenImages);
kitchenFoods.forEach(food => tasks.push({ source: food.image, image: true, assign: next => { (food as unknown as Record<string, unknown>).image = next; } }));
collect(wordAudio, false);

const completed = new Set<Task>();
let fontsReady = false;
let running: Promise<void> | undefined;
export const gameAssetCount = tasks.length + 1;

function withTimeout<T>(job: Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Tiempo de carga agotado.')), 45000);
    job.then(value => { clearTimeout(timer); resolve(value); }, error => { clearTimeout(timer); reject(error); });
  });
}

export function preloadGameAssets(onProgress: (loaded: number, total: number) => void): Promise<void> {
  if (running) return running;
  const report = () => onProgress(completed.size + Number(fontsReady), gameAssetCount);
  report();
  running = (async () => {
    const pending = tasks.filter(task => !completed.has(task));
    let index = 0;
    const errors: unknown[] = [];
    const cache = new Map<number, Promise<unknown>>();
    const worker = async () => {
      while (index < pending.length) {
        const task = pending[index++];
        try {
          let job = cache.get(task.source);
          if (!job) { job = withTimeout(cacheGameAsset(task.source, task.image)); cache.set(task.source, job); }
          const result = await job;
          task.assign(result);
          completed.add(task);
          report();
        } catch (error) { errors.push(error); }
      }
    };
    await Promise.all([
      ...Array.from({ length: 6 }, worker),
      (async () => {
        try {
          if (!fontsReady) await withTimeout(Font.loadAsync(MaterialCommunityIcons.font));
          fontsReady = true; report();
        } catch (error) { errors.push(error); }
      })(),
    ]);
    if (errors.length) throw new Error(`No se pudieron cargar ${errors.length} recursos.`);
  })().finally(() => { running = undefined; });
  return running;
}
