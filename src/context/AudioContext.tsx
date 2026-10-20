import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAudioModeAsync } from 'expo-audio';
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { wordAudio } from '../data/audioAssets';
import { gameSounds, musicTracks } from '../data/gameAudio';
import { useAudioChannel } from '../services/useAudioChannel';

type Preferences = { music: boolean; effects: boolean; voice: boolean };
type Sound = keyof typeof gameSounds;
type Mood = keyof typeof musicTracks;
type AudioContextValue = {
  preferences: Preferences;
  toggle: (key: keyof Preferences) => void;
  playSound: (sound: Sound) => void;
  speak: (wordId: string) => void;
  changeScene: (route: string) => void;
  setNarrationActive: (active: boolean) => void;
};
const AudioContext = createContext<AudioContextValue | null>(null);
const STORAGE_KEY = 'petmaestro.audio.v1';
const defaults: Preferences = { music: true, effects: true, voice: true };

export function AudioProvider({ children }: PropsWithChildren) {
  const [preferences, setPreferences] = useState(defaults);
  const preferencesRef = useRef(preferences);
  const writeQueue = useRef(Promise.resolve());
  const [ready, setReady] = useState(false);
  const [engaged, setEngaged] = useState(false);
  const [active, setActive] = useState(AppState.currentState === 'active');
  const [mood, setMood] = useState<Mood>('adventure');
  const [narrationActive, setNarrationActive] = useState(false);
  const narrationRef = useRef(narrationActive);
  narrationRef.current = narrationActive;
  const { player: music } = useAudioChannel(musicTracks[mood]);
  const { player: effects } = useAudioChannel(null);
  const { player: voice, playing: voicePlaying } = useAudioChannel(null);

  useEffect(() => {
    let mounted = true;
    void setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: false, interruptionMode: 'mixWithOthers' }).catch(() => {});
    AsyncStorage.getItem(STORAGE_KEY).then(raw => {
      if (!raw || !mounted) return;
      const stored = JSON.parse(raw) as Partial<Preferences>;
      const next = { ...defaults };
      for (const key of Object.keys(defaults) as (keyof Preferences)[]) {
        if (typeof stored?.[key] === 'boolean') next[key] = stored[key];
      }
      preferencesRef.current = next;
      setPreferences(next);
    }).catch(() => {}).finally(() => { if (mounted) setReady(true); });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      setActive(state === 'active');
      if (state !== 'active') { music.pause(); effects.pause(); voice.pause(); }
    });
    return () => subscription.remove();
  }, [music, effects, voice]);

  useEffect(() => {
    music.loop = true;
    music.volume = voicePlaying ? .035 : .18;
    if (ready && engaged && active && preferences.music && !narrationActive) music.play();
    else music.pause();
  }, [music, ready, engaged, active, preferences.music, voicePlaying, narrationActive]);

  useEffect(() => { if (narrationActive) { voice.pause(); effects.pause(); } }, [narrationActive, voice, effects]);

  const playSound = useCallback((sound: Sound) => {
    setEngaged(true);
    // This also unlocks music from the first user gesture in browsers.
    if (ready && active && preferencesRef.current.music && !narrationRef.current) music.play();
    if (!ready || !active || !preferencesRef.current.effects) return;
    effects.volume = .5;
    effects.pause();
    effects.replace(gameSounds[sound]);
    effects.play();
  }, [active, ready, effects, music]);

  const speak = useCallback((wordId: string) => {
    setEngaged(true);
    if (!ready || !active || !preferencesRef.current.voice || !wordAudio[wordId]) return;
    effects.pause();
    music.volume = .035;
    voice.pause();
    voice.replace(wordAudio[wordId]);
    voice.volume = 1;
    voice.play();
  }, [active, ready, voice, effects, music]);

  const toggle = (key: keyof Preferences) => {
    if (!ready) return;
    const next = { ...preferencesRef.current, [key]: !preferencesRef.current[key] };
    preferencesRef.current = next;
    setPreferences(next);
    setEngaged(true);
    if (!next.voice) voice.pause();
    if (!next.effects) effects.pause();
    if (!next.music) music.pause();
    else if (active && !narrationRef.current) music.play();
    writeQueue.current = writeQueue.current.catch(() => {}).then(() => AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)));
    void writeQueue.current.catch(() => {});
  };

  const changeScene = useCallback((route: string) => {
    voice.pause();
    setMood(['House', 'Pet', 'Drawing', 'Album', 'Toys', 'ToyGame', 'Library', 'Audiobook'].includes(route) ? 'home' : 'adventure');
  }, [voice]);

  return <AudioContext.Provider value={{ preferences, toggle, playSound, speak, changeScene, setNarrationActive }}>{children}</AudioContext.Provider>;
}

export function useGameAudio() {
  const context = useContext(AudioContext);
  if (!context) throw new Error('useGameAudio must be used inside AudioProvider');
  return context;
}
