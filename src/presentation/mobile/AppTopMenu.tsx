import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { CoinBadge } from '../../components/CoinBadge';
import { HeaderBackButton } from '../../components/HeaderBackButton';
import { NeedsMeters } from '../../components/NeedsMeters';
import { SoundSettings } from '../../components/SoundSettings';
import type { TopMenuViewProps } from '../types';
import { styles } from './appTopMenu.styles';

export function MobileTopMenu({ icon, title, compact = false, scene = false, onBack, backLabel, needs, coins, saveError, onRetrySave, immersive, activity }: TopMenuViewProps) {
  if (activity?.hideHud) return null;
  return <>
    {!scene && !immersive && <View style={styles.clearance} />}
    <View testID="floating-hud" pointerEvents="box-none" style={styles.floating}>
      <View pointerEvents="box-none" style={styles.floatingRow}>
        <View style={styles.backPill}><HeaderBackButton onPress={activity?.exit ?? onBack} label={backLabel} /></View>
        {!immersive && <>
          {!scene && <View style={styles.titlePill}><MaterialCommunityIcons color="#26796e" name={icon} size={22} /><Text numberOfLines={1} style={styles.floatingTitle}>{title}</Text></View>}
          {(!compact || scene) && <View style={styles.needsPill}><NeedsMeters needs={needs} /></View>}
          <View style={styles.actions}><SoundSettings /><CoinBadge coins={coins} /></View>
        </>}
      </View>
      {saveError && <TouchableOpacity accessibilityRole="button" accessibilityLabel="Reintentar guardar" onPress={onRetrySave} style={styles.errorPill}><Text accessibilityLiveRegion="polite" style={styles.saveError}>No se pudo guardar. Tocá para reintentar.</Text></TouchableOpacity>}
    </View>
  </>;
}
