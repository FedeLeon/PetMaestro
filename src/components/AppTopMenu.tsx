import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity } from 'react-native';
import { CoinBadge } from './CoinBadge';
import { HeaderBackButton } from './HeaderBackButton';
import { NeedsMeters } from './NeedsMeters';
import { SoundSettings } from './SoundSettings';
import { MenuFrame } from './MenuFrame';
import { useProgress } from '../context/ProgressContext';
import { styles } from '../styles/components/appTopMenu.styles';

type AppTopMenuProps = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  compact?: boolean;
  onBack?: () => void;
  backLabel?: string;
  backText?: string;
};

export function AppTopMenu({ icon, title, compact = false, onBack, backLabel, backText }: AppTopMenuProps) {
  const { progress, saveError, retrySave } = useProgress();

  return (
    <View style={styles.header}>
      <MenuFrame kind="top" />
      <View style={styles.row}>
        <HeaderBackButton onPress={onBack} label={backLabel} text={backText} />
        <View style={styles.titleGroup}>
          <MaterialCommunityIcons color="#26796e" name={icon} size={28} />
          <Text numberOfLines={1} style={styles.title}>{title}</Text>
        </View>
        <SoundSettings />
        <CoinBadge coins={progress.coins} />
      </View>
      {!compact && <NeedsMeters needs={progress.needs} />}
      {saveError ? <TouchableOpacity accessibilityRole="button" onPress={() => void retrySave()}><Text accessibilityLiveRegion="polite" style={styles.saveError}>No se pudo guardar. Tocá para reintentar.</Text></TouchableOpacity> : null}
    </View>
  );
}
