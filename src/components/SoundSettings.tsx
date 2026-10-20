import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useGameAudio } from '../context/AudioContext';
import { styles } from '../styles/components/soundSettings.styles';

export function SoundSettings() {
  const { preferences, toggle, playSound } = useGameAudio();
  const [visible, setVisible] = useState(false);
  return <>
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="Ajustes de sonido" onPress={() => { playSound('tap'); setVisible(true); }} style={styles.button}>
      <MaterialCommunityIcons name={Object.values(preferences).some(Boolean) ? 'volume-high' : 'volume-off'} color="#26796e" size={26} />
    </TouchableOpacity>
    <Modal transparent visible={visible} animationType="fade" onRequestClose={() => setVisible(false)} supportedOrientations={['landscape']}>
      <Pressable style={styles.backdrop} onPress={() => setVisible(false)}>
        <Pressable style={styles.card} accessibilityViewIsModal>
          <Text style={styles.title}>Sonido</Text>
          {([['music', 'Música'], ['effects', 'Efectos'], ['voice', 'Palabras y cuentos']] as const).map(([key, label]) => <View style={styles.row} key={key}>
            <Text style={styles.label}>{label}</Text>
            <Switch accessibilityLabel={label} value={preferences[key]} onValueChange={() => toggle(key)} trackColor={{ true: '#57b8a9', false: '#d5d5d5' }} />
          </View>)}
          <TouchableOpacity accessibilityRole="button" onPress={() => setVisible(false)} style={styles.close}><Text style={styles.closeText}>¡Listo!</Text></TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  </>;
}
