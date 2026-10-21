import { usePresentation } from '../presentation/usePresentation';
import { useCallback, useRef, useState } from 'react';
import { AppState, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppTopMenu } from '../components/AppTopMenu';
import { AudioButton } from '../components/AudioButton';
import { WordDrawing } from '../components/WordDrawing';
import { useProgress } from '../context/ProgressContext';
import { useGameAudio } from '../context/AudioContext';
import { cityActivities } from '../data/adventureContent';
import { getWord } from '../data/gameContent';
import { styles } from '../styles/screens/adventure.styles';
import { RootStackParamList } from '../types';

export function CityActivityScreen({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'CityActivity'>) {
  const presentation = usePresentation();
  const { progress, recordAnswer, completeCity } = useProgress();
  const { playSound } = useGameAudio();
  const activity = cityActivities.find(entry => entry.id === route.params.activityId);
  const [step, setStep] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [wrong, setWrong] = useState<string[]>([]);
  const [reward, setReward] = useState<number | null>(null);
  const locked = useRef(false);
  const [accepted, setAccepted] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const live = useRef(false);
  useFocusEffect(useCallback(() => {
    live.current = AppState.currentState === 'active';
    locked.current = false; setAccepted(null);
    const stop = () => { if (timer.current) clearTimeout(timer.current); live.current = false; };
    const subscription = AppState.addEventListener('change', state => {
      if (state !== 'active') { stop(); locked.current = false; setAccepted(null); }
      else live.current = true;
    });
    return () => { stop(); subscription.remove(); };
  }, []));
  if (!activity || !progress.completedLevels.includes(11)) return <View style={styles.screen}><AppTopMenu compact icon="lock" title="Completá el nivel 11 para entrar" /></View>;
  const task = activity.tasks[Math.min(step, activity.tasks.length - 1)];
  const answer = async (id: string) => {
    if (!live.current || locked.current || wrong.includes(id)) return;
    const correct = id === task.answer;
    void recordAnswer(task.answer, correct);
    if (!correct) { setWrong(previous => [...previous, id]); setFeedback('Probá otro dibujo. ¡Vos podés!'); playSound('retry'); return; }
    locked.current = true;
    setAccepted(id); setFeedback('¡Muy bien! Ese es el dibujo.');
    playSound('correct');
    timer.current = setTimeout(async () => {
      if (!live.current) return;
      if (step + 1 === activity.tasks.length) {
        const coins = await completeCity(activity.id);
        if (live.current) setReward(coins);
      } else { setStep(step + 1); setWrong([]); setAccepted(null); setFeedback('¡Gracias! Vamos con el siguiente.'); locked.current = false; }
    }, 550);
  };
  return <View style={styles.screen}>
    <AppTopMenu compact icon={activity.icon} title={activity.name} />
    {reward !== null ? <View style={styles.result}><Text style={styles.title}>¡Ayudaste a tus amigos de la ciudad!</Text><Text style={styles.text}>{reward ? `Ganaste ${reward} monedas` : '¡Gracias por volver a ayudar! Premio de este lugar ya recibido.'}</Text><TouchableOpacity accessibilityRole="button" style={styles.button} onPress={() => navigation.navigate('CityMap')}><Text style={styles.buttonText}>Volver a Ciudad Gatuna</Text></TouchableOpacity></View> : <View style={presentation.styles.gameBody}>
      <View style={presentation.styles.gameHeader}><View><Text style={styles.title}>{task.phrase}</Text><Text style={styles.text}>{task.translation} · {step + 1}/3</Text></View><AudioButton word={getWord(task.answer)} /></View>
      <View style={styles.cityChoices}>{task.options.map(id => <TouchableOpacity key={id} accessibilityRole="button" accessibilityLabel={`Entregar ${getWord(id).spanish}`} aria-pressed={accepted === id} disabled={accepted !== null || wrong.includes(id)} onPress={() => void answer(id)} style={[styles.cityChoice, wrong.includes(id) && styles.disabled, accepted === id && styles.cityAccepted]}><View style={styles.cityDrawing}><WordDrawing word={getWord(id)} bare /></View><Text style={styles.text}>{accepted === id ? '✓ ' : ''}{getWord(id).spanish}</Text></TouchableOpacity>)}</View>
      <Text accessibilityLiveRegion="polite" style={styles.small}>{feedback || activity.welcome}</Text>
    </View>}
  </View>;
}
