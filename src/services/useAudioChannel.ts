import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';

export function useAudioChannel(source: number | null) {
  const player = useAudioPlayer(source);
  const status = useAudioPlayerStatus(player);
  return { player, playing: status.playing };
}
