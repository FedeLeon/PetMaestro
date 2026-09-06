import { Asset } from 'expo-asset';
import { Image } from 'react-native';

// Keep compressed blobs for this session, rather than depending on HTTP cache
// headers. Do not keep every full-resolution bitmap mounted in the scene.
export async function cacheGameAsset(source: number, image: boolean): Promise<unknown> {
  const uri = Asset.fromModule(source).uri;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  let localUri: string | undefined;
  try {
    const response = await fetch(uri, { signal: controller.signal });
    if (!response.ok) throw new Error(`Asset HTTP ${response.status}`);
    localUri = URL.createObjectURL(await response.blob());
    if (image) await Image.prefetch(localUri);
    // Preserve shared references to Metro's image metadata.
    if (typeof source === 'object' && source !== null) {
      Object.assign(source, { uri: localUri });
      return source;
    }
    return image ? { uri: localUri } : localUri;
  } catch (error) {
    if (localUri) URL.revokeObjectURL(localUri);
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
