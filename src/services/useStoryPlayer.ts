import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useCallback, useState } from 'react';

export function useStoryPlayer(source: number | null) {
  const player = useAudioPlayer(source, { updateInterval: 250 });
  const status = useAudioPlayerStatus(player);
  const [failure, setFailure] = useState(false);
  const pause = useCallback(() => player.pause(), [player]);
  const seek = useCallback(async (seconds: number) => {
    try { await player.seekTo(Math.max(0, seconds)); } catch { setFailure(true); }
  }, [player]);
  const play = useCallback(async () => {
    try { setFailure(false); player.play(); } catch { setFailure(true); }
  }, [player]);
  const retry = useCallback(() => { setFailure(false); player.replace(source); }, [player, source]);
  return { playing: status.playing, loaded: status.isLoaded, currentTime: status.currentTime, duration: status.duration, error: failure || !!status.error, pause, seek, play, retry };
}
