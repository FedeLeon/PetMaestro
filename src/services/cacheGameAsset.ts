import { Asset } from 'expo-asset';

export async function cacheGameAsset(source: number, _image: boolean): Promise<unknown> {
  // In Android releases, embedded drawables are already marked as downloaded.
  // Keep their numeric module source; do not probe every image through getSize
  // or convert Android resource names into URLs during startup.
  await Asset.fromModule(source).downloadAsync();
  return source;
}
