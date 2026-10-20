import { Asset } from 'expo-asset';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export function useStoryPlayer(source: number | string | null) {
  const media = useMemo(() => source === null ? null : new Audio(typeof source === 'string' ? source : Asset.fromModule(source).uri), [source]);
  const [status, setStatus] = useState({ playing: false, loaded: false, currentTime: 0, duration: 0, error: false });
  const alive = useRef(true);
  useEffect(() => {
    if (!media) return;
    alive.current = true;
    let mounted = true;
    const update = () => { if (mounted) setStatus({ playing: !media.paused && !media.ended, loaded: media.readyState >= 2, currentTime: media.currentTime || 0, duration: Number.isFinite(media.duration) ? media.duration : 0, error: !!media.error }); };
    const hide = () => { if (document.hidden) media.pause(); };
    const events = ['loadedmetadata', 'canplay', 'playing', 'pause', 'timeupdate', 'seeked', 'ended', 'error'];
    events.forEach(event => media.addEventListener(event, update));
    document.addEventListener('visibilitychange', hide);
    update();
    return () => {
      mounted = false; alive.current = false; media.pause();
      events.forEach(event => media.removeEventListener(event, update));
      document.removeEventListener('visibilitychange', hide);
      media.removeAttribute('src'); media.load();
    };
  }, [media]);
  const pause = useCallback(() => media?.pause(), [media]);
  const seek = useCallback(async (seconds: number) => { if (media) media.currentTime = Math.max(0, Math.min(seconds, Number.isFinite(media.duration) ? media.duration : seconds)); }, [media]);
  const play = useCallback(async () => {
    try { await media?.play(); }
    catch (error) { if (alive.current) setStatus(current => ({ ...current, error: !(error instanceof DOMException && error.name === 'AbortError'), playing: false })); }
  }, [media]);
  const retry = useCallback(() => { setStatus(current => ({ ...current, error: false, loaded: false })); media?.load(); }, [media]);
  return { ...status, pause, seek, play, retry };
}
