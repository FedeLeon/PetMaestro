import { Asset } from 'expo-asset';
import { Image } from 'react-native';

export async function cacheGameAsset(source: number, image: boolean): Promise<unknown> {
  const asset = await Asset.fromModule(source).downloadAsync();
  if (image) {
    // Read local images too, so native's image pipeline has their encoded data.
    await Image.getSize(asset.localUri ?? asset.uri);
  }
  return source;
}
