import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity } from 'react-native';
import { CoinBadge } from '../../components/CoinBadge';
import { HeaderBackButton } from '../../components/HeaderBackButton';
import { NeedsMeters } from '../../components/NeedsMeters';
import { SoundSettings } from '../../components/SoundSettings';
import { MenuFrame } from '../../components/MenuFrame';
import type { TopMenuViewProps } from '../types';
import { styles } from './appTopMenu.styles';

export function DesktopTopMenu({ icon, title, compact = false, onBack, backLabel, backText, needs, coins, saveError, onRetrySave }: TopMenuViewProps) {
  return <View testID="app-top-menu" style={styles.header}>
    <MenuFrame kind="top" />
    <View style={styles.row}>
      <HeaderBackButton onPress={onBack} label={backLabel} text={backText} />
      <View style={styles.titleGroup}>
        <MaterialCommunityIcons color="#26796e" name={icon} size={28} />
        <Text numberOfLines={1} style={styles.title}>{title}</Text>
      </View>
      {!compact && <NeedsMeters needs={needs} />}
      <SoundSettings />
      <CoinBadge coins={coins} />
    </View>
    {saveError ? <TouchableOpacity accessibilityRole="button" onPress={onRetrySave}><Text accessibilityLiveRegion="polite" style={styles.saveError}>No se pudo guardar. Tocá para reintentar.</Text></TouchableOpacity> : null}
  </View>;
}
