import { Asset } from 'expo-asset';
import { useEffect, useMemo, useState } from 'react';

type Source = number | string | { uri: string } | null;
const uri = (source: Source) => source === null ? '' : typeof source === 'string' ? source : typeof source === 'object' ? source.uri : Asset.fromModule(source).uri;

// SDK 57's web player discards HTMLMediaElement.play()'s promise. Handle browser
// autoplay restrictions and cancelled pending plays here, without global error
// listeners or touching the native player's private fields.
export function useAudioChannel(source: number | null) {
  const media = useMemo(() => new Audio(uri(source)), [source]);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const start = () => setPlaying(true);
    const stop = () => setPlaying(false);
    media.addEventListener('playing', start);
    media.addEventListener('pause', stop);
    media.addEventListener('ended', stop);
    media.addEventListener('error', stop);
    return () => {
      media.pause();
      media.removeEventListener('playing', start);
      media.removeEventListener('pause', stop);
      media.removeEventListener('ended', stop);
      media.removeEventListener('error', stop);
      media.removeAttribute('src');
      media.load();
    };
  }, [media]);
  const player = useMemo(() => ({
    play: () => { if (media.getAttribute('src')) void media.play().catch(() => setPlaying(false)); },
    pause: () => media.pause(),
    replace: (next: Source) => { media.pause(); media.src = uri(next); media.load(); },
    get loop() { return media.loop; },
    set loop(value: boolean) { media.loop = value; },
    get volume() { return media.volume; },
    set volume(value: number) { media.volume = value; },
  }), [media]);
  return { player, playing };
}
