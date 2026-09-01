import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import { CoinBadge } from './CoinBadge';
import { HeaderBackButton } from './HeaderBackButton';
import { NeedsMeters } from './NeedsMeters';
import { useProgress } from '../context/ProgressContext';
import { styles } from '../styles/components/appTopMenu.styles';

type AppTopMenuProps = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
};

export function AppTopMenu({ icon, title }: AppTopMenuProps) {
  const { progress } = useProgress();

  return (
    <View style={styles.header}>
      <View style={styles.row}>
        <HeaderBackButton />
        <View style={styles.titleGroup}>
          <MaterialCommunityIcons color="#26796e" name={icon} size={28} />
          <Text numberOfLines={1} style={styles.title}>{title}</Text>
        </View>
        <CoinBadge coins={progress.coins} />
      </View>
      <NeedsMeters needs={progress.needs} />
    </View>
  );
}
