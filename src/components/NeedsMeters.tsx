import { Image, StyleSheet, Text, View } from 'react-native';
import { needsImages } from '../data/assetImages';
import { PetNeeds } from '../types';

type NeedsMetersProps = {
  needs: PetNeeds;
};

const meters: Array<{ key: keyof PetNeeds; label: string; color: string; image: number }> = [
  { key: 'hunger', label: 'Hambre', color: '#f3a72f', image: needsImages.hunger },
  { key: 'hygiene', label: 'Higiene', color: '#41b9d1', image: needsImages.hygiene },
  { key: 'bathroom', label: 'Baño', color: '#9b78d8', image: needsImages.bathroom },
  { key: 'play', label: 'Juego', color: '#ec6b63', image: needsImages.play },
  { key: 'energy', label: 'Energía', color: '#8dbd3f', image: needsImages.energy },
];

export function NeedsMeters({ needs }: NeedsMetersProps) {
  return (
    <View accessibilityLabel="Necesidades del gatito" style={styles.container}>
      {meters.map((meter) => {
        const value = Math.max(0, Math.min(100, needs[meter.key]));

        return (
          <View accessibilityLabel={`${meter.label}: ${value}%`} key={meter.key} style={styles.meter}>
            <Image resizeMode="contain" source={meter.image} style={styles.icon} />
            <View style={styles.track}>
              <View style={[styles.fill, { backgroundColor: meter.color, width: `${value}%` }]} />
            </View>
            <Text style={styles.value}>{value}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 2,
    marginTop: 2,
    width: '100%',
  },
  fill: {
    borderRadius: 4,
    height: '100%',
  },
  icon: {
    height: 36,
    width: 36,
  },
  meter: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    gap: 2,
  },
  track: {
    backgroundColor: '#eadfce',
    borderRadius: 4,
    height: 8,
    overflow: 'hidden',
    flex: 1,
    minWidth: 12,
  },
  value: {
    color: '#6c5a42',
    fontSize: 8,
    fontWeight: '900',
    width: 18,
  },
});
